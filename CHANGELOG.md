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

---

---

---

---

## 0.11.0 — la déduction de surface a un cran de rattrapage

**Aucune rupture. `surface` vaut `auto` par défaut, et `auto` ne pose aucune classe : tout
le code existant rend exactement comme en 0.10.1.** Une app remonte de version pour avoir
l'échappatoire, pas pour réparer quelque chose.

**Le défaut, constaté dans une app et invisible depuis ce dépôt.** La v0.8.0 a posé la
déduction de surface — `.ds-card .ds-btn--secondary { background: var(--background) }` —
parce que `--secondary` est passé au rang de la carte et qu'un bouton secondaire posé sur
une carte aurait sinon 1,009 d'écart avec elle. La règle est juste, et elle prévoit **un
seul niveau d'imbrication** : le bouton posé sur la carte.

Une app qui pose un **panneau `--background` DANS une carte** — une ligne de fichier, une
tuile, un encadré — sort de ce cas : le bouton reçoit `--background`, soit exactement la
couleur du panneau qui le porte, et il n'existe plus à l'écran. Rien ne le signalait ici :
**la vitrine ne posait aucun panneau dans une carte**, et le contraste du bouton contre sa
carte, lui, restait bon. Le symptôme le plus trompeur : le même composant rendu dans un
`<div>` qui *ressemble* à une carte sans en être une s'affichait correctement, et faisait
soupçonner l'app.

**Le correctif est une prop, pas un composant** — `GOVERNANCE.md`, test 4. `Button` et
`IconButton` prennent `surface?: 'auto' | 'page' | 'card'`, **jumelle exacte de celle
qu'`Input` porte depuis la v0.5.0 pour le même problème** :

| valeur | ce qu'elle fait | quand |
|---|---|---|
| `auto` *(défaut)* | aucune classe, la déduction fait son travail | partout, y compris tout le code écrit avant cette version |
| `page` | force `--secondary` | bouton sur un panneau `--background` imbriqué dans une carte |
| `card` | force `--background` | conteneur qui n'a que l'apparence d'une carte, sans être une `.ds-card` |

Sans effet sur `ghost`, `primary` et `danger` : aucun des trois ne porte `--secondary`.
La prop ne ment donc jamais — elle ne change rien là où il n'y a rien à changer.

**Deux sélecteurs, et leur poids est le mécanisme entier.**

```css
.ds-btn--secondary.ds-btn--on-page,.ds-icon-btn--secondary.ds-icon-btn--on-page{background:var(--secondary)}
.ds-btn--secondary.ds-btn--on-card,.ds-icon-btn--secondary.ds-icon-btn--on-card{background:var(--background)}
```

Ils valent **0,2,0** — le même poids que la déduction — et arrivent **après** elle : ils
gagnent. Le survol reste à 0,3,0 et continue de passer devant les deux, donc la réponse au
pointeur est intacte. Écrits en un seul sélecteur de classe, ils repasseraient sous la
déduction et la prop ne ferait rien : c'est écrit à côté de la règle.

**La vitrine pose désormais le cas.** Section `Button`, bloc « Surface » : un panneau
`--background` dans une carte, le bouton en `auto` à côté du même en `page`. Le défaut se
voit en ouvrant la démo, ce qui n'était pas vrai avant cette version.

## 0.10.1 — le socle se contredit sur son propre preflight

**Documentation seule. Aucun changement de rendu, aucune API, aucun jeton, aucune classe —
une app n'a aucune raison de re-épingler.** Il n'y a rien à revoir à l'écran.

Ce n'est pas cosmétique pour autant : trois documents affirmaient encore que « le preflight
est volontairement omis, le design system embarque son propre reset **que le preflight
neutraliserait** ». C'est exactement le raisonnement qui a coûté au socle des mois sans
reset — quelqu'un lit une raison périmée, la croit, et agit dessus.

**`README.md` est le point qui justifie la publication** : c'est la documentation
d'installation, et son § « Ce que `theme.css` règle pour toi » décrivait du code **retiré en
0.10.0** — les deux rustines `border-width:0` / `border-style:solid`. Quelqu'un qui monte le
socle aujourd'hui y lit les instructions d'une version disparue. Il dit maintenant l'état
réel : le socle porte son preflight, et il repose `border-color: var(--border, currentColor)`
dans `tokens/base.css`, dont le cas inverse s'écrit `border-current`.

L'avertissement « supprime ton `@import "tailwindcss";` » **reste valable** — un second
Tailwind amène un second preflight, qui arrive **après** le reset du socle. Mais il est
reformulé en problème d'**ordre**, pas en incompatibilité : « le preflight revient
neutraliser le reset » est la phrase qui a fait retirer le preflight, elle ne doit plus
exister nulle part.

**`theme.css` n'est pas seulement corrigé, il est verrouillé.** Un commentaire neutre
laisserait le prochain lecteur libre d'y ajouter `@import "tailwindcss/preflight.css"` —
c'est-à-dire de rejouer le bug. Il **interdit** le geste et dit pourquoi : `theme.css` et
`core.css` sont deux points d'entrée **indépendants**, l'app les importe séparément et
`theme.css` n'importe pas `core.css`. Un reset posé là-bas n'a donc aucun rapport d'ordre
garanti avec `tokens/base.css` — or le reset du socle ne tient QUE par cet ordre.

Et le piège est pire, **mesuré sur les quatre cas** : un `@import` **sans `layer()`** atterrit
hors couche, et le CSS hors couche l'emporte sur **toutes** les couches, qu'il soit inséré
avant ou après le socle. En `layer(base)`, il ne gagne que s'il vient après. Un preflight
importé depuis `theme.css` sans couche écrase donc h1→h4, les liens et le focus du socle,
**toujours** — c'est très probablement l'observation d'origine, prise à l'époque pour une
incompatibilité alors que c'était un problème d'ordre et de couche.

Les deux autres arguments contre l'import direct — l'import de police avalé, le peer
optionnel — ne sont pas recopiés : `theme.css` renvoie à l'en-tête de `tokens/preflight.css`,
où ils sont écrits une seule fois. Un raisonnement écrit à deux endroits est un raisonnement
qui divergera.

`GETTING-STARTED.md` reçoit la même correction, en plus court.

Les trois corrections sont reportées à l'identique dans `design-system-template`.

## 0.10.0 — le preflight de Tailwind revient, et l'addenda v0.8.0 est appliqué

Le rendu de **tout élément HTML nu** change, dans les deux thèmes. Aucune prop, aucune
classe retirée, aucun jeton ajouté ni retiré. **Aucun composant du système ne bouge d'un
pixel du fait du preflight** — mesuré, voir plus bas. La seconde moitié du lot, elle, déplace
volontairement cinq règles de la barre latérale et deux couleurs d'icône.

> **Ce lot absorbe le contenu prévu pour une « 0.9.1 ».** Cet addenda a été rédigé contre
> `c2ab970` (la 0.9.0) alors que la 0.10.0 était déjà écrite, non publiée et non taguée. Une
> 0.9.1 posée *après* la 0.10.0 serait un numéro qui recule ; comme rien n'a jamais été
> publié sous ce nom, il n'y a aucun trou à combler. Le contenu est donc ici, en entier.

### Ce qui était cassé, et pourquoi la raison écrite ne tenait pas

`theme.css` omettait le preflight, au motif que « le socle embarque son propre reset
(`tokens/base.css`) que le preflight neutraliserait ».

Ce n'était pas une incompatibilité, c'était un problème d'**ordre**. Preflight et `base.css`
vivent tous deux dans `layer(base)` avec des sélecteurs d'éléments : à spécificité égale,
c'est le dernier chargé qui gagne. Chargé AVANT, le preflight normalise et l'identité du
socle repasse par-dessus. Quelqu'un a vraisemblablement vu les titres perdre leur display en
l'activant, a conclu « incompatible », et a retiré — la conclusion était logique, la cause
était l'ordre.

### Ce que l'omission coûtait

`tokens/base.css` couvre box-sizing, `html`, `body`, `h1`→`h4`, `p`, `a`, `:focus-visible`,
`code/pre/kbd/samp`, `img`, `::selection`. N'étaient normalisés **nulle part** :

- l'**apparence** de `button`, `input`, `select`, `textarea`. Un `<button>` nu écrit par une
  app héritait du gris `buttonface`, d'**Arial 13,33px** et d'un rembourrage de 1px 6px. Deux
  composants métier d'une app consommatrice l'ont attrapé à deux lots d'écart sans que
  personne le voie : le symptôme est un écran légèrement faux, jamais une erreur ;
- `ul`, `ol`, `li` — puces et retrait de 40px ;
- `table`, `fieldset`, `legend`, `figure`, `blockquote`, `hr`, `dl`, `dd`, `small`, `h5`, `h6`.

C'est cette **classe** de défauts qui se ferme, pas un cas.

### Le preflight est VERSÉ dans le dépôt, pas importé de `tailwindcss`

`src/styles/tokens/preflight.css` est une copie conforme de `tailwindcss/preflight.css`
(4.3.3), à six déclarations près. `core.css` la charge en `layer(base)` **juste avant**
`tokens/base.css` : même fichier, même couche, l'ordre est garanti par la source et il n'y a
rien à espérer du bundler.

Écrire `@import "tailwindcss/preflight.css"` à la place a été essayé, **et refusé sur
mesure** — deux raisons, chacune suffisante :

1. **L'import distant de la marque disparaissait.** Un specifier `tailwindcss/…` dans
   `core.css` fait réclamer tout l'arbre CSS par le compilateur Tailwind, dont la résolution
   d'`@import` ne laisse pas passer un `@import url(https://…)`. Or c'est par là que le
   fichier de marque charge sa police de texte. Vérifié en dev **et dans le bundle de
   production** : la règle `fonts.googleapis.com` disparaît de la feuille émise et DM Sans
   n'est jamais chargée. Le système rend alors dans sa police de repli — lisible, plausible,
   et faux.
2. **`tailwindcss` est un peer OPTIONNEL.** Une app qui monte le socle sans la couche
   Tailwind ne peut pas résoudre un `tailwindcss/…`. Le reset du socle ne peut pas dépendre
   d'un paquet facultatif.

Les six déclarations retirées de la copie sont les `font-family`, `font-feature-settings` et
`font-variation-settings` de `html,:host` et de `code,kbd,samp,pre` : toutes bâties sur
`--theme(…)`, une fonction que seul le compilateur Tailwind résout. `tokens/base.css` repose
ces deux familles depuis les jetons de marque quelques lignes plus loin, et une pile de
polices littérale n'a pas sa place dans le socle.

### Le relevé avant / après

Banc d'essai de **90 éléments** — nus et composants du socle, montés sur leur balise réelle
— × **2 thèmes** × **2 largeurs** (1811px et 900px, de part et d'autre du point de rupture),
sur 34 propriétés calculées plus la hauteur rendue.

**Zéro hauteur déplacée sur un composant du système.** Les différences résiduelles sont
toutes des propriétés calculées sans effet géométrique, et chacune est voulue :

| ce qui change | où | pourquoi c'est bon |
|---|---|---|
| `appearance: auto → button` | les 12 composants bâtis sur `<button>` | le correctif iOS du rayon de bordure ; aucun effet de peinture |
| `background-color: buttonface → transparent`, `color: black → --foreground` | `.ds-btn--sm` / `--lg` **sans classe de variante** | le bug lui-même, sur un chemin latent : `<Button>` émet toujours une variante (`defaultVariants`) |
| `font-family: Arial → --font-body`, `13,33px → 16px` | `.ds-icon-btn`, `.ds-modal__close`, `.ds-toast__close`, `.ds-sidebar__toggle`, `.ds-cal__nav` | boutons-icône à boîte fixe : hauteur inchangée, et la police cesse d'être Arial le jour où l'un d'eux porte un caractère |
| `line-height: normal → hérité` | `.ds-page`, `.ds-cal__day`, `.ds-actionsheet__item`, `.ds-sidenav` | boîtes calées par un `min-height` ou une hauteur fixe : géométrie inchangée. Effet de bord bienvenu — les rendus `<a>` et `<button>` de `.ds-sidenav`, qui divergeaient, s'accordent |
| `padding: 1px 6px → 0` | `.ds-cal__day`, `.ds-modal__close`, `.ds-cal__nav` | rembourrage natif retiré ; ces trois-là sont des `inline-flex` centrés à taille fixe |
| `resize: both → vertical` | `.ds-input` seul sur un `<textarea>` | `.ds-textarea` posait déjà `vertical` |
| `color` de `.ds-sep` | `<hr class="ds-sep">` | la règle pose `border:0` et un `background` : la propriété est inerte |

### Trois composants ont vraiment bougé, et ils sont réparés

Le preflight fait hériter police **et interligne** aux contrôles natifs (`font: inherit`).
Trois règles du socle n'avaient jamais déclaré de `line-height` : elles reposaient **en
silence** sur le `normal` du navigateur, et se sont mises à suivre `--leading-body`.

- `.ds-input` : **44 → 47px sous 64rem**, là où le rail tactile vaut 44 — donc désaligné du
  bouton posé à côté, ce que le rail unique existe précisément pour empêcher ;
- `.ds-tab` : 36 → 39px ;
- `.ds-dropdown__item` : 38 → 41px.

Les trois déclarent maintenant `line-height: normal` : la dépendance devient **explicite** au
lieu de dériver avec l'interligne du corps de texte. `.ds-btn` déclarait déjà la sienne
(`line-height: 1`), `.ds-textarea` la sienne (`--leading-normal`).

### Les deux rustines de `theme.css` sont retirées

`theme.css` restaurait à la main deux morceaux du preflight — `border-width: 0` et
`border-style: solid` sur `*`. Le preflight les repose (`border: 0 solid`) : elles sont
redondantes, et une réparation qui survit à son problème finit par être « corrigée » dans le
mauvais sens.

**⚠ La troisième ligne du même bloc partait avec elles, et elle n'était PAS redondante** :
`border-color: var(--border)`. Le preflight v4 laisse `currentColor` — c'est un changement
assumé d'amont entre Tailwind v3 et v4. Conséquence pour une app : `className="border"`
**sans** classe de couleur donne désormais une bordure de la couleur du texte, pas `--border`.
Aucun composant du système n'est concerné (tous posent leur `border-color` explicitement),
mais une app qui s'appuyait sur ce défaut doit écrire `border border-border`.

### Pour les apps consommatrices

Les classes défensives posées sur les `<button>` nus pour compenser ce défaut —
`bg-transparent`, `font-body`, `py-0` et apparentées — **deviennent redondantes** et peuvent
être retirées au prochain bump.

### La couleur de bordure par défaut est reposée par le socle

C'est la suite directe du point précédent, et elle renverse la conclusion de la première
version de ce lot. `tokens/base.css` repose le défaut, tout en haut :

```css
*,::after,::before,::backdrop,::file-selector-button{border-color:var(--border,currentColor)}
```

Deux raisons. **La doctrine** : le socle fournit les valeurs, l'app écrit les noms — un
défaut `currentColor` dit l'inverse, il fait dépendre la bordure d'une propriété de texte que
l'app n'a pas choisie pour ça. **Le mode de panne est silencieux** : sur une page crème à
encre sombre, un `border` nu trace un filet quasi noir là où on attendait le gris doux de
`--border`.

La liste des cinq sélecteurs recopie celle du preflight, sinon un élément échapperait au
défaut. Le cas rare — une bordure qui suit la couleur du texte — s'écrit `border-current`, un
mot, et c'est bien lui qui doit coûter les mots ; vérifié : l'utilitaire l'emporte, les
couches le placent au-dessus de `layer(base)`. Le repli `currentColor` n'est pas décoratif :
un socle monté **sans** fichier de marque retrouve exactement le comportement d'amont.

Aucun composant du système n'est concerné — vérifié règle par règle, aucune ne pose une
largeur de bordure sans poser sa couleur.

### `check-preflight-drift.mjs` — le dixième garde

La copie versée est figée à Tailwind 4.3.3, et son en-tête prescrit une *procédure écrite*
pour suivre les montées. Ce dépôt a déjà établi qu'une procédure écrite ne tient pas — c'est
littéralement pourquoi `check-version.mjs` existe, après trois oublis de suite. Le onzième
mois, Tailwind passe en 4.5, la copie ne bouge pas, et personne ne le sait.

Le garde compare la copie à `node_modules/tailwindcss/preflight.css`, coupes et commentaires
retirés des deux côtés : ce qui compte est qu'aucune **déclaration** n'ait bougé. La version
attendue est lue dans l'en-tête de la copie — un numéro noté à deux endroits est un numéro
qui divergera.

**Il n'échoue jamais**, `exit 0` dans tous les cas, et c'est délibéré : une montée de
Tailwind est légitime, l'arbitrage est humain, et `tailwindcss` est un peer **optionnel** —
un garde bloquant sur un paquet facultatif casserait la CI pour la mauvaise raison. Sa valeur
est de rendre la dérive **visible**, pas de l'interdire.

`check-portage.sh` gagne les deux points que ce lot pose et passe de 15 à **17**. Son point
« icône de nav active » est recalé sur `--primary` — il a d'ailleurs attrapé le changement
tout seul, ce qui est exactement son métier.

`check-token-refs.mjs` gagne une échappatoire jumelle, `@tokenref-fallback:` : sans elle il
répétait à chaque `lint` qu'un repli « pérennise le trou » sur la ligne où le repli **est** la
décision. Un garde qui a tort une fois par jour finit par être ignoré.

---

## L'addenda v0.8.0, appliqué

Quatre points étaient restés dans leur état d'avant.

### La pente de `--sidebar-w` était inopérante

`clamp(16rem,15vw,23rem)` → **`clamp(17rem,10rem + 7vw,21rem)`** (272 → 336).

En `15vw` pur, un écran de 1440 donne 216px — **sous le plancher**. La barre restait donc
figée à 256 sur tous les écrans de bureau courants, et n'atteignait son plafond de 368
qu'au-delà de 2450, où elle est devenue un couloir vide : le `clamp()` ne servait à rien dans
la plage où vivent les écrans réels.

La forme « base en rem + pente en vw » décolle vers 1600. Mesuré : **272** jusqu'à 1600,
**294** à 1920, **328** à 2400, **336** au-delà de 2514. Le plancher monte, le plafond
descend — l'écart utile se resserre là où les écrans existent.

Le commentaire dit maintenant ce qui manquait : **c'est le plancher le vrai réglage**, pas le
plafond, parce qu'il gouverne tous les écrans de bureau courants. Sans cette phrase, quelqu'un
ajuste le plafond en croyant agir sur ce qu'il voit.

### Un seul bord optique gauche dans la barre latérale

Une entrée porte `padding: 0 var(--space-4)` pour que sa pilule de survol dépasse du texte.
L'en-tête n'a pas de pilule, donc n'avait pas de retrait : **le logo commençait 16px à gauche
des icônes qu'il surplombe.** L'en-tête, le titre de section et le pied reprennent le retrait
de l'entrée.

C'est le bord du **contenu**, pas celui de la boîte : la marge extérieure de la barre
(`--space-5`) ne bouge pas, ces retraits s'y ajoutent. **Le retrait doit rester égal à celui
de `.ds-sidenav`** — si l'un bouge, les autres suivent.

Deux décalages fermés au passage : le **titre de section** était à `--space-3`, soit 4px à
gauche des entrées qu'il coiffe — assez petit pour ne pas se voir, assez grand pour salir la
colonne ; et l'**avatar du pied**, qui ne s'alignait sur rien. En replié, l'en-tête et le pied
perdent ce retrait comme l'entrée le fait déjà, sinon le logo se décentre.

Vérifié à 1280 : logo, titre de section, icône d'entrée et pied tous à **167px** — une seule
verticale. Replié : logo et icône centrés sur le milieu de la barre.

### Les deux icônes de marque passent sur `--primary`

```css
.ds-sidenav.is-active svg{color:var(--primary)}   /* était --brand-via */
.ds-pastille--brand{background:var(--grad-soft);color:var(--primary)}
```

L'icône d'item actif passe de **2,32 à 3,00:1** en clair (3,78 en sombre), la pastille de
**2,34 à 3,08** (3,14 en sombre). Les deux atteignent le seuil des graphiques non textuels :
**les deux cessent d'être des écarts assumés**, et le bloc `@a11y-assume` de la pastille est
retiré plutôt que mis à jour — un bloc qui survit à sa raison d'être fait croire à un problème
qui n'existe plus. Le compte passe de **14 à 13**.

*Contrepartie assumée* : en sombre, `--primary` est plus dense que `--brand-via` sur la
plaque. La marque gagne en densité ce qu'elle perd en éclat. Repli si l'écart déplaît :
`--primary-readable` (5,16 / 5,62).

La règle consolidée est écrite une fois, au-dessus de `.ds-pastille--brand`, et reprise dans
`docs/accessibilite.md` § 1.1 — une icône se colore selon **ce qu'elle porte** : décorative →
`currentColor` ; décorative mais de marque → `--primary` ; porteuse d'information →
`--primary-readable`. **Ces deux emplois sont les seuls** où `--primary` touche du non-texte.
Et **les tons sémantiques ne suivent pas** : `success` / `warning` / `danger` gardent leur
couleur lisible, parce qu'ils portent un statut.

### La pastille du logo grossit

`0.21em` → **`0.26em`**, marge gauche `0.07` → `0.08em`, marge basse `0.03` → `0.02em`. À
0,21 elle se lisait comme un **point de ponctuation** plutôt que comme une marque. Tout est en
`em` : elle suit le corps du mot-marque à toutes les tailles, de 16px dans une barre latérale à
108px sur la tuile de marque. Le rayon reste à 25 % du côté — un carré à coins adoucis, jamais
un cercle.

---

Le correctif preflight est également appliqué à `design-system-template`, pour qu'un design
system client ne naisse pas avec un bug déjà corrigé ailleurs.

## 0.9.0 — l'icône d'une pastille de marque est décorative

Un jeton lu, une règle changée, et la doctrine qui va avec.

```css
.ds-pastille--brand{background:var(--grad-soft);color:var(--brand-via)}  /* était --primary-readable */
```

`--primary-readable` (`#b23a1c`) y sortait à **5,30** — le seuil était tenu — mais un
brun-brique sombre sur un lavis chaud se lit comme de l'encre colorée plutôt que comme la
marque. C'est le plus visible dans un état vide, où la pastille fait 80 px.

### La règle, et elle vaut partout

Une icône se colore selon ce qu'elle **porte**, pas selon l'endroit où elle est :

| l'icône est… | sa couleur | exemples |
|---|---|---|
| décorative | `currentColor` | elle suit son texte |
| décorative mais **de marque** | `--brand-via` | pastille d'état vide, pastille d'en-tête de carte, icône de l'item de nav actif |
| **porteuse d'information** | `--primary-readable` | message d'erreur, jour courant, état |

`--primary` n'est **jamais** une couleur d'icône : 3,00 sur `--surface-alt`, 3,03 sur un
lavis de marque. Il reste un aplat — CTA, piste de switch, case cochée.

**Les tons sémantiques ne suivent PAS.** `success`, `warning`, `danger`, `coral`, `amber`,
`neutral` gardent leur couleur lisible : une pastille de statut porte une information. C'est
toute la différence entre décorer et informer, et c'est la ligne qu'on cassera un jour en
voulant « harmoniser ».

### L'écart mesuré

**2,34 à 2,38** en clair selon l'arrêt du lavis, **4,07 à 4,85** en sombre. Sous 3:1 en
clair, et c'est admis : un graphique purement décoratif n'a pas de seuil à tenir, précisément
parce qu'il ne porte rien seul — le titre et la description disent tout.

`check-contrast.mjs` scannait cette paire avec `--primary-readable` en dur. La paire mesurée
suit maintenant ce que le CSS peint (`--brand-via`) — un garde qui mesure une couleur que
plus personne n'affiche est pire qu'un garde absent — et l'écart est déclaré par un
`@a11y-assume` dans le fichier de marque. Le compte passe de **13 à 14**.

### `docs/accessibilite.md` rattrape la v0.8.0

Le document portait encore les ratios d'avant la 0.8.0 : `--ring` à 3,12, le remplissage du
champ à 1,12, « le seul blanc pur du thème clair ». Les deux tableaux sont **régénérés**
depuis `node check-contrast.mjs --table`, les comptes corrigés (36 conformes, 14 assumées),
et deux sections manquantes ajoutées — **3.4** l'anneau de focus, **3.5** l'icône décorative
de marque. La règle de coloration des icônes entre aussi dans `docs/DESIGN.md` et la fiche
`Pastille` de `docs/PROMPTS.md`.

Aucun jeton ajouté ni retiré, aucune prop touchée, contrat inchangé : **54 / 32**.

## 0.8.0 — les surfaces sortent du blanc, les marges respirent, un neuvième garde

Le rendu de **tout ce qui est posé sur la mise en page** change, dans les deux thèmes.
Aucune prop publique de composant n'est retirée sauf une, listée en rupture ci-dessous.

### Le blanc pur quitte les surfaces

`--secondary` — le remplissage du bouton secondaire, de la navbar, de la barre latérale, de
la barre d'onglets, de la pagination, des champs et des barres de recherche — passe de
`#ffffff` à **`#fbf8f3`** en clair et de `#37352f` à **`#2b2a28`** en sombre. Sur une page
crème, un champ de recherche en blanc pur ne se posait pas dessus : il tranchait.

En sombre, `--secondary` prend la valeur **exacte** de `--card`. Une barre latérale et les
cartes posées à sa droite sont la même hauteur de plan ; ce qui les sépare est le filet et
la mise en page, pas un troisième ton. Effet de bord réparé au passage : à `#37352f`,
`--secondary` était plus CLAIR que `--surface-alt`, donc un survol sur la barre latérale ou
un item de menu **assombrissait** la surface — l'inverse de ce qu'un survol doit faire en
thème sombre. Il l'éclaircit maintenant.

L'échelle des surfaces, après ce lot :

```
clair   muted #f1ece4 < surface-alt #f6ede2 < background #f6f2ec < card #faf7f2
        < secondary #fbf8f3 < popover #fdfbf8
sombre  background #1f1e1c < muted #262523 < card = secondary #2b2a28
        < popover #302e2b < surface-alt #32302d
```

### Un contrôle déduit sa porteuse

C'est la contrepartie indispensable du point précédent. Un bouton secondaire posé dans une
carte aurait eu **1,009** d'écart avec elle — invisible. Il bascule sur `--background` :
**1,044** en clair, **1,162** en sombre. La doctrine, déjà appliquée au champ et à la barre
d'onglets, couvre maintenant **quatre familles** : champ, barre d'onglets, menu déroulant,
bouton secondaire. Une surface se lit à son écart avec ce qui la porte, jamais dans l'absolu.

### Ce qui déroule sous un champ s'aligne sur lui

`.ds-dropdown`, `.ds-datepicker__pop` et `.ds-cal` passent de `--popover` à `--secondary` :
ils sont la continuation visuelle du contrôle qui les ouvre, et sur `--popover` ils étaient
un cran plus clairs que leur propre champ. **Posés dans une carte ou une modale, ils
retombent sur `--popover`** et continuent de flotter. `.ds-modal` et `.ds-actionsheet`
restent sur `--popover` : une modale est une grande plaque qui flotte au-dessus de tout,
pas la continuation d'un champ.

### Le focus du champ : un trait, plus un halo

Le champ recevait à la fois l'`outline` générique de `tokens/base.css` (2px, décalé de 2px)
ET son bord en `--ring` : deux traits concentriques autour du même contrôle. L'outline est
neutralisé **sur `.ds-input` seulement** ; partout ailleurs il reste le seul marqueur.

`--ring` passe de `--primary` (`#e85d2f`) à **`--brand-via` (`#f08029`)**, l'arrêt médian du
dégradé — décision de marque, prise en connaissance de la mesure : 2,41:1 sur la page, sous
le plancher de 3:1. Le halo de 3px, le même que celui des boutons, rend en **surface** ce
que le trait perd en contraste. **Ne pas le retirer sans remonter `--ring` à `--brand-to`.**
En sombre `--ring` ne bouge pas (`#f5a524`, 8,16).

### Les marges intérieures prennent un cran

`--card-pad` 24 → **28**, `--card-pad-lg` 28 → **32**. La modale prend le **même** padding
que la carte, et par le même jeton : deux surfaces de contenu, un seul levier.
Toast `1rem 1.125rem`, bandeau `1.125rem 1.25rem`, champ `0.6875rem 1rem` (l'horizontal
seul — la hauteur reste gouvernée par `--control-md`), item de menu `0.625rem 0.8125rem`,
barre latérale `--space-5`, entrée de nav `0 --space-4`. `.ds-card--flush` reste à 0 : les
tableaux à ras gardent leur densité.

`--space-5` n'est **pas** augmenté, et c'est délibéré : il porte la gouttière du voile, le
gap de la navbar, le plancher de safe-area et la gouttière de `.page` — quatre rôles qui ne
sont pas des marges intérieures.

### Toast et bandeau centrent leur contenu

`align-items` passe de `flex-start` à `center`. En `flex-start`, la pastille et la croix de
fermeture se collaient au haut du bloc : sur un message à deux lignes ça se lit comme un
défaut d'alignement. Le nudge optique d'1px de `.ds-banner__icon` disparaît avec la raison
qui le justifiait. *Contrepartie acceptée* : sur une description de trois lignes ou plus,
l'icône se trouve au milieu du bloc plutôt qu'en regard du titre.

### La barre latérale suit la fenêtre

`--sidebar-w` : `16rem` fixe → **`clamp(16rem,15vw,23rem)`** (256 → 368). 16rem est la bonne
largeur sur un portable et une bande étriquée sur un 27 pouces. C'est le **seul jeton du
socle qui mêle `rem` et `vw`**, et c'est assumé : une largeur de couloir doit suivre la
FENÊTRE, pas la préférence de taille de texte. Les paliers de `app-scale.css` agissent sur
la racine, donc sur le plancher et le plafond en rem — les deux mécanismes se composent.

`--sidenav-h` : 40 → **44**. L'entrée de navigation, cible la plus cliquée d'une coque
d'outil, était sous le seuil tactile que le reste du système tient déjà. Son rayon passe de
`--radius-sm` à `--radius-md` : à 44 de haut, la pilule active a la place de se lire comme
une pilule.

### ⚠ Rupture — plus de séparateur dans `ActionSheet`

L'item `separator` de `ActionSheetItem` est **retiré**, avec la règle
`.ds-actionsheet__sep` et le `<hr>` que le composant émettait avant « Annuler ». Une feuille
du bas est haute, aérée, parcourue au pouce : le rythme des lignes suffit, et l'action
destructrice se signale déjà par sa couleur. **`Dropdown` garde le sien** — il est dense,
survolé à la souris, et le filet y sépare l'action destructrice du reste.

*Migration* : retirer les entrées `{ separator: true }` des `items` d'un `ActionSheet`.
TypeScript signale les occurrences restantes.

### Neuvième garde — `check-token-refs.mjs`

Tout `var(--x)` lu par le CSS du système ou par un style inline de composant doit
correspondre à un `--x:` déclaré. Il est branché **en tête** de `npm run lint` : c'est le
moins cher, et un jeton manquant rend le diagnostic des autres trompeur.

**Le défaut qu'il ferme.** Un portage a livré un `patterns.css` qui lisait
`var(--text-body-sm)` en treize endroits sans que le jeton soit déclaré. Un `var()` non
résolu ne rend pas la déclaration « ignorée », il la rend **invalide at computed-value
time** — ce qui, pour `font-size`, signifie `inherit`. `.ds-btn--sm` héritait donc le corps
de texte du parent (16px) au lieu du `--text-control` de `.ds-btn` (15px) : le bouton
`size="sm"` rendait plus **gros** qu'un `md`. Les huit autres gardes mesurent des valeurs ou
une complétude de liste ; aucun ne vérifiait que ce que le CSS *lit* existe.

`theme.css` est **exclu** du balayage des déclarations, et toute déclaration valant
exactement `var(--<même-nom>)` est ignorée où qu'elle soit : le pont Tailwind y écrit
`--text-body-sm: var(--text-body-sm)`, et un scanner naïf y verrait une déclaration —
il passerait au vert sur le bug exact qu'il doit attraper. Pas de détection de jeton mort :
les alias historiques sont déclarés exprès sans consommateur.

`var(--x, repli)` n'est pas une erreur mais sort en ligne `⚠ fallback`. Échappatoire, raison
obligatoire : `/* @tokenref-assume: --x — qui le fournit, et pourquoi pas nous */`.

### Écarts assumés

Le compte de `check-contrast` passe de **12 à 13** (`anneau de focus --ring sur
--background`). `check-surfaces` porte désormais **deux `@surface-assume`** — `--secondary /
--card` en clair (1,009) et en sombre (1,000) : le garde mesure chaque paire **par thème**,
la clé d'un écart assumé nomme donc son thème. Contrat inchangé : **54 / 32**, aucun jeton
ajouté ni retiré.

## 0.7.2 — `Sidebar` porte des entrées en pied

Nouvelle prop `footerItems`, de même forme que les entrées de `sections`.

**Le manque qu'elle comble.** Le slot `footer` est une rangée horizontale à filet haut,
calibrée pour « avatar + nom ». Une app qui veut y poser une déconnexion ou un accès aux
réglages devait donc redessiner elle-même l'apparence d'une entrée — c'est-à-dire s'appuyer
sur `.ds-sidenav`, une classe **interne** que le socle peut renommer sans prévenir. Le
besoin est pourtant universel : toute coque d'outil pose en bas ce qui n'est pas une
destination de contenu.

Les entrées de pied empruntent **le même rendu** que celles de la navigation — même classe,
même état actif, même `linkAs`. Le rendu d'une entrée a été extrait en une fonction unique
que les deux traversent : elles ne *peuvent* plus diverger, et c'est le point.

Nouveau `.ds-sidebar__footnav` : une colonne d'entrées séparée par un filet, distincte de
`.ds-sidebar__foot` qui reste la rangée « avatar + nom ». Les deux cohabitent.

Aucune app existante n'est affectée : sans `footerItems`, le rendu est identique.

## 0.7.1 — `Sidebar` accepte le lien d'un routeur client

Nouvelle prop `linkAs` sur `Sidebar`. Défaut inchangé : `'a'`.

**Le mur qu'elle abat.** Une entrée portant un `href` était rendue en `<a href>` nu. Dans
une app à routeur client — react-router, TanStack Router — chaque clic **rechargeait la page
entière**. Il ne restait qu'à passer `onClick` sans `href`, ce qui rend un `<button>` : la
navigation fonctionne, mais l'entrée cesse d'être un lien — plus de clic-milieu, plus
d'« ouvrir dans un onglet », et un lecteur d'écran annonce un bouton là où il devrait
annoncer un lien.

Le composant était donc inutilisable dans son cas d'usage principal, et chaque app finissait
par réécrire sa barre — ce qui vide un design system de son sens.

```tsx
<Sidebar linkAs={NavLink} sections={[{ items: [{ label: 'Accueil', href: '/' }] }]} />
```

`href` arrive au composant en **`to`**, la prop que ces routeurs attendent tous.
`className`, `aria-current` et l'état actif restent calculés par le socle : il garde la main
sur l'apparence et l'accessibilité, l'app ne fournit que la mécanique de navigation.

Aucune app existante n'est affectée : sans `linkAs`, le rendu est identique.

## 0.7.0 — le dégradé partout où la marque se remplit, et la barre latérale qui colle

### Cinq remplissages passent de l'aplat au dégradé

`--primary` remplissait encore la case à cocher (cochée et indéterminée), la pastille du
radio, la piste de l'interrupteur, et le jour sélectionné du calendrier. Tous portent
désormais `--brand-gradient`.

C'est la suite directe de la 0.6.0, et la même doctrine — celle que la marque énonce
elle-même : « `--primary` est une couleur de REMPLISSAGE. Le CTA réel porte
`--brand-gradient`, pas cet aplat. » Le socle l'appliquait aux boutons, puis à la barre de
progression ; il la tient maintenant partout où un contrôle se remplit de la marque.
L'aplat reste ce que la marque dit qu'il est : un repli et une piste.

Le contour des cases cochées passe à `--brand-to`, l'arrêt le plus soutenu — un contour
dégradé sur 1 px ne se lirait pas.

### La barre latérale colle, au-dessus du seuil mobile

`.ds-appshell` est une grille en `align-items:stretch` : la cellule de la barre s'étirait à
la hauteur du **document**. Sur une page longue, le logo et la navigation sortaient donc de
l'écran au défilement — ce qu'une coque d'outil ne doit pas faire, et ce qui forçait les
apps à réécrire leur propre barre.

Au-dessus de 64,0625 rem, `.ds-sidebar` est désormais `position:sticky; top:0;
height:100dvh; align-self:start`. **`align-self:start` est indispensable** : le `stretch` de
la grille annulerait le `sticky` sans lui. Le document continue de défiler normalement, ce
qui laisse fonctionner les barres `sticky top-0` des écrans sans compensation de décalage.
Sous le seuil, la barre redevient un tiroir, inchangée.

### L'icône de l'item de nav actif porte `--brand-via`

Elle était en `--primary-readable`. Elle porte l'arrêt **médian** du dégradé.

⚠️ **Écart de contraste assumé et mesuré : 2,29:1 en clair, 5,34:1 en sombre.** En thème
clair l'icône est donc pâle — c'est un choix de marque, pas un oubli, et il est écrit en
regard de la règle. Ce qui le rend tenable : l'état actif est déjà porté par le **fond** et
par la **graisse** du libellé, lequel reste en `--foreground`. L'icône est un renfort
décoratif, jamais le seul porteur de l'information. Repli si l'écart déplaît :
`--primary-readable` (5,09).

## 0.6.0 — la barre de progression porte le dégradé de marque

`.ds-progress__bar` remplissait en `--primary`, un aplat. Il porte désormais
`--brand-gradient`.

**Ce n'est pas un goût, c'est la doctrine que la marque énonce déjà elle-même**, dans
`brand-julien-fernandes.css` : « `--primary` est une couleur de REMPLISSAGE. Le CTA réel
porte `--brand-gradient`, pas cet aplat ; l'aplat sert de repli et de piste de switch. »
Le socle l'appliquait à `.ds-btn--primary` et `.ds-icon-btn--primary`, et l'avait oubliée
sur la barre — l'endroit où une marque raconte le plus : l'avancement.

La **piste** reste `--surface-alt`. C'est un creux, pas une surface de marque.

**Changement visuel pour toute app qui affiche une `Progress`** — d'où le bump mineur et non
un patch. Aucun changement d'API : ni prop, ni variante. `--brand-gradient` est calculé par
le socle depuis les arrêts de la marque, il est donc toujours disponible.

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
