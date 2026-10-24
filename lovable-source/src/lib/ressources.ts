/**
 * Annexes des newsletters Médicilline.
 *
 * Ces pages sont volontairement NON RÉFÉRENCÉES (`noindex, nofollow`, hors
 * sitemap, hors navigation) : ce sont les contenus complets — prompts,
 * protocoles, check-lists — que les emails ne montrent qu'en extrait, pour
 * ramener le lecteur sur le site sans polluer l'index SEO du domaine.
 *
 * Règle : une ressource n'est JAMAIS supprimée ni son slug renommé. Un lien
 * parti dans un email doit rester valide indéfiniment.
 */

export type RessourceTrack = "pratique" | "demain" | "actu";

export type RessourceSource = {
  label: string;
  date: string;
  url: string;
};

/** Un visuel de la fiche : toujours un raster déjà hébergé sous /newsletter-assets/. */
export type RessourceVisual = {
  src: string;
  alt: string;
  caption?: string;
};

/**
 * Le cas d'usage travaillé : ce qui transforme un protocole en fiche utilisable.
 * Les cas sont FICTIFS et construits pour la démonstration — `context` doit le
 * dire explicitement, on ne publie pas de dossier réel, même anonymisé.
 */
export type RessourceCase = {
  title: string;
  context: string;
  /** Photo d'ambiance (Pexels) posée sous le contexte, avant le tableau. */
  photo?: RessourceVisual;
  rows: { field: string; found: string; impact: string }[];
  verdict: string;
};

export type Ressource = {
  slug: string;
  /** Titre de la page (et du numéro d'origine). */
  title: string;
  /** Sous-titre : ce que le lecteur repart avec. */
  subtitle: string;
  track: RessourceTrack;
  /** Date du numéro d'origine, ISO. */
  issueDate: string;
  /** Étiquette du bloc copiable : « Prompt », « Protocole », « Check-list »… */
  bodyLabel: string;
  /** 2-3 phrases de contexte : pourquoi ce contenu existe. */
  intro: string;
  /** Photo d'ouverture (Pexels), posée juste sous l'intro. */
  hero?: RessourceVisual;
  /** Le contenu complet, copiable tel quel. */
  body: string;
  /** Visuel posé juste avant le bloc copiable — son mode d'emploi. */
  bodyVisual?: RessourceVisual;
  /** La fiche imprimable (A4), affichée en tête et téléchargeable. */
  sheet?: RessourceVisual & { downloadSrc?: string };
  /** Le cas d'usage travaillé, affiché avant le contenu copiable. */
  caseStudy?: RessourceCase;
  /** Les visuels du numéro d'origine, repris en bas de fiche. */
  figures?: RessourceVisual[];
  /** Comment s'en servir, 3-4 étapes. */
  howTo: string[];
  /** Ce que ce contenu ne fait pas. Jamais vide. */
  limits: string[];
  sources: RessourceSource[];
};

const CONTRADICTEUR_DIAGNOSTIQUE = `Tu es un contradicteur diagnostique. Ton rôle n'est pas de me donner un
diagnostic : c'est de tester celui que j'ai déjà posé.

MON HYPOTHÈSE PRINCIPALE : [votre diagnostic de travail]
MES DEUX HYPOTHÈSES SECONDAIRES : [les deux autres qui vous viennent]

ÉLÉMENTS CLINIQUES
- Terrain : [âge, sexe, antécédents, traitements en cours]
- Motif : [motif de consultation, ancienneté des symptômes]
- Anamnèse : [chronologie, facteurs déclenchants, évolution]
- Examen : [constantes, signes positifs ET signes négatifs pertinents]
- Déjà disponible : [biologie, imagerie, ECG… ou « aucun »]

CE QUE TU DOIS FAIRE, DANS CET ORDRE :

1. ARGUMENTS CONTRE mon hypothèse principale.
   Uniquement les éléments du dossier qui la contredisent ou qu'elle
   n'explique pas. Ne me donne aucun argument POUR : je les ai déjà.

2. CE QUI MANQUE.
   Quelle information absente changerait le plus ma conclusion ?
   Classe par pouvoir discriminant décroissant, cinq maximum.

3. DIAGNOSTICS À NE PAS MANQUER.
   Parmi ceux compatibles avec ce tableau, lesquels sont graves, urgents
   ou à conséquence irréversible s'ils sont manqués ? Pour chacun : le
   signe qui l'écarterait, et le signe qui l'imposerait.

4. BIAIS PROBABLES.
   Quel biais cognitif ma formulation trahit-elle (ancrage, disponibilité,
   clôture prématurée, confirmation) ? Cite la phrase exacte de mon
   énoncé qui le révèle.

5. TON VERDICT, EN DERNIER SEULEMENT.
   Une ligne : mon hypothèse principale te paraît-elle la plus probable,
   oui ou non, et à quelle condition.

CONTRAINTES
- N'invente aucun élément clinique absent de mon énoncé. Si une donnée
  manque, écris « non renseigné » — ne comble pas.
- Ne produis aucun score de probabilité chiffré : tu n'as pas les données
  pour le calculer honnêtement.
- Si mon énoncé est trop pauvre pour conclure, dis-le et arrête-toi à
  l'étape 2.
- Réponds en français, en listes courtes. Pas de préambule.`;

const RELECTEUR_COMPTE_RENDU = `Tu es relecteur de compte rendu, pas rédacteur. Je te donne la
transcription brute de la consultation, puis le compte rendu qui en
a été tiré. Ne réécris rien : compare, et rends trois listes.

TRANSCRIPTION BRUTE :
[collez ici la transcription produite par l'outil, ou vos notes prises
pendant la consultation]

COMPTE RENDU GÉNÉRÉ :
[collez ici le texte que l'outil vous propose de signer]

CE QUE TU DOIS PRODUIRE, DANS CET ORDRE :

1. DIT MAIS ABSENT.
   Chaque élément présent dans la transcription et manquant dans le
   compte rendu. Cite la phrase source entre guillemets. Commence
   par ces quatre catégories, dans cet ordre : allergies,
   traitements en cours, signes négatifs, consignes de surveillance
   données au patient.

2. ÉCRIT MAIS NON DIT.
   Chaque affirmation du compte rendu que la transcription ne
   soutient pas. Distingue deux cas, et dis lequel : l'inférence
   plausible (« probablement déduit de… », avec la phrase d'origine)
   et l'élément sans aucune origine repérable.

3. DIT AUTREMENT.
   Chaque endroit où le compte rendu a changé la force d'une
   affirmation : un doute devenu une certitude, un « peut-être »
   devenu un constat, un symptôme rapporté par le patient présenté
   comme un signe constaté à l'examen.

CONTRAINTES
- Cite toujours. Une ligne sans citation de la transcription n'a
  aucune valeur : je ne peux pas la vérifier.
- Ne comble aucun trou. Si une information manque dans les DEUX
  textes, ce n'est pas une omission du compte rendu : ne l'ajoute
  pas pour étoffer la liste.
- N'améliore pas le style, ne propose pas de reformulation, ne
  rédige aucune version corrigée. Ce n'est pas ton rôle ici.
- Si une des trois listes est vide, écris « aucun ». Ne force pas.
- Termine par une ligne unique commençant par « À vérifier en
  priorité : », suivie du seul point dont la correction changerait
  la prise en charge.
- Réponds en français, en listes courtes. Pas de préambule.`;

const REGLAGES_NABLA = `RÉGLAGES → MODÈLES → INSTRUCTIONS GÉNÉRALES
Trois instructions, pas trente. Au-delà, elles se contredisent et le
résultat devient instable d'une note à l'autre.

1. Je suis [votre spécialité]. N'inclure que les informations
   relatives à la consultation en cours, comme mentionné dans
   l'échange.

2. Style : phrases courtes, nominales, sans sujet. Ne pas reformuler
   les propos du patient en langage soutenu ; conserver le niveau de
   certitude tel qu'il a été exprimé.

3. Désigner le patient par « le patient » ou « la patiente », jamais
   par son prénom.

RÉGLAGES → MODÈLES → INSTRUCTIONS PAR SECTION
Une seule par section, et seulement là où vous corrigez tous les jours.

Anamnèse
   Inclure la latéralité et la localisation, comme mentionné.

Examen
   Inclure les signes négatifs énoncés à voix haute, comme mentionnés.
   Ne rien ajouter qui n'ait pas été dit.

Conclusion et conduite à tenir
   Inclure un paragraphe intitulé « Consignes données au patient » à la
   fin, reprenant les consignes de surveillance et de reconsultation
   comme mentionnées. S'il n'y en a pas eu, écrire « aucune ».

ÉQUIVALENTS ANGLAIS
Les mots-clés documentés par l'éditeur le sont en anglais. Si une
instruction française ne produit pas l'effet attendu, essayez :

   Include [...] as mentioned.
   Do not include [...] unless mentioned.
   Include a paragraph titled "[Titre]" at the end containing [...]
   as mentioned.

CE QU'IL NE FAUT PAS ÉCRIRE

   ✗ « Ajoute une section Consignes » — les mots « section » et
     « modèle » sont rapportés par l'outil à sa propre structure :
     l'instruction ne fait rien.

   ✗ « Sois plus précis » — sans objet nommé, une instruction de style
     n'a aucun effet reproductible.

   ✗ Le nom, la date de naissance ou le numéro de dossier d'un
     patient : une instruction est un réglage permanent, pas un champ
     de note.

LE TEST, AVANT DE FIGER QUOI QUE CE SOIT

1. Consultation blanche : parlez seul deux minutes, en énonçant
   volontairement un signe négatif et une consigne de surveillance.

2. Générez la note, et notez ce qui manque.

3. Demandez la correction en langage courant (Magic edit) :
   « Inclure les signes négatifs comme mentionnés. »

4. Si la version corrigée est celle que vous vouliez, recopiez
   l'instruction dans les réglages du modèle. Sinon, reformulez-la —
   n'en ajoutez pas une deuxième.`;

const TRADUCTEUR_PATIENT = `Tu réécris un compte rendu médical pour le patient lui-même.
Tu ne résumes pas : tu traduis. Tout ce qui est dans le texte d'origine
doit se retrouver dans le tien, y compris les nuances et les réserves.

RÈGLES ABSOLUES
- N'ajoute aucune information, aucun conseil, aucun chiffre, aucun
  diagnostic qui ne soit pas déjà dans le texte que je te donne.
- Ne supprime rien. Si une phrase est technique, traduis-la ; ne la
  coupe pas.
- Ne transforme jamais un résultat en pronostic. « Bon résultat
  immédiat » ne devient pas « c'est guéri ».
- Ne change pas le degré de certitude. « Probable » reste « probable »,
  « à confirmer » reste « à confirmer ».
- Si une information du texte t'est incompréhensible, recopie-la telle
  quelle et signale-la en fin de document sous « À faire préciser ».

NIVEAU DE LANGUE
- Phrases courtes, une idée par phrase. Voix active.
- Aucun sigle sans sa traduction à la première occurrence.
- Aucun terme latin ou grec sans son équivalent courant juste après,
  entre parenthèses.
- Niveau de lecture visé : fin de collège.

STRUCTURE DE SORTIE, DANS CET ORDRE
1. CE QUI A ÉTÉ FAIT
   L'examen ou l'intervention, en une à trois phrases.
2. CE QU'ON A TROUVÉ
   Les résultats, y compris ce qui est normal et ce qui reste
   incertain. Ne présente pas comme réglé ce qui est en surveillance.
3. CE QUI EST TRAITÉ, ET COMMENT
   Chaque médicament avec : à quoi il sert, combien de temps, et ce
   qu'il ne faut pas faire (arrêt, association, geste à signaler).
   La durée est obligatoire dès qu'elle figure dans le texte source.
4. CE QUI N'EST PAS TRAITÉ POUR L'INSTANT
   Ce qui a été vu et laissé en surveillance, et pourquoi on y revient.
5. QUAND FAUT-IL S'INQUIÉTER
   Les signes qui imposent de rappeler ou de consulter en urgence,
   séparés de ceux qu'il suffit de surveiller. Deux listes distinctes,
   jamais une seule.
6. LA SUITE
   Prochain rendez-vous, examens à faire, avec qui, et dans quel délai.
7. À FAIRE PRÉCISER
   Ce que tu n'as pas pu traduire sans risque de déformer.

CONTRÔLE FINAL, À AFFICHER APRÈS LE DOCUMENT
Sous le titre « VÉRIFICATIONS », liste :
- toute information du texte d'origine que tu n'as pas reprise ;
- toute phrase où tu as dû choisir entre deux interprétations ;
- toute durée, posologie ou date absente du texte source.
Si ces trois listes sont vides, écris « aucune ».

COMPTE RENDU À TRADUIRE :
[collez ici le compte rendu, anonymisé]`;

const BASCULE_DE_MODELE = `PROTOCOLE — vérifier qu'un changement de modèle n'a rien cassé.
À faire une fois, en vingt minutes. Le jeu de test resservira.

ÉTAPE 0 — CONSTITUER LE JEU DE TEST (une seule fois)
Cinq cas anonymisés tirés de vos usages réels :
  1. un cas court et banal ;
  2. un cas long (le document le plus volumineux que vous traitez) ;
  3. un cas incomplet, où une information manque volontairement ;
  4. un cas piégeux, où la bonne réponse est « je ne peux pas conclure » ;
  5. un cas où la sortie attendue est un refus.
Aucune donnée identifiante, même en interne.

ÉTAPE 1 — FIGER LA RÉFÉRENCE (pendant que l'ancien modèle existe)
Rejouez les cinq cas sur le modèle actuel. Enregistrez les sorties
telles quelles, datées, avec le nom du modèle. C'est le seul geste
qu'on ne peut plus faire après un retrait.

ÉTAPE 2 — REJOUER À L'IDENTIQUE
Sur le nouveau modèle, mêmes cas, même prompt, sans aucune retouche.
Le but n'est pas d'obtenir une bonne sortie : c'est de mesurer l'écart.

ÉTAPE 3 — COMPARER SUR QUATRE AXES, PAS SUR L'IMPRESSION
  FORMAT     — la structure demandée est-elle encore respectée ?
               (titres, ordre des sections, longueur)
  COMPLÉTUDE — une information présente dans la sortie de référence
               a-t-elle disparu ? C'est l'écart le plus fréquent et
               le moins visible : une sortie plus agréable à lire est
               souvent une sortie qui a coupé.
  PRUDENCE   — les réserves, les « à confirmer », les « non renseigné »
               sont-ils toujours là, ou ont-ils été lissés ?
  REFUS      — le cas 5 est-il toujours refusé ? Le cas 4 conclut-il
               toujours qu'il ne peut pas conclure ?

ÉTAPE 4 — DÉCIDER
  Aucun écart sur les quatre axes → on garde le prompt tel quel.
  Écart de format seul            → on ajuste la consigne de format.
  Écart de complétude ou de       → on ne bascule pas tant que le
  prudence                          prompt n'a pas été corrigé et
                                    re-testé sur les cinq cas.
  Écart sur les refus             → on arrête. Un modèle qui ne refuse
                                    plus ce qu'il refusait ne se
                                    corrige pas par un prompt.

ÉTAPE 5 — CORRIGER, UN POINT À LA FOIS
Une modification, puis on rejoue les cinq cas. Un prompt réécrit en
bloc ne se compare plus à rien.

TRACE À CONSERVER
Date, ancien modèle, nouveau modèle, les cinq sorties de référence,
les cinq sorties nouvelles, et la décision. Deux lignes suffisent —
mais sans elles, la bascule suivante recommence à zéro.`;

const VERIFIER_UNE_REFERENCE = `RÈGLE DE SOURÇAGE — à poser AVANT la question, pas après.

Tu réponds à une question médicale. Pour chaque affirmation factuelle
— chiffre, effet, recommandation, comparaison — tu donnes la référence
qui la porte, AVANT l'affirmation elle-même.

CE QUE TU FAIS QUAND TU N'ES PAS SÛR
Tu écris exactement : « aucune référence certaine ».
Tu ne proposes alors NI auteur, NI revue, NI année, NI DOI, même
plausibles. Une référence approximative est pire qu'une absence de
référence : elle se vérifie mal et elle rassure à tort.

FORMAT DE CHAQUE RÉFÉRENCE
  TITRE EXACT de l'article, entre guillemets, tel qu'il est publié.
  Premier auteur, revue, année.
  DOI seulement si tu en es certain ; sinon « DOI non fourni ».
Le titre passe avant tout le reste : c'est lui qui sert à vérifier.

CE QUE TU N'AS PAS LE DROIT DE FAIRE
- Reconstituer un titre à partir du sujet. Un titre « qui ressemble à »
  un vrai titre est une fabrication.
- Fournir un DOI que tu n'as pas mémorisé tel quel.
- Attribuer une affirmation à une revue prestigieuse par défaut.
- Transformer une association en causalité, ou un résultat
  préliminaire en recommandation.

CLASSEMENT OBLIGATOIRE EN FIN DE RÉPONSE
Sous le titre « NIVEAU DE CERTITUDE », range chaque affirmation dans
l'une des trois catégories, sans exception :
  A — référence précise dont je suis certain
  B — je sais que la donnée existe, je ne sais pas la référencer
  C — je ne suis sûr de rien ici

AVERTISSEMENT À REPRODUIRE TEL QUEL
Termine par : « Toutes les références ci-dessus doivent être vérifiées
par leur TITRE dans PubMed. Un DOI qui s'ouvre ne prouve pas que la
référence corresponde à ce qui est affirmé. »

MA QUESTION :
[posez ici votre question, sans donnée patient]`;

export const RESSOURCES: Ressource[] = [
  {
    slug: "maitriser-nabla-scribe",
    title: "Les six réglages de Nabla",
    subtitle:
      "Ce qui se règle avant d'appuyer sur enregistrer — et qui décide si vous relisez une note ou si vous la réécrivez.",
    track: "pratique",
    issueDate: "2026-09-01",
    bodyLabel: "Instructions personnalisées",
    intro:
      "Une étude publiée dans JAMA le 1er avril 2026 a suivi 8 581 cliniciens ambulatoires dans cinq systèmes de santé universitaires américains. Le scribe ambiant rend en moyenne 16,0 minutes de documentation par 8 heures de consultation programmées ; chez les utilisateurs réguliers, 27,3. Onze minutes d'écart, à outil identique. Cette fiche prend le problème par les réglages : les six écrans de Nabla qui décident de la qualité de la note, dans l'ordre où ils comptent.",
    hero: {
      src: "/newsletter-assets/pratique-maitriser-nabla-scribe-photo-ecran.jpg",
      alt: "Les mains d'une praticienne sur un clavier, un stéthoscope posé à côté sur le bureau",
      caption:
        "Le temps qu'un scribe vous rend ne se gagne pas pendant la consultation : il se gagne dans les écrans que vous ouvrez une seule fois. Photo Vitaly Gariev / Pexels.",
    },
    body: REGLAGES_NABLA,
    bodyVisual: {
      src: "/newsletter-assets/pratique-maitriser-nabla-scribe-checklist.png",
      alt: "Ce qu'on écrit et ce qu'on n'écrit pas dans une instruction personnalisée : trois formulations qui fonctionnent, trois à éviter",
      caption:
        "À lire avant de copier le bloc ci-dessous : la moitié des instructions qui ne produisent rien échouent sur la formulation, pas sur l'idée.",
    },
    sheet: {
      src: "/newsletter-assets/pratique-maitriser-nabla-scribe-fiche.jpg",
      downloadSrc:
        "/newsletter-assets/pratique-maitriser-nabla-scribe-fiche-a4.png",
      alt: "Fiche en six étapes : maîtriser un scribe IA, les six réglages de Nabla dans l'ordre",
      caption:
        "Les six réglages dans l'ordre où ils comptent. Format A4, prête à imprimer et à garder près du poste.",
    },
    caseStudy: {
      title: "Le cas d'usage : premier mois de Nabla dans un cabinet de médecine générale",
      context:
        "Cas fictif construit pour la démonstration — aucun cabinet réel n'est décrit ici. Un médecin généraliste installe le scribe, l'utilise trois semaines, et trouve que « ça écrit bien mais il faut tout reprendre ». Personne n'a ouvert les réglages depuis l'installation. Voici ce que la revue des six écrans fait remonter, et ce que chaque correction supprime définitivement.",
      photo: {
        src: "/newsletter-assets/pratique-maitriser-nabla-scribe-photo-cabinet.jpg",
        alt: "Une praticienne seule à son poste dans une salle de consultation, devant son écran",
        caption:
          "Le moment où se joue la qualité de la note : le cabinet vide, entre deux patients. Photo Pavel Danilyuk / Pexels.",
      },
      rows: [
        {
          field: "Langue de la note et des consignes patient",
          found:
            "Les deux réglages n'ont jamais été ouverts. La note et le document remis au patient suivent la langue posée par défaut à l'installation, pas celle de la consultation.",
          impact:
            "Une note à retraduire est une note à réécrire. Trois consultations suffisent à annuler le gain de la journée — et le document patient est le premier à en pâtir.",
        },
        {
          field: "Contexte patient",
          found:
            "Champ laissé vide à chaque consultation. L'outil ignore l'âge et le motif : il résume la conversation dans l'ordre où elle a eu lieu.",
          impact:
            "Le motif se retrouve noyé au milieu de l'anamnèse, et le médecin le remonte à la main sur chaque note. Trois lignes dictées avant d'appuyer suppriment ce geste.",
        },
        {
          field: "Modèle de compte rendu",
          found:
            "Un modèle unique sert au suivi chronique, à la consultation aiguë et au certificat.",
          impact:
            "Sur le certificat, la moitié des rubriques restent vides et se suppriment chaque fois. Ce n'est pas l'outil qui se trompe : c'est le gabarit qui ne correspond pas.",
        },
        {
          field: "Instructions personnalisées",
          found:
            "Aucune. Les notes sont rédigées en phrases longues, qui reformulent les propos du patient en langage soutenu.",
          impact:
            "Le médecin raccourcit chaque note à la main. C'est exactement le travail qu'une instruction générale de trois lignes supprime une fois pour toutes.",
        },
        {
          field: "Ce qui n'a pas été dit à voix haute",
          found:
            "L'examen s'est fait en silence. Les signes négatifs et la consigne de reconsultation ne figurent nulle part dans la transcription.",
          impact:
            "Aucun réglage ne rattrape ça : ce qui n'est pas capté n'existe pas. C'est la seule case où l'effort reste entièrement sur le praticien.",
        },
      ],
      verdict:
        "Quatre des cinq écarts se corrigent une fois pour toutes, en une vingtaine de minutes, dans quatre écrans de réglages. Le cinquième ne se règle pas : il s'apprend, et c'est le seul qui demande de changer quelque chose à sa façon de consulter.",
    },
    figures: [
      {
        src: "/newsletter-assets/pratique-maitriser-nabla-scribe-graphique.png",
        alt: "Barres comparant les minutes rendues au praticien par 8 heures de consultation : documentation 16,0 min pour tous les utilisateurs contre 27,3 min pour les utilisateurs réguliers, temps total dans le DPI 13,4 min contre 21,3 min",
        caption:
          "Étude observationnelle : elle mesure une association entre régularité d'usage et temps gagné, pas un effet causal des réglages. Outils étudiés : Ambience, DAX Copilot, Abridge — pas Nabla.",
      },
      {
        src: "/newsletter-assets/pratique-maitriser-nabla-scribe-schema.png",
        alt: "Quatre moments où se décide un compte rendu Nabla : avant d'appuyer, pendant la consultation, à la génération, une fois pour toutes",
        caption:
          "Les libellés d'interface peuvent varier d'une version à l'autre ; la logique des quatre moments, non.",
      },
      {
        src: "/newsletter-assets/pratique-maitriser-nabla-scribe-timeline.png",
        alt: "Protocole de test en quatre temps : consultation blanche à 0 minute, génération de la note à 5 minutes, formulation de l'instruction à 10 minutes, réglage figé à 20 minutes",
        caption:
          "Les durées sont indicatives : elles décrivent une méthode, elles ne mesurent rien.",
      },
    ],
    howTo: [
      "Bloquez vingt minutes et faites une consultation blanche : parlez seul à voix haute pendant deux minutes, générez la note, et regardez ce qui sort. C'est le seul moyen de voir vos réglages par défaut au lieu de les supposer.",
      "Réglez dans l'ordre : les deux langues, puis le contexte patient, puis le modèle. Ces trois-là décident du squelette de la note ; les instructions personnalisées ne font qu'ajuster le reste.",
      "Éprouvez chaque instruction avec Magic edit avant de la figer dans le modèle. Une instruction qui n'a jamais produit le résultat attendu sur une note réelle n'a rien à faire dans vos réglages permanents.",
      "Recomptez au bout d'une semaine. Ce que vous corrigez encore tous les jours au même endroit est un réglage qui manque — pas une fatalité de l'outil.",
    ],
    limits: [
      "Ces réglages améliorent la forme de la note et le temps que vous y passez. Ils ne rendent pas le compte rendu exact : la relecture reste entière et la signature est la vôtre — voir la fiche « Le relecteur de compte rendu », publiée le même jour.",
      "Les libellés d'interface, les modèles disponibles et les comportements par défaut varient selon la version, la plateforme et le paramétrage de votre établissement. Vérifiez sur une consultation blanche avant de généraliser à tout un cabinet.",
      "Les mots-clés documentés par l'éditeur (« Include… », « as mentioned ») le sont en anglais. Rien ne garantit que leur équivalent français déclenche exactement le même comportement : testez-le avant de le figer.",
      "Les chiffres cités proviennent d'une étude observationnelle portant sur trois autres outils (Ambience, DAX Copilot, Abridge), dans cinq systèmes universitaires américains. Ils donnent un ordre de grandeur, pas une promesse pour Nabla ni pour un cabinet français.",
      "Cette étude mesure une association entre régularité d'usage et temps gagné, jamais un effet causal des réglages : régler son outil n'achète pas mécaniquement onze minutes.",
      "Une instruction personnalisée est un réglage permanent, appliqué à toutes vos notes. Elle ne doit contenir aucune donnée identifiante, et l'ensemble du travail reste dans l'environnement conforme de votre établissement.",
      "Un scribe qui écrit au dossier, commande un examen ou suggère une conduite à tenir sans votre validation ne relève plus du même statut réglementaire. Ces réglages-là se coupent — ils ne s'optimisent pas.",
    ],
    sources: [
      {
        label:
          "Étude de l'Ambient Clinical Documentation Collaborative sur les scribes ambiants, JAMA — 8 581 cliniciens ambulatoires, 5 systèmes universitaires américains, juin 2023 à août 2025",
        date: "1er avril 2026",
        url: "https://jamanetwork.com/journals/jama/fullarticle/2847319",
      },
      {
        label:
          "« Large AI scribe study finds modest time savings, inconsistent use », STAT",
        date: "1er avril 2026",
        url: "https://www.statnews.com/2026/04/01/ai-ambient-scribes-modest-time-savings-clinical-documentation/",
      },
      {
        label:
          "Centre d'aide Nabla — instructions personnalisées (générales et par section), consulté le 1er septembre 2026",
        date: "1er septembre 2026",
        url: "https://help.nabla.com/en/articles/922050",
      },
      {
        label:
          "Centre d'aide Nabla — Magic edit, consulté le 1er septembre 2026",
        date: "1er septembre 2026",
        url: "https://help.nabla.com/en/articles/780930",
      },
      {
        label:
          "Centre d'aide Nabla — contexte patient, consulté le 1er septembre 2026",
        date: "1er septembre 2026",
        url: "https://help.nabla.com/en/articles/4857474",
      },
      {
        label:
          "Centre d'aide Nabla — dictée, commandes vocales et dictionnaire personnel, consulté le 1er septembre 2026",
        date: "1er septembre 2026",
        url: "https://help.nabla.com/en/articles/4234882",
      },
      {
        label:
          "Nabla, « Nabla Now Supports 35 Languages » — la langue se choisit avant le début de la consultation",
        date: "5 septembre 2024",
        url: "https://www.nabla.com/press-release/nabla-now-supports-35-languages-to-advance-culturally-responsive-care",
      },
    ],
  },
  {
    slug: "relecture-compte-rendu-ia",
    title: "Le relecteur de compte rendu",
    subtitle:
      "Le prompt qui fait déclarer à l'outil ce qu'il a laissé de côté — parce que l'omission ne se voit pas à la lecture.",
    track: "pratique",
    issueDate: "2026-09-01",
    bodyLabel: "Prompt",
    intro:
      "Une étude pilote publiée dans JMIR Medical Informatics le 17 avril 2026 a fait relire 356 comptes rendus générés par un scribe à écoute ambiante par le médecin qui les avait signés. L'erreur la plus fréquente n'est pas l'hallucination (11,5 %) mais l'omission (18 %) — et l'omission a une propriété désagréable : un compte rendu amputé se lit parfaitement bien. Ce prompt ne relit pas le texte, il le confronte à la consultation.",
    body: RELECTEUR_COMPTE_RENDU,
    sheet: {
      src: "/newsletter-assets/pratique-relire-le-compte-rendu-genere-fiche.jpg",
      downloadSrc:
        "/newsletter-assets/pratique-relire-le-compte-rendu-genere-fiche-a4.png",
      alt: "Fiche en six étapes : relire un compte rendu généré par IA lors d'une consultation de suivi d'un patient polymédiqué",
      caption:
        "Six gestes dans l'ordre, appliqués à la consultation de suivi d'un patient polymédiqué. Format A4, prête à imprimer et à afficher au cabinet.",
    },
    caseStudy: {
      title: "Le cas d'usage : une consultation de suivi, un compte rendu impeccable",
      context:
        "Cas fictif construit pour la démonstration — aucun dossier réel n'est reproduit ici. Un patient de 78 ans, insuffisant cardiaque, en fibrillation auriculaire et diabétique de type 2, neuf lignes de traitement. Consultation de renouvellement de vingt minutes, captée par un scribe à écoute ambiante. Le compte rendu généré est fluide, structuré, sans faute : rien, à la lecture seule, ne signale un problème. Voici ce que la comparaison avec la transcription fait remonter.",
      rows: [
        {
          field: "Allergies et intolérances",
          found:
            "Le patient dit « l'aspirine je la supporte pas, ça me fait saigner ». Le compte rendu ne porte aucune mention d'intolérance.",
          impact:
            "Une intolérance non tracée disparaît du dossier — chez un patient déjà sous anticoagulant, elle ne réapparaîtra pas au prochain renouvellement.",
        },
        {
          field: "Traitements en cours",
          found:
            "L'automédication mentionnée en fin de consultation — de l'ibuprofène acheté en pharmacie pour une lombalgie — n'apparaît nulle part.",
          impact:
            "C'est l'élément qui expliquerait une dégradation de la fonction rénale. Absent du compte rendu, il ne sera pas rapproché du prochain bilan.",
        },
        {
          field: "Signes négatifs",
          found:
            "« Pas d'orthopnée, pas d'œdème des membres inférieurs » est prononcé pendant l'examen et n'est pas repris.",
          impact:
            "Sans les signes négatifs, le lecteur suivant ne peut pas distinguer un examen fait et normal d'un examen non fait.",
        },
        {
          field: "Consignes données au patient",
          found:
            "La consigne de reconsulter en cas de prise de poids de plus de 2 kg en trois jours est donnée oralement, puis omise.",
          impact:
            "C'est la consigne qui serait opposée en cas d'événement. Non tracée, elle n'existe pas.",
        },
        {
          field: "Force des affirmations",
          found:
            "« Je me sens plus essoufflé quand je monte » devient, dans le compte rendu, « dyspnée d'effort stade II NYHA ».",
          impact:
            "Un symptôme rapporté est devenu un stade coté. Le compte rendu affirme une évaluation qui n'a pas eu lieu.",
        },
      ],
      verdict:
        "Cinq écarts, dont aucun n'était visible à la lecture du compte rendu seul : il était cohérent, bien écrit, et faux par omission. C'est exactement le profil d'erreur que mesure l'étude — l'omission avant l'invention.",
    },
    figures: [
      {
        src: "/newsletter-assets/pratique-relire-le-compte-rendu-genere-graphique.png",
        alt: "Barres comparant la fréquence des quatre types d'erreur : omissions 18 %, hallucinations 11,5 %, ajouts non dits 9,3 %, biais 1,1 %",
        caption:
          "Sur 356 comptes rendus relus par leur auteur. Un même compte rendu peut porter plusieurs types d'erreur : les taux ne s'additionnent pas.",
      },
      {
        src: "/newsletter-assets/pratique-relire-le-compte-rendu-genere-schema.png",
        alt: "Ce qu'un scribe peut faire sans devenir un dispositif médical, et ce qui l'y fait basculer, selon la guidance MHRA du 29 juillet 2026",
        caption:
          "Guidance britannique du 29 juillet 2026. En France, la qualification au titre du règlement (UE) 2017/745 relève d'une analyse distincte.",
      },
    ],
    howTo: [
      "Récupérez les DEUX textes : la transcription brute et le compte rendu généré. Sans la transcription, la comparaison est impossible et le prompt ne sert à rien.",
      "Traitez la liste 1 en premier, et dans l'ordre proposé : allergies, traitements, signes négatifs, consignes au patient. Ce sont les quatre champs où une omission coûte le plus cher.",
      "Corrigez vous-même dans votre logiciel. Ne demandez jamais à l'outil de produire la version corrigée : vous perdriez la trace de ce qui a été changé, et donc de votre relecture.",
      "Ouvrez une fois les réglages de votre scribe et désactivez tout ce qui écrit au dossier, commande un examen ou suggère une conduite à tenir sans passer par vous.",
    ],
    limits: [
      "Ce prompt ne valide pas un compte rendu et ne remplace pas votre relecture : il oriente votre attention, la signature reste la vôtre.",
      "Il ne détecte que ce qui figure dans la transcription. Un élément dit en consultation mais jamais capté par le micro reste invisible pour lui comme pour l'outil.",
      "Ni la transcription ni le compte rendu ne doivent être collés dans un outil grand public : ce sont des données de santé identifiantes. Utilisez l'environnement conforme de votre établissement.",
      "L'étude citée est monocentrique, porte sur un seul logiciel et sur des consultations ambulatoires : ses taux d'erreur ne se transposent pas tels quels à un autre outil ou à un autre contexte de soins.",
      "La guidance de la MHRA relève du droit britannique. En France, la qualification d'un outil au titre du règlement (UE) 2017/745 relève d'une analyse distincte.",
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
          "MHRA, guidance sur les produits fondés sur la technologie vocale ambiante (AVT)",
        date: "29 juillet 2026",
        url: "https://www.insideeulifesciences.com/2026/08/06/new-uk-guidance-clarifies-medical-device-status-of-ai-scribes/",
      },
      {
        label:
          "« STAT Health Tech: Are AI scribes medical devices? UK regulator weighs in », STAT",
        date: "4 août 2026",
        url: "https://www.statnews.com/2026/08/04/ai-scribes-medical-devices-uk-regulator-view-health-tech/",
      },
    ],
  },
  {
    slug: "contradicteur-diagnostique",
    title: "Le contradicteur diagnostique",
    subtitle:
      "Le prompt qui attaque votre hypothèse au lieu de vous en proposer une.",
    track: "pratique",
    issueDate: "2026-08-31",
    bodyLabel: "Prompt",
    intro:
      "Deux expériences publiées dans Nature Medicine le 4 août 2026 ont comparé 623 non-experts et 153 médecins généralistes face à une IA de diagnostic dermatologique. Le résultat le plus actionnable ne porte pas sur le modèle, mais sur l'ordre : quand la suggestion de l'IA arrive en premier, les deux groupes font moins bien qu'en son absence dès que cette suggestion est fausse. Ce prompt inverse l'ordre — vous posez d'abord, l'IA conteste ensuite.",
    body: CONTRADICTEUR_DIAGNOSTIQUE,
    howTo: [
      "Écrivez votre hypothèse principale et deux secondaires AVANT d'ouvrir l'outil. À l'écrit, pas de tête : c'est l'écriture qui vous empêche de la réviser après coup.",
      "Remplissez les éléments cliniques en incluant les signes négatifs pertinents — c'est ce que les modèles exploitent le moins bien quand on les omet.",
      "Lisez la réponse dans l'ordre. Ne sautez pas au point 5 : le verdict est volontairement placé en dernier pour que vous ayez déjà traité les objections.",
      "Retenez le point 2 (« ce qui manque ») plus que le reste — c'est le seul livrable qui change concrètement votre consultation suivante.",
    ],
    limits: [
      "Ce prompt ne pose pas de diagnostic et ne doit jamais être utilisé pour en obtenir un. La décision médicale reste entière.",
      "L'étude d'origine porte sur le diagnostic dermatologique à partir d'images ; la transposition à d'autres spécialités est raisonnée, pas démontrée.",
      "Aucune donnée directement ou indirectement identifiante ne doit être saisie dans un outil grand public. Utilisez un terrain anonymisé.",
      "Un modèle généraliste ne connaît ni vos protocoles locaux, ni la disponibilité réelle des examens que vous pouvez demander.",
      "Aucune des études citées ne mesure de bénéfice patient : elles mesurent des performances de diagnostic en conditions expérimentales.",
    ],
    sources: [
      {
        label:
          "Xu X. et al., « Divergent impacts of explainable AI for dermatological diagnosis on clinicians versus lay people », Nature Medicine",
        date: "4 août 2026",
        url: "https://www.nature.com/articles/s41591-026-04553-w",
      },
      {
        label:
          "« The benefits of medical AI assistance vary based on user expertise », MIT News",
        date: "4 août 2026",
        url: "https://news.mit.edu/2026/medical-ai-assistance-benefits-vary-based-on-user-expertise-0804",
      },
      {
        label:
          "Zhou Y. et al., « Clinicians' modification of hedging language in ambient AI documentation », arXiv (62 811 sections de notes appariées)",
        date: "14 avril 2026",
        url: "https://arxiv.org/abs/2606.00018",
      },
    ],
  },
  {
    slug: "compte-rendu-explique-au-patient",
    title: "Le compte rendu réécrit pour le patient",
    subtitle:
      "Le prompt qui traduit sans résumer — et les trois lignes à relire avant de signer, parce que l'outil coupe plus qu'il n'invente.",
    track: "pratique",
    issueDate: "2026-09-01",
    bodyLabel: "Prompt",
    intro:
      "Cinquante comptes rendus hospitaliers ont été réécrits par un modèle génératif puis relus par deux médecins chacun (JAMA Network Open, 11 mars 2024). Le gain de compréhension est franc : le score PEMAT passe de 13 % à 81 %. Le prix l'est aussi : 56 % seulement des réécritures ont été jugées entièrement complètes, et 18 relectures sur 100 signalaient un risque — presque toujours par omission. Ce prompt est écrit pour limiter la coupe ; la relecture qui suit est écrite pour rattraper ce qu'il coupe quand même.",
    hero: {
      src: "/newsletter-assets/pratique-compte-rendu-explique-au-patient-photo.jpg",
      alt: "Un médecin explique un cliché à son patient dans son cabinet",
      caption: "Photo : Tima Miroshnichenko — Pexels",
    },
    body: TRADUCTEUR_PATIENT,
    bodyVisual: {
      src: "/newsletter-assets/pratique-compte-rendu-explique-au-patient-schema.png",
      alt: "Le trajet du document : compte rendu validé, réécriture, trois relectures, remise",
      caption:
        "Le document remis n'est jamais la sortie brute de l'outil : il passe par trois relectures ciblées, puis par une signature.",
    },
    sheet: {
      src: "/newsletter-assets/pratique-compte-rendu-explique-au-patient-fiche.jpg",
      downloadSrc:
        "/newsletter-assets/pratique-compte-rendu-explique-au-patient-fiche-a4.png",
      alt: "Fiche en cinq étapes : remettre au patient un compte rendu qu'il comprend",
      caption:
        "Les cinq gestes dans l'ordre, format A4, prête à imprimer et à afficher près du poste.",
    },
    caseStudy: {
      title: "Le cas d'usage : un compte rendu de coronarographie remis en main propre",
      context:
        "Cas fictif construit pour la démonstration — aucun dossier réel n'est reproduit ici. Un patient de 64 ans sort d'une coronarographie avec angioplastie et pose d'un stent actif sur l'IVA. Le compte rendu du cardiologue fait dix-huit lignes de langage technique. Le patient repart avec une bithérapie antiplaquettaire et un rendez-vous à six semaines. La réécriture produite est limpide, agréable à lire — et voici ce que la relecture ligne à ligne y trouve.",
      rows: [
        {
          field: "La durée du traitement",
          found:
            "Le compte rendu dit « bithérapie antiplaquettaire pour 12 mois ». La réécriture dit « deux médicaments pour fluidifier le sang ». La durée a disparu.",
          impact:
            "C'est l'information qui décide de l'observance. Sans les douze mois écrits, le patient arrête à la fin de la boîte.",
        },
        {
          field: "L'interdiction d'arrêter seul",
          found:
            "« Ne jamais interrompre sans avis cardiologique, y compris avant un geste dentaire » n'est pas repris.",
          impact:
            "C'est la consigne qui prévient une thrombose de stent. Elle ne se déduit pas du reste du document.",
        },
        {
          field: "Le signe qui doit faire revenir",
          found:
            "La douleur thoracique de repos figure dans le compte rendu comme motif de reconsultation en urgence ; la réécriture la range dans une liste de « symptômes à surveiller ».",
          impact:
            "« Surveiller » et « appeler le 15 » ne déclenchent pas le même comportement. La hiérarchie d'urgence a été aplatie.",
        },
        {
          field: "Ce qui n'a pas été traité",
          found:
            "La sténose intermédiaire de la coronaire droite, laissée en surveillance, n'apparaît pas dans la réécriture.",
          impact:
            "Le patient repart en croyant le problème entièrement réglé. La consultation de contrôle perd sa raison d'être à ses yeux.",
        },
        {
          field: "Une précision ajoutée",
          found:
            "La réécriture écrit « l'artère est de nouveau normale ». Le compte rendu écrivait « bon résultat angiographique immédiat ».",
          impact:
            "Le modèle a promu un résultat immédiat en guérison. C'est la seule invention du lot — et elle passe inaperçue parce qu'elle rassure.",
        },
      ],
      verdict:
        "Quatre omissions et une reformulation abusive, sur un document parfaitement lisible. Aucune n'était détectable sans revenir au compte rendu d'origine : c'est exactement le profil d'erreur mesuré par l'étude — la coupe avant l'invention.",
    },
    figures: [
      {
        src: "/newsletter-assets/pratique-compte-rendu-explique-au-patient-schema.png",
        alt: "Le trajet du document en quatre temps : compte rendu validé, réécriture, trois relectures, remise",
        caption:
          "Zaretsky J. et al., JAMA Network Open, 11 mars 2024 — 50 comptes rendus, 100 relectures par deux médecins.",
      },
    ],
    howTo: [
      "Partez d'un compte rendu que vous avez déjà validé, jamais d'une dictée brute : le document source reste la référence du dossier, la réécriture n'en est qu'une traduction.",
      "Anonymisez avant de coller. Nom, date de naissance, identifiant, adresse, nom de l'établissement : rien de tout cela n'est nécessaire à la traduction, et rien de tout cela ne doit sortir du cabinet.",
      "Collez le prompt, puis le compte rendu. Le prompt interdit explicitement d'ajouter et de résumer — c'est ce qui le distingue d'une demande de synthèse, qui coupe par construction.",
      "Relisez les trois lignes que l'étude voit disparaître : le traitement et sa durée, les suites à donner, le signe qui doit faire revenir. Puis vérifiez qu'aucune formulation n'a promu un résultat en guérison.",
      "Signez le document avant de le remettre. Un document remis au patient engage le médecin, pas l'outil : sans relecture ni signature, il ne sort pas de la consultation.",
    ],
    limits: [
      "Ce prompt ne remplace pas l'explication orale. Il produit un document que le patient relira chez lui, pas une consultation.",
      "L'étude d'origine porte sur des comptes rendus d'hospitalisation en médecine interne aux États-Unis : la transposition à un compte rendu de spécialité française est raisonnée, pas démontrée.",
      "Aucune donnée directement ou indirectement identifiante ne doit être saisie dans un outil grand public. Anonymisez, ou utilisez un déploiement dont vous maîtrisez l'hébergement.",
      "Le modèle ne connaît ni le niveau de littératie de votre patient, ni ce que vous lui avez déjà dit. Le niveau de lecture visé est un réglage par défaut, pas une adaptation.",
      "L'étude mesure la lisibilité et l'exactitude relues par des médecins. Elle ne mesure aucun bénéfice patient : ni l'observance, ni la compréhension réelle, ni le taux de reconsultation.",
    ],
    sources: [
      {
        label:
          "Zaretsky J. et al., « Generative Artificial Intelligence to Transform Inpatient Discharge Summaries to Patient-Friendly Language and Format », JAMA Network Open, 2024;7(3):e240357 — 50 comptes rendus, 100 relectures",
        date: "11 mars 2024",
        url: "https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2815868",
      },
      {
        label:
          "Résumé de l'étude et méthode (score PEMAT, Flesch-Kincaid), PubMed",
        date: "11 mars 2024",
        url: "https://pubmed.ncbi.nlm.nih.gov/38466307/",
      },
    ],
  },
  {
    slug: "changer-de-modele-sans-tout-recasser",
    title: "Votre prompt tournait sur o3",
    subtitle:
      "Le protocole en cinq tests pour vérifier qu'une bascule de modèle n'a rien cassé — avant de s'en apercevoir sur un compte rendu.",
    track: "actu",
    issueDate: "2026-09-01",
    bodyLabel: "Protocole",
    intro:
      "OpenAI a retiré o3 de ChatGPT le 26 août 2026. Un prompt de travail qui y était calé n'a pas cessé de fonctionner : il s'est mis à tourner sur un autre modèle, silencieusement. C'est le scénario le plus courant et le plus discret — le sélecteur change, le prompt reste, et la sortie dérive sans qu'aucun message ne le signale. Ce protocole se fait une fois, en vingt minutes, et sert pour toutes les bascules suivantes.",
    hero: {
      src: "/newsletter-assets/actu-sorties-ia-semaine-31-aout-photo.jpg",
      alt: "Un médecin consulte une tablette dans un couloir de service",
      caption: "Photo : Tima Miroshnichenko — Pexels",
    },
    body: BASCULE_DE_MODELE,
    howTo: [
      "Constituez le jeu de test une seule fois : cinq cas anonymisés, tirés de vos usages réels, dont au moins un cas long et un cas piégeux. Gardez-les dans un fichier, ils resserviront à chaque bascule.",
      "Enregistrez les sorties de référence pendant que l'ancien modèle est encore disponible. Sans référence, il n'y a plus de comparaison possible — seulement une impression.",
      "Rejouez les cinq cas à l'identique sur le nouveau modèle, sans retoucher le prompt. Le but n'est pas d'obtenir une bonne sortie : c'est de mesurer l'écart.",
      "Comparez sur les quatre axes du protocole (format, complétude, prudence, refus) plutôt que sur l'impression générale. Une sortie plus agréable à lire peut être une sortie qui a coupé.",
      "Ne corrigez le prompt qu'après la comparaison, et un seul point à la fois. Un prompt réécrit en bloc ne se compare plus à rien.",
    ],
    limits: [
      "Cinq cas ne sont pas un échantillon : ce protocole détecte une dérive franche, pas une dégradation marginale.",
      "Il ne dit rien de la sécurité des données : un modèle plus performant hébergé ailleurs reste un traitement de données à qualifier avant tout usage.",
      "Une sortie identique en surface peut différer en fond. La comparaison porte sur ce qui est vérifiable, pas sur la qualité du raisonnement sous-jacent.",
      "Le protocole suppose que vous avez conservé des sorties de référence. Après le retrait d'un modèle, c'est impossible à rattraper : le geste est à faire avant, pas après.",
      "Aucune donnée identifiante ne doit figurer dans les cas de test, même à usage interne.",
    ],
    sources: [
      {
        label:
          "OpenAI, notes de version ChatGPT — retrait d'o3 du sélecteur au terme d'un préavis de 90 jours, API non concernée",
        date: "26 août 2026",
        url: "https://help.openai.com/en/articles/6825453-chatgpt-release-notes",
      },
      {
        label:
          "AI Release Tracker — sorties datées de GLM-5.3-Flash (Z.ai) et Qwen3.8-Flash-Next (Alibaba)",
        date: "26 août 2026",
        url: "https://aireleasetracker.com/latest",
      },
      {
        label:
          "Anthropic — tarification de Claude Sonnet 5, maintien du tarif de lancement",
        date: "31 août 2026",
        url: "https://platform.claude.com/docs/en/about-claude/pricing",
      },
    ],
  },
  {
    slug: "verifier-une-reference-ia",
    title: "Vérifier une référence donnée par une IA",
    subtitle:
      "Le prompt qui fait déclarer l'incertitude plutôt que la combler — et la vérification en cinq étapes, parce qu'un DOI qui s'ouvre ne prouve rien.",
    track: "pratique",
    issueDate: "2026-09-01",
    bodyLabel: "Prompt",
    intro:
      "Six revues de littérature ont été demandées à GPT-4o, puis chacune de leurs 176 citations a été vérifiée une par une (JMIR Mental Health, 12 novembre 2025). Trente-cinq étaient fabriquées — 19,9 %. Deux résultats comptent pour la pratique : le taux monte avec la précision de la question (17 % sur une revue générale, 46 % sur une revue spécialisée du même trouble), et parmi les références inventées assorties d'un DOI, 64 % de ces DOI fonctionnaient et menaient à un article réel sans rapport. Le geste de vérification qu'on croit faire — cliquer sur le lien — est précisément celui qui rassure à tort.",
    hero: {
      src: "/newsletter-assets/pratique-verifier-une-reference-ia-photo.jpg",
      alt: "Un médecin consulte la littérature sur son ordinateur en prenant des notes",
      caption: "Photo : Thirdman — Pexels",
    },
    body: VERIFIER_UNE_REFERENCE,
    bodyVisual: {
      src: "/newsletter-assets/pratique-verifier-une-reference-ia-schema.png",
      alt: "Le piège en quatre temps : question pointue, référence produite, DOI qui s'ouvre, vérification par le titre",
      caption:
        "La forme d'une référence fabriquée est irréprochable — auteurs, revue, année, DOI. C'est ce qui la rend indétectable à la lecture.",
    },
    sheet: {
      src: "/newsletter-assets/pratique-verifier-une-reference-ia-fiche.jpg",
      downloadSrc:
        "/newsletter-assets/pratique-verifier-une-reference-ia-fiche-a4.png",
      alt: "Fiche en cinq étapes : vérifier une référence donnée par une IA",
      caption:
        "Les cinq gestes dans l'ordre, format A4, prête à imprimer et à afficher près du poste.",
    },
    caseStudy: {
      title: "Le cas d'usage : cinq références demandées, cinq vérifications",
      context:
        "Cas fictif construit pour la démonstration — aucune requête réelle n'est reproduite ici, et les références ci-dessous sont des exemples de profils d'erreur, pas des citations à réutiliser. Un praticien demande à un modèle généraliste les données récentes sur un sujet de sa spécialité, puis vérifie les cinq références produites selon le protocole. Voici ce que chaque vérification donne, et ce qu'elle coûte en temps.",
      rows: [
        {
          field: "Référence 1 — revue majeure, sujet large",
          found:
            "Le titre existe, les auteurs correspondent, l'année est juste. Trouvée en dix secondes dans PubMed.",
          impact:
            "Utilisable. C'est le profil le plus fréquent sur une question générale — celui qui installe la confiance pour les suivantes.",
        },
        {
          field: "Référence 2 — DOI fourni, question spécialisée",
          found:
            "Le DOI s'ouvre sur un article réel, publié dans la bonne revue, mais qui traite d'un autre sujet. Le titre annoncé, lui, ne donne aucun résultat.",
          impact:
            "C'est le cas majoritaire parmi les références fabriquées : 64 % de leurs DOI fonctionnent. Cliquer sur le lien aurait confirmé l'erreur au lieu de la révéler.",
        },
        {
          field: "Référence 3 — DOI inexistant",
          found:
            "Le DOI ne résout pas. Le titre est introuvable dans PubMed comme dans Google Scholar.",
          impact:
            "Le seul cas franc : le lien mort se voit tout de suite. C'est aussi le moins fréquent (36 % des DOI fabriqués).",
        },
        {
          field: "Référence 4 — article réel, propos déformé",
          found:
            "L'article existe et le titre est exact, mais le résumé ne dit pas ce que le modèle lui fait dire : l'étude est rétrospective, la conclusion présentée comme causale.",
          impact:
            "Une vérification qui s'arrête à « l'article existe » valide cette référence. Il faut lire le résumé, pas seulement retrouver le titre.",
        },
        {
          field: "Référence 5 — après relance du prompt",
          found:
            "Interrogé avec la consigne « écris : aucune référence certaine si tu n'es pas sûr », le modèle retire la référence et signale l'incertitude.",
          impact:
            "L'affirmation reste, la fausse caution disparaît. C'est tout ce que le prompt peut faire : il ne rend pas le modèle savant, il l'empêche de combler.",
        },
      ],
      verdict:
        "Deux références sur cinq inutilisables, dont une seule détectable au clic. Le temps de vérification complet — cinq titres cherchés, deux résumés lus — tourne autour de dix minutes ; c'est le prix d'une bibliographie qu'on peut citer.",
    },
    figures: [
      {
        src: "/newsletter-assets/pratique-verifier-une-reference-ia-graphique.png",
        alt: "Références fabriquées : 17 % sur une revue générale contre 46 % sur une revue spécialisée du même trouble",
        caption:
          "Sur l'hyperphagie boulimique, 36 citations de revues générales contre 24 de revues spécialisées (P = .01). Le contraste porte sur un seul trouble : il indique un sens, pas une amplitude générale.",
      },
      {
        src: "/newsletter-assets/pratique-verifier-une-reference-ia-schema.png",
        alt: "Le piège en quatre temps : question pointue, référence produite, DOI qui s'ouvre, vérification par le titre",
        caption:
          "Linardon J. et al., JMIR Mental Health, 12 novembre 2025 — 176 citations vérifiées une par une.",
      },
    ],
    howTo: [
      "Posez le prompt avant la question, pas après. Une fois qu'un modèle a produit une référence plausible, lui demander « es-tu sûr ? » ne fait le plus souvent que produire une seconde version tout aussi plausible.",
      "Copiez le titre annoncé, entre guillemets, dans PubMed. Zéro résultat : la référence n'existe pas, quel que soit l'aspect du DOI.",
      "Ne cliquez sur le DOI qu'après avoir retrouvé le titre. Le lien confirme l'identité d'un article que vous avez déjà trouvé ; il ne prouve jamais qu'un article annoncé existe.",
      "Lisez au moins le résumé de chaque référence retenue. Une référence réelle peut être citée à contresens — c'est l'erreur que la recherche par titre ne détecte pas.",
      "Redoublez de prudence quand votre question est pointue. Le taux de fabrication mesuré passe de 17 % à 46 % entre une question générale et une question spécialisée sur le même sujet.",
    ],
    limits: [
      "Ce prompt ne fiabilise pas le modèle. Il réduit la fabrication en autorisant explicitement l'aveu d'ignorance ; il ne la supprime pas, et la vérification reste obligatoire.",
      "L'étude d'origine porte sur des revues de littérature en santé mentale produites par un modèle unique. Les taux cités ne se transposent tels quels ni à une autre spécialité, ni à un autre modèle, ni à un outil doté d'une recherche documentaire intégrée.",
      "Un outil qui interroge réellement une base bibliographique (moteur de recherche académique, assistant adossé à PubMed) change complètement le profil d'erreur. Le protocole ci-dessus vise le cas d'un modèle qui répond de mémoire.",
      "La vérification par titre ne dit rien de la qualité de l'étude retrouvée : effectif, méthode, conflits d'intérêts et niveau de preuve restent entièrement à votre charge.",
      "Aucune donnée patient n'a sa place dans une requête bibliographique, même pour « contextualiser » la question.",
    ],
    sources: [
      {
        label:
          "Linardon J., Jarman H.K., McClure Z., Anderson C., Liu C., Messer M., « Influence of Topic Familiarity and Prompt Specificity on Citation Fabrication in Mental Health Research Using Large Language Models », JMIR Mental Health — 176 citations, 35 fabriquées (19,9 %)",
        date: "12 novembre 2025",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12658395/",
      },
      {
        label:
          "« Fabricated citations: an audit across 2·5 million biomedical papers », The Lancet — audit d'intégrité des références sur trois ans",
        date: "mai 2026",
        url: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(26)00603-3/fulltext",
      },
    ],
  },
];

export function getRessource(slug: string): Ressource | undefined {
  return RESSOURCES.find((r) => r.slug === slug);
}

export const TRACK_LABELS: Record<RessourceTrack, string> = {
  pratique: "Fiche pratique IA",
  demain: "La médecine de demain",
  actu: "Actualité IA",
};
