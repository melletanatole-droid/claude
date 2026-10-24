import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { BLOG_ARTICLES } from "@/lib/blog-articles";
import { NewsletterForm } from "@/components/newsletter-form";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog Medicilline — nouveautés de l'IA médicale" },
      {
        name: "description",
        content:
          "Les nouveautés de l'intelligence artificielle en médecine, expliquées simplement par Medicilline : outils, usages cliniques, éthique et pédagogie.",
      },
      { property: "og:title", content: "Blog Medicilline — nouveautés de l'IA médicale" },
      {
        property: "og:description",
        content:
          "Les nouveautés de l'IA médicale expliquées simplement : outils, usages cliniques, éthique et pédagogie.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BlogIndex,
});

const CATEGORIES = [
  { key: "all", label: "Tout" },
  { key: "ia-medicale", label: "IA médicale" },
  { key: "pedagogie", label: "Pédagogie" },
  { key: "maison", label: "La maison" },
] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  "ia-medicale": "IA médicale",
  pedagogie: "Pédagogie",
  maison: "La maison",
};

/** Une carte du fil : article éditorial versionné avec le site, ou billet rédigé depuis /admin. */
type BlogCard = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_url: string | null;
  category: string;
  published_at: string | null;
};

const STATIC_CARDS: BlogCard[] = BLOG_ARTICLES.map((a) => ({
  id: `article:${a.slug}`,
  slug: a.slug,
  title: a.title,
  excerpt: a.excerpt,
  cover_url: a.cover.src,
  category: a.category,
  published_at: a.publishedAt,
}));

function BlogIndex() {
  const [cat, setCat] = useState<string>("all");
  const { canWrite } = useAuth();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts", "published"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, slug, title, excerpt, cover_url, category, published_at")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as BlogCard[];
    },
  });

  const staticSlugs = new Set(STATIC_CARDS.map((c) => c.slug));
  const all: BlogCard[] = [
    ...STATIC_CARDS,
    ...(posts ?? []).filter((p) => !staticSlugs.has(p.slug)),
  ].sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""));

  const filtered = all.filter((p) => cat === "all" || p.category === cat);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader
        right={
          canWrite ? (
            <Link
              to="/admin"
              className="rounded-full border-2 border-ink bg-[var(--pink)] px-4 py-2 text-sm font-semibold text-white chip-shadow"
            >
              Écrire
            </Link>
          ) : (
            <Link to="/auth" className="hover:text-[var(--blue)]">
              Connexion
            </Link>
          )
        }
      />

      <main className="mx-auto max-w-5xl px-5 pt-12">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider chip-shadow">
          <span className="h-2 w-2 rounded-full bg-[var(--purple)]" />
          Le blog Medicilline
        </span>
        <h1 className="mt-6 font-display text-5xl font-black leading-[0.95] md:text-6xl">
          Les nouveautés de l&apos;IA médicale.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-[var(--ink)]/75">
          Ce qui change vraiment dans la pratique : nouveaux outils, usages cliniques, cadre éthique
          et réglementaire — décrypté sans jargon.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setCat(c.key)}
              className={`rounded-full border-2 border-ink px-4 py-2 text-sm font-semibold transition ${
                cat === c.key
                  ? "bg-[var(--ink)] text-white"
                  : "bg-white text-[var(--ink)] hover:-translate-y-0.5 chip-shadow"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          {isLoading && filtered.length === 0 && (
            <p className="text-[var(--ink)]/60">Chargement des articles…</p>
          )}
          {!isLoading && filtered.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-ink/30 p-8 text-[var(--ink)]/60 md:col-span-2">
              Aucun article publié pour l&apos;instant. Reviens bientôt — ou inscris-toi à la
              newsletter juste en dessous.
            </div>
          )}
          {filtered.map((p, i) => (
            <Link
              key={p.id}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="fade-in-pop group overflow-hidden rounded-3xl border-2 border-ink bg-card chip-shadow transition hover:-translate-y-1 hover:chip-shadow-lg"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              {p.cover_url ? (
                <img
                  src={p.cover_url}
                  alt={p.title}
                  loading="lazy"
                  width={1200}
                  height={675}
                  className="h-44 w-full object-cover"
                />
              ) : (
                <div className="h-44 w-full bg-[linear-gradient(135deg,var(--pink),var(--purple),var(--blue))] gradient-pan" />
              )}
              <div className="p-6">
                <span className="rounded-full border-2 border-ink bg-[var(--yellow)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                  {CATEGORY_LABELS[p.category] ?? p.category}
                </span>
                <h2 className="mt-4 font-display text-2xl leading-tight">{p.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-[var(--ink)]/70">{p.excerpt}</p>
                <p className="mt-4 text-xs uppercase tracking-widest text-[var(--ink)]/50">
                  {p.published_at
                    ? new Date(p.published_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : ""}
                </p>
              </div>
            </Link>
          ))}
        </section>

        <section className="mt-16">
          <NewsletterForm />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
