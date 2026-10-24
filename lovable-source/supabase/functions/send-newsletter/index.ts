// Supabase Edge Function — sends a newsletter_issues row to matching subscribers via Resend.
// Requires the RESEND_API_KEY secret to be set on the project (Supabase → Edge Functions → Secrets).
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FROM_ADDRESS = Deno.env.get("NEWSLETTER_FROM") ?? "Medicilline <newsletter@medicilline.ai>";
const RESEND_ENDPOINT = "https://api.resend.com/emails/batch";
const BATCH_SIZE = 100;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function renderHtml(subject: string, content: string) {
  const paragraphs = content
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 16px;white-space:pre-line;">${p}</p>`)
    .join("");
  return `<!doctype html><html><body style="font-family:sans-serif;color:#1a1a1a;max-width:600px;margin:0 auto;padding:24px;">
    <h1 style="font-size:22px;">${subject}</h1>
    ${paragraphs}
    <hr style="margin-top:32px;border:none;border-top:1px solid #ddd;" />
    <p style="font-size:12px;color:#888;">Vous recevez cet email car vous êtes inscrit·e à la newsletter Medicilline.</p>
  </body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userError } = await callerClient.auth.getUser();
    if (userError || !userData.user) return json({ error: "Non authentifié." }, 401);

    const admin = createClient(supabaseUrl, serviceRoleKey);

    const { data: hasAdminRole } = await admin.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (!hasAdminRole) return json({ error: "Réservé aux administrateurs." }, 403);

    const { issueId } = await req.json();
    if (!issueId) return json({ error: "issueId manquant." }, 400);

    const { data: issue, error: issueError } = await admin
      .from("newsletter_issues")
      .select("id, subject, content, track, status")
      .eq("id", issueId)
      .maybeSingle();
    if (issueError) throw issueError;
    if (!issue) return json({ error: "Newsletter introuvable." }, 404);
    if (issue.status === "sent") return json({ error: "Cette newsletter a déjà été envoyée." }, 400);

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      return json(
        {
          error:
            "RESEND_API_KEY n'est pas configurée. Ajoute ce secret dans les paramètres du projet Supabase pour activer l'envoi.",
        },
        500,
      );
    }

    let subscribersQuery = admin.from("newsletter_subscribers").select("email");
    if (issue.track !== "all") {
      subscribersQuery = subscribersQuery.contains("tracks", [issue.track]);
    }
    const { data: subscribers, error: subsError } = await subscribersQuery;
    if (subsError) throw subsError;

    const emails = (subscribers ?? []).map((s) => s.email);
    if (emails.length === 0) {
      await admin
        .from("newsletter_issues")
        .update({ status: "sent", sent_at: new Date().toISOString(), recipient_count: 0 })
        .eq("id", issueId);
      return json({ recipient_count: 0, warning: "Aucun abonné pour ce segment." });
    }

    const html = renderHtml(issue.subject, issue.content);
    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const chunk = emails.slice(i, i + BATCH_SIZE);
      const res = await fetch(RESEND_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          chunk.map((to) => ({
            from: FROM_ADDRESS,
            to: [to],
            subject: issue.subject,
            html,
          })),
        ),
      });
      if (!res.ok) {
        const detail = await res.text();
        throw new Error(`Échec Resend (${res.status}): ${detail}`);
      }
    }

    const { error: updateError } = await admin
      .from("newsletter_issues")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        recipient_count: emails.length,
      })
      .eq("id", issueId);
    if (updateError) throw updateError;

    return json({ recipient_count: emails.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue.";
    return json({ error: message }, 500);
  }
});
