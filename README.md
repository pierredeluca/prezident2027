# Le Grand Écart

Fiction satirique jouable dans le navigateur, dans l'esprit d'un point-and-click à la première personne. Le chapitre I se passe dans la nuit du 13 octobre 2026, cinq mois avant le premier tour de la présidentielle. Le joueur entre dans les loges d'un plateau de télévision fictif et relève, crayon rouge en main, les phrases publiques qui ont changé de sens.

David Lisnard est traité à part : le jeu se moque de son tic pédagogique, pas de sa ligne. Les autres candidats du chapitre sont montrés en train de composer avec le format. Aucune fiche n'invente un délit, une enveloppe ou une vie privée. Le carnet sépare, pour chaque nom, ce qui est documenté et ce que la scène grossit.

## Lancer le jeu

Il faut Node.js 20 ou plus récent.

```bash
npm install
npm run dev
```

Le serveur de développement affiche une adresse locale. Le jeu tient sur un téléphone : les zones se touchent, l'inventaire défile, les verbes restent accessibles.

```bash
npm test
npm run build
npm run preview
```

`npm run build` vérifie les types, puis écrit le site statique dans `dist/`. Les chemins sont relatifs (`base: "./"`), donc le dossier peut être servi tel quel, y compris dans un sous-répertoire.

## Déployer

N'importe quel hébergement de fichiers statiques convient : GitHub Pages, Netlify, un bucket, un simple `nginx`. On publie le contenu de `dist/`, pas les sources.

Exemple Netlify : commande de build `npm run build`, dossier publié `dist`.

La partie est enregistrée dans le `localStorage` du navigateur, sous la clé `le-grand-ecart-v1`. Il n'y a pas de serveur, pas de compte, pas de base. Effacer les données du site efface la nuit en cours. Le bouton Recommencer fait la même chose.

## Publicité

Les emplacements sont prévus et **désactivés par défaut** : pas de bannière, pas de passage entre les scènes, pas de script AdSense.

Pour les réserver :

```bash
VITE_ADS_ENABLED=true
VITE_ADSENSE_CLIENT=ca-pub-xxxxxxxx
VITE_ADSENSE_BANNER_SLOT=
VITE_ADSENSE_INTERSTITIAL_SLOT=
```

Voir `.env.example`. Le script AdSense n'est injecté que si la publicité est activée, qu'un identifiant client est présent, et que l'on n'est pas en aperçu.

L'adresse `?ads=preview` montre la bannière et l'interstitiel entre deux scènes, sans rien charger chez Google. Utile pour vérifier la place.

Avant d'activer de vraies annonces pour un public européen, il faut un bandeau de consentement. Ce dépôt ne le fournit pas.

## Ajouter un chapitre

Le jeu est piloté par des données. Le registre est `src/content/registry.ts`. Le chapitre I est décrit par trois fichiers :

- `src/content/chapitre1/scenes.ts` : lieux, zones cliquables, objets, portes
- `src/content/chapitre1/dialogues.ts` : répliques et choix
- `src/content/chapitre1/records.ts` : objets, fiches du carnet, fins, sources

Pour un chapitre II :

1. Copier le dossier `src/content/chapitre1` vers `src/content/chapitre2`.
2. Changer `id`, le titre, la scène de départ, les scènes et les dialogues.
3. Déposer des SVG de remplacement dans `public/art/`. Chaque scène a un champ `art` (par exemple `art/loge-philippe.svg`). Remplacer le fichier suffit : le code ne dessine pas le décor.
4. Ajouter le chapitre au tableau `chapters` de `src/content/registry.ts`.
5. Lancer `npm test`. Le test de cohérence refuse une porte vers une scène inconnue, un choix vers une réplique absente, un objet qui n'existe pas.

Une zone cliquable ressemble à ceci :

```ts
{
  id: "moniteur",
  label: "Moniteur",
  x: 16, y: 40, w: 22, h: 28,
  look: "Ce que voit le joueur.",
  lookEffects: [{ op: "flag", id: "a_vu" }],
  talk: {
    dialogueId: "philippe",
    nodeId: "p1",
    requiresAllFlags: ["a_vu"],
    blockedText: "Regardez d'abord.",
  },
}
```

Les coordonnées sont des pourcentages du cadre. Les verbes sont Regarder, Prendre, Parler, Utiliser, Aller. Un dialogue est une liste de nœuds : soit des `choices`, soit un `next`, pas les deux. Les effets (`flag`, `give`, `journal`, `goto`, `ending`) sont déclarés sur le choix, pas dans le moteur.

Les trois fins du chapitre I sont `ennui`, `prime` et `mention`. Une fin s'obtient par un effet `ending`, puis un `goto` vers la scène `epilogue`.

## Règle d'écriture

Les noms publics sont permis. On s'en tient à des fonctions, des programmes, des déclarations datées. On exagère le décalage, on ne fabrique pas un crime, une corruption pénale, un fait privé. On ne se moque d'aucun culte, d'aucune origine, d'aucun groupe. La fiche du carnet doit pouvoir montrer la source. L'avertissement « Œuvre de fiction satirique… » reste à l'écran titre et dans le pied de page : les constantes sont dans `src/content/disclaimer.ts`.

Les collaborateurs de campagne, la productrice Solène Marchand, l'accueil et le journal *Le Compte-Rendu* sont inventés. Les visages sont le même mannequin pour tout le monde : le jeu ne caricature pas un corps.

## Contrôles

Toucher un endroit affiche sa description et, s'il y a lieu, Parler, Prendre, Entrer ou Appeler. On peut aussi armer un verbe puis toucher. Au clavier : 1 regarder, 2 prendre, 3 parler, 4 utiliser, 5 aller. Le crayon rouge, une fois sélectionné, sert sur la fiche de la loge, après l'entretien. Quatre fiches ouvrent la régie. La visio de Cannes se classe à part.
