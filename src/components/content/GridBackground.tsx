import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

/**
 * Grille fine, filets 1px à ~5,5 % d'opacité, maille 28px ou 80px.
 * RESTRICTION : elle appartient aux miniatures YouTube et au motion design UNIQUEMENT.
 * Jamais sur le site, jamais dans l'UI, jamais sur les slides.
 *
 * EXTENSION MÉTIER — s'importe depuis `@julienfernandes/ds/brand-content`, et demande
 * `brand-content.css` en face pour les jetons --grid-*.
 *
 * Les styles restent inline, comme dans la source. Il y a une SECONDE source pour le même
 * motif — la règle `.jf-grid` de brand-content.css — et c'est un doublon connu : le
 * sous-lot 6 fait passer ce composant sur la classe.
 */
export interface GridBackgroundProps extends HTMLAttributes<HTMLSpanElement> {
  /** sm = 28px mesh · lg = 80px mesh. Mesh and hairline stay in px on purpose. */
  cell?: 'sm' | 'lg';
}

export function GridBackground({
  cell = 'sm', className = '', style, ...rest
}: GridBackgroundProps): JSX.Element {
  const size = cell === 'lg' ? 'var(--grid-cell-lg)' : 'var(--grid-cell)';
  return (
    <span
      aria-hidden="true"
      className={cn(className)}
      style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage:
          'linear-gradient(var(--grid-line) 1px, transparent 1px), '
          + 'linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)',
        backgroundSize: size + ' ' + size,
        ...style,
      }}
      {...rest}
    />
  );
}
