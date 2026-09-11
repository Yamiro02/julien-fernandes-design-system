import type { ElementType, HTMLAttributes, JSX, ReactNode } from 'react';
import { cva } from 'class-variance-authority';

/**
 * The signature surface: tinted --card fill, 1px --border, generous padding, tinted shadow.
 * Never pure white. Interactive cards lift translateY(-2px) to --shadow-md on hover.
 * Passing any header slot renders the header block; passing none renders exactly as before.
 */

/* ---------------------------------------------------------------------------
   L'EN-TÊTE — UN SEUL AU SOCLE, v0.21.0.
   Il vivait dans le JSX de Card. Il en sort en composant nommé, exporté depuis ce
   fichier, pour deux raisons : Modal le rend (pastille · titre + sous-titre · croix sur
   UNE ligne, ce que les maquettes v2 d'une app dessinent), et une app peut le poser
   seule en tête d'une zone qui n'est pas une Card. Card continue de le composer par ses
   props — l'API de Card ne bouge pas.
   Un réglage nouveau, relevé sur ces maquettes : `flush` — le mode à FILET, padding propre
   (--space-4 --space-5) et border-bottom, marge basse à zéro. C'est l'en-tête d'une
   `Card flush`, dont le corps porte son propre padding.
   PAS DE CRAN DE TITRE SUPPLÉMENTAIRE : les crans restent `sm` (--text-heading-sm,
   1.125rem, le plus petit palier de la display) et `lg`. Les maquettes posent leur h3 à
   --text-control, un palier de CONTRÔLE — c'est une approximation de l'outil, pas une
   décision de marque, et l'interdit « jamais --font-display sous 1.125rem » tient.
   --------------------------------------------------------------------------- */
export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Header slot — gradient caps line above the title. */
  eyebrow?: ReactNode;
  /** Header slot — pass a <Pastille size="carte"> (or size="dialogue" in a Modal). */
  icon?: ReactNode;
  /** Header slot — display face, casse et graisse selon --heading-transform / --heading-weight, jamais sous 1.125rem. */
  title?: ReactNode;
  /** Header slot — one muted line under the title. */
  subtitle?: ReactNode;
  /** Header slot — trailing control (IconButton, Button, chevron, the close button of a Modal), pushed right. */
  action?: ReactNode;
  /** sm = --text-heading-sm (default) · lg = --text-subheading. Never below 1.125rem. */
  titleSize?: 'sm' | 'lg';
  /** normal = --space-4 gutter under the header · airy = --space-6, for a card of blocks. Ignored by `flush`. */
  headerGap?: 'normal' | 'airy';
  /**
   * Le mode à FILET (v0.21.0) : padding --space-4 --space-5, border-bottom --border, aucune
   * marge basse — l'en-tête d'une `Card flush`, dont le corps porte son propre padding.
   * Relevé sur quinze en-têtes de carte des maquettes v2 d'une app.
   */
  flush?: boolean;
}

export function CardHeader({
  eyebrow, icon, title, subtitle, action, titleSize = 'sm', headerGap = 'normal', flush = false,
  className = '', ...rest
}: CardHeaderProps): JSX.Element | null {
  /* Aucun slot passé = aucun noeud émis. C'est la condition de non-régression de Card :
     le DOM d'une Card sans en-tête est identique à celui d'avant la v0.4. */
  if (!(eyebrow || icon || title || subtitle || action)) return null;
  return (
    /* L'alignement est DÉCIDÉ ICI, jamais au site d'appel (v0.18.0) : titre simple
       -> centré ; titre + sous-titre -> --stacked (flex-start), l'action s'aligne
       sur le titre au lieu de flotter entre les deux lignes. Voir la règle et son
       relevé au-dessus de .ds-card__header dans patterns.css. */
    <div
      className={[
        'ds-card__header',
        subtitle ? 'ds-card__header--stacked' : '',
        !flush && headerGap === 'airy' ? 'ds-card__header--airy' : '',
        flush ? 'ds-card__header--flush' : '',
        className,
      ].filter(Boolean).join(' ')}
      {...rest}
    >
      {icon}
      {(eyebrow || title || subtitle) ? (
        <div className="ds-card__header-main">
          {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
          {title ? (
            <h3 className={['ds-card__title', titleSize === 'lg' ? 'ds-card__title--lg' : ''].filter(Boolean).join(' ')}>
              {title}
            </h3>
          ) : null}
          {subtitle ? <div className="ds-card__subtitle">{subtitle}</div> : null}
        </div>
      ) : null}
      {action ? <div className="ds-card__action">{action}</div> : null}
    </div>
  );
}

/* Omit<'title'> : l'attribut HTML `title` est une string, notre slot est un ReactNode.
   Même traitement que EmptyStateProps, qui a le même conflit depuis la v0.1.0. */
export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** default = static · interactive = clickable (lift on hover) · feature = --grad-soft wash + orange border. */
  variant?: 'default' | 'interactive' | 'feature';
  /** md = radius lg / padding 1.5rem · lg = radius xl / padding 1.75rem. */
  size?: 'md' | 'lg';
  /**
   * Removes padding and clips children — for cards with a full-bleed media top, or a
   * table at the edge. With header slots, the header takes its FLUSH mode by itself
   * (v0.21.0): own padding, a rule under it, no gutter — the body carries its padding.
   */
  flush?: boolean;
  /** Header slot — gradient caps line above the title. */
  eyebrow?: ReactNode;
  /** Header slot — pass a <Pastille size="carte">. */
  icon?: ReactNode;
  /** Header slot — display face, casse et graisse selon --heading-transform / --heading-weight, jamais sous 1.125rem. */
  title?: ReactNode;
  /** Header slot — one muted line under the title. */
  subtitle?: ReactNode;
  /** Header slot — trailing control (IconButton, Button, chevron), pushed right. */
  action?: ReactNode;
  /** sm = --text-heading-sm (default) · lg = --text-subheading. */
  titleSize?: 'sm' | 'lg';
  /** normal = --space-4 gutter under the header · airy = --space-6, for a card of blocks. */
  headerGap?: 'normal' | 'airy';
  as?: keyof JSX.IntrinsicElements;
  children?: ReactNode;
}

const card = cva('ds-card', {
  variants: {
    variant: { default: '', interactive: 'ds-card--interactive', feature: 'ds-card--feature' },
    size: { md: '', lg: 'ds-card--lg' },
    flush: { true: 'ds-card--flush', false: '' },
  },
  defaultVariants: { variant: 'default', size: 'md', flush: false },
});

export function Card({
  variant = 'default', size = 'md', as, flush = false,
  eyebrow, icon, title, subtitle, action, titleSize = 'sm', headerGap = 'normal',
  className = '', children, ...rest
}: CardProps): JSX.Element {
  const Tag = (as ?? 'div') as ElementType;
  const cls = [card({ variant, size, flush }), className].filter(Boolean).join(' ');
  return (
    <Tag className={cls} {...rest}>
      {/* Une carte `flush` qui a un en-tête le rend À FILET : c'est la carte qui le
          sait, pas le site d'appel — même logique que l'alignement (v0.18.0). */}
      <CardHeader
        eyebrow={eyebrow} icon={icon} title={title} subtitle={subtitle} action={action}
        titleSize={titleSize} headerGap={headerGap} flush={flush}
      />
      {children}
    </Tag>
  );
}
