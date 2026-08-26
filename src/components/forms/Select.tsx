import type { SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../icons/Icon';

/** Native select on the shared control rail, with a Lucide chevron. */
export interface SelectOption { value: string; label: string }

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options?: SelectOption[];
  invalid?: boolean;
  /** 'page' (default) = sits directly on the layout (fill --secondary) · 'card' = inside a card (fill --background). */
  surface?: 'page' | 'card';
}

export function Select({
  options = [], invalid = false, surface = 'page', className = '', ...rest
}: SelectProps): JSX.Element {
  return (
    <span className="jf-select">
      <select
        className={cn('jf-input', surface === 'card' && 'jf-input--on-card', invalid && 'is-error', className)}
        aria-invalid={invalid || undefined}
        {...rest}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <Icon name="chevron-down" size="1.125rem" className="jf-select__chev" />
    </span>
  );
}
