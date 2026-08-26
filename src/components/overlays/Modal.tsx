import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../icons/Icon';

/** Dialog on --popover, radius 2xl, --shadow-lg, over a 45% ink scrim with blur(2px). Width 23.75rem. */
export interface ModalProps {
  open?: boolean;
  /** Optional 2.625rem icon tile top-left — pass an <Icon />. */
  icon?: ReactNode;
  /** Tile tint: danger (default) · brand (--grad-soft) · neutral. */
  iconVariant?: 'danger' | 'brand' | 'neutral';
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  onClose?: () => void;
  /** Render the panel without the fixed scrim — for specimen cards. */
  inline?: boolean;
  className?: string;
  children?: ReactNode;
}

const ICON_TONES: Record<string, { bg: string; fg: string }> = {
  danger: { bg: 'var(--pill-danger-bg)', fg: 'var(--pill-danger-fg)' },
  brand: { bg: 'var(--grad-soft)', fg: 'var(--primary)' },
  neutral: { bg: 'var(--accent)', fg: 'var(--foreground)' },
};

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function Modal({
  open = true, icon, iconVariant = 'danger', title, description, footer,
  onClose, inline = false, className = '', children,
}: ModalProps): JSX.Element | null {
  const panelRef = useRef<HTMLDivElement>(null);

  /* Base shadcn `dialog` : Échap, piège de focus et restitution du focus.
     N'ajoute aucun style ni aucun nœud — le rendu reste celui de la source. */
  useEffect(() => {
    if (!open || inline) return;
    const previous = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    panel?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose?.(); return; }
      if (e.key !== 'Tab' || !panel) return;
      const nodes = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (nodes.length === 0) { e.preventDefault(); return; }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('keydown', onKeyDown); previous?.focus?.(); };
  }, [open, inline, onClose]);

  if (!open) return null;
  const it = ICON_TONES[iconVariant] || ICON_TONES.danger;

  const panel = (
    <div
      ref={panelRef}
      tabIndex={inline ? undefined : -1}
      className={cn('jf-modal', className)}
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === 'string' ? title : undefined}
    >
      {(icon || onClose) ? (
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          {icon ? <span className="jf-modal__icon" style={{ background: it.bg, color: it.fg }}>{icon}</span> : null}
          {onClose ? (
            <button type="button" className="jf-modal__close" aria-label="Fermer" onClick={onClose}>
              <Icon name="x" size="1.125rem" />
            </button>
          ) : null}
        </div>
      ) : null}
      {title ? <h3 style={{ margin: 0 }}>{title}</h3> : null}
      {(description || children) ? (
        <div style={{
          fontSize: '0.875rem', color: 'var(--muted-foreground)', lineHeight: 1.5,
          display: 'flex', flexDirection: 'column', gap: 'var(--space-3)',
        }}>
          {description ? <p style={{ margin: 0 }}>{description}</p> : null}
          {children}
        </div>
      ) : null}
      {footer ? (
        <div style={{ display: 'flex', gap: '0.625rem', justifyContent: 'flex-end', marginTop: '0.25rem' }}>{footer}</div>
      ) : null}
    </div>
  );

  if (inline) return panel;
  return (
    <div className="jf-scrim" style={{ position: 'fixed', zIndex: 50 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ display: 'flex', justifyContent: 'center' }}>{panel}</div>
    </div>
  );
}
