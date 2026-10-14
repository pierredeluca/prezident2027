# Le Grand Écart

Fiction satirique. La nuit du 13 octobre 2026, on ouvre un dossier et on confronte un responsable à ses propres phrases.

Un seul dossier est jouable : **le nucléaire**. Les autres sujets sont affichés, fermés. En ajouter un, c'est un fichier de contenu, pas un nouveau moteur.

## Jouer

```bash
npm install
npm run dev
```

Puis ouvrir l'adresse indiquée par Vite.

1. Lire la mention, cliquer pour entrer.
2. Choisir **Le nucléaire**.
3. Visiter le bureau, les archives et la régie. Cliquer ce qui est encadré. Chaque preuve a une carte : ce qu'elle prouve, et sa source.
4. Avec au moins quatre preuves, la porte **FACE** de la régie ouvre la confrontation. Le nom est tiré au sort.
5. Il énonce une phrase. Choisir une preuve dans la barre du bas, puis cliquer son visage. On peut aussi faire glisser l'icône sur le visage.
6. La bonne preuve le fait reculer. Une mauvaise, ou un tract, le fait marquer. La jauge **La preuve** penche vers vous ou vers lui.
7. Quand il n'a plus rien, une phrase nette, sans fanfare : « Bien vu. Le suivant ment déjà. »
8. S'il prend le dessus, une fin courte et absurde, puis on reprend.
9. David Lisnard, s'il sort, ne ment pas sur ce dossier. Insister use les preuves.

Échap ouvre la mention. Le bouton **i** aussi. `?new=1` recommence sans la partie enregistrée.

## Vérifier

```bash
npm test
npm run build
```

## Maquettes

Les images fixes sont dans `mockups/`. Les portraits du jeu viennent des mêmes photos, recadrées et tramées, sans déformer le visage. Crédits : `mockups/CREDITS.md`.
