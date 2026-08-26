import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../icons/Icon';

/** Checkbox with a Lucide check (stroke-width 3). Box radius = half of --radius-sm. */
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: ReactNode;
}

export function Checkbox({
  label, checked, defaultChecked, disabled = false, className = '', ...rest
}: CheckboxProps): JSX.Element {
  return (
    <label className={cn('ds-choice', disabled && 'is-disabled', className)}>
      <input type="checkbox" checked={checked} defaultChecked={defaultChecked} disabled={disabled} {...rest} />
      <span className="ds-choice__box"><Icon name="check" size="0.8125rem" strokeWidth={3} /></span>
      {label ? <span>{label}</span> : null}
    </label>
  );
}
