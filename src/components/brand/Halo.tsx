import type { CSSProperties, HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

/**
 * Warm radial halo — the brand's atmosphere. Bottom-anchored by default, never
 * full-screen, never a large flat gradient. Put it inside a `position:relative`
 * section, behind the content.
 * Les dégradés viennent des utilitaires `.halo` / `.halo-top` / `.halo-center`
 * de tokens/base.css — aucune valeur n'est réécrite ici.
 */
export interface HaloProps extends HTMLAttributes<HTMLSpanElement> {
  placement?: 'bottom' | 'top' | 'center';
  /** 0–1 opacity multiplier. Default 1. */
  intensity?: number;
  /** Hotter --gradient-thumbnail variant — THUMBNAILS AND MOTION ONLY. */
  hot?: boolean;
}

export function Halo({
  placement = 'bottom', intensity = 1, hot = false, className = '', style, ...rest
}: HaloProps): JSX.Element {
  const base: CSSProperties = {
    position: 'absolute', inset: 0, pointerEvents: 'none', opacity: intensity,
    ...(hot ? { background: 'var(--gradient-thumbnail-fit)' } : null),
    ...style,
  };
  return (
    <span
      aria-hidden="true"
      className={cn('halo', !hot && placement === 'top' && 'halo-top', !hot && placement === 'center' && 'halo-center', className)}
      style={base}
      {...rest}
    />
  );
}
