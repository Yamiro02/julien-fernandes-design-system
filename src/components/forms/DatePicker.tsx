import { useEffect, useRef, useState } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../icons/Icon';
import { Calendar } from './Calendar';

/**
 * Input-styled trigger (calendar icon) + Calendar in a popover (Dropdown mechanics:
 * outside click / Escape close). Single date. Same surface rule as Input.
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
}

export function DatePicker({
  value, onChange, placeholder = 'Choisir une date', locale = 'fr-FR', min, max,
  disabledDates, surface = 'page', invalid = false, disabled = false, className = '', ...rest
}: DatePickerProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);
  const fmt = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <span className={cn('jf-datepicker', className)} ref={ref} {...rest}>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn('jf-input', 'jf-datepicker__trigger', surface === 'card' && 'jf-input--on-card', invalid && 'is-error')}
        onClick={() => setOpen(o => !o)}
      >
        <span className={value ? '' : 'jf-datepicker__ph'}>{value ? fmt.format(value) : placeholder}</span>
        <Icon name="calendar" size="1.25rem" />
      </button>
      {open ? (
        <span className="jf-datepicker__pop" role="dialog" aria-label="Choisir une date">
          <Calendar
            bare
            value={value}
            min={min}
            max={max}
            disabledDates={disabledDates}
            locale={locale}
            onChange={d => { onChange && onChange(d); setOpen(false); }}
          />
        </span>
      ) : null}
    </span>
  );
}
