import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Side-by-side before / after of a build. The seam carries the brand gradient —
 * the gradient lives ONLY on the seam, never as a panel fill.
 */
export interface BeforeAfterProps extends HTMLAttributes<HTMLDivElement> {
  beforeLabel?: string;
  afterLabel?: string;
  before?: ReactNode;
  after?: ReactNode;
}

/* Mêmes arrêts que la source (#f5a524 · #f08029 · #e84c3d) écrits avec les tokens
   de marque dont ils sont la valeur exacte. */
const SEAM = 'linear-gradient(180deg,var(--brand-from),var(--brand-via),var(--brand-to))';

export function BeforeAfter({
  beforeLabel = 'AVANT', afterLabel = 'APRÈS', before, after, className = '', ...rest
}: BeforeAfterProps): JSX.Element {
  return (
    <div className={className} style={{
      position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr',
      border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden',
      background: 'var(--card)', boxShadow: 'var(--shadow-sm)',
    }} {...rest}>
      <div style={{
        padding: 'var(--card-pad-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)',
      }}>
        <span className="chip" style={{ color: 'var(--text-muted)' }}>{beforeLabel}</span>
        <div style={{ color: 'var(--text-muted)' }}>{before}</div>
      </div>
      <div style={{
        padding: 'var(--card-pad-lg)', display: 'flex', flexDirection: 'column',
        gap: 'var(--space-3)', backgroundImage: 'var(--grad-soft)',
      }}>
        <span className="chip" style={{ color: 'var(--pill-coral-fg)' }}>{afterLabel}</span>
        <div>{after}</div>
      </div>
      <span aria-hidden="true" style={{
        position: 'absolute', top: 0, bottom: 0, left: '50%', width: '0.125rem', background: SEAM,
      }} />
    </div>
  );
}
