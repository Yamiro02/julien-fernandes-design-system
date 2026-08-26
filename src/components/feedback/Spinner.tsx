import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

/** Rotating loading ring in currentColor. Lives inside Button via its `loading` prop. */
export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /** sm 1rem · md 1.25rem · lg 1.5rem — aligned on the Icon sizes. A CSS length is also accepted. */
  size?: 'sm' | 'md' | 'lg' | string;
}

const SIZES: Record<string, string> = { sm: '1rem', md: '1.25rem', lg: '1.5rem' };

export function Spinner({ size = 'md', className = '', style, ...rest }: SpinnerProps): JSX.Element {
  const s = SIZES[size] || size;
  return (
    <span
      role="status"
      aria-label="Chargement"
      className={cn('jf-spinner', className)}
      style={{ width: s, height: s, ...style }}
      {...rest}
    />
  );
}
