import type { HTMLAttributes, ReactNode } from 'react';
import { cva } from 'class-variance-authority';

/**
 * Small pill label. Semantic tones always carry an icon + text, never colour alone.
 * The pill radius is legal here (badges, counters, tabs) — never on a button or input.
 */
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'coral' | 'amber' | 'danger' | 'warning' | 'success' | 'neutral' | 'accent' | 'outline';
  /**
   * Height rail. md = --badge-h (1.8125rem) · dense = --badge-h-dense (1.5rem), the height
   * that lines up with a status pill on the same row. Icons: 0.875rem in md, 0.75rem in dense.
   */
  pad?: 'md' | 'dense';
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
    pad: { md: '', dense: 'jf-badge--dense' },
  },
  defaultVariants: { tone: 'neutral', pad: 'md' },
});

export function Badge({ tone = 'neutral', pad = 'md', icon, className = '', children, ...rest }: BadgeProps): JSX.Element {
  return (
    <span className={[badge({ tone, pad }), className].filter(Boolean).join(' ')} {...rest}>
      {icon}{children}
    </span>
  );
}
