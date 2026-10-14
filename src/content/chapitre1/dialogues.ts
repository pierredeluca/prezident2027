import type { DialogueNode } from "../../engine/types";

const flag = (id: string) => ({ op: "flag" as const, id });
const unflag = (id: string) => ({ op: "unflag" as const, id });

export const dialogues: Record<string, DialogueNode[]> = {
  jeanne: [
    {
      id: "j1",
      speaker: "Jeanne Alcide",
      text: "Vous êtes en avance, ce qui, dans ce métier, est une forme de suspicion. Asseyez-vous. Demain, Plateau 7 enregistre « Cinq mois ». Cinq mois avant le premier tour. Ils m'ont demandé quelqu'un qui sache lire une phrase jusqu'au bout.",
      choices: [
        { label: "Vous voulez un article.", goto: "j-article" },
        { label: "Vous voulez un surveillant de plateau.", goto: "j-plateau" },
      ],
    },
    {
      id: "j-article",
      speaker: "Jeanne Alcide",
      text: "Je veux les deux, et je sais que c'est déjà un écart. L'article paraîtra si vous revenez avec autre chose que des éléments de langage. Le plateau, lui, vous laissera entrer parce que je leur ai dit que vous harmonisiez.",
      next: "j-consigne",
    },
    {
      id: "j-plateau",
      speaker: "Jeanne Alcide",
      text: "C'est le mot qu'ils emploient. Harmoniser. Comme si une conviction était une nappe. Vous entrez avec mon badge. Eux croient que vous travaillez pour la régie. Moi, je crois que vous travaillez pour le journal. Ne me détrompez pas trop vite.",
      next: "j-consigne",
    },
    {
      id: "j-consigne",
      speaker: "Jeanne Alcide",
      text: "Règle de la maison. On ne prête à personne un délit, une enveloppe, une vie privée. On relève uniquement ce qui a été dit en public, puis dédit, puis rangé sous le mot évolution. Vous grossissez pour que ça se voie. Vous n'inventez pas. Le crayon rouge est à ça, et le carnet séparera toujours le public de la mise en scène.",
      choices: [
        { label: "Et s'il n'y a pas d'écart ?", goto: "j-lisnard" },
        { label: "Je prends la règle, et le matériel.", goto: "j-fin" },
      ],
    },
    {
      id: "j-lisnard",
      speaker: "Jeanne Alcide",
      text: "Alors vous ne soulignez pas. Il y a une visio avec David Lisnard, depuis Cannes. La production le trouve inutilisable. Vérifiez quand même. Un homme ennuyeux n'est pas forcément un homme plié. Parfois il est seulement ennuyeux, et c'est déjà une information. On peut se moquer du tic. On n'invente pas le vice.",
      next: "j-fin",
    },
    {
      id: "j-fin",
      speaker: "Jeanne Alcide",
      text: "Le badge et le crayon sont sur le portemanteau, liés par un élastique. Quatre fiches, pas moins, sinon la régie ne vous lira pas. La tour s'appelle Plateau 7 pour ne fâcher aucune chaîne. Et on dit vous, ici, même quand on est pressé.",
      choices: [
        {
          label: "J'y vais.",
          effects: [flag("briefed"), flag("has_carnet")],
        },
      ],
    },
  ],
  pascal: [
    {
      id: "h1",
      speaker: "Pascal Grenier",
      text: "Plateau 7, on ne visite pas. On a un conducteur, des badges, et déjà trop de monde qui vient « juste vérifier un point ».",
      choices: [
        {
          label: "J'ai un badge du Compte-Rendu.",
          goto: "h-badge",
          when: { item: "badge" },
        },
        { label: "Je viens harmoniser, dixit la production.", goto: "h-harmo" },
        { label: "Je repars.", goto: "h-fin" },
      ],
    },
    {
      id: "h-badge",
      speaker: "Pascal Grenier",
      text: "Le Compte-Rendu. Jeanne Alcide pique encore ses pigistes dans les loges des autres. Le plan est sous le sous-main. Couloir du fond : six loges, une visio, une porte condamnée, la régie au bout. La régie n'ouvre qu'avec de la copie.",
      choices: [
        {
          label: "Je prends le plan.",
          effects: [{ op: "give", itemId: "plan" }, flag("plan_ok")],
        },
      ],
    },
    {
      id: "h-harmo",
      speaker: "Pascal Grenier",
      text: "Harmoniser, c'est le verbe de Solène Marchand. Montrez le badge quand même. Je collectionne les verbes, pas les promesses.",
      choices: [
        {
          label: "Voici le badge.",
          goto: "h-badge",
          when: { item: "badge" },
        },
        {
          label: "Je l'ai laissé à la rédaction.",
          goto: "h-nobadge",
          when: { missingItem: "badge" },
        },
      ],
    },
    {
      id: "h-nobadge",
      speaker: "Pascal Grenier",
      text: "Alors vous êtes un verbe sans sujet. Revenez avec un rectangle plastifié.",
    },
    {
      id: "h-fin",
      speaker: "Pascal Grenier",
      text: "Le fleuve est dehors. Il ne demande pas de badge. Lui.",
    },
  ],
  philippe: [
    {
      id: "p1",
      speaker: "Chloé Breton",
      text: "Horizons, loge 1. Édouard Philippe répète ailleurs. Moi, je répète ce qu'il ne dira pas. Vous êtes le crayon, ou vous êtes le cachet ?",
      choices: [
        { label: "Le crayon. Je viens pour Fessenheim, et pour le reste.", goto: "p-fess" },
        { label: "Le cachet. Donnez-moi la version plateau.", goto: "p-soft" },
        { label: "Montrez-moi les âges de l'homme.", goto: "p-bio" },
      ],
    },
    {
      id: "p-fess",
      speaker: "Chloé Breton",
      text: "Le moniteur n'est pas un piège. C'est un calendrier. La fermeture de Fessenheim a été décidée avant lui, et exécutée pendant qu'il était à Matignon, en 2020. Aujourd'hui le prompteur dit que le nucléaire est le pilier. Les deux phrases sont vraies. C'est pour ça qu'elles ne peuvent pas se suivre à l'antenne.",
      choices: [
        {
          label: "Donc on les sépare.",
          goto: "p-tape",
          effects: [flag("tone_sharp_philippe")],
        },
      ],
    },
    {
      id: "p-soft",
      speaker: "Chloé Breton",
      text: "Version plateau : on ne prononce pas le nom de la centrale. On dit renaissance, pilier, réindustrialisation. On ne dit pas : j'ai fait éteindre. D'ailleurs il n'a pas fait tout seul. Il a laissé s'exécuter ce qui était déjà signé, ce qui est une autre manière d'agir.",
      choices: [
        {
          label: "Le cachet a du métier.",
          goto: "p-tape",
          effects: [flag("tone_soft_philippe")],
        },
      ],
    },
    {
      id: "p-bio",
      speaker: "Chloé Breton",
      text: "Alors prenez les lignes, puisque vous aimez lire. Passé par les socialistes et les rocardiens. Lieutenant d'Alain Juppé. Premier ministre d'Emmanuel Macron. En 2021, il compare sa non-candidature à l'esquive de Mohamed Ali. Le 3 septembre 2024, il dit qu'il sera candidat. L'esquive a une fin. Ce n'est pas un scandale. C'est une chronologie.",
      choices: [{ label: "La chronologie me suffit.", goto: "p-tape" }],
    },
    {
      id: "p-tape",
      speaker: "Chloé Breton",
      text: "Solène a fait poser un adhésif sur le prompteur, au cas où le mot fermeture reviendrait. Je l'enlèverai quand vous serez parti, ou je le laisserai, selon la honte. Notez aussi qu'il est maire du Havre, réélu, et qu'il s'y est conditionné. De la constance dans le mandat local. Du génie dans le calendrier national.",
      choices: [
        { label: "Je souligne l'atome et l'esquive.", goto: "p-end" },
        {
          label: "J'écrirai évolution, si le plateau insiste.",
          goto: "p-end",
          effects: [flag("tone_soft_philippe")],
        },
      ],
    },
    {
      id: "p-end",
      speaker: "Chloé Breton",
      text: "Écrivez ce que vous voulez. Lui dira demain une phrase nette. C'est son talent, et ce n'est pas rien. Votre crayon ne le rend pas malhonnête. Il l'empêche seulement d'avoir l'air né en septembre 2024. La fiche est sur la table.",
      choices: [{ label: "Je vais à la fiche.", effects: [flag("philippe_done")] }],
    },
  ],
  attal: [
    {
      id: "a1",
      speaker: "Marc Duhamel",
      text: "Gabriel Attal répète « l'élévation » dans le couloir d'à côté, sans lever le menton. Il s'est déclaré le 22 mai, à Mur-de-Barrez. Le cœur, la France, la promesse. Le carton, là, c'est l'autre voix : la sienne, quand il était le porte-parole.",
      choices: [
        { label: "Le porte-parole n'écrivait pas le chèque.", goto: "a-fair" },
        { label: "Il a quand même tenu le pupitre.", goto: "a-sharp" },
        { label: "Et l'ardoise ?", goto: "a-ardoise" },
      ],
    },
    {
      id: "a-fair",
      speaker: "Marc Duhamel",
      text: "Exact. « Quoi qu'il en coûte », c'est le président, au printemps 2020. Attal devient porte-parole dans l'été. Il a défendu la suite, pas inventé la formule. Ensuite il a été le Premier ministre du coup de frein, début 2024. Deux pupitres, une majorité. Vous pouvez être juste, et quand même souligner.",
      next: "a-ardoise",
    },
    {
      id: "a-sharp",
      speaker: "Marc Duhamel",
      text: "Le pupitre est un acte. On ne l'occupe pas en touriste. En 2024, il annonce la rigueur que la même majorité avait renvoyée à plus tard. Ce n'est pas une enveloppe sous la table. C'est une élocution qui a changé de sens.",
      choices: [
        {
          label: "Je note le sens, pas un délit.",
          goto: "a-ardoise",
          effects: [flag("tone_sharp_attal")],
        },
      ],
    },
    {
      id: "a-ardoise",
      speaker: "Marc Duhamel",
      text: "Décembre 2023, il est à l'Éducation. Il lance le choc des savoirs et les groupes de niveau. Au printemps 2024, il est déjà à Matignon, et la rue de Grenelle, sous sa majorité, parle plutôt de groupes de besoins. Le mot a pris un cachet. L'ardoise, c'est moi qui l'ai écrite pour que vous le voyiez. Le déplacement, lui, n'est pas de moi.",
      choices: [
        { label: "Je souligne le pupitre et le cachet.", goto: "a-end" },
        { label: "Je note que le cachet n'est pas tout à fait de sa main.", goto: "a-end-doux" },
      ],
    },
    {
      id: "a-end",
      speaker: "Marc Duhamel",
      text: "Notez-le. Et notez qu'il vient du Parti socialiste, passé chez Macron en 2016, du temps où changer de famille tenait lieu de jeunesse. Il a eu plusieurs jeunesses. C'est son droit. Ce n'est pas le même discours. La fiche vous attend.",
      choices: [{ label: "À la fiche.", effects: [flag("attal_done")] }],
    },
    {
      id: "a-end-doux",
      speaker: "Marc Duhamel",
      text: "C'est honnête. Écrivez : annonce d'Attal, assouplissement de la majorité ensuite. Le carnet sera moins drôle, et plus exact. Jeanne aime les deux, dans cet ordre, hélas.",
      choices: [
        {
          label: "J'aime Jeanne, donc j'écris les deux.",
          effects: [flag("attal_done"), flag("tone_soft_attal")],
        },
      ],
    },
  ],
  melenchon: [
    {
      id: "m1",
      speaker: "Nadia Pelletier",
      text: "Il ne viendra pas en loge. Il estime que la loge est déjà une compromission. Je suis là pour le programme, et pour empêcher qu'un monteur diffuse 1992 au mauvais moment. Vous avez regardé. Alors dites-moi ce que vous en faites.",
      choices: [
        { label: "En 1992, le sénateur disait oui à Maastricht.", goto: "m-maas" },
        { label: "Le 3 mai 2026, il a dit oui à une quatrième fois.", goto: "m-quatre" },
        { label: "Qu'est-ce qui, chez lui, n'a pas bougé ?", goto: "m-soixante" },
      ],
    },
    {
      id: "m-maas",
      speaker: "Nadia Pelletier",
      text: "Il défendait le traité, il a parlé de nation européenne. Il a dit depuis, et ce n'est pas vous qui le faites dire, que l'homme de gauche qu'il était s'était trompé. Voilà un écart qui a l'élégance de se reconnaître. Le plateau voudrait soit le procès, soit l'amnésie. Je vous propose la date.",
      next: "m-quatre",
    },
    {
      id: "m-quatre",
      speaker: "Nadia Pelletier",
      text: "Après 2022, beaucoup ont entendu un adieu. Le 3 mai 2026, au journal de TF1, il a été candidat. Oui, je suis candidat. Quatrième fois. On peut appeler ça une trahison de la sortie, ou une obstination. Je vous demande seulement de ne pas appeler ça un complot.",
      next: "m-soixante",
    },
    {
      id: "m-soixante",
      speaker: "Nadia Pelletier",
      text: "La retraite à soixante ans est encore là, pendant que l'Europe a voyagé du oui au non. Il en est fier. Vous pouvez en sourire : tout aurait le droit de bouger, sauf ce nombre-là. C'est comique. C'est aussi un programme, pas un casier.",
      choices: [
        {
          label: "Je souligne Maastricht et le rappel de 2026.",
          goto: "m-end",
          effects: [flag("tone_sharp_melenchon")],
        },
        { label: "Je note surtout qu'il a reconnu s'être trompé.", goto: "m-end" },
      ],
    },
    {
      id: "m-end",
      speaker: "Nadia Pelletier",
      text: "Soulignez. Et quand vous écrirez, dites que la scène du moniteur est de nous, pas de lui. Lui a vraiment tenu le discours. Nous, on l'a juste laissé allumé.",
      choices: [{ label: "Le moniteur peut s'éteindre.", effects: [flag("mel_done")] }],
    },
  ],
  lepen: [
    {
      id: "l1",
      speaker: "Thomas Léger",
      text: "On ne dit plus Front, on ne dit plus sortie, on ne dit plus tout de suite. Marine Le Pen est candidate, elle l'a redit le 7 juillet. Jordan Bardella est présenté comme le Premier ministre du ticket. Moi, je range les programmes. 2017 est sur la chaise. 2022 est sur la table. 2019 est le couloir entre les deux.",
      choices: [
        { label: "En 2017, sortir de l'euro était central.", goto: "l-euro" },
        { label: "Elle a dit : pragmatiques, pas idéologues.", goto: "l-quote" },
        { label: "Le ticket, c'est déjà une institution.", goto: "l-ticket" },
      ],
    },
    {
      id: "l-euro",
      speaker: "Thomas Léger",
      text: "Central, oui. Puis, janvier 2019, l'abandon public. Elle a gardé une trappe : si, une fois d'autres souverainetés reprises et la Banque centrale réformée, l'euro restait un problème majeur, on reposerait la question. L'écart a une porte de service. C'est plus précis que de crier au reniement, et c'est déjà assez grand pour votre crayon.",
      next: "l-fin",
    },
    {
      id: "l-quote",
      speaker: "Thomas Léger",
      text: "La phrase est d'elle, au moment de l'abandon. Nous sommes des pragmatiques, nous ne sommes pas des idéologues. Vous avez le droit de la trouver drôle. Vous n'avez pas le droit d'ajouter ce que les programmes ne disent pas.",
      next: "l-fin",
    },
    {
      id: "l-ticket",
      speaker: "Thomas Léger",
      text: "Un Premier ministre désigné avant l'élection, c'est le costume de ceux qui se préparent à gouverner. Le parti de la rupture répète désormais une passation. Ce n'est pas un dossier. C'est du lissage, et le lissage se voit à l'œil nu.",
      next: "l-fin",
    },
    {
      id: "l-fin",
      speaker: "Thomas Léger",
      text: "Deux livrets. Le premier veut quitter la monnaie. Le second reste dedans et propose de la changer de l'intérieur. Entre les deux, le parti a changé de nom. Si vous écrivez seulement « elle a menti », vous aurez simplifié une simplification. Écrivez les dates.",
      choices: [{ label: "J'écris les dates.", effects: [flag("lp_done")] }],
    },
  ],
  glucksmann: [
    {
      id: "g1",
      speaker: "Léa Sandoz",
      text: "Il a gagné dimanche. Premier tour, autour des deux tiers. Place publique et le Parti socialiste ont le même candidat, et ce candidat a passé des années à bâtir une maison à côté de l'appareil. Vous tombez dans la loge du lendemain, quand il faut reparler au pays, plus seulement aux adhérents.",
      choices: [
        { label: "Il disait que sa marque est de faire ce qu'il dit.", goto: "g-marque" },
        { label: "La presse écrit qu'il voulait d'abord éviter ce scrutin.", goto: "g-eviter" },
        { label: "Que veut changer le plateau, dès lundi ?", goto: "g-plateau" },
      ],
    },
    {
      id: "g-marque",
      speaker: "Léa Sandoz",
      text: "Il l'a dit avant l'été, à propos de cette primaire : il se prononcerait à la fin de l'été, et sa marque de fabrique est de faire ce qu'il dit. Il a aussi dit qu'il ne s'imaginait pas faire campagne sans les socialistes. Les deux phrases sont vraies. Dimanche les a rendues compatibles. Votre crayon déteste les compatibilités trop propres.",
      next: "g-plateau",
    },
    {
      id: "g-eviter",
      speaker: "Léa Sandoz",
      text: "C'est la formule des journaux, le 12 octobre : un scrutin qu'il voulait initialement éviter. Notez la source. Ce n'est pas lui qui signe la phrase. C'est le récit qui s'est installé en vingt-quatre heures. Le fait, lui, est simple. Il est entré. Il a gagné. Il est le candidat.",
      next: "g-plateau",
    },
    {
      id: "g-plateau",
      speaker: "Léa Sandoz",
      text: "Le plateau veut la facture dans les vingt premières secondes. Lui voudrait encore commencer par la règle, l'Europe, la manière de gouverner sans l'alliance qu'il refuse. Les deux conducteurs sont sur le canapé. Le sien, et celui de Solène. Dimanche n'a pas éteint la négociation. Il l'a déplacée.",
      choices: [
        {
          label: "Je souligne la maison qui épouse l'appareil.",
          goto: "g-end",
          effects: [flag("tone_sharp_glucksmann")],
        },
        {
          label: "Je souligne que « éviter la primaire » est un titre, pas une citation.",
          goto: "g-end",
        },
      ],
    },
    {
      id: "g-end",
      speaker: "Léa Sandoz",
      text: "Écrivez les deux couches. C'est agaçant, et c'est pour ça que Jeanne vous envoie à la place d'un éditorialiste. Lui dira demain qu'il n'a pas changé de cap. Vérifiez le cap. Vérifiez aussi le navire.",
      choices: [{ label: "Je vérifie les deux.", effects: [flag("gl_done")] }],
    },
  ],
  retailleau: [
    {
      id: "r1",
      speaker: "Hugo Pellier",
      text: "Bruno Retailleau a été désigné par les adhérents en avril. Il s'était déclaré en février. Avant ça, il a été ministre de l'Intérieur à partir de septembre 2024, dans le gouvernement de Michel Barnier. Le même homme a passé des années à dire que ce centre gouvernait mal. Ensuite il a tenu le ministère. Ensuite il s'est mis candidat contre l'esprit du bilan.",
      choices: [
        { label: "Prendre les clés, ce n'est pas changer d'avis.", goto: "r-cles" },
        { label: "Les clés changent la longueur de la phrase.", goto: "r-phrase" },
        { label: "Je ne parlerai que des textes.", goto: "r-textes" },
      ],
    },
    {
      id: "r-cles",
      speaker: "Hugo Pellier",
      text: "C'est sa défense, et elle a du corps. Une opposition qui ne gouverne jamais finit en adjectif. Il a choisi l'exercice. L'exercice a un prix : on signe des textes là où l'on avait des formules. Le tract et la serviette ne sont pas le même genre littéraire.",
      next: "r-fin",
    },
    {
      id: "r-phrase",
      speaker: "Hugo Pellier",
      text: "La fermeté qui tient en un slogan devient, au ministère, un texte que le droit relit. Je ne vous dirai pas qu'il a trahi une population. Je n'en nommerai aucune. Je dis qu'il a changé de longueur de phrase. C'est déjà un écart, et ça reste politique.",
      choices: [
        {
          label: "Je m'en tiens à la longueur.",
          goto: "r-fin",
          effects: [flag("tone_sharp_retailleau")],
        },
      ],
    },
    {
      id: "r-textes",
      speaker: "Hugo Pellier",
      text: "Alors restez-y. Le tract est public. La fonction est publique. Pas de vie privée, pas de sous-entendu. Le grand écart, ici, est un emploi du temps : opposition, ministère, candidature. Trois vestes. Une taille.",
      next: "r-fin",
    },
    {
      id: "r-fin",
      speaker: "Hugo Pellier",
      text: "Il ne voulait pas d'une grande primaire ouverte à tout le monde. Il a été désigné chez les Républicains. Ce n'est pas le même geste que de renier une mesure. Notez-le à part, ou ne le notez pas. Le ministère, en revanche, soulignez-le. C'est l'endroit où la phrase a rencontré un tampon.",
      choices: [{ label: "Je souligne le tampon, pas les gens.", effects: [flag("re_done")] }],
    },
  ],
  lisnard: [
    {
      id: "vide",
      speaker: "David Lisnard",
      text: "Vous tombez sur une annexe, pas sur une répétition. La production m'a dit que quelqu'un passerait « donner du chaud ». Je n'ai pas de chaud. J'ai un ordre. Vous commencez par la loge qui n'a pas de plateau : c'est soit un compliment, soit une erreur de couloir.",
      next: "corps",
    },
    {
      id: "plein",
      speaker: "David Lisnard",
      text: "On me dit que votre carnet a déjà {{fiches}} traits rouges. Je ne les commenterai pas un par un. Je ne tiens pas les âmes. Je tiens une séquence : on baisse la dépense, ensuite seulement on baisse les prélèvements. Jamais l'inverse. Jamais à crédit.",
      next: "corps",
    },
    {
      id: "corps",
      speaker: "David Lisnard",
      text: "Solène Marchand, que je n'ai pas vue, a fait demander une émotion dans les vingt premières secondes. Voici la mienne. Elle est mal cadencée. La charge d'intérêts mange des budgets entiers, justice comprise. Ce n'est pas une image. C'est pour ça que je refuse la baisse d'impôt payée par l'emprunt.",
      choices: [
        { label: "On vous reproche d'avoir rendu votre carte.", goto: "carte" },
        { label: "Numérotez, puisque vous numérotez.", goto: "note" },
        { label: "Donnez-moi une version plus courte, pour le jingle.", goto: "jingle" },
      ],
    },
    {
      id: "jingle",
      speaker: "David Lisnard",
      text: "Non. Une version plus courte serait une autre politique. Si le jingle ne peut pas porter une subordonnée, le jingle mentira à ma place. Je préfère le mauvais rythme. Vous pouvez trouver ça comique. Le rythme aussi, je l'assume.",
      next: "fin-choix",
    },
    {
      id: "note",
      speaker: "David Lisnard",
      text: "Un. Baisser la dépense d'abord : de l'ordre de quatre-vingts milliards dès la première année, au moins deux cents milliards en trajectoire, une part pour désendetter. Deux. Seulement ensuite, les cotisations, puis les impôts de production. Jamais une baisse d'impôt payée à crédit. Trois. Vous pouvez vérifier. Je préfère les gens qui vérifient.",
      next: "fin-choix",
    },
    {
      id: "carte",
      speaker: "David Lisnard",
      text: "J'ai quitté Les Républicains le 1er avril 2026, le jour où je me suis déclaré. Ce n'est pas un programme qui change de sens. C'est un outil que je ne voulais plus laisser décider à ma place. Je défends toujours une primaire large, précisément parce qu'une carte n'est pas une conviction. Si vous appelez ça un écart, vous aurez un trait, et vous aurez tort sur l'essentiel.",
      next: "fin-choix",
    },
    {
      id: "fin-choix",
      speaker: "David Lisnard",
      text: "L'affiche du festival penche. Je la redresse. Voilà. Vous pouvez sourire : le geste est comique, je le sais. Le budget, non. Et avant que vous le disiez : une ville ne verse pas les retraites. L'exemple communal a cette limite. Je vous la donne, pour que vous n'ayez pas à la chercher.",
      choices: [
        {
          label: "Ce n'est pas un écart. Je le classe à part.",
          effects: [flag("lisnard_fair"), unflag("lisnard_misread"), flag("lisnard_done")],
        },
        {
          label: "La carte rendue suffit. Je le classe avec les autres.",
          effects: [flag("lisnard_misread"), unflag("lisnard_fair"), flag("lisnard_done")],
        },
      ],
    },
    {
      id: "deja",
      speaker: "David Lisnard",
      text: "Vous avez déjà votre classement. Je ne vais pas devenir plus spectaculaire en le répétant. L'affiche, en revanche, penche encore. Les affiches ont une vie propre.",
      choices: [
        {
          label: "Je corrige : ce n'est pas un écart.",
          goto: "corrige-fair",
          when: { flag: "lisnard_misread" },
        },
        {
          label: "Je veux finalement le trait rouge.",
          goto: "corrige-rouge",
          when: { flag: "lisnard_fair" },
        },
        { label: "Je vous laisse avec l'affiche.", goto: "laisse" },
      ],
    },
    {
      id: "corrige-fair",
      speaker: "David Lisnard",
      text: "Bien. Reprenez le crayon. Le premier trait ne compte plus. Une carte n'est pas une conviction, et je préfère qu'on me lise ennuyeux que faux.",
      choices: [
        {
          label: "Le trait rouge est retiré.",
          effects: [
            flag("lisnard_fair"),
            unflag("lisnard_misread"),
            unflag("stamped_lisnard"),
            { op: "forgetJournal", id: "lisnard" },
          ],
        },
      ],
    },
    {
      id: "corrige-rouge",
      speaker: "David Lisnard",
      text: "Vous insistez. Libre à vous. Ce sera votre phrase, pas la mienne. Le crayon devra repasser, puisque vous changez de couleur.",
      choices: [
        {
          label: "Je repasse le crayon.",
          effects: [
            flag("lisnard_misread"),
            unflag("lisnard_fair"),
            unflag("stamped_lisnard"),
            { op: "forgetJournal", id: "lisnard" },
          ],
        },
      ],
    },
    {
      id: "laisse",
      speaker: "David Lisnard",
      text: "Le conseil municipal n'attend pas la régie. Bonne nuit, et vérifiez vos virgules.",
    },
  ],
  solene: [
    {
      id: "s1",
      speaker: "Solène Marchand",
      text: "{{fiches}} fiches. Je comptais sur des évolutions, vous m'apportez des traits rouges. Demain, des millions de personnes n'en liront aucune. Elles entendront une phrase, puis une autre. Choisissez ce que devient la nuit.",
      choices: [
        {
          label: "On diffuse le carnet tel quel.",
          goto: "s-ennui",
          when: { minFiches: 4, flag: "lisnard_fair" },
        },
        {
          label: "On remplace écart par évolution.",
          goto: "s-prime",
          when: { minFiches: 4 },
        },
        {
          label: "On ne garde que Lisnard, comme anomalie.",
          goto: "s-mention",
          when: { flag: "lisnard_fair" },
        },
        {
          label: "On ne garde que Lisnard : même lui a bougé, j'ai le trait.",
          goto: "s-mention",
          when: { flag: "lisnard_misread" },
        },
        {
          label: "Il me manque la visio de Cannes.",
          goto: "s-manque",
          when: { missingFlags: ["lisnard_fair", "lisnard_misread"] },
        },
        { label: "Je retourne dans le couloir.", goto: "s-retour" },
      ],
    },
    {
      id: "s-manque",
      speaker: "Solène Marchand",
      text: "La visio est au fond, sous le palmier en plastique. Il ne viendra pas se faire réécrire. C'est précisément pour ça que j'hésite à le garder. Allez voir ce que ça donne, un candidat qui ne négocie pas sa chute. Ensuite seulement, on décide de la nuit.",
      choices: [{ label: "J'y vais.", goto: "s-retour" }],
    },
    {
      id: "s-ennui",
      speaker: "Solène Marchand",
      text: "Tel quel, mon émission tient neuf minutes et se termine en silence. Le silence n'a pas de bande-annonce. Jeanne, elle, en fera une page. Vous savez ce que vous faites ?",
      choices: [
        {
          label: "Oui. Le carnet part au journal.",
          effects: [
            { op: "ending", id: "ennui" },
            { op: "goto", sceneId: "epilogue" },
          ],
        },
        { label: "Montrez-moi encore les autres boutons.", goto: "s1" },
      ],
    },
    {
      id: "s-prime",
      speaker: "Solène Marchand",
      text: "Voilà. On garde les noms, on change le mot. Personne n'a menti : tout le monde a évolué. Le public aime les évolutions. Les écarts, c'est pour les gens qui relisent.",
      choices: [
        {
          label: "Passez le conducteur harmonisé.",
          effects: [
            { op: "ending", id: "prime" },
            { op: "goto", sceneId: "epilogue" },
          ],
        },
        { label: "Je relis encore.", goto: "s1" },
      ],
    },
    {
      id: "s-mention",
      speaker: "Solène Marchand",
      text: "Un seul personnage, celui qui n'entre pas dans le moule. Les autres deviennent le paysage. Lui devient le gag : le maire qui a apporté ses tableaux. C'est cruel, mais ça tient en une mention, et la mention est le format le plus honnête que la télévision s'autorise.",
      choices: [
        {
          label: "Ne gardez que lui, en mention.",
          effects: [
            { op: "ending", id: "mention" },
            { op: "goto", sceneId: "epilogue" },
          ],
        },
        {
          label: "Non : il est le sujet, pas la mention.",
          goto: "s-ennui",
          when: { flag: "lisnard_fair" },
        },
        { label: "Je ne livre pas ça.", goto: "s1" },
      ],
    },
    {
      id: "s-retour",
      speaker: "Solène Marchand",
      text: "Le couloir est à gauche. Les phrases, elles, n'ont pas bougé pendant que nous parlions. C'est bien le problème.",
    },
  ],
};
