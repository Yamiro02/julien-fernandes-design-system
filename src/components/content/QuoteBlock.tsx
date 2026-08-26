import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../icons/Icon';

/** Pull quote. Body type, not Anton — Anton is for headings only. */
export interface QuoteBlockProps extends Omit<HTMLAttributes<HTMLElement>, 'role'> {
  quote: ReactNode;
  author?: ReactNode;
  /** Separated from the author by a middle dot. */
  role?: ReactNode;
}

export function QuoteBlock({ quote, author, role, className = '', ...rest }: QuoteBlockProps): JSX.Element {
  return (
    <figure className={cn('jf-quote', className)} style={{ margin: 0 }} {...rest}>
      <Icon name="quote" size="1.5rem" style={{ color: 'var(--primary)' }} />
      <blockquote style={{
        margin: 'var(--space-4) 0 0', fontSize: 'var(--text-body-lg)',
        lineHeight: 'var(--leading-body)', color: 'var(--foreground)',
      }}>{quote}</blockquote>
      {(author || role) ? (
        <figcaption style={{
          marginTop: 'var(--space-4)', fontSize: 'var(--text-caption)', color: 'var(--text-muted)',
        }}>{author}{author && role ? ' · ' : ''}{role}</figcaption>
      ) : null}
    </figure>
  );
}
