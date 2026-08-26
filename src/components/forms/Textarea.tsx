import type { TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

/** Multi-line field. Auto height (no min-height), vertical resize only. */
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  rows?: number;
}

export function Textarea({
  invalid = false, rows = 4, className = '', ...rest
}: TextareaProps): JSX.Element {
  const cls = cn('jf-input', 'jf-textarea', invalid && 'is-error', className);
  return <textarea className={cls} rows={rows} aria-invalid={invalid || undefined} {...rest} />;
}
