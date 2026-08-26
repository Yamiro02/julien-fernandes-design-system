import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

/** Pill tab group on --muted. The pill shape is legal here (tabs, badges, counters). */
export interface TabItem { value: string; label: ReactNode }

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items?: TabItem[];
  value?: string;
  onChange?: (value: string) => void;
}

export function Tabs({ items = [], value, onChange, className = '', ...rest }: TabsProps): JSX.Element {
  return (
    <div className={cn('jf-tabs', className)} role="tablist" {...rest}>
      {items.map(it => (
        <button
          key={it.value}
          type="button"
          role="tab"
          className="jf-tab"
          aria-selected={value === it.value}
          onClick={() => onChange && onChange(it.value)}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}
