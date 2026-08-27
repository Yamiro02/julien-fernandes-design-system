import { Fragment, useState } from 'react';
import type { ElementType, HTMLAttributes, JSX, MouseEventHandler, ReactNode } from 'react';
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
  /** La marque, en tête, quand la barre est DÉPLIÉE. Défaut : le `Logo` en mot-marque. */
  brand?: ReactNode;
  /** La marque quand la barre est REPLIÉE. Défaut : le `Logo` en monogramme. */
  brandCollapsed?: ReactNode;
  /** Show the collapse toggle. Default true. */
  collapsible?: boolean;
  /** Overrides the persisted initial state. */
  defaultCollapsed?: boolean;
  /** localStorage key for the collapsed state. Default 'ds-sidebar-collapsed'. */
  storageKey?: string;
  /** Mobile drawer open state (under 64rem). */
  open?: boolean;
  onClose?: () => void;
  /** Opt out of the fixed-drawer behaviour (demos, embedded shells). */
  staticLayout?: boolean;
}

export function Sidebar({
  sections = [], footer, brand, brandCollapsed, collapsible = true, defaultCollapsed,
  storageKey = 'ds-sidebar-collapsed',
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
      {open ? <div className="ds-appshell__scrim" onClick={onClose} /> : null}
      <aside
        className={cn('ds-sidebar', collapsed && 'is-collapsed', open && 'is-open', staticLayout && 'ds-sidebar--static', className)}
        {...rest}
      >
        <div className="ds-sidebar__head">
          {collapsed
            ? brandCollapsed ?? <Logo variant="monogram" height="1.5rem" />
            : brand ?? <Logo variant="wordmark" height="1.25rem" />}
          {collapsible ? (
            <button
              type="button"
              className="ds-sidebar__toggle"
              aria-label={collapsed ? 'Déplier la navigation' : 'Replier la navigation'}
              aria-expanded={!collapsed}
              onClick={toggle}
            >
              <Icon name="panel-left" size="1.25rem" />
            </button>
          ) : null}
        </div>
        <nav className="ds-sidebar__nav">
          {sections.map((s, i) => (
            <Fragment key={i}>
              {s.title ? <span className="ds-sidebar__title">{s.title}</span> : null}
              {(s.items || []).map(it => {
                const Tag = (it.href ? 'a' : 'button') as ElementType;
                return (
                  <Tag
                    key={it.label}
                    {...(it.href ? { href: it.href } : { type: 'button' })}
                    className={cn('ds-sidenav', it.active && 'is-active')}
                    aria-current={it.active ? 'page' : undefined}
                    title={collapsed ? it.label : undefined}
                    onClick={it.onClick}
                  >
                    {it.icon}<span className="ds-sidenav__label">{it.label}</span>
                  </Tag>
                );
              })}
            </Fragment>
          ))}
        </nav>
        {footer ? <div className="ds-sidebar__foot">{footer}</div> : null}
        {children}
      </aside>
    </Fragment>
  );
}
