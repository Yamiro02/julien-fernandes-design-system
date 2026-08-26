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

## 5. Le plan — sept sous-lots ordonnés

Build et vitrine vérifiés à chaque étape, en clair **et** en sombre.

**1 · Le sombre.** Jeton `--surface-alt`, les 12 règles qui le consomment, `.jf-badge--accent` et
`.jf-progress` réparés. *C'est le seul défaut qui casse le produit aujourd'hui.*
→ **Sortie :** en sombre, chaque survol est visible ; écart de luminance mesuré et proche de 1,08.

**2 · Le contraste.** Décider et écrire : les liens, le CTA, `pill-neutral`. Créer
`docs/accessibilite.md` avec **les ratios mesurés**, les paires validées, et les écarts assumés
avec leur raison.
→ **Sortie :** aucune paire n'échoue sans être nommée et justifiée dans le document.

**3 · La couche marque.** La scission `core.css` / `brand-jf.css`, le `brand.template.css` commenté,
`Logo` paramétré (mot-marque en prop, la pastille remplaçable), les fontes passées côté marque.
*C'est la raison d'être du chantier.*
→ **Sortie :** un `brand-test.css` bidon aux couleurs et fontes totalement différentes rend une
vitrine cohérente, sans qu'une seule valeur de Julien ne transparaisse. C'est LE test du template.

**4 · Sortie du pan métier.** `brand-content.css` + export dédié, `GridBackground` en sous-chemin.
→ **Sortie :** une app qui n'importe pas `brand-content.css` compile et rend sans manque.

**5 · Ménage.** `.jf-metric*` supprimé · `bg-thumbnail` cassé retiré · alias non publiés dans
`theme.css` · `GridBackground` sur `.jf-grid` · `--radius-badge` → `--radius-xs` · `IconButton`
avec de vraies tailles.
→ **Sortie :** `grep` vert sur chaque élément retiré.

**6 · Littéraux et durées.** 5 jetons créés — `--success`, `--shadow-glow-sm`, `--shadow-logo-dot`,
`--gradient-halo-top`, `--gradient-halo-center` — puis les 44 durées en `--duration-fast/base/slow`.
→ **Sortie :** aucun littéral de couleur, d'ombre ou de durée hors des fichiers de jetons.

**7 · Docs et CI.** `CHANGELOG.md` (0.1.0 → 0.5.0) · `GOVERNANCE.md` (l'arbre de décision de
promotion) · **`FORK.md` — comment fabriquer le DS d'un client à partir du template, dans l'ordre**
· `CONFORMITE.md` archivé, remplacé par le CHANGELOG et une checklist courte · workflow CI
(`typecheck` + `lint` + `build` + `demo:build`) · un job qui **échoue** si la version de
`package.json` et la ligne d'installation du README divergent.
→ **Sortie :** la CI passe au vert, et un lecteur qui n'a jamais vu le dépôt sait fabriquer un DS
client en suivant `FORK.md`.

---

## 6. Ce qui ne bouge pas

`theme.css` — sauf le retrait des trois alias au sous-lot 5. `useModalSurface` et ses garanties
(piège de focus, Échap, restitution, verrou de défilement). Le rail unique de `Button`, `Input` et
`Select`. Les paliers typographiques et la suppression de l'échelle native. Les couches
`base` / `components` / `utilities`. La procédure de version de `CONFORMITE.md`, qui migre telle
quelle dans le nouveau document.

---

## 7. Le vrai livrable — `docs/FORK.md`

Le produit de ce chantier n'est pas une liste de correctifs, c'est **un mode d'emploi**. Fabriquer
le design system d'un client doit tenir en quatre gestes :

1. Copier `brand.template.css` en `brand-<client>.css` et renseigner les jetons du contrat (§1.2).
2. Poser les `@font-face` du client et renseigner `--font-display/body/mono`.
3. Passer le mot-marque et la pastille au `Logo`.
4. Ne pas importer `brand-content.css`.

Si l'un de ces quatre gestes demande d'ouvrir un fichier du socle, **le chantier a raté**.
