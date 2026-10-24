import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import {
  formatDateFr,
  getTutoriel,
  NIVEAU_LABELS,
  OUTIL_LABELS,
  TUTORIELS_PAR_PARCOURS,
} from "@/lib/tutoriels";

export const Route = createFileRoute("/tutoriels/$slug")({
  head: ({ params }) => {
    const t = getTutoriel(params.slug);
    if (!t) {
      return { meta: [{ title: "Tutoriel introuvable — Medicilline" }] };
    }
    return {
      meta: [
        { title: `${t.title} — Tutoriel Medicilline` },
        { name: "description", content: t.subtitle },
        { property: "og:title", content: `${t.title} — Tutoriel Medicilline` },
        { property: "og:description", content: t.subtitle },
        { property: "og:type", content: "article" },
        { property: "og:image", content: t.cover.src },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: TutorielPage,
});

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-24 text-center">
        <h1 className="font-display text-4xl font-black">Tutoriel introuvable</h1>
        <p className="mt-4 text-[var(--ink)]/70">
          Cette adresse ne correspond à aucune fiche de la bibliothèque.
        </p>
        <Link
          to="/tutoriels"
          className="mt-8 inline-flex items-center justify-center rounded-full border-2 border-ink bg-[var(--pink)] px-6 py-3 font-bold text-white chip-shadow"
        >
          Voir tous les tutoriels
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}

function TutorielPage() {
  const { slug } = Route.useParams();
  const t = getTutoriel(slug);

  if (!t) return <NotFound />;

  const suite = TUTORIELS_PAR_PARCOURS.filter((autre) => autre.slug !== t.slug).slice(0, 2);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12">
        <Link
          to="/tutoriels"
          className="text-sm font-semibold text-[var(--ink)]/60 hover:text-[var(--blue)]"
        >
          ← Tous les tutoriels
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="rounded-full border-2 border-ink bg-[var(--yellow)] px-3 py-1 text-xs font-bold uppercase tracking-widest">
            {OUTIL_LABELS[t.outil]}
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--ink)]/50">
            {NIVEAU_LABELS[t.niveau]} · {t.minutes} min · {t.etapes.length} étapes
          </span>
        </div>

        <h1 className="mt-5 font-display text-4xl font-black leading-[1.05] md:text-5xl">
          {t.title}
        </h1>
        <p className="mt-4 font-display text-xl leading-snug text-[var(--ink)]/80">
          {t.subtitle}
        </p>

        <img
          src={t.cover.src}
          alt={t.cover.alt}
          width={1200}
          height={675}
          className="mt-8 w-full rounded-3xl border-2 border-ink chip-shadow"
        />

        {/* ---- Les deux façons de lire la fiche ---- */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href={t.page}
            target="_blank"
            rel="noopener"
            className="flex-1 rounded-full border-2 border-ink bg-[var(--pink)] px-6 py-3 text-center font-bold text-white chip-shadow transition hover:-translate-y-0.5"
          >
            Ouvrir le tutoriel
          </a>
          <a
            href={t.pdf}
            target="_blank"
            rel="noopener"
            className="flex-1 rounded-full border-2 border-ink bg-white px-6 py-3 text-center font-bold chip-shadow transition hover:-translate-y-0.5"
          >
            Télécharger le PDF · {t.pdfPoids}
          </a>
        </div>
        <p className="mt-3 text-xs text-[var(--ink)]/55">
          La version en ligne et le PDF sont la même page : le PDF n&apos;est que sa
          mise en A4. Captures du {formatDateFr(t.capturedAt)}.
        </p>

        <p className="mt-10 text-[15px] leading-relaxed text-[var(--ink)]/75">{t.intro}</p>

        {/* ---- Ce qu'on sait faire à la fin ---- */}
        <section className="mt-10 rounded-3xl border-2 border-ink bg-white p-7 chip-shadow">
          <h2 className="font-display text-2xl font-black">À la fin, vous savez</h2>
          <ul className="mt-4 space-y-3">
            {t.gestes.map((g) => (
              <li key={g} className="flex gap-3 text-[15px] text-[var(--ink)]/80">
                <span className="mt-2 h-2 w-2 flex-none rounded-full bg-[var(--pink)]" />
                {g}
              </li>
            ))}
          </ul>
        </section>

        {/* ---- Le parcours ---- */}
        <section className="mt-10">
          <h2 className="font-display text-2xl font-black">Le parcours</h2>
          <ol className="mt-5 space-y-3">
            {t.etapes.map((e, i) => (
              <li
                key={e}
                className="flex items-start gap-4 rounded-2xl border-2 border-ink bg-card px-5 py-4 chip-shadow"
              >
                <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full border-2 border-ink bg-[var(--blue)] text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-[15px] leading-snug">{e}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ---- Le passage obligé ---- */}
        <section className="mt-10 rounded-3xl border-2 border-ink border-l-8 border-l-[var(--destructive,#e7000b)] bg-[#fff5f5] p-7 chip-shadow">
          <h2 className="font-display text-xl font-black text-[#e7000b]">
            L&apos;étape à ne pas sauter
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink)]/80">
            {t.passageOblige}
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink)]/80">
            Rappel commun à toutes les fiches : aucun outil grand public n&apos;est
            conforme pour héberger des données de santé identifiantes, et une sortie
            d&apos;IA est une piste de lecture — jamais une référence clinique.
          </p>
        </section>

        {/* ---- Avant de commencer ---- */}
        <section className="mt-10">
          <h2 className="font-display text-2xl font-black">Avant de commencer</h2>
          <ul className="mt-4 space-y-2">
            {t.prerequis.map((p) => (
              <li key={p} className="flex gap-3 text-[15px] text-[var(--ink)]/80">
                <span className="mt-2 h-2 w-2 flex-none rounded-full bg-[var(--blue)]" />
                {p}
              </li>
            ))}
          </ul>
        </section>

        {/* ---- La suite du parcours ---- */}
        {suite.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-2xl font-black">Dans la bibliothèque</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {suite.map((autre) => (
                <Link
                  key={autre.slug}
                  to="/tutoriels/$slug"
                  params={{ slug: autre.slug }}
                  className="overflow-hidden rounded-3xl border-2 border-ink bg-card chip-shadow transition hover:-translate-y-1"
                >
                  <img
                    src={autre.cover.src}
                    alt={autre.cover.alt}
                    loading="lazy"
                    width={1200}
                    height={675}
                    className="h-32 w-full border-b-2 border-ink object-cover"
                  />
                  <div className="p-5">
                    <span className="rounded-full border-2 border-ink bg-[var(--yellow)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                      {OUTIL_LABELS[autre.outil]}
                    </span>
                    <h3 className="mt-3 font-display text-lg leading-tight">{autre.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
