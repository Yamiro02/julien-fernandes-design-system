import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

/** Menu panel, radius 2xl, --shadow-lg. Items highlight on --accent. */
export interface DropdownItem {
  label?: ReactNode;
  icon?: ReactNode;
  hint?: ReactNode;
  danger?: boolean;
  separator?: boolean;
  onSelect?: () => void;
}

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  items?: DropdownItem[];
  /** Render in flow instead of absolutely positioned. */
  inline?: boolean;
}

export function Dropdown({ items = [], inline = false, className = '', ...rest }: DropdownProps): JSX.Element {
  const style: CSSProperties | undefined = inline ? undefined : { position: 'absolute', zIndex: 40 };
  return (
    <div className={cn('jf-dropdown', className)} role="menu" style={style} {...rest}>
      {items.map((it, i) => it.separator
        ? <hr key={i} className="jf-dropdown__sep" />
        : (
          <button
            key={i}
            type="button"
            role="menuitem"
            onClick={it.onSelect}
            className={cn('jf-dropdown__item', it.danger && 'jf-dropdown__item--danger')}
          >
            {it.icon}
            <span style={{ flex: 1 }}>{it.label}</span>
            {it.hint ? <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-caption)' }}>{it.hint}</span> : null}
          </button>
        ))}
    </div>
  );
}
