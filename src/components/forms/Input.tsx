import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

/**
 * Single-line text field on the shared control rail, aligned with Button and the Select trigger.
 * Focus = the border turns --ring — ONE border, never an extra ring. Never a pill.
 */
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  /** Red border + 3px destructive ring. Always pair with an error message. */
  invalid?: boolean;
  /** 'page' (default) = sits directly on the layout (fill --secondary, like navbar/tabs/search) · 'card' = inside a card (fill --background). */
  surface?: 'page' | 'card';
}

export function Input({
  size = 'md', invalid = false, surface = 'page', className = '', ...rest
}: InputProps): JSX.Element {
  // surface: 'page' (default) = the input sits directly on the layout (fill --secondary) · 'card' = inside a card (fill --background)
  /* Le rail passe par des classes, jamais par un style inline : `--control-sm`
     aliase `--control-md` depuis le rail unique, mais la classe reste pour l'API
     et pour le jour où le rail redivergerait. */
  const cls = cn(
    'jf-input',
    size !== 'md' && 'jf-input--' + size,
    surface === 'card' && 'jf-input--on-card',
    invalid && 'is-error',
    className,
  );
  return <input className={cls} aria-invalid={invalid || undefined} {...rest} />;
}
