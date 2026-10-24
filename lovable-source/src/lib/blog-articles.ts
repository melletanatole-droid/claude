/**
 * Articles éditoriaux du blog Médicilline.
 *
 * Deux sources alimentent le blog : les billets rédigés depuis /admin (table
 * Supabase `posts`, texte brut) et ces articles éditoriaux, versionnés avec le
 * site parce qu'ils embarquent des figures — visuels produits par
 * `scripts/medi_visuel.py` (spec JSON → PNG à la charte) et photos Pexels,
 * tous hébergés sous /blog/.
 *
 * Règles : un chiffre n'est jamais retapé ni arrondi ; chaque article se
 * termine par ses sources datées ; un slug publié ne se renomme jamais.
 */

export type BlogCategory = "ia-medicale" | "pedagogie" | "maison";

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "figure"; src: string; alt: string; caption?: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; title: string; items: string[] }
  | { type: "link"; label: string; to: string };

export type BlogSource = { label: string; date: string; url: string };

export type BlogArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  /** Date de publication, ISO. */
  publishedAt: string;
  /** Photo de couverture (Pexels), 1200 × 675, hébergée sous /blog/. */
  cover: { src: string; alt: string; credit: string };
  readingMinutes: number;
  blocks: BlogBlock[];
  sources: BlogSource[];
};

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: "1357-dispositifs-ia-autorises-3-evalues-benefice-patient",
    title: "1 357 dispositifs d'IA autorisés, 3 évalués sur la santé du patient",
    excerpt:
      "Une autorisation réglementaire n'est pas une preuve de bénéfice. Le recensement publié dans PLOS Digital Health met un chiffre sur l'écart — et change la question à poser à un éditeur.",
    category: "ia-medicale",
    publishedAt: "2026-09-03",
    cover: {
      src: "/blog/preuve-ia-medicale-photo.jpg",
      alt: "Écrans d'imagerie médicale affichant des coupes IRM dans un service hospitalier",
      credit: "Photo : Charlss GonzHu — Pexels",
    },
    readingMinutes: 5,
    blocks: [
      {
        type: "p",
        text: "Quand un éditeur présente un outil d'IA médicale, l'argument arrive vite : « autorisé par la FDA », « marqué CE ». C'est vrai, et c'est vérifiable. Mais cela ne répond pas à la seule question qui compte en consultation : cet outil a-t-il amélioré quelque chose pour un patient ?",
      },
      {
        type: "p",
        text: "Une équipe de l'université de Toronto a passé au crible l'ensemble des dispositifs médicaux fondés sur l'IA autorisés par la FDA. Le résultat, publié le 19 août 2026 dans PLOS Digital Health, tient en trois nombres.",
      },
      {
        type: "figure",
        src: "/blog/preuve-ia-medicale-kpi.png",
        alt: "Trois chiffres : 1 357 dispositifs autorisés, 34 dans un essai enregistré, 3 évalués sur un critère patient",
        caption:
          "Catégories emboîtées : les 3 font partie des 34. Un essai enregistré n'est pas encore une preuve de bénéfice.",
      },
      { type: "h2", text: "Ce que mesure une autorisation, et ce qu'elle ne mesure pas" },
      {
        type: "p",
        text: "Une autorisation atteste qu'un dispositif fait ce qu'il annonce dans des conditions définies : détecter une lésion sur une image, signaler une anomalie, produire un score. Elle n'exige pas de démontrer qu'à l'arrivée, le patient est mieux diagnostiqué, mieux traité ou sorti plus tôt. Sur 1 357 dispositifs, trente-quatre figurent dans un essai clinique enregistré. Trois ont été évalués sur un critère qui concerne directement le patient.",
      },
      {
        type: "p",
        text: "Les mêmes auteurs relèvent un second angle mort : les études existantes excluent régulièrement les femmes enceintes, les personnes de plus de 75 ans et les non-anglophones. Autrement dit, les populations qui remplissent une salle d'attente ordinaire sont souvent celles sur lesquelles l'outil n'a pas été testé.",
      },
      { type: "h2", text: "Pourquoi l'écart se creuse maintenant" },
      {
        type: "p",
        text: "Deux mouvements se superposent. D'un côté, l'IA générative entre dans les dispositifs médicaux, et son comportement change d'une version à l'autre : la FDA a ouvert le 18 août 2026 une consultation publique sur leur encadrement, jusqu'au 19 octobre. De l'autre, les grands éditeurs de logiciels hospitaliers déploient l'IA d'abord sur l'administratif — accord préalable, courriers, planification — c'est-à-dire là où la preuve d'un bénéfice clinique est la moins exigée.",
      },
      {
        type: "p",
        text: "Le marché avance donc plus vite que la preuve, et il avance sur le terrain où la preuve est la moins demandée. Ce n'est pas un scandale : c'est la logique d'un cadre réglementaire conçu pour des dispositifs qui ne changeaient pas après leur mise sur le marché.",
      },
      { type: "h2", text: "La question à poser à un éditeur" },
      {
        type: "p",
        text: "La conséquence pratique est simple. « Êtes-vous autorisé ? » est une question nécessaire, mais elle ne discrimine pas : 1 357 outils répondent oui. La question utile est : « sur quel critère votre outil a-t-il été évalué, et sur quelle population ? ». Un éditeur sérieux a la réponse ; un éditeur qui la contourne vous a déjà renseigné.",
      },
      {
        type: "figure",
        src: "/blog/preuve-ia-medicale-checklist.png",
        alt: "Liste des questions à poser à un éditeur : critère d'évaluation, population, protocole enregistré ; et des questions insuffisantes : autorisation, score global",
        caption: "Trois questions qui discriminent, deux qui rassurent sans renseigner.",
      },
      {
        type: "p",
        text: "Une précision d'honnêteté : l'étude de Toronto recense des dispositifs et des essais, elle ne mesure pas elle-même un bénéfice patient. Elle dit où la preuve manque, pas que les outils sont inefficaces. C'est exactement l'information dont vous avez besoin pour poser la bonne question.",
      },
      {
        type: "callout",
        title: "Ce qu'il faut retenir",
        items: [
          "1 357 dispositifs d'IA autorisés par la FDA ; 34 dans un essai enregistré ; 3 évalués sur un critère patient.",
          "Une autorisation atteste une conformité, pas un bénéfice clinique.",
          "Demandez le critère d'évaluation et la population testée, jamais le seul statut réglementaire.",
          "La consultation de la FDA sur l'IA générative est ouverte jusqu'au 19 octobre 2026.",
        ],
      },
    ],
    sources: [
      {
        label:
          "Abulibdeh R. et al., recensement des dispositifs médicaux à IA autorisés par la FDA, PLOS Digital Health (DOI 10.1371/journal.pdig.0001597)",
        date: "19 août 2026",
        url: "https://www.news-medical.net/news/20260820/FDA-cleared-medical-AI-rarely-tested-for-real-world-benefits.aspx",
      },
      {
        label:
          "FDA — document de travail sur les dispositifs fondés sur l'IA générative, consultation publique ouverte jusqu'au 19 octobre 2026 (analyse STAT)",
        date: "25 août 2026",
        url: "https://www.statnews.com/2026/08/25/fda-promises-new-ai-guidance-and-epic-ugm-updates/",
      },
      {
        label: "Healthcare IT News — Epic mise sur l'IA administrative à son congrès utilisateurs",
        date: "18 août 2026",
        url: "https://www.healthcareitnews.com/news/epic-bets-its-ai-speed-ugm",
      },
    ],
  },

  {
    slug: "92-pour-cent-a-l-examen-44-au-lit-du-patient",
    title: "92 % à l'examen, 44,8 % au lit du patient : ce qu'un score d'IA ne dit pas",
    excerpt:
      "Les grands modèles réussissent les examens de médecine. Sur des tâches cliniques réelles, ils tombent à 44,8 %. L'écart n'est pas une panne : les deux épreuves ne mesurent pas la même chose.",
    category: "pedagogie",
    publishedAt: "2026-09-03",
    cover: {
      src: "/blog/benchmark-examen-clinique-photo.jpg",
      alt: "Étudiants dans un amphithéâtre lumineux, livres ouverts",
      credit: "Photo : Yusuf Çelik — Pexels",
    },
    readingMinutes: 5,
    blocks: [
      {
        type: "p",
        text: "Tout étudiant en médecine connaît la différence entre réussir un QCM et tenir une consultation. Les grands modèles de langage viennent d'en faire la démonstration à grande échelle : environ 92 % de réussite aux examens de licence médicale, 44,8 % sur des tâches cliniques réelles. Un cadre d'évaluation publié dans Nature Medicine le 28 juillet 2026 propose de prendre cet écart au sérieux.",
      },
      {
        type: "figure",
        src: "/blog/benchmark-examen-clinique-slope.png",
        alt: "Pente de 92 % aux examens de licence à 44,8 % sur tâches cliniques réelles, soit 47 points d'écart",
        caption:
          "Les mêmes modèles, deux épreuves. Scores agrégés, sans mesure de bénéfice patient.",
      },
      { type: "h2", text: "Pourquoi un QCM est une épreuve facile pour une machine" },
      {
        type: "p",
        text: "Un énoncé d'examen est un cas déjà trié. Les éléments pertinents ont été sélectionnés par l'auteur de la question, les distracteurs sont connus, et la bonne réponse figure toujours dans la liste. Le travail consiste à reconnaître, pas à décider. C'est précisément ce qu'un modèle entraîné sur des millions de textes fait le mieux.",
      },
      {
        type: "p",
        text: "En consultation, aucune de ces conditions n'est réunie. Le patient arrive avec un motif, des antécédents partiels et des symptômes dont la moitié se révélera sans rapport. Le geste clinique consiste d'abord à décider quelle information manque et laquelle ignorer — une opération que les examens standardisés ne testent à aucun moment. Le benchmark BRIDGE, développé par Mass General Brigham sur des tâches issues de dossiers réels, mesure cette opération. Les scores s'y effondrent.",
      },
      { type: "h2", text: "Ce que cela enseigne, au-delà de l'IA" },
      {
        type: "p",
        text: "L'écart de 47 points est aussi une leçon de pédagogie médicale. Il rend visible ce que les enseignants savent depuis longtemps : la restitution et le raisonnement sont deux compétences distinctes, et la première prédit mal la seconde. Un outil qui « réussit l'examen » n'a démontré que la première. C'est vrai d'un modèle ; c'est vrai aussi d'un étudiant, et c'est pour cela que l'externat existe.",
      },
      {
        type: "p",
        text: "Pour les étudiants et les internes qui utilisent déjà ces outils pour réviser, la conséquence est nette : un modèle est un excellent partenaire de restitution — fiches, définitions, reformulations — et un partenaire fragile de raisonnement clinique. Lui demander « quel est le diagnostic » revient à lui poser une question d'examen sur un cas qui n'en est pas un.",
      },
      { type: "h2", text: "Trois questions avant de croire un score" },
      {
        type: "p",
        text: "Le score global qu'un éditeur affiche ne vous renseigne pas. La question utile n'est pas « quel score obtient cet outil » mais « sur quelles tâches a-t-il été évalué, et ressemblent-elles à ma pratique ». Un outil validé sur la rédaction de comptes rendus ne dit rien de sa fiabilité en diagnostic différentiel.",
      },
      {
        type: "figure",
        src: "/blog/benchmark-examen-clinique-steps.png",
        alt: "Trois questions : sur quelles tâches, avec quel énoncé, mesuré sur qui",
        caption: "La grille de lecture d'un score, en trois questions.",
      },
      {
        type: "p",
        text: "Ces réserves valent pour l'étude elle-même. Ce sont des scores de benchmark agrégés sur des modèles généralistes, sans mesure de morbi-mortalité, et le cadre proposé n'a été repris par aucun régulateur à ce jour. Il décrit un écart ; il ne mesure pas un bénéfice ou un risque pour un patient.",
      },
      {
        type: "callout",
        title: "Ce qu'il faut retenir",
        items: [
          "92 % aux examens de licence, 44,8 % sur tâches cliniques réelles : 47 points d'écart pour les mêmes modèles.",
          "Un QCM teste la reconnaissance ; la consultation teste le tri de l'information. Ce ne sont pas les mêmes compétences.",
          "Demandez sur quelles tâches un outil a été évalué, jamais son score global.",
          "Aucune de ces données ne mesure un bénéfice patient.",
        ],
      },
    ],
    sources: [
      {
        label: "« Toward a test of medical AI superintelligence », Nature Medicine",
        date: "28 juillet 2026",
        url: "https://www.nature.com/articles/s41591-026-04539-8",
      },
      {
        label:
          "Clinical Trial Vanguard — analyse du cadre d'évaluation de Nature Medicine et de ce que la guidance FDA n'aborde pas encore",
        date: "28 juillet 2026",
        url: "https://www.clinicaltrialvanguard.com/opinion/nature-medicines-2026-medical-ai-superintelligence-framework-signals-what-fda-benchmarking-guidance-has-not-yet-addressed/",
      },
    ],
  },

  {
    slug: "verifier-une-reference-donnee-par-une-ia",
    title: "Deux références inventées sur trois s'ouvrent quand même",
    excerpt:
      "Sur 176 citations produites par un modèle, 35 étaient fabriquées — et 64 % de leurs DOI menaient à un article réel, sans rapport. Cliquer sur le lien est le geste qui rassure à tort. Voici celui qui tranche.",
    category: "pedagogie",
    publishedAt: "2026-09-03",
    cover: {
      src: "/blog/verifier-reference-ia-photo.jpg",
      alt: "Jeune homme à lunettes lisant entre les rayonnages d'une bibliothèque",
      credit: "Photo : Yan Krukau — Pexels",
    },
    readingMinutes: 6,
    blocks: [
      {
        type: "p",
        text: "Demander une bibliographie à un modèle de langage est devenu un réflexe : pour une thèse, un mémoire, une présentation de service. La réponse arrive propre — auteurs, revue, année, DOI. C'est précisément cette propreté qui pose problème : une référence fabriquée a exactement la même forme qu'une référence réelle.",
      },
      {
        type: "p",
        text: "Une équipe a demandé à GPT-4o six revues de littérature en santé mentale, puis a vérifié une par une chacune des 176 citations produites. L'étude, publiée dans JMIR Mental Health le 12 novembre 2025, donne trois nombres à retenir.",
      },
      {
        type: "figure",
        src: "/blog/verifier-reference-ia-kpi.png",
        alt: "176 citations vérifiées, 35 fabriquées soit 19,9 %, 64 % des DOI fabriqués menant à un article réel sans rapport",
        caption:
          "Six revues de littérature, un modèle généraliste. Les taux ne se transposent pas tels quels à d'autres disciplines.",
      },
      { type: "h2", text: "Le taux monte avec la précision de la question" },
      {
        type: "p",
        text: "Le résultat le plus utile pour la pratique n'est pas le taux moyen. C'est sa variation : sur un même trouble, une revue générale donne 17 % de références inventées, une revue spécialisée 46 %. Plus la question est pointue, moins le modèle dispose de textes réels pour y répondre — et plus il comble. Or la question pointue est celle qu'un praticien ou un interne pose.",
      },
      {
        type: "figure",
        src: "/blog/verifier-reference-ia-bar.png",
        alt: "Barres : 17 % de références fabriquées sur une revue générale, 46 % sur une revue spécialisée du même trouble",
        caption:
          "Contraste mesuré sur un seul trouble (36 citations contre 24, P = .01) : il indique un sens, pas une amplitude générale.",
      },
      { type: "h2", text: "Pourquoi cliquer sur le DOI ne protège pas" },
      {
        type: "p",
        text: "Le réflexe de vérification le plus répandu consiste à ouvrir le lien. Il rassure : parmi les références fabriquées assorties d'un DOI, 64 % de ces DOI étaient valides et menaient à un article réel — mais sans rapport avec ce qu'on vous affirmait. Le modèle a assemblé un identifiant plausible ; il pointe quelque part, et ce quelque part n'est pas la référence annoncée. Seule la recherche du titre exact dans PubMed tranche.",
      },
      {
        type: "p",
        text: "Il existe un quatrième profil, plus discret encore : l'article existe, le titre est exact, mais le résumé ne dit pas ce que le modèle lui fait dire. Une étude rétrospective présentée comme causale, un résultat secondaire promu en conclusion. Une vérification qui s'arrête à « l'article existe » valide cette référence. Il faut lire le résumé.",
      },
      { type: "h2", text: "Le protocole en cinq gestes" },
      {
        type: "figure",
        src: "/blog/verifier-reference-ia-steps.png",
        alt: "Cinq étapes : copier le titre exact dans PubMed, ouvrir le DOI et comparer le titre, lire le résumé, contrôler auteurs revue année, écarter en cas de doute",
        caption:
          "Comptez environ deux minutes par référence. C'est le prix d'une bibliographie qu'on peut citer.",
      },
      {
        type: "p",
        text: "En amont, un réglage change la donne : demander au modèle, avant la question, d'écrire « aucune référence certaine » quand il n'est pas sûr, plutôt que de proposer un auteur, une année ou un DOI plausibles. Le prompt ne rend pas le modèle savant ; il l'empêche de combler. La fiche complète, avec le prompt et un cas travaillé, est en accès libre sur le site.",
      },
      {
        type: "link",
        label: "Voir la fiche pas-à-pas : vérifier une référence donnée par une IA →",
        to: "/ressources/verifier-une-reference-ia",
      },
      {
        type: "callout",
        title: "Ce qu'il faut retenir",
        items: [
          "176 citations vérifiées, 35 fabriquées (19,9 %). Le taux monte de 17 % à 46 % quand la question devient spécialisée.",
          "64 % des DOI fabriqués s'ouvraient sur un article réel sans rapport : le clic ne prouve rien.",
          "Le geste qui tranche : le titre exact, entre guillemets, dans PubMed — puis lire le résumé.",
          "Un modèle généraliste, une discipline : les taux indiquent un mécanisme, pas une amplitude universelle.",
        ],
      },
    ],
    sources: [
      {
        label:
          "Linardon J. et al., « Influence of Topic Familiarity and Prompt Specificity on Citation Fabrication in Mental Health Research Using Large Language Models », JMIR Mental Health",
        date: "12 novembre 2025",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12658395/",
      },
      {
        label:
          "Médicilline — fiche ressource « Vérifier une référence donnée par une IA » (prompt complet, protocole, cas d'usage)",
        date: "1er septembre 2026",
        url: "https://medicilline.ai/ressources/verifier-une-reference-ia",
      },
    ],
  },

  {
    slug: "comptes-rendus-ia-omission-18-pour-cent",
    title: "18 % des comptes rendus générés par IA oublient quelque chose qui a été dit",
    excerpt:
      "On surveille l'hallucination. C'est l'omission qui domine — et elle ne se voit pas : un compte rendu amputé se lit parfaitement bien. Ce que l'étude mesure, et ce que votre relecture tient désormais.",
    category: "ia-medicale",
    publishedAt: "2026-09-03",
    cover: {
      src: "/blog/compte-rendu-omission-photo.jpg",
      alt: "Un professionnel de santé prend des notes sur un dossier pendant une consultation",
      credit: "Photo : SHVETS production — Pexels",
    },
    readingMinutes: 5,
    blocks: [
      {
        type: "p",
        text: "Les scribes à écoute ambiante — ces outils qui enregistrent la consultation et en tirent un compte rendu — se répandent vite, avec une promesse simple : rendre du temps au médecin. La crainte qui les accompagne est tout aussi simple : l'hallucination, la phrase inventée. Une étude pilote publiée dans JMIR Medical Informatics le 17 avril 2026 montre que cette crainte vise à côté.",
      },
      {
        type: "p",
        text: "Les auteurs ont fait relire 356 comptes rendus générés par le médecin qui les avait signés, en les confrontant à ce qui s'était réellement dit. L'erreur la plus fréquente n'est pas l'invention. C'est l'oubli.",
      },
      {
        type: "figure",
        src: "/blog/compte-rendu-omission-bar.png",
        alt: "Barres : omissions 18 %, hallucinations 11,5 %, ajouts non dits 9,3 %, biais 1,1 %",
        caption:
          "Sur 356 comptes rendus relus par leur auteur. Un même compte rendu peut porter plusieurs types d'erreur : les taux ne s'additionnent pas.",
      },
      { type: "h2", text: "Pourquoi l'omission est plus dangereuse que l'hallucination" },
      {
        type: "p",
        text: "Une hallucination laisse une trace : une phrase qui détonne, un chiffre qui ne colle pas, quelque chose que le relecteur attentif accroche. Une omission ne laisse rien. Le compte rendu est fluide, structuré, sans faute, et il manque l'intolérance à l'aspirine mentionnée en fin de consultation, l'automédication par ibuprofène, la consigne de reconsulter en cas de prise de poids. Rien, à la lecture seule, ne signale le trou.",
      },
      {
        type: "p",
        text: "Et ce qui n'est pas tracé n'existe pas : ni pour le confrère qui reprend le dossier, ni pour le prochain bilan qu'il faudrait rapprocher, ni en cas d'événement. L'omission est l'erreur qui se propage le plus loin parce qu'elle est celle qu'on ne voit pas partir.",
      },
      { type: "h2", text: "Ce que la relecture tient désormais, juridiquement" },
      {
        type: "p",
        text: "Depuis le 29 juillet 2026, le régulateur britannique des dispositifs médicaux, la MHRA, a précisé le statut de ces outils : un scribe qui transcrit et résume n'est pas un dispositif médical tant qu'un clinicien relit et valide. Il le devient s'il interprète, suggère une conduite à tenir ou écrit au dossier sans passage par le médecin. Autrement dit, votre relecture n'est plus seulement une bonne pratique. C'est elle qui tient le statut de l'outil.",
      },
      {
        type: "p",
        text: "En France, la qualification relève du règlement européen sur les dispositifs médicaux et d'une analyse distincte ; mais la logique est la même, et elle place le médecin exactement là où l'étude montre que l'erreur se cache.",
      },
      { type: "h2", text: "Quatre champs à relire, deux réflexes à perdre" },
      {
        type: "figure",
        src: "/blog/compte-rendu-omission-checklist.png",
        alt: "À relire : allergies, traitements dont automédication, signes négatifs, consignes au patient. À éviter : demander la version corrigée à l'outil, laisser l'outil écrire au dossier",
        caption:
          "Les quatre champs où une omission coûte le plus cher, et les deux gestes qui font perdre la trace de la relecture.",
      },
      {
        type: "p",
        text: "Relire, ce n'est pas relire le texte : c'est le confronter à la consultation. Concrètement, on reprend d'abord les allergies et intolérances, les traitements en cours automédication comprise, les signes négatifs de l'examen et les consignes données au patient. On corrige soi-même dans le logiciel — jamais en demandant à l'outil une version corrigée, sinon la trace de ce qui a été changé disparaît. Et on désactive, une fois pour toutes, tout ce qui écrit au dossier sans passer par soi.",
      },
      {
        type: "link",
        label: "Voir la fiche pas-à-pas : le relecteur de compte rendu →",
        to: "/ressources/relecture-compte-rendu-ia",
      },
      {
        type: "p",
        text: "Les limites de l'étude sont celles d'un pilote : un seul centre, un seul outil, des consultations ambulatoires. Ses taux ne se transposent pas tels quels à un autre logiciel. Le mécanisme, lui, se transpose : un résumé est par construction une sélection, et une sélection oublie.",
      },
      {
        type: "callout",
        title: "Ce qu'il faut retenir",
        items: [
          "Omission 18 %, hallucination 11,5 % : l'erreur dominante est celle qu'on ne voit pas à la lecture.",
          "Depuis le 29 juillet 2026 au Royaume-Uni, c'est la relecture du clinicien qui maintient le scribe hors du statut de dispositif médical.",
          "Relire = confronter le compte rendu à la consultation, en commençant par allergies, traitements, signes négatifs, consignes.",
          "Étude monocentrique, un seul outil : les taux indiquent un mécanisme, pas une norme.",
        ],
      },
    ],
    sources: [
      {
        label:
          "« Quality of Clinical Notes Created by Ambient Listening Generative AI: Pragmatic Prospective Pilot Study », JMIR Medical Informatics (DOI 10.2196/86474)",
        date: "17 avril 2026",
        url: "https://pubmed.ncbi.nlm.nih.gov/41996389/",
      },
      {
        label:
          "MHRA — guidance sur les produits fondés sur la technologie vocale ambiante, analysée par Inside EU Life Sciences",
        date: "29 juillet 2026",
        url: "https://www.insideeulifesciences.com/2026/08/06/new-uk-guidance-clarifies-medical-device-status-of-ai-scribes/",
      },
      {
        label: "STAT — la vision du régulateur britannique sur les scribes IA",
        date: "4 août 2026",
        url: "https://www.statnews.com/2026/08/04/ai-scribes-medical-devices-uk-regulator-view-health-tech/",
      },
    ],
  },

  {
    slug: "ouvrage-augmente-ce-qui-se-passe-derriere-le-qr",
    title: "Ce qui se passe derrière le QR : pourquoi nos livres sont « augmentés »",
    excerpt:
      "Un livre sur l'IA médicale est périmé le jour de son impression — sauf si le chapitre imprimé n'est que la moitié du livre. Ce que nous mettons derrière chaque QR, et pourquoi.",
    category: "maison",
    publishedAt: "2026-09-03",
    cover: {
      src: "/blog/ouvrage-augmente-photo.jpg",
      alt: "Carnet, stéthoscope et matériel médical disposés sur un bureau en bois",
      credit: "Photo : Tima Miroshnichenko — Pexels",
    },
    readingMinutes: 4,
    blocks: [
      {
        type: "p",
        text: "Il y a un problème que toute maison d'édition médicale connaît et que l'IA rend brutal : le délai entre la dernière relecture et la première lecture. Un manuel d'anatomie supporte ce délai. Un livre qui explique comment régler un scribe ambiant, quel prompt donner à un modèle ou ce que dit le règlement européen ne le supporte pas. L'outil a changé de version entre l'imprimerie et la librairie.",
      },
      {
        type: "p",
        text: "Nous avons choisi de ne pas faire semblant. Un ouvrage Médicilline est conçu en deux parties : ce qui ne bouge pas est imprimé, ce qui bouge est en ligne. Et le lien entre les deux est un QR, en marge, à chaque chapitre.",
      },
      {
        type: "figure",
        src: "/blog/ouvrage-augmente-flow.png",
        alt: "Quatre étapes : le chapitre, le QR en marge, le contenu vivant (vidéo, visuel, prompt), la mise à jour",
        caption: "Le principe éditorial des collections IA Minute et Digidoc 2030.",
      },
      { type: "h2", text: "Ce qui est imprimé, ce qui est en ligne" },
      {
        type: "p",
        text: "Sur le papier : le chapitre court, visuel, avec l'idée qui tient sur une page — pourquoi un score de benchmark ne prédit pas la consultation, pourquoi l'omission domine l'hallucination dans un compte rendu, dans quel ordre interroger une IA diagnostique. Ces mécanismes ne se périment pas ; ils sont ce qu'un médecin doit avoir compris une fois pour toutes.",
      },
      {
        type: "p",
        text: "Derrière le QR : la vidéo courte qui montre le geste, le visuel de données à sa dernière valeur, et le prompt complet, tel qu'il se copie. Ce sont les éléments qui dépendent d'un outil, d'une version, d'un texte réglementaire. Quand l'outil change, la page change. Le livre, lui, reste juste.",
      },
      { type: "h2", text: "Pourquoi le visuel compte autant que le texte" },
      {
        type: "p",
        text: "La maison a été fondée par le Dr Guillaume Zagury avec le Dr Frédérick Georget autour d'une conviction : la médecine s'apprend mieux quand elle est claire, visuelle et colorée. Ce n'est pas une coquetterie graphique. Un chiffre sans sa phrase de lecture se retient mal ; une méthode sans ses étapes numérotées ne s'applique pas. Chaque visuel que nous publions — dans un livre, dans une newsletter, sur ce blog — porte sa source datée et ce qu'il ne dit pas. C'est la même exigence qu'un article de revue, appliquée à une image.",
      },
      {
        type: "p",
        text: "C'est aussi pourquoi les visuels de nos ouvrages ne sont pas dessinés à la main ni générés par une image d'IA : ils sont produits à partir d'une spécification qui contient la valeur, la source et la limite d'interprétation. Le même chiffre, à la même valeur, dans le livre, la newsletter et la vidéo.",
      },
      { type: "h2", text: "Deux titres à paraître en novembre et décembre" },
      {
        type: "figure",
        src: "/blog/ouvrage-augmente-livre.png",
        alt: "Deux cartes de livres : IA Minute, IA générative pour les médecins, qui sort le 13 novembre 2026, et Digidoc 2030, qui sort le 12 décembre 2026",
        caption: "Les deux premiers ouvrages conçus dès l'origine comme augmentés.",
      },
      {
        type: "p",
        text: "IA Minute : IA générative pour les médecins pose les bases en clinique — rédaction, synthèses, aide au diagnostic, prompts prêts à l'emploi. Digidoc 2030 décrit dix-huit ruptures technologiques qui transforment la médecine d'ici 2030, en cent trente-trois visuels pédagogiques. IA Minute sort le 13 novembre, Digidoc 2030 le 12 décembre ; les QR de chaque chapitre pointent vers des pages qui vivront aussi longtemps que le livre sera lu.",
      },
      {
        type: "p",
        text: "En attendant, ce blog et nos trois newsletters — Fiche pratique IA, La médecine de demain, Actualité IA — fonctionnent sur le même principe : un mécanisme expliqué, un visuel sourcé, et le contenu complet en accès libre sur le site.",
      },
      {
        type: "link",
        label: "Découvrir les collections →",
        to: "/",
      },
      {
        type: "callout",
        title: "Ce qu'il faut retenir",
        items: [
          "Ce qui ne change pas est imprimé ; ce qui change est derrière le QR et se met à jour.",
          "Derrière chaque QR : la vidéo, le visuel à sa dernière valeur, le prompt complet.",
          "Chaque visuel porte sa source datée et sa limite d'interprétation.",
          "IA Minute sort le 13 novembre 2026, Digidoc 2030 le 12 décembre 2026.",
        ],
      },
    ],
    sources: [
      {
        label:
          "Médicilline — catalogue et collections (IA Minute, Digidoc 2030, Medi-Mémo-Minute, COVID XXI)",
        date: "septembre 2026",
        url: "https://medicilline.ai/",
      },
      {
        label: "Médicilline — les fiches ressources en accès libre",
        date: "septembre 2026",
        url: "https://medicilline.ai/ressources/verifier-une-reference-ia",
      },
    ],
  },
];

export const BLOG_ARTICLES_BY_SLUG: Record<string, BlogArticle> = Object.fromEntries(
  BLOG_ARTICLES.map((a) => [a.slug, a]),
);

export function getBlogArticle(slug: string): BlogArticle | undefined {
  return BLOG_ARTICLES_BY_SLUG[slug];
}
