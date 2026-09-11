import { forwardRef } from 'react';
import type { InputHTMLAttributes, JSX, ReactNode } from 'react';
import { cn } from '../../lib/cn';

/**
 * Single-line text field on the shared control rail, aligned with Button and the Select trigger.
 * Focus = the border turns --ring — ONE border, never an extra ring. Never a pill.
 * `forwardRef` : la ref atteint l'<input> natif — c'est ce qui rend le champ utilisable
 * avec une bibliothèque de formulaires (register() de react-hook-form pose une ref).
 */
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  /** Red border + 3px destructive ring. Always pair with an error message. */
  invalid?: boolean;
  /** 'page' (default) = sits directly on the layout (fill --secondary, like navbar/tabs/search) · 'card' = inside a card (fill --background). */
  surface?: 'page' | 'card';
  /**
   * L'unité du champ — « kg », « € », « min » — posée DANS le champ, à droite, en
   * sourdine (v0.17.0, manque remonté par Dashboard). Trois caractères au plus : le
   * padding réservé est fixe (--space-7) ; plus long, c'est un suffixe de libellé, pas
   * une unité. `aria-hidden` : c'est au libellé du FormField de la nommer.
   */
  unit?: string;
  /**
   * L'icône de TÊTE — une loupe devant « Chercher une vidéo… » (v0.21.0, relevé sur les
   * maquettes v2 d'une app). Le miroir exact de `unit`, à gauche : posée DANS le champ,
   * à .875rem du bord, 1rem, en sourdine, hors du pointeur. Passez un `<Icon>` sans
   * `size` : le créneau des déclencheurs de champ le rend à 1rem. Elle est décorative
   * (`aria-hidden`) : c'est au `placeholder` ou au libellé de dire ce que fait le champ.
   * `icon` et `unit` se cumulent sur un même champ.
   */
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({
  size = 'md', invalid = false, surface = 'page', unit, icon, className = '', ...rest
}: InputProps, ref): JSX.Element {
  // surface: 'page' (default) = the input sits directly on the layout (fill --secondary) · 'card' = inside a card (fill --background).
  // Since the surface-inference rule in patterns.css, a field inside a Card, Modal, ActionSheet, Dropdown or DatePicker pop deduces --background by itself — the prop is only needed for other containers.
  /* Le rail passe par des classes, jamais par un style inline : `--control-sm`
     aliase `--control-md` depuis le rail unique, mais la classe reste pour l'API
     et pour le jour où le rail redivergerait. */
  const cls = cn(
    'ds-input',
    size !== 'md' && 'ds-input--' + size,
    surface === 'card' && 'ds-input--on-card',
    invalid && 'is-error',
    className,
  );
  const champ = <input ref={ref} className={cls} aria-invalid={invalid || undefined} {...rest} />;
  if (!unit && !icon) return champ;
  /* L'enveloppe n'existe QUE si `unit` ou `icon` est passé : sans elle, le DOM d'hier — un
     <input> nu — ne bouge pas d'un nœud. Chaque affixe pose SON modificateur : c'est lui
     qui réserve le padding de son côté, et seulement de son côté. */
  return (
    <span className={cn('ds-input-wrap', icon ? 'ds-input-wrap--icon' : null, unit ? 'ds-input-wrap--unit' : null)}>
      {icon ? <span className="ds-input-wrap__icon" aria-hidden="true">{icon}</span> : null}
      {champ}
      {unit ? <span className="ds-input-wrap__unit" aria-hidden="true">{unit}</span> : null}
    </span>
  );
});
Input.displayName = 'Input';
