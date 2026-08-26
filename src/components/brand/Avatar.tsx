import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

/**
 * Cut-out portrait with an optional orange halo behind the shoulders.
 * No portrait file was supplied with the kit — without `src` it falls back to a
 * muted JF monogram placeholder. Drop the real cut-out PNG in assets/ and pass it.
 */
export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Cut-out portrait (transparent PNG). */
  src?: string;
  alt?: string;
  /** CSS length, always rem. */
  size?: string;
  halo?: boolean;
}

/* Mêmes arrêts que la source — les rgba() littéraux sont remplacés par les tokens
   de marque dont ils reprennent exactement la couleur (--brand-via #f08029,
   --brand-to #e84c3d), via color-mix, l'idiome déjà utilisé par tokens/colors.css. */
const AVATAR_HALO =
  'radial-gradient(closest-side, color-mix(in srgb, var(--brand-via) 42%, transparent) 0%, '
  + 'color-mix(in srgb, var(--brand-to) 16%, transparent) 55%, transparent 78%)';

export function Avatar({
  src, alt = 'Julien Fernandes', size = '4rem', halo = true, className = '', style, ...rest
}: AvatarProps): JSX.Element {
  return (
    <span
      className={cn(className)}
      style={{ position: 'relative', display: 'inline-flex', width: size, height: size, ...style }}
      {...rest}
    >
      {halo ? (
        <span aria-hidden="true" style={{
          position: 'absolute', inset: '-35%', borderRadius: 'var(--radius-pill)', background: AVATAR_HALO,
        }} />
      ) : null}
      {src ? (
        <img src={src} alt={alt} style={{
          position: 'relative', width: '100%', height: '100%', objectFit: 'cover',
          objectPosition: 'top center', borderRadius: 'var(--radius-pill)',
        }} />
      ) : (
        <span aria-label={alt} role="img" style={{
          position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '100%', height: '100%', borderRadius: 'var(--radius-pill)',
          background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--text-muted)',
          fontFamily: 'var(--font-display)', fontSize: 'calc(' + size + ' * 0.34)',
          letterSpacing: 'var(--tracking-heading)',
        }}>JF</span>
      )}
    </span>
  );
}
