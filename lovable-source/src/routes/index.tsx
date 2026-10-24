import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
const GUILLAUME_IMG =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTssGAxgVTdWX7FM9ICiY-2KTSEG_L0hq1sMXBOz-MvtGR-ENHHjxxuhXZOzSbgGhZYLZbsc-Sd-YZPZIZByNHR14c659XcA4FRM1WQBMo&s=10";
import logoAsset from "@/assets/logo_v3.png.asset.json";
import iaMinuteCover from "@/assets/ia-minute-cover.jpg.asset.json";
import digidocCover from "@/assets/digidoc-2030-cover.png.asset.json";
import guillaumePhoto from "@/assets/guillaume-zagury.webp.asset.json";
import anatoleMelletPhoto from "@/assets/anatole-mellet.png.asset.json";

import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { NewsletterForm } from "@/components/newsletter-form";
import { WaveText } from "@/components/wave-text";
import { MobileNav } from "@/components/mobile-nav";
import { ContactButton, DesktopNav, NAV_MOBILE_ITEMS } from "@/components/nav-menu";
import { AiLogosBanner } from "@/components/ai-logos-banner";
import { CATEGORIE_LABELS, PROMPTS_TRIES, categoriesDisponibles } from "@/lib/prompts";
import { OUTIL_LABELS, TUTORIELS_PAR_PARCOURS } from "@/lib/tutoriels";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Medicilline — L'éditeur IA de la Médecine de demain." },
      { property: "og:title", content: "Medicilline — L'éditeur IA de la Médecine de demain." },
      { property: "og:description", content: "Des livres pédagogiques et colorés, des prompts et des tutoriels pour découvrir l'IA médicale avec Medicilline." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "description",
        content:
          "Catalogue Medicilline : mémos, protocoles, ECNi, infirmier, grand public. Des livres pédagogiques et colorés pour les soignants d'aujourd'hui.",
      },
    ],
  }),
  component: Index,
});

type ColorKey = "pink" | "orange" | "yellow" | "purple" | "blue";

type Category = "Tous" | "Internat & ECNi" | "Infirmier" | "Protocoles" | "Grand public";

type Book = {
  title: string;
  author?: string;
  price: number;
  category: Exclude<Category, "Tous">;
  isbn?: string;
  isbn10?: string;
  amazon?: string;
  desc?: string;
  longDesc?: string;
  pages?: number;
  color: ColorKey;
  featured?: boolean;
  outOfStock?: boolean;
  comingSoon?: string;
  coverUrl?: string;
};

const CATEGORIES: Category[] = ["Tous", "Internat & ECNi", "Grand public"];

const amz = (id: string) => `https://www.amazon.fr/dp/${id}`;
const cov = (id: string) => `https://images-na.ssl-images-amazon.com/images/P/${id}.jpg`;

const BOOKS: Book[] = [
  {
    title: "IA Minute : IA Générative pour les médecins",
    author: "Dr Guillaume Zagury",
    price: 0,
    category: "Grand public",
    desc: "Les bases de l'IA générative en clinique : rédaction, synthèses, aide au diagnostic, prompts prêts à l'emploi.",
    color: "pink",
    coverUrl: iaMinuteCover.url,
    featured: true,
    comingSoon: "Sortie le 13 novembre",
  },
  {
    title: "Digidoc 2030",
    author: "Dr Guillaume Zagury",
    price: 0,
    category: "Grand public",
    desc: "18 ruptures technologiques qui vont changer la médecine d'ici 2030. 133 visuels pédagogiques.",
    color: "blue",
    coverUrl: digidocCover.url,
    featured: true,
    comingSoon: "Sortie le 12 décembre",
  },
  {
    title: "Medi-Mémo-Minute",
    author: "Dr Guillaume Zagury",
    price: 24.9,
    category: "Internat & ECNi",
    isbn: "9782915220964",
    isbn10: "2915220964",
    amazon: amz("2915220964"),
    desc: "666 astuces mnémotechniques pour booster la mémorisation. Le compagnon de poche.",
    color: "yellow",
    featured: true,
  },
  {
    title: "Santé publique — Médecine du travail, médecine légale",
    author: "Dr Guillaume Zagury & Mickaël Benzaqui",
    price: 0,
    category: "Internat & ECNi",
    isbn: "9782915220391",
    isbn10: "2915220395",
    amazon: amz("2915220395"),
    desc: "Collection 100 % ECN. Tout le module 1 : cours et fiches flash 45″ et 15″, annales corrigées, mémos et astuces de conférencier.",
    longDesc:
      "L’intégralité du module 1 du programme de l’ECN — santé publique, médecine du travail et médecine légale — validée par des MCU-PH et PU-PH et mise à jour des dernières réformes. Cours et fiches flash 45″ et 15″, annales corrigées, mémos et astuces de conférencier, et 200 pages d’annexes. Préface du Pr D. Bertrand, Université Paris Diderot.",
    color: "orange",
    coverUrl: "/sante-publique-cover.jpg",
    outOfStock: true,
  },
  {
    title: "COVID XXI — Première pandémie de l'ère digitale",
    author: "Dr Guillaume Zagury",
    price: 20,
    category: "Grand public",
    isbn: "9782492552052",
    isbn10: "2492552055",
    amazon: amz("2492552055"),
    desc: "166 visuels inédits. Une grille de lecture techno-scientifique d'un crash test mondial.",
    color: "purple",
    coverUrl: "/covid-xxi-cover.png",
    featured: true,
    outOfStock: true,
  },
  {
    title: "Baby Mémo — 100 % photos, 100 % pratique",
    author: "Dr Guillaume Zagury & Anne Lemmens",
    price: 9.9,
    category: "Grand public",
    isbn: "9782915220230",
    isbn10: "2915220239",
    amazon: amz("2915220239"),
    pages: 453,
    desc: "L'intégrale de l'éveil psychomoteur de bébé, de J1 à J365, racontée en photos.",
    longDesc:
      "« 1 image vaut 1 000 mots. » Forts de ce constat, les deux auteurs — eux-mêmes « jeunes » parents — ont privilégié l'abord visuel et pédagogique (zoom, fléchage…) pour vous fournir l'intégrale de l'éveil psychomoteur de l'enfant de J1 à J365. Une équipe pluridisciplinaire (médecin, pédiatre, pédopsychiatre, sage-femme, puéricultrice, linguiste, infographiste, photographe… et jeunes parents !) avec un souci permanent : la rigueur scientifique, par une validation constante des données, et le visuel « parlant » qui fait comprendre d'un coup d'œil.",
    color: "orange",
    coverUrl: "/baby-memo-cover.jpg",
  },
  {
    title: "IA Minute : l'automatisation pour les médecins",
    author: "Dr Guillaume Zagury",
    price: 0,
    category: "Grand public",
    desc: "Automatiser le quotidien : courriers, comptes rendus, veille, prise de rendez-vous et suivi patient.",
    color: "yellow",
    comingSoon: "À paraître",
  },
  {
    title: "IA Minute ORL",
    author: "Dr Guillaume Zagury",
    price: 0,
    category: "Grand public",
    desc: "Otoscopie assistée, audiométrie, dépistage des lésions laryngées, dictée opératoire automatisée.",
    color: "blue",
    comingSoon: "À paraître",
  },
  {
    title: "IA Minute Gynécologie",
    author: "Dr Guillaume Zagury",
    price: 0,
    category: "Grand public",
    desc: "Échographie augmentée, dépistage cervical, suivi de grossesse, tri des consultations.",
    color: "purple",
    comingSoon: "À paraître",
  },
  {
    title: "IA Minute Psychiatrie",
    author: "Dr Guillaume Zagury",
    price: 0,
    category: "Grand public",
    desc: "Entretien assisté, repérage du risque suicidaire, aide à la prescription, éthique et limites.",
    color: "orange",
    comingSoon: "À paraître",
  },
];

const COLOR_BG: Record<ColorKey, string> = {
  pink: "bg-[var(--pink)]",
  orange: "bg-[var(--orange)]",
  yellow: "bg-[var(--yellow)]",
  purple: "bg-[var(--purple)]",
  blue: "bg-[var(--blue)]",
};
const COLOR_FG: Record<ColorKey, string> = {
  pink: "text-white",
  orange: "text-white",
  yellow: "text-[var(--ink)]",
  purple: "text-white",
  blue: "text-white",
};
const COLOR_TEXT: Record<ColorKey, string> = {
  pink: "text-[var(--pink)]",
  orange: "text-[var(--orange)]",
  yellow: "text-[var(--yellow)]",
  purple: "text-[var(--purple)]",
  blue: "text-[var(--blue)]",
};

// --- Slogans cliquables : chaque titre propose 3 alternatives -------------

const HERO_SLOGANS = [
  {
    title: (
      <span className="block">
        <span className="text-[var(--blue)]">L&apos;éditeur</span>{" "}
        <span className="bg-[linear-gradient(90deg,var(--blue),var(--pink))] bg-clip-text italic text-transparent">
          IA
        </span>{" "}
        <span className="text-[var(--blue)]">de la</span>
        <br />
        <span className="text-[var(--blue)]">Médecine de</span>{" "}
        <span className="text-[var(--pink)]">demain.</span>
      </span>
    ),
    subtitle:
      "Des ouvrages augmentés avec une hiérarchie visuelle et de l'interactivité pour aller à l'essentiel et gagner du temps.",
  },
  {
    title: "La maison d'édition qui forme les médecins de demain à l'IA.",
    subtitle:
      "Des ouvrages pratiques pour intégrer l'intelligence artificielle dans la pratique médicale de demain.",
  },
  {
    title: "Éditions médicales qui réveillent la médecine.",
    subtitle:
      "Depuis 2005, des livres pensés par des soignants, pour des soignants — sans jargon inutile.",
  },
];

const IA_MINUTE_SLOGANS = [
  { title: "IA Minute — L'essentiel en couleur, en une minute." },
  {
    title: (
      <>
        IA Minute — Former rapidement les médecins à la maîtrise des principales IA, «&nbsp;
        <span className="relative inline-block">
          <span className="absolute -bottom-1.5 -left-[3%] -z-10 h-[0.12em] w-[106%] -rotate-2 rounded-full bg-[var(--yellow)]" />
          <em className="relative italic">Hands on</em>
        </span>
        &nbsp;».
      </>
    ),
  },
  { title: "IA Minute — Comprendre l'IA médicale en couleur." },
];

const DIGIDOCS_TAGLINE_SLOGANS = [
  { title: "18 ruptures technologiques, décryptées en visuels clairs et colorés." },
  { title: "18 ruptures qui vont former les médecins de demain." },
  { title: "Les 18 ruptures technologiques, en cours, qui réinventent la médecine." },
];

const DIGIDOCS_DESC_SLOGANS = [
  {
    title:
      "Les innovations médicales de demain, en visuels clairs et colorés — pour comprendre vite, sans jargon.",
  },
  {
    title:
      "Le livre pour former les médecins de demain : IA, imagerie, robotique, médecine de précision.",
  },
  {
    title:
      "Les innovations médicales qui vont changer les pratiques d'ici 2030 : IA, imagerie, robotique, médecine de précision. Un ouvrage 100 % visuel, signé Dr Guillaume Zagury.",
  },
];

const CATALOGUE_SLOGANS = [
  {
    title: (
      <>
        Un objectif :<br />
        <span className="text-[var(--pink)]">apprendre vite, bien, et en couleur.</span>
      </>
    ),
  },
  {
    title: (
      <>
        2 titres. Une mission :<br />
        <span className="text-[var(--pink)]">former les médecins de demain à l&apos;IA.</span>
      </>
    ),
  },
  {
    title: (
      <>
        2 titres. Zéro blabla :<br />
        <span className="text-[var(--pink)]">que de l&apos;essentiel.</span>
      </>
    ),
  },
];

const BLOG_TEASER_SLOGANS = [
  { title: "L'IA médicale expliquée en couleur, chaque semaine." },
  { title: "Les nouveautés de l'IA médicale, chaque semaine." },
  { title: "Ce qui change vraiment en médecine : décrypté chaque semaine." },
];

function Index() {
  const [active, setActive] = useState<Category>("Tous");
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      BOOKS.filter((b) => {
        const okCat = active === "Tous" || b.category === active;
        const okQ =
          !query.trim() ||
          (b.title + " " + (b.author ?? "") + " " + (b.desc ?? ""))
            .toLowerCase()
            .includes(query.toLowerCase());
        return okCat && okQ;
      }),
    [active, query],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <AiLogosBanner />
      <Marquee />
      <IaMinuteTeaser />
      <Bibliotheques />

      <Catalogue
        active={active}
        setActive={setActive}
        query={query}
        setQuery={setQuery}
        books={filtered}
      />
      <BlogTeaser />

      <Team />
      <JoinUs />
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-stretch gap-10 px-5 py-24 lg:grid-cols-2">
        <Numbers />
        <Contact />
      </div>
      <Footer />
    </div>
  );
}

function IaMinuteTeaser() {
  return (
    <section id="ia-minute" className="mx-auto max-w-7xl px-5 py-16">
      <div className="mb-8">
        <span className="inline-flex items-center gap-3 rounded-full border-2 border-ink bg-[var(--yellow)] px-5 py-2.5 text-sm font-extrabold uppercase tracking-[0.18em] text-[var(--ink)] chip-shadow">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--pink)] pulse-ring" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-[var(--pink)]" />
          </span>
          Lancement de
          <span className="inline-flex h-9 w-9 -rotate-6 items-center justify-center rounded-full border-2 border-ink bg-[var(--pink)] font-display text-xl font-black tracking-normal text-white">
            2
          </span>
          collections
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="fade-in-pop relative flex flex-col overflow-hidden rounded-[2rem] border-2 border-ink bg-[linear-gradient(135deg,var(--pink),var(--purple),var(--blue),var(--orange))] gradient-pan p-8 chip-shadow-lg">
          <div className="grid gap-6 sm:grid-cols-[1fr_150px]">
            <div className="text-white">
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-[var(--yellow)] px-3 py-1 text-xs font-black uppercase tracking-widest text-[var(--ink)] chip-shadow">
                Sortie le 13 novembre
              </span>
              <h2 className="mt-4 font-display text-3xl leading-tight md:text-4xl">
                {IA_MINUTE_SLOGANS[1].title}
              </h2>
              <p className="mt-4 opacity-95">
                Notre nouvelle collection explique aux médecins, en couleur et en visuels, comment
                utiliser l&apos;intelligence artificielle dans leur pratique quotidienne.
              </p>
            </div>
            <div className="float-soft relative mx-auto aspect-[9/10] w-40 self-start overflow-hidden rounded-2xl border-2 border-ink bg-[var(--ink)] chip-shadow-lg sm:w-full">
              <img
                src={iaMinuteCover.url}
                alt="Couverture L'IA Minute pour le médecin"
                className="h-full w-full object-cover object-center"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/25 blur-md shine-sweep" />
            </div>
          </div>
          <div className="mt-auto pt-8">
            <Link
              to="/ia-minute"
              className="inline-flex rounded-full border-2 border-ink bg-[var(--yellow)] px-7 py-3.5 font-bold text-[var(--ink)] chip-shadow-lg transition hover:-translate-y-1"
            >
              + d&apos;infos sur IA Minute →
            </Link>
          </div>
        </div>

        <div
          id="digidocs-2030"
          className="fade-in-pop [animation-delay:120ms] relative flex flex-col overflow-hidden rounded-[2rem] border-2 border-ink bg-[linear-gradient(135deg,#10b981,var(--purple),var(--pink))] gradient-pan p-8 chip-shadow-lg"
        >
          <div className="grid gap-6 sm:grid-cols-[1fr_150px]">
            <div className="text-white">
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-3 py-1 text-xs font-black uppercase tracking-widest text-[var(--ink)] chip-shadow">
                Sortie le 12 décembre
              </span>
              <h2 className="mt-4 font-display text-3xl leading-tight md:text-4xl">
                Digidoc <span className="text-[var(--yellow)]">2030</span>
              </h2>
              <p className="mt-2 font-display text-lg text-[var(--yellow)]">
                {DIGIDOCS_TAGLINE_SLOGANS[2].title}
              </p>
              <p className="mt-4 opacity-95">
                133 visuels pédagogiques pour comprendre les innovations qui vont changer la
                médecine d&apos;ici 2030. Signé Dr Guillaume Zagury.
              </p>
            </div>
            <div className="float-soft mx-auto w-40 self-start sm:w-full">
              <img
                src={digidocCover.url}
                alt="Couverture de Digidoc 2030, par le Dr Guillaume Zagury"
                loading="lazy"
                className="w-full rotate-[-2deg] rounded-xl transition duration-500 hover:rotate-0 hover:scale-105 drop-shadow-[0_18px_30px_rgba(0,0,0,0.45)]"
              />
            </div>
          </div>
          <div className="mt-auto pt-8">
            <Link
              to="/digidoc-2030"
              className="inline-flex rounded-full border-2 border-ink bg-[var(--yellow)] px-7 py-3.5 font-bold text-[var(--ink)] chip-shadow-lg transition hover:-translate-y-1"
            >
              + d&apos;infos sur Digidoc 2030 →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Logo() {
  return <img src={logoAsset.url} alt="Medicilline" className="h-10 w-auto" />;
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-[var(--cream)]/85 backdrop-blur">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <a href="#top" className="flex items-center gap-2">
          <Logo />
        </a>
        <DesktopNav />

        <div className="hidden items-center gap-3 md:flex">
          <ContactButton />
          <a
            href="#catalogue"
            className="hidden rounded-full border-2 border-ink bg-[var(--pink)] px-4 py-2 text-sm font-semibold text-white chip-shadow transition hover:-translate-y-0.5 md:inline-flex"
          >
            Voir les livres
          </a>
        </div>

        <MobileNav items={NAV_MOBILE_ITEMS} />
      </div>
    </header>
  );
}

function Hero() {
  const heroSlogan = HERO_SLOGANS[0];
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--yellow)] opacity-70 blur-2xl" />
      <div className="pointer-events-none absolute -left-20 top-40 h-64 w-64 rounded-full bg-[var(--pink)] opacity-50 blur-2xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/3 h-60 w-60 rounded-full bg-[var(--blue)] opacity-40 blur-2xl" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 px-5 pb-10 pt-4 md:grid-cols-12 md:gap-8 md:pt-6">
        <div className="md:col-span-7">
          <div className="fade-in-pop mb-3 w-fit rounded-[1.5rem] border-2 border-ink bg-white p-4 chip-shadow">
            <img
              src={logoAsset.url}
              alt="Logo Medicilline — éditer aujourd'hui les médecins de demain"
              className="float-soft h-14 w-auto md:h-16"
            />
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider chip-shadow">
            <span className="h-2 w-2 rounded-full bg-[var(--pink)]" />
            Éditions médicales — depuis 2005
          </span>
          <h1 className="mt-3 font-display text-4xl font-black leading-[0.95] tracking-tight sm:text-5xl">
            {heroSlogan.title}
          </h1>
          <p className="mt-3 max-w-xl text-base text-[var(--ink)]/75">{heroSlogan.subtitle}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="#catalogue"
              className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-[var(--pink)] px-6 py-3 font-semibold text-white chip-shadow-lg transition hover:-translate-y-0.5"
            >
              Découvrir le catalogue →
            </a>
            <a
              href="#bibliotheques"
              className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-[var(--yellow)] px-6 py-3 font-semibold text-[var(--ink)] chip-shadow transition hover:-translate-y-0.5"
            >
              Prompts &amp; tutoriels gratuits →
            </a>
            <a
              href="#rejoignez-nous"
              className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-[var(--blue)] px-6 py-3 font-semibold text-white chip-shadow transition hover:-translate-y-0.5"
            >
              Rejoignez-nous →
            </a>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-6 text-sm text-[var(--ink)]/70">
            <Stat n="4" label="titres au nouveau catalogue" />
            <div className="h-6 w-px bg-ink/20" />
            <Stat n="22" label="années d'édition" />
            <div className="h-6 w-px bg-ink/20" />
            <Stat n="100%" label="auteurs-soignants" />
          </div>
        </div>

        <div className="relative px-6 md:col-span-5 md:mt-6 md:px-4 md:self-start">
          <BookStack />
        </div>
      </div>
    </section>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="font-display text-2xl font-bold text-[var(--ink)]">{n}</div>
      <div>{label}</div>
    </div>
  );
}

function BookStack() {
  return (
    <div className="group relative mx-auto aspect-[9/10] w-full max-w-[240px] sm:max-w-[290px] md:max-w-[320px]">
      <a
        href="#digidocs-2030"
        aria-label="Découvrir Digidoc 2030"
        className="absolute inset-0 z-0 -translate-x-4 -translate-y-2 rotate-[-5deg] overflow-hidden rounded-2xl border-2 border-ink bg-[var(--blue)] chip-shadow-lg transition-transform duration-500 ease-out group-hover:-translate-x-8 group-hover:rotate-[-2deg] group-hover:scale-[1.02] group-focus-within:-translate-x-8 group-focus-within:rotate-[-2deg]"
      >
        <img
          src={digidocCover.url}
          alt="Couverture Digidoc 2030"
          loading="lazy"
          className="h-full w-full object-cover object-center"
        />
      </a>

      <Link
        to="/ia-minute"
        aria-label="Découvrir la collection IA Minute"
        className="absolute inset-0 z-10 translate-x-4 translate-y-2 rotate-[5deg] overflow-hidden rounded-2xl border-2 border-ink bg-[var(--ink)] chip-shadow-lg transition-transform duration-500 ease-out group-hover:translate-x-[58%] group-hover:translate-y-5 group-hover:rotate-[9deg] group-focus-within:translate-x-[58%] group-focus-within:translate-y-5 group-focus-within:rotate-[9deg]"
      >
        <img
          src={iaMinuteCover.url}
          alt="Couverture L'IA Minute pour le médecin"
          className="h-full w-full object-cover object-center"
        />
        <span className="absolute left-4 top-4 rounded-full border-2 border-ink bg-[var(--yellow)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--ink)]">
          Nouvelle collection
        </span>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/25 blur-md shine-sweep" />
      </Link>
    </div>
  );
}

function Marquee() {
  const items = ["Grand public", "ECNi", "Spécialité"];
  const dots = [
    "bg-[var(--pink)]",
    "bg-[var(--orange)]",
    "bg-[var(--yellow)]",
    "bg-[var(--purple)]",
    "bg-[var(--blue)]",
  ];
  return (
    <div className="border-y-2 border-ink bg-[var(--ink)] py-4 text-[var(--cream)]">
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 px-5 font-display text-xl font-bold">
        {items.map((t, i) => (
          <span key={i} className="flex items-center gap-3">
            <span>{t}</span>
            <span className={`h-2 w-2 rounded-full ${dots[i % dots.length]}`} />
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Les deux bibliothèques gratuites, posées haut dans la page : c'est ce qu'on
 * peut prendre tout de suite, avant le catalogue. Les compteurs et les exemples
 * sont lus dans les données — une fiche ajoutée se voit ici sans rien toucher.
 */
function Bibliotheques() {
  const categories = categoriesDisponibles();
  const enVitrine = PROMPTS_TRIES.slice(0, 3);
  const outils = [...new Set(TUTORIELS_PAR_PARCOURS.map((t) => t.outil))];

  return (
    <section id="bibliotheques" className="mx-auto max-w-7xl px-5 py-12">
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-3 py-1 text-xs font-bold uppercase tracking-widest chip-shadow">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--blue)] pulse-ring" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--blue)]" />
          </span>
          Accès libre — sans compte, sans achat
        </span>
        <h2 className="mt-4 font-display text-3xl font-black leading-[0.98] md:text-4xl">
          Deux bibliothèques ouvertes,
          <br />
          <span className="text-[var(--pink)]">avant même d&apos;ouvrir un livre.</span>
        </h2>
        <p className="mt-3 max-w-2xl text-[var(--ink)]/75">
          Les prompts qu&apos;on copie le matin, et les fiches qui apprennent le geste. C&apos;est
          la partie du travail Medicilline qui ne s&apos;achète pas : elle est en ligne, elle est
          datée, et elle dit ce qu&apos;elle ne sait pas faire.
        </p>
      </div>

      <div className="mt-8">
        <CollapsibleGrid
          className="grid gap-6 lg:grid-cols-2"
          moreLabel="Voir les deux bibliothèques"
          maxCollapsed={400}
        >
          {/* ---- La banque de prompts ---- */}
          <article className="fade-in-pop flex flex-col overflow-hidden rounded-[2rem] border-2 border-ink bg-card chip-shadow-lg transition hover:-translate-y-1">
            <div className="bg-[linear-gradient(135deg,var(--pink),var(--purple))] gradient-pan p-6">
              <span className="inline-flex rounded-full border-2 border-ink bg-[var(--yellow)] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[var(--ink)]">
                {PROMPTS_TRIES.length} prompts · {categories.length} catégories
              </span>
              <h3 className="mt-3 font-display text-2xl leading-tight text-white md:text-3xl">
                La banque de prompts
              </h3>
              <p className="mt-2 max-w-md text-sm text-white/90">
                Écrits pour un exercice médical, à copier tels quels. Chacun porte ses champs à
                remplir, son mode d&apos;emploi en quatre gestes, et la liste de ce qu&apos;il ne
                fait pas.
              </p>
            </div>

            <div className="flex flex-1 flex-col p-8">
              <ul className="space-y-4">
                {enVitrine.map((p) => (
                  <li key={p.slug}>
                    <Link
                      to="/prompts/$slug"
                      params={{ slug: p.slug }}
                      className="group block rounded-2xl border-2 border-ink bg-background p-4 chip-shadow transition hover:-translate-y-0.5 hover:chip-shadow-lg"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink)]/45">
                        {CATEGORIE_LABELS[p.categorie]}
                      </span>
                      <span className="mt-1 block font-display text-lg leading-tight group-hover:text-[var(--pink)]">
                        {p.title}
                      </span>
                      <span className="mt-1 block text-sm text-[var(--ink)]/65">{p.subtitle}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-7">
                <Link
                  to="/prompts"
                  className="inline-flex rounded-full border-2 border-ink bg-[var(--pink)] px-6 py-3 font-semibold text-white chip-shadow transition hover:-translate-y-1 hover:chip-shadow-lg"
                >
                  Ouvrir la banque de prompts →
                </Link>
                <p className="mt-4 text-sm text-[var(--ink)]/60">
                  On commence par « Le socle » : dépersonnaliser un texte avant de le coller. Cinq
                  minutes, et tout le reste change.
                </p>
              </div>
            </div>
          </article>

          {/* ---- La bibliothèque de tutoriels ---- */}
          <article
            className="fade-in-pop flex flex-col overflow-hidden rounded-[2rem] border-2 border-ink bg-card chip-shadow-lg transition hover:-translate-y-1"
            style={{ animationDelay: "120ms" }}
          >
            <div className="bg-[linear-gradient(135deg,var(--blue),#10b981)] gradient-pan p-6">
              <span className="inline-flex rounded-full border-2 border-ink bg-[var(--yellow)] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[var(--ink)]">
                {TUTORIELS_PAR_PARCOURS.length} fiches pas-à-pas
              </span>
              <h3 className="mt-3 font-display text-2xl leading-tight text-white md:text-3xl">
                La bibliothèque de tutoriels
              </h3>
              <p className="mt-2 max-w-md text-sm text-white/90">
                {outils.map((o) => OUTIL_LABELS[o]).join(", ")} — captures réelles, datées,
                neutralisées. À lire en ligne ou à imprimer, pour un médecin qui a quinze minutes.
              </p>
            </div>

            <div className="flex flex-1 flex-col p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                {TUTORIELS_PAR_PARCOURS.slice(0, 4).map((t) => (
                  <Link
                    key={t.slug}
                    to="/tutoriels/$slug"
                    params={{ slug: t.slug }}
                    className="group overflow-hidden rounded-2xl border-2 border-ink bg-background chip-shadow transition hover:-translate-y-0.5 hover:chip-shadow-lg"
                  >
                    <img
                      src={t.cover.src}
                      alt={t.cover.alt}
                      loading="lazy"
                      width={1200}
                      height={675}
                      className="h-24 w-full border-b-2 border-ink object-cover"
                    />
                    <span className="block p-3 font-display text-base leading-tight group-hover:text-[var(--blue)]">
                      {t.title}
                    </span>
                  </Link>
                ))}
              </div>

              <div className="mt-auto pt-7">
                <Link
                  to="/tutoriels"
                  className="inline-flex rounded-full border-2 border-ink bg-[var(--blue)] px-6 py-3 font-semibold text-white chip-shadow transition hover:-translate-y-1 hover:chip-shadow-lg"
                >
                  Ouvrir les tutoriels →
                </Link>
                <p className="mt-4 text-sm text-[var(--ink)]/60">
                  Chaque fiche porte la date de ses captures : en cas d&apos;écart avec ce que vous
                  voyez, c&apos;est votre écran qui a raison.
                </p>
              </div>
            </div>
          </article>
        </CollapsibleGrid>
      </div>
    </section>
  );
}

function Catalogue({
  active,
  setActive,
  query,
  setQuery,
  books,
}: {
  active: Category;
  setActive: (c: Category) => void;
  query: string;
  setQuery: (s: string) => void;
  books: Book[];
}) {
  const [selected, setSelected] = useState<Book | null>(null);
  const [showAll, setShowAll] = useState(false);
  const sorted = [...books].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  const visible = showAll ? sorted : sorted.slice(0, 3);
  return (
    <section id="catalogue" className="mx-auto max-w-7xl px-5 py-24">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="inline-block rounded-2xl bg-[var(--yellow)] px-5 pb-3 pt-5">
            <WaveText text="Catalogue 2026" />
          </p>
          <h2 className="mt-4 font-display text-4xl font-black md:text-5xl">
            {CATALOGUE_SLOGANS[0].title}
          </h2>
        </div>
        <div className="w-full md:w-80">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un titre, un auteur…"
            className="w-full rounded-full border-2 border-ink bg-white px-5 py-3 text-sm font-medium outline-none placeholder:text-[var(--ink)]/40 focus:ring-4 focus:ring-[var(--yellow)]"
          />
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((b, i) => (
          <BookCard key={(b.isbn ?? "") + i} book={b} index={i} onOpen={() => setSelected(b)} />
        ))}
        {books.length === 0 && (
          <div className="col-span-full rounded-2xl border-2 border-dashed border-ink/30 p-12 text-center text-[var(--ink)]/60">
            Aucun titre ne correspond à votre recherche.
          </div>
        )}
      </div>

      {sorted.length > 3 && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="inline-flex rounded-full border-2 border-ink bg-[var(--yellow)] px-7 py-3.5 font-bold text-[var(--ink)] chip-shadow transition hover:-translate-y-1 hover:chip-shadow-lg"
          >
            {showAll ? "Voir moins ↑" : `Voir plus (${sorted.length - 3}) ↓`}
          </button>
        </div>
      )}

      <BookModal book={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

function BookCard({ book, index, onOpen }: { book: Book; index: number; onOpen: () => void }) {
  const [imgOk, setImgOk] = useState(true);
  const coverUrl =
    book.coverUrl ??
    (book.isbn10
      ? `https://images-na.ssl-images-amazon.com/images/P/${book.isbn10}.jpg`
      : undefined);
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className={`group flex cursor-pointer flex-col overflow-hidden rounded-2xl border-2 border-ink bg-white chip-shadow fade-in-pop outline-none transition-all duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2 hover:scale-[1.03] hover:chip-shadow-lg focus-visible:ring-4 focus-visible:ring-[var(--yellow)] ${book.outOfStock ? "opacity-75" : ""}`}
      style={{ animationDelay: `${(index % 6) * 80}ms` }}
    >
      <div
        className={`${COLOR_BG[book.color]} ${COLOR_FG[book.color]} relative aspect-[4/3] overflow-hidden border-b-2 border-ink`}
      >
        {book.outOfStock ? (
          <div className="absolute left-4 top-4 z-20 rounded-full border-2 border-ink bg-[var(--ink)] px-2.5 py-1 text-xs font-bold text-[var(--cream)]">
            Épuisé
          </div>
        ) : book.comingSoon ? (
          <div className="absolute left-4 top-4 z-20 rounded-full border-2 border-ink bg-[var(--blue)] px-2.5 py-1 text-xs font-bold text-white">
            {book.comingSoon}
          </div>
        ) : (
          book.featured && (
            <div className="absolute left-4 top-4 z-20 rounded-full border-2 border-ink bg-[var(--yellow)] px-2.5 py-1 text-xs font-bold text-[var(--ink)]">
              Coup de cœur
            </div>
          )
        )}
        {book.price > 0 && (
          <div className="absolute right-4 top-4 z-20 rounded-full border-2 border-ink bg-white px-2.5 py-1 text-xs font-bold text-[var(--ink)]">
            {book.price.toFixed(2).replace(".", ",")} €
          </div>
        )}
        {coverUrl && imgOk ? (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <img
              src={coverUrl}
              alt={`Couverture — ${book.title}`}
              loading="lazy"
              onError={() => setImgOk(false)}
              className={`h-full w-auto max-w-full object-contain drop-shadow-[4px_4px_0_rgba(0,0,0,0.85)] ${book.outOfStock ? "grayscale" : ""}`}
            />
          </div>
        ) : (
          <>
            <div className="absolute bottom-5 left-5 right-5">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-80">
                Medicilline
              </div>
              <h3 className="mt-2 font-display text-2xl font-black leading-[1.05]">{book.title}</h3>
            </div>
            <SpineDecor color={book.color} />
          </>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start gap-2.5">
          <span className={`mt-1.5 h-4 w-1.5 shrink-0 rounded-full ${COLOR_BG[book.color]}`} />
          <h3
            className={`font-display text-2xl font-black leading-[1.05] tracking-tight ${
              book.color === "yellow"
                ? "text-[var(--ink)] [box-decoration-break:clone] [-webkit-box-decoration-break:clone] bg-[var(--yellow)] px-1"
                : COLOR_TEXT[book.color]
            }`}
          >
            {book.title}
          </h3>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-[var(--cream)] px-2.5 py-1 text-xs font-semibold text-[var(--ink)]/70">
            {book.category}
          </span>
          {book.author && (
            <span className="text-xs font-medium text-[var(--ink)]/60">{book.author}</span>
          )}
        </div>
        {book.desc && <p className="text-sm text-[var(--ink)]/75">{book.desc}</p>}
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          {book.isbn ? (
            <span className="font-mono text-[11px] text-[var(--ink)]/40">ISBN {book.isbn}</span>
          ) : (
            <span />
          )}
          {book.outOfStock ? (
            <span className="rounded-full border-2 border-ink/30 bg-[var(--cream)] px-3.5 py-1.5 text-xs font-semibold text-[var(--ink)]/50">
              Épuisé
            </span>
          ) : book.comingSoon ? (
            <a
              href={`mailto:contact@medicilline.ai?subject=${encodeURIComponent(`Être prévenu — ${book.title}`)}`}
              onClick={(e) => e.stopPropagation()}
              className="rounded-full border-2 border-ink bg-[var(--yellow)] px-3.5 py-1.5 text-xs font-semibold text-[var(--ink)] transition hover:-translate-y-0.5"
            >
              Être prévenu →
            </a>
          ) : (
            book.amazon && (
              <a
                href={book.amazon}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="rounded-full border-2 border-ink bg-[var(--ink)] px-3.5 py-1.5 text-xs font-semibold text-[var(--cream)] transition hover:bg-[var(--pink)]"
              >
                Acheter →
              </a>
            )
          )}
        </div>
      </div>
    </article>
  );
}

function BookModal({ book, onClose }: { book: Book | null; onClose: () => void }) {
  const coverUrl =
    book &&
    (book.coverUrl ??
      (book.isbn10
        ? `https://images-na.ssl-images-amazon.com/images/P/${book.isbn10}.jpg`
        : undefined));

  return (
    <DialogPrimitive.Root open={!!book} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[var(--ink)]/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        {book && (
          <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 max-h-[88vh] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[2rem] border-2 border-ink bg-white chip-shadow-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
            <DialogPrimitive.Close className="absolute right-4 top-4 z-10 rounded-full border-2 border-ink bg-white p-1.5 transition hover:-translate-y-0.5">
              <X className="h-4 w-4" />
              <span className="sr-only">Fermer</span>
            </DialogPrimitive.Close>

            <div className="grid gap-0 sm:grid-cols-2">
              <div
                className={`${COLOR_BG[book.color]} ${COLOR_FG[book.color]} relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b-2 border-ink p-6 sm:aspect-auto sm:border-b-0 sm:border-r-2`}
              >
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt={`Couverture — ${book.title}`}
                    className={`h-full w-auto max-w-full object-contain drop-shadow-[4px_4px_0_rgba(0,0,0,0.85)] ${book.outOfStock ? "grayscale" : ""}`}
                  />
                ) : (
                  <>
                    <div className="absolute bottom-5 left-5 right-5">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-80">
                        Medicilline
                      </div>
                      <h2 className="mt-2 font-display text-2xl font-black leading-[1.05]">
                        {book.title}
                      </h2>
                    </div>
                    <SpineDecor color={book.color} />
                  </>
                )}
              </div>

              <div className="flex flex-col gap-3 p-6 sm:p-7">
                <DialogPrimitive.Title className="font-display text-2xl font-black leading-tight">
                  {book.title}
                </DialogPrimitive.Title>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[var(--cream)] px-2.5 py-1 text-xs font-semibold text-[var(--ink)]/70">
                    {book.category}
                  </span>
                  {book.author && (
                    <span className="text-xs font-medium text-[var(--ink)]/60">{book.author}</span>
                  )}
                  {book.pages && (
                    <span className="text-xs font-medium text-[var(--ink)]/60">
                      · {book.pages} pages
                    </span>
                  )}
                </div>

                <DialogPrimitive.Description className="text-sm leading-relaxed text-[var(--ink)]/80">
                  {book.longDesc ?? book.desc ?? "Description à venir."}
                </DialogPrimitive.Description>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--ink)]/50">
                  {book.isbn && <span className="font-mono">ISBN {book.isbn}</span>}
                  {book.price > 0 && (
                    <span className="rounded-full border-2 border-ink bg-white px-2.5 py-1 font-bold text-[var(--ink)]">
                      {book.price.toFixed(2).replace(".", ",")} €
                    </span>
                  )}
                </div>

                <div className="mt-auto pt-4">
                  {book.outOfStock ? (
                    <span className="inline-block rounded-full border-2 border-ink/30 bg-[var(--cream)] px-4 py-2 text-sm font-semibold text-[var(--ink)]/50">
                      Épuisé
                    </span>
                  ) : book.comingSoon ? (
                    <a
                      href={`mailto:contact@medicilline.ai?subject=${encodeURIComponent(`Être prévenu — ${book.title}`)}`}
                      className="inline-block rounded-full border-2 border-ink bg-[var(--yellow)] px-5 py-2.5 text-sm font-semibold text-[var(--ink)] transition hover:-translate-y-0.5"
                    >
                      Être prévenu — {book.comingSoon} →
                    </a>
                  ) : (
                    book.amazon && (
                      <a
                        href={book.amazon}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block rounded-full border-2 border-ink bg-[var(--ink)] px-5 py-2.5 text-sm font-semibold text-[var(--cream)] transition hover:bg-[var(--pink)]"
                      >
                        Acheter →
                      </a>
                    )
                  )}
                </div>
              </div>
            </div>
          </DialogPrimitive.Content>
        )}
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function SpineDecor({ color }: { color: ColorKey }) {
  const ribbons: ColorKey[] = (["pink", "orange", "yellow", "purple", "blue"] as ColorKey[]).filter(
    (c) => c !== color,
  );
  return (
    <div className="absolute -bottom-2 -right-2 flex gap-1.5 opacity-70">
      {ribbons.map((r) => (
        <span key={r} className={`h-10 w-2 rounded-full border-2 border-ink ${COLOR_BG[r]}`} />
      ))}
    </div>
  );
}

type TeamMember = {
  name: string;
  roles: string[];
  color: string;
  photo: string | null;
  bio: string;
  email?: string;
};

const TEAM: TeamMember[] = [
  {
    name: "Dr Guillaume Zagury",
    roles: ["PDG", "Auteur", "Consultant"],
    color: "var(--pink)",
    photo: guillaumePhoto.url,
    bio: "Médecin, entrepreneur et auteur depuis 2003. Fondateur de Medicilline, il conçoit la ligne éditoriale et porte la vision de la maison.",
  },
  {
    name: "Anatole Mellet",
    roles: ["Développeur", "Auteur", "Stratégie marketing"],
    color: "var(--blue)",
    photo: anatoleMelletPhoto.url,
    bio: "Développeur et auteur, il construit le site et les outils digitaux de Medicilline et pilote la stratégie marketing.",
    email: "anatole@medicilline.ai",
  },
  {
    name: "Tristan Morin",
    roles: ["Maquettiste", "Directeur multimédia"],
    color: "var(--purple)",
    photo: "/team/tristan-morin.png",
    bio: "Maquettiste et directeur multimédia, il met en page les ouvrages et façonne l'image de Medicilline : vidéo, motion design et contenus visuels de la maison.",
  },
  {
    name: "Elisa Boyko",
    roles: ["Directrice commerciale"],
    color: "var(--orange)",
    photo: null,
    bio: "Directrice commerciale, elle développe les partenariats, le réseau de libraires et la diffusion des ouvrages Medicilline.",
  },
];

function TeamPhoto({ member }: { member: TeamMember }) {
  const [failed, setFailed] = useState(false);

  if (member.photo && !failed) {
    return (
      <img
        src={member.photo}
        alt={member.name}
        onError={() => setFailed(true)}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
    );
  }

  return (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{ background: member.color }}
    >
      <span className="font-display text-6xl text-white">
        {member.name
          .split(" ")
          .map((w) => w[0])
          .join("")}
      </span>
    </div>
  );
}

// Grille repliable : la première rangée entière, un aperçu en fondu de la suivante,
// puis un bouton qui déplie tout. Avec `maxCollapsed`, la coupure se fait à cette
// hauteur fixe (utile quand tout tient sur une seule rangée).
const PEEK_PX = 140;

function CollapsibleGrid({
  children,
  className,
  moreLabel,
  fadeTo = "var(--background)",
  maxCollapsed,
  peek = PEEK_PX,
}: {
  children: React.ReactNode;
  className: string;
  moreLabel: string;
  fadeTo?: string;
  maxCollapsed?: number;
  peek?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [collapsedHeight, setCollapsedHeight] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const measure = () => {
      if (maxCollapsed) {
        setCollapsedHeight(grid.scrollHeight > maxCollapsed + peek ? maxCollapsed : null);
        return;
      }
      const cards = Array.from(grid.children) as HTMLElement[];
      const firstTop = cards[0]?.offsetTop ?? 0;
      const nextRow = cards.find((c) => c.offsetTop > firstTop);
      setCollapsedHeight(nextRow ? nextRow.offsetTop - firstTop + peek : null);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(grid);
    return () => observer.disconnect();
  }, [maxCollapsed, peek]);

  const canCollapse = collapsedHeight !== null;
  const collapsed = canCollapse && !expanded;

  return (
    <div>
      <div
        className="relative -m-2 overflow-hidden p-2 transition-[max-height] duration-700 ease-in-out"
        style={{
          maxHeight: collapsed
            ? collapsedHeight
            : expanded
              ? (gridRef.current?.scrollHeight ?? 0) + 16
              : undefined,
        }}
      >
        <div ref={gridRef} className={`pb-2 ${className}`}>
          {children}
        </div>
        {collapsed && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
            style={{ background: `linear-gradient(to bottom, transparent, ${fadeTo})` }}
          />
        )}
      </div>

      {canCollapse && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="inline-flex rounded-full border-2 border-ink bg-[var(--yellow)] px-7 py-3.5 font-bold text-[var(--ink)] chip-shadow transition hover:-translate-y-1 hover:chip-shadow-lg"
          >
            {expanded ? "Voir moins ↑" : `${moreLabel} ↓`}
          </button>
        </div>
      )}
    </div>
  );
}

function Team() {
  return (
    <section id="equipe" className="mx-auto max-w-5xl px-5 py-14">
      <p className="text-sm font-semibold uppercase tracking-widest text-[var(--blue)]">
        L&apos;équipe
      </p>
      <h2 className="mt-2 font-display text-3xl font-black leading-tight md:text-4xl">
        Notre équipe
      </h2>
      <p className="mt-3 max-w-xl text-sm text-ink/70">
        Quatre profils, une même obsession : rendre la médecine claire, utile et bien construite —
        sur papier comme en ligne.
      </p>
      <div className="mt-6">
        <CollapsibleGrid
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          moreLabel="Voir toute l'équipe"
          maxCollapsed={200}
          peek={70}
        >
          {TEAM.map((m, i) => (
            <article
              key={m.name}
              className="fade-in-pop group overflow-hidden rounded-2xl border-2 border-ink bg-white chip-shadow transition duration-300 hover:-translate-y-1 hover:chip-shadow-lg"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="aspect-[16/10] overflow-hidden border-b-2 border-ink">
                <TeamPhoto member={m} />
              </div>
              <div className="p-4">
                <h3 className="font-display text-lg">{m.name}</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {m.roles.map((r) => (
                    <span
                      key={r}
                      className="rounded-full border-2 border-ink px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white"
                      style={{ background: m.color }}
                    >
                      {r}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-xs text-ink/70">{m.bio}</p>
                {m.email && (
                  <a
                    href={`mailto:${m.email}`}
                    className="mt-3 inline-block text-xs font-bold underline decoration-2 underline-offset-4 transition hover:opacity-70"
                    style={{ color: m.color }}
                  >
                    {m.email}
                  </a>
                )}
              </div>
            </article>
          ))}
        </CollapsibleGrid>
      </div>
    </section>
  );
}

const JOIN_PROFILES = [
  { value: "Auteur", label: "Auteur" },
  { value: "Presse & média", label: "Presse & média" },
  { value: "Libraire / partenaire", label: "Libraire / partenaire" },
  { value: "Créateur", label: "Créateur" },
  { value: "Autre", label: "Autre" },
];

function JoinUs() {
  const [profile, setProfile] = useState(JOIN_PROFILES[0].value);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const { data, error } = await supabase.functions.invoke("send-contact", {
      body: { profile, name, email, message, website },
    });
    if (error || data?.error) {
      setState("error");
      setErrorMessage(data?.error ?? "Envoi impossible pour le moment.");
      return;
    }
    setState("done");
    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <section id="rejoignez-nous" className="mx-auto max-w-7xl px-5 py-24">
      <div className="overflow-hidden rounded-[2rem] border-2 border-ink bg-card chip-shadow-lg">
        <div className="grid gap-10 p-8 md:grid-cols-[1fr_1.2fr] md:p-14">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[var(--blue)]">
              Rejoignez-nous
            </p>
            <h2 className="mt-2 font-display text-4xl font-black leading-tight md:text-5xl">
              Auteur, média, libraire, créateur{" "}
              <span className="text-[var(--blue)]">— parlons-en.</span>
            </h2>
            <p className="mt-4 max-w-md text-[var(--ink)]/75">
              Un projet de livre, une demande presse, un partenariat librairie ou école : dis-nous
              qui tu es, on te répond sous 48&nbsp;h ouvrées.
            </p>
          </div>

          <form onSubmit={onSubmit} className="grid gap-4">
            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
              aria-hidden="true"
            />
            <div className="flex flex-wrap gap-2">
              {JOIN_PROFILES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setProfile(p.value)}
                  className={`rounded-full border-2 border-ink px-4 py-2 text-sm font-semibold transition ${
                    profile === p.value
                      ? "bg-[var(--blue)] text-white chip-shadow -translate-y-0.5"
                      : "bg-white text-[var(--ink)] hover:bg-[var(--cream)]"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom"
                className="rounded-full border-2 border-ink bg-white px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--yellow)]"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="rounded-full border-2 border-ink bg-white px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--yellow)]"
              />
            </div>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ton message : projet de livre, demande presse, partenariat…"
              rows={4}
              className="rounded-2xl border-2 border-ink bg-white px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--yellow)]"
            />
            <button
              type="submit"
              disabled={state === "loading"}
              className="w-fit rounded-full border-2 border-ink bg-[var(--pink)] px-6 py-3 font-semibold text-white chip-shadow transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {state === "loading" ? "Envoi…" : "Envoyer →"}
            </button>
            {state === "done" && (
              <p className="text-sm font-medium text-[var(--ink)]/70">
                Message envoyé — on te répond sous 48 h ouvrées.
              </p>
            )}
            {state === "error" && (
              <p className="text-sm font-medium text-[var(--pink)]">{errorMessage}</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

function Numbers() {
  const items = [
    {
      n: "2005",
      l: "Lancement",
      s: "Des livres pensés par des soignants, pour des soignants : ECNi, internat, infirmier, mémos, protocoles.",
      c: "bg-[var(--pink)] text-white",
    },
    {
      n: "2026",
      l: "100 % tech et IA",
      s: "Chaque ouvrage devient augmenté : un QR, et le livre continue en ligne avec les outils IA testés au cabinet.",
      c: "bg-[var(--blue)] text-white",
    },
  ];
  return (
    <section id="chiffres" className="flex h-full flex-col justify-center">
      <p className="font-display text-2xl font-black leading-tight text-[var(--ink)] md:text-3xl">
        20 ans d&apos;édition médicale,{" "}
        <span className="text-[var(--orange)]">un seul virage.</span>
      </p>
      <div className="mt-8 flex flex-col">
        {items.map((it, i) => (
          <Fragment key={it.n}>
            {i === 1 && (
              <span className="relative z-10 -my-3 self-center rounded-full border-2 border-ink bg-[var(--yellow)] px-4 py-1 font-display text-2xl font-black text-[var(--ink)] chip-shadow">
                vs
              </span>
            )}
            <div
              className={`${it.c} fade-in-pop rounded-3xl border-2 border-ink p-8 chip-shadow-lg transition-all duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0_0_var(--ink)]`}
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="flex items-baseline gap-4">
                <div className="font-display text-6xl font-black leading-none md:text-7xl">
                  {it.n}
                </div>
                <div className="text-lg font-bold uppercase tracking-wider">{it.l}</div>
              </div>
              <p className="mt-4 max-w-md text-base font-medium opacity-90">{it.s}</p>
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="h-full">
      <div className="h-full overflow-hidden rounded-3xl border-2 border-ink bg-[var(--ink)] text-[var(--cream)] chip-shadow-lg">
        <div className="grid grid-cols-1 gap-8 p-8 md:p-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[var(--yellow)]">
              Contact
            </p>
            <h2 className="mt-2 font-display text-4xl font-black leading-tight md:text-5xl">
              Une question ? <br />
              <span className="text-[var(--pink)]">Une commande ?</span>
            </h2>
            <p className="mt-5 max-w-md text-[var(--cream)]/80">
              Libraires, écoles d'infirmiers, facultés, hôpitaux : nous répondons sous 48&nbsp;h
              ouvrées.
            </p>
          </div>
          <div className="grid gap-4 self-center">
            <Info label="Email" value="contact@medicilline.ai" color="blue" />
            <a
              href="mailto:contact@medicilline.ai"
              className="mt-2 inline-flex w-fit items-center gap-2 rounded-full border-2 border-[var(--cream)] bg-[var(--pink)] px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5"
            >
              Écrire à Medicilline →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Info({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: "pink" | "yellow" | "blue";
}) {
  const dot = { pink: "bg-[var(--pink)]", yellow: "bg-[var(--yellow)]", blue: "bg-[var(--blue)]" }[
    color
  ];
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[var(--cream)]/15 bg-white/5 p-4">
      <span className={`mt-1.5 h-3 w-3 rounded-full ${dot}`} />
      <div>
        <div className="text-xs font-semibold uppercase tracking-widest text-[var(--cream)]/60">
          {label}
        </div>
        <div className="mt-1 font-medium">{value}</div>
      </div>
    </div>
  );
}

const BLOG_TOPICS = [
  { label: "IA médicale", color: "var(--purple)" },
  { label: "Outils cliniques", color: "var(--blue)" },
  { label: "Éthique & cadre", color: "var(--pink)" },
  { label: "Pédagogie", color: "var(--yellow)" },
];

const BLOG_PREVIEWS = [
  {
    tag: "IA médicale",
    title: "Les 5 usages de l'IA déjà utiles en consultation",
    excerpt:
      "Compte rendu, tri des courriers, aide au diagnostic : ce qui fonctionne vraiment aujourd'hui au cabinet.",
    gradient: "linear-gradient(135deg,var(--pink),var(--purple),var(--blue))",
  },
  {
    tag: "Outils cliniques",
    title: "Bien rédiger un prompt médical",
    excerpt:
      "La méthode en 4 étapes pour obtenir des réponses fiables, sourcées et exploitables en pratique.",
    gradient: "linear-gradient(135deg,var(--blue),var(--yellow),var(--orange))",
  },
  {
    tag: "Éthique & cadre",
    title: "IA et données de santé : ce que dit la loi",
    excerpt:
      "RGPD, secret médical, hébergement : le cadre à connaître avant d'utiliser un outil d'IA.",
    gradient: "linear-gradient(135deg,var(--orange),var(--pink),var(--purple))",
  },
  {
    tag: "Pédagogie",
    title: "Apprendre l'IA en 1 minute par jour",
    excerpt: "Le format court qui a inspiré la collection IA Minute, expliqué en couleur.",
    gradient: "linear-gradient(135deg,var(--purple),var(--blue),var(--yellow))",
  },
];

function BlogTeaser() {
  const { data: posts } = useQuery({
    queryKey: ["home-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, slug, title, excerpt, cover_url, category, published_at")
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <section id="blog" className="mx-auto max-w-7xl px-5 py-12">
      <div className="overflow-hidden rounded-[2.5rem] border-2 border-ink bg-card chip-shadow-lg">
        <div className="bg-[linear-gradient(120deg,var(--purple),var(--blue),var(--pink))] gradient-pan px-8 py-6 md:px-12 md:py-7">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-3 py-1 text-xs font-bold uppercase tracking-widest chip-shadow">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--pink)] pulse-ring" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--pink)]" />
            </span>
            Le blog Medicilline
          </span>
          <h2 className="mt-3 max-w-3xl font-display text-2xl font-black leading-tight text-white md:text-3xl">
            {BLOG_TEASER_SLOGANS[2].title}
          </h2>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {BLOG_TOPICS.map((t) => (
                <span
                  key={t.label}
                  className="rounded-full border-2 border-ink px-3 py-1 text-xs font-bold uppercase tracking-widest text-[var(--ink)]"
                  style={{ background: t.color }}
                >
                  {t.label}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/blog"
                className="inline-flex rounded-full border-2 border-ink bg-white px-5 py-2.5 text-sm font-semibold text-[var(--ink)] chip-shadow transition hover:-translate-y-1 hover:chip-shadow-lg"
              >
                Lire le blog →
              </Link>
              <span className="text-sm font-medium text-white/85">
                Gratuit · nouveaux articles chaque semaine
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-8 p-6 md:p-10 lg:grid-cols-[1fr_1.15fr] lg:items-start">
          <CollapsibleGrid
            className="grid gap-4 sm:grid-cols-2"
            moreLabel="Voir plus d'articles"
            fadeTo="var(--card)"
            peek={70}
          >
            {(posts ?? []).map((p, i) => (
              <Link
                key={p.id}
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="fade-in-pop group overflow-hidden rounded-3xl border-2 border-ink bg-background chip-shadow transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:chip-shadow-lg"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                {p.cover_url ? (
                  <img
                    src={p.cover_url}
                    alt={p.title}
                    loading="lazy"
                    className="h-24 w-full object-cover"
                  />
                ) : (
                  <div className="h-24 w-full bg-[linear-gradient(135deg,var(--pink),var(--purple),var(--blue))] gradient-pan" />
                )}
                <div className="p-4">
                  <h3 className="font-display text-lg leading-tight">{p.title}</h3>
                  <p className="mt-1.5 line-clamp-2 text-sm text-[var(--ink)]/70">{p.excerpt}</p>
                  <p className="mt-3 text-[11px] uppercase tracking-widest text-[var(--ink)]/50">
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
            {(posts ?? []).length === 0 &&
              BLOG_PREVIEWS.map((p, i) => (
                <Link
                  key={p.title}
                  to="/blog"
                  className="fade-in-pop group overflow-hidden rounded-3xl border-2 border-ink bg-background chip-shadow transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:chip-shadow-lg"
                  style={{ animationDelay: `${i * 90}ms` }}
                >
                  <div
                    className="gradient-pan flex h-24 w-full items-end p-3"
                    style={{ background: p.gradient }}
                  >
                    <span className="rounded-full border-2 border-ink bg-white px-3 py-1 text-xs font-bold uppercase tracking-widest">
                      {p.tag}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg leading-tight">{p.title}</h3>
                    <p className="mt-1.5 line-clamp-2 text-sm text-[var(--ink)]/70">{p.excerpt}</p>
                    <p className="mt-3 text-[11px] uppercase tracking-widest text-[var(--ink)]/50">
                      Bientôt en ligne
                    </p>
                  </div>
                </Link>
              ))}
          </CollapsibleGrid>

          <div id="newsletter" className="scroll-mt-24 lg:sticky lg:top-24">
            <NewsletterForm dense />
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-[var(--cream)]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-[var(--ink)]/70 md:flex-row">
        <div className="flex items-center gap-2">
          <Logo />
          <span>· Éditions médicales · depuis 2005</span>
        </div>
        <div className="flex items-center gap-5">
          <Link to="/prompts" className="hover:text-[var(--pink)]">
            Prompts
          </Link>
          <Link to="/tutoriels" className="hover:text-[var(--yellow)]">
            Tutoriels
          </Link>
          <a href="#catalogue" className="hover:text-[var(--pink)]">
            Catalogue 2026
          </a>
          <Link to="/academie" className="hover:text-[var(--blue)]">
            Académie
          </Link>
          <Link to="/blog" className="hover:text-[var(--blue)]">
            Blog
          </Link>
          <Link to="/auth" className="hover:text-[var(--purple)]">
            Espace rédaction
          </Link>
          <a href="#contact" className="hover:text-[var(--blue)]">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
