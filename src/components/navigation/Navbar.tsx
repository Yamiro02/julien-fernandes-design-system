import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Logo } from '../brand/Logo';

/**
 * Sticky top bar: logo left, links centre, CTA right. Sits on --secondary with a
 * hairline bottom border AT ALL TIMES — it is a control detached from the layout,
 * never transparent. On scroll it tints (color-mix on --secondary), adds
 * backdrop-filter blur(10px) and a shadow. Blur is the only place the system uses
 * backdrop-filter. No glassmorphism anywhere else.
 */
export interface NavLink { label: string; href?: string; active?: boolean }

export interface NavbarProps {
  links?: NavLink[];
  cta?: ReactNode;
  /**
   * La marque, à gauche. Défaut : le `Logo` du paquet, à la bonne hauteur.
   * Un projet passe la sienne ici — mot-marque, image, ce qu'il veut — sans ouvrir le socle.
   */
  brand?: ReactNode;
  /** Cible du lien de marque. Défaut '#'. */
  homeHref?: string;
  /** Libellé accessible du lien de marque. GÉNÉRIQUE par défaut : aucun nom de marque n'est
   *  codé en dur ici. Un projet peut passer « Northwind Labs — accueil ». */
  homeLabel?: string;
  /** Forces the Logo letter tone ('ink' / 'bone'). Default: letters follow --foreground. */
  tone?: 'ink' | 'bone';
  /** Force the scrolled state (specimen cards / screenshots). */
  scrolled?: boolean;
  className?: string;
  children?: ReactNode;
}

export function Navbar({
  links = [], cta, brand, homeHref = '#', homeLabel = 'Accueil', tone,
  scrolled: forced, className = '', children,
}: NavbarProps): JSX.Element {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (forced !== undefined) return;
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [forced]);
  const isScrolled = forced !== undefined ? forced : scrolled;
  return (
    <header className={cn('jf-navbar', isScrolled && 'is-scrolled', className)}>
      <div className="page jf-navbar__inner">
        <a href={homeHref} aria-label={homeLabel}>
          {brand ?? <Logo variant="wordmark" tone={tone} height="1.375rem" />}
        </a>
        <nav className="jf-navbar__links">
          {links.map(l => (
            <a key={l.label} href={l.href || '#'} className={cn('jf-navlink', l.active && 'is-active')}>{l.label}</a>
          ))}
        </nav>
        <div className="jf-navbar__cta">{children}{cta}</div>
      </div>
    </header>
  );
}
