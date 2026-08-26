import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

/**
 * La marque, rendue en CSS : capitales de `--font-display` + une pastille carrée à
 * coins arrondis en dégradé (côté ~0.21em, rayon 25 %, lueur `--shadow-logo-dot` —
 * voir tokens/base.css). La pastille garde le dégradé de marque sur tous les fonds ;
 * seules les lettres s'inversent.
 *
 * PARAMÉTRÉ POUR LE TEMPLATE. Le mot-marque, le monogramme, la pastille et le libellé
 * accessible sont des props ; aucun nom n'est codé en dur dans une règle CSS.
 *
 *     <Logo wordmark={['Northwind','Labs']} />
 *     <Logo wordmark="Northwind" dot={false} />
 *     <Logo wordmark="Northwind" dot={<img src="/mark.svg" alt="" height={12} />} />
 *
 * LE DÉFAUT EST UN PLACEHOLDER, PAS UNE MARQUE. Il valait ['Julien','Fernandes'] : un
 * projet qui oubliait de renseigner le mot-marque — ou d'alimenter la fente `brand` de
 * Navbar, Footer ou Sidebar, qui retombent sur ce composant — livrait le nom de Julien
 * EN SILENCE, et ça pouvait survivre jusqu'en production. C'est le principe du §1.1 du
 * chantier, un manque doit CASSER VISIBLEMENT, appliqué au contenu et non aux jetons.
 * Rendre la prop obligatoire casserait à la compilation, prix trop élevé ; « ACME » se
 * voit à la première seconde et ne coûte rien.
 * Ces deux constantes migrent dans `src/brand.ts` au sous-lot 5.
 *
 * Les PNG fournis (pastille orange à plat) restent dans assets/logo/ comme exports
 * statiques. Ne jamais fausse-grasser, contourer ou interlettrer la marque.
 */
export interface LogoProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'wordmark' | 'stacked' | 'monogram';
  /** ink = lettres foncées (sur crème) · bone = lettres claires (sur encre). Par défaut, le --foreground de la surface. */
  tone?: 'ink' | 'bone';
  /** Longueur CSS, toujours en rem — hauteur totale de la marque (le font-size en découle). */
  height?: string;
  /**
   * Le mot-marque. Une chaîne, ou un mot par ligne pour la variante `stacked`.
   * Défaut : le PLACEHOLDER `Acme` — à remplacer, pas à laisser.
   */
  wordmark?: string | readonly string[];
  /** Le monogramme. Défaut : les initiales du mot-marque, ou `AC` pour le placeholder. */
  monogram?: string;
  /** La pastille. `false` la retire ; un nœud la remplace. Défaut : la pastille CSS en dégradé. */
  dot?: ReactNode | false;
  /** Libellé accessible. Défaut : le mot-marque, mots joints par une espace. */
  label?: string;
}

/* Le placeholder livré par défaut. Deux constantes plutôt qu'une : les initiales de
   « Acme » donneraient « A », qui ressemble trop à un vrai monogramme d'une lettre. */
const BRAND_WORDMARK: readonly string[] = ['Acme'];
const BRAND_MONOGRAM = 'AC';

export function Logo({
  variant = 'wordmark', tone, height = '1.75rem',
  wordmark = BRAND_WORDMARK, monogram, dot, label,
  className = '', style, ...rest
}: LogoProps): JSX.Element {
  const words = typeof wordmark === 'string' ? [wordmark] : [...wordmark];
  const name = label ?? words.join(' ');
  /* Le monogramme se DÉRIVE des initiales dès qu'un projet fournit son mot-marque ;
     seul le placeholder a le sien, écrit. */
  const initials = monogram
    ?? (wordmark === BRAND_WORDMARK ? BRAND_MONOGRAM : words.map((w) => w.slice(0, 1)).join(''));
  const color = tone === 'bone' ? 'var(--cream)' : tone === 'ink' ? 'var(--ink)' : 'var(--foreground)';
  /* `dot === undefined` = la pastille par défaut ; `false` = aucune ; sinon le nœud fourni. */
  const mark = dot === false ? null
    : dot === undefined ? <span aria-hidden="true" className="jf-logo__dot" />
    : dot;
  const base: CSSProperties = { fontSize: 'calc(' + height + ' * 1.25)', color, ...style };

  if (variant === 'monogram') {
    return (
      <span className={cn('jf-logo', className)} style={base} aria-label={name} {...rest}>
        {initials}{mark}
      </span>
    );
  }
  if (variant === 'stacked') {
    return (
      <span
        className={cn('jf-logo', className)}
        style={{ ...base, flexDirection: 'column', alignItems: 'flex-start', gap: '0.08em' }}
        aria-label={name}
        {...rest}
      >
        {words.slice(0, -1).map((w) => <span key={w}>{w}</span>)}
        <span style={{ display: 'inline-flex', alignItems: 'flex-end' }}>{words[words.length - 1]}{mark}</span>
      </span>
    );
  }
  return (
    <span className={cn('jf-logo', className)} style={base} aria-label={name} {...rest}>
      {words.join(' ')}{mark}
    </span>
  );
}
