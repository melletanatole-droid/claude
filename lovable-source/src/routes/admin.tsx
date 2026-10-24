import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { slugify, useAuth } from "@/lib/auth";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { AdminTeam } from "@/components/admin-team";
import { AdminAnalytics } from "@/components/admin-analytics";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Rédaction — Medicilline" },
      {
        name: "description",
        content: "Rédiger et publier les articles du blog IA médicale de Medicilline.",
      },
      { property: "og:title", content: "Rédaction — Medicilline" },
      {
        property: "og:description",
        content: "Rédiger et publier les articles du blog Medicilline.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Draft = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_url: string;
  category: string;
  published: boolean;
};

const EMPTY: Draft = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_url: "",
  category: "ia-medicale",
  published: false,
};

type NewsletterDraft = {
  id?: string;
  subject: string;
  content: string;
  track: string;
};

const EMPTY_NEWSLETTER: NewsletterDraft = {
  subject: "",
  content: "",
  track: "all",
};

const NEWSLETTER_TRACK_LABELS: Record<string, string> = {
  all: "Toutes les newsletters",
  pratique: "Fiche pratique IA",
  demain: "La médecine de demain",
  actu: "Actualité IA",
};

function AdminPage() {
  const navigate = useNavigate();
  const { session, loading, canWrite, isAdmin, signOut, user } = useAuth();
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [error, setError] = useState("");
  const [newsletterDraft, setNewsletterDraft] = useState<NewsletterDraft>(EMPTY_NEWSLETTER);
  const [newsletterError, setNewsletterError] = useState("");
  const [sendingId, setSendingId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/auth" });
  }, [loading, session, navigate]);

  const { data: posts } = useQuery({
    queryKey: ["posts", "mine"],
    enabled: !!session,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, slug, excerpt, content, cover_url, category, published, published_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const save = useMutation({
    mutationFn: async (d: Draft) => {
      if (!user) throw new Error("Session expirée");
      const slug = d.slug.trim() || slugify(d.title);
      const payload = {
        title: d.title.trim(),
        slug,
        excerpt: d.excerpt.trim(),
        content: d.content,
        cover_url: d.cover_url.trim() || null,
        category: d.category,
        published: d.published,
        published_at: d.published ? new Date().toISOString() : null,
      };
      if (d.id) {
        const { error } = await supabase.from("posts").update(payload).eq("id", d.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("posts")
          .insert({ ...payload, author_id: user.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      setDraft(EMPTY);
      setError("");
      qc.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (e: unknown) => {
      const msg = e instanceof Error ? e.message : "Enregistrement impossible";
      setError(
        msg.includes("duplicate") || msg.includes("23505")
          ? "Cette URL d'article existe déjà."
          : msg.includes("row-level security")
            ? "Ton compte n'a pas encore le droit de publier."
            : msg,
      );
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });

  const { data: subscribers } = useQuery({
    queryKey: ["subscribers"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .select("id, email, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: newsletters } = useQuery({
    queryKey: ["newsletters", "mine"],
    enabled: !!session,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("newsletter_issues")
        .select("id, subject, content, track, status, sent_at, recipient_count, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const saveNewsletter = useMutation({
    mutationFn: async (d: NewsletterDraft) => {
      if (!user) throw new Error("Session expirée");
      const payload = {
        subject: d.subject.trim(),
        content: d.content,
        track: d.track,
      };
      if (d.id) {
        const { error } = await supabase.from("newsletter_issues").update(payload).eq("id", d.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("newsletter_issues")
          .insert({ ...payload, author_id: user.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      setNewsletterDraft(EMPTY_NEWSLETTER);
      setNewsletterError("");
      qc.invalidateQueries({ queryKey: ["newsletters"] });
    },
    onError: (e: unknown) => {
      const msg = e instanceof Error ? e.message : "Enregistrement impossible";
      setNewsletterError(
        msg.includes("row-level security")
          ? "Ton compte n'a pas encore le droit de publier."
          : msg,
      );
    },
  });

  const removeNewsletter = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("newsletter_issues").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["newsletters"] }),
  });

  const sendNewsletter = useMutation({
    mutationFn: async (id: string) => {
      setSendingId(id);
      const { data, error } = await supabase.functions.invoke("send-newsletter", {
        body: { issueId: id },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      setNewsletterError("");
      qc.invalidateQueries({ queryKey: ["newsletters"] });
    },
    onError: (e: unknown) => {
      setNewsletterError(e instanceof Error ? e.message : "Envoi impossible");
    },
    onSettled: () => setSendingId(null),
  });

  if (loading || !session) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <p className="mx-auto max-w-5xl px-5 py-20 text-[var(--ink)]/60">Chargement…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader
        right={
          <button onClick={signOut} className="hover:text-[var(--pink)]">
            Déconnexion
          </button>
        }
      />
      <main className="mx-auto max-w-5xl px-5 py-12">
        <h1 className="font-display text-4xl font-black">Rédaction</h1>
        <p className="mt-2 text-[var(--ink)]/70">
          Connecté en tant que {user?.email}
          {isAdmin ? " · admin" : canWrite ? " · auteur" : ""}
        </p>

        {!canWrite && (
          <div className="mt-6 rounded-2xl border-2 border-ink bg-[var(--yellow)]/40 p-5 text-sm">
            Ton compte n&apos;a pas encore le rôle « auteur ». Un administrateur doit
            te l&apos;attribuer avant que tu puisses publier.
          </div>
        )}

        <section className="mt-10 rounded-[2rem] border-2 border-ink bg-card p-6 chip-shadow md:p-8">
          <h2 className="font-display text-2xl">
            {draft.id ? "Modifier l'article" : "Nouvel article"}
          </h2>
          <div className="mt-5 grid gap-3">
            <input
              value={draft.title}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  title: e.target.value,
                  slug: d.id ? d.slug : slugify(e.target.value),
                }))
              }
              placeholder="Titre de l'article"
              className="rounded-xl border-2 border-ink bg-background px-4 py-3 font-display text-xl outline-none focus:ring-2 focus:ring-[var(--yellow)]"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={draft.slug}
                onChange={(e) => setDraft((d) => ({ ...d, slug: slugify(e.target.value) }))}
                placeholder="url-de-l-article"
                className="rounded-xl border-2 border-ink bg-background px-4 py-3 text-sm outline-none"
              />
              <select
                value={draft.category}
                onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
                className="rounded-xl border-2 border-ink bg-background px-4 py-3 text-sm outline-none"
              >
                <option value="ia-medicale">IA médicale</option>
                <option value="pedagogie">Pédagogie</option>
                <option value="maison">La maison</option>
              </select>
            </div>
            <input
              value={draft.cover_url}
              onChange={(e) => setDraft((d) => ({ ...d, cover_url: e.target.value }))}
              placeholder="URL de l'image de couverture (optionnel)"
              className="rounded-xl border-2 border-ink bg-background px-4 py-3 text-sm outline-none"
            />
            <textarea
              value={draft.excerpt}
              onChange={(e) => setDraft((d) => ({ ...d, excerpt: e.target.value }))}
              placeholder="Chapeau / résumé"
              rows={2}
              className="rounded-xl border-2 border-ink bg-background px-4 py-3 outline-none"
            />
            <textarea
              value={draft.content}
              onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
              placeholder="Contenu de l'article — sépare les paragraphes par une ligne vide."
              rows={12}
              className="rounded-xl border-2 border-ink bg-background px-4 py-3 leading-relaxed outline-none"
            />
            <label className="flex items-center gap-3 text-sm font-medium">
              <input
                type="checkbox"
                checked={draft.published}
                onChange={(e) => setDraft((d) => ({ ...d, published: e.target.checked }))}
                className="h-4 w-4"
              />
              Publier immédiatement
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => save.mutate(draft)}
                disabled={!canWrite || !draft.title.trim() || save.isPending}
                className="rounded-full border-2 border-ink bg-[var(--pink)] px-6 py-3 font-semibold text-white chip-shadow transition hover:-translate-y-0.5 disabled:opacity-50"
              >
                {save.isPending ? "…" : draft.id ? "Enregistrer" : "Créer l'article"}
              </button>
              {draft.id && (
                <button
                  onClick={() => setDraft(EMPTY)}
                  className="rounded-full border-2 border-ink bg-white px-6 py-3 font-semibold chip-shadow"
                >
                  Annuler
                </button>
              )}
            </div>
            {error && <p className="text-sm font-medium text-[var(--pink)]">{error}</p>}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl">Articles</h2>
          <div className="mt-5 space-y-3">
            {(posts ?? []).length === 0 && (
              <p className="text-[var(--ink)]/60">Aucun article pour l&apos;instant.</p>
            )}
            {(posts ?? []).map((p) => (
              <div
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-ink bg-card p-4"
              >
                <div>
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-xs uppercase tracking-widest text-[var(--ink)]/50">
                    {p.published ? "Publié" : "Brouillon"} · {p.category}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Link
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    className="rounded-full border-2 border-ink bg-white px-4 py-2 font-semibold"
                  >
                    Voir
                  </Link>
                  <button
                    onClick={() =>
                      setDraft({
                        id: p.id,
                        title: p.title,
                        slug: p.slug,
                        excerpt: p.excerpt ?? "",
                        content: p.content ?? "",
                        cover_url: p.cover_url ?? "",
                        category: p.category,
                        published: p.published,
                      })
                    }
                    className="rounded-full border-2 border-ink bg-[var(--yellow)] px-4 py-2 font-semibold"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => remove.mutate(p.id)}
                    className="rounded-full border-2 border-ink bg-white px-4 py-2 font-semibold text-[var(--pink)]"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-[2rem] border-2 border-ink bg-card p-6 chip-shadow md:p-8">
          <h2 className="font-display text-2xl">
            {newsletterDraft.id ? "Modifier la newsletter" : "Nouvelle newsletter"}
          </h2>
          <div className="mt-5 grid gap-3">
            <input
              value={newsletterDraft.subject}
              onChange={(e) =>
                setNewsletterDraft((d) => ({ ...d, subject: e.target.value }))
              }
              placeholder="Objet de l'email"
              className="rounded-xl border-2 border-ink bg-background px-4 py-3 font-display text-xl outline-none focus:ring-2 focus:ring-[var(--yellow)]"
            />
            <select
              value={newsletterDraft.track}
              onChange={(e) => setNewsletterDraft((d) => ({ ...d, track: e.target.value }))}
              className="rounded-xl border-2 border-ink bg-background px-4 py-3 text-sm outline-none"
            >
              {Object.entries(NEWSLETTER_TRACK_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <textarea
              value={newsletterDraft.content}
              onChange={(e) =>
                setNewsletterDraft((d) => ({ ...d, content: e.target.value }))
              }
              placeholder="Contenu de la newsletter — sépare les paragraphes par une ligne vide."
              rows={10}
              className="rounded-xl border-2 border-ink bg-background px-4 py-3 leading-relaxed outline-none"
            />
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => saveNewsletter.mutate(newsletterDraft)}
                disabled={
                  !canWrite || !newsletterDraft.subject.trim() || saveNewsletter.isPending
                }
                className="rounded-full border-2 border-ink bg-[var(--pink)] px-6 py-3 font-semibold text-white chip-shadow transition hover:-translate-y-0.5 disabled:opacity-50"
              >
                {saveNewsletter.isPending
                  ? "…"
                  : newsletterDraft.id
                    ? "Enregistrer le brouillon"
                    : "Créer le brouillon"}
              </button>
              {newsletterDraft.id && (
                <button
                  onClick={() => setNewsletterDraft(EMPTY_NEWSLETTER)}
                  className="rounded-full border-2 border-ink bg-white px-6 py-3 font-semibold chip-shadow"
                >
                  Annuler
                </button>
              )}
            </div>
            {newsletterError && (
              <p className="text-sm font-medium text-[var(--pink)]">{newsletterError}</p>
            )}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl">Newsletters</h2>
          <div className="mt-5 space-y-3">
            {(newsletters ?? []).length === 0 && (
              <p className="text-[var(--ink)]/60">Aucune newsletter pour l&apos;instant.</p>
            )}
            {(newsletters ?? []).map((n) => (
              <div
                key={n.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-ink bg-card p-4"
              >
                <div>
                  <p className="font-semibold">{n.subject}</p>
                  <p className="text-xs uppercase tracking-widest text-[var(--ink)]/50">
                    {n.status === "sent"
                      ? `Envoyée à ${n.recipient_count} abonné${n.recipient_count > 1 ? "s" : ""} · ${n.sent_at ? new Date(n.sent_at).toLocaleDateString("fr-FR") : ""}`
                      : "Brouillon"}{" "}
                    · {NEWSLETTER_TRACK_LABELS[n.track] ?? n.track}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {n.status === "draft" && (
                    <>
                      <button
                        onClick={() =>
                          setNewsletterDraft({
                            id: n.id,
                            subject: n.subject,
                            content: n.content ?? "",
                            track: n.track,
                          })
                        }
                        className="rounded-full border-2 border-ink bg-[var(--yellow)] px-4 py-2 font-semibold"
                      >
                        Modifier
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                `Envoyer « ${n.subject} » à tous les abonnés concernés ? Cette action est irréversible.`,
                              )
                            ) {
                              sendNewsletter.mutate(n.id);
                            }
                          }}
                          disabled={sendingId === n.id}
                          className="rounded-full border-2 border-ink bg-[var(--blue)] px-4 py-2 font-semibold text-white disabled:opacity-50"
                        >
                          {sendingId === n.id ? "Envoi…" : "Envoyer"}
                        </button>
                      )}
                      <button
                        onClick={() => removeNewsletter.mutate(n.id)}
                        className="rounded-full border-2 border-ink bg-white px-4 py-2 font-semibold text-[var(--pink)]"
                      >
                        Supprimer
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {isAdmin && (
          <section className="mt-12">
            <h2 className="font-display text-2xl">
              Abonnés · {subscribers?.length ?? 0} inscrits
            </h2>
            <div className="mt-4 space-y-2 text-sm">
              {(subscribers ?? []).map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-xl border border-ink/15 bg-card px-4 py-2"
                >
                  <span>{s.email}</span>
                  <span className="text-[var(--ink)]/50">
                    {new Date(s.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {isAdmin && <AdminAnalytics />}
        {isAdmin && <AdminTeam />}
      </main>
      <SiteFooter />
    </div>
  );
}
