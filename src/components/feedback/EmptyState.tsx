import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Pastille } from '../data-display/Pastille';

/** Dashed-border empty slot: <Pastille size="panneau" tone="brand" outlined> tile, titre H4 en face display, one next step. */
export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({
  icon, title, description, action, className = '', ...rest
}: EmptyStateProps): JSX.Element {
  return (
    <div className={cn('ds-empty', className)} {...rest}>
      {icon ? <Pastille size="panneau" tone="brand" outlined>{icon}</Pastille> : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1875rem', alignItems: 'center' }}>
        <h4 style={{ margin: 0 }}>{title}</h4>
        {description ? (
          <p style={{
            maxWidth: '20rem', color: 'var(--muted-foreground)',
            fontSize: '0.84375rem', lineHeight: 1.5,
          }}>{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
