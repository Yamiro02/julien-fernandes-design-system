import type { ElementType, HTMLAttributes, JSX, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Logo } from '../brand/Logo';
import type { SidebarItem } from './Sidebar';

/**
 * LE RAIL D'ICÔNES — v0.21.0. Une colonne de --rail-w (3.75rem) sur --secondary : le
 * point de marque en tête, des entrées en icône SEULE, un ressort, les entrées de pied,
 * l'avatar. Relevé sur les quinze écrans et la planche f1 des maquettes v2 d'une app.
 *
 * RAIL OU SIDEBAR — la règle qui départage, pour que la question ne se repose pas à
 * chaque app :
 *   · RAIL    = icônes seules, largeur fixe, JAMAIS de repli. Le libellé d'une entrée est
 *               son `title` et son nom accessible, rien d'autre. Un châssis de bureau.
 *   · SIDEBAR = libellés, sections titrées, repliable par l'utilisateur (et persisté),
 *               tiroir sous 64rem.
 * Une app choisit l'un. Le rail n'est pas la barre repliée : 3.75rem contre 4.5, des
 * carrés d'icône contre des pilules, le point de marque contre le monogramme, pas de
 * bouton. Il ne partage avec `Sidebar` que le type `SidebarItem` et `linkAs` — aucune
 * règle `.ds-sidebar*` n'est touchée.
 *
 * UNE ENTRÉE EST UN IconButton, par ses classes : `ghost` au repos, `accent` quand elle
 * est active — la variante née en 0.17.0 pour exactement cet état. Par ses classes et
 * non par le composant, pour la même raison que `Sidebar` : `linkAs` (NavLink…) doit
 * pouvoir rendre l'entrée, et `href` lui arrive en `to`.
 *
 * PAS DE FORME TIROIR. Le rail se monte dans un `AppShell responsive={false}` : sous
 * 64rem, un AppShell responsive passe sa grille en une colonne et le rail s'empilerait
 * au-dessus du contenu. AppShell le signale en console en développement.
 */
export interface RailProps extends HTMLAttributes<HTMLElement> {
  /** Les destinations, en tête. `label` est requis : c'est le `title` et le nom accessible. */
  items?: SidebarItem[];
  /** Les entrées posées EN PIED, après le ressort (Réglages…) — même rendu que `items`. */
  footerItems?: SidebarItem[];
  /** La marque, en tête. Défaut : `<Logo variant="dot" height="1.75rem" />`, le point de marque. */
  brand?: ReactNode;
  /** Le pied — typiquement un `<Avatar size="1.75rem" halo={false} />`. */
  footer?: ReactNode;
  /** Le nom accessible de la navigation. Défaut : « Navigation ». */
  label?: string;
  /**
   * Le composant qui rend une entrée PORTANT UN `href` — le jumeau exact de celui de
   * `Sidebar`, pour la même raison : une app à routeur client passe `linkAs={NavLink}`,
   * et `href` lui arrive en `to`. Défaut : `'a'`.
   */
  linkAs?: ElementType;
}

export function Rail({
  items = [], footerItems = [], brand, footer, label = 'Navigation', linkAs,
  className = '', children, ...rest
}: RailProps): JSX.Element {
  /* LE rendu d'une entrée — partagé par la navigation ET le pied, comme dans Sidebar. */
  const rendreEntree = (it: SidebarItem): JSX.Element => {
    const Tag = (it.href ? (linkAs ?? 'a') : 'button') as ElementType;
    const destination = it.href
      ? (linkAs ? { to: it.href } : { href: it.href })
      : { type: 'button' as const };
    return (
      <Tag
        key={it.label}
        {...destination}
        className={cn('ds-icon-btn', it.active ? 'ds-icon-btn--accent' : 'ds-icon-btn--ghost', 'ds-rail__item')}
        aria-current={it.active ? 'page' : undefined}
        aria-label={it.label}
        title={it.label}
        onClick={it.onClick}
      >
        {it.icon}
      </Tag>
    );
  };

  return (
    <aside className={cn('ds-rail', className)} {...rest}>
      <div className="ds-rail__brand">{brand ?? <Logo variant="dot" height="1.75rem" />}</div>
      <nav className="ds-rail__nav" aria-label={label}>{items.map(rendreEntree)}</nav>
      <span className="ds-rail__spacer" aria-hidden="true" />
      {footerItems.length ? <div className="ds-rail__footnav">{footerItems.map(rendreEntree)}</div> : null}
      {footer ? <div className="ds-rail__foot">{footer}</div> : null}
      {children}
    </aside>
  );
}
