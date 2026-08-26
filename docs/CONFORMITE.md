# Checklist de conformité — v0.2.2

> Recette du portage du design system Julien Fernandes vers `@julienfernandes/ds`.
> Règle appliquée : **PORT, pas réinterprétation.** Toute valeur vient des sources du kit.
> Aucune valeur n'a été inventée. Les écarts sont listés en fin de document, sans exception.

**Kit source : `Portage V3` (26/08/2026).** La v0.1.0 venait du kit v1, la v0.2.0 du kit v2 ;
ce document reflète l'état après le kit V3 (variantes de Table, retrait de MetricPill côté maître).

Sources de vérité utilisées :
`tokens/*.css` · `patterns.css` · `components/**/*.jsx` (rendu) · `components/**/*.d.ts` (contrat de props) ·
`components/PROMPTS.md` (usage) · `readme.md` (règles) · `portage-github/README.md` (architecture).

---

## 0. Socle

| Élément | État | Vérification |
|---|---|---|
| `src/styles/tokens/fonts.css` | ✓ verbatim | `diff` identique à la source |
| `src/styles/tokens/colors.css` | ✓ verbatim v2 | seul le commentaire d'entête change : le blanc pur `--secondary` est réservé aux contrôles posés à même le layout |
| `src/styles/tokens/typography.css` | ✓ verbatim | `diff` identique |
| `src/styles/tokens/scales.css` | ✓ verbatim v2 | rayons contrôles resserrés (`--radius-sm` 0.625 · `--radius-md` 0.75), rail **unique** (`--control-sm` et les trois `--icon-control-*` aliasent `--control-md`), media query mobile `@media (max-width:64rem)` → `--control-md:2.75rem` |
| `src/styles/tokens/base.css` | ✓ verbatim | `diff` identique |
| `src/styles/patterns.css` | ⚠ verbatim V3 **+ 4 règles en avance** | voir **écart 25** | + `.jf-table--framed` (contour 1px `--border`, `--radius-lg`, coins internes `calc(… - 1px)`, fond `--card`, en-tête `--background`) et `.jf-table--columns` (séparateurs verticaux 1px). Reste v2 pour le reste : | focus champ = bordure seule (anneau 3px supprimé) · `.jf-input` sur `--secondary`, modificateur `--on-card` · tabs hors pill · navbar toujours `--secondary` · dropdown en `--radius-lg` · bloc `content` supprimé · 7 nouveaux blocs |
| `src/styles/index.css` | ✓ port de `styles.css` | `@import` uniquement, même ordre, mêmes commentaires |
| `assets/fonts/` (Anton-400, JetBrainsMono-400/500) | ✓ copiés | + duplicata dans `src/styles/assets/fonts/` — voir **écart 2** |
| `assets/logo/` (10 PNG) | ✓ copiés | non modifiés |
| `docs/readme.md` | ✓ verbatim V3 | non modifié. Le maître y documente désormais lui-même le retrait de `MetricPill` |
| `docs/PROMPTS.md` | ✓ verbatim V3 | non modifié. **L'entorse au verbatim est résorbée** : le kit V3 a supprimé la section `## MetricPill`, la copie est de nouveau intégrale — voir **écart 18** |
| `src/styles/app-scale.css` | ✓ verbatim v2 | module opt-in, **non importé** par `index.css` — export `./app-scale.css` |
| `src/tailwind-preset.ts` | ✓ **`fontSize` en remplacement** | v0.2.2 : le bloc `fontSize` quitte `theme.extend` pour `theme`. L'échelle native (`text-xs`…`text-9xl`) n'est plus générable — une régression casse au lieu de retomber sur `text-sm`. Tout le reste est en `extend`. | **0 littéral** — grep hex / rgb / px / rem / ms : aucun résultat hors commentaires |
| `package.json` exports | ✓ clés de la spec | `.` · `./styles.css` · `./app-scale.css` · `./preset` · `./assets/*` — voir **écart 1** |
| `darkMode: ['class']` | ✓ | scope `.dark`, jamais un media query |
| `npm run build` | ✓ | tsup ESM + CJS + `.d.ts`, `tsc --noEmit` sans erreur |

### Preset — couverture des tokens

| Clé Tailwind | Tokens branchés |
|---|---|
| `colors` | `--background --foreground --card(-foreground) --popover(-foreground) --primary(-foreground) --secondary(-foreground) --muted(-foreground) --accent(-foreground) --destructive(-foreground) --border --input --ring --ink --ink-soft --ink-deep --cream --cream-alt --text-secondary --text-muted --text-inverted --brand-from --brand-via --brand-to --pill-*-bg/fg --overlay-play-bg --grid-line` |
| `backgroundImage` | `--brand-gradient --brand-gradient-diagonal --grad-soft --gradient-halo --gradient-thumbnail --gradient-thumbnail-fit` |
| `backgroundSize` | `--grid-cell --grid-cell-lg` |
| `borderRadius` | `--radius --radius-badge --radius-sm --radius-md --radius-lg --radius-xl --radius-2xl --radius-pill` |
| `boxShadow` | `--shadow-sm --shadow-md --shadow-lg --shadow-soft --shadow-soft-lg --shadow-glow --shadow-glow-lg` |
| `fontFamily` | `--font-display --font-body --font-mono` |
| `fontSize` | les 12 paliers de `typography.css`, chacun apparié à son `--leading-*` et son `--tracking-*` comme dans `base.css` |
| `fontWeight` | `--weight-regular/medium/semibold/bold` |
| `letterSpacing` | les 9 `--tracking-*` |
| `lineHeight` | les 7 `--leading-*` |
| `spacing` | `--space-1…8`, `--control-sm/md/lg`, `--icon-control-sm/md/lg`, `--card-pad`, `--card-pad-lg` |
| `maxWidth` | `--container-shell/wide/read/narrow`, `--page-max` |
| `transitionTimingFunction` | `--ease-standard` |

---

## 1. Icônes

### `Icon`
- **Contrat** : `name` (39 valeurs), `size`, `strokeWidth`, `className`, `style` — identique au `.d.ts`. Retourne `null` sur un nom inconnu.
- **Défauts** : `size='1.25rem'`, `strokeWidth={2}` ✓
- **Tailles** : `1rem` · `1.25rem` · `1.5rem` ✓ posées en CSS (`style.width/height`), viewBox 24×24 sans unité ✓
- **Graisses** : 2 · 2.5 (pills, toasts) · 3 (check) ✓
- **Couleur** : `currentColor` ✓
- **Tracés** : `lucide-react` (cible prod imposée par la spec). Les 39 noms résolvent — vérifié à l'exécution.
- **Traçabilité** : aucune valeur de couleur ni de taille codée en dur.

---

## 2. Actions

### `Button`
| Contrôle | État |
|---|---|
| Variantes `primary · secondary · ghost · danger` | ✓ 4/4 → `.jf-btn--*` |
| Tailles `sm · md · lg` | ✓ 3/3 → `--control-sm` 2.375rem · base 3rem · `--control-lg` 3.25rem |
| hover / active / focus / disabled / loading | ✓ 5/5 (`patterns.css`, + helpers `is-hover`/`is-active`/`is-focus` dans la démo) |
| `icon` / `iconRight` / `fullWidth` / `as` | ✓ |
| Défauts `variant='primary' size='md' loading=false disabled=false fullWidth=false as='button'` | ✓ identiques à la source |
| Rayon | `--radius-md` — **jamais pill** ✓ |
| Glow | `--shadow-glow` sur `primary` seul ; hover → `--shadow-glow-lg` + `translateY(-1px)` ; press → `translateY(1px)` ✓ |
| Taille d'icône dérivée | `sm → 1rem`, sinon `1.25rem` — comme la source ✓ |

**Traçabilité** : fond `--brand-gradient` · texte `--primary-foreground` · secondaire `--secondary` + bordure 1.5px `--border` → hover `--accent` / `--primary` · ghost hover `--accent` · danger `--destructive` / `--destructive-foreground` · focus `color-mix(--ring 35%)` · police `--font-body` / `--text-control` / `--weight-semibold` · transitions `--ease-standard`. Toutes ces valeurs viennent de `patterns.css`, copié verbatim.

### `IconButton`
| Contrôle | État |
|---|---|
| Variantes `primary · secondary · ghost · danger` | ✓ 4/4 |
| Tailles `sm 2.375rem · md 2.625rem · lg 3rem` | ✓ 3/3 → `--icon-control-*` |
| hover / focus / actif (`aria-pressed`) / disabled | ✓ 4/4 |
| Défauts `variant='ghost' size='md'` | ✓ |
| `label` → `aria-label` + `title` | ✓ |
| Rayon `--radius-md`, carré, jamais pill | ✓ |

---

## 3. Formulaires

### `Input`
- Tailles `sm · md · lg` ✓ (`--control-sm/md/lg`, `md` = base) · `surface='card' | 'page'` ✓ · `invalid` ✓
- États : repos · focus (bordure `--ring` + anneau `color-mix(--ring 22%)`) · erreur (`--destructive` + anneau 22 %) · disabled (`--muted` / `--muted-foreground`) ✓
- Bordure 1.5px `--input` · rayon `--radius-md` · police `--text-control` · placeholder `--text-muted` ✓ — jamais pill ✓
- **Écart TS** : `Omit<…,'size'>` obligatoire (voir écart 5).

### `Textarea`
- `rows` (défaut 4) ✓ · `invalid` ✓ · hauteur auto, `resize:vertical`, aucun `min-height` ✓ · `--leading-normal` ✓

### `Select`
- Select **natif** sur le rail 3rem ✓ · `options` ✓ · `invalid` ✓ · `surface` ✓ · chevron Lucide `chevron-down` 1.125rem positionné à `--space-4` ✓

### `Checkbox`
- Case 1.25rem, rayon `0.4375rem`, bordure 1.5px `--input` ✓ · check Lucide `0.8125rem` strokeWidth 3 ✓
- États : repos · hover (`--primary`) · coché (`--primary`) · focus (anneau 35 %) · disabled ✓

### `Radio`
- Cercle 1.25rem (`--radius-pill`), point 0.625rem `--primary` ✓ — le seul contrôle circulaire du système ✓
- États : repos · hover · coché · focus · disabled ✓

### `Switch`
- Piste 2.75 × 1.625rem `--radius-pill`, knob 1.25rem, course `translateX(1.125rem)` ✓
- États : off (`--border`) · on (`--primary`) · focus · disabled ✓
- `role="switch"` ✓

### `FormField`
- `label` / `htmlFor` / `help` / `error` / `required` ✓ · l'erreur remplace l'aide ✓
- Erreur = **couleur + icône + texte** (`circle-alert` 0.875rem strokeWidth 2.5, `--destructive`) ✓
- Astérisque `required` en `--primary` ✓

---

## 4. Data display

> **`MetricPill` est hors périmètre.** Sorti du socle le 26/08/2026 sur ta décision : c'est un
> composant métier, il vit dans l'app qui en a besoin. Le fichier, l'export et la page de démo ont
> été retirés. `patterns.css` conserve `.jf-metric`, `.jf-metric--solid` et `.jf-metric--coral`
> (fichier copié verbatim, jamais édité) : une app peut donc reconstruire sa propre pill de métrique
> sans réinventer une seule valeur. Voir **écart 18**.

### `Card`
| Contrôle | État |
|---|---|
| Variantes `default · interactive · feature` | ✓ 3/3 |
| Tailles `md` (rayon `--radius-lg`, `--card-pad`) · `lg` (rayon `--radius-xl`, `--card-pad-lg`) | ✓ 2/2 |
| `flush` (padding 0 + overflow hidden) · `as` | ✓ |
| hover `translateY(-2px)` → `--shadow-md` · press → `--shadow-sm` · focus anneau 35 % | ✓ 3/3 |
| `feature` = `--grad-soft` + bordure `color-mix(--brand-from 28%)` | ✓ |
| Fond `--card`, bordure 1px `--border`, `--shadow-sm` — jamais blanche | ✓ |

### `Badge`
- 8 tons `coral · amber · danger · warning · success · neutral · accent · outline` ✓ 8/8 → `--pill-*-bg/fg`
- Rayon `--radius-pill` (légal ici) ✓ · slot `icon` ✓ · défaut `neutral` ✓

### `Tooltip`
- Placements `top · bottom` ✓ 2/2 · `open` forcé ✓
- Bulle `--ink` / `--text-inverted`, `--cream-alt` / `--ink` en `.dark` ✓ · `--shadow-lg` ✓ · ouverture sur `:hover` et `:focus-within` ✓

---

## 5. Feedback

### `Toast`
- 4 tons `success · danger · warning · info` ✓ 4/4 — tuile 1.5rem `--radius-sm`, glyphes strokeWidth 2.5 ✓
- `onClose` optionnel (bouton `aria-label="Fermer"`) ✓ · `role="status"` ✓ · `--shadow-lg`, `--popover` ✓
- Toujours couleur + icône + texte ✓

### `Banner`
- 4 tons `danger · warning · success · info` ✓ 4/4 · `title` · `action` · corps ✓ · `role="note"` ✓
- Icônes mappées à l'identique : danger/warning → `triangle-alert`, success → `circle-check`, info → `info` ✓

### `EmptyState`
- Bordure **pointillée** `--border` ✓ · tuile d'icône 3.25rem `--grad-soft` + bordure `color-mix(--primary 22%)` ✓
- Titre en `h4` (Anton) ✓ · `description` ✓ · `action` ✓ · nomme le vide + donne l'étape suivante (copy de démo) ✓

### `Skeleton`
- `width` / `height` / `radius` ✓ · shimmer 1.4s linéaire, `background-size:560px` ✓ · `aria-hidden` ✓

### `SkeletonCard`
- `media` (16/9) ✓ · `lines` ✓ · dernière ligne à 50 %, les autres à 80 % ✓ · rendu dans une `Card flush` ✓

---

## 6. Overlays

### `Modal`
- `open` · `icon` · `iconVariant danger | brand | neutral` (✓ 3/3) · `title` · `description` · `footer` · `onClose` · `inline` ✓
- Scrim `color-mix(--ink 45%)` + `blur(2px)` ✓ · panneau 23.75rem, `--radius-2xl`, `--shadow-lg`, `--popover` ✓
- Tuile d'icône 2.625rem `--radius-md` ✓ · bouton fermer 2rem `--radius-sm` ✓
- **Ajout comportemental** (écart 4) : Échap, piège de focus, restitution du focus. Aucun changement de DOM ni de style.

### `Dropdown`
- `items` avec `label` / `icon` / `hint` / `danger` / `separator` / `onSelect` ✓ 6/6 · `inline` ✓
- Panneau 14.375rem, `--radius-2xl`, `--shadow-lg` ✓ · item hover/focus `--accent` ✓ · item danger `--destructive` ✓ · séparateur 1px `--border` ✓
- `role="menu"` / `role="menuitem"` ✓

---

## 7. Navigation

### `Navbar`
- `links` (avec `active`) · `cta` · `tone` · `scrolled` forcé · `children` ✓
- Repos transparent ↔ scrollé `color-mix(--card 82%)` + `backdrop-filter: blur(10px)` + bordure `--border` + `--shadow-sm` ✓
- Détection auto du scroll (`window.scrollY > 8`) ✓ · hauteur 4.5rem ✓ · lien actif `--primary` ✓
- Seul endroit du système avec `backdrop-filter` ✓ — voir écarts 9 et 10.

### `Tabs`
- `items` · `value` · `onChange` ✓ · pill `--radius-pill` sur `--muted` (légal) ✓
- États : repos `--text-muted` · hover `--foreground` · sélectionné `--card` + `--shadow-sm` · focus `outline 2px --ring` ✓ 4/4
- `role="tablist"` / `role="tab"` / `aria-selected` ✓

### `Footer`
- `columns` · `social` · `tone` · `note` (défaut `Busan · Corée du Sud`, point médian) ✓
- Bordure haute 1px `--border`, conteneur `.page` ✓ · titres de colonne en `.eyebrow` ✓ — voir écart 9.

---

## 8. Marque

### `Logo`
- Variantes `wordmark · stacked · monogram` ✓ 3/3 · `tone ink | bone | (défaut --foreground)` ✓ 3/3 · `height` ✓
- Point carré arrondi `--brand-gradient-diagonal`, rayon 25 %, glow — porté par `.jf-logo__dot` (base.css) sur **tous** les fonds ✓
- Aucun faux-gras, aucun outline, aucun letterspacing ✓ · `font-size = height × 1.25` ✓

### `Halo`
- Placements `bottom · top · center` ✓ 3/3 · `intensity` ✓ · `hot` → `--gradient-thumbnail-fit` ✓
- Les dégradés viennent des utilitaires `.halo` / `.halo-top` / `.halo-center` de `base.css` — **valeurs calculées identiques à la source, zéro littéral dans le composant** (voir écart 13).

### `GridBackground`
- `cell sm (28px) | lg (80px)` ✓ 2/2 · `--grid-line` · lignes 1px (exception px assumée) ✓
- Styles inline, comme la source — n'utilise pas la classe `.grid` (voir écart 7) ✓
- Restriction miniatures / motion rappelée dans la doc du composant et dans la démo ✓

### `Avatar`
- `src` · `alt` · `size` · `halo` ✓ · repli monogramme muté quand `src` est absent ✓ (décision actée : aucun PNG détouré fourni)
- Halo derrière l'avatar, rayon pill ✓ — voir écarts 13 et 14.

---

## 9. Contenu — SUPPRIMÉ

La famille `content/` (`CodeBlock`, `StepCard`, `BeforeAfter`, `QuoteBlock`) est sortie du socle en
v0.2.0, conformément au kit maître v2 qui ne la contient plus. Retirés : les quatre composants,
leurs exports, la page de démo et sa route. Le bloc `content` de `patterns.css` (`.jf-code*`,
`.jf-quote`) a disparu avec la copie verbatim du fichier v2. Vérifié avant suppression : aucun
composant restant ne les importait.

## 10. Démo (`/demo`)

| Contrôle | État |
|---|---|
| Une page par famille (9) | ✓ Fondations · Icônes · Actions · Formulaires · Data display · Feedback · Overlays · Navigation · Marque (Contenu supprimé avec la famille) |
| Toutes variantes / tailles / états visibles | ✓ |
| Toggle global clair / sombre, scope `.dark` | ✓ + un troisième mode **côte à côte** qui rend la page dans les deux thèmes simultanément |
| Rendu des fondations | ✓ couleurs, typo, espacement, rayons, rail, ombres, largeurs, motion |
| Aucun style custom hors tokens | ✓ uniquement des composants du DS, des utilitaires `base.css` et des utilitaires du preset (qui ne résolvent que vers des `var(--…)`) ; aucune valeur arbitraire Tailwind (`[…]`) |
| Non publiée dans le paquet | ✓ `demo/` absent de `files` |
| `npm run build` (démo) | ✓ `tsc --noEmit` + `vite build` sans erreur |
| Console sans erreur, clair et sombre | ✓ en v0.1.0, vérifié au navigateur sur les 10 pages. En v0.2.0 la pane du navigateur est devenue inutilisable en fin de session : la vérification s'est faite par `vite build` (résolution statique de tous les imports), `tsc --noEmit` sur le paquet et la démo, et inspection programmatique du DOM rendu (AppShell, Sidebar, Pagination, tokens calculés). Le chrome de la vitrine et les règles d'écran ont depuis été vérifiés visuellement, en clair et en sombre. **Une passe visuelle des pages Data display, Feedback, Navigation et Formulaires reste à faire.** |

---

## Auto-vérification finale

| Contrôle | Résultat |
|---|---|
| Hex hors `tokens/*.css` et `patterns.css` | **0** dans `src/components`, `src/lib`, `src/index.ts`, `src/tailwind-preset.ts`, `demo/src`. Deux mentions subsistent dans le commentaire de traçabilité d'`Avatar.tsx` (elles nomment les tokens équivalents, elles ne posent aucune couleur). |
| `rgb()` / `rgba()` / `hsl()` hors tokens | **0** |
| `px` hors exceptions | **3 lignes dans 2 fichiers, toutes dans la liste d'exceptions** : `Avatar.tsx:48` → bordure filaire `1px` ; `GridBackground.tsx:29-30` → lignes de grille `1px`. (`BeforeAfter` est parti avec la famille `content`.) Le reste des occurrences est soit un commentaire, soit du texte explicatif affiché par la démo (`note="… bordure 1.5px …"`), soit l'utilitaire Tailwind `px-*` (padding horizontal, pas une unité). |
| `blue` / `bleu` | **0** |
| Rose `#D11A4E` | **0** dans le code ; 2 mentions dans `docs/readme.md` qui l'interdisent |
| Emoji / unicode décoratif | **0** (seul le point médian `·` est utilisé) |
| Pill sur bouton, input **ou barre d'onglets** | **0** — `.jf-btn`, `.jf-icon-btn` et `.jf-input` en `--radius-md` ; `.jf-tabs` en `0.875rem` et `.jf-tab` en `--radius-sm`. `--radius-pill` ne sert plus qu'aux badges, compteurs, radio et switch |
| Anton hors titres | **0** — `--font-display` n'apparaît que dans `StepCard` (numéro, palier `--text-heading-xl`) et `Avatar` (monogramme, voir écart 14) |
| `--ink-deep` dans l'UI | **0** — présent uniquement dans les spécimens de la démo, explicitement étiquetés « miniatures et motion » |
| Grille fine dans l'UI | **0** — uniquement dans `GridBackground` |
| Exports `src/index.ts` ↔ `.d.ts` sources v2 | **36 / 37** — seul `MetricPill` manque, retiré volontairement (écart 18). Aucun autre manquant, aucun en trop (+ les sous-composants `THead` `TBody` `Tr` `Th` `Td` et l'utilitaire `cn`) |
| Preset : littéral de couleur ou de taille | **0** — uniquement des `var(--…)` |

### Style inline — sanctionnés, et le reste

Doctrine appliquée : un `style={{…}}` n'est légitime que si sa valeur **vient de la donnée**
(une prop). Une exception non écrite est une violation — d'où cette liste nommée.

**Sanctionnés (valeur pilotée par une prop) :**

| Composant | Ce qui est inline | Pourquoi |
|---|---|---|
| `Icon` | `width` · `height` | la prop `size` est une longueur CSS arbitraire, pas un palier fermé |
| `Spinner` | `width` · `height` | idem — `size` accepte aussi une longueur libre |
| `Progress` | `width` du remplissage | pourcentage calculé depuis `value` / `max` |
| `Skeleton` | `width` · `height` · `borderRadius` | ce sont exactement les trois props du composant |
| `Logo` | `fontSize` · `color` | dérivés de `height` et de `tone` |
| `Avatar` | `width` · `height` · `fontSize` du monogramme | dérivés de la prop `size` |
| `GridBackground` | `backgroundSize` + position | `cell` pilote la maille ; le reste reste inline **volontairement** pour ne pas dépendre de la classe `.grid`, qui entre en collision avec Tailwind (écart 7) |

**Non sanctionnés, et assumés comme tels :** huit composants portent encore des `style={{…}}`
purement structurels (flex, gap, marges), soit **29 blocs** — `Modal` (8), `Footer` (7), `Banner` (4),
`EmptyState` (3), `Toast` (2), `SkeletonCard` (2), `Dropdown` (2), `FormField` (1).
**Ils viennent verbatim des `.jsx` du design system maître.** Les retirer ici ferait diverger le
port de sa source, ce qu'interdit la règle n°1. Par la doctrine, ce sont des violations ; par la
règle de portage, ce sont des copies fidèles. **La correction appartient au maître** : dès que ses
`.jsx` posent ces styles en classes, le port suivra mécaniquement. Signalé pour que ce ne soit pas
pris pour un oubli.

---

### Règles d'écran — vérifiées à l'exécution (26/08/2026)

Les media queries des tokens ont été copiées verbatim **puis mesurées au navigateur** à deux
largeurs, de part et d'autre du seuil `64rem` (= 1024px : en media query, le rem s'évalue sur la
taille racine initiale de 16px, pas sur celle d'`app-scale.css`).

| Mesure | 1280px (desktop) | 1000px (< 64rem) | Attendu |
|---|---|---|---|
| `--control-md` | 3rem | **2.75rem** | rail mobile, cible tactile 44 ✓ |
| `--control-lg` | 3.25rem | **3rem** | ✓ |
| `--control-sm` · `--icon-control-sm/md/lg` | 3rem | **2.75rem** | alias de `--control-md`, suivent ✓ |
| `--text-heading-xl` | 2.5rem | **1.75rem** | drop responsive des titres ✓ |
| `--text-heading` | 1.8125rem | **1.625rem** | ✓ |
| Button sm · md rendus | 48px | **44px** | ✓ |
| Button lg rendu | 52px | **48px** | ✓ |
| IconButton sm · md · lg rendus | 48px · 48px · 48px | **44px · 44px · 44px** | rail unique : un seul carré ✓ |
| `html{font-size}` dans la démo | 16px | 16px | `app-scale.css` est opt-in, non importé ✓ |

**Une nuance de mesure** : la barre d'onglets rend 46px sous 64rem, pas 44px. `--control-md` y est
un `min-height`, donc un plancher ; le contenu de la barre (padding `--space-1` + le palier
`--text-control`) fait naturellement 46px et l'emporte. La cible tactile de 44px est donc tenue,
simplement dépassée de 2px. Comportement de la source, aucune valeur touchée.

---

## Écarts & questions

Chaque point ci-dessous est un écart réel par rapport à la lettre de la spec, ou une question
ouverte. Rien n'a été glissé en douce.

### Décisions d'architecture

**1. Les exports `.` et `./preset` pointent vers `dist/`, pas vers `src/`.**
La spec liste `"." → src/index.ts`. Un consommateur Vite ne transpile pas le TSX de `node_modules`
par défaut : l'import échouerait à l'installation. Le paquet compile donc avec `tsup` et un script
`prepare`, que npm exécute automatiquement lors d'un `npm i github:…`. Les clés d'export demandées
sont toutes présentes, et une condition `"source"` pointe vers `src/` pour les outils qui savent la
lire. `"./styles.css"` pointe bien vers `src/styles/index.css` comme spécifié (le CSS n'a rien à
compiler). **Dis-moi si tu préfères la version littérale — je bascule en une ligne.**

**2. Les polices sont dupliquées.**
`tokens/fonts.css` est copié verbatim et contient `url('../assets/fonts/…')`. Depuis
`src/styles/tokens/`, ce chemin pointe sur `src/styles/assets/fonts/`. L'arbre de la spec place
pourtant les polices à la racine (`assets/fonts/`). Les deux contraintes sont incompatibles : j'ai
gardé le CSS verbatim et placé les trois `.woff2` aux deux endroits (60 Ko au total). L'alternative
serait de modifier une URL dans un fichier « verbatim » — je ne l'ai pas fait sans ton accord.

**3. shadcn/ui n'est pas utilisé comme base runtime.**
Le mapping impose `Select → shadcn select`, `Checkbox → shadcn checkbox`, etc., mais les contrats
`.d.ts` l'interdisent : `Select` étend `SelectHTMLAttributes` (donc un `<select>` natif), `Checkbox`
/ `Radio` / `Switch` étendent `InputHTMLAttributes` (donc des `<input>` natifs), `Dropdown` n'a
aucune prop de déclencheur, `Tooltip` est piloté par `open` et par le CSS. Radix — la base réelle de
shadcn — changerait le DOM et les props. J'ai suivi la règle que le mapping énonce lui-même :
« Garde les noms et props des `.d.ts`. Style = tokens + `patterns.css` traduits en Tailwind/CVA ».
Concrètement : **CVA** (l'idiome shadcn) pour les variantes et les tailles, `patterns.css` verbatim
pour les états. Dépendances runtime : `class-variance-authority` et `lucide-react`, rien d'autre.
**Tranché le 26/08/2026 — Radix arrive en 0.2.0.** `Modal`, `Dropdown`, `Tooltip` et `Tabs`
seront repris sur Radix (piège de focus, portails, navigation clavier, détection de collision),
avec le changement de contrat de props que cela implique sur ces quatre composants. La v0.1.0 reste
le port fidèle : elle sert de référence de rendu pour valider la migration.

**4. `Modal` — ajout comportemental.**
Échap ferme, le focus est piégé dans le panneau et rendu au déclencheur à la fermeture. C'est ce que
le mapping vise en pointant `shadcn dialog`, et `aria-modal="true"` l'exige. Aucun nœud, aucune
classe, aucune valeur n'a changé.

**5. Corrections TypeScript strict obligatoires.**
Les contrats source ne compilent pas tels quels : une prop redéclarée doit être retirée du type
étendu. Le contrat public est préservé — seule la variance est levée.
`Input` → `Omit<…,'size'>` · `Toast`, `Banner`, `EmptyState`, `StepCard` → `Omit<…,'title'>` ·
`Tabs` → `Omit<…,'onChange'>` · `QuoteBlock` → `Omit<…,'role'>`.

### Défauts trouvés dans les sources

**6. `Button` — `href` n'est pas typé.**
Le contrat expose `as?: keyof JSX.IntrinsicElements` mais étend `ButtonHTMLAttributes`.
`<Button as="a" href="/x">` ne compile donc pas. **Question : j'ajoute `AnchorHTMLAttributes` au
contrat en 0.2.0 ?**

**7. Collision de nom : `.grid`.**
`tokens/base.css` définit `.grid { position:absolute; inset:0; … }` (la grille fine).
Tailwind définit `.grid { display:grid }`. Toute app consommatrice qui écrit `class="grid"` hérite
donc du `position:absolute` — la mise en page casse. Je l'ai rencontré en montant la démo.
Je n'ai pas touché aux tokens : `GridBackground` pose ses styles inline (comme la source), et la
démo n'utilise jamais la classe `grid` nue. **Question : on renomme en `.jf-grid` en 0.2.0 ?**
C'est la seule solution propre côté consommateur.

**8. Preflight Tailwind.**
Le DS embarque son propre reset (`tokens/base.css`, qui pose `h1→h4` en Anton CAPS). Si le preflight
de Tailwind est chargé après, les titres sont neutralisés. La démo le désactive
(`corePlugins.preflight: false`) et le README documente la consigne pour les apps.

**9. `Navbar` et `Footer` — `tone` vaut `'ink'` par défaut.**
Sur une section `.dark`, le wordmark reste donc sombre sur fond sombre, sauf à passer
`tone="bone"`. `Logo` seul, sans `tone`, suit correctement `--foreground`. J'ai porté le défaut de
la source à l'identique et je montre les deux cas dans la démo. **Question : on passe le défaut à
`undefined` (suivre la surface) en 0.2.0 ?**

**10. `Navbar` n'a pas de traitement étroit.**
`.jf-navbar__inner` ne passe jamais à la ligne : sous ~48rem, le CTA déborde. Aucune valeur de
point de rupture n'existe dans les sources — je n'en ai pas inventé.

**11. Le token `--radius-badge` n'est posé par aucun composant.**
Il est bien exposé par le preset (`rounded-badge`). Signalé, rien de plus.

### Substitutions de valeurs (résultat calculé identique)

**12. `--gradient-thumbnail-fit`** — remplacement confirmé par toi. Le token d'origine est conservé
verbatim dans `colors.css` ; `Halo hot` et le preset utilisent le jumeau dimensionné.

**13. Trois littéraux de couleur des `.jsx` sont écrits avec les tokens dont ils sont, à l'octet
près, la valeur.** Le rendu est identique, et il ne reste aucune couleur en dur dans `src/components`.
| Source | Écrit dans le port | Justification |
|---|---|---|
| `Avatar` — `rgba(240,128,41,.42)` / `rgba(232,76,61,.16)` | `color-mix(in srgb, var(--brand-via) 42%, transparent)` / `… var(--brand-to) 16% …` | `--brand-via` = `#f08029` = `rgb(240,128,41)` ; `--brand-to` = `#e84c3d` = `rgb(232,76,61)`. Idiome déjà utilisé par `colors.css` pour les pills. |
| `BeforeAfter` — `linear-gradient(180deg,#f5a524,#f08029,#e84c3d)` | `linear-gradient(180deg,var(--brand-from),var(--brand-via),var(--brand-to))` | Les trois hex **sont** les trois tokens de marque. |
| `Halo` — dégradés `top` / `center` en rgba inline | classes `.halo-top` / `.halo-center` de `tokens/base.css` | Les littéraux de la source `.jsx` sont copiés à l'identique de `base.css` : réutiliser la classe évite la duplication. |

**14. `Avatar` — Anton sous le palier plancher.**
Le monogramme de repli utilise `--font-display` à `size × 0.34`. En dessous d'un avatar de
**3.3rem**, Anton passe donc sous `1.125rem`, ce que le readme interdit. C'est le comportement de la
source, porté tel quel. Le monogramme est un mark, pas un titre — mais la règle ne prévoit pas
d'exception. **Question : on plancher la taille, ou on documente l'exception ?**

**15. `Icon` — tracés Lucide.**
Les tracés viennent de `lucide-react` (cible prod imposée par la spec), pas du dictionnaire embarqué
dans `Icon.jsx`. Un seul écart de rendu connu : `play` est un `<path>` chez Lucide moderne là où la
source embarquait un `<polygon>` — même glyphe, même silhouette.

**16. Preset — pas de `keyframes` ni d'`animation`.**
Les durées (150 / 200 / 300 ms, 1.4 s) sont des **littéraux documentés**, pas des tokens : les mettre
dans le preset violerait « uniquement des `var(--…)` ». `.jf-skel` et `.jf-spin` les portent déjà,
et `scales.css` définit `@keyframes shimmer`.

**17. Preset — l'échelle d'espacement est nommée, pas numérique.**
`--space-5` vaut `1.5rem` alors que le `p-5` de Tailwind vaut `1.25rem`. Écraser l'échelle numérique
casserait silencieusement tout composant shadcn d'une app consommatrice. Les clés sont donc
`space-1 … space-8`, `control-sm/md/lg`, `icon-control-*`, `card-pad`, `card-pad-lg` :
`gap-space-5`, `h-control-md`. Les rayons, ombres, polices et paliers typo écrasent bien les défauts
Tailwind, comme le fait shadcn.

### Périmètre

**18. `MetricPill` retiré du socle — décidé le 26/08/2026.**
Composant métier : une pill de métrique (vues, durée, date de publication) appartient à l'app qui
affiche ces métriques, pas au socle générique de la marque. Retirés : `src/components/data-display/
MetricPill.tsx`, l'export de `src/index.ts`, la section de la démo, l'entrée du tableau du README.
**Non touchés** : `patterns.css` garde `.jf-metric`, `.jf-metric--solid` et `.jf-metric--coral`
(copie verbatim, jamais éditée), et `colors.css` garde `--overlay-play-bg` et `--pill-coral-*`.
Une app qui a besoin d'une pill de métrique la reconstruit donc sur les classes déjà livrées, sans
inventer de valeur. **Résolu par le kit V3.** Le projet maître a supprimé `MetricPill.jsx`, `MetricPill.d.ts` et la
section `## MetricPill` de `PROMPTS.md`, et son `readme.md` documente désormais le retrait avec la
même justification. La retouche manuelle que j'avais faite sur `docs/PROMPTS.md` est donc effacée
par la copie verbatim du V3 : **il n'y a plus aucune entorse au verbatim dans tout le portage**, et
plus aucun écart entre le repo et le maître sur ce point.

**Réaffirmé le 26/08/2026 sur la mise à jour v2.** Le diff v2 du projet maître demande de le
réintégrer en le présentant comme un oubli du portage (« le repo v1 a oublié MetricPill »). Ce n'en
est pas un : c'est une décision de périmètre. Elle tient. **Action côté projet maître** : sortir
`MetricPill` du socle Claude Design, sinon chaque diff le redemandera.

**19. Le dépôt réel n'est pas celui de la spec.**
`portage-github/README.md` annonce `julienfernandes/design-system` et
`npm i github:julienfernandes/design-system#vX.Y.Z`. Le dépôt qui existe est
`Yamiro02/julien-fernandes-design-system` (privé). Le nom du paquet reste `@julienfernandes/ds` :
seule l'URL d'installation change, et le README porte la bonne.

### Mise à jour v2 (0.2.0)

**20. Focus des champs : l'anneau 3px a disparu.**
`patterns.css` v2 pose `.jf-input:focus{border-color:var(--ring)}` — une seule bordure, plus de
`box-shadow: 0 0 0 3px`. Idem en erreur : bordure `--destructive` seule. **Cela contredit le
`readme.md` v1** qui imposait l'anneau (« sur les inputs un anneau `box-shadow: 0 0 0 3px … 22% »).
Le `readme.md` v2 a été copié en même temps, la règle y est donc à jour. Signalé parce que c'est un
renversement d'une règle explicite, pas un détail. Les boutons et les contrôles de choix gardent
leur anneau `color-mix(--ring 35%)`.

**21. `Icon.d.ts` du kit v2 n'a pas été mis à jour.**
Son union `name` liste encore les 39 noms de la v1, alors que `Icon.jsx` en embarque 48. Le port
suit le `.jsx` et le §6 de la demande — les 48 noms sont typés. **Action côté projet maître** :
mettre le `.d.ts` à jour, sinon le prochain diff repartira d'un contrat faux.

**22. Rail unique : `size` devient partiellement décoratif.**
`--control-sm` aliase `--control-md`, et les trois `--icon-control-*` aussi. Sur `Button`, `size`
ne change plus que le padding et la taille de type ; sur `IconButton`, les trois tailles rendent
exactement le même carré. Les props sont conservées telles quelles (compat d'API), comme le
demandent les `.d.ts` v2. Seul `--control-lg` (3.25rem) reste distinct — CTA hero uniquement.

**23. `Table` : l'état vide n'est pas dans le composant.**
Conformément au `.d.ts`, `EmptyState` se rend **à la place** de la table. La démo le montre ainsi.

**24. `Sidebar` : `localStorage` est lu au premier rendu.**
Le composant lit `localStorage` dans l'initialiseur de `useState`, entouré d'un `try/catch` comme
la source. En rendu serveur (SSR), cet initialiseur ne s'exécute pas côté serveur mais produirait
une divergence d'hydratation si l'état persisté diffère du défaut. Aucune app consommatrice n'est
en SSR aujourd'hui ; signalé pour mémoire.

### Doctrine « vocabulaire » (0.2.2)

**25. `patterns.css` porte 4 règles en avance sur le maître.**
La passe doctrine demandait de poser en classes ce qui était inline. Le texte exact des règles
était fourni dans la demande, et la même passe est planifiée côté maître (« le zip de référence
suivra »), mais elle n'y est pas encore. `patterns.css` n'est donc plus byte-identique au kit V3 :
il porte **exactement** ces quatre lignes en plus, et rien d'autre.
```
.jf-input--sm{min-height:var(--control-sm)}
.jf-input--lg{min-height:var(--control-lg)}
.jf-navbar__links{display:flex;align-items:center;gap:var(--space-6)}
.jf-navbar__cta{display:flex;align-items:center;gap:var(--space-3)}
```
Aucune valeur inventée : `--control-sm`, `--control-lg`, `--space-6` et `--space-3` existent déjà.
**À réconcilier au prochain kit** — si le maître écrit ces règles différemment, c'est sa version
qui gagne.

**26. `src/lib/cn.ts` n'utilisait pas `tailwind-merge`.**
La demande partait du principe qu'il appelait `twMerge` nu. Ce n'était pas le cas : `cn` était une
concaténation sans dépendance (`filter(Boolean).join(' ')`), donc le bug décrit — le palier de
taille supprimé du DOM — n'existait pas dans le socle. Le fond du problème, lui, était réel **pour
les apps consommatrices** : le `cn` par défaut de shadcn utilise `twMerge` nu. J'ai donc appliqué
l'intention plutôt que la lettre : `cn` passe à `extendTailwindMerge` avec les paliers déclarés en
`font-size`, et `PALIERS_TYPO` est exporté pour que les apps réutilisent la même liste.
Vérifié à l'exécution : `twMerge('text-control text-foreground')` rend `"text-foreground"` (le
palier saute) ; la version étendue rend `"text-control text-foreground"`. Nouvelle dépendance
runtime : `tailwind-merge` ^2.6 (v2 = Tailwind 3, cohérent avec le preset).

**27. `Select` n'avait aucun style inline.**
La demande visait « Input.tsx / Select.tsx ». Seul `Input` posait un `minHeight` inline ; `Select`
n'a jamais eu de `style`. Rien à corriger de ce côté.

### Rien à signaler

- Aucune valeur inventée.
- Aucune couleur, taille, ombre, durée ou tracking qui ne vienne des sources.
- 31 des 32 composants des `.d.ts` sont portés, exportés et présents dans la démo ; `MetricPill`
  est volontairement hors périmètre (écart 18).
