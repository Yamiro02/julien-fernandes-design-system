import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

/** Binary toggle. Track 2.75rem x 1.625rem, pill radius, knob 1.25rem. */
export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: ReactNode;
}

export function Switch({ label, disabled = false, className = '', ...rest }: SwitchProps): JSX.Element {
  return (
    <label className={cn('jf-switch', disabled && 'is-disabled', className)}>
      <input type="checkbox" role="switch" disabled={disabled} {...rest} />
      <span className="jf-switch__track"><span className="jf-switch__knob" /></span>
      {label ? <span>{label}</span> : null}
    </label>
  );
}
