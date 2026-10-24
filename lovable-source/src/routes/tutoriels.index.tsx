import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { NewsletterForm } from "@/components/newsletter-form";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import {
  formatDateFr,
  NIVEAU_LABELS,
  OUTIL_LABELS,
  outilsDisponibles,
  TUTORIELS_PAR_PARCOURS,
  type TutorielOutil,
} from "@/lib/tutoriels";

export const Route = createFileRoute("/tutoriels/")({
  head: () => ({
    meta: [
      { title: "Tutoriels Medicilline — se servir de l'IA en médecine" },
      {
        name: "description",
        content:
          "Des fiches pas-à-pas, captures d'écran réelles à l'appui, pour se servir de ChatGPT, Claude, Claude Cowork et NotebookLM en pratique médicale. À lire en ligne ou à imprimer.",
      },
      { property: "og:title", content: "Tutoriels Medicilline — se servir de l'IA en médecine" },
      {
        property: "og:description",
        content:
          "Des fiches pas-à-pas, captures réelles à l'appui, pour se servir de ChatGPT, Claude, Cowork et NotebookLM.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TutorielsIndex,
});

type Filtre = "tous" | TutorielOutil;

function TutorielsIndex() {
  const [filtre, setFiltre] = useState<Filtre>("tous");
  const outils = outilsDisponibles();

  const fiches = TUTORIELS_PAR_PARCOURS.filter(
    (t) => filtre === "tous" || t.outil === filtre,
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-5 pt-12">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider chip-shadow">
          <span className="h-2 w-2 rounded-full bg-[var(--blue)]" />
          La bibliothèque de tutoriels
        </span>
        <h1 className="mt-6 font-display text-5xl font-black leading-[0.95] md:text-6xl">
          Apprendre le geste, pas l&apos;outil.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-[var(--ink)]/75">
          Des fiches pas-à-pas pour un médecin qui a quinze minutes. Chaque capture est
          réelle et datée, chaque étape se termine par un geste faisable, et chacune
          consacre un passage à ce qui expose — données, partage, autorisations.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {(["tous", ...outils] as Filtre[]).map((k) => (
            <button
              key={k}
              onClick={() => setFiltre(k)}
              className={`rounded-full border-2 border-ink px-4 py-2 text-sm font-semibold transition ${
                filtre === k
                  ? "bg-[var(--ink)] text-white"
                  : "bg-white text-[var(--ink)] hover:-translate-y-0.5 chip-shadow"
              }`}
            >
              {k === "tous" ? "Tout" : OUTIL_LABELS[k]}
            </button>
          ))}
        </div>

        {filtre === "tous" && (
          <p className="mt-6 rounded-2xl border-2 border-ink bg-[var(--yellow)]/25 px-5 py-4 text-sm text-[var(--ink)]/80 chip-shadow">
            <b>Dans quel ordre ?</b> Les fiches sont rangées du socle au plus
            spécialisé. Commencez par ChatGPT ou Claude — les gestes s&apos;y
            ressemblent, un seul des deux suffit — puis Cowork le jour où vous voulez
            faire travailler l&apos;outil sur vos propres fichiers. NotebookLM se prend
            à part, quand vous avez un corpus à interroger.
          </p>
        )}

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          {fiches.map((t, i) => (
            <Link
              key={t.slug}
              to="/tutoriels/$slug"
              params={{ slug: t.slug }}
              className="fade-in-pop group flex flex-col overflow-hidden rounded-3xl border-2 border-ink bg-card chip-shadow transition hover:-translate-y-1 hover:chip-shadow-lg"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <img
                src={t.cover.src}
                alt={t.cover.alt}
                loading="lazy"
                width={1200}
                height={675}
                className="h-44 w-full border-b-2 border-ink object-cover"
              />
              <div className="flex flex-1 flex-col p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border-2 border-ink bg-[var(--yellow)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                    {OUTIL_LABELS[t.outil]}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--ink)]/50">
                    {NIVEAU_LABELS[t.niveau]} · {t.minutes} min · {t.etapes.length} étapes
                  </span>
                </div>
                <h2 className="mt-4 font-display text-2xl leading-tight">{t.title}</h2>
                <p className="mt-2 text-sm text-[var(--ink)]/70">{t.subtitle}</p>
                <p className="mt-auto pt-4 text-xs uppercase tracking-widest text-[var(--ink)]/50">
                  Captures du {formatDateFr(t.capturedAt)}
                </p>
              </div>
            </Link>
          ))}
        </section>

        <section className="mt-14 rounded-3xl border-2 border-ink bg-white p-7 chip-shadow">
          <h2 className="font-display text-2xl font-black">Comment ces fiches sont faites</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink)]/75">
            Les captures ne sont ni redessinées ni retouchées à l&apos;œil : elles sont
            prises dans l&apos;outil, à une date qui est écrite sur la fiche, puis
            neutralisées — historique, nom de compte et noms de projets remplacés par
            des exemples médicaux. Les cadres et les pastilles sont posés à partir de
            positions mesurées dans l&apos;image, pas à l&apos;estime.
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink)]/75">
            Une interface qui bouge rend une capture fausse. C&apos;est pour ça que
            chaque fiche porte la date de ses captures : en cas d&apos;écart avec ce que
            vous voyez, c&apos;est votre écran qui a raison.
          </p>
        </section>

        <section className="mt-16">
          <NewsletterForm />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
