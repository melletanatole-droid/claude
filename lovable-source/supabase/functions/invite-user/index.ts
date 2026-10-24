// Supabase Edge Function — invites a new user (or attaches a role to an existing one).
// Requires an admin caller. Sends the invite email via Supabase Auth (needs SMTP
// configured on the project — see Supabase → Authentication → Email settings).
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
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

    const { email, role } = await req.json();
    const cleanEmail = String(email ?? "").trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cleanEmail)) {
      return json({ error: "Adresse email invalide." }, 400);
    }
    if (role !== "admin" && role !== "author") {
      return json({ error: "Rôle invalide." }, 400);
    }

    const { data: existingProfile, error: profileError } = await admin
      .from("profiles")
      .select("id")
      .eq("email", cleanEmail)
      .maybeSingle();
    if (profileError) throw profileError;

    let userId = existingProfile?.id as string | undefined;
    let invited = false;

    if (!userId) {
      const { data: invite, error: inviteError } = await admin.auth.admin.inviteUserByEmail(cleanEmail);
      if (inviteError) throw inviteError;
      userId = invite.user.id;
      invited = true;
    }

    const { error: roleError } = await admin
      .from("user_roles")
      .upsert({ user_id: userId, role }, { onConflict: "user_id,role", ignoreDuplicates: true });
    if (roleError) throw roleError;

    return json({ invited, userId, role });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue.";
    return json({ error: message }, 500);
  }
});
