/**
 * Julien Fernandes — Tailwind preset.
 *
 * RÈGLE : ce fichier ne contient QUE des `var(--…)`. Aucune valeur littérale
 * (couleur, taille, rayon, ombre, durée, tracking) n'est écrite ici — elles vivent
 * toutes, et uniquement, dans `src/styles/tokens/*.css`.
 *
 * Le thème sombre est le scope `.dark`, jamais un media query.
 *
 * Usage (tailwind.config.js d'une app consommatrice) :
 *   import preset from '@julienfernandes/ds/preset';
 *   export default { presets: [preset], content: [...] };
 *
 * L'échelle d'espacement du DS est exposée sous des clés nommées (`space-1` …
 * `space-8`, `control-md`, `card-pad`…) et n'écrase donc jamais l'échelle numérique
 * de Tailwind : `gap-space-5` = `var(--space-5)`, `h-control-md` = `var(--control-md)`.
 */
import type { Config } from 'tailwindcss';

const preset = {
  darkMode: ['class'],
  content: [],
  theme: {
    extend: {
      colors: {
        /* Surfaces & neutres chauds — convention shadcn */
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',

        /* Neutres de marque */
        ink: {
          DEFAULT: 'var(--ink)',
          soft: 'var(--ink-soft)',
          /* RÉSERVÉ miniatures YouTube + motion. Jamais un fond d'interface. */
          deep: 'var(--ink-deep)',
        },
        cream: {
          DEFAULT: 'var(--cream)',
          alt: 'var(--cream-alt)',
        },
        text: {
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          inverted: 'var(--text-inverted)',
        },

        /* Marque — accent uniquement */
        brand: {
          from: 'var(--brand-from)',
          via: 'var(--brand-via)',
          to: 'var(--brand-to)',
        },

        /* Pills sémantiques — toujours couleur + icône + texte */
        pill: {
          'coral-bg': 'var(--pill-coral-bg)',
          'coral-fg': 'var(--pill-coral-fg)',
          'amber-bg': 'var(--pill-amber-bg)',
          'amber-fg': 'var(--pill-amber-fg)',
          'danger-bg': 'var(--pill-danger-bg)',
          'danger-fg': 'var(--pill-danger-fg)',
          'warning-bg': 'var(--pill-warning-bg)',
          'warning-fg': 'var(--pill-warning-fg)',
          'success-bg': 'var(--pill-success-bg)',
          'success-fg': 'var(--pill-success-fg)',
          'neutral-bg': 'var(--pill-neutral-bg)',
          'neutral-fg': 'var(--pill-neutral-fg)',
        },
        'overlay-play': 'var(--overlay-play-bg)',

        /* Grille fine — miniatures et motion uniquement */
        'grid-line': 'var(--grid-line)',
      },

      backgroundImage: {
        'brand-gradient': 'var(--brand-gradient)',
        'brand-gradient-diagonal': 'var(--brand-gradient-diagonal)',
        'grad-soft': 'var(--grad-soft)',
        halo: 'var(--gradient-halo)',
        /* RÉSERVÉ miniatures + motion. `thumbnail` reprend le littéral verbatim du
           brief (non rendu) ; `thumbnail-fit` est le jumeau dimensionné. */
        thumbnail: 'var(--gradient-thumbnail)',
        'thumbnail-fit': 'var(--gradient-thumbnail-fit)',
      },

      backgroundSize: {
        grid: 'var(--grid-cell) var(--grid-cell)',
        'grid-lg': 'var(--grid-cell-lg) var(--grid-cell-lg)',
      },

      borderRadius: {
        DEFAULT: 'var(--radius)',
        badge: 'var(--radius-badge)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        /* Onglets, badges, compteurs — JAMAIS un bouton ni un input. */
        pill: 'var(--radius-pill)',
      },

      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        soft: 'var(--shadow-soft)',
        'soft-lg': 'var(--shadow-soft-lg)',
        /* Réservé au CTA primaire et aux éléments de marque. */
        glow: 'var(--shadow-glow)',
        'glow-lg': 'var(--shadow-glow-lg)',
      },

      fontFamily: {
        /* Anton 400 CAPS — titres uniquement, jamais sous 1.125rem. */
        display: 'var(--font-display)',
        body: 'var(--font-body)',
        mono: 'var(--font-mono)',
      },

      fontSize: {
        'display-xl': ['var(--text-display-xl)', { lineHeight: 'var(--leading-display)', letterSpacing: 'var(--tracking-display)' }],
        display: ['var(--text-display)', { lineHeight: 'var(--leading-display)', letterSpacing: 'var(--tracking-display)' }],
        'heading-xl': ['var(--text-heading-xl)', { lineHeight: 'var(--leading-display)', letterSpacing: 'var(--tracking-heading-xl)' }],
        heading: ['var(--text-heading)', { lineHeight: 'var(--leading-heading)', letterSpacing: 'var(--tracking-heading)' }],
        subheading: ['var(--text-subheading)', { lineHeight: 'var(--leading-heading)', letterSpacing: 'var(--tracking-subheading)' }],
        'heading-sm': ['var(--text-heading-sm)', { lineHeight: 'var(--leading-snug)', letterSpacing: 'var(--tracking-heading-sm)' }],
        'body-lg': ['var(--text-body-lg)', { lineHeight: 'var(--leading-body)', letterSpacing: 'var(--tracking-body-lg)' }],
        body: ['var(--text-body)', { lineHeight: 'var(--leading-body)' }],
        /* Tous les contrôles : boutons, champs, chips, onglets. */
        control: 'var(--text-control)',
        caption: ['var(--text-caption)', { lineHeight: 'var(--leading-normal)' }],
        eyebrow: ['var(--text-eyebrow)', { lineHeight: 'var(--leading-snug)', letterSpacing: 'var(--tracking-eyebrow)' }],
        chip: ['var(--text-chip)', { letterSpacing: 'var(--tracking-chip)' }],
      },

      fontWeight: {
        regular: 'var(--weight-regular)',
        medium: 'var(--weight-medium)',
        semibold: 'var(--weight-semibold)',
        bold: 'var(--weight-bold)',
      },

      letterSpacing: {
        display: 'var(--tracking-display)',
        'heading-xl': 'var(--tracking-heading-xl)',
        heading: 'var(--tracking-heading)',
        subheading: 'var(--tracking-subheading)',
        'heading-sm': 'var(--tracking-heading-sm)',
        'body-lg': 'var(--tracking-body-lg)',
        eyebrow: 'var(--tracking-eyebrow)',
        chip: 'var(--tracking-chip)',
        dense: 'var(--tracking-dense)',
      },

      lineHeight: {
        tight: 'var(--leading-tight)',
        snug: 'var(--leading-snug)',
        normal: 'var(--leading-normal)',
        display: 'var(--leading-display)',
        heading: 'var(--leading-heading)',
        body: 'var(--leading-body)',
        prose: 'var(--leading-prose)',
      },

      spacing: {
        'space-1': 'var(--space-1)',
        'space-2': 'var(--space-2)',
        'space-3': 'var(--space-3)',
        'space-4': 'var(--space-4)',
        'space-5': 'var(--space-5)',
        'space-6': 'var(--space-6)',
        'space-7': 'var(--space-7)',
        'space-8': 'var(--space-8)',
        /* Rail de hauteur des contrôles — Button md, Input et Select s'alignent à 3rem. */
        'control-sm': 'var(--control-sm)',
        'control-md': 'var(--control-md)',
        'control-lg': 'var(--control-lg)',
        /* Rail carré décalé de l'IconButton. */
        'icon-control-sm': 'var(--icon-control-sm)',
        'icon-control-md': 'var(--icon-control-md)',
        'icon-control-lg': 'var(--icon-control-lg)',
        'card-pad': 'var(--card-pad)',
        'card-pad-lg': 'var(--card-pad-lg)',
      },

      maxWidth: {
        /* Largeurs de contenu par rôle — jamais une largeur inventée. */
        shell: 'var(--container-shell)',
        wide: 'var(--container-wide)',
        read: 'var(--container-read)',
        narrow: 'var(--container-narrow)',
        page: 'var(--page-max)',
      },

      transitionTimingFunction: {
        standard: 'var(--ease-standard)',
      },
    },
  },
} satisfies Config;

export default preset;
