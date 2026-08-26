# @julienfernandes/ds

Design system **Julien Fernandes** — la source de vérité design de tous les outils de la marque :
site, vidéos, slides, e-mails, dashboard, création de contenu.

Tokens CSS · preset Tailwind · 31 primitives React + TypeScript.
Crème par défaut, ink en rupture, Anton 400 CAPS sur les titres, dégradé de marque rationné à
l'accent. Tout est en `rem`.

> Les valeurs ne se discutent pas ici : elles vivent dans `src/styles/tokens/*.css`, copiés
> verbatim depuis le projet Claude Design. Les règles complètes sont dans
> [`docs/readme.md`](docs/readme.md), l'usage par composant dans [`docs/PROMPTS.md`](docs/PROMPTS.md),
> et la recette du portage dans [`docs/CONFORMITE.md`](docs/CONFORMITE.md).

---

## Installation

Pas de registry : chaque app épingle une version par un tag git.

```bash
npm i github:Yamiro02/julien-fernandes-design-system#v0.1.0
```

`react`, `react-dom` et `tailwindcss` sont des peer dependencies — l'app les fournit.

---

## Mise en route

### 1. Les styles

Un seul fichier à importer. Il embarque les tokens, le reset et les états des composants.

```ts
// src/main.tsx
import '@julienfernandes/ds/styles.css';
```

### 2. Le preset Tailwind

```js
// tailwind.config.js
import preset from '@julienfernandes/ds/preset';

export default {
  presets: [preset],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  corePlugins: {
    // Le DS embarque son propre reset (titres Anton, liens, focus).
    // Le preflight de Tailwind les neutraliserait.
    preflight: false,
  },
};
```

Le preset ne contient **que** des `var(--…)` : il branche les tokens sur Tailwind, il n'invente
aucune valeur. `darkMode` est en `['class']` — le thème sombre est le scope `.dark`, jamais un
media query.

### 3. Les composants

```tsx
import { Button, Card, Icon, StepCard } from '@julienfernandes/ds';

<Card variant="feature" size="lg">
  <h2>J'ai construit cette <span className="accent">app</span> en un week-end</h2>
  <Button variant="primary" size="lg" iconRight={<Icon name="arrow-right" />}>
    On build une app
  </Button>
</Card>
```

### 4. Le thème sombre

```tsx
document.documentElement.classList.toggle('dark', isDark);
```

Une section ink au milieu d'une page crème adopte le scope, elle ne peint pas un fond à la main :

```tsx
<section className="dark bg-background text-foreground">…</section>
```

---

## Ce que le preset expose

| Famille | Utilitaires |
|---|---|
| Couleurs | `bg-background` `text-foreground` `bg-card` `text-card-foreground` `bg-popover` `bg-primary` `bg-secondary` `bg-muted` `text-muted-foreground` `bg-accent` `bg-destructive` `border-border` `ring-ring` `bg-ink` `bg-ink-soft` `bg-ink-deep` `bg-cream` `bg-cream-alt` `text-text-secondary` `text-text-muted` `text-text-inverted` `bg-brand-from/via/to` `bg-pill-*-bg` `text-pill-*-fg` |
| Dégradés | `bg-brand-gradient` `bg-brand-gradient-diagonal` `bg-grad-soft` `bg-halo` `bg-thumbnail-fit` |
| Rayons | `rounded-badge` `rounded-sm` `rounded-md` `rounded-lg` `rounded-xl` `rounded-2xl` `rounded-pill` |
| Ombres | `shadow-sm` `shadow-md` `shadow-lg` `shadow-glow` `shadow-glow-lg` |
| Typo | `font-display` `font-body` `font-mono` · `text-display-xl` `text-display` `text-heading-xl` `text-heading` `text-subheading` `text-heading-sm` `text-body-lg` `text-body` `text-control` `text-caption` `text-eyebrow` `text-chip` |
| Espacement | `gap-space-1` … `gap-space-8` · `h-control-sm/md/lg` · `w-icon-control-sm/md/lg` · `p-card-pad` `p-card-pad-lg` |
| Largeurs | `max-w-shell` `max-w-wide` `max-w-read` `max-w-narrow` `max-w-page` |
| Motion | `ease-standard` |

L'échelle d'espacement est **nommée** (`space-5`, pas `5`) : elle n'écrase pas l'échelle numérique
de Tailwind, sur laquelle reposent les composants shadcn de ton app.

`tokens/base.css` fournit aussi des classes prêtes à l'emploi : `.display` `.display-xl` `.eyebrow`
`.chip` `.accent` `.mono` `.caption` `.prose` `.halo` `.page` `.jf-logo`.

> **Attention** — `tokens/base.css` définit `.grid` (la grille fine de miniature, en
> `position:absolute`). Ce nom entre en collision avec la classe `grid` de Tailwind : n'utilise pas
> `class="grid"` dans une app qui charge ce design system. Voir
> [`docs/CONFORMITE.md`](docs/CONFORMITE.md) § écart 7.

---

## Composants

| Famille | Composants |
|---|---|
| `icons` | `Icon` — 39 glyphes Lucide, tailles `1rem` / `1.25rem` / `1.5rem` |
| `actions` | `Button` · `IconButton` — 4 variantes, 3 tailles, jamais un pill |
| `forms` | `Input` · `Textarea` · `Select` · `Checkbox` · `Radio` · `Switch` · `FormField` |
| `data-display` | `Card` · `Badge` · `Tooltip` |
| `feedback` | `Toast` · `Banner` · `EmptyState` · `Skeleton` · `SkeletonCard` |
| `overlays` | `Modal` · `Dropdown` |
| `navigation` | `Navbar` · `Footer` · `Tabs` |
| `brand` | `Logo` · `Halo` · `GridBackground` · `Avatar` |
| `content` | `CodeBlock` · `StepCard` · `BeforeAfter` · `QuoteBlock` |

Tous sont exportés en nommé depuis la racine, avec leurs types :

```ts
import { Button, type ButtonProps } from '@julienfernandes/ds';
```

Les règles d'usage composant par composant sont dans [`docs/PROMPTS.md`](docs/PROMPTS.md).

> **Hors périmètre** — `MetricPill` a été sorti du socle : c'est un composant métier, il vit dans
> l'app qui en a besoin. Les classes `.jf-metric*` restent dans `patterns.css` (copié verbatim), une
> app peut donc reconstruire sa propre pill de métrique sans réinventer une valeur. `docs/readme.md`
> et `docs/PROMPTS.md` le mentionnent encore : ce sont des copies verbatim de la source design.

---

## Assets

```ts
import wordmark from '@julienfernandes/ds/assets/logo/wordmark-ink-transparent.png';
```

`assets/fonts/` — Anton-400, JetBrainsMono-400/500 (chargées par `styles.css`, rien à faire).
`assets/logo/` — les 10 PNG officiels, non modifiés. En React, préfère le composant `Logo` :
il rend le mark en CSS, avec le point en dégradé.

---

## Développement

```bash
npm install          # dépendances du paquet
npm run build        # tsup → dist/ (ESM + CJS + .d.ts)
npm run typecheck    # tsc --noEmit
```

### La vitrine de recette

Une app Vite dans `demo/`, non publiée dans le paquet. Une page par famille, chaque composant dans
toutes ses variantes, tailles et états, plus le rendu des fondations. Trois modes : clair, sombre,
et **côte à côte** (les deux thèmes en vis-à-vis).

```bash
npm run demo:install    # une seule fois
npm run demo            # http://localhost:5273
```

La démo consomme le design system depuis ses **sources** : ce que tu vois est exactement ce qui est
publié. Elle n'utilise aucun style custom hors tokens.

---

## Périmètre et versions

**Ici : uniquement le générique.** Les composants métiers d'une app restent dans l'app.
Les gabarits de production (landing, miniatures, motion, slides, social) vivent dans les projets
consommateurs.

Semver + tags git. Une évolution = PR sur ce repo, bump, tag, puis mise à jour de la dépendance
dans chaque app. Le projet Claude Design reste l'atelier de conception ; tout changement validé y
est reporté, puis porté ici.

---

## Interdits

Pas de valeur inventée. Pas de bleu. Pas de blanc ni de noir purs (le blanc pur est réservé au
bouton secondaire en thème clair). Pas d'emoji — seul le point médian `·`. Pas de rose `#D11A4E`.
Jamais un pill sur un bouton ou un input. Anton 400 CAPS, titres uniquement, jamais sous
`1.125rem`, jamais faux-gras. Grille fine et `--ink-deep` : miniatures et motion uniquement.

Le détail est dans [`docs/readme.md`](docs/readme.md).
