import type { SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../icons/Icon';

/** Native select on the 3rem control rail, with a Lucide chevron. */
export interface SelectOption { value: string; label: string }

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options?: SelectOption[];
  invalid?: boolean;
  /** 'card' = inside a card (fill --background) · 'page' = on the page (fill --card). */
  surface?: 'card' | 'page';
}

export function Select({
  options = [], invalid = false, surface = 'card', className = '', ...rest
}: SelectProps): JSX.Element {
  return (
    <span className="jf-select">
      <select
        className={cn('jf-input', surface === 'page' && 'jf-input--on-page', invalid && 'is-error', className)}
        aria-invalid={invalid || undefined}
        {...rest}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <Icon name="chevron-down" size="1.125rem" className="jf-select__chev" />
    </span>
  );
}
