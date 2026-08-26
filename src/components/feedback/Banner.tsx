import type { HTMLAttributes, ReactNode } from 'react';
import { cva } from 'class-variance-authority';
import { Icon, type IconName } from '../icons/Icon';

/** Inline, persistent message inside a page or a card. Always colour + icon + text. */
export interface BannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: 'danger' | 'warning' | 'success' | 'info';
  title?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
}

const BANNER_ICONS: Record<string, IconName> = {
  danger: 'triangle-alert', warning: 'triangle-alert', success: 'circle-check', info: 'info',
};

const banner = cva('ds-banner', {
  variants: {
    tone: {
      danger: 'ds-banner--danger',
      warning: 'ds-banner--warning',
      success: 'ds-banner--success',
      info: 'ds-banner--info',
    },
  },
  defaultVariants: { tone: 'info' },
});

export function Banner({
  tone = 'info', title, children, action, className = '', ...rest
}: BannerProps): JSX.Element {
  return (
    <div className={[banner({ tone }), className].filter(Boolean).join(' ')} role="note" {...rest}>
      <Icon name={BANNER_ICONS[tone]} size="1.125rem" strokeWidth={2} style={{ marginTop: '0.0625rem' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem', flex: 1 }}>
        {title ? (
          <span style={{
            fontSize: '0.875rem',
            fontWeight: 'var(--weight-semibold)',
            color: tone === 'info' ? 'var(--foreground)' : 'inherit',
          }}>{title}</span>
        ) : null}
        {children ? (
          <span style={{
            fontSize: 'var(--text-caption)',
            lineHeight: 'var(--leading-normal)',
            color: 'var(--text-secondary)',
          }}>{children}</span>
        ) : null}
      </div>
      {action}
    </div>
  );
}
