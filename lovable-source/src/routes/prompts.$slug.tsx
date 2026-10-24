import { createFileRoute, Link } from "@tanstack/react-router";

import { CopyButton } from "@/components/copy-button";
import { NewsletterForm } from "@/components/newsletter-form";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import {
  CATEGORIE_LABELS,
  formatDateFr,
  getPrompt,
  NIVEAU_LABELS,
  OUTIL_LABELS,
  promptsVoisins,
  REGLE_DOR,
} from "@/lib/prompts";
import { getTutoriel } from "@/lib/tutoriels";

export const Route = createFileRoute("/prompts/$slug")({
  head: ({ params }) => {
    const prompt = getPrompt(params.slug);
    if (!prompt) {
      return { meta: [{ title: "Prompt introuvable — Medicilline" }] };
    }
    return {
      meta: [
        { title: `${prompt.title} — Banque de prompts Medicilline` },
        { name: "description", content: prompt.subtitle },
        { property: "og:title", content: `${prompt.title} — Medicilline` },
        { property: "og:description", content: prompt.subtitle },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: PromptPage,
});

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-24 text-center">
        <h1 className="font-display text-3xl font-black">Prompt introuvable</h1>
        <p className="mt-4 text-[var(--ink)]/70">
          Ce prompt n&apos;existe pas sous cette adresse. La banque complète est juste à côté.
        </p>
        <Link
          to="/prompts"
          className="mt-8 inline-flex rounded-full border-2 border-ink bg-[var(--pink)] px-6 py-3 font-bold text-white chip-shadow"
        >
          Voir tous les prompts
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}

function PromptPage() {
  const { slug } = Route.useParams();
  const prompt = getPrompt(slug);

  if (!prompt) return <NotFound />;

  const tutoriel = prompt.tutorielSlug ? getTutoriel(prompt.tutorielSlug) : undefined;
  const voisins = promptsVoisins(prompt.slug);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12 sm:py-16">
        <Link
          to="/prompts"
          className="text-sm font-semibold text-[var(--ink)]/60 hover:text-[var(--ink)]"
        >
          ← La banque de prompts
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="rounded-full border-2 border-ink bg-[var(--yellow)] px-3 py-1 text-xs font-bold uppercase tracking-widest">
            {CATEGORIE_LABELS[prompt.categorie]}
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--ink)]/50">
            {NIVEAU_LABELS[prompt.niveau]} · relu le {formatDateFr(prompt.updatedAt)}
          </span>
        </div>

        <h1 className="mt-5 font-display text-4xl font-black leading-[1.05] sm:text-5xl">
          {prompt.title}
        </h1>
        <p className="mt-4 font-display text-xl leading-snug text-[var(--ink)]/80">
          {prompt.subtitle}
        </p>
        <p className="mt-6 text-[15px] leading-relaxed text-[var(--ink)]/75">{prompt.intro}</p>

        <p className="mt-6 text-[13px] uppercase tracking-widest text-[var(--ink)]/45">
          Essayé sur {prompt.outils.map((o) => OUTIL_LABELS[o]).join(" · ")}
        </p>

        {/* ---- Le prompt, copiable ---- */}
        <section className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--purple)]">
              Le prompt
            </h2>
            <CopyButton text={prompt.body} />
          </div>
          <pre className="mt-4 overflow-x-auto rounded-3xl border-2 border-ink bg-white p-5 font-mono text-[13px] leading-relaxed text-[var(--ink)] chip-shadow sm:p-7 sm:text-sm">
            <code className="whitespace-pre-wrap break-words">{prompt.body}</code>
          </pre>
        </section>

        {/* ---- Les champs à remplir ---- */}
        <section className="mt-12">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--purple)]">
            Les champs à remplir
          </h2>
          <ul className="mt-4 space-y-4">
            {prompt.variables.map((v) => (
              <li
                key={v.champ}
                className="rounded-3xl border-2 border-ink bg-white p-5 chip-shadow sm:p-6"
              >
                <code className="font-mono text-[13px] font-bold text-[var(--pink)]">
                  {v.champ}
                </code>
                <p className="mt-2 text-[15px] leading-relaxed text-[var(--ink)]/75">{v.aide}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ---- Mode d'emploi ---- */}
        <section className="mt-12">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--purple)]">
            Comment s&apos;en servir
          </h2>
          <ol className="mt-4 space-y-4">
            {prompt.howTo.map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-[var(--pink)] font-display text-sm font-black text-white">
                  {i + 1}
                </span>
                <span className="pt-1 text-[15px] leading-relaxed text-[var(--ink)]/80">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* ---- Limites : jamais escamotées ---- */}
        <section className="mt-12 rounded-3xl border-2 border-ink bg-[var(--ink)] p-6 text-[var(--cream)] chip-shadow-lg sm:p-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--yellow)]">
            Ce que ça ne fait pas
          </h2>
          <ul className="mt-4 space-y-3">
            {prompt.limits.map((limit) => (
              <li
                key={limit}
                className="flex gap-3 text-[15px] leading-relaxed text-[var(--cream)]/85"
              >
                <span aria-hidden className="text-[var(--yellow)]">
                  —
                </span>
                <span>{limit}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 border-t-2 border-[var(--cream)]/20 pt-5 text-[14px] leading-relaxed text-[var(--cream)]/70">
            {REGLE_DOR}
          </p>
        </section>

        {/* ---- Le tutoriel qui apprend le geste ---- */}
        {tutoriel ? (
          <section className="mt-12 rounded-3xl border-2 border-ink bg-white p-6 chip-shadow sm:p-7">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--purple)]">
              Le geste, en pas-à-pas
            </h2>
            <h3 className="mt-3 font-display text-2xl font-black leading-tight">
              {tutoriel.title}
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-[var(--ink)]/75">
              {tutoriel.subtitle}
            </p>
            <Link
              to="/tutoriels/$slug"
              params={{ slug: tutoriel.slug }}
              className="mt-5 inline-flex rounded-full border-2 border-ink bg-[var(--yellow)] px-6 py-3 font-semibold text-[var(--ink)] chip-shadow transition hover:-translate-y-1 hover:chip-shadow-lg"
            >
              Ouvrir le tutoriel →
            </Link>
          </section>
        ) : null}

        {/* ---- Les voisins de catégorie ---- */}
        {voisins.length ? (
          <section className="mt-12">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--purple)]">
              Dans la même catégorie
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {voisins.map((v) => (
                <Link
                  key={v.slug}
                  to="/prompts/$slug"
                  params={{ slug: v.slug }}
                  className="rounded-3xl border-2 border-ink bg-white p-5 chip-shadow transition hover:-translate-y-1 hover:chip-shadow-lg"
                >
                  <h3 className="font-display text-lg leading-tight">{v.title}</h3>
                  <p className="mt-2 text-sm text-[var(--ink)]/70">{v.subtitle}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-16">
          <NewsletterForm />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
