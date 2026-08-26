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
  /** Logo tone — 'ink' on cream pages, 'bone' on ink pages. */
  tone?: 'ink' | 'bone';
  /** Force the scrolled state (specimen cards / screenshots). */
  scrolled?: boolean;
  className?: string;
  children?: ReactNode;
}

export function Navbar({
  links = [], cta, tone = 'ink', scrolled: forced, className = '', children,
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
        <a href="#" aria-label="Julien Fernandes — accueil"><Logo variant="wordmark" tone={tone} height="1.375rem" /></a>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
          {links.map(l => (
            <a key={l.label} href={l.href || '#'} className={cn('jf-navlink', l.active && 'is-active')}>{l.label}</a>
          ))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>{children}{cta}</div>
      </div>
    </header>
  );
}
