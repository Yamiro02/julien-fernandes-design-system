# Journal des versions

Ce fichier est **celui du projet que vous fabriquez**, pas celui du squelette. Il démarre
vide exprès : l'historique d'un autre design system n'apprend rien sur le vôtre.

La procédure de version est dans [`GOVERNANCE.md`](GOVERNANCE.md), et `node check-version.mjs`
vérifie que la version de `package.json`, la ligne d'installation du README et le tag git
concordent.

---

---

---

---

## 0.5.5 — `app-scale.css` ne retouche plus aucun palier typographique

La 0.5.4 faisait descendre dans le socle un grossissement de trois paliers de métadonnée
au-delà de 2400 px. **Le bon endroit, mais la mauvaise règle.**

Tout étant en `rem`, changer la racine suffit : l'interface entière suit. Retoucher trois
paliers par bande revenait à dire que le facteur d'échelle ne fait pas son travail — et à
réintroduire, palier par palier, exactement le responsive que le `rem` sert à éviter.

Le réglage venait d'un constat fait **à l'œil, sur un 30 pouces, avec une autre app et un
autre design system**, jamais revérifié depuis. Une règle de système ne se fonde pas sur une
observation qu'on ne peut plus reproduire.

**Ce qui reste, et qui est légitime : le seuil mobile à 64 rem.** Il répond à des contraintes
que le `rem` ne peut pas résoudre — la largeur physique d'un écran et la taille d'un doigt.
Un titre de 40 px sur un téléphone de 390 px passe à la ligne quatre fois quelle que soit la
racine. C'est le même seuil que celui de l'`ActionSheet`, de la `Modal` en feuille du bas, du
scrim de l'`AppShell` et des cibles tactiles à 44 px : une seule décision, cinq endroits
cohérents.

`app-scale.css` ne contient donc plus que ses quatre bandes de zoom. Si un palier paraît un
jour réellement trop discret sur un très grand écran, il se corrigera ici — sur une
observation reproductible.

## 0.5.4 — le grossissement typographique de la bande haute rentre dans le socle

`app-scale.css` crée quatre paliers de zoom, dont une bande au-delà de 2400 px. Trois
paliers de **métadonnée** — `eyebrow`, `subheading`, `caption` — y grossissent d'un cran :
un facteur d'échelle global les laisse proportionnellement trop discrets sur un très grand
écran, là où le corps de texte, lui, est déjà à la bonne taille.

**Ce réglage vivait dans le CSS d'une app.** C'était une erreur de couche : redéfinir
`--text-caption` depuis l'app, c'est modifier le design system par la cascade au lieu de le
modifier par son fichier — même violation de la règle « le DS est en lecture seule », avec
un détour de plus. Une app **déclare** des jetons sous des noms qui lui appartiennent ; elle
n'en **redéfinit** jamais un qui existe déjà ici.

Et c'est dans `app-scale.css`, pas dans `tokens/typography.css`, parce que le grossissement
est la **conséquence** de la bande que ce fichier crée. Les séparer laisserait une app
importer le zoom sans sa contrepartie : une interface agrandie dont les plus petits paliers
seraient restés en arrière.

**Ne bougent pas, délibérément** : `body`, `body-lg`, `control`, `heading`, `heading-xl`.
Interligne et interlettrage ne sont pas redéclarés — sans unité ou en `em`, ils suivent la
taille d'eux-mêmes.

Aucun changement pour une app qui n'importe pas `app-scale.css` : il reste opt-in.

## 0.5.3 — le paquet se construit avec lucide v1

`Icon` importait `Github` de lucide-react, et `brand-content` importait `Youtube` et
`Instagram`. **lucide-react a retiré toutes ses icônes de marque en v1** — décision
juridique, pas régression : ces logos sont des marques déposées.

Ces imports étant au niveau du **module**, le bundle du paquet cassait chez toute app en
lucide v1, y compris une app qui ne s'en sert jamais :
`MISSING_EXPORT "Github" is not exported by lucide-react`. Le peer `lucide-react: ">=0.400"`
était devenu faux, et le symptôme n'apparaissait qu'au `vite build` de l'app — jamais ici,
où le dépôt est en 0.469.

**Le correctif.** Les trois tracés sont désormais écrits dans le socle
(`src/components/icons/brand-glyphs.ts`) et reconstruits par `createLucideIcon`, l'usine que
lucide expose toujours. **Aucune bibliothèque ajoutée** : ce sont les coordonnées, relevées
sur lucide 0.469, la dernière version à les livrer. Le résultat reste un `LucideIcon`
ordinaire, qui traverse le même `Glyph` — mêmes règles de taille et d'épaisseur.

**L'API publique ne bouge pas** : `<Icon name="github" />` et `ContentIcon` fonctionnent à
l'identique. Le peer redevient vrai — le socle marche avec n'importe quelle version de lucide.

Contrepartie assumée : ces trois dessins sont à nous. Si une de ces marques change son logo,
c'est ici qu'on le met à jour ; aucune mise à jour de lucide ne le fera plus.

## 0.5.2 — useModalSurface aligné sur les types React 19

`useModalSurface` annotait son retour `RefObject<HTMLDivElement>` ; depuis
`@types/react` 19, `useRef<T>(null)` rend `RefObject<T | null>` et l'annotation ne
compile plus sous 19. Élargie en `RefObject<HTMLDivElement | null>` — correcte sous
18 comme sous 19. Aligne le socle sur le template maître, qui typecheck désormais
contre les types 19 et a attrapé ce cas à la pose du garde-fou.
Même garde-fou posé ici : devDependencies `@types/react` / `@types/react-dom` en ^19 —
le typecheck du dépôt attrape désormais tout typage 18-only ; runtime et peers inchangés
(`react >=18`).

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
