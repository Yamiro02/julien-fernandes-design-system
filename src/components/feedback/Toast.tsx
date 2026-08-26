import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Icon, type IconName } from '../icons/Icon';

/** Transient notification on --popover with --shadow-lg. Always colour + icon + text. */
export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: 'success' | 'danger' | 'warning' | 'info';
  title: ReactNode;
  description?: ReactNode;
  onClose?: () => void;
}

const TONES: Record<string, { icon: IconName; bg: string; fg: string }> = {
  success: { icon: 'check', bg: 'var(--pill-success-bg)', fg: 'var(--pill-success-fg)' },
  danger: { icon: 'x', bg: 'var(--pill-danger-bg)', fg: 'var(--pill-danger-fg)' },
  warning: { icon: 'triangle-alert', bg: 'var(--pill-warning-bg)', fg: 'var(--pill-warning-fg)' },
  info: { icon: 'info', bg: 'var(--pill-neutral-bg)', fg: 'var(--muted-foreground)' },
};

export function Toast({
  tone = 'info', title, description, onClose, className = '', ...rest
}: ToastProps): JSX.Element {
  const t = TONES[tone] || TONES.info;
  return (
    <div className={cn('ds-toast', className)} role="status" {...rest}>
      <span className="ds-toast__icon" style={{ background: t.bg, color: t.fg }}>
        <Icon name={t.icon} size="0.9375rem" strokeWidth={2.5} />
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem', flex: 1 }}>
        <span className="ds-toast__title">{title}</span>
        {description ? <span className="ds-toast__desc">{description}</span> : null}
      </div>
      {onClose ? (
        <button type="button" className="ds-toast__close" aria-label="Fermer" onClick={onClose}>
          <Icon name="x" size="1rem" />
        </button>
      ) : null}
    </div>
  );
}
