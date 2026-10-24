/**
 * La bibliothèque de tutoriels Médicilline.
 *
 * Chaque fiche est fabriquée hors du site, dans `09_tutoriels/` : les captures
 * sont produites par script, neutralisées, annotées à partir de positions
 * mesurées, puis rendues en une page autonome (images incrustées) et en PDF A4.
 * Le site n'en héberge que le résultat, déposé dans `public/tutoriels/` :
 *
 *   public/tutoriels/<slug>.html        la fiche, lisible en ligne
 *   public/tutoriels/<slug>.pdf         la même, imprimable
 *   public/tutoriels/<slug>-cover.png   la vignette 1200×675
 *
 * Ajouter un tutoriel = déposer ces trois fichiers et ajouter une entrée
 * ci-dessous. Rien d'autre : l'index et la page de détail s'en déduisent.
 *
 * Règle : un slug ne se renomme pas. Une fiche partagée dans une newsletter ou
 * imprimée en formation doit rester atteignable indéfiniment.
 */

export type TutorielOutil = "chatgpt" | "claude" | "cowork" | "notebooklm";
export type TutorielNiveau = "debutant" | "intermediaire";

export const OUTIL_LABELS: Record<TutorielOutil, string> = {
  chatgpt: "ChatGPT",
  claude: "Claude",
  cowork: "Claude Cowork",
  notebooklm: "NotebookLM",
};

export const NIVEAU_LABELS: Record<TutorielNiveau, string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
};

export type Tutoriel = {
  slug: string;
  /** Titre de la fiche, identique à celui de la page. */
  title: string;
  /** Le avant → après, en une phrase. */
  subtitle: string;
  outil: TutorielOutil;
  niveau: TutorielNiveau;
  /** Durée de lecture annoncée dans la fiche, en minutes. */
  minutes: number;
  /** Date des captures, ISO. Ce n'est pas la date de rédaction : une interface
   *  qui bouge rend une capture fausse, et c'est cette date-là qui le dit. */
  capturedAt: string;
  /** Rang dans le parcours conseillé, du socle au plus spécialisé. */
  ordre: number;
  cover: { src: string; alt: string };
  /** La fiche en ligne et sa version imprimable, sous /tutoriels/. */
  page: string;
  pdf: string;
  /** Poids du PDF, annoncé avant le clic. */
  pdfPoids: string;
  /** Deux ou trois phrases : à qui elle s'adresse, et pourquoi elle existe. */
  intro: string;
  /** Ce que le lecteur sait faire à la fin. Des gestes, pas des connaissances. */
  gestes: string[];
  /** Les titres des étapes, dans l'ordre de la fiche. */
  etapes: string[];
  /** L'étape qui protège plutôt qu'elle n'apprend : le cœur de la fiche. */
  passageOblige: string;
  /** Ce qu'il faut avoir sous la main avant de commencer. */
  prerequis: string[];
};

export const TUTORIELS: Tutoriel[] = [
  {
    slug: "maitriser-chatgpt",
    title: "Maîtriser ChatGPT",
    subtitle:
      "De « je pose une question » à « j'obtiens une réponse exploitable, sourcée, et que je sais vérifier ».",
    outil: "chatgpt",
    niveau: "debutant",
    minutes: 20,
    capturedAt: "2026-09-05",
    ordre: 1,
    cover: {
      src: "/tutoriels/maitriser-chatgpt-cover.png",
      alt: "L'écran d'accueil de ChatGPT",
    },
    page: "/tutoriels/maitriser-chatgpt.html",
    pdf: "/tutoriels/maitriser-chatgpt.pdf",
    pdfPoids: "2,6 Mo",
    intro:
      "La fiche de départ, celle qui suppose qu'on n'a jamais rien réglé. Elle suit quelqu'un qui se sert de l'outil et qui bute, plutôt que de décrire une interface écran par écran — et elle se termine sur le seul réglage qu'aucun médecin ne devrait laisser par défaut.",
    gestes: [
      "Retrouver n'importe quel bouton sans le chercher",
      "Joindre un document et faire travailler l'outil dessus",
      "Écrire une demande qui produit autre chose qu'un texte plausible",
      "Repérer, dans une réponse, ce qui reste à vérifier",
    ],
    etapes: [
      "Reconnaître les trois zones de l'écran",
      "Le composeur, bouton par bouton",
      "Le menu « + » : fichiers, web, recherche approfondie",
      "La barre latérale : ranger pour retrouver",
      "Le chat éphémère, quand le sujet est sensible",
      "Écrire un prompt qui tient la route",
      "Lire une réponse — et repérer ses failles",
      "Ouvrir les paramètres",
      "Gestion des données : le réglage qui compte",
    ],
    passageOblige:
      "La gestion des données : ce que le compte conserve, ce qui part à l'entraînement, et comment le couper.",
    prerequis: ["Un compte ChatGPT, gratuit ou payant"],
  },
  {
    slug: "maitriser-claude",
    title: "Maîtriser Claude",
    subtitle:
      "De « je pose une question et je recopie trois lignes » à « je règle l'outil avant d'écrire, et j'obtiens un livrable ».",
    outil: "claude",
    niveau: "debutant",
    minutes: 20,
    capturedAt: "2026-09-07",
    ordre: 2,
    cover: {
      src: "/tutoriels/maitriser-claude-cover.png",
      alt: "L'écran d'accueil de l'application Claude",
    },
    page: "/tutoriels/maitriser-claude.html",
    pdf: "/tutoriels/maitriser-claude.pdf",
    pdfPoids: "0,9 Mo",
    intro:
      "Le pendant de la fiche ChatGPT, pour l'autre outil grand public. Même parti pris : six gestes, des captures réelles, et le réglage du modèle traité comme ce qu'il est — une décision de coût et de qualité, pas un détail cosmétique.",
    gestes: [
      "Situer les trois zones de l'écran et ranger ses conversations",
      "Ouvrir le menu « + » et savoir ce que Claude a le droit de lire",
      "Choisir un modèle et régler son effort de raisonnement",
      "Écrire une demande dont sort un fichier, pas un paragraphe",
    ],
    etapes: [
      "Reconnaître les trois zones de l'écran",
      "La barre latérale : ce qui se range où",
      "La ligne de commandes, bouton par bouton",
      "Le menu « + » : ce que Claude a le droit de lire",
      "Choisir le modèle, régler l'effort",
      "Écrire une demande qui produit un livrable",
    ],
    passageOblige:
      "Le menu « + » : l'inventaire de tout ce que l'outil peut atteindre — et rien d'autre.",
    prerequis: ["Un compte Claude", "L'application de bureau ou le site"],
  },
  {
    slug: "claude-cowork",
    title: "Travailler avec Claude Cowork",
    subtitle:
      "De « je pose une question » à « je décris un travail, je valide, je récupère le fichier ».",
    outil: "cowork",
    niveau: "intermediaire",
    minutes: 20,
    capturedAt: "2026-09-07",
    ordre: 3,
    cover: {
      src: "/tutoriels/claude-cowork-cover.png",
      alt: "L'application Claude en mode Cowork",
    },
    page: "/tutoriels/claude-cowork.html",
    pdf: "/tutoriels/claude-cowork.pdf",
    pdfPoids: "1,0 Mo",
    intro:
      "Cowork ne répond pas : il agit, sur vos propres fichiers. C'est ce qui le rend utile et c'est ce qui le rend risqué — la fiche documente l'application de bureau, seule capable de toucher un dossier de l'ordinateur, et consacre son étape finale à qui décide de quoi.",
    gestes: [
      "Rattacher un dossier de travail et savoir ce que ça autorise",
      "Vérifier, avant de lancer, ce que la séance peut atteindre",
      "Écrire une tâche qui produit un fichier nommé",
      "Choisir le mode d'approbation en fonction de ce qu'on met en jeu",
    ],
    etapes: [
      "Reconnaître l'écran de travail",
      "Le modèle et l'effort",
      "Rattacher un dossier de l'ordinateur",
      "Le menu « + » : ce que Claude peut atteindre",
      "Écrire une tâche, pas une question",
      "Les trois modes d'approbation",
    ],
    passageOblige:
      "Les trois modes d'approbation : le seul réglage qui change la nature du risque, connecteurs et tâches programmées compris.",
    prerequis: [
      "Un abonnement Claude payant",
      "L'application de bureau (le site ne rattache pas de dossier)",
      "Un dossier de travail dédié, sans donnée patient",
    ],
  },
  {
    slug: "maitriser-notebooklm",
    title: "Maîtriser NotebookLM",
    subtitle:
      "Transformer un dossier de documents en réponses sourcées, vérifiables ligne à ligne.",
    outil: "notebooklm",
    niveau: "debutant",
    minutes: 18,
    capturedAt: "2026-09-06",
    ordre: 4,
    cover: {
      src: "/tutoriels/maitriser-notebooklm-cover.png",
      alt: "La bibliothèque de notebooks de NotebookLM",
    },
    page: "/tutoriels/maitriser-notebooklm.html",
    pdf: "/tutoriels/maitriser-notebooklm.pdf",
    pdfPoids: "5,1 Mo",
    intro:
      "L'outil à sortir quand la question n'est pas « que sais-tu ? » mais « que disent ces vingt articles ? ». Chaque phrase produite renvoie au passage qui l'appuie : c'est la seule famille d'outils où la vérification est intégrée plutôt que laissée au lecteur.",
    gestes: [
      "Monter un notebook à partir de PDF, de liens ou de notes",
      "Poser une question et remonter à la source de chaque affirmation",
      "Fabriquer une synthèse, une carte mentale ou un audio depuis le corpus",
      "Partager un notebook en sachant ce que le partage expose",
    ],
    etapes: [
      "La bibliothèque : où vivent vos notebooks",
      "Les trois panneaux d'un notebook",
      "Faire entrer une source",
      "Ce que l'outil fait d'une source",
      "Poser une question, lire les citations",
      "Le Studio : ce qu'on fabrique des sources",
      "La carte mentale",
      "Partager — et ce que ça expose",
    ],
    passageOblige:
      "Le partage : ce qu'un lien donne à voir, et à qui, une fois qu'il est parti.",
    prerequis: ["Un compte Google", "Trois à vingt documents sur un même sujet"],
  },
];

/** Les fiches dans l'ordre du parcours conseillé. */
export const TUTORIELS_PAR_PARCOURS = [...TUTORIELS].sort((a, b) => a.ordre - b.ordre);

export function getTutoriel(slug: string): Tutoriel | undefined {
  return TUTORIELS.find((t) => t.slug === slug);
}

/** Les outils réellement présents dans la bibliothèque, pour les filtres. */
export function outilsDisponibles(): TutorielOutil[] {
  const vus = new Set(TUTORIELS.map((t) => t.outil));
  return (Object.keys(OUTIL_LABELS) as TutorielOutil[]).filter((o) => vus.has(o));
}

export function formatDateFr(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
