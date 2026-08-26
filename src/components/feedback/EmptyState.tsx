import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

/** Dashed-border empty slot: --grad-soft icon tile, Anton H4 title, one next step. */
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
    <div className={cn('jf-empty', className)} {...rest}>
      {icon ? <span className="jf-empty__icon">{icon}</span> : null}
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
