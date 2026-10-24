import { createFileRoute, Link } from "@tanstack/react-router";
import iaMinuteCover from "@/assets/ia-minute-cover.jpg.asset.json";


export const Route = createFileRoute("/ia-minute")({
  head: () => ({
    meta: [
      { title: "IA Minute — L'IA en médecine, en couleur | Medicilline" },
      {
        name: "description",
        content:
          "IA Minute : le livre qui explique aux médecins comment utiliser l'intelligence artificielle au quotidien. Visuels, cas cliniques et prompts prêts à l'emploi.",
      },
      { property: "og:title", content: "IA Minute — L'IA en médecine, en couleur" },
      {
        property: "og:description",
        content:
          "Le guide visuel de l'IA pour les médecins : diagnostic, rédaction, veille, éthique. Nouvelle collection Medicilline.",
      },
      { property: "og:type", content: "book" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IaMinutePage,
});

const PRICE_PLACEHOLDER = "XX,XX €";

const CHAPTERS = [
  {
    n: "01",
    color: "var(--pink)",
    title: "L'IA en 10 minutes",
    text: "Les bases sans jargon : modèles, prompts, hallucinations, limites cliniques.",
  },
  {
    n: "02",
    color: "var(--orange)",
    title: "Aide au diagnostic",
    text: "Cas cliniques commentés, checklists, et où l'IA se trompe (vraiment).",
  },
  {
    n: "03",
    color: "var(--yellow)",
    title: "Écrire plus vite",
    text: "Comptes-rendus, courriers, synthèses : 40 prompts prêts à copier.",
  },
  {
    n: "04",
    color: "var(--blue)",
    title: "Veille & recherche",
    text: "Trier la littérature, résumer un article, vérifier une source.",
  },
  {
    n: "05",
    color: "var(--purple)",
    title: "Patients & pédagogie",
    text: "Expliquer, traduire, vulgariser — sans perdre la nuance médicale.",
  },
  {
    n: "06",
    color: "var(--pink)",
    title: "Éthique & RGPD",
    text: "Données de santé, secret médical, responsabilité : le cadre clair.",
  },
  {
    n: "07",
    color: "var(--yellow)",
    title: "Choisir ses outils IA",
    text: "Comparatif des outils cliniques : forces, limites, bon usage au quotidien.",
  },
  {
    n: "08",
    color: "var(--blue)",
    title: "L'IA de demain",
    text: "Tendances, prochaines ruptures, comment rester à jour sans perdre de temps.",
  },
];

const BULLETS = [
  "244 pages tout en couleur",
  "Schémas et visuels sur chaque double page",
  "40+ prompts médicaux prêts à l'emploi",
  "Cas cliniques réels commentés",
  "Format poche, lisible en 1 minute par notion",
];

// --- Slogans cliquables : chaque titre propose 3 alternatives -------------

const HERO_TITLE_SLOGANS = [
  { title: "Tout comprendre en couleur, en une minute." },
  { title: "Former les médecins de demain à l'IA médicale." },
  { title: "Comprendre l'IA médicale en couleur." },
];

const HERO_SUB_SLOGANS = [
  {
    title:
      "Un concept par double page, en visuels clairs : l'essentiel de l'IA médicale, sans perdre de temps.",
  },
  {
    title:
      "Un livre pratique pour intégrer l'intelligence artificielle dans la médecine de demain, dès aujourd'hui.",
  },
  {
    title:
      "Un livre visuel et concret : ce que l'IA change à votre pratique, comment l'utiliser au quotidien, et où sont les pièges. Des explications en quelques minutes, avec des visuels clairs.",
  },
];

const VISUAL_CONCEPTS_TITLE = "Comprendre l'IA en couleur, en quelques minutes.";

function IaMinutePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <Hero />
      <Bullets />
      <Chapters />
      <VisualConcepts />
      <Spreads />
      <Upcoming />

      <Buy />
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
        <div className="flex items-center gap-4">
          <a href="#a-paraitre" className="text-sm font-semibold hover:text-[var(--purple)]">
            À paraître
          </a>
          <a
            href="#acheter"
            className="rounded-full border-2 border-ink bg-[var(--pink)] px-4 py-2 text-sm font-semibold text-white chip-shadow transition hover:-translate-y-0.5"
          >
            Précommander
          </a>
        </div>
      </div>
    </header>
  );
}


function CoverPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative aspect-[2/3] overflow-hidden rounded-2xl border-2 border-ink bg-[var(--ink)] chip-shadow-lg ${className}`}
    >
      <img
        src={iaMinuteCover.url}
        alt="Couverture L'IA Minute pour le médecin — Dr Guillaume Zagury & Samuel De Queiroz"
        className="h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/25 blur-md shine-sweep" />
    </div>
  );
}


function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--yellow)] opacity-70 blur-2xl" />
      <div className="pointer-events-none absolute -left-24 top-52 h-72 w-72 rounded-full bg-[var(--blue)] opacity-40 blur-2xl" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
        <div className="fade-in-pop">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-[var(--yellow)] px-3 py-1 text-xs font-bold uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--pink)] pulse-ring" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--pink)]" />
            </span>
            Sortie le 13 novembre
          </span>
          <h1 className="mt-5 font-display text-5xl leading-[1.05] md:text-6xl">
            IA Minute,{" "}
            <span className="bg-[linear-gradient(90deg,var(--pink),var(--orange),var(--purple),var(--blue),var(--pink))] bg-clip-text text-transparent color-cycle">
              un livre augmenté pour tout comprendre rapidement{" "}
              sur l&apos;IA.
            </span>
          </h1>
          <p className="mt-5 max-w-lg text-lg text-ink/70">
            {HERO_SUB_SLOGANS[0].title}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#acheter"
              className="rounded-full border-2 border-ink bg-[var(--pink)] px-6 py-3 font-semibold text-white chip-shadow transition hover:-translate-y-1 hover:chip-shadow-lg"
            >
              Précommander — {PRICE_PLACEHOLDER}
            </a>
            <a
              href="#dedans"
              className="rounded-full border-2 border-ink bg-[var(--cream)] px-6 py-3 font-semibold transition hover:-translate-y-1"
            >
              Voir l'intérieur
            </a>
          </div>
        </div>
        <div className="fade-in-pop [animation-delay:150ms]">
          <div className="float-soft mx-auto max-w-xs">
            <CoverPlaceholder />
          </div>
        </div>
      </div>
      <div className="overflow-hidden border-y-2 border-ink bg-[var(--purple)] py-3">
        <div className="marquee-x flex w-max gap-8 whitespace-nowrap text-sm font-bold uppercase tracking-widest text-white">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex gap-8">
              {["Prompts médicaux", "Cas cliniques", "Tout en couleur", "RGPD & éthique", "Comprendre l'IA en quelques minutes", "Nouvelle collection"].map(
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

const BULLET_COLORS = [
  { bg: "bg-[var(--pink)]", fg: "text-white" },
  { bg: "bg-[var(--orange)]", fg: "text-white" },
  { bg: "bg-[var(--yellow)]", fg: "text-[var(--ink)]" },
  { bg: "bg-[var(--purple)]", fg: "text-white" },
  { bg: "bg-[var(--blue)]", fg: "text-white" },
];

function Bullets() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="grid gap-4 md:grid-cols-5">
        {BULLETS.map((b, i) => {
          const c = BULLET_COLORS[i % BULLET_COLORS.length];
          return (
            <div
              key={b}
              className={`fade-in-pop rounded-2xl border-2 border-ink ${c.bg} ${c.fg} p-5 text-sm font-semibold chip-shadow transition duration-300 hover:-translate-y-1 hover:scale-[1.03]`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {b}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Chapters() {
  return (
    <section id="dedans" className="mx-auto max-w-6xl px-5 pb-16">
      <h2 className="font-display text-4xl md:text-5xl">
        8 chapitres pour comprendre l&apos;
        <span className="bg-[linear-gradient(90deg,var(--blue),var(--pink))] bg-clip-text italic text-transparent">
          IA
        </span>
        .
      </h2>
      <p className="mt-3 max-w-xl text-ink/70">
        8 chapitres, zéro blabla. Chaque double page = un visuel + un usage
        clinique concret.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {CHAPTERS.map((c, i) => (
          <article
            key={c.n}
            className="fade-in-pop group relative overflow-hidden rounded-3xl border-2 border-ink bg-white p-6 chip-shadow transition duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:chip-shadow-lg"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <div
              className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-70 transition duration-500 group-hover:scale-150"
              style={{ background: c.color }}
            />
            <p className="relative font-display text-3xl">{c.n}</p>
            <h3 className="relative mt-2 text-lg font-bold">{c.title}</h3>
            <p className="relative mt-2 text-sm text-ink/70">{c.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function VisualConcepts() {
  const cards = [
    {
      color: "var(--pink)",
      tag: "Bases",
      title: "Qu'est-ce qu'un prompt ?",
      text: "Une consigne donnée à l'IA. Bien formulée, elle donne un résultat fiable. Mal formulée, elle invente.",
      visual: "Prompt → Réponse → Vérifier",
    },
    {
      color: "var(--blue)",
      tag: "Diagnostic",
      title: "Aide au diagnostic",
      text: "L'IA propose des hypothèses. Le médecin garde le dernier mot, la responsabilité et la relation patient.",
      visual: "Symptômes → Hypothèses → Décision",
    },
    {
      color: "var(--orange)",
      tag: "Pièges",
      title: "Les hallucinations",
      text: "L'IA peut inventer des références, des chiffres, des symptômes. Toujours vérifier avant d'agir.",
      visual: "IA dit ✓ → Vérifier sources → Confirmer",
    },
    {
      color: "var(--yellow)",
      tag: "Productivité",
      title: "Rédiger plus vite",
      text: "Courriers, comptes-rendus, synthèses : 40 prompts médicaux prêts à adapter à votre style.",
      visual: "Notes → Prompt → Texte propre",
    },
    {
      color: "var(--purple)",
      tag: "Éthique",
      title: "RGPD & secret médical",
      text: "Pas de données patients dans les outils publics. Anonymiser, vérifier le DPO, documenter.",
      visual: "Données → Anonymiser → Valider",
    },
    {
      color: "var(--pink)",
      tag: "Pédagogie",
      title: "Expliquer aux patients",
      text: "Traduire une pathologie, un traitement, un examen — sans perdre la nuance et sans infantiliser.",
      visual: "Terme médical → Analogie → Vérifier",
    },
  ];

  return (
    <section className="border-y-2 border-ink bg-[var(--cream)] py-16">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="font-display text-4xl md:text-5xl">{VISUAL_CONCEPTS_TITLE}</h2>
        <p className="mt-3 max-w-xl text-ink/70">
          Des visuels provisoires qui montrent comment chaque concept médical se traduit en usage concret de l&apos;IA.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => (
            <article
              key={c.title}
              className="fade-in-pop group relative overflow-hidden rounded-3xl border-2 border-ink bg-white p-6 chip-shadow transition duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:chip-shadow-lg"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <div
                className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-70 transition duration-500 group-hover:scale-150"
                style={{ background: c.color }}
              />
              <span
                className="relative w-fit rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white"
                style={{ background: c.color }}
              >
                {c.tag}
              </span>
              <h3 className="relative mt-4 text-lg font-bold">{c.title}</h3>
              <p className="relative mt-2 text-sm text-ink/70">{c.text}</p>
              <div className="relative mt-5 rounded-xl border-2 border-dashed border-ink/30 bg-[var(--cream)] p-4 text-center font-mono text-xs font-semibold text-ink/60">
                {c.visual}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Spreads() {
  const items = [
    { c: "var(--pink)", t: "Schémas cliniques" },
    { c: "var(--blue)", t: "Prompts annotés" },
    { c: "var(--yellow)", t: "Cas commentés" },
    { c: "var(--purple)", t: "Fiches mémo" },
  ];
  return (
    <section className="border-y-2 border-ink bg-[var(--cream)] py-16">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="font-display text-4xl md:text-5xl">Aperçu des pages</h2>
        <p className="mt-3 text-ink/70">Visuels provisoires — maquettes en cours.</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <div
              key={it.t}
              className="fade-in-pop aspect-[3/4] overflow-hidden rounded-2xl border-2 border-ink chip-shadow transition duration-300 hover:-translate-y-2 hover:rotate-1"
              style={{ animationDelay: `${i * 100}ms`, background: it.c }}
            >
              <div className="flex h-full flex-col justify-end p-4">
                <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold">
                  {it.t}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const UPCOMING = [
  {
    title: "IA Minute : IA Générative pour les médecins",
    subtitle: "Le volume fondateur",
    tag: "Générative",
    color: "var(--pink)",
    status: "Sortie le 13 novembre",
    desc: "Les bases de l'IA générative en clinique : rédaction, synthèses, aide au diagnostic, prompts prêts à l'emploi.",
    lead: true,
  },
  {
    title: "IA Minute : l'automatisation pour les médecins",
    subtitle: "L'automatisation du cabinet",
    tag: "En préparation",
    color: "var(--yellow)",
    status: "À paraître",
    desc: "Automatiser le quotidien : courriers, comptes rendus, veille, prise de rendez-vous et suivi patient.",
  },
  {
    title: "IA Minute ORL",
    subtitle: "Oto-rhino-laryngologie",
    tag: "En préparation",
    color: "var(--blue)",
    status: "À paraître",
    desc: "Otoscopie assistée, audiométrie, dépistage des lésions laryngées, dictée opératoire automatisée.",
  },
  {
    title: "IA Minute Gynécologie",
    subtitle: "Gynécologie & obstétrique",
    tag: "En préparation",
    color: "var(--purple)",
    status: "À paraître",
    desc: "Échographie augmentée, dépistage cervical, suivi de grossesse, tri des consultations.",
  },
  {
    title: "IA Minute Psychiatrie",
    subtitle: "Santé mentale",
    tag: "En préparation",
    color: "var(--orange)",
    status: "À paraître",
    desc: "Entretien assisté, repérage du risque suicidaire, aide à la prescription, éthique et limites.",
  },
];

function MiniCover({ title, color }: { title: string; color: string }) {
  return (
    <div
      className="relative aspect-[2/3] overflow-hidden rounded-xl border-2 border-ink chip-shadow"
      style={{ background: color }}
    >
      <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
        <span className="w-fit rounded-full border border-white/60 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest">
          Collection
        </span>
        <div>
          <p className="font-display text-2xl leading-none">IA</p>
          <p className="font-display text-2xl leading-none">Minute</p>
          <p className="mt-2 text-[11px] font-semibold leading-tight opacity-90">
            {title.replace("IA Minute ", "").replace("IA Minute", "")}
          </p>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/25 blur-md shine-sweep" />
    </div>
  );
}

function Upcoming() {
  return (
    <section id="a-paraitre" className="mx-auto max-w-6xl px-5 py-20">
      <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider chip-shadow">
        <span className="h-2 w-2 rounded-full bg-[var(--pink)] pulse-ring" />
        À paraître
      </span>
      <h2 className="mt-5 font-display text-4xl font-black leading-tight md:text-5xl">
        Une IA Minute par spécialité :{" "}
        <span className="text-[var(--pink)]">tronc commun</span>,{" "}
        <span className="text-[var(--blue)]">spécifique</span>.
      </h2>
      <p className="mt-4 max-w-2xl text-lg text-ink/75">
        Le même format, la même pédagogie en couleur, décliné spécialité par
        spécialité — avec les usages automatisés propres à chaque pratique.
        Couvertures et prix provisoires.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {UPCOMING.map((item, i) => (
          <article
            key={item.title}
            className={`fade-in-pop group flex gap-5 rounded-3xl border-2 border-ink bg-card p-5 chip-shadow transition duration-300 hover:-translate-y-2 hover:chip-shadow-lg ${
              item.lead ? "sm:col-span-2 lg:col-span-3 sm:items-center" : ""
            }`}
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <div
              className={`shrink-0 transition duration-500 group-hover:rotate-2 ${item.lead ? "w-32" : "w-24"}`}
            >
              {item.lead ? (
                <CoverPlaceholder />
              ) : (
                <MiniCover title={item.title} color={item.color} />
              )}

            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full border-2 border-ink px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white"
                  style={{ background: item.color }}
                >
                  {item.tag}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-ink/50">
                  {item.status}
                </span>
              </div>
              <h3
                className={`mt-3 font-display leading-tight ${item.lead ? "text-3xl md:text-4xl" : "text-xl"}`}
              >
                {item.title}
              </h3>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
                {item.subtitle}
              </p>
              <p className={`mt-3 text-ink/75 ${item.lead ? "max-w-2xl" : "text-sm"}`}>
                {item.desc}
              </p>
              <p className="mt-4 font-display text-2xl">{PRICE_PLACEHOLDER}</p>
              <a
                href={`mailto:contact@medicilline.ai?subject=${encodeURIComponent(
                  `Intérêt — ${item.title}`,
                )}`}
                className="mt-4 inline-flex rounded-full border-2 border-ink bg-[var(--yellow)] px-5 py-2 text-sm font-semibold text-[var(--ink)] chip-shadow transition hover:-translate-y-0.5"
              >
                {item.lead ? "Précommander" : "Être prévenu"}
              </a>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 rounded-[2rem] border-2 border-dashed border-ink/30 p-6 text-sm text-ink/70">
        Une spécialité manque ? Écris-nous : chaque volume est construit avec des
        praticiens du terrain.
      </div>
    </section>
  );
}

function Buy() {

  return (
    <section id="acheter" className="mx-auto max-w-6xl px-5 py-20">
      <div className="grid items-center gap-10 rounded-[2rem] border-2 border-ink bg-[linear-gradient(135deg,var(--pink),var(--purple),var(--blue))] gradient-pan p-8 chip-shadow-lg md:grid-cols-[240px_1fr] md:p-12">
        <div className="float-soft">
          <CoverPlaceholder />
        </div>
        <div className="text-white">
          <h2 className="font-display text-4xl md:text-5xl">IA Minute</h2>
          <p className="mt-3 max-w-lg opacity-90">
            Collection IA Minute — Medicilline. Sortie prévue 2026. Réservez
            votre exemplaire de la première édition.
          </p>
          <p className="mt-6 font-display text-5xl">{PRICE_PLACEHOLDER}</p>
          <p className="text-sm opacity-80">Prix indicatif — à confirmer</p>
          <div className="mt-7 flex flex-wrap gap-4">
            <a
              href="mailto:contact@medicilline.ai?subject=Pr%C3%A9commande%20IA%20Minute"
              className="rounded-full border-2 border-ink bg-[var(--yellow)] px-6 py-3 font-semibold text-[var(--ink)] chip-shadow transition hover:-translate-y-1"
            >
              Précommander
            </a>
            <Link
              to="/"
              className="rounded-full border-2 border-ink bg-white px-6 py-3 font-semibold text-[var(--ink)] transition hover:-translate-y-1"
            >
              Retour au catalogue
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function PageFooter() {
  return (
    <footer className="border-t-2 border-ink py-10 text-center text-sm text-ink/60">
      © {new Date().getFullYear()} Medicilline — Collection IA Minute
    </footer>
  );
}
