import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Logo } from '../brand/Logo';

/** Site footer: mark, location line, link columns, social row. */
export interface FooterColumn { title: string; links: { label: string; href?: string }[] }

export interface FooterProps {
  columns?: FooterColumn[];
  social?: ReactNode;
  /** La marque. Défaut : le `Logo` du paquet. Un projet passe la sienne. */
  brand?: ReactNode;
  /** Forces the Logo letter tone ('ink' / 'bone'). Default: letters follow --foreground. */
  tone?: 'ink' | 'bone';
  /**
   * Ligne de lieu / signature, sous la marque. Le point médian sert de séparateur.
   * AUCUNE valeur par défaut : elle valait « Busan · Corée du Sud », c'est-à-dire la ville
   * de Julien codée en dur dans un composant du socle — un client ne pouvait pas la retirer
   * sans passer une chaîne vide. Omise, la ligne n'est pas rendue.
   */
  note?: string;
  className?: string;
}

export function Footer({
  columns = [], social, brand, tone, note, className = '',
}: FooterProps): JSX.Element {
  return (
    <footer className={cn('jf-footer', className)}>
      <div className="page" style={{
        paddingBlock: 'var(--space-7)', display: 'flex', flexWrap: 'wrap',
        gap: 'var(--space-7)', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxWidth: '20rem' }}>
          {brand ?? <Logo variant="wordmark" tone={tone} height="1.25rem" />}
          {note ? <p style={{ fontSize: 'var(--text-caption)', color: 'var(--text-muted)' }}>{note}</p> : null}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-7)' }}>
          {columns.map(col => (
            <div key={col.title} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <span className="eyebrow">{col.title}</span>
              {col.links.map(l => (
                <a key={l.label} href={l.href || '#'} style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
                  {l.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
      {social ? (
        <div className="page" style={{ paddingBottom: 'var(--space-6)', display: 'flex', gap: 'var(--space-3)' }}>
          {social}
        </div>
      ) : null}
    </footer>
  );
}
