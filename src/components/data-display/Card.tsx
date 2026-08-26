import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { cva } from 'class-variance-authority';

/**
 * The signature surface: tinted --card fill, 1px --border, generous padding, tinted shadow.
 * Never pure white. Interactive cards lift translateY(-2px) to --shadow-md on hover.
 */
export interface CardProps extends HTMLAttributes<HTMLElement> {
  /** default = static · interactive = clickable (lift on hover) · feature = --grad-soft wash + orange border. */
  variant?: 'default' | 'interactive' | 'feature';
  /** md = radius lg / padding 1.5rem · lg = radius xl / padding 1.75rem. */
  size?: 'md' | 'lg';
  /** Removes padding and clips children — for cards with a full-bleed media top. */
  flush?: boolean;
  as?: keyof JSX.IntrinsicElements;
  children?: ReactNode;
}

const card = cva('jf-card', {
  variants: {
    variant: { default: '', interactive: 'jf-card--interactive', feature: 'jf-card--feature' },
    size: { md: '', lg: 'jf-card--lg' },
    flush: { true: 'jf-card--flush', false: '' },
  },
  defaultVariants: { variant: 'default', size: 'md', flush: false },
});

export function Card({
  variant = 'default', size = 'md', as, flush = false, className = '', children, ...rest
}: CardProps): JSX.Element {
  const Tag = (as ?? 'div') as ElementType;
  const cls = [card({ variant, size, flush }), className].filter(Boolean).join(' ');
  return <Tag className={cls} {...rest}>{children}</Tag>;
}
