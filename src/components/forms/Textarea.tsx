import type { TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

/** Multi-line field. Auto height (no min-height), vertical resize only. */
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  rows?: number;
  /** 'page' (default) = sits directly on the layout (fill --secondary) · 'card' = inside a card (fill --background). */
  surface?: 'page' | 'card';
}

export function Textarea({
  invalid = false, rows = 4, surface = 'page', className = '', ...rest
}: TextareaProps): JSX.Element {
  const cls = cn('ds-input', 'ds-textarea', surface === 'card' && 'ds-input--on-card', invalid && 'is-error', className);
  return <textarea className={cls} rows={rows} aria-invalid={invalid || undefined} {...rest} />;
}
