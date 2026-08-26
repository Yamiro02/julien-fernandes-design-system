import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

/**
 * Fine 1px grid at ~5.5% opacity, 28px or 80px mesh.
 * RESTRICTION: the fine grid belongs to YouTube thumbnails and motion design ONLY.
 * Never on the site, never in the UI, never on slides.
 *
 * Les styles restent inline, comme dans la source : l'utilitaire `.grid` de
 * tokens/base.css porte le même nom que la classe `grid` de Tailwind — voir
 * la note d'intégration du README.
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
