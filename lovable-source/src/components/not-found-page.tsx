import { Link, useLocation } from "@tanstack/react-router";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";

const SUGGESTIONS = [
  { to: "/blog", label: "Le blog", hint: "Ce qui change en médecine", color: "var(--pink)" },
  { to: "/prompts", label: "Les prompts", hint: "Prêts à copier en consultation", color: "var(--purple)" },
  { to: "/tutoriels", label: "Les tutoriels", hint: "Un outil IA, pas à pas", color: "var(--blue)" },
  { to: "/ia-minute", label: "IA Minute", hint: "L'actu IA en 1 minute", color: "var(--yellow)" },
] as const;

// Tracé ECG : battements réguliers, puis ligne plate là où la page devrait être.
const ECG_PATH =
  "M0 60 H60 L72 60 L80 30 L88 92 L98 12 L108 60 H170 L182 60 L190 30 L198 92 L208 12 L218 60 H280 L292 60 L300 30 L308 92 L318 12 L328 60 H800";

export function NotFoundPage() {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-16 md:py-24">
        <div className="overflow-hidden rounded-[2.5rem] border-2 border-ink bg-card chip-shadow-lg">
          <div className="bg-[linear-gradient(120deg,var(--purple),var(--blue),var(--pink))] gradient-pan px-8 py-10 text-white md:px-14 md:py-14">
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-3 py-1 text-xs font-bold uppercase tracking-widest text-[var(--ink)] chip-shadow">
              <span className="h-2 w-2 rounded-full bg-[var(--pink)]" />
              Erreur 404
            </span>

            <div className="relative mt-6">
              <p className="font-display text-[7rem] font-black leading-none md:text-[11rem]">404</p>
              <svg
                viewBox="0 0 800 104"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="mt-2 h-16 w-full md:h-20"
              >
                <path
                  d={ECG_PATH}
                  fill="none"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className="ecg-trace"
                />
              </svg>
            </div>

            <h1 className="mt-6 max-w-2xl font-display text-3xl font-black leading-tight md:text-5xl">
              Diagnostic : page introuvable.
            </h1>
            <p className="mt-4 max-w-xl text-white/90">
              L&apos;adresse{" "}
              <code className="rounded-md bg-white/20 px-2 py-0.5 font-mono text-sm">{pathname}</code>{" "}
              ne mène nulle part. Le lien est peut-être ancien, ou la page a changé de place.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/"
                className="inline-flex rounded-full border-2 border-ink bg-[var(--yellow)] px-7 py-3.5 font-bold text-[var(--ink)] chip-shadow transition hover:-translate-y-1 hover:chip-shadow-lg"
              >
                Retour à l&apos;accueil →
              </Link>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="inline-flex rounded-full border-2 border-ink bg-white px-7 py-3.5 font-semibold text-[var(--ink)] chip-shadow transition hover:-translate-y-1 hover:chip-shadow-lg"
              >
                ← Page précédente
              </button>
            </div>
          </div>

          <div className="p-8 md:p-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-[var(--blue)]">
              Ordonnance de secours
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {SUGGESTIONS.map((s) => (
                <Link
                  key={s.to}
                  to={s.to}
                  className="group rounded-3xl border-2 border-ink bg-background p-5 chip-shadow transition duration-300 hover:-translate-y-1 hover:chip-shadow-lg"
                >
                  <span className="block h-2 w-10 rounded-full" style={{ background: s.color }} />
                  <span className="mt-4 block font-display text-xl">{s.label}</span>
                  <span className="mt-1 block text-sm text-[var(--ink)]/70">{s.hint}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
