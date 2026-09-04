# ColorMatch Pro

Jeu de précision chromatique, jouable directement dans un navigateur.

## Lancer le jeu

Aucune installation n'est nécessaire :

1. Télécharge ou clone le dépôt.
2. Ouvre `index.html` dans un navigateur.

Pour GitHub Pages, active **Settings → Pages → Deploy from a branch**, puis choisis la branche contenant `index.html`.

## Fonctionnalités

- Modes Classique, Chrono, Défi du jour et Blind.
- Défis de couleur : exact, chaud, froid, pastel et contraste.
- Missions quotidiennes et hebdomadaires.
- Combos, XP, niveaux, vies, pièces, succès et skins.
- Historique local des scores.
- Défis entre amis partageables par code.
- Thèmes visuels et partage du meilleur score.
- Sauvegarde automatique dans `localStorage`.

## Structure

```text
index.html       Interface et écrans
scripts/styles.css  Styles et thèmes
scripts/app.js     Logique du jeu et sauvegarde locale
```

Les achats et les connexions sociales sont des simulations côté navigateur. Une version production devra utiliser un serveur, une authentification réelle et un prestataire de paiement.
