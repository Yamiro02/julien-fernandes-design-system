import { isValidElement, useEffect } from 'react';
import type { HTMLAttributes, JSX, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Rail } from './Rail';

/* Même déclaration que dans ActionSheet : `process.env.NODE_ENV` est remplacé par le
   bundler de l'app, le socle ne dépend pas des types de Node. */
declare const process: { env: { NODE_ENV?: string } };

/**
 * Tool-app skeleton: grid [Sidebar | content]. Under 64rem the sidebar becomes a
 * drawer (Sidebar's `open`/`onClose`); `responsive={false}` pins the desktop layout.
 *
 * Le slot `sidebar` accepte aussi un `<Rail>` (v0.21.0) : même grille, même règle
 * sticky. Mais un rail n'a PAS de forme tiroir — il se monte en `responsive={false}`.
 */
export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  /** A <Sidebar> element — or a <Rail>, with `responsive={false}`. */
  sidebar?: ReactNode;
  /**
   * Default true. False disables the drawer breakpoint (fixed two-column layout).
   * Obligatoire à `false` avec un `<Rail>` : sous 64rem, la grille responsive passe en une
   * colonne et un rail — qui n'est jamais un tiroir — s'empilerait au-dessus du contenu.
   */
  responsive?: boolean;
  children?: ReactNode;
}

export function AppShell({
  sidebar, responsive = true, className = '', children, ...rest
}: AppShellProps): JSX.Element {
  /* LE RAIL N'A PAS DE TIROIR, et l'oubli serait une panne visible seulement sous 64rem —
     donc sur l'écran de quelqu'un d'autre. On le dit en console, en développement. */
  const railResponsive = responsive && isValidElement(sidebar) && sidebar.type === Rail;
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' || !railResponsive) return;
    console.warn(
      '[ds] AppShell: un <Rail> est monté dans un AppShell responsive. Un rail n\'a pas de forme '
      + 'tiroir — sous 64 rem il s\'empilerait au-dessus du contenu. Passe `responsive={false}`.',
    );
  }, [railResponsive]);

  return (
    <div className={cn('ds-appshell', !responsive && 'ds-appshell--static', className)} {...rest}>
      {sidebar}
      <main className="ds-appshell__main">{children}</main>
    </div>
  );
}
