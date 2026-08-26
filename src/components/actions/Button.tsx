import type { ButtonHTMLAttributes, ElementType, ReactNode } from 'react';
import { cva } from 'class-variance-authority';
import { Icon } from '../icons/Icon';

/**
 * The system's primary action. Primary carries the brand glow and is the only
 * orange accent allowed in a view; secondary / ghost / danger carry none.
 * Radius is always --radius-md — NEVER a pill.
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = brand CTA (glow) · secondary = white/ink outline · ghost = bare · danger = destructive. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** Height rail: sm 2.375rem · md 3rem (aligns with Input & Select) · lg 3.25rem. */
  size?: 'sm' | 'md' | 'lg';
  /** Leading icon node — use <Icon />. */
  icon?: ReactNode;
  /** Trailing icon node. */
  iconRight?: ReactNode;
  /** Swaps the leading icon for a spinner and disables the button. */
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  /** Render as another tag, e.g. 'a' for a link-button. */
  as?: keyof JSX.IntrinsicElements;
  children?: ReactNode;
}

const button = cva('jf-btn', {
  variants: {
    variant: {
      primary: 'jf-btn--primary',
      secondary: 'jf-btn--secondary',
      ghost: 'jf-btn--ghost',
      danger: 'jf-btn--danger',
    },
    size: { sm: 'jf-btn--sm', md: 'jf-btn--md', lg: 'jf-btn--lg' },
    fullWidth: { true: 'jf-btn--block', false: '' },
    loading: { true: 'is-loading', false: '' },
  },
  defaultVariants: { variant: 'primary', size: 'md', fullWidth: false, loading: false },
});

export function Button({
  variant = 'primary', size = 'md', icon, iconRight, loading = false,
  disabled = false, fullWidth = false, as, className = '', children, ...rest
}: ButtonProps): JSX.Element {
  const Tag = (as ?? 'button') as ElementType;
  const cls = [button({ variant, size, fullWidth, loading }), className].filter(Boolean).join(' ');
  const iconSize = size === 'sm' ? '1rem' : '1.25rem';
  return (
    <Tag
      className={cls}
      disabled={Tag === 'button' ? disabled || loading : undefined}
      aria-busy={loading || undefined}
      aria-disabled={disabled || undefined}
      {...rest}
    >
      {loading ? <Icon name="loader-circle" size={iconSize} className="jf-spin" /> : icon}
      <span>{children}</span>
      {!loading && iconRight}
    </Tag>
  );
}
