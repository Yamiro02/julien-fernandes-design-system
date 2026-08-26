import { Fragment, useState } from 'react';
import type { ElementType, HTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Logo } from '../brand/Logo';
import { Icon } from '../icons/Icon';

/**
 * App sidebar on --secondary: Logo head, nav sections, active item, footer (Avatar…).
 * Collapsible to icons-only, persisted in localStorage. Under 64rem it is a drawer
 * driven by `open`/`onClose` (scrim included).
 */
export interface SidebarItem {
  label: string;
  icon?: ReactNode;
  href?: string;
  active?: boolean;
  onClick?: MouseEventHandler;
}

export interface SidebarSection { title?: ReactNode; items: SidebarItem[] }

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  sections?: SidebarSection[];
  /** Sidebar footer — typically Avatar + name. */
  footer?: ReactNode;
  /** Show the collapse toggle. Default true. */
  collapsible?: boolean;
  /** Overrides the persisted initial state. */
  defaultCollapsed?: boolean;
  /** localStorage key for the collapsed state. Default 'jf-sidebar-collapsed'. */
  storageKey?: string;
  /** Mobile drawer open state (under 64rem). */
  open?: boolean;
  onClose?: () => void;
  /** Opt out of the fixed-drawer behaviour (demos, embedded shells). */
  staticLayout?: boolean;
}

export function Sidebar({
  sections = [], footer, collapsible = true, defaultCollapsed, storageKey = 'jf-sidebar-collapsed',
  open = false, onClose, staticLayout = false, className = '', children, ...rest
}: SidebarProps): JSX.Element {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (defaultCollapsed !== undefined) return defaultCollapsed;
    try { return localStorage.getItem(storageKey) === '1'; } catch { return false; }
  });
  const toggle = () => setCollapsed(c => {
    const n = !c;
    try { localStorage.setItem(storageKey, n ? '1' : '0'); } catch { /* stockage indisponible */ }
    return n;
  });
  return (
    <Fragment>
      {open ? <div className="jf-appshell__scrim" onClick={onClose} /> : null}
      <aside
        className={cn('jf-sidebar', collapsed && 'is-collapsed', open && 'is-open', staticLayout && 'jf-sidebar--static', className)}
        {...rest}
      >
        <div className="jf-sidebar__head">
          <Logo variant={collapsed ? 'monogram' : 'wordmark'} height={collapsed ? '1.5rem' : '1.25rem'} />
          {collapsible ? (
            <button
              type="button"
              className="jf-sidebar__toggle"
              aria-label={collapsed ? 'Déplier la navigation' : 'Replier la navigation'}
              aria-expanded={!collapsed}
              onClick={toggle}
            >
              <Icon name="panel-left" size="1.25rem" />
            </button>
          ) : null}
        </div>
        <nav className="jf-sidebar__nav">
          {sections.map((s, i) => (
            <Fragment key={i}>
              {s.title ? <span className="jf-sidebar__title">{s.title}</span> : null}
              {(s.items || []).map(it => {
                const Tag = (it.href ? 'a' : 'button') as ElementType;
                return (
                  <Tag
                    key={it.label}
                    {...(it.href ? { href: it.href } : { type: 'button' })}
                    className={cn('jf-sidenav', it.active && 'is-active')}
                    aria-current={it.active ? 'page' : undefined}
                    title={collapsed ? it.label : undefined}
                    onClick={it.onClick}
                  >
                    {it.icon}<span className="jf-sidenav__label">{it.label}</span>
                  </Tag>
                );
              })}
            </Fragment>
          ))}
        </nav>
        {footer ? <div className="jf-sidebar__foot">{footer}</div> : null}
        {children}
      </aside>
    </Fragment>
  );
}
