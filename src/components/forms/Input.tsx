import type { CSSProperties, InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

/**
 * Single-line text field. Height rail md = 3rem, aligned with Button md and the Select trigger.
 * Radius --radius-md, 1.5px border, 3px focus ring in --ring. Never a pill.
 */
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  /** Red border + 3px destructive ring. Always pair with an error message. */
  invalid?: boolean;
  /** 'card' = input sits inside a card (fill --background, Yunary default) · 'page' = on the page background (fill --card). */
  surface?: 'card' | 'page';
}

export function Input({
  size = 'md', invalid = false, surface = 'card', className = '', ...rest
}: InputProps): JSX.Element {
  // surface: 'card' = the input sits inside a card (fill --background) · 'page' = on the page (fill --card)
  const cls = cn('jf-input', surface === 'page' && 'jf-input--on-page', invalid && 'is-error', className);
  const style: CSSProperties | undefined =
    size === 'sm' ? { minHeight: 'var(--control-sm)' }
      : size === 'lg' ? { minHeight: 'var(--control-lg)' }
        : undefined;
  return <input className={cls} aria-invalid={invalid || undefined} style={style} {...rest} />;
}
