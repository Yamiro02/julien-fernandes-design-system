import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../icons/Icon';
import { IconButton } from '../actions/IconButton';

/**
 * Code cartridge — JetBrains Mono, discreet chrome bar, language badge, copy button.
 * JetBrains Mono is only ever used here and in technical metadata — never for body copy.
 */
export interface CodeBlockProps extends HTMLAttributes<HTMLDivElement> {
  language?: string;
  /** Shown instead of the language, e.g. "~/projects/app". */
  filename?: string;
  code?: string;
  onCopy?: () => void;
  /** Swaps the copy icon for a check. */
  copied?: boolean;
}

export function CodeBlock({
  language = 'bash', filename, code = '', onCopy, copied = false, className = '', ...rest
}: CodeBlockProps): JSX.Element {
  return (
    <div className={cn('jf-code', className)} {...rest}>
      <div className="jf-code__bar">
        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 0 }}>
          <Icon name="terminal" size="1rem" style={{ color: 'var(--text-muted)' }} />
          <span className="mono" style={{
            fontSize: 'var(--text-caption)', color: 'var(--text-muted)',
            overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{filename || language}</span>
        </span>
        <IconButton label={copied ? 'Copié' : 'Copier le code'} size="sm" onClick={onCopy}>
          <Icon name={copied ? 'check' : 'copy'} size="1rem" strokeWidth={copied ? 3 : 2} />
        </IconButton>
      </div>
      <pre className="jf-code__body"><code>{code}</code></pre>
    </div>
  );
}
