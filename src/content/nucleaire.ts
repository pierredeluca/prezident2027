import type { ThemeContent } from "./types";

const BFM =
  "https://www.bfmtv.com/politique/gouvernement/edouard-philippe-annonce-la-fermeture-de-la-centrale-de-fessenheim-avec-l-arret-du-premier-reacteur-le-22-fevrier_VN-202001150174.html";
const ECHOS2017 =
  "https://www.sciencesetavenir.fr/nature-environnement/nucleaire/la-fermeture-de-centrales-nucleaires-ce-sera-a-moyen-terme-promet-edouard-philippe_114728";
const GOUV = "https://www.info.gouv.fr/communique/11392-arret-du-reacteur-ndeg1-de-la-centrale-de-fessenheim";
const POLITICO =
  "https://www.politico.eu/article/energie-face-au-risque-lie-au-nucleaire-edouard-philippe-juge-les-renouvelables-utiles/";
const LESECHOS =
  "https://www.lesechos.fr/elections/presidentielle/presidentielle-marine-le-pen-voit-le-salut-de-la-france-dans-lenergie-nucleaire-1393440";
const AFP =
  "https://www.connaissancedesenergies.org/afp/eolien-nucleaire-fossiles-les-programmes-de-marine-le-pen-et-emmanuel-macron-220420";
const PROGRAMME = "https://melenchon.fr/wp-content/uploads/2022/04/programme-avenir-en-commun-abrege.pdf";
const RTE = "https://analysesetdonnees.rte-france.com/bilan-electrique-synthese";
const LISNARD = "https://www.unenouvelleenergie.fr/questions/que-propose-david-lisnard-face-a-la-dette-publique/";

/** One dossier. A new theme is another file plus a line in the registry. */
export const NUCLEAIRE: ThemeContent = {
  id: "nucleaire",
  startRoom: "bureau",
  minClues: 4,
  npcs: [
    {
      id: "marc",
      name: "Marc",
      line: "Le journal a une date. L'affiche, c'est de la pub.",
    },
    {
      id: "lea",
      name: "Léa",
      line: "Le livret bleu dit 2050. Pas demain.",
    },
  ],
  clues: [
    {
      id: "echos2017",
      decoy: false,
      kind: "paper",
      date: "12 juil 2017",
      quote: "Des centrales fermeront.",
      proves: "Il l'a dit. À moyen terme.",
      sources: [
        {
          outlet: "Sciences et Avenir",
          date: "12 juillet 2017",
          url: ECHOS2017,
          note: "Il le dit aux Echos : des centrales fermeront, à moyen terme.",
        },
      ],
    },
    {
      id: "video2020",
      decoy: false,
      kind: "video",
      still: "philippe",
      date: "15 jan 2020",
      quote: "Arrêt du premier réacteur.",
      proves: "Il fixe le jour. Le 22 février.",
      sources: [
        {
          outlet: "BFM TV",
          date: "15 janvier 2020",
          url: BFM,
          note: "Mots plus courts : l'arrêt du premier réacteur.",
        },
        {
          outlet: "info.gouv.fr",
          date: "19 février 2020",
          url: GOUV,
          note: "Publié sous son gouvernement. La promesse date d'avant.",
        },
      ],
    },
    {
      id: "clip2026",
      decoy: false,
      kind: "paper",
      date: "13 oct 2026",
      quote: "Il faut le défendre.",
      proves: "En 2026, il le défend.",
      sources: [
        {
          outlet: "POLITICO",
          date: "13 octobre 2026",
          url: POLITICO,
          note: "Il dit défendre et favoriser le nucléaire. Le risque reste réel, dit-il.",
        },
      ],
    },
    {
      id: "asn",
      decoy: false,
      kind: "paper",
      date: "22 avr 2022",
      quote: "On ne rouvre pas.",
      proves: "EDF et l'ASN disent non.",
      sources: [
        {
          outlet: "Connaissance des énergies",
          date: "22 avril 2022",
          url: AFP,
          note: "Dépêche AFP. EDF et l'ASN : rouvrir Fessenheim, non.",
        },
      ],
    },
    {
      id: "rythme",
      decoy: false,
      kind: "chart",
      date: "2022",
      quote: "2037, pas 2031. 14, pas 20.",
      proves: "Ni la date, ni le nombre.",
      sources: [
        {
          outlet: "Connaissance des énergies",
          date: "22 avril 2022",
          url: AFP,
          note: "Un audit : premier EPR2 vers 2037. RTE, cas haut : 14 EPR en 2050.",
        },
        {
          outlet: "Les Echos",
          date: "2022",
          url: LESECHOS,
          note: "Elle parle de cinq paires d'EPR dès 2031, puis d'autres.",
        },
      ],
    },
    {
      id: "programme",
      decoy: false,
      kind: "book",
      date: "avril 2022",
      quote: "2050. Et c'est un défi.",
      proves: "Pas cette nuit. Pas facile.",
      sources: [
        {
          outlet: "L'Avenir en commun",
          date: "avril 2022",
          url: PROGRAMME,
          note: "Sortie planifiée. Pas une solution d'avenir. Un défi, d'ici 2050.",
        },
      ],
    },
    {
      id: "part",
      decoy: false,
      kind: "chart",
      date: "Bilan RTE",
      quote: "Plus de la moitié.",
      proves: "Le nucléaire fait encore la majorité.",
      sources: [
        {
          outlet: "RTE",
          date: "Bilan électrique",
          url: RTE,
          note: "Le nucléaire reste la majorité de l'électricité. Pas un chiffre fragile.",
        },
      ],
    },
    {
      id: "flyer",
      decoy: true,
      kind: "flyer",
      date: "",
      quote: "Le nucléaire, notre fierté.",
      proves: "Rien. C'est une affiche.",
      sources: [],
    },
    {
      id: "slogan",
      decoy: true,
      kind: "flyer",
      date: "",
      quote: "Énergie propre pour tous.",
      proves: "Rien. C'est un slogan.",
      sources: [],
    },
  ],
  politicians: [
    {
      id: "philippe",
      name: "Philippe",
      honest: false,
      line: "",
      honestReply: "",
      concede: "J'ai annoncé l'arrêt de Fessenheim. Après, j'ai défendu le nucléaire.",
      claims: [
        {
          id: "vital",
          text: "Le nucléaire est vital.",
          right: ["echos2017", "video2020"],
          corner: "J'ai aussi parlé de fermer.",
          twist: "Cela ne répond pas.",
          source: {
            outlet: "POLITICO",
            date: "13 octobre 2026",
            url: POLITICO,
            note: "Mots simples, pas une citation. Il dit défendre et favoriser le nucléaire.",
          },
        },
        {
          id: "fermer",
          text: "Des centrales fermeront.",
          right: ["clip2026"],
          corner: "Depuis, je veux le défendre.",
          twist: "C'est bien ce que j'ai dit.",
          source: {
            outlet: "Sciences et Avenir",
            date: "12 juillet 2017",
            url: ECHOS2017,
            note: "Phrase publique : des centrales fermeront, à moyen terme.",
          },
        },
        {
          id: "date",
          text: "Arrêt le 22 février.",
          right: ["clip2026"],
          corner: "Et aujourd'hui, je le défends.",
          twist: "La date est la bonne.",
          source: {
            outlet: "BFM TV",
            date: "15 janvier 2020",
            url: BFM,
            note: "Il annonce l'arrêt du premier réacteur le 22 février.",
          },
        },
      ],
    },
    {
      id: "lepen",
      name: "Le Pen",
      honest: false,
      line: "",
      honestReply: "",
      concede: "Rouvrir Fessenheim, les experts disent non. Vingt réacteurs, pas à cette vitesse.",
      claims: [
        {
          id: "rouvre",
          text: "On rouvre Fessenheim.",
          right: ["asn"],
          corner: "Les experts disent non.",
          twist: "Cela ne ferme pas la porte.",
          source: {
            outlet: "Les Echos",
            date: "2022",
            url: LESECHOS,
            note: "Elle veut rouvrir Fessenheim le plus vite possible.",
          },
        },
        {
          id: "vingt",
          text: "Vingt réacteurs, très vite.",
          right: ["rythme"],
          corner: "Pas à cette vitesse.",
          twist: "Ce n'est pas le rythme.",
          source: {
            outlet: "Connaissance des énergies",
            date: "22 avril 2022",
            url: AFP,
            note: "Elle veut une vingtaine de réacteurs, plus vite que le chantier.",
          },
        },
        {
          id: "paires",
          text: "Cinq paires dès 2031.",
          right: ["rythme"],
          corner: "L'audit dit plus tard.",
          twist: "Ce papier ne parle pas du délai.",
          source: {
            outlet: "Les Echos",
            date: "2022",
            url: LESECHOS,
            note: "Cinq paires d'EPR en service en 2031, dans son plan.",
          },
        },
      ],
    },
    {
      id: "melenchon",
      name: "Mélenchon",
      honest: false,
      line: "",
      honestReply: "",
      concede: "La sortie est un plan long, pas un interrupteur. Et le nucléaire compte encore.",
      claims: [
        {
          id: "maintenant",
          text: "On ferme tout, maintenant.",
          right: ["programme"],
          corner: "Mon texte dit 2050.",
          twist: "Ce n'est pas le calendrier.",
          source: {
            outlet: "L'Avenir en commun",
            date: "avril 2022",
            url: PROGRAMME,
            note: "Le jeu resserre. Son texte planifie la sortie, d'ici 2050.",
          },
        },
        {
          id: "facile",
          text: "C'est facile.",
          right: ["programme"],
          corner: "J'ai écrit : un défi.",
          twist: "Cela ne parle pas du défi.",
          source: {
            outlet: "L'Avenir en commun",
            date: "avril 2022",
            url: PROGRAMME,
            note: "Il écrit que le passage au renouvelable est un défi.",
          },
        },
        {
          id: "compte",
          text: "Le nucléaire ne compte pas.",
          right: ["part"],
          corner: "Il fait encore la majorité.",
          twist: "Ce n'est pas le chiffre.",
          source: {
            outlet: "L'Avenir en commun",
            date: "avril 2022",
            url: PROGRAMME,
            note: "Il dit : pas une solution d'avenir. Le jeu va plus loin.",
          },
        },
      ],
    },
    {
      id: "lisnard",
      name: "Lisnard",
      honest: true,
      line: "D'abord, on baisse les dépenses.",
      honestReply: "Je redis la même chose. Pas de virage inventé.",
      concede: "",
      claims: [],
      source: {
        outlet: "Une nouvelle énergie",
        date: "2026",
        url: LISNARD,
        note: "Il parle des dépenses, pas d'un virage sur le nucléaire.",
      },
    },
  ],
  rooms: [
    {
      id: "bureau",
      name: "Le bureau",
      hotspots: [
        { id: "door-archives", x: 4, y: 48, w: 36, h: 100, label: "Les archives", to: "archives" },
        { id: "door-regie", x: 280, y: 48, w: 36, h: 100, label: "La régie", to: "regie" },
        { id: "spot-flyer", x: 16, y: 28, w: 40, h: 52, label: "Une affiche", clueId: "flyer" },
        { id: "spot-echos", x: 78, y: 112, w: 96, h: 36, label: "Un journal", clueId: "echos2017" },
      ],
    },
    {
      id: "archives",
      name: "Les archives",
      hotspots: [
        { id: "door-bureau", x: 4, y: 40, w: 36, h: 108, label: "Le bureau", to: "bureau" },
        { id: "spot-slogan", x: 250, y: 18, w: 60, h: 48, label: "Un slogan", clueId: "slogan" },
        { id: "spot-book", x: 48, y: 78, w: 46, h: 34, label: "Un livret", clueId: "programme" },
        { id: "spot-asn", x: 108, y: 82, w: 58, h: 30, label: "Un dossier", clueId: "asn" },
        { id: "spot-clip", x: 176, y: 80, w: 72, h: 34, label: "Une coupure", clueId: "clip2026" },
        { id: "spot-marc", x: 260, y: 88, w: 48, h: 64, label: "Marc", npcId: "marc" },
      ],
    },
    {
      id: "regie",
      name: "La régie",
      hotspots: [
        { id: "door-back", x: 4, y: 38, w: 32, h: 112, label: "Le bureau", to: "bureau" },
        { id: "door-face", x: 286, y: 38, w: 30, h: 112, label: "En face", to: "@face" },
        { id: "spot-rythme", x: 36, y: 24, w: 70, h: 52, label: "Un graphique", clueId: "rythme" },
        { id: "spot-part", x: 36, y: 84, w: 70, h: 32, label: "Un chiffre", clueId: "part" },
        { id: "spot-video", x: 118, y: 28, w: 108, h: 68, label: "Un écran", clueId: "video2020" },
        { id: "spot-lea", x: 220, y: 78, w: 40, h: 68, label: "Léa", npcId: "lea" },
      ],
    },
  ],
};
