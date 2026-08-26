# Chantier v0.5.0 — du design system de Julien au TEMPLATE

> **Source unique de ce lot.** Il consolide l'audit de l'atelier de conception, sa vérification
> ligne à ligne dans le dépôt, les mesures de contraste, et les décisions tranchées. En cas de
> contradiction avec un autre document, **celui-ci fait foi**.
>
> Base : `@julienfernandes/ds` v0.4.0 · commit `c6f4bc6` · 38 composants, 43 exports, Tailwind v4.

---

## 0. Le but, en une phrase

Le paquet doit cesser d'être *le design system de Julien Fernandes* pour devenir **un template
dont on fabrique un design system** — le sien, celui de ses apps internes, ou celui d'un client —
en substituant une couche de marque, sans jamais toucher au socle.

Aujourd'hui ce n'est pas possible : les couleurs, les fontes, le logo et le pan « création de
contenu » sont mêlés au socle dans les mêmes fichiers. « Faire le DS d'un client » signifie donc
**forker et chercher-remplacer** — exactement le geste qui a produit la dérive qu'on vient de
passer une semaine à réparer.

---

## 1. L'architecture cible — deux couches, une sortie

| Couche | Contenu | Statut |
|---|---|---|
| **1 · Socle** | structure, comportements, échelles, rayons, ombres, rail de contrôles, motion, les 38 composants, `useModalSurface` | **invariant** — jamais touché par un projet |
| **2 · Marque** | couleurs, fontes, logo, dégradé, la lueur du point | **substituable** — c'est le point d'override |
| ~~3 · Métier~~ | miniatures, grille fine, `accent-hot`, `ink-deep`, icônes de plateformes | **sort du socle** |

### 1.1 · Comment la marque se substitue — le contrat

**Deux fichiers, pas un override en cascade.** Le socle ne porte AUCUNE valeur de marque ; il
déclare seulement le **contrat** — la liste des jetons qu'un fichier de marque doit fournir. Un
projet importe le socle **et** son fichier de marque.

```
@julienfernandes/ds/core.css     ← structure, échelles, motifs. Zéro couleur de marque.
@julienfernandes/ds/brand-jf.css ← la marque Julien Fernandes, fournie par défaut
<projet>/brand-client.css        ← ou la sienne, copiée depuis brand.template.css
```

**Pourquoi pas un simple override en cascade** (importer le socle complet puis redéclarer par
dessus) : parce qu'un jeton oublié retomberait **silencieusement** sur la valeur de Julien. Le
client livrerait du corail sans le savoir. Avec deux fichiers, un jeton manquant fait que la
variable n'existe pas — et **ça casse visiblement**. C'est la même logique que `--text-*: initial`
qui supprime l'échelle typo native : une régression doit casser au lieu de dériver.

### 1.2 · Le contrat de marque — ce qu'un fichier de marque DOIT fournir

À matérialiser en `src/styles/brand.template.css`, commenté, prêt à copier :

- **Surfaces & neutres** : `--background` `--foreground` `--card(-foreground)` `--popover(-foreground)`
  `--secondary(-foreground)` `--muted(-foreground)` `--accent(-foreground)` `--border` `--input`
  `--ring` — en `:root` **et** en `.dark`
- **Neutres nommés** : `--ink` `--ink-soft` `--cream` `--cream-alt` `--text-secondary` `--text-muted`
  `--text-inverted`
- **Marque** : `--primary(-foreground)` `--destructive(-foreground)` `--brand-from/via/to`
  `--brand-gradient` `--brand-gradient-diagonal` `--grad-soft` `--gradient-halo`
  `--gradient-halo-top` `--gradient-halo-center`
- **Jumeaux lisibles** : `--primary-readable` `--destructive-readable` — **ajoutés au sous-lot 2.**
  `--primary` et `--destructive` sont des couleurs de REMPLISSAGE ; posées comme couleur de
  CONTENU sur une surface claire elles ne tiennent pas 4,5:1 (mesuré 3,12 et 3,40). Ces deux
  jetons-ci sont la même marque, rendue lisible. Le contrat exige **≥ 4,5:1 sur `--background`,
  `--card`, `--popover`, `--secondary`, `--accent` et `--surface-alt`, dans les deux thèmes** ;
  `check-contrast.mjs` le vérifie. Sans eux, un client hérite d'un système dont tous les liens
  échouent AA.
- **Sémantique** : les 6 paires `--pill-*-bg` / `--pill-*-fg`, `--success`, `--overlay-play-bg`
- **Pas de surface** : `--surface-alt` (nouveau, cf. §4.1)
- **Typographie** : `--font-display` `--font-body` `--font-mono` **et les `@font-face`
  correspondants**
- **Relief de marque** : `--shadow-glow` `--shadow-glow-lg` `--shadow-glow-sm` `--shadow-logo-dot`

Tout le reste — espacements, rayons, paliers typo, rail de contrôles, durées, ombres neutres —
appartient au socle et **n'est pas substituable**.

> **Précisé au sous-lot 3.** Des ombres neutres, seule la GÉOMÉTRIE est au socle. Écrites
> `rgba(31,30,28,…)`, elles emportaient l'encre de Julien : c'étaient les quatre dernières
> valeurs de Julien que le balayage de `brand-test.css` trouvait encore à l'écran. Elles
> valent désormais `color-mix(in srgb, var(--ink) N%, transparent)` — le taux reste au socle,
> la teinte suit le `--ink` que la marque fournit déjà. Rendu identique. En `.dark` elles
> restent en noir pur, qui n'est la valeur de personne.
>
> **Total du contrat : 59 jetons obligatoires en `:root`, dont 34 à redéclarer en `.dark`,
> plus 7 jetons métier optionnels.** Matérialisé dans `src/styles/brand.template.css`.

### 1.3 · Le pan métier sort en extension isolée, pas en suppression sèche

`src/styles/brand-content.css` + un export `./brand-content.css`, et `GridBackground` sur un
sous-chemin optionnel. Un projet qui n'en a pas besoin ne l'importe simplement pas.

**Pourquoi pas une suppression** : c'est le seul choix réversible. Ça atteint exactement l'objectif
— rien de tout ça n'est plus dans le socle générique — tout en préservant l'outillage miniatures et
motion de la marque Julien, que l'atelier de conception référence encore. Supprimer sèchement se
décide en une ligne plus tard ; ressusciter du code supprimé, non.

Contenu à déplacer : `--ink-deep` · `--gradient-thumbnail` · `--gradient-thumbnail-fit` ·
`--grid-cell` · `--grid-cell-lg` · `--grid-line` · `.jf-grid` · `.jf-grid-lg` · `.accent-hot` ·
les `@utility` `bg-thumbnail*` et `bg-grid*` · `GridBackground` · le mode `hot` de `Halo` · les
icônes de plateformes de `Icon` (youtube, instagram, tiktok…).

**Correction apportée à l'exécution.** Ce paragraphe a été écrit avant la scission `core.css` /
`brand-*.css` : il disait « déplacer les jetons », c'est-à-dire mettre leurs **valeurs** dans
l'extension. Ce serait la seule pièce du paquet à porter des valeurs de marque hors d'un fichier
de marque — et une marque de test devrait les charger puis les écraser en cascade, exactement
l'override silencieux que §1.1 refuse. `brand-content.css` est donc **symétrique de `core.css`** :
structure, `@utility`, correspondances de thème, et le **contrat** des sept jetons. Les valeurs
restent dans le fichier de marque, dans un bloc optionnel. Ce sont les règles et les utilitaires
qui déménagent, pas les valeurs.

---

## 2. Les défauts vérifiés

Vérifiés dans le dépôt, pas repris sur parole.

### 2.1 · BLOQUANT — le thème sombre a perdu tous ses survols

En `.dark`, cinq jetons de surface valent **la même couleur** :

```
--card  --popover  --secondary  --muted  --accent   →  tous #2b2a28
```

`var(--accent)` apparaît **18 fois** dans `patterns.css`, dont **12 en contexte de survol**. Sur
toute surface `--card`, `--popover`, `--secondary` ou `--muted` — donc partout sauf le fond de
page — **le survol est strictement invisible en sombre**. Mesuré : l'écart de luminance
carte → survol vaut **1,084 en clair** et **1,000 en sombre**. Zéro.

Règles touchées : `.jf-btn--secondary:hover` · `.jf-btn--ghost:hover` ·
`.jf-icon-btn--secondary/--ghost:hover` · `.jf-dropdown__item:hover` · `.jf-actionsheet__item:hover` ·
`.jf-sidenav:hover` et `.is-active` · `.jf-sidebar__toggle:hover` · `.jf-cal__day:hover` ·
`.jf-cal__nav:hover` · `.jf-table--hoverable tr:hover` · `.jf-modal__close:hover` · `.jf-page:hover`.

Deux dégâts collatéraux du même jeton : `.jf-badge--accent` (fond invisible sur carte en sombre) et
`.jf-progress` (rail invisible en sombre).

### 2.2 · Code mort et doublons — tous confirmés

| Quoi | Vérification |
|---|---|
| `.jf-metric` `--solid` `--coral` | 3 règles dans `patterns.css`, **zéro** composant les utilise depuis le retrait de `MetricPill` |
| `--gradient-thumbnail` + `@utility bg-thumbnail` | Le jeton porte dans `colors.css` un commentaire « FLAGGED FOR REVIEW — cannot render » : `closest-side` centré à 110 % peint un disque hors cadre. Il est pourtant exposé comme utilitaire : **une classe qui ne peint rien** |
| `GridBackground.tsx` | Reconstruit les deux `linear-gradient` en inline ; son `className={cn(className)}` ne pose jamais `.jf-grid`, que `base.css` porte déjà. Deux sources pour un motif |
| Alias publiés | `--page-max: var(--container-shell)` · `--shadow-soft: var(--shadow-sm)` · `--shadow-soft-lg: var(--shadow-lg)` — trois façons de dire la même chose, générées en utilitaires |
| `--radius-badge` | Nommé « badge » mais `.jf-badge` prend `--radius-pill` ; **son seul consommateur est `.jf-progress`** |

**Nuance importante sur le rail de contrôles.** Le rail unique est une **intention documentée** du
README, pas un bug. Mais les **trois** `--icon-control-*` valent `var(--control-md)` : donc
`IconButton size="sm|md|lg"` rend **trois carrés identiques**. Une prop qui ment est pire qu'une
prop absente. `Button`, lui, différencie toujours ses tailles par le rembourrage et le palier typo :
il n'est pas concerné.

### 2.3 · Littéraux hors jetons — les quatre existent, aux lignes annoncées

| Fichier:ligne | Littéral |
|---|---|
| `patterns.css:14` | `box-shadow:0 2px 8px rgba(245,165,36,.25)` sur `.jf-btn--primary:active` |
| `patterns.css:153` | `color-mix(… #639922 35% …)` sur `.jf-banner--success` — **il n'existe aucun jeton vert** |
| `base.css:30` | `.accent-hot` → `drop-shadow(0 0 34px rgba(240,128,41,.65))` |
| `base.css:47` | `.jf-logo__dot` → `box-shadow:0 0 12px rgba(240,128,41,.5)` |
| `base.css:34-35` | `.halo-top` / `.halo-center` → deux `radial-gradient` littéraux, alors que `--gradient-halo` est tokenisé. 1 halo sur 3 respecte la règle |

**44 littéraux de durée** dans `patterns.css` — `22 × 150ms`, `20 × 200ms`, `2 × 300ms` — alors que
`--ease-standard` existe seul. Changer le tempo du système demande 44 remplacements.

### 2.4 · Deux affirmations de l'audit initial qui sont fausses

- **Les `.DS_Store` ne sont PAS versionnés.** `git ls-files | grep -c DS_Store` retourne **0**. Le
  `.gitignore` les couvre. Rien à faire.
- **`dist/` est bien ignoré** — `.gitignore:2`. Question répondue, rien à faire.

---

## 3. Le contraste, mesuré — ce qu'aucun audit n'avait chiffré

Ratios WCAG calculés sur les valeurs réelles, fonds de pilules composités sur la carte.

| Paire | Ratio | |
|---|--:|---|
| `--primary` sur `--background`, clair — **la couleur de tous les liens** (`base.css` : `a{color:var(--primary)}`) | **3,12** | ❌ AA |
| blanc sur `--primary` — **le texte du CTA primaire** | **3,48** | ❌ AA |
| `pill-neutral`, clair | **4,40** | ❌ AA, de peu |
| Les 5 autres pills, clair | 4,79 – 5,47 | ✓ |
| Les 6 pills, sombre | 4,89 – 7,46 | ✓ |
| `--text-secondary` / `--text-muted`, clair | 10,31 / 5,12 | ✓ |
| Tout le texte, sombre | 4,79 – 9,22 | ✓ |

**Le CTA primaire est pire que ce chiffre.** Il porte le **dégradé**, dont l'extrémité `#f5a524`
est plus claire que `#e85d2f` : le blanc y tombe autour de **2:1**.

Ce n'est pas nécessairement un bug à corriger — toute marque orange chaude a ce problème et
beaucoup l'assument. Mais **pour un template destiné à des clients, ce doit être une décision
écrite, jamais une découverte faite par l'audit d'accessibilité du client.**

---

## 4. Les décisions, tranchées

### 4.1 · Survol — un jeton dédié `--surface-alt`

Plutôt qu'un `--accent` distinct en sombre. `--accent` redevient une teinte de marque, le survol
gagne son propre nom, et les 12 règles pointent dessus.

> **Amendé au sous-lot 1.** Le jeton s'appelle `--surface-alt`, pas `--hover-surface` : il a
> **15** consommateurs et **deux ne sont pas des survols** — le rail de `.jf-progress` et le point
> haut du shimmer de `.jf-skel`. Comme il appartient au contrat de marque (§1.2), un nom qui dit
> « survol » ferait poser au client une couleur de survol franche que la barre de progression et
> le squelette prendraient aussi. Le concept est *un cran de séparation depuis la surface
> courante* ; le nom le dit.
> `.jf-badge--accent` et `.jf-banner--info` ne consomment PAS ce jeton : ils restent sur
> `--accent`, réparés par sa nouvelle valeur sombre `#392e29`. En clair il vaut l'actuel `--accent`
(`#f6ede2`) ; en sombre, viser **l'écart de luminance du clair, ~1,08** — la proposition `#35342f`
donne 1,150, un peu fort. Mesurer, ne pas supposer.

### 4.2 · `IconButton` — de vraies tailles

38 / 42 / 48, les valeurs du kit maître avant l'alignement sur le rail unique. Le rail unique reste
la règle pour `Button`, `Input` et `Select` ; un bouton-icône carré n'a pas la même contrainte.

### 4.3 · Pan métier — extension isolée (§1.3)

### 4.4 · Le préfixe `.jf-` reste, et c'est documenté

C'est le préfixe **du template**, pas de la marque du client. Le renommer imposerait de le
renommer aussi dans l'atelier de conception, sinon chaque synchronisation le rebasculerait — le
coût dépasse le bénéfice, qui est cosmétique. **À réexaminer en 1.0**, pas avant. Ce qui compte,
c'est que la doc le dise, pour qu'aucun client ne pose la question deux fois.

### 4.5 · `--radius-badge` → `--radius-xs`

---

## 5. Le plan — révisé au 26/08 après les sous-lots 1 à 3

> **Révision.** Un dossier `design-system-template` a été retrouvé : un template fabriqué avant la
> migration Tailwind v4, qui résout déjà plusieurs points de ce chantier — et mieux. Les sous-lots
> restants intègrent ses apports. Voir §8.

**Faits (sous-lots 1 à 3, livrés) :** le survol a son jeton, `--surface-alt`. La marque a cessé
d'être une couleur de contenu. La couche marque est séparée : `core.css` + `brand-jf.css`, avec
`brand.template.css` comme contrat, et une marque hostile rend une vitrine cohérente sans un seul
survivant sur 7 082 éléments. Trois gardes tournent sur `lint` : collision de namespace, contraste,
substitution figée.

**Reste :** quatre sous-lots. Le 5 est le cœur — c'est lui qui fait du dépôt un template et non
plus le design system de Julien avec un mécanisme de substitution.

### Sous-lot 4 — Le pan métier sort du paquet

Beaucoup plus petit qu'annoncé : le sous-lot 3 a déjà fait transiter `--ink-deep`,
`--gradient-thumbnail*`, `--grid-*` et `--shadow-accent-hot` par `brand-jf.css`, donc le socle en
est déjà vide. Il reste à les extraire de la marque vers une extension optionnelle.

`src/styles/brand-content.css` + export `./brand-content.css`. Y déplacer aussi `.jf-grid`,
`.jf-grid-lg`, `.accent-hot`, les `@utility` `bg-thumbnail*` et `bg-grid*`, le composant
`GridBackground` en sous-chemin optionnel, le mode `hot` de `Halo`, et les icônes de plateformes
de `Icon`.

→ **Sortie :** une app qui n'importe pas `brand-content.css` compile et rend sans manque ; la
vitrine de Julien, qui l'importe, est inchangée au pixel.

### Sous-lot 5 — Le dépôt DEVIENT le template

C'est la bascule. Aujourd'hui le dépôt est *le design system de Julien, doté d'un mécanisme de
substitution*. Il doit devenir *le template, dont le design system de Julien est l'instance de
référence, livrée avec*.

Le dossier `design-system-template` (§8) porte déjà quatre de ces gestes, éprouvés. On les
transpose, on ne les réinvente pas.

#### Deux usages, et ils ne demandent pas la même chose

C'est la distinction qui commande tout le reste, et elle reprend celle déjà actée dans le skill
`developpement-app` — *app interne : socle externe partagé · projet client : le client possède
tout son code*.

| | **Apps internes de Julien** | **Projet client** |
|---|---|---|
| Comment on l'obtient | on **installe le paquet publié** | on **copie le dossier** |
| Nom | `@julienfernandes/ds` — inchangé | `rebrand.mjs` l'écrase en `@client/ds` |
| Marque | importe `brand-jf.css`, livré dans le paquet | remplit `brand.template.css` |
| Dérive | impossible : un seul socle, aucune copie | sans objet : le DS du client est indépendant par conception |

**Le nom du paquet publié reste donc `@julienfernandes/ds`.** `@acme` n'est pas un nom de produit,
c'est le placeholder du chemin « copie » — celui que `rebrand.mjs` réécrit. Publier les apps de
production contre un paquet nommé « acme » n'aurait aucun sens.

#### Les six gestes

1. **Le préfixe `.jf-` devient `.ds-`.** 580 occurrences, 43 fichiers. Mécanique. Un template
   client ne trimballe pas les initiales de quelqu'un d'autre — et le template retrouvé avait déjà
   tranché ainsi.

   **Dans le même passage, cinq jetons neutres prennent un nom de rôle** : `--ink` `--ink-soft`
   `--ink-deep` `--cream` `--cream-alt` → `--tone-dark` `--tone-dark-soft` `--tone-deep`
   `--tone-light` `--tone-light-alt`, comme le template. 32 occurrences, 7 fichiers. « Encre » et
   « crème » sont la métaphore matière de Julien ; un client au neutre gris-bleu lit un contrat qui
   lui ment. L'argument de calendrier est le vrai : **une fois v0.5.0 publiée, renommer un jeton
   public est un changement cassant** — là, c'est un `sed` dans le passage qui en fait déjà 580.
2. **`src/brand.ts`**, porté du template : le seul endroit où l'identité textuelle est écrite, avec
   des **valeurs de placeholder** (`Acme` / `AC`). Les props de marque posées au sous-lot 3
   (`brand`, `homeLabel`, `wordmark`) restent — c'est la bonne API React — mais leurs valeurs par
   défaut viennent de ce fichier. Personne ne livre « ACME » par accident ; « Julien Fernandes »
   dans la nav d'un client, si.
3. **La palette par défaut devient la palette de placeholder** du template, grise et fade, avec son
   en-tête et ses six règles de structure. `styles.css` livre désormais `core.css` +
   `brand-acme.css`. `brand-jf.css` **reste livré dans le paquet** — il devient l'instance de
   référence, plus le défaut. Et `docs/BRAND-JULIEN-FERNANDES.md` consigne ses réglages pour qu'ils
   se rejouent en une heure.
4. **`scripts/rebrand.mjs`**, porté et adapté à v4 : plus de preset, chemins à jour, `theme.css`
   couvert. Garder son idempotence et sa lecture du nom courant depuis `package.json`.
   ⚠️ **Il doit en plus repointer `styles.css`** vers le fichier de marque qu'il vient de créer.
   Sans ce geste, quelqu'un qui copie le dossier, rebrande et oublie de changer l'import livrerait
   la palette de Julien — exactement le silence qu'on élimine partout ailleurs.
5. **La prose de la vitrine se généralise.** Laissée en voix de Julien au sous-lot 3, les pages
   Marque et Fondations ne décrivent plus « capitales Anton » ni « DM Sans 400 ».
6. **La règle d'Anton quitte le socle.** `tokens/base.css:7` pose `text-transform:uppercase` +
   `font-weight:var(--weight-regular)` sur `h1→h4`, et le répète sur `.display` et `.display-xl` ;
   `patterns.css:91` fait exactement pareil sur `.jf-card__title`. Ce n'est pas de la structure :
   c'est le fait qu'Anton est une condensée à capitales qui n'a qu'une graisse. Sous une serif, tout
   le titrage du système rend en **CAPITALES 400**. Le balayage du sous-lot 3 ne pouvait pas
   l'attraper — il lit les couleurs et les familles, pas `text-transform`. Le template a déjà la
   réponse : deux jetons de marque, `--heading-transform` et `--heading-weight`.

   **La frontière est nette : les deux jetons gouvernent exactement les règles qui posent
   `font-family:var(--font-display)`**, et rien d'autre. Les capitales de `.eyebrow`, `.chip`,
   `.jf-sidebar__title` et `.jf-cal__wd` restent en dur : elles sont en `--font-body`, et là les
   capitales sont une convention de taille et de rôle — une micro-étiquette de 11 px — pas une règle
   de la face display. `.jf-cal__label` garde son `capitalize` : c'est un nom de mois, c'est de
   l'i18n.

   Deux cas particuliers. **Le logo** lit les deux jetons lui aussi — le template, lui, garde
   `uppercase` en dur sur `.ds-logo`. On s'en écarte : sans ça, un client dont le mot-marque n'est
   pas en capitales obtient un logo qui l'est. Chez Julien, `--heading-transform:uppercase` rend
   `['Julien','Fernandes']` en capitales exactement comme aujourd'hui ; le cas rare — titrage en
   capitales mais mot-marque en casse mixte — se règle par une ligne `text-transform` sur `.ds-logo`
   dans le fichier de marque. Et **`Avatar.tsx:51` rend un `'JF'` littéral** : le monogramme de
   Julien, en dur dans un composant du socle, que le balayage ne pouvait pas voir non plus parce
   qu'il est en JSX et pas en CSS. Il prend `BRAND_MONOGRAM` par défaut et une prop `initials`.

   Les valeurs vont dans le fichier de **marque**, pas dans `tokens/typography.css` : l'échelle des
   quatre graisses est structurelle, le choix de celle que porte le titrage ne l'est pas.
   `brand-jf.css` : `uppercase` + `var(--weight-regular)`. `brand-acme.css` et
   `brand.template.css` : `none` + `var(--weight-bold)`, avec les deux cas du GETTING-STARTED en
   commentaire — condensée à capitales → `uppercase` + 400 ; grotesque classique → `none` + 700.

#### Ce que ça change pour les apps de Julien

Elles importeront **`core.css` + `brand-jf.css`** au lieu de recevoir sa marque en douce via
`styles.css`. Une ligne dans chaque app, et c'est le bon prix : explicite plutôt que silencieux.

→ **Sortie :** dans une copie du dossier, `npm run rebrand -- "@test/ds" "Test Client"` puis
`npm run demo` affiche une vitrine cohérente à la marque de test, **sans qu'aucun geste manuel ne
soit nécessaire** — l'import a suivi. Et `grep -ri "julien\|fernandes\|jf-"` sur `src/` sort
**vide**, hors `brand-jf.css` et `docs/BRAND-JULIEN-FERNANDES.md`, qui sont l'instance de référence.

Et trois greps de plus : `text-transform:uppercase` ne subsiste dans `src/styles/` que sur les
règles en `--font-body` ; `'JF'` sort vide de `src/` ; et sous `brand-test.css` (la serif), un `h1`
de la vitrine rend en casse d'origine, graisse 700.

### Sous-lot 6 — Ménage, littéraux, durées

Un seul passage, sans s'arrêter entre les trois. **Critère d'admission : si on ne peut pas dire en
une phrase, en clair, ce qui casse pour un utilisateur sans ce correctif, on ne le fait pas** — on
le note dans une liste « à revoir un jour » et on passe.

Ménage : `.jf-metric*` supprimé · `bg-thumbnail` cassé retiré · les trois alias non publiés dans
`theme.css` (`--shadow-soft`, `--shadow-soft-lg`, `--page-max`), ce qui solde du même coup leur
exception dans le garde de substitution · `GridBackground` sur la classe de grille au lieu de son
inline · `--radius-badge` → `--radius-xs` · `IconButton` avec de vraies tailles 38/42/48 · les deux
commentaires de `theme.css` qui nomment encore Anton.

Littéraux : `--shadow-glow-sm`, `--shadow-logo-dot`, `--gradient-halo-top`,
`--gradient-halo-center`. Puis les 44 durées en `--duration-fast/base/slow`.

**Ajouté après la revue du sous-lot 5 — trois dettes que ce lot-là a créées :**

1. **Le garde de contraste ne mesure plus `brand-jf.css`.** Il lit la marque que `styles.css`
   monte — c'est le bon réflexe, il a été trouvé par le test de la copie — mais depuis que le défaut
   est `brand-acme.css`, `npm run lint` mesure la palette de placeholder et **plus la marque des apps
   de production de Julien**. Le garde de substitution, lui, confronte *chaque* `brand-*.css` au
   socle. Il faut la même symétrie ici : boucler sur les fichiers de marque, comme le voisin. Sans
   ça, une régression dans `brand-jf.css` passe au vert. (`TOKENS=… node check-contrast.mjs`
   fonctionne, mais un garde qu'il faut penser à invoquer n'est pas un garde.)
2. **`tokens/typography.css` ment sur six lignes.** L'en-tête dit encore « `--font-display` …
   TOUJOURS en capitales » et les cinq paliers de titrage sont commentés « CAPS ». Le geste 6 vient
   de rendre ça faux, et c'est le fichier qu'un client lit pour régler sa typo. (Les « CAPS » de
   `--text-eyebrow` et `--text-chip`, eux, restent vrais.)
3. **L'en-tête de `brand-acme.css` décrit l'ancien `rebrand`.** Il dit que le script copie
   `brand.template.css` ; il copie `brand-acme.css` depuis la décision 3 du sous-lot 5. Une ligne.

→ **Sortie :** `grep` vert sur chaque élément retiré, et aucun littéral de couleur, d'ombre ou de
durée hors des fichiers de jetons. Et `npm run lint` mesure le contraste des DEUX marques livrées.

### Sous-lot 7 — La mise en route, les docs, la CI

**`GETTING-STARTED.md`**, porté du template et mis à jour pour v4 : la checklist d'une heure, de
« dossier copié » à « vitrine à mes couleurs », avec un point de vérification à chaque étape. C'est
le mode d'emploi du produit — il remplace le `FORK.md` prévu initialement.

**`docs/DESIGN.md`**, porté du template : la charte à remplir **avant** de toucher au CSS.

Puis : `CHANGELOG.md` (0.1.0 → aujourd'hui) · `GOVERNANCE.md` (l'arbre de décision de promotion) ·
`docs/accessibilite.md` déjà écrit au sous-lot 2 · `CONFORMITE.md` archivé, remplacé par le
CHANGELOG et une checklist courte.

**La CI**, et c'est elle le vrai livrable de ce sous-lot : `typecheck` + `lint` + `build` +
`demo:build`, **plus deux jobs bloquants** :
- la version de `package.json`, la ligne d'installation du README et l'existence du tag doivent
  concorder — la procédure écrite a échoué trois fois de suite (0.3.0, 0.4.0, 0.4.1) ;
- `brand.template.css` doit déclarer exactement les mêmes jetons que `brand-acme.css` — sinon le
  contrat naît incomplet et un client livre une variable qui n'existe pas.

→ **Sortie :** la CI passe au vert, et quelqu'un qui n'a jamais vu le dépôt fabrique un design
system client en suivant `GETTING-STARTED.md`, sans jamais ouvrir un fichier du socle.

---

## 6. Ce qui ne bouge pas

`theme.css` — sauf le retrait des trois alias au sous-lot 5. `useModalSurface` et ses garanties
(piège de focus, Échap, restitution, verrou de défilement). Le rail unique de `Button`, `Input` et
`Select`. Les paliers typographiques et la suppression de l'échelle native. Les couches
`base` / `components` / `utilities`. La procédure de version de `CONFORMITE.md`, qui migre telle
quelle dans le nouveau document.

---

## 7. Le vrai livrable — `GETTING-STARTED.md`

Le produit de ce chantier n'est pas une liste de correctifs, c'est **un mode d'emploi**. Le
template retrouvé en a déjà écrit un, éprouvé, qui va de « dossier copié » à « vitrine à mes
couleurs » en une heure, avec un point de vérification à chaque étape. Il est porté au sous-lot 7
et remplace le `FORK.md` prévu initialement.

Fabriquer le design system d'un client doit tenir en quatre gestes :

1. Copier le dossier, puis `npm run rebrand -- "@client/ds" "Nom du client"` — il renomme le paquet, l'identité textuelle, et repointe `styles.css`.
2. Remplir `src/styles/tokens/colors.css` — on ne renomme aucun jeton, on ne change que les valeurs.
3. Poser les `@font-face` du client et renseigner `--font-display/body/mono`.
4. Ne pas importer `brand-content.css`.

Si l'un de ces quatre gestes demande d'ouvrir un fichier du socle, **le chantier a raté**.

---

## 8. Le template retrouvé — ce qu'on lui prend

`design-system-template`, fabriqué avant la migration v4, résout déjà — et mieux — plusieurs
points de ce chantier. Ce qu'il apporte, et qui est repris aux sous-lots 5 et 7 :

| Ce qu'il a | Où ça va |
|---|---|
| `src/brand.ts` — l'identité textuelle en un seul endroit | sous-lot 5 |
| `scripts/rebrand.mjs` — renommage en une commande, idempotent | sous-lot 5 |
| Le préfixe `.ds-`, déjà générique | sous-lot 5 |
| Une palette de **placeholder** volontairement fade — « si tu la reconnais encore à la recette, c'est que tu ne l'as pas remplacée » | sous-lot 5 |
| `GETTING-STARTED.md` — la checklist d'une heure | sous-lot 7 |
| `docs/DESIGN.md` — la charte à remplir avant le CSS | sous-lot 7 |

**Sa leçon principale, qui vaut au-delà des fichiers :** le meilleur test d'un template n'est pas
un fichier de test en plus, c'est **un défaut qu'on ne peut pas oublier de remplacer**. Une palette
fade par construction rend la substitution obligatoire. C'est plus fort qu'un `brand-test.css`
qu'on pense à lancer.

Et sa règle 6, écrite en tête de son `colors.css` avant qu'on passe une heure à la mesurer :
*« Contraste minimum 4.5:1 texte courant, 3:1 gros titres et bordures porteuses de sens. Vérifie
`--text-muted` sur `--card`, c'est le couple qui casse. »*

---

