import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

/** Radio in a group — the only circular control in the system. */
export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: ReactNode;
}

export function Radio({ label, disabled = false, className = '', ...rest }: RadioProps): JSX.Element {
  return (
    <label className={cn('jf-choice', disabled && 'is-disabled', className)}>
      <input type="radio" disabled={disabled} {...rest} />
      <span className="jf-choice__box jf-choice__box--radio"><span className="jf-choice__dot" /></span>
      {label ? <span>{label}</span> : null}
    </label>
  );
}
