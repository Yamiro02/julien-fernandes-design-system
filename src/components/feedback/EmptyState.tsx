import type { HTMLAttributes, JSX, ReactNode } from 'react';
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
      <div className="ds-empty__main">
        <h4 className="ds-empty__title">{title}</h4>
        {description ? <p className="ds-empty__desc">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
