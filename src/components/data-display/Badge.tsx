import type { HTMLAttributes, ReactNode } from 'react';
import { cva } from 'class-variance-authority';

/**
 * Small pill label. Semantic tones always carry an icon + text, never colour alone.
 * The pill radius is legal here (badges, counters, tabs) — never on a button or input.
 */
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'coral' | 'amber' | 'danger' | 'warning' | 'success' | 'neutral' | 'accent' | 'outline';
  icon?: ReactNode;
  children?: ReactNode;
}

const badge = cva('jf-badge', {
  variants: {
    tone: {
      coral: 'jf-badge--coral',
      amber: 'jf-badge--amber',
      danger: 'jf-badge--danger',
      warning: 'jf-badge--warning',
      success: 'jf-badge--success',
      neutral: 'jf-badge--neutral',
      accent: 'jf-badge--accent',
      outline: 'jf-badge--outline',
    },
  },
  defaultVariants: { tone: 'neutral' },
});

export function Badge({ tone = 'neutral', icon, className = '', children, ...rest }: BadgeProps): JSX.Element {
  return (
    <span className={[badge({ tone }), className].filter(Boolean).join(' ')} {...rest}>
      {icon}{children}
    </span>
  );
}
