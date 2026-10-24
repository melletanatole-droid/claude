import { createServerFn } from "@tanstack/react-start";

const TRACK_LABELS: Record<string, string> = {
  pratique: "Fiche pratique IA",
  demain: "La médecine de demain",
  actu: "Actualité IA",
};

/**
 * Inscrit un email à la newsletter puis envoie l'email de bienvenue.
 * L'insertion se fait côté serveur : l'email ne part que si l'inscription est
 * nouvelle, donc l'endpoint ne peut pas servir à écrire à n'importe qui en boucle.
 */
export const subscribeToNewsletter = createServerFn({ method: "POST" })
  .inputValidator((input: { email: string; tracks: string[] }) => {
    const email = String(input?.email ?? "")
      .trim()
      .toLowerCase()
      .slice(0, 254);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("Email invalide.");
    // Liste blanche : seules les clés connues passent, rien n'est recopié tel quel dans l'email.
    const requested = Array.isArray(input?.tracks) ? input.tracks.map(String) : [];
    const tracks = Object.keys(TRACK_LABELS).filter((t) => requested.includes(t));
    if (tracks.length === 0) throw new Error("Aucune newsletter sélectionnée.");
    return { email, tracks };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error: insertError } = await supabaseAdmin
      .from("newsletter_subscribers")
      .insert({ email: data.email, tracks: data.tracks });

    if (insertError) {
      // Déjà inscrit : même réponse qu'une inscription, sans renvoyer d'email.
      if (insertError.code === "23505") return { ok: true as const };
      console.error("Newsletter insert failed", insertError.code, insertError.message);
      return { ok: false as const, error: "insert_failed" };
    }

    const apiKey = process.env["RESEND_API_KEY"];
    if (!apiKey) {
      console.error("Newsletter welcome email skipped: RESEND_API_KEY missing");
      return { ok: true as const };
    }

    const from = process.env["NEWSLETTER_FROM"] ?? "Medicilline <newsletter@medicilline.ai>";
    const items = data.tracks.map((t) => `<li>${TRACK_LABELS[t]}</li>`).join("");

    const html = `<!doctype html><html><body style="font-family:sans-serif;color:#1a1a1a;max-width:600px;margin:0 auto;padding:24px;">
      <h1 style="font-size:22px;">Bienvenue chez Medicilline</h1>
      <p>Votre inscription est confirmée. Vous recevrez :</p>
      <ul>${items}</ul>
      <p>À très vite pour l'actualité de l'IA médicale, expliquée simplement.</p>
      <hr style="margin-top:32px;border:none;border-top:1px solid #ddd;" />
      <p style="font-size:12px;color:#888;">Vous recevez cet email car vous venez de vous inscrire sur medicilline.ai.</p>
    </body></html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [data.email],
        subject: "Bienvenue — votre newsletter Medicilline est active",
        html,
      }),
    });

    if (!res.ok) {
      // L'inscription est enregistrée : on ne la fait pas échouer pour un email raté.
      console.error("Resend welcome email failed", res.status, await res.text());
    }
    return { ok: true as const };
  });
