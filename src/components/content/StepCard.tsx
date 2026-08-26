import type { HTMLAttributes, ReactNode } from 'react';
import { Card } from '../data-display/Card';

/**
 * A tutorial step: gradient number, Anton H4 title, body copy, --grad-soft wash.
 * The step number is the only gradient in the card — the title stays ink.
 */
export interface StepCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Zero-padded automatically: 1 -> "01". */
  step: number | string;
  title: ReactNode;
  children?: ReactNode;
}

export function StepCard({ step, title, children, className = '', ...rest }: StepCardProps): JSX.Element {
  return (
    <Card variant="feature" size="lg" className={className} {...rest}>
      <span style={{
        display: 'block', width: 'fit-content', fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-heading-xl)', lineHeight: 'var(--leading-tight)',
        letterSpacing: 'var(--tracking-heading-xl)', background: 'var(--brand-gradient)',
        WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
      }}>{String(step).padStart(2, '0')}</span>
      <h4 style={{ marginTop: 'var(--space-3)' }}>{title}</h4>
      {children ? <p style={{ marginTop: 'var(--space-2)', color: 'var(--text-secondary)' }}>{children}</p> : null}
    </Card>
  );
}
