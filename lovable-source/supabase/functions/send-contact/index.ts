// Supabase Edge Function — sends the "Rejoignez-nous" contact form to contact@medicilline.ai via Resend.
// Requires the RESEND_API_KEY secret to be set on the project (Supabase → Edge Functions → Secrets).
// Anti-abuse: honeypot field + per-IP rate limiting backed by public.contact_submissions,
// so a bot can't hammer this endpoint and rack up Resend costs.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TO_ADDRESS = "contact@medicilline.ai";
const FROM_ADDRESS = Deno.env.get("CONTACT_FROM") ?? "Medicilline <contact@medicilline.ai>";
const RESEND_ENDPOINT = "https://api.resend.com/emails";

const MAX_PER_HOUR = 5;
const COOLDOWN_SECONDS = 30;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { profile, name, email, message, website } = await req.json();

    // Honeypot: a hidden field real users never fill. Bots that auto-fill every
    // field trip it — pretend success without sending anything or touching the DB.
    if (String(website ?? "").trim() !== "") {
      return json({ sent: true });
    }

    const cleanName = String(name ?? "").trim().slice(0, 200);
    const cleanEmail = String(email ?? "").trim().toLowerCase().slice(0, 200);
    const cleanProfile = String(profile ?? "Autre").trim().slice(0, 100);
    const cleanMessage = String(message ?? "").trim().slice(0, 5000);

    if (!cleanName) return json({ error: "Nom manquant." }, 400);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cleanEmail)) {
      return json({ error: "Adresse email invalide." }, 400);
    }
    if (!cleanMessage) return json({ error: "Message manquant." }, 400);

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      return json(
        { error: "RESEND_API_KEY n'est pas configurée sur le projet Supabase." },
        500,
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceRoleKey);

    const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recent, error: recentError } = await admin
      .from("contact_submissions")
      .select("created_at")
      .eq("ip", ip)
      .gte("created_at", hourAgo)
      .order("created_at", { ascending: false });
    if (recentError) throw recentError;

    if ((recent?.length ?? 0) > 0) {
      const lastSubmission = new Date(recent[0].created_at).getTime();
      if (Date.now() - lastSubmission < COOLDOWN_SECONDS * 1000) {
        return json({ error: "Merci de patienter avant de renvoyer un message." }, 429);
      }
    }
    if ((recent?.length ?? 0) >= MAX_PER_HOUR) {
      return json({ error: "Trop de messages envoyés. Réessaie plus tard." }, 429);
    }

    // Record the attempt before calling Resend so a retry storm still gets capped
    // even if the Resend call itself fails.
    const { error: insertError } = await admin
      .from("contact_submissions")
      .insert({ ip, email: cleanEmail });
    if (insertError) throw insertError;

    const subject = `${cleanProfile} — ${cleanName}`;
    const html = `<!doctype html><html><body style="font-family:sans-serif;color:#1a1a1a;max-width:600px;margin:0 auto;padding:24px;">
      <h1 style="font-size:20px;">Nouveau message — ${escapeHtml(cleanProfile)}</h1>
      <p><strong>Nom :</strong> ${escapeHtml(cleanName)}</p>
      <p><strong>Email :</strong> ${escapeHtml(cleanEmail)}</p>
      <hr style="margin:16px 0;border:none;border-top:1px solid #ddd;" />
      <p style="white-space:pre-line;">${escapeHtml(cleanMessage)}</p>
    </body></html>`;

    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [TO_ADDRESS],
        reply_to: cleanEmail,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      throw new Error(`Échec Resend (${res.status}): ${detail}`);
    }

    return json({ sent: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue.";
    return json({ error: message }, 500);
  }
});
