import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

/**
 * Grille fine, filets 1px à ~5,5 % d'opacité, maille 28px ou 80px.
 * RESTRICTION : elle appartient aux miniatures et au motion design UNIQUEMENT. Jamais sur
 * le site, jamais dans l'UI, jamais sur les slides.
 *
 * EXTENSION MÉTIER — s'importe depuis `@julienfernandes/ds/brand-content`, et demande
 * `brand-content.css` en face, qui porte les règles `.ds-grid` / `.ds-grid-lg` et les
 * jetons de maille.
 *
 * IL POSE LA CLASSE, il ne réécrit pas le motif. Il reconstruisait les deux
 * `linear-gradient` en style inline pendant que `brand-content.css` portait déjà la même
 * règle : deux sources pour un seul motif, dont une seule bougeait quand on la corrigeait.
 */
export interface GridBackgroundProps extends HTMLAttributes<HTMLSpanElement> {
  /** sm = maille --grid-cell · lg = maille --grid-cell-lg. Les deux restent en px : la
   *  grille ne doit pas suivre le rem. */
  cell?: 'sm' | 'lg';
}

export function GridBackground({
  cell = 'sm', className = '', ...rest
}: GridBackgroundProps): JSX.Element {
  return (
    <span
      aria-hidden="true"
      className={cn('ds-grid', cell === 'lg' && 'ds-grid-lg', className)}
      {...rest}
    />
  );
}
