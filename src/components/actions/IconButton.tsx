import type { ButtonHTMLAttributes, JSX, ReactNode } from 'react';
import { cva } from 'class-variance-authority';

/**
 * Square icon-only button on the shared control rail: every size renders the same
 * square (3rem, 2.75rem under 64rem) — `size` is kept for API compatibility.
 * Always pass `label` — it becomes aria-label and title. Never a pill.
 */
export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  /**
   * The surface the button sits on — the twin of Button's `surface`, same three values,
   * same reason. `auto` (default) leaves the deduction of patterns.css alone; `page`
   * forces --secondary on a --background panel nested inside a card; `card` forces
   * --background outside a real .ds-card. Only `secondary` carries a fill.
   */
  surface?: 'auto' | 'page' | 'card';
  /** Accessible name. Required. */
  label: string;
  children?: ReactNode;
}

const iconButton = cva('ds-icon-btn', {
  variants: {
    variant: {
      primary: 'ds-icon-btn--primary',
      secondary: 'ds-icon-btn--secondary',
      ghost: 'ds-icon-btn--ghost',
      danger: 'ds-icon-btn--danger',
    },
    size: { sm: 'ds-icon-btn--sm', md: 'ds-icon-btn--md', lg: 'ds-icon-btn--lg' },
    surface: { auto: '', page: 'ds-icon-btn--on-page', card: 'ds-icon-btn--on-card' },
  },
  defaultVariants: { variant: 'ghost', size: 'md', surface: 'auto' },
});

export function IconButton({
  variant = 'ghost', size = 'md', surface = 'auto', label, className = '', children, ...rest
}: IconButtonProps): JSX.Element {
  const cls = [iconButton({ variant, size, surface }), className].filter(Boolean).join(' ');
  return (
    <button type="button" className={cls} aria-label={label} title={label} {...rest}>
      {children}
    </button>
  );
}
