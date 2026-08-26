import type { CSSProperties, HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

/**
 * The mark, rendered in CSS: Anton caps + a GRADIENT rounded-square dot
 * (side ~0.21em, radius 25%, glow 0 0 12px rgba(240,128,41,.5) — see tokens/base.css).
 * The dot keeps the brand gradient on every background; only the letters invert.
 * The supplied PNGs (flat-orange dot) stay in assets/logo/ as static exports.
 * Never fake-bold, outline or letterspace the mark.
 */
export interface LogoProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'wordmark' | 'stacked' | 'monogram';
  /** ink = dark letters (on cream) · bone = light letters (on ink). Defaults to the surface's --foreground. */
  tone?: 'ink' | 'bone';
  /** CSS length, always rem — overall mark height (font-size is derived). */
  height?: string;
}

export function Logo({
  variant = 'wordmark', tone, height = '1.75rem', className = '', style, ...rest
}: LogoProps): JSX.Element {
  const color = tone === 'bone' ? 'var(--cream)' : tone === 'ink' ? 'var(--ink)' : 'var(--foreground)';
  const dot = <span aria-hidden="true" className="jf-logo__dot" />;
  const base: CSSProperties = { fontSize: 'calc(' + height + ' * 1.25)', color, ...style };

  if (variant === 'monogram') {
    return (
      <span className={cn('jf-logo', className)} style={base} aria-label="Julien Fernandes" {...rest}>
        JF{dot}
      </span>
    );
  }
  if (variant === 'stacked') {
    return (
      <span
        className={cn('jf-logo', className)}
        style={{ ...base, flexDirection: 'column', alignItems: 'flex-start', gap: '0.08em' }}
        aria-label="Julien Fernandes"
        {...rest}
      >
        <span>Julien</span>
        <span style={{ display: 'inline-flex', alignItems: 'flex-end' }}>Fernandes{dot}</span>
      </span>
    );
  }
  return (
    <span className={cn('jf-logo', className)} style={base} aria-label="Julien Fernandes" {...rest}>
      Julien Fernandes{dot}
    </span>
  );
}
