import { createFileRoute, Link } from "@tanstack/react-router";
import { NewsletterForm } from "@/components/newsletter-form";

export const Route = createFileRoute("/academie")({
  head: () => ({
    meta: [
      { title: "Médicilline Académie — l'académie digitale de Médicilline | En construction" },
      {
        name: "description",
        content:
          "Médicilline Académie : l'académie digitale de Médicilline pour tout comprendre — IA médicale, protocoles et nouveautés cliniques, en formats courts et visuels. Bientôt disponible.",
      },
      { property: "og:title", content: "Médicilline Académie — bientôt disponible" },
      {
        property: "og:description",
        content:
          "L'académie digitale de Médicilline pour tout comprendre. En construction — inscris-toi pour être prévenu à l'ouverture.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AcademiePage,
});

const MODULES = [
  {
    n: "01",
    color: "var(--pink)",
    title: "L'IA en médecine",
    text: "Comprendre les bases, les usages et les limites de l'IA au quotidien clinique.",
  },
  {
    n: "02",
    color: "var(--orange)",
    title: "Prompts & outils",
    text: "Des fiches pratiques et des prompts médicaux prêts à l'emploi, testés et commentés.",
  },
  {
    n: "03",
    color: "var(--yellow)",
    title: "Protocoles & mémos",
    text: "Les essentiels de la collection Médicilline, en version courte et interactive.",
  },
  {
    n: "04",
    color: "var(--blue)",
    title: "Cas cliniques",
    text: "Des situations réelles décryptées, pour ancrer la théorie dans la pratique.",
  },
  {
    n: "05",
    color: "var(--purple)",
    title: "Éthique & RGPD",
    text: "Le cadre légal et déontologique de l'IA en santé, expliqué simplement.",
  },
  {
    n: "06",
    color: "var(--pink)",
    title: "Spécialités",
    text: "Des parcours dédiés : ORL, gynécologie, psychiatrie, et bien d'autres à venir.",
  },
];

const STEPS = [
  { label: "Cadrage du programme", done: true },
  { label: "Production des modules", done: true },
  { label: "Plateforme & inscriptions", done: false },
  { label: "Ouverture au public", done: false },
];

function AcademiePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <Hero />
      <Progress />
      <Modules />
      <NotifyMe />
      <PageFooter />
    </div>
  );
}

function TopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-[var(--cream)]/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="text-sm font-semibold hover:text-[var(--pink)]">
          ← Medicilline
        </Link>
        <a
          href="#prevenir"
          className="rounded-full border-2 border-ink bg-[var(--pink)] px-4 py-2 text-sm font-semibold text-white chip-shadow transition hover:-translate-y-0.5"
        >
          Être prévenu
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--yellow)] opacity-70 blur-2xl" />
      <div className="pointer-events-none absolute -left-24 top-52 h-72 w-72 rounded-full bg-[var(--blue)] opacity-40 blur-2xl" />
      <div className="mx-auto max-w-3xl px-5 py-20 text-center md:py-28">
        <span className="fade-in-pop inline-flex items-center gap-2 rounded-full border-2 border-ink bg-[var(--yellow)] px-3 py-1 text-xs font-bold uppercase tracking-widest">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--pink)] pulse-ring" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--pink)]" />
          </span>
          🚧 En construction
        </span>
        <h1 className="fade-in-pop mt-5 font-display text-5xl leading-[1.05] md:text-6xl">
          Médicilline{" "}
          <span className="bg-[linear-gradient(90deg,var(--pink),var(--orange),var(--purple),var(--blue),var(--pink))] bg-clip-text text-transparent color-cycle">
            Académie
          </span>
        </h1>
        <p className="fade-in-pop mx-auto mt-5 max-w-xl text-lg text-ink/70 [animation-delay:100ms]">
          L'académie digitale de Médicilline pour tout comprendre : l'IA en
          médecine, les protocoles et les nouveautés cliniques, en formats
          courts et visuels.
        </p>
        <div className="fade-in-pop mt-8 flex flex-wrap items-center justify-center gap-4 [animation-delay:150ms]">
          <a
            href="#prevenir"
            className="rounded-full border-2 border-ink bg-[var(--pink)] px-6 py-3 font-semibold text-white chip-shadow transition hover:-translate-y-1 hover:chip-shadow-lg"
          >
            Être prévenu à l'ouverture
          </a>
          <Link
            to="/ia-minute"
            className="rounded-full border-2 border-ink bg-[var(--cream)] px-6 py-3 font-semibold transition hover:-translate-y-1"
          >
            Voir IA Minute
          </Link>
        </div>
      </div>
      <div className="overflow-hidden border-y-2 border-ink bg-[var(--purple)] py-3">
        <div className="marquee-x flex w-max gap-8 whitespace-nowrap text-sm font-bold uppercase tracking-widest text-white">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex gap-8">
              {["Bientôt disponible", "En construction", "Tout comprendre", "IA médicale", "Formats courts", "Médicilline Académie"].map(
                (t) => (
                  <span key={t}>{t} ✦</span>
                ),
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Progress() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-16">
      <h2 className="text-center font-display text-3xl md:text-4xl">
        Le chantier avance
      </h2>
      <p className="mt-3 text-center text-ink/70">
        La plateforme est en cours de construction. Voici où on en est.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-4">
        {STEPS.map((s, i) => (
          <div
            key={s.label}
            className={`fade-in-pop rounded-2xl border-2 border-ink p-4 text-center text-sm font-semibold chip-shadow ${
              s.done ? "bg-[var(--yellow)]" : "bg-white text-ink/50"
            }`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <span className="block text-xs font-bold uppercase tracking-widest">
              {s.done ? "✓ Fait" : "À venir"}
            </span>
            <span className="mt-2 block">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Modules() {
  return (
    <section className="border-y-2 border-ink bg-[var(--cream)] py-16">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="font-display text-4xl md:text-5xl">
          Ce qu'il y aura dedans
        </h2>
        <p className="mt-3 max-w-xl text-ink/70">
          Des modules courts et visuels, pensés pour apprendre vite — pendant
          une pause, entre deux consultations.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {MODULES.map((m, i) => (
            <article
              key={m.n}
              className="fade-in-pop group relative overflow-hidden rounded-3xl border-2 border-ink bg-white p-6 chip-shadow transition duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:chip-shadow-lg"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <div
                className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-70 transition duration-500 group-hover:scale-150"
                style={{ background: m.color }}
              />
              <span className="relative inline-flex rounded-full border-2 border-ink bg-[var(--cream)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-ink/60">
                Bientôt
              </span>
              <p className="relative mt-3 font-display text-3xl">{m.n}</p>
              <h3 className="relative mt-2 text-lg font-bold">{m.title}</h3>
              <p className="relative mt-2 text-sm text-ink/70">{m.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function NotifyMe() {
  return (
    <section id="prevenir" className="mx-auto max-w-3xl px-5 py-20">
      <NewsletterForm compact />
      <div className="mt-6 rounded-[2rem] border-2 border-dashed border-ink/30 p-6 text-center text-sm text-ink/70">
        Laisse ton email ci-dessus pour être prévenu dès l'ouverture de
        Médicilline Académie — aucun spam, une info le jour du lancement.
      </div>
    </section>
  );
}

function PageFooter() {
  return (
    <footer className="border-t-2 border-ink py-10 text-center text-sm text-ink/60">
      © {new Date().getFullYear()} Medicilline — Médicilline Académie (en construction)
    </footer>
  );
}
