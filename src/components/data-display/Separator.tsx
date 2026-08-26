import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

/** Thin rule from --border. With `label`, renders the text centred on the line. */
export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  /** Centred caption on the line (horizontal only). */
  label?: ReactNode;
}

export function Separator({
  orientation = 'horizontal', label, className = '', ...rest
}: SeparatorProps): JSX.Element {
  const cls = cn('jf-sep', orientation === 'vertical' && 'jf-sep--vertical', label ? 'jf-sep--label' : '', className);
  return <div role="separator" aria-orientation={orientation} className={cls} {...rest}>{label || null}</div>;
}
