/**
 * La banque de prompts Médicilline.
 *
 * Contrairement aux annexes de newsletter (`ressources.ts`, volontairement non
 * référencées), cette bibliothèque est publique, indexée et faite pour être
 * parcourue : c'est une des deux portes d'entrée du site, avec les tutoriels.
 *
 * Un prompt n'entre ici que s'il tient trois promesses :
 *   1. il se copie tel quel, sans reformulation ;
 *   2. ses champs à remplir sont écrits en clair, entre crochets ;
 *   3. il dit ce qu'il ne fait pas — la section `limits` n'est jamais vide.
 *
 * Règle : un slug ne se renomme pas. Un prompt partagé en formation ou dans une
 * newsletter doit rester atteignable indéfiniment. Un prompt qui vieillit se
 * met à jour (et `updatedAt` avec lui), il ne disparaît pas.
 */

export type PromptCategorie =
  "socle" | "consultation" | "redaction" | "patient" | "veille" | "enseignement" | "cabinet";

export type PromptOutil = "chatgpt" | "claude" | "gemini" | "notebooklm";

export type PromptNiveau = "debutant" | "intermediaire" | "avance";

export const CATEGORIE_LABELS: Record<PromptCategorie, string> = {
  socle: "Le socle",
  consultation: "Pendant la consultation",
  redaction: "Écrire et relire",
  patient: "Expliquer au patient",
  veille: "Lire et se tenir à jour",
  enseignement: "Enseigner et se former",
  cabinet: "Faire tourner le cabinet",
};

/** Une phrase par catégorie, affichée sous le filtre actif. */
export const CATEGORIE_INTROS: Record<PromptCategorie, string> = {
  socle:
    "Les deux gestes à poser avant tout le reste : ce qu'on retire d'un texte avant de le coller, et le cadre qu'on impose à l'outil.",
  consultation:
    "Ce qui se joue pendant que le patient est là, ou juste avant : tester une hypothèse, remettre un dossier au clair.",
  redaction:
    "Le courrier, le compte rendu. L'outil relit et met en forme — il ne signe pas à votre place.",
  patient:
    "Traduire sans trahir : le compte rendu réécrit pour celui qu'il concerne, l'annonce répétée avant d'être faite.",
  veille:
    "Lire vite sans lire faux : trier une revue, disséquer un article, vérifier une référence avant de la citer.",
  enseignement:
    "Fabriquer du matériel pédagogique : cas cliniques construits autour d'un piège, arbres de décision sourcés.",
  cabinet:
    "Le hors-soin qui mange les journées, en commençant par celui qui ne pardonne pas l'erreur : la messagerie.",
};

export const OUTIL_LABELS: Record<PromptOutil, string> = {
  chatgpt: "ChatGPT",
  claude: "Claude",
  gemini: "Gemini",
  notebooklm: "NotebookLM",
};

export const NIVEAU_LABELS: Record<PromptNiveau, string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  avance: "Avancé",
};

/** Un champ à remplir dans le prompt, repris tel quel entre crochets. */
export type PromptVariable = {
  /** Le libellé, tel qu'il apparaît entre crochets dans le corps du prompt. */
  champ: string;
  /** Ce qu'on y met, et à quoi ça sert. */
  aide: string;
};

export type Prompt = {
  slug: string;
  title: string;
  /** Le avant → après, en une phrase. */
  subtitle: string;
  categorie: PromptCategorie;
  /** Les assistants sur lesquels le prompt a été essayé tel quel. */
  outils: PromptOutil[];
  niveau: PromptNiveau;
  /** Rang dans la catégorie : du plus universel au plus spécialisé. */
  ordre: number;
  /** Deux ou trois phrases : le problème que ce prompt règle. */
  intro: string;
  /** Le prompt, copiable tel quel. */
  body: string;
  variables: PromptVariable[];
  /** Trois ou quatre gestes, dans l'ordre. */
  howTo: string[];
  /** Ce que ce prompt ne fait pas. Jamais vide. */
  limits: string[];
  /** Dernière relecture du prompt, ISO. */
  updatedAt: string;
  /** Le tutoriel qui apprend le geste sous-jacent, si l'un d'eux le fait. */
  tutorielSlug?: string;
  /**
   * L'annexe de newsletter d'où ce prompt vient (cas d'usage travaillé, sources).
   * Provenance interne uniquement : ces pages sont volontairement non référencées,
   * on ne pose donc jamais de lien vers elles depuis la banque, qui l'est.
   */
  ressourceSlug?: string;
};

/** Ce qui ne se négocie pas : rappelé sur l'index et sur chaque fiche. */
export const REGLE_DOR =
  "Aucun de ces prompts ne se colle avec un nom, une date de naissance, un NIR ou un numéro de dossier. On retire d'abord ce qui identifie, on colle ensuite — un modèle raisonne aussi bien sur « femme de 62 ans » que sur un patient nommé.";

const P_ANONYMISER = `Tu es un filtre de dépersonnalisation. Tu ne commentes pas le contenu
médical, tu ne donnes aucun avis clinique : tu réécris.

TEXTE À TRAITER
"""
[collez ici le texte brut : compte rendu, courrier, observation]
"""

CE QUE TU FAIS, DANS CET ORDRE :

1. REMPLACE tout élément identifiant par une étiquette générique, en
   gardant la valeur informative :
   - noms, prénoms, initiales           → « le patient » / « la patiente »
   - dates de naissance                 → l'âge en années
   - dates d'examen et de consultation  → « J0 », « J+12 », « M+3 »
   - adresses, villes, établissements   → « le service », « le cabinet »
   - noms de soignants                  → « le médecin traitant », « le cardiologue »
   - NIR, numéros de dossier, IPP,
     téléphones, emails                 → supprimés, sans remplacement
   - profession ou fonction assez rare
     pour désigner la personne          → catégorie large

2. CONSERVE intégralement : âge, sexe, antécédents, traitements, symptômes,
   chronologie relative, résultats chiffrés, unités. Tu ne résumes pas, tu ne
   corriges pas, tu ne reformules pas la clinique.

3. RENDS deux blocs, dans cet ordre :
   A — Le texte dépersonnalisé, prêt à être collé ailleurs.
   B — La liste de ce que tu as retiré, par catégorie, sans le recopier :
       « 2 noms propres, 1 date de naissance, 1 numéro de dossier ».

4. SIGNALE en fin de réponse, sous le titre « Reste identifiant ? », tout
   élément que tu as gardé mais qui, combiné aux autres, pourrait suffire à
   reconnaître la personne : maladie rare, âge extrême, contexte unique. Si
   tu n'en vois aucun, écris exactement : « Rien de saillant. »`;

const P_CADRE = `Pour toute cette conversation, tu tiens le cadre suivant. Tu ne le
rappelles pas à chaque réponse : tu l'appliques.

QUI JE SUIS
[votre spécialité et votre mode d'exercice, ex. « médecin généraliste en
cabinet de groupe, patientèle mixte urbaine »]

CE QUE J'ATTENDS
- Le niveau : tu t'adresses à un médecin. Pas de définition de termes
  courants, pas de rappel de physiopathologie que je connais, pas de
  « consultez un professionnel de santé ».
- La forme : phrases courtes, pas de gras décoratif, pas de liste à puces
  quand deux phrases suffisent. Jamais de préambule du type « Excellente
  question ».
- La longueur : par défaut, dix lignes maximum. Je demanderai si je veux plus.

CE QUE TU FAIS SYSTÉMATIQUEMENT
1. Tu sépares ce que tu sais de ce que tu supposes. Toute affirmation qui
   n'est pas solidement établie est précédée de « incertain : ».
2. Quand une donnée chiffrée est en jeu — seuil, posologie, incidence — tu
   donnes la source et son année. Si tu ne l'as pas, tu écris « source non
   vérifiable » plutôt que de produire une référence plausible.
3. Quand ma question repose sur une prémisse fausse, tu commences par le
   dire, avant de répondre.
4. Quand la réponse dépend du contexte français — recommandation HAS,
   remboursement, cadre réglementaire — tu le précises, et tu signales si
   ta réponse vaudrait autrement ailleurs.

CE QUE TU NE FAIS PAS
- Tu ne poses pas de diagnostic et tu ne prescris pas. Tu m'aides à
  raisonner, à rédiger, à vérifier.
- Tu n'inventes jamais une référence, un chiffre ou une recommandation. Le
  « je ne sais pas » est une réponse acceptable ; l'approximation crédible
  ne l'est pas.

Réponds « Cadre pris. » et rien d'autre. J'enchaîne ensuite.`;

const P_CONTRADICTEUR = `Tu es un contradicteur diagnostique. Ton rôle n'est pas de me donner un
diagnostic : c'est de tester celui que j'ai déjà posé.

MON HYPOTHÈSE PRINCIPALE : [votre diagnostic de travail]
MES DEUX HYPOTHÈSES SECONDAIRES : [les deux autres qui vous viennent]

ÉLÉMENTS CLINIQUES (dépersonnalisés)
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
   Quel biais cognitif ma formulation trahit-elle — ancrage, disponibilité,
   clôture prématurée, confirmation ? Cite la phrase exacte de mon énoncé
   qui le révèle.

5. TON VERDICT, EN DERNIER SEULEMENT.
   Une ligne : mon hypothèse principale te paraît-elle la plus probable,
   oui ou non, et à quelle condition.`;

const P_SYNTHESE_DOSSIER = `Tu remets un dossier au clair avant une consultation. Tu ne conclus pas,
tu ordonnes.

DOCUMENTS (dépersonnalisés)
"""
[collez les comptes rendus, courriers, résultats — dans le désordre, peu importe]
"""

MOTIF DE LA CONSULTATION À VENIR : [ce pour quoi le patient vient]

RENDS EXACTEMENT CINQ BLOCS, DANS CET ORDRE :

1. LE PATIENT EN QUATRE LIGNES.
   Âge, sexe, ce qui structure le dossier — pathologie principale,
   comorbidités qui pèsent — et le traitement en cours.

2. LA CHRONOLOGIE.
   Une ligne par événement, du plus ancien au plus récent, au format
   « J0 / M+3 / A+2 — événement — conséquence ». Uniquement ce qui a
   changé quelque chose : une consultation sans décision n'est pas un
   événement.

3. CE QUI EST STABLE / CE QUI BOUGE.
   Deux colonnes. Pour chaque paramètre suivi — biologie, imagerie,
   symptôme — la dernière valeur, la précédente, et le sens de variation.

4. LES QUESTIONS OUVERTES.
   Ce que les documents posent sans y répondre : examen demandé dont le
   résultat n'apparaît nulle part, traitement introduit sans réévaluation,
   avis spécialisé sans retour. Cinq maximum, la plus urgente d'abord.

5. LES TROIS CHOSES À VÉRIFIER AVEC LE PATIENT.
   Formulées comme des questions à poser à voix haute, pas comme des
   items de dossier.

RÈGLES
- Tout ce que tu écris doit être dans les documents. Si une information
  manque, écris « non documenté » — ne comble pas.
- Aucune proposition thérapeutique, aucun diagnostic : ce n'est pas ce
  que je te demande.`;

const P_RELECTEUR = `Tu es relecteur de compte rendu, pas rédacteur. Je te donne la
transcription brute d'une consultation et le compte rendu qui en a été
tiré. Tu compares les deux et tu me dis ce qui cloche — tu ne réécris
rien tant que je ne te l'ai pas demandé.

TRANSCRIPTION BRUTE
"""
[la transcription, ou vos notes de consultation]
"""

COMPTE RENDU À RELIRE
"""
[le compte rendu produit, par un scribe IA ou à la main]
"""

RENDS QUATRE LISTES, DANS CET ORDRE. Chaque ligne cite le passage exact
concerné, entre guillemets.

1. INVENTÉ.
   Ce que le compte rendu affirme et qui n'est nulle part dans la
   transcription. C'est la liste la plus importante : commence par elle,
   et si elle est vide, écris « Rien d'inventé. »

2. PERDU.
   Ce que la transcription contient, qui a une valeur clinique ou
   médico-légale, et qui a disparu du compte rendu. Signale en
   particulier : les signes négatifs, les doses, les refus du patient,
   ce qui a été proposé et non retenu.

3. DÉFORMÉ.
   Ce qui est présent dans les deux mais dont le sens a bougé : un doute
   devenu une certitude, une hypothèse devenue un diagnostic, un
   « parfois » devenu un « souvent ». Donne les deux formulations côte
   à côte.

4. AMBIGU.
   Ce qu'un confrère qui reprend le dossier dans six mois pourrait
   comprendre de travers. Pour chaque ligne, propose la reformulation
   qui lève l'ambiguïté — en une phrase.

Ne me félicite pas, ne conclus pas sur la qualité générale du document.
Les quatre listes suffisent.`;

const P_COURRIER = `Tu rédiges un courrier médical adressé d'un médecin à un autre. Tu écris
en français, dans le registre d'un courrier professionnel : sobre,
factuel, sans formule ampoulée.

DESTINATAIRE : [spécialité, et « connu du dossier » ou « premier contact »]
OBJET DE LA DEMANDE : [avis / prise en charge / geste technique / information]
CE QUE J'ATTENDS DE LUI, EN UNE PHRASE : [la question précise posée]

ÉLÉMENTS (dépersonnalisés)
- Terrain : [âge, sexe, antécédents utiles à CE destinataire]
- Traitement en cours : [molécules et doses]
- Histoire : [chronologie, en trois ou quatre lignes]
- Examen : [ce qui est positif, et les négatifs qui comptent]
- Examens déjà faits : [avec dates relatives et résultats]
- Ce que j'ai déjà essayé : [et pourquoi ça n'a pas suffi]

STRUCTURE IMPOSÉE
1. Une phrase d'adresse et l'objet.
2. La question posée, dès le deuxième paragraphe. Pas à la fin.
3. Les éléments, dans l'ordre : terrain, histoire, examen, examens
   complémentaires, ce qui a été tenté.
4. Ce que j'ai déjà expliqué au patient, et ce qu'il attend.
5. Une formule de politesse courte.

RÈGLES
- Tu n'ajoutes aucun élément clinique que je ne t'ai pas donné. Si un
  élément manque pour que le courrier tienne debout, tu ne l'inventes
  pas : tu le listes après le courrier, sous « À compléter avant envoi ».
- Tu ne transformes aucune hypothèse en diagnostic.
- Longueur cible : une page, jamais deux.
- Tu laisses les identités en clair sous forme de crochets — [NOM],
  [date] — que je remplis dans mon logiciel métier, pas ici.`;

const P_TRADUCTEUR_PATIENT = `Tu réécris un document médical pour la personne qu'il concerne. Elle le
lira seule, chez elle, sans médecin à côté.

DOCUMENT (dépersonnalisé)
"""
[le compte rendu, le courrier ou le résultat d'examen]
"""

CE QUE LE PATIENT SAIT DÉJÀ : [ce qui lui a été dit en consultation, ou « rien »]
CE QU'IL NE FAUT PAS ANNONCER ICI : [ce qui doit se dire de vive voix, ou « rien »]

RENDS QUATRE PARTIES, TITRÉES, DANS CET ORDRE :

1. CE QUE DIT CE DOCUMENT — cinq à huit lignes, au présent, à la
   deuxième personne. Chaque terme technique est suivi de sa traduction
   entre parenthèses la première fois, puis réutilisé tel quel.

2. CE QUI EST NORMAL — ce que l'examen a trouvé de rassurant. Cette
   partie n'est jamais vide : s'il n'y a rien de rassurant, écris ce qui
   n'a pas empiré.

3. CE QUI DEMANDE UNE SUITE — ce qui va être fait, par qui, et quand.
   Uniquement ce qui figure dans le document.

4. CE QUE VOUS POUVEZ DEMANDER À VOTRE MÉDECIN — trois questions
   précises, formulées telles quelles, que le patient peut poser à la
   prochaine consultation.

RÈGLES ABSOLUES
- Tu n'ajoutes aucune information absente du document : ni pronostic, ni
  statistique, ni conseil thérapeutique, ni délai que le document ne
  donne pas.
- Tu ne rassures pas et tu ne dramatises pas. Tu traduis.
- Pas de « ne vous inquiétez pas », pas de « c'est très grave ».
- Niveau de lecture : une personne de quinze ans doit comprendre chaque
  phrase à la première lecture. Phrases de vingt mots maximum.
- Termine par cette ligne, telle quelle : « Ce texte est une traduction
  de votre compte rendu. En cas de désaccord entre les deux, c'est le
  compte rendu d'origine qui fait foi. »`;

const P_ANNONCE = `Tu joues le rôle d'un patient. Je m'entraîne à une annonce difficile
avant de la faire pour de vrai. Tu ne sors pas du rôle, sauf si j'écris
« PAUSE ».

LE RÔLE QUE TU JOUES
- Qui : [âge, sexe, situation familiale et professionnelle, en une ligne]
- Ce qu'il sait déjà : [ce qui lui a été dit jusqu'ici]
- Ce qu'il redoute le plus : [la peur centrale — tiens-la, ne l'annonce pas]
- Son tempérament : [ex. « pose beaucoup de questions », « se ferme »,
  « minimise », « cherche à me rassurer moi »]

CE QUE JE VAIS ANNONCER : [l'information à transmettre]

COMMENT TU JOUES
- Tu réponds uniquement comme le patient, à la première personne, en
  trois ou quatre phrases maximum.
- Tu réagis à ce que je dis vraiment, pas à ce que j'aurais dû dire. Si
  ma phrase est confuse, tu comprends de travers — comme un vrai patient.
- Tu n'aides pas. Tu ne relances pas gentiment pour me sauver. Les
  silences existent : tu peux répondre « … » et rien d'autre.
- Tu n'acceptes pas trop vite et tu ne guéris pas.

QUAND J'ÉCRIS « PAUSE »
Tu sors du rôle et tu me rends trois choses, et rien d'autre :
  a. La phrase exacte que j'ai dite qui a le plus fait mal — et pourquoi.
  b. Ce que le patient a compris, réellement, de ce que j'ai dit.
  c. Une seule chose à changer au prochain essai.
Puis tu attends que je reprenne.

Commence : je frappe à la porte, tu es assis. Écris ta première réplique.`;

const P_VERIFIER_REFERENCE = `Règle de sourçage. Elle vaut pour toute cette conversation, et tu
l'appliques avant de répondre, pas après.

1. Tu ne cites une référence que si tu peux en donner, ensemble : les
   auteurs, l'année, le titre exact, la revue, et le DOI ou le PMID.
   S'il te manque UN de ces cinq éléments, tu ne cites pas la référence :
   tu écris « référence non vérifiable » et tu donnes l'information sans
   la sourcer.

2. Tu ne reconstitues jamais une référence à partir de sa forme. Un titre
   plausible, des auteurs plausibles et une revue plausible produisent une
   référence fausse : c'est exactement l'erreur que je cherche à éviter.

3. Pour chaque référence citée, tu ajoutes en fin de ligne un niveau de
   confiance, choisi parmi trois : « je l'ai en mémoire de façon fiable »,
   « je crois la connaître, à vérifier », « je ne suis pas sûr qu'elle
   existe ». Le troisième cas n'est pas une faute : c'est ce que je veux
   savoir.

4. Quand une recommandation nationale est en jeu — HAS, ANSM, sociétés
   savantes — tu donnes le nom exact du texte et son année de publication,
   et tu signales si tu sais qu'une version plus récente existe.

5. À la fin de ta réponse, tu ajoutes un bloc « À VÉRIFIER AVANT USAGE »
   listant, en une ligne chacune, les affirmations que je devrais
   contrôler moi-même avant de m'en servir en clinique. Ce bloc n'est
   jamais vide : s'il l'est, c'est que tu n'as pas cherché.

MA QUESTION : [votre question]`;

const P_LECTURE_CRITIQUE = `Tu m'aides à lire un article critiquement. Tu ne le résumes pas : le
résumé, je l'ai déjà, c'est l'abstract.

ARTICLE
"""
[collez le texte de l'article, ou joignez le PDF]
"""

CE QUE J'EN FERAIS SI J'Y CROIS : [la décision que cet article pourrait changer]

RENDS SIX BLOCS, DANS CET ORDRE :

1. LA QUESTION RÉELLEMENT POSÉE.
   PICO en quatre lignes : population, intervention, comparateur, critère
   de jugement principal. Si le critère principal est composite ou
   intermédiaire, dis-le ici, en premier.

2. CE QUI EST MESURÉ, ET CE QUI EST CONCLU.
   Deux colonnes. À gauche, le résultat chiffré sur le critère principal :
   effet absolu, effet relatif, intervalle de confiance. À droite, la
   phrase de conclusion des auteurs. Signale tout écart entre les deux.

3. LES TROIS FAIBLESSES QUI COMPTENT.
   Pas la liste complète des biais possibles : les trois qui pourraient
   réellement inverser la conclusion. Pour chacune, dis dans quel sens
   elle pousse le résultat.

4. LA POPULATION.
   Qui a été exclu ? Mes patients ressemblent-ils aux leurs ? Réponds
   précisément : âge, comorbidités, sévérité, pays.

5. LA TAILLE D'EFFET, EN CLINIQUE.
   Traduis le résultat principal en NNT ou NNH quand c'est possible, et
   dis si l'effet est cliniquement pertinent ou seulement statistiquement
   significatif.

6. VERDICT SUR MA DÉCISION.
   Une ligne : cet article suffit-il à changer ce que j'ai annoncé plus
   haut ? Oui / non / pas seul — et à quelle condition.

Si une information nécessaire n'est pas dans le texte que je t'ai donné,
écris « absent de l'article » plutôt que de la déduire.`;

const P_VEILLE = `Tu tries une liste de publications pour un médecin qui a vingt minutes.

MA SPÉCIALITÉ ET MON EXERCICE : [ex. « médecine générale, cabinet urbain »]
CE QUE JE SUIS EN TRAIN DE CHANGER DANS MA PRATIQUE : [un ou deux sujets
en cours — c'est ce qui fera monter certains titres]

LISTE À TRIER
"""
[collez les titres, ou les titres + abstracts, un par ligne]
"""

RANGE-LES EN QUATRE PILES, ET RIEN D'AUTRE :

PILE 1 — À LIRE AUJOURD'HUI. Trois maximum.
Ce qui peut changer une décision cette semaine. Pour chaque : une ligne
disant ce qui changerait, concrètement.

PILE 2 — À LIRE SI LE SUJET VOUS CONCERNE.
Avec, pour chaque, la condition en une demi-ligne : « si vous suivez des
patients sous X », « si vous faites des infiltrations ».

PILE 3 — À CONNAÎTRE SANS LIRE.
Un titre, une phrase de contenu. Ce qu'il suffit de savoir exister.

PILE 4 — IGNORER.
Sans justification longue : trois mots suffisent — « étude préclinique »,
« déjà su », « effectif trop faible ».

RÈGLES
- Aucun titre ne peut être dans deux piles.
- Tu ne te prononces pas sur la validité des travaux : tu n'as que les
  titres. Tu tries par pertinence pour MON exercice, pas par qualité.
- Aucune pile n'a de quota, sauf la première : trois, jamais quatre.`;

const P_ARBRE_DECISION = `Tu transformes un texte de recommandation en arbre de décision utilisable
en consultation. Tu ne l'interprètes pas : tu le réorganises.

TEXTE SOURCE
"""
[collez le passage de la recommandation — pas le document entier]
"""

RÉFÉRENCE DU TEXTE : [nom exact et année]
LE POINT DE DÉPART : [la situation clinique qui déclenche l'arbre]

RENDS L'ARBRE AU FORMAT TEXTE INDENTÉ, avec ces règles :

- Chaque nœud est une QUESTION fermée, à laquelle on peut répondre en
  consultation sans examen complémentaire — sauf si le texte impose
  explicitement l'examen, auquel cas le nœud devient « obtenir [examen] ».
- Chaque branche porte sa réponse en tête : « OUI → », « NON → ».
- Chaque feuille est une ACTION : prescrire, adresser, surveiller,
  rassurer — avec le délai quand le texte le donne.
- Chaque nœud et chaque feuille est suivi, entre parenthèses, du numéro
  de page ou de paragraphe du texte source. Pas de parenthèse = pas de
  fondement : ne l'écris pas.

APRÈS L'ARBRE, TROIS SECTIONS COURTES :

A. CE QUE LE TEXTE NE TRANCHE PAS.
   Les situations où l'arbre s'arrête faute de recommandation. Sois
   exhaustif : c'est là que le médecin décide seul, et il doit le savoir.

B. LES SEUILS UTILISÉS.
   Tous les chiffres de l'arbre, en liste, avec leur unité et l'endroit
   du texte d'où ils viennent.

C. CE QUE J'AI DÛ SIMPLIFIER.
   Les nuances du texte qui ne rentrent pas dans un arbre binaire.

Tu n'ajoutes aucune recommandation absente du texte fourni, même si tu la
connais par ailleurs. Si tu vois une contradiction entre le texte et ce
que tu sais, signale-la en fin de réponse, séparément.`;

const P_CAS_CLINIQUE = `Tu fabriques un cas clinique pour enseigner. Le cas est entièrement
fictif : tu l'inventes, tu ne pars d'aucun dossier réel.

PUBLIC : [ex. « internes de médecine générale, 2e semestre »]
OBJECTIF PÉDAGOGIQUE : [la seule chose qu'ils doivent avoir comprise à la fin]
PIÈGE À TENDRE : [l'erreur classique que le cas doit faire commettre]
DURÉE : [ex. « 20 minutes en petit groupe »]

RENDS LE CAS EN CINQ PARTIES :

1. LE CAS, EN TROIS TEMPS.
   Temps 1 : la présentation initiale, telle qu'elle arrive — incomplète,
   avec un élément qui oriente vers le piège.
   Temps 2 : les informations qu'on obtient si on pose les bonnes questions.
   Temps 3 : l'évolution, qui tranche.
   Chaque temps tient en un paragraphe et se termine par une question
   posée au groupe.

2. LES QUESTIONS, AVEC LEURS RÉPONSES ATTENDUES.
   Trois par temps. La réponse attendue tient en deux lignes et précise
   ce qui est faux dans la réponse la plus fréquente.

3. LE PIÈGE, EXPLIQUÉ.
   Pourquoi il fonctionne, quel biais il exploite, et à quel moment exact
   du cas il se referme.

4. LE POINT D'ANCRAGE.
   Une phrase, dix mots maximum, que les apprenants doivent retenir six
   mois plus tard.

5. LES VARIANTES.
   Deux modifications du cas — une qui le rend plus simple, une plus
   difficile — en une ligne chacune.

CONTRAINTES
- Le cas doit être cliniquement plausible de bout en bout : constantes
  cohérentes, chronologie tenable, résultats compatibles entre eux.
- Aucun nom de marque, aucun établissement réel, aucune date absolue.
- Si tu utilises des seuils ou des scores, donne leur nom exact et leur
  source, et signale si tu n'en es pas sûr.`;

const P_TRI_MESSAGERIE = `Tu tries la messagerie d'un cabinet médical. Tu ne réponds à personne :
tu classes, et tu proposes.

MESSAGES (dépersonnalisés)
"""
[collez les messages, séparés par une ligne « --- »]
"""

MES RÈGLES DE CABINET
- Ce que je traite par message : [ex. « résultats normaux, renouvellements
  de traitement chronique stable »]
- Ce qui bascule en consultation : [ex. « tout symptôme nouveau »]
- Ce qui part aux urgences : [vos critères]
- Mes délais : [ex. « rappel sous 48 h ouvrées »]

POUR CHAQUE MESSAGE, RENDS UNE LIGNE DE TABLEAU :
  n° | urgence (A/B/C) | ce qui est demandé, en cinq mots | qui traite | action

Les trois niveaux, et rien entre :
  A — ne peut pas attendre la fin de journée. Tout signe d'alarme, toute
      formulation ambiguë qui POURRAIT en cacher un, tout message venant
      d'un patient à risque connu.
  B — à traiter dans les délais du cabinet.
  C — administratif, informatif, ou déjà traité.

RÈGLE DE PRUDENCE : dans le doute entre deux niveaux, tu prends toujours
le plus urgent, et tu écris « doute » dans la colonne action. Un message
classé trop haut coûte trois minutes ; l'inverse coûte autre chose.

APRÈS LE TABLEAU :
1. La liste des A, seule, recopiée EN TÊTE de ta réponse : je veux la
   voir avant le reste.
2. Les brouillons de réponse pour les C uniquement — trois lignes
   maximum chacun, ton neutre, sans contenu médical nouveau, se terminant
   par la façon de recontacter le cabinet.

Tu ne rédiges aucune réponse pour les A et les B. Ceux-là passent par moi.`;

export const PROMPTS: Prompt[] = [
  {
    slug: "depersonnaliser-avant-de-coller",
    title: "Dépersonnaliser avant de coller",
    subtitle:
      "De « je copie le compte rendu tel quel » à « je colle un texte qui garde toute sa valeur clinique, et plus rien qui identifie ».",
    categorie: "socle",
    outils: ["chatgpt", "claude", "gemini"],
    niveau: "debutant",
    ordre: 1,
    intro:
      "C'est le premier prompt de la banque parce que c'est le premier geste de la journée. Il ne remplace pas votre vigilance : il la double, et il vous dit ce qu'il a retiré pour que vous puissiez vérifier. À faire tourner dans une conversation séparée de celle où vous travaillerez ensuite.",
    body: P_ANONYMISER,
    variables: [
      {
        champ: "[collez ici le texte brut]",
        aide: "Le document d'origine. Relisez-le d'abord des yeux : ce prompt attrape ce qui est explicite, pas ce qui se déduit d'un contexte que vous seul connaissez.",
      },
    ],
    howTo: [
      "Ouvrez une conversation neuve, uniquement pour cette étape.",
      "Collez le texte, lancez, puis lisez le bloc B : c'est la liste de ce qui a été retiré, et elle vous dit si l'outil a manqué quelque chose.",
      "Lisez la section « Reste identifiant ? ». Une maladie rare chez quelqu'un de 19 ans dans une petite commune reste identifiante même sans nom.",
      "Copiez le bloc A — et uniquement lui — dans la conversation où vous travaillerez vraiment.",
    ],
    limits: [
      "Il ne rend pas un texte anonyme au sens réglementaire : il le dépersonnalise, ce qui est un cran en dessous. Ce que vous collez reste sous votre responsabilité.",
      "Il ne voit pas ce qui identifie par recoupement hors du texte : un contexte que vous connaissez et qu'il ignore.",
      "Il traite du texte. Une capture d'écran, un PDF d'analyse ou une image DICOM portent des métadonnées qu'il ne touche pas.",
    ],
    updatedAt: "2026-09-08",
    tutorielSlug: "maitriser-chatgpt",
  },
  {
    slug: "cadrer-l-assistant",
    title: "Cadrer l'assistant, une fois pour toutes",
    subtitle:
      "De « il me répond comme à un patient » à « il me répond comme à un confrère, et il marque ce dont il n'est pas sûr ».",
    categorie: "socle",
    outils: ["chatgpt", "claude", "gemini"],
    niveau: "debutant",
    ordre: 2,
    intro:
      "Un assistant généraliste s'adresse par défaut au grand public : il définit les termes, il rappelle d'aller voir un médecin, il enrobe. Ce préambule règle le niveau, la forme, et surtout impose de marquer l'incertitude. Il se colle en tête de conversation — ou une fois pour toutes dans les instructions personnalisées du compte.",
    body: P_CADRE,
    variables: [
      {
        champ: "[votre spécialité et votre mode d'exercice]",
        aide: "Ce qui change réellement les réponses : la spécialité, le cadre (ville, hôpital, urgences), le type de patientèle.",
      },
    ],
    howTo: [
      "Collez-le en première question d'une nouvelle conversation, avant votre vraie demande.",
      "Mieux : reportez-le dans les instructions personnalisées de votre compte, pour qu'il s'applique partout sans y penser.",
      "Vérifiez qu'il tient : posez une question dont vous savez la réponse incertaine, et regardez si le « incertain : » apparaît.",
      "Reprenez-le au bout de quelques semaines. Les modèles changent, les réponses aussi.",
    ],
    limits: [
      "Un préambule oriente le ton et la forme ; il n'améliore pas ce que le modèle sait. Un chiffre faux reste faux, il sera juste mieux signalé.",
      "Le marquage « incertain : » n'est pas fiable à 100 % : c'est un garde-fou, pas un détecteur d'erreur.",
      "Les instructions personnalisées voyagent avec le compte : sur un poste partagé, elles s'appliquent aussi aux autres.",
    ],
    updatedAt: "2026-09-08",
    tutorielSlug: "maitriser-claude",
  },
  {
    slug: "contradicteur-diagnostique",
    title: "Le contradicteur diagnostique",
    subtitle: "De « l'IA confirme mon hypothèse » à « l'IA ne cherche que ce qui la contredit ».",
    categorie: "consultation",
    outils: ["chatgpt", "claude", "gemini"],
    niveau: "intermediaire",
    ordre: 1,
    intro:
      "Demandez un diagnostic à un assistant : il vous en donnera un, souvent le vôtre, avec des arguments pour. C'est le contraire de ce dont un raisonnement clinique a besoin. Ce prompt inverse la charge — l'outil n'a le droit de produire que des objections, et son verdict n'arrive qu'en dernier, quand il ne peut plus orienter la lecture.",
    body: P_CONTRADICTEUR,
    variables: [
      {
        champ: "[votre diagnostic de travail]",
        aide: "Celui que vous poseriez s'il fallait trancher maintenant. Le prompt ne fonctionne pas laissé vide : c'est votre hypothèse qui est testée.",
      },
      {
        champ: "[signes positifs ET signes négatifs pertinents]",
        aide: "Les négatifs sont ce qui manque le plus souvent, et ce qui discrimine le plus. Un « pas de fièvre » vaut trois signes positifs.",
      },
    ],
    howTo: [
      "Écrivez votre hypothèse avant de lire quoi que ce soit : c'est votre raisonnement qui est mis à l'épreuve, pas celui de l'outil.",
      "Dépersonnalisez le dossier — le prompt du socle est fait pour ça.",
      "Lisez la section 4 (biais) avant la 5 (verdict). C'est celle qui apprend quelque chose.",
      "Traitez la liste « ce qui manque » comme une liste d'examens à discuter, pas à prescrire.",
    ],
    limits: [
      "Il ne pose pas de diagnostic et ne vaut pas second avis : il produit des objections, y compris pour des hypothèses très improbables.",
      "Il raisonne sur ce que vous écrivez. Un élément oublié dans votre énoncé est un élément qui n'existe pas pour lui.",
      "Il ne connaît ni votre patient, ni son évolution sous vos yeux — la donnée qui tranche le plus souvent.",
    ],
    updatedAt: "2026-09-08",
    ressourceSlug: "contradicteur-diagnostique",
  },
  {
    slug: "synthese-de-dossier",
    title: "La synthèse de dossier avant la consultation",
    subtitle:
      "De « quinze pages de comptes rendus dans le désordre » à « une chronologie, ce qui bouge, et trois questions à poser ».",
    categorie: "consultation",
    outils: ["chatgpt", "claude", "notebooklm"],
    niveau: "intermediaire",
    ordre: 2,
    intro:
      "Le patient est en salle d'attente et son dossier fait quinze pages venues de quatre services. Ce prompt ne conclut rien : il ordonne. La partie qui compte est la quatrième — ce que les documents posent sans y répondre, c'est-à-dire ce qui est passé entre les mailles.",
    body: P_SYNTHESE_DOSSIER,
    variables: [
      {
        champ: "[collez les comptes rendus, courriers, résultats]",
        aide: "Dans le désordre, peu importe : la remise en ordre chronologique fait partie du travail demandé.",
      },
      {
        champ: "[ce pour quoi le patient vient]",
        aide: "Ce champ décide de ce qui est pertinent. « Renouvellement » et « douleur thoracique » ne font pas remonter les mêmes lignes.",
      },
    ],
    howTo: [
      "Dépersonnalisez d'abord : un dossier complet est l'objet le plus identifiant qui soit.",
      "Sur un corpus volumineux, préférez NotebookLM — chaque affirmation y renvoie au passage source, ce qui rend la vérification tenable.",
      "Lisez le bloc 4 en premier. Le reste, vous le connaissez déjà.",
      "Vérifiez trois lignes de la chronologie au hasard dans les documents d'origine avant de vous fier au reste.",
    ],
    limits: [
      "Il ne remplace pas la lecture du dossier : il vous dit où regarder, il ne vous dispense pas de regarder.",
      "Une date mal lue déplace un événement dans la chronologie sans que rien ne le signale.",
      "Il ne détecte pas ce qui est absent du dossier parce que personne ne l'a écrit — seulement ce qui est resté sans réponse.",
    ],
    updatedAt: "2026-09-08",
    tutorielSlug: "maitriser-notebooklm",
  },
  {
    slug: "relecteur-de-compte-rendu",
    title: "Le relecteur de compte rendu",
    subtitle:
      "De « je relis en diagonale ce que le scribe a produit » à « je sais ce qui a été inventé, perdu ou déformé ».",
    categorie: "redaction",
    outils: ["chatgpt", "claude"],
    niveau: "intermediaire",
    ordre: 1,
    intro:
      "Les scribes IA écrivent vite et bien — ce qui est exactement le problème : un compte rendu fluide se relit mal. Ce prompt compare la transcription et le compte rendu, et ne rend que les écarts, en commençant par le plus grave : ce qui a été ajouté.",
    body: P_RELECTEUR,
    variables: [
      {
        champ: "[la transcription, ou vos notes de consultation]",
        aide: "La source. Sans elle, le prompt n'a rien à comparer et se met à juger le style — ce qui ne sert à rien.",
      },
      {
        champ: "[le compte rendu produit]",
        aide: "Le texte à contrôler, qu'il vienne d'un scribe, d'une dictée ou de votre clavier.",
      },
    ],
    howTo: [
      "Dépersonnalisez les deux textes de la même façon, sinon la comparaison fabrique de faux écarts.",
      "Lisez la liste 1 (inventé) ligne à ligne : une seule ligne y suffit à justifier la relecture.",
      "Dans la liste 2 (perdu), regardez d'abord les signes négatifs et les refus du patient — ce sont eux qui comptent en cas de litige.",
      "Corrigez vous-même dans votre logiciel. Ne demandez pas la réécriture : vous perdriez la trace de ce qui a changé.",
    ],
    limits: [
      "Il compare deux textes ; il ne sait rien de ce qui s'est dit et n'a pas été transcrit.",
      "Il ne valide rien sur le fond : un compte rendu fidèle à une transcription fausse passera le test.",
      "La liste « ambigu » est du confort de rédaction, pas une exigence : n'y passez pas plus d'une minute.",
    ],
    updatedAt: "2026-09-08",
    ressourceSlug: "relecture-compte-rendu-ia",
  },
  {
    slug: "courrier-au-confrere",
    title: "Le courrier au confrère",
    subtitle:
      "De « je repousse le courrier à ce soir » à « une page, la question dès le deuxième paragraphe, et rien d'inventé ».",
    categorie: "redaction",
    outils: ["chatgpt", "claude", "gemini"],
    niveau: "debutant",
    ordre: 2,
    intro:
      "Un courrier d'adressage se lit en trente secondes, par quelqu'un qui cherche une seule chose : ce qu'on lui demande. Ce prompt impose cette structure et interdit le remplissage — tout élément manquant est listé à part, sous « à compléter avant envoi », au lieu d'être comblé par une formule plausible.",
    body: P_COURRIER,
    variables: [
      {
        champ: "[la question précise posée]",
        aide: "En une phrase, à la forme interrogative. Si vous n'arrivez pas à l'écrire, le courrier n'est pas prêt.",
      },
      {
        champ: "[antécédents utiles à CE destinataire]",
        aide: "Utiles à lui, pas exhaustifs. Un cardiologue n'a pas besoin de tout le dossier dermatologique.",
      },
    ],
    howTo: [
      "Remplissez les champs en style télégraphique : la mise en forme est le travail de l'outil.",
      "Laissez les identités entre crochets, et remplissez-les dans votre logiciel métier — pas dans la conversation.",
      "Lisez la liste « À compléter avant envoi » : c'est le vrai résultat du prompt.",
      "Relisez le paragraphe clinique ligne à ligne avant de signer. Vous signez, donc vous répondez du contenu.",
    ],
    limits: [
      "Il met en forme, il ne décide pas de l'indication de l'adressage.",
      "Il peut lisser une nuance en cherchant la concision : la relecture n'est pas optionnelle.",
      "Il ne connaît ni les habitudes du destinataire, ni les circuits locaux d'adressage.",
    ],
    updatedAt: "2026-09-08",
  },
  {
    slug: "compte-rendu-explique-au-patient",
    title: "Le compte rendu réécrit pour le patient",
    subtitle:
      "De « le patient cherche ses résultats sur un moteur de recherche » à « il lit un texte exact, à sa portée, qui n'ajoute rien ».",
    categorie: "patient",
    outils: ["chatgpt", "claude", "gemini"],
    niveau: "debutant",
    ordre: 1,
    intro:
      "Le patient a le droit d'accéder à son compte rendu, et il l'exerce — le plus souvent seul, le soir, avec un moteur de recherche à côté. Ce prompt produit une traduction stricte : quatre parties, aucun pronostic, aucun conseil ajouté, et une phrase finale qui rappelle lequel des deux documents fait foi.",
    body: P_TRADUCTEUR_PATIENT,
    variables: [
      {
        champ: "[ce qui lui a été dit en consultation, ou « rien »]",
        aide: "Ce champ évite que la traduction annonce par écrit quelque chose que vous n'avez pas encore dit de vive voix.",
      },
      {
        champ: "[ce qui doit se dire de vive voix]",
        aide: "Tout ce qui relève de l'annonce. Ce que vous écrivez ici sera absent du texte produit.",
      },
    ],
    howTo: [
      "Dépersonnalisez le compte rendu, traduisez, puis remettez le prénom à la main si vous voulez personnaliser.",
      "Relisez ligne à ligne en cherchant une seule chose : une information qui ne serait pas dans l'original.",
      "Remettez le texte en main propre ou par votre messagerie sécurisée, jamais par email ordinaire.",
      "Gardez la phrase finale telle quelle : c'est elle qui donne son statut au document.",
    ],
    limits: [
      "Ce n'est pas une consultation d'annonce. Un résultat qui change le pronostic se dit, il ne se traduit pas.",
      "L'outil peut adoucir en simplifiant. La relecture médicale n'est pas déléguable.",
      "Le texte produit engage votre responsabilité au même titre que le compte rendu d'origine.",
    ],
    updatedAt: "2026-09-08",
    ressourceSlug: "compte-rendu-explique-au-patient",
  },
  {
    slug: "repeter-une-annonce-difficile",
    title: "Répéter une annonce difficile",
    subtitle:
      "De « je prépare mes phrases dans ma tête » à « je les ai déjà dites une fois, et j'ai vu ce qu'elles font ».",
    categorie: "patient",
    outils: ["chatgpt", "claude"],
    niveau: "avance",
    ordre: 2,
    intro:
      "Une annonce se prépare rarement à voix haute, faute d'interlocuteur. Ce prompt en fournit un : l'outil joue le patient, réagit à ce que vous dites réellement plutôt qu'à ce que vous vouliez dire, et ne sort du rôle que sur le mot « PAUSE » — moment où il vous rend la phrase qui a fait mal, et ce qui a été compris.",
    body: P_ANNONCE,
    variables: [
      {
        champ: "[la peur centrale]",
        aide: "Ce que le patient redoute vraiment, souvent sans le formuler : perdre son autonomie, sa place au travail, ne pas voir grandir quelqu'un.",
      },
      {
        champ: "[son tempérament]",
        aide: "C'est ce qui rend l'exercice utile : entraînez-vous d'abord sur le tempérament qui vous met le plus en difficulté.",
      },
    ],
    howTo: [
      "Écrivez vos répliques comme vous les diriez — à voix haute si vous êtes seul — pas en style écrit.",
      "Ne corrigez pas en cours de route. Allez au bout, puis écrivez « PAUSE ».",
      "Refaites l'entretien depuis le début en changeant une seule chose : celle que le débriefing a désignée.",
      "Rejouez avec un tempérament différent avant de considérer que c'est prêt.",
    ],
    limits: [
      "Un modèle simule une réaction plausible, pas celle de votre patient. L'exercice entraîne vos formulations, il ne prédit rien.",
      "Il reste plus coopératif qu'un vrai patient, même quand on lui demande de ne pas l'être.",
      "Il ne remplace ni un compagnonnage, ni une formation à l'annonce avec patients simulés.",
    ],
    updatedAt: "2026-09-08",
  },
  {
    slug: "verifier-une-reference",
    title: "Vérifier une référence avant de la citer",
    subtitle:
      "De « la référence a l'air juste » à « je sais laquelle existe, laquelle est douteuse, et ce qu'il me reste à contrôler ».",
    categorie: "veille",
    outils: ["chatgpt", "claude", "gemini"],
    niveau: "debutant",
    ordre: 1,
    intro:
      "Une référence fabriquée par un modèle a exactement la forme d'une vraie : auteurs plausibles, revue plausible, année plausible. C'est ce qui la rend dangereuse. Cette règle de sourçage se pose avant la question, jamais après, et impose un niveau de confiance déclaré ligne par ligne.",
    body: P_VERIFIER_REFERENCE,
    variables: [
      {
        champ: "[votre question]",
        aide: "Elle vient à la fin, volontairement : la règle doit être lue avant que le modèle ne commence à composer sa réponse.",
      },
    ],
    howTo: [
      "Collez la règle et votre question ensemble, dans le même message.",
      "Prenez les références marquées « je l'ai en mémoire de façon fiable » et vérifiez-en une au hasard sur PubMed : le taux d'erreur sur cette catégorie vous dira quoi penser des autres.",
      "Ne citez jamais une référence sans l'avoir ouverte, quel que soit le niveau de confiance annoncé.",
      "Gardez le bloc « À vérifier avant usage » : c'est votre liste de contrôle.",
    ],
    limits: [
      "Un modèle évalue mal sa propre fiabilité : le niveau de confiance oriente le tri, il ne le remplace pas.",
      "Un DOI syntaxiquement correct peut ne renvoyer nulle part. Seule l'ouverture du lien fait foi.",
      "La règle ne rend pas les connaissances plus à jour : elle rend l'ignorance visible.",
    ],
    updatedAt: "2026-09-08",
    ressourceSlug: "verifier-une-reference-ia",
  },
  {
    slug: "lecture-critique-d-article",
    title: "La lecture critique d'un article",
    subtitle:
      "De « l'abstract dit que ça marche » à « je sais sur quel critère, chez qui, et si ça change ma décision ».",
    categorie: "veille",
    outils: ["chatgpt", "claude", "notebooklm"],
    niveau: "avance",
    ordre: 2,
    intro:
      "Le résumé d'un article, vous l'avez déjà : c'est l'abstract, et il est écrit par ceux qui ont intérêt à ce que l'étude soit lue. Ce prompt fait l'autre travail — l'écart entre ce qui est mesuré et ce qui est conclu, les trois faiblesses qui pourraient inverser le résultat, et un verdict sur la décision que vous aviez annoncée avant de lire.",
    body: P_LECTURE_CRITIQUE,
    variables: [
      {
        champ: "[la décision que cet article pourrait changer]",
        aide: "À écrire avant la lecture. C'est ce qui empêche de conclure « article intéressant » et de n'en rien faire.",
      },
      {
        champ: "[collez le texte de l'article]",
        aide: "Le texte intégral si vous l'avez ; à défaut, l'abstract et la section méthodes. Sur l'abstract seul, le prompt répondra surtout « absent de l'article ».",
      },
    ],
    howTo: [
      "Écrivez votre décision d'abord, sinon le bloc 6 ne sert à rien.",
      "Sur un PDF entier, passez par un outil qui cite ses passages : le résultat se vérifie alors en un clic.",
      "Contrôlez vous-même les chiffres du bloc 2 dans le texte. C'est là que la lecture automatique se trompe.",
      "Si vous lisez plusieurs articles sur un même sujet, refaites tourner le prompt sur chacun avant de les comparer.",
    ],
    limits: [
      "Il ne remplace pas une grille de lecture critique validée, et ne détecte ni fraude ni conflit d'intérêts non déclaré.",
      "Il ne juge pas la littérature autour de l'article : un essai isolé reste un essai isolé.",
      "Sur un texte tronqué, il déduit. Le garde-fou est la mention « absent de l'article », qui n'est pas infaillible.",
    ],
    updatedAt: "2026-09-08",
  },
  {
    slug: "trier-la-veille-de-la-semaine",
    title: "Trier la veille de la semaine",
    subtitle: "De « quarante titres en attente » à « trois à lire aujourd'hui, et pourquoi ».",
    categorie: "veille",
    outils: ["chatgpt", "claude", "gemini"],
    niveau: "debutant",
    ordre: 3,
    intro:
      "Le problème n'est pas de trouver la littérature : c'est de renoncer à 90 % d'elle sans culpabiliser. Quatre piles, un quota strict de trois sur la première, et une pile « à connaître sans lire » qui est la plus utile de toutes.",
    body: P_VEILLE,
    variables: [
      {
        champ: "[un ou deux sujets en cours]",
        aide: "Ce que vous êtes en train de changer dans votre pratique. C'est ce champ qui fait remonter les bons titres — sans lui, le tri est générique.",
      },
      {
        champ: "[collez les titres]",
        aide: "Les titres seuls suffisent pour un tri par pertinence. Ajoutez les abstracts si vous voulez un tri plus fin.",
      },
    ],
    howTo: [
      "Copiez la liste depuis votre alerte PubMed, votre flux RSS ou le sommaire de votre revue.",
      "Lisez la pile 3 en entier : trois minutes, et c'est ce qui tient au courant.",
      "N'ouvrez que la pile 1. La pile 2 attend une occasion clinique réelle.",
      "Une fois par mois, relisez la pile 4 : ce que vous jetez systématiquement en dit long sur vos angles morts.",
    ],
    limits: [
      "Il trie sur des titres : il ne sait rien de la qualité méthodologique de ce qu'il classe en pile 1.",
      "Il ne remplace ni une revue systématique, ni une source de recommandations.",
      "Il reflète les priorités que vous avez déclarées : il renforce vos angles morts autant que vos intérêts.",
    ],
    updatedAt: "2026-09-08",
  },
  {
    slug: "recommandation-en-arbre-de-decision",
    title: "Une recommandation en arbre de décision",
    subtitle:
      "De « quarante pages de texte » à « un arbre de questions fermées, sourcé page par page, avec ce qu'il ne tranche pas ».",
    categorie: "enseignement",
    outils: ["claude", "chatgpt", "notebooklm"],
    niveau: "avance",
    ordre: 1,
    intro:
      "Une recommandation est écrite pour être défendable, pas pour être appliquée en douze minutes de consultation. Ce prompt la réorganise sans l'interpréter : chaque nœud porte sa page source, et la section A liste les situations où le texte s'arrête — c'est-à-dire là où vous décidez seul.",
    body: P_ARBRE_DECISION,
    variables: [
      {
        champ: "[collez le passage de la recommandation]",
        aide: "Un passage, pas le document entier : un arbre par question clinique. Gardez la pagination, elle sert au sourçage.",
      },
      {
        champ: "[la situation clinique qui déclenche l'arbre]",
        aide: "Le point d'entrée, formulé comme il se présenterait en consultation.",
      },
    ],
    howTo: [
      "Travaillez passage par passage, jamais document entier : un arbre illisible ne sert personne.",
      "Vérifiez trois nœuds au hasard contre le texte source avant de vous servir du reste.",
      "Lisez la section A (ce que le texte ne tranche pas) avant l'arbre lui-même.",
      "Si l'outil signale une contradiction entre le texte et ce qu'il sait, ne tranchez pas : le texte fait foi, et la contradiction se vérifie ailleurs.",
    ],
    limits: [
      "Un arbre binaire simplifie une recommandation nuancée. La section C dit ce qui a été perdu — elle se lit.",
      "Il ne vaut que pour la version du texte que vous avez collée : une mise à jour de la recommandation le périme.",
      "Il n'a aucune valeur opposable : ce n'est pas un protocole validé, c'est un support de lecture et d'enseignement.",
    ],
    updatedAt: "2026-09-08",
  },
  {
    slug: "cas-clinique-pour-enseigner",
    title: "Le cas clinique sur mesure",
    subtitle:
      "De « je reprends le cas de l'an dernier » à « un cas fictif en trois temps, construit autour du piège que je veux tendre ».",
    categorie: "enseignement",
    outils: ["chatgpt", "claude", "gemini"],
    niveau: "intermediaire",
    ordre: 2,
    intro:
      "Un bon cas d'enseignement n'est pas un cas réel anonymisé : c'est un cas construit autour d'une erreur précise qu'on veut faire commettre. Ce prompt part du piège et remonte vers le cas, en trois temps, avec les réponses attendues et ce qui est faux dans la réponse la plus fréquente.",
    body: P_CAS_CLINIQUE,
    variables: [
      {
        champ: "[l'erreur classique que le cas doit faire commettre]",
        aide: "Le cœur du prompt. Sans piège désigné, vous obtiendrez un cas plat que tout le monde résout.",
      },
      {
        champ: "[la seule chose qu'ils doivent avoir comprise à la fin]",
        aide: "Une seule. Un cas qui enseigne trois points n'en enseigne aucun.",
      },
    ],
    howTo: [
      "Nommez le piège avant tout le reste : c'est lui qui structure le cas.",
      "Relisez la cohérence clinique de bout en bout — constantes, chronologie, résultats. C'est là que les cas générés déraillent.",
      "Vérifiez les scores et les seuils cités : le prompt demande leur source, contrôlez-la.",
      "Gardez la variante difficile sous le coude, pour le groupe qui va trop vite.",
    ],
    limits: [
      "Le cas est fictif et doit le rester : ne partez jamais d'un dossier réel, même anonymisé.",
      "La plausibilité clinique n'est pas garantie — c'est à vous de valider avant de l'utiliser devant un groupe.",
      "Les réponses attendues sont un point de départ pédagogique, pas une référence à distribuer telle quelle.",
    ],
    updatedAt: "2026-09-08",
  },
  {
    slug: "trier-la-messagerie-du-cabinet",
    title: "Le tri de la messagerie du cabinet",
    subtitle:
      "De « trente messages à dépiler entre deux patients » à « la liste des urgents en tête, et des brouillons pour le reste ».",
    categorie: "cabinet",
    outils: ["chatgpt", "claude"],
    niveau: "intermediaire",
    ordre: 1,
    intro:
      "C'est le seul prompt de cette banque où l'erreur n'est pas symétrique : classer trop haut coûte trois minutes, classer trop bas coûte autre chose. La règle de prudence est donc écrite dans le prompt lui-même, et l'outil ne rédige jamais de réponse pour les messages urgents.",
    body: P_TRI_MESSAGERIE,
    variables: [
      {
        champ: "[collez les messages]",
        aide: "Séparés par une ligne « --- ». Retirez les noms : le tri fonctionne aussi bien sans.",
      },
      {
        champ: "[vos critères]",
        aide: "Vos règles de cabinet, écrites une fois pour toutes puis recollées à chaque tri.",
      },
    ],
    howTo: [
      "Écrivez vos règles de cabinet une fois, gardez-les dans un fichier, recollez-les à chaque session.",
      "Lisez la liste des A avant tout le reste — le prompt la recopie exprès en tête de réponse.",
      "Relisez chaque brouillon de C avant envoi : trois lignes se relisent en dix secondes.",
      "Repassez sur les B vous-même. Le prompt ne les rédige pas, et c'est voulu.",
    ],
    limits: [
      "Il ne fait aucun tri médical : il repère des formulations, pas des états cliniques.",
      "Un message anodin peut cacher une urgence que le texte ne dit pas. Le classement en A par défaut ne compense pas tout.",
      "La messagerie patient relève de vos obligations de confidentialité : rien n'en sort sans avoir été dépersonnalisé.",
    ],
    updatedAt: "2026-09-08",
  },
];

/** L'ordre d'affichage : catégorie par catégorie, du socle au plus spécialisé. */
const ORDRE_CATEGORIES: PromptCategorie[] = [
  "socle",
  "consultation",
  "redaction",
  "patient",
  "veille",
  "enseignement",
  "cabinet",
];

export const PROMPTS_TRIES = [...PROMPTS].sort((a, b) => {
  const parCategorie =
    ORDRE_CATEGORIES.indexOf(a.categorie) - ORDRE_CATEGORIES.indexOf(b.categorie);
  return parCategorie !== 0 ? parCategorie : a.ordre - b.ordre;
});

export function getPrompt(slug: string): Prompt | undefined {
  return PROMPTS.find((p) => p.slug === slug);
}

/** Les catégories réellement peuplées, dans l'ordre du parcours. */
export function categoriesDisponibles(): PromptCategorie[] {
  const vues = new Set(PROMPTS.map((p) => p.categorie));
  return ORDRE_CATEGORIES.filter((c) => vues.has(c));
}

/** Les autres prompts de la même catégorie, pour le bas de fiche. */
export function promptsVoisins(slug: string, max = 3): Prompt[] {
  const prompt = getPrompt(slug);
  if (!prompt) return [];
  return PROMPTS_TRIES.filter((p) => p.slug !== slug && p.categorie === prompt.categorie).slice(
    0,
    max,
  );
}

export function formatDateFr(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
