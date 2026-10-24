import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getRessource, TRACK_LABELS } from "@/lib/ressources";

export const Route = createFileRoute("/ressources/$slug")({
  head: ({ params }) => {
    const ressource = getRessource(params.slug);
    return {
      meta: [
        {
          title: ressource
            ? `${ressource.title} — Ressource Medicilline`
            : "Ressource — Medicilline",
        },
        // Annexe de newsletter : jamais indexée, jamais dans le sitemap.
        { name: "description", content: ressource ? `Consultez la ressource « ${ressource.title} » de la newsletter Medicilline.` : "Ressource de la newsletter Medicilline." },
        { property: "og:title", content: ressource ? `${ressource.title} — Ressource Medicilline` : "Ressource — Medicilline" },
        { property: "og:description", content: ressource ? `Consultez la ressource « ${ressource.title} » de la newsletter Medicilline.` : "Ressource de la newsletter Medicilline." },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
        { name: "robots", content: "noindex, nofollow" },
      ],
    };
  },
  component: RessourcePage,
});

function useCopy(text: string) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      // Contexte non sécurisé ou permission refusée : on laisse le lecteur
      // sélectionner le texte à la main plutôt que d'afficher un faux succès.
      setCopied(false);
    }
  }

  return { copied, copy };
}

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-24 text-center">
        <h1 className="text-3xl font-black text-ink">Ressource introuvable</h1>
        <p className="mt-4 text-ink/70">
          Ce lien vient d'une newsletter Médicilline, mais la ressource associée
          n'existe pas (ou plus) sous cette adresse.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center rounded-full border-2 border-ink bg-pink px-6 py-3 font-bold text-white chip-shadow"
        >
          Retour à l'accueil
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}

function RessourcePage() {
  const { slug } = Route.useParams();
  const ressource = getRessource(slug);
  const { copied, copy } = useCopy(ressource?.body ?? "");

  if (!ressource) return <NotFound />;

  const issueDate = new Date(ressource.issueDate).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:py-16">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border-2 border-ink bg-yellow px-3 py-1 text-xs font-bold uppercase tracking-widest text-ink">
            {TRACK_LABELS[ressource.track]}
          </span>
          <span className="text-xs font-medium uppercase tracking-widest text-ink/50">
            Numéro du {issueDate}
          </span>
        </div>

        <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight text-ink sm:text-5xl">
          {ressource.title}
        </h1>
        <p className="mt-4 font-display text-xl leading-snug text-ink/80">
          {ressource.subtitle}
        </p>

        <p className="mt-8 text-[15px] leading-relaxed text-ink/75">
          {ressource.intro}
        </p>

        {/* ---- La photo d'ouverture ---- */}
        {ressource.hero ? (
          <figure className="mt-8">
            <img
              src={ressource.hero.src}
              alt={ressource.hero.alt}
              className="w-full rounded-3xl border-2 border-ink bg-white chip-shadow"
            />
            {ressource.hero.caption ? (
              <figcaption className="mt-3 text-[13px] leading-relaxed text-ink/55">
                {ressource.hero.caption}
              </figcaption>
            ) : null}
          </figure>
        ) : null}

        {/* ---- La fiche imprimable ---- */}
        {ressource.sheet ? (
          <section className="mt-12">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="text-sm font-bold uppercase tracking-widest text-purple">
                La fiche
              </h2>
              <a
                href={ressource.sheet.downloadSrc ?? ressource.sheet.src}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-2 border-ink bg-yellow px-5 py-2 text-sm font-bold text-ink chip-shadow transition-transform active:translate-x-[2px] active:translate-y-[2px]"
              >
                Ouvrir en A4 ↗
              </a>
            </div>
            <img
              src={ressource.sheet.src}
              alt={ressource.sheet.alt}
              loading="lazy"
              className="mt-4 w-full rounded-3xl border-2 border-ink bg-white chip-shadow"
            />
            {ressource.sheet.caption ? (
              <p className="mt-3 text-[13px] leading-relaxed text-ink/55">
                {ressource.sheet.caption}
              </p>
            ) : null}
          </section>
        ) : null}

        {/* ---- Le cas d'usage travaillé ---- */}
        {ressource.caseStudy ? (
          <section className="mt-12">
            <h2 className="text-sm font-bold uppercase tracking-widest text-purple">
              Un cas, ligne par ligne
            </h2>
            <h3 className="mt-3 font-display text-2xl font-black leading-tight text-ink">
              {ressource.caseStudy.title}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/75">
              {ressource.caseStudy.context}
            </p>

            {ressource.caseStudy.photo ? (
              <figure className="mt-6">
                <img
                  src={ressource.caseStudy.photo.src}
                  alt={ressource.caseStudy.photo.alt}
                  loading="lazy"
                  className="w-full rounded-3xl border-2 border-ink bg-white chip-shadow"
                />
                {ressource.caseStudy.photo.caption ? (
                  <figcaption className="mt-3 text-[13px] leading-relaxed text-ink/55">
                    {ressource.caseStudy.photo.caption}
                  </figcaption>
                ) : null}
              </figure>
            ) : null}

            <ul className="mt-6 space-y-4">
              {ressource.caseStudy.rows.map((row) => (
                <li
                  key={row.field}
                  className="rounded-3xl border-2 border-ink bg-white p-5 chip-shadow sm:p-6"
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-pink">
                    {row.field}
                  </p>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink">
                    {row.found}
                  </p>
                  <p className="mt-3 border-t-2 border-ink/10 pt-3 text-[14px] leading-relaxed text-ink/70">
                    <span className="font-bold text-ink">Ce que ça change — </span>
                    {row.impact}
                  </p>
                </li>
              ))}
            </ul>

            <p className="mt-6 rounded-3xl border-2 border-ink bg-yellow p-5 text-[15px] font-semibold leading-relaxed text-ink chip-shadow sm:p-6">
              {ressource.caseStudy.verdict}
            </p>
          </section>
        ) : null}

        {/* ---- Le contenu complet, copiable ---- */}
        <section className="mt-12">
          {ressource.bodyVisual ? (
            <figure className="mb-8">
              <img
                src={ressource.bodyVisual.src}
                alt={ressource.bodyVisual.alt}
                loading="lazy"
                className="w-full rounded-3xl border-2 border-ink bg-white chip-shadow"
              />
              {ressource.bodyVisual.caption ? (
                <figcaption className="mt-3 text-[13px] leading-relaxed text-ink/55">
                  {ressource.bodyVisual.caption}
                </figcaption>
              ) : null}
            </figure>
          ) : null}
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-purple">
              {ressource.bodyLabel} complet
            </h2>
            <button
              type="button"
              onClick={copy}
              className="rounded-full border-2 border-ink bg-blue px-5 py-2 text-sm font-bold text-white chip-shadow transition-transform active:translate-x-[2px] active:translate-y-[2px]"
            >
              {copied ? "Copié ✓" : "Copier"}
            </button>
          </div>

          <pre className="mt-4 overflow-x-auto rounded-3xl border-2 border-ink bg-white p-5 font-mono text-[13px] leading-relaxed text-ink chip-shadow sm:p-7 sm:text-sm">
            <code className="whitespace-pre-wrap break-words">
              {ressource.body}
            </code>
          </pre>
        </section>

        {/* ---- Mode d'emploi ---- */}
        <section className="mt-12">
          <h2 className="text-sm font-bold uppercase tracking-widest text-purple">
            Comment s'en servir
          </h2>
          <ol className="mt-4 space-y-4">
            {ressource.howTo.map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-pink font-display text-sm font-black text-white">
                  {i + 1}
                </span>
                <span className="pt-1 text-[15px] leading-relaxed text-ink/80">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* ---- Les visuels du numéro ---- */}
        {ressource.figures?.length ? (
          <section className="mt-12">
            <h2 className="text-sm font-bold uppercase tracking-widest text-purple">
              Les visuels du numéro
            </h2>
            <div className="mt-4 space-y-8">
              {ressource.figures.map((figure) => (
                <figure key={figure.src}>
                  <img
                    src={figure.src}
                    alt={figure.alt}
                    loading="lazy"
                    className="w-full rounded-3xl border-2 border-ink bg-white chip-shadow"
                  />
                  {figure.caption ? (
                    <figcaption className="mt-3 text-[13px] leading-relaxed text-ink/55">
                      {figure.caption}
                    </figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        {/* ---- Limites : jamais escamotées ---- */}
        <section className="mt-12 rounded-3xl border-2 border-ink bg-ink p-6 text-cream chip-shadow-lg sm:p-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-yellow">
            Ce que ça ne fait pas
          </h2>
          <ul className="mt-4 space-y-3">
            {ressource.limits.map((limit) => (
              <li
                key={limit}
                className="flex gap-3 text-[15px] leading-relaxed text-cream/85"
              >
                <span aria-hidden className="text-yellow">
                  —
                </span>
                <span>{limit}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ---- Sources datées ---- */}
        <section className="mt-12">
          <h2 className="text-sm font-bold uppercase tracking-widest text-purple">
            Sources
          </h2>
          <ul className="mt-4 space-y-3">
            {ressource.sources.map((source) => (
              <li key={source.url} className="text-[14px] leading-relaxed">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-ink underline decoration-pink decoration-2 underline-offset-4"
                >
                  {source.label}
                </a>
                <span className="text-ink/50"> · {source.date}</span>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-12 border-t-2 border-ink/10 pt-6 text-xs leading-relaxed text-ink/50">
          Page annexe d'une newsletter Médicilline. Elle n'est pas référencée et
          n'apparaît pas dans la navigation du site — vous y accédez par le lien
          reçu par email, qui restera valide.
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
