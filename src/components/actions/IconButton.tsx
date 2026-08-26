import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cva } from 'class-variance-authority';

/**
 * Square icon-only button on the shared control rail: every size renders the same
 * square (3rem, 2.75rem under 64rem) — `size` is kept for API compatibility.
 * Always pass `label` — it becomes aria-label and title. Never a pill.
 */
export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  /** Accessible name. Required. */
  label: string;
  children?: ReactNode;
}

const iconButton = cva('jf-icon-btn', {
  variants: {
    variant: {
      primary: 'jf-icon-btn--primary',
      secondary: 'jf-icon-btn--secondary',
      ghost: 'jf-icon-btn--ghost',
      danger: 'jf-icon-btn--danger',
    },
    size: { sm: 'jf-icon-btn--sm', md: 'jf-icon-btn--md', lg: 'jf-icon-btn--lg' },
  },
  defaultVariants: { variant: 'ghost', size: 'md' },
});

export function IconButton({
  variant = 'ghost', size = 'md', label, className = '', children, ...rest
}: IconButtonProps): JSX.Element {
  const cls = [iconButton({ variant, size }), className].filter(Boolean).join(' ');
  return (
    <button type="button" className={cls} aria-label={label} title={label} {...rest}>
      {children}
    </button>
  );
}
