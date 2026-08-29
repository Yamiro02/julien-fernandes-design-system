import { forwardRef, useEffect, useRef, useState } from 'react';
import type { HTMLAttributes, JSX, Ref } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../icons/Icon';
import { Calendar } from './Calendar';

/**
 * Input-styled trigger (calendar icon) + Calendar in a popover (Dropdown mechanics:
 * outside click / Escape close). Single date. Same surface rule as Input.
 *
 * `forwardRef` : la ref externe est COMPOSÉE avec la ref interne (détection de clic
 * extérieur) sur le <span> racine — on n'a pas remplacé l'une par l'autre.
 * Le composant ne rend aucun champ natif visible : un <input type="hidden"> porte
 * `name` et la date au format ISO (YYYY-MM-DD), pour qu'une soumission de <form>
 * emporte la valeur. Pour react-hook-form, l'intégration se fait par <Controller> —
 * le composant est contrôlé (`value` / `onChange(Date)`).
 */
export interface DatePickerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'onChange'> {
  value?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  /** BCP 47 tag. Default 'fr-FR'. */
  locale?: string;
  min?: Date;
  max?: Date;
  disabledDates?: Date[];
  /** 'page' (default) = on the layout (fill --secondary) · 'card' = inside a card (fill --background). */
  surface?: 'page' | 'card';
  invalid?: boolean;
  disabled?: boolean;
  /** Nom du champ soumis par le <form>. Sans lui, pas d'input caché : rien n'est soumis. */
  name?: string;
}

/* La date au format de soumission — local, pas UTC : toISOString() décalerait d'un
   jour les dates saisies après 22h en Europe. */
function iso(d: Date): string {
  const p = (n: number): string => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export const DatePicker = forwardRef<HTMLSpanElement, DatePickerProps>(function DatePicker({
  value, onChange, placeholder = 'Choisir une date', locale = 'fr-FR', min, max,
  disabledDates, surface = 'page', invalid = false, disabled = false, name, className = '', ...rest
}: DatePickerProps, refExterne: Ref<HTMLSpanElement>): JSX.Element {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    /* Échap rend le focus au déclencheur : le popover disparaît sous le focus, qui
       repartirait sinon du début du document. Le clic extérieur, lui, ne le vole pas —
       l'utilisateur vient de cliquer ailleurs. */
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); } };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);
  const fmt = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  const poserRefs = (node: HTMLSpanElement | null): void => {
    ref.current = node;
    if (typeof refExterne === 'function') refExterne(node);
    else if (refExterne) (refExterne as { current: HTMLSpanElement | null }).current = node;
  };
  return (
    <span className={cn('ds-datepicker', className)} ref={poserRefs} {...rest}>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn('ds-input', 'ds-datepicker__trigger', surface === 'card' && 'ds-input--on-card', invalid && 'is-error')}
        onClick={() => setOpen(o => !o)}
      >
        <span className={value ? '' : 'ds-datepicker__ph'}>{value ? fmt.format(value) : placeholder}</span>
        {/* Sans taille : le créneau du déclencheur rend 1rem (patterns.css, v0.17.0). */}
        <Icon name="calendar" />
      </button>
      {name ? <input type="hidden" name={name} value={value ? iso(value) : ''} /> : null}
      {open ? (
        <span className="ds-datepicker__pop" role="dialog" aria-label="Choisir une date">
          <Calendar
            bare
            value={value}
            min={min}
            max={max}
            disabledDates={disabledDates}
            locale={locale}
            onChange={d => { onChange && onChange(d); setOpen(false); triggerRef.current?.focus(); }}
          />
        </span>
      ) : null}
    </span>
  );
});
DatePicker.displayName = 'DatePicker';
