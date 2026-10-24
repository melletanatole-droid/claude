import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";

const ROLE_LABELS: Record<string, string> = { admin: "Admin", author: "Auteur" };

export function AdminTeam() {
  const qc = useQueryClient();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "author">("author");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { data: team } = useQuery({
    queryKey: ["team-roles"],
    queryFn: async () => {
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("id, user_id, role, created_at")
        .order("created_at", { ascending: false });
      if (rolesError) throw rolesError;

      const ids = [...new Set((roles ?? []).map((r) => r.user_id))];
      if (ids.length === 0) return [];

      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, email, display_name")
        .in("id", ids);
      if (profilesError) throw profilesError;

      const byId = new Map((profiles ?? []).map((p) => [p.id, p]));
      return (roles ?? []).map((r) => ({
        ...r,
        email: byId.get(r.user_id)?.email ?? "?",
        display_name: byId.get(r.user_id)?.display_name ?? null,
      }));
    },
  });

  const invite = useMutation({
    mutationFn: async () => {
      const { data, error: inviteError } = await supabase.functions.invoke("invite-user", {
        body: { email: email.trim(), role },
      });
      if (inviteError) throw inviteError;
      if (data?.error) throw new Error(data.error);
      return data as { invited: boolean };
    },
    onSuccess: (data) => {
      setError("");
      setMessage(
        data.invited
          ? `Invitation envoyée à ${email.trim()}.`
          : `Rôle « ${ROLE_LABELS[role]} » attribué à ${email.trim()}.`,
      );
      setEmail("");
      qc.invalidateQueries({ queryKey: ["team-roles"] });
    },
    onError: (e: unknown) => {
      setMessage("");
      setError(e instanceof Error ? e.message : "Invitation impossible");
    },
  });

  const revoke = useMutation({
    mutationFn: async (id: string) => {
      const { error: revokeError } = await supabase.from("user_roles").delete().eq("id", id);
      if (revokeError) throw revokeError;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["team-roles"] }),
  });

  return (
    <section className="mt-12 rounded-[2rem] border-2 border-ink bg-card p-6 chip-shadow md:p-8">
      <h2 className="font-display text-2xl">Gérer les accès</h2>
      <p className="mt-2 text-sm text-[var(--ink)]/70">
        Invite un compte par email et attribue-lui un rôle. Un « auteur » peut écrire des
        articles et des newsletters ; un « admin » peut en plus les envoyer, gérer les accès et
        voir les analytics.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!email.trim() || invite.isPending) return;
          invite.mutate();
        }}
        className="mt-5 flex flex-wrap gap-3"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@exemple.fr"
          className="min-w-[220px] flex-1 rounded-xl border-2 border-ink bg-background px-4 py-3 text-sm outline-none"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "admin" | "author")}
          className="rounded-xl border-2 border-ink bg-background px-4 py-3 text-sm outline-none"
        >
          <option value="author">Auteur</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          disabled={invite.isPending}
          className="rounded-full border-2 border-ink bg-[var(--pink)] px-6 py-3 font-semibold text-white chip-shadow transition hover:-translate-y-0.5 disabled:opacity-50"
        >
          {invite.isPending ? "…" : "Inviter"}
        </button>
      </form>
      {message && <p className="mt-3 text-sm font-medium text-[var(--blue)]">{message}</p>}
      {error && <p className="mt-3 text-sm font-medium text-[var(--pink)]">{error}</p>}

      <div className="mt-6 space-y-2 text-sm">
        {(team ?? []).length === 0 && (
          <p className="text-[var(--ink)]/60">Personne d&apos;autre pour l&apos;instant.</p>
        )}
        {(team ?? []).map((t) => (
          <div
            key={t.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink/15 bg-background px-4 py-2"
          >
            <div>
              <span className="font-medium">{t.display_name || t.email}</span>{" "}
              {t.display_name && <span className="text-[var(--ink)]/50">{t.email}</span>}
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border-2 border-ink bg-[var(--yellow)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                {ROLE_LABELS[t.role] ?? t.role}
              </span>
              <button
                onClick={() => revoke.mutate(t.id)}
                className="text-xs font-semibold text-[var(--pink)] hover:underline"
              >
                Retirer
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
