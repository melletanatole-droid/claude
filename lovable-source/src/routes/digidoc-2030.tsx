import { createFileRoute, Link } from "@tanstack/react-router";
import digidocCover from "@/assets/digidoc-2030-cover.png.asset.json";

export const Route = createFileRoute("/digidoc-2030")({
  head: () => ({
    meta: [
      { title: "Digidoc 2030 — 18 ruptures qui changent la médecine | Medicilline" },
      {
        name: "description",
        content:
          "Digidoc 2030 : 18 ruptures technologiques et 133 visuels pédagogiques pour comprendre la médecine de 2030. Par le Dr Guillaume Zagury.",
      },
      { property: "og:title", content: "Digidoc 2030 — la médecine de 2030 en visuels" },
      {
        property: "og:description",
        content:
          "18 ruptures technologiques décryptées en 133 visuels pédagogiques. Une collection Medicilline.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Digidoc2030Page,
});

const DIGIDOCS_INNOVATIONS = [
  {
    year: "2030",
    title: "La génomique en pratique clinique",
    text: "Le séquençage sort du labo pour guider directement les décisions cliniques.",
    color: "var(--pink)",
  },
  {
    year: "2028",
    title: "L'avènement des jumeaux numériques",
    text: "Une réplique virtuelle du patient pour simuler les traitements avant de les appliquer.",
    color: "var(--orange)",
  },
  {
    year: "Déjà là",
    title: "Robot-préleveur",
    text: "La prise de sang automatisée : déjà une réalité.",
    color: "var(--yellow)",
  },
  {
    year: "Déjà là",
    title: "Des IA à prescrire",
    text: "C'est déjà le cas en Allemagne.",
    color: "var(--blue)",
  },
  {
    year: "Déjà là",
    title: "Renouvellement d'ordonnances sans médecin",
    text: "C'est déjà une réalité, maintenant.",
    color: "var(--purple)",
  },
  {
    year: "Déjà là",
    title: "Le clone du Dr Mao",
    text: "Déjà 100 millions de visites.",
    color: "var(--pink)",
  },
  {
    year: "Déjà là",
    title: "Les « 3 familles de Biotech »",
    text: "Trois mindsets différents qui redessinent la filière.",
    color: "var(--orange)",
  },
];

function Digidoc2030Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="bg-[linear-gradient(135deg,#10b981,var(--purple),var(--pink))] gradient-pan">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:grid-cols-[1fr_300px] md:py-20">
          <div className="fade-in-pop max-w-2xl">
            <Link
              to="/"
              className="inline-flex rounded-full border-2 border-ink bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[var(--ink)]"
            >
              ← Medicilline
            </Link>
            <span className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-[var(--yellow)] px-3 py-1 text-xs font-black uppercase tracking-widest text-[var(--ink)] chip-shadow">
              Sortie le 12 décembre
            </span>
            <h1 className="mt-4 font-display text-5xl leading-tight text-white md:text-6xl">
              Digidoc <span className="text-[var(--yellow)]">2030</span>
            </h1>
            <p className="mt-3 font-display text-xl text-[var(--yellow)]">
              Les 18 ruptures technologiques, en cours, qui réinventent la
              médecine.
            </p>
            <p className="mt-4 text-white/90">
              133 visuels pédagogiques pour comprendre les innovations qui vont
              changer la médecine d&apos;ici 2030 — IA, imagerie, robotique,
              médecine de précision. Signé Dr Guillaume Zagury.
            </p>
            <a
              href="mailto:contact@medicilline.ai?subject=Digidoc%202030"
              className="mt-8 inline-flex rounded-full border-2 border-ink bg-[var(--yellow)] px-6 py-3 font-semibold text-[var(--ink)] chip-shadow transition hover:-translate-y-1 hover:chip-shadow-lg"
            >
              Être prévenu de la sortie →
            </a>
          </div>
          <div className="fade-in-pop order-first md:order-last">
            <img
              src={digidocCover.url}
              alt="Couverture de Digidoc 2030, par le Dr Guillaume Zagury"
              className="mx-auto w-full max-w-[300px] rotate-[-2deg] rounded-xl transition duration-500 hover:rotate-0 hover:scale-105 drop-shadow-[0_18px_30px_rgba(0,0,0,0.45)]"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <h2 className="font-display text-3xl md:text-4xl">
          Au sommaire
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DIGIDOCS_INNOVATIONS.map((it, i) => (
            <article
              key={it.title}
              className="fade-in-pop group rounded-2xl border-2 border-ink bg-card p-6 chip-shadow transition duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:chip-shadow-lg"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <span
                className="inline-flex rounded-full border-2 border-ink px-3 py-1 text-xs font-bold"
                style={{ background: it.color, color: "var(--ink)" }}
              >
                {it.year}
              </span>
              <h3 className="mt-4 font-display text-2xl leading-tight">
                {it.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{it.text}</p>
            </article>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          Prix et couverture définitive à venir.
        </p>
      </section>
    </div>
  );
}
