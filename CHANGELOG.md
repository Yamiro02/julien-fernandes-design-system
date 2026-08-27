# Journal des versions

Ce fichier est **celui du projet que vous fabriquez**, pas celui du squelette. Il démarre
vide exprès : l'historique d'un autre design system n'apprend rien sur le vôtre.

La procédure de version est dans [`GOVERNANCE.md`](GOVERNANCE.md), et `node check-version.mjs`
vérifie que la version de `package.json`, la ligne d'installation du README et le tag git
concordent.

---

## 0.5.1 — le paquet typecheck sous React 19

Correctif de typage, sans changement de rendu ni d'API.

**Le défaut**

Les 37 composants annotaient leur retour `JSX.Element` **sans qualifier le namespace**.
`@types/react@18` déclare un `JSX` **global**, si bien que le typecheck passait ici — mais
React 19 a retiré ce global (il vit désormais sous `React.JSX`). Les `.d.ts` publiés
portaient donc une référence à un namespace qui n'existe pas chez le consommateur : toute
app en React 19 échouait au `tsc -b` avec 40 `TS2503: Cannot find namespace 'JSX'`.

Le piège était silencieux dans les deux sens : le dépôt du design system typecheckait
(il est en React 18) et le build Vite d'une app passait quand même (esbuild ne lit pas les
types). Seul `npm run build` cassait — donc en général sur le serveur de CI, jamais en local.

**Le correctif**

`JSX` est désormais **importé depuis `react`** dans chaque composant qui l'annote. Ce
namespace est exporté par le module `react` en **18.3 comme en 19** : le paquet reste
compatible avec les deux, et ne dépend plus d'un global.

## 0.5.0 — marque Julien Fernandes portée, surfaces corrigées, paquet installable

La marque Julien Fernandes est portée sur le squelette, et le paquet devient réellement
consommable par une app. Reprend la lignée de travail 0.2.0 → 0.4.2 (ci-dessous) que le
passage au squelette avait effacée du journal.

**⚠ Ruptures**

- Préfixe de classes `.jf-*` → `.ds-*`.
- `tokens/colors.css` disparaît : la couleur vit dans `brand-julien-fernandes.css`, monté
  par un second `@import` à côté de `core.css`.
- `exports` : `./brand-example.css` (mort) remplacé par `./brand-julien-fernandes.css` —
  `@import "@julienfernandes/ds/brand-julien-fernandes.css"` fonctionne désormais.

**La marque**

- Portage complet : 54 jetons obligatoires, 32 redéclarés en `.dark`, 3 jetons métier,
  12 écarts d'accessibilité assumés par écrit.
- `--surface-alt` introduit — 15 sites : survols, rail de progression, point haut du shimmer.
- Effondrement des surfaces sombres corrigé (6 valeurs) : l'échelle
  `page → muted → card → popover → surface-alt → secondary` est rétablie.
- `--popover` clair : `#fdfbf8` — flotte au-dessus de la carte (1,035), reste sous
  `--secondary` (1,033), pas de blanc pur en surface flottante.

**Le socle (règles `patterns.css`)**

- Un champ (`Input`, `Textarea`, `Select`, déclencheur de `DatePicker`) DÉDUIT sa surface
  porteuse dans une carte, une modale, une feuille, un dropdown ou un datepicker — la prop
  `surface="card"` devient une échappatoire, plus une obligation. Même geste pour `Tabs`
  dans une carte (`onCard` devient une échappatoire).
- Onglet actif en thème sombre : il monte AU-DESSUS de sa barre (mélange encre/remplissage)
  au lieu de se creuser en `--background`.
- Item de navigation actif (`Sidebar`, `Navbar`) : la sélection se signale par la graisse
  et l'icône (`--primary-readable`), plus par un libellé entier en orange — l'accent est
  rationné.

**L'outillage**

- `check-surfaces.mjs` : l'échelle des surfaces est mesurée à chaque lint, tout écart sous
  seuil exige un `@surface-assume` écrit.
- `npm run lint` agrège désormais les huit gardes : version, contrat, collisions,
  substitution, contraste, surfaces, catalogue, littéraux.

---

## 0.2.0 → 0.4.2 — la lignée de travail avant le squelette

Cinq prompts de mise au propre (cohérence doc & outillage · deux bugs bloquants du socle et
palier typographique manquant · mise en page sortie du JSX et échelle de z-index · états
manquants de la vitrine · catalogue d'usage réécrit + garde `check-catalogue`), puis le
portage de la marque et le correctif d'effondrement des surfaces (0.4.2). Les
spécifications détaillées de ces lots (`MISE-A-JOUR-v4.x.md`) vivent hors du dépôt ;
l'historique git en garde la trace commit par commit.

---

## 0.1.0 — squelette

Point de départ : 37 composants, 9 pages de vitrine, le contrat de marque, les sept scripts
de contrôle (`check-contract`, `check-contrast`, `check-dark-substitution`,
`check-utility-collisions`, `check-literals`, `check-version`, `check-catalogue`) —
`npm run lint` en agrège une partie avec le typecheck — et une marque d'exemple à remplacer.
