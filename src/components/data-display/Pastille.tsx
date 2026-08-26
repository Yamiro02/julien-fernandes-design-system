import type { HTMLAttributes, ReactNode } from 'react';
import { cva } from 'class-variance-authority';

/**
 * The system's icon tile — one component for every tinted square-or-round icon holder.
 * Replaces the two internal tiles (Modal's 2.625rem tile, EmptyState's --grad-soft tile).
 * Sizes are named BY CONTEXT, never by measure, so a call site never hard-codes a rem.
 */
export interface PastilleProps extends HTMLAttributes<HTMLSpanElement> {
  /** carte 2.25 · dialogue 2.625 · panneau 3.25 · héros 4 · écran 5rem — radius steps with the size. */
  size?: 'carte' | 'dialogue' | 'panneau' | 'heros' | 'ecran';
  /** square = softened square (radius follows size) · round = --radius-pill. */
  shape?: 'square' | 'round';
  /** brand (--grad-soft + --primary) · the 6 semantic pairs · inverse (--foreground on --background). */
  tone?: 'brand' | 'coral' | 'amber' | 'success' | 'warning' | 'danger' | 'neutral' | 'inverse';
  /** 1px currentColor @22% contour — EmptyState's hairline, generalised to every tone. */
  outlined?: boolean;
  children?: ReactNode;
}

const pastille = cva('jf-pastille', {
  variants: {
    size: {
      carte: 'jf-pastille--carte',
      dialogue: 'jf-pastille--dialogue',
      panneau: 'jf-pastille--panneau',
      heros: 'jf-pastille--heros',
      ecran: 'jf-pastille--ecran',
    },
    shape: { square: '', round: 'jf-pastille--rond' },
    tone: {
      brand: 'jf-pastille--brand',
      coral: 'jf-pastille--coral',
      amber: 'jf-pastille--amber',
      success: 'jf-pastille--success',
      warning: 'jf-pastille--warning',
      danger: 'jf-pastille--danger',
      neutral: 'jf-pastille--neutral',
      inverse: 'jf-pastille--inverse',
    },
    outlined: { true: 'jf-pastille--outlined', false: '' },
  },
  defaultVariants: { size: 'dialogue', shape: 'square', tone: 'brand', outlined: false },
});

export function Pastille({
  size = 'dialogue', shape = 'square', tone = 'brand', outlined = false,
  className = '', children, ...rest
}: PastilleProps): JSX.Element {
  const cls = [pastille({ size, shape, tone, outlined }), className].filter(Boolean).join(' ');
  return <span className={cls} {...rest}>{children}</span>;
}
