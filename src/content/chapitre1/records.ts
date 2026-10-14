import type { Ending, Item, JournalEntry, Source } from "../../engine/types";

export const items: Item[] = [
  {
    id: "badge",
    name: "Badge",
    look: "Badge du Compte-Rendu. La photo est mauvaise, donc ressemblante. Au dos, Jeanne a écrit : harmoniser, entre guillemets, pour qu'on vous ouvre.",
  },
  {
    id: "crayon",
    name: "Crayon",
    look: "Crayon rouge, mine courte. Il ne sert qu'à souligner ce qui a déjà été dit. Jeanne a été très claire, et un peu menaçante.",
  },
  {
    id: "plan",
    name: "Plan",
    look: "Plan gras de la production. Six loges, une visio notée facultative et soulignée deux fois, une porte d'écologistes condamnée, la régie au bout.",
  },
  {
    id: "gobelet",
    name: "Gobelet",
    look: "Café de couloir. Il a le goût d'une machine qui a trop vu de directs.",
  },
];

export const philippeEntry: JournalEntry = {
  id: "philippe",
  kind: "ecart",
  candidate: "Édouard Philippe",
  title: "L'atome, puis l'esquive",
  documented:
    "Il est Premier ministre lors de l'arrêt de Fessenheim, en février puis en juin 2020 : la fermeture a été décidée avant lui, et exécutée sous son gouvernement. Son projet d'après fait du nucléaire un pilier. Le parcours public va du socialisme rocardien au soutien d'Alain Juppé, puis à Matignon sous Emmanuel Macron. En 2021 il cultive l'esquive ; le 3 septembre 2024, il déclare sa candidature.",
  fiction:
    "La loge pose un adhésif sur le mot fermeture et fait répéter « pilier ». L'accessoire est inventé. Le calendrier, non.",
  basis:
    "Arrêt des réacteurs de Fessenheim en 2020. Candidature annoncée dans Le Point le 3 septembre 2024, rappelée par Le Figaro. Esquive revendiquée sur France 2 en avril 2021.",
};

export const attalEntry: JournalEntry = {
  id: "attal",
  kind: "ecart",
  candidate: "Gabriel Attal",
  title: "Deux pupitres, un cachet",
  documented:
    "Passé du Parti socialiste à En marche en 2016. Porte-parole du gouvernement de 2020 à 2022, il porte la parole d'une majorité du « quoi qu'il en coûte » sans en être l'auteur. Ministre de l'Éducation, il annonce en décembre 2023 le choc des savoirs et les groupes de niveau ; au printemps 2024, la même majorité en assouplit le mot et l'application. Premier ministre au moment du coup de frein budgétaire, il déclare sa candidature le 22 mai 2026.",
  fiction:
    "L'ardoise effacée est un accessoire de loge. Le déplacement public du niveau vers le besoin ne l'est pas.",
  basis:
    "Choc des savoirs, décembre 2023, puis assouplissement par la même majorité au printemps 2024. Candidature du 22 mai 2026, recensée par Le Figaro.",
};

export const melenchonEntry: JournalEntry = {
  id: "melenchon",
  kind: "ecart",
  candidate: "Jean-Luc Mélenchon",
  title: "Le oui, le non, le rappel",
  documented:
    "Sénateur socialiste, il appelle à voter oui à Maastricht en 1992 et parle d'une nation européenne. Il dira plus tard que l'homme de gauche qu'il était s'était trompé, et il devient une voix de la contestation des traités. Après 2022, beaucoup entendent un adieu ; le 3 mai 2026, sur TF1, il se déclare candidat. La retraite à 60 ans, elle, reste dans le programme.",
  fiction:
    "Le moniteur qui repasse 1992 est un gag de régie. Le discours et la déclaration de 2026 sont réels.",
  basis:
    "Débats sur Maastricht, 1992. Propos rapportés par Le Point le 5 février 2021. Candidature citée par Le Figaro d'après TF1, 3 mai 2026.",
};

export const lepenEntry: JournalEntry = {
  id: "lepen",
  kind: "ecart",
  candidate: "Marine Le Pen",
  title: "La monnaie et la trappe",
  documented:
    "En 2017, la sortie de l'euro est au centre du projet. En janvier 2019, elle annonce l'abandonner et dit : « Nous sommes des pragmatiques, nous ne sommes pas des idéologues. » Elle garde une réserve : si l'euro restait un problème majeur une fois d'autres souverainetés reprises, la question pourrait revenir. En 2022, le projet reste dans la monnaie unique. En juillet 2026, elle est candidate et présente Jordan Bardella comme Premier ministre de son ticket.",
  fiction:
    "Les deux livrets posés sur les chaises sont des accessoires. L'abandon, la phrase et la trappe sont publics.",
  basis:
    "Le Point, 17 janvier 2019. Programme du RN pour les européennes de 2019. Public Sénat, avril 2022, sur le refus du Frexit. Candidature et ticket, juillet 2026.",
};

export const glucksmannEntry: JournalEntry = {
  id: "glucksmann",
  kind: "ecart",
  candidate: "Raphaël Glucksmann",
  title: "Le navire et le cap",
  documented:
    "Cofondateur de Place publique, il a construit sa maison à côté du Parti socialiste. À l'été 2026, il dit que sa marque est de faire ce qu'il dit, qu'il tranchera en fin d'été, et qu'il ne s'imagine pas faire campagne sans les socialistes. Le 11 octobre 2026, il gagne au premier tour la primaire commune, autour de 66 %. Des comptes rendus du lendemain parlent d'un scrutin qu'il voulait d'abord éviter : c'est une formule de presse, pas une citation.",
  fiction:
    "Les deux conducteurs du canapé, l'un ouvert sur l'Europe et l'autre sur la facture, sont une pression de plateau inventée pour la nuit.",
  basis:
    "Entretien à La Tribune Dimanche, été 2026. Victoire du 11 octobre 2026 rapportée notamment par Sud Ouest et franceinfo.",
};

export const retailleauEntry: JournalEntry = {
  id: "retailleau",
  kind: "ecart",
  candidate: "Bruno Retailleau",
  title: "La formule et le tampon",
  documented:
    "Figure de l'opposition de droite à la majorité présidentielle, il devient ministre de l'Intérieur dans le gouvernement de Michel Barnier en septembre 2024. Il se déclare candidat le 12 février 2026 et il est désigné par les adhérents des Républicains le 19 avril 2026. Il ne voulait pas d'une primaire ouverte à toute la droite.",
  fiction:
    "Les deux vestes sur la chaise sont un gag. Le passage de l'opposition au ministère, puis à la candidature, est un emploi du temps public.",
  basis:
    "Entrée au gouvernement Barnier en septembre 2024. Déclaration du 12 février 2026 et désignation du 19 avril 2026, recensées par Le Figaro.",
};

export const lisnardFair: JournalEntry = {
  id: "lisnard",
  kind: "note",
  candidate: "David Lisnard",
  title: "Dire non, dans le bon ordre",
  documented:
    "Candidat déclaré le 1er avril 2026, il quitte Les Républicains le même jour et continue de défendre une primaire de la droite. Son projet public garde un ordre fixe : baisser la dépense d'abord, de l'ordre de 80 milliards dès la première année et d'au moins 200 milliards en trajectoire, ne pas financer une baisse d'impôt par la dette, puis alléger cotisations et impôts de production. Il renvoie à sa gestion cannoise, avec la limite qu'il formule lui-même : une ville ne verse pas les pensions.",
  fiction:
    "La visio, l'affiche qui penche et le jingle refusé sont joués. Le refus d'inverser l'ordre dépense puis impôt est répété dans sa campagne réelle. Le crayon reste bleu.",
  basis:
    "Le Figaro, candidature et départ de LR le 1er avril 2026. Projet de dépense et de prélèvements publié par Nouvelle Énergie.",
};

export const lisnardForced: JournalEntry = {
  id: "lisnard",
  kind: "note",
  candidate: "David Lisnard",
  title: "Trait forcé",
  documented:
    "Le départ des Républicains, le 1er avril 2026, est public. Le projet sur la dépense et l'impôt, lui, garde le même ordre qu'avant la déclaration : d'abord baisser la dépense, jamais une baisse d'impôt à crédit.",
  fiction:
    "Vous avez quand même sorti le crayon rouge, parce que la nuit pousse à remplir les cases. La carte n'était pas le programme.",
  basis:
    "Le Figaro, 1er avril 2026. Ordre dépense puis impôt, publié par Nouvelle Énergie.",
};

export const endings: Record<string, Ending> = {
  ennui: {
    title: "L'ennui",
    paragraphs: [
      "Solène Marchand éteint le conducteur d'un doigt. Elle ne crie pas. Les gens qui fabriquent de l'audience n'ont pas besoin de crier pour vous apprendre que vous venez de leur en retirer.",
      "Vous envoyez le carnet à Jeanne avant le dernier métro. Elle le lit comme une note de frais : ligne à ligne, sans vous féliciter d'avoir eu une âme. Au matin, Le Compte-Rendu publie une page que personne n'appellera virale. Des écarts, autant que votre patience en a soulignés, et une note à part.",
      "La note dit que David Lisnard n'a pas inversé sa phrase pour entrer dans le format. Elle dit aussi qu'il redresse les affiches et qu'il numérote, parce qu'une satire qui épargne tout ne satire plus. Dans la journée, il fait transmettre une correction de virgule sur un ordre de grandeur. Pas de remerciement. Les remerciements, précise la correction, ne sont pas une politique publique.",
      "L'émission a lieu quand même, lissée par d'autres. Vous la regardez sans le son, ce qui est une façon polie de la comprendre. Votre crayon est plus court. Votre article est trop long. Jeanne le garde en une, en bas, là où les gens qui lisent encore finissent par arriver.",
      "Vous n'avez converti personne. Vous avez empêché une nuit de se raconter comme une évidence.",
    ],
  },
  prime: {
    title: "Le prime",
    paragraphs: [
      "Vous dites le mot évolution à chaque fois que le carnet disait écart. Solène sourit pour de vrai, ce qui est rare dans une régie, et un peu triste ensuite, ce qui est plus fréquent.",
      "Le lendemain, l'émission est nette. Personne ne trébuche. Les anciens programmes ont le statut des photos de classe : on admet qu'elles existent, on ne les projette pas. Le public entend des gens qui ont mûri. Mûrir est un verbe excellent. Il n'oblige pas à dire dans quel sens.",
      "Jeanne ne publie pas votre page. Elle vous écrit : « Tu as choisi le conducteur. Le conducteur paie mieux, et il oublie mieux. » Elle a raison sur les deux points. Heure Limite vous propose un cachet pour le débat d'après. Dans le taxi, vous faites semblant d'y réfléchir, ce qui est déjà une forme d'écart, la vôtre.",
      "Sur le quai, un écran muet montre un candidat très sincère dire une phrase très récente. Vous savez d'où elle vient. Vous rangez le crayon dans une poche intérieure, comme un objet qu'on n'a pas le droit de jeter et plus le droit d'utiliser.",
    ],
  },
  mention: {
    title: "La mention",
    paragraphs: [
      "Solène garde tout votre travail, puis elle n'en garde qu'une ligne. Les autres deviennent le décor, c'est-à-dire des évolutions. David Lisnard devient le personnage : le maire qui a apporté ses annexes, le seul qui n'a pas voulu de jingle, donc le gag du conducteur.",
      "C'est efficace. Un plateau a besoin d'un grain de réel, à condition que le réel tienne en une mention. On rira un peu de lui, jamais de la dette. La dette n'a pas de timing.",
      "Vous assistez au montage. On coupe le moment où il dit qu'une ville ne verse pas les retraites. On garde le moment où il redresse l'affiche. L'affiche est plus télégénique que la limite de l'exemple communal. Vous le saviez en entrant. Vous le signez en sortant.",
      "Jeanne lit la mention et vous la renvoie sans commentaire, ce qui est un commentaire. Dans le carnet, la note est toujours là, intacte, inutile. Vous avez trouvé l'homme qui ne pliait pas, et vous l'avez plié au format. Le format vous remercie. Lui, non. Il n'a probablement pas regardé.",
    ],
    extraIfMisread: [
      "Votre trait rouge sur sa carte de parti a servi de caution. Vous le savez. La carte n'était pas le programme. Elle a suffi à la blague.",
    ],
  },
};

export const sources: Source[] = [
  {
    title: "Le champ des candidatures, au printemps et à l'été 2026",
    detail:
      "Déclarations recensées de David Lisnard (1er avril 2026), Bruno Retailleau (12 février, désignation LR le 19 avril), Gabriel Attal (22 mai), Jean-Luc Mélenchon (3 mai), Édouard Philippe (3 septembre 2024) et Marine Le Pen (7 juillet 2026).",
    url: "https://www.lefigaro.fr/politique/presidentielle-2027-qui-sont-les-candidats-potentiels-et-declares-20260423",
  },
  {
    title: "Maastricht, puis l'aveu",
    detail:
      "Jean-Luc Mélenchon, alors sénateur socialiste, défend le oui en 1992. Le Point raconte ensuite la rupture, et rapporte qu'il juge s'être trompé.",
    url: "https://www.lepoint.fr/politique/melenchon-l-europe-et-la-mitterrandie-une-histoire-de-ruptures-05-02-2021-2412787_20.php",
  },
  {
    title: "La sortie de l'euro quitte le programme",
    detail:
      "En janvier 2019, Marine Le Pen abandonne publiquement la sortie de l'euro, avec une réserve si le problème demeurait. Le projet de 2022 reste dans la monnaie unique.",
    url: "https://www.lepoint.fr/politique/rassemblement-national-la-sortie-de-l-euro-n-est-plus-au-programme-17-01-2019-2286643_20.php",
  },
  {
    title: "L'esquive, puis la candidature d'Édouard Philippe",
    detail:
      "En avril 2021, il compare son silence à l'esquive. Le 3 septembre 2024, il dit qu'il sera candidat. Fessenheim est arrêté en 2020, pendant son mandat à Matignon.",
    url: "https://www.lavoixdunord.fr/976020/article/2021-04-05/edouard-philippe-sort-un-livre-sur-matignon-mais-esquive-le-sujet-de-la",
  },
  {
    title: "Place publique, puis la primaire",
    detail:
      "Raphaël Glucksmann dit à l'été 2026 que sa marque est de faire ce qu'il dit, et qu'il ne s'imagine pas faire campagne sans les socialistes. Il gagne la primaire le 11 octobre 2026, autour de 66 %.",
    url: "https://www.sudouest.fr/politique/primaire-de-la-gauche-sociale-democrate-raphael-glucksmann-elu-candidat-a-la-presidentielle-des-le-premier-tour-31025227.php",
  },
  {
    title: "L'ordre de David Lisnard",
    detail:
      "Nouvelle Énergie publie la séquence qu'il répète : baisser la dépense d'abord, ne pas baisser l'impôt à crédit, puis les prélèvements. La gestion cannoise est son exemple, avec les limites d'une commune.",
    url: "https://www.unenouvelleenergie.fr/questions/que-propose-david-lisnard-face-a-la-dette-publique/",
  },
];
