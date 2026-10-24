import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { CopyButton } from "@/components/copy-button";
import { NewsletterForm } from "@/components/newsletter-form";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import {
  CATEGORIE_INTROS,
  CATEGORIE_LABELS,
  categoriesDisponibles,
  NIVEAU_LABELS,
  OUTIL_LABELS,
  PROMPTS_TRIES,
  REGLE_DOR,
  type PromptCategorie,
} from "@/lib/prompts";

export const Route = createFileRoute("/prompts/")({
  head: () => ({
    meta: [
      { title: "Banque de prompts médicaux — Medicilline" },
      {
        name: "description",
        content:
          "Des prompts prêts à copier pour les médecins : contradicteur diagnostique, relecture de compte rendu, traduction pour le patient, vérification de références. Chacun dit ce qu'il ne fait pas.",
      },
      { property: "og:title", content: "Banque de prompts médicaux — Medicilline" },
      {
        property: "og:description",
        content:
          "Des prompts prêts à copier pour les médecins, avec leur mode d'emploi et leurs limites.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PromptsIndex,
});

type Filtre = "tous" | PromptCategorie;

function PromptsIndex() {
  const [filtre, setFiltre] = useState<Filtre>("tous");
  const [query, setQuery] = useState("");
  const categories = categoriesDisponibles();

  const fiches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROMPTS_TRIES.filter((p) => {
      const okCat = filtre === "tous" || p.categorie === filtre;
      const okQ = !q || `${p.title} ${p.subtitle} ${p.intro} ${p.body}`.toLowerCase().includes(q);
      return okCat && okQ;
    });
  }, [filtre, query]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-5 pt-12">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider chip-shadow">
          <span className="h-2 w-2 rounded-full bg-[var(--pink)]" />
          La banque de prompts
        </span>
        <h1 className="mt-6 font-display text-5xl font-black leading-[0.95] md:text-6xl">
          Des prompts qui disent aussi
          <br />
          <span className="text-[var(--pink)]">ce qu&apos;ils ne font pas.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-[var(--ink)]/75">
          {PROMPTS_TRIES.length} prompts écrits pour un exercice médical, à copier tels quels.
          Chacun porte ses champs à remplir, son mode d&apos;emploi en quatre gestes, et la liste de
          ce qu&apos;il ne sait pas faire — cette dernière n&apos;est jamais vide.
        </p>

        {/* ---- La règle qui précède tous les prompts ---- */}
        <p className="mt-8 rounded-3xl border-2 border-ink bg-[var(--ink)] p-6 text-[15px] leading-relaxed text-[var(--cream)]/90 chip-shadow-lg">
          <span className="font-display text-[var(--yellow)]">La règle d&apos;or — </span>
          {REGLE_DOR}
        </p>

        {/* ---- Filtres et recherche ---- */}
        <div className="mt-8 flex flex-wrap gap-2">
          {(["tous", ...categories] as Filtre[]).map((k) => (
            <button
              key={k}
              onClick={() => setFiltre(k)}
              className={`rounded-full border-2 border-ink px-4 py-2 text-sm font-semibold transition ${
                filtre === k
                  ? "bg-[var(--ink)] text-white"
                  : "bg-white text-[var(--ink)] hover:-translate-y-0.5 chip-shadow"
              }`}
            >
              {k === "tous" ? "Tout" : CATEGORIE_LABELS[k]}
            </button>
          ))}
        </div>

        <label className="mt-4 block">
          <span className="sr-only">Chercher dans les prompts</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Chercher — « compte rendu », « référence », « patient »…"
            className="w-full rounded-full border-2 border-ink bg-white px-5 py-3 text-sm outline-none chip-shadow placeholder:text-[var(--ink)]/40 focus:-translate-y-0.5 focus:chip-shadow-lg"
          />
        </label>

        {filtre === "tous" ? (
          <p className="mt-6 rounded-2xl border-2 border-ink bg-[var(--yellow)]/25 px-5 py-4 text-sm text-[var(--ink)]/80 chip-shadow">
            <b>Par où commencer ?</b> Par « Le socle » : dépersonnaliser un texte avant de le
            coller, puis cadrer l&apos;assistant pour qu&apos;il vous parle comme à un confrère. Les
            deux prennent cinq minutes et changent tout ce qui suit.
          </p>
        ) : (
          <p className="mt-6 rounded-2xl border-2 border-ink bg-white px-5 py-4 text-sm text-[var(--ink)]/80 chip-shadow">
            {CATEGORIE_INTROS[filtre]}
          </p>
        )}

        {/* ---- Les fiches ---- */}
        {fiches.length === 0 ? (
          <p className="mt-12 rounded-3xl border-2 border-ink bg-white p-8 text-center text-[15px] text-[var(--ink)]/70 chip-shadow">
            Aucun prompt ne correspond à cette recherche. Il en manque un qui vous servirait&nbsp;?{" "}
            <a
              href="mailto:contact@medicilline.ai?subject=Un%20prompt%20qui%20manque"
              className="font-semibold underline decoration-[var(--pink)] decoration-2 underline-offset-4"
            >
              Dites-nous lequel
            </a>
            .
          </p>
        ) : (
          <section className="mt-10 grid gap-6 md:grid-cols-2">
            {fiches.map((p, i) => (
              <article
                key={p.slug}
                className="fade-in-pop flex flex-col rounded-3xl border-2 border-ink bg-card p-6 chip-shadow transition hover:-translate-y-1 hover:chip-shadow-lg"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border-2 border-ink bg-[var(--yellow)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                    {CATEGORIE_LABELS[p.categorie]}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--ink)]/50">
                    {NIVEAU_LABELS[p.niveau]}
                  </span>
                </div>

                <Link
                  to="/prompts/$slug"
                  params={{ slug: p.slug }}
                  className="mt-4 font-display text-2xl leading-tight hover:text-[var(--pink)]"
                >
                  {p.title}
                </Link>
                <p className="mt-2 text-sm text-[var(--ink)]/70">{p.subtitle}</p>

                <p className="mt-4 text-[11px] uppercase tracking-widest text-[var(--ink)]/45">
                  Essayé sur {p.outils.map((o) => OUTIL_LABELS[o]).join(" · ")}
                </p>

                <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
                  <CopyButton text={p.body} />
                  <Link
                    to="/prompts/$slug"
                    params={{ slug: p.slug }}
                    className="text-sm font-semibold text-[var(--ink)]/70 underline decoration-[var(--blue)] decoration-2 underline-offset-4 hover:text-[var(--ink)]"
                  >
                    Mode d&apos;emploi et limites →
                  </Link>
                </div>
              </article>
            ))}
          </section>
        )}

        {/* ---- Le pont vers les tutoriels ---- */}
        <section className="mt-14 rounded-3xl border-2 border-ink bg-white p-7 chip-shadow">
          <h2 className="font-display text-2xl font-black">Un prompt ne remplace pas le geste</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink)]/75">
            Copier un prompt suppose de savoir où le coller, comment joindre un document, et quel
            réglage de compte couper avant de commencer. C&apos;est ce que font les tutoriels : des
            fiches pas-à-pas, captures réelles et datées à l&apos;appui, sur ChatGPT, Claude, Claude
            Cowork et NotebookLM.
          </p>
          <Link
            to="/tutoriels"
            className="mt-5 inline-flex rounded-full border-2 border-ink bg-[var(--yellow)] px-6 py-3 font-semibold text-[var(--ink)] chip-shadow transition hover:-translate-y-1 hover:chip-shadow-lg"
          >
            Ouvrir la bibliothèque de tutoriels →
          </Link>
        </section>

        <section className="mt-16">
          <NewsletterForm />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
