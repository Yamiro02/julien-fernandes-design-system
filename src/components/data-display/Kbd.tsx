import type { HTMLAttributes, JSX, ReactNode } from 'react';
import { cn } from '../../lib/cn';

/**
 * LA TOUCHE — v0.21.0. Une touche de clavier telle qu'une interface la nomme : « ⌘ »,
 * « K », « ↵ », « Échap ». Relevé sur les maquettes v2 d'une app, où elle apparaît
 * quarante-sept fois sous une seule forme : `min-width` et `height` 1.375rem, padding
 * `0 .375rem`, rayon `xs`, fond `--secondary`, filet interne 1px `--border`, caption
 * semi-gras en `--text-secondary` (10,31 sur --card, 9,22 en sombre).
 *
 * Une VRAIE balise <kbd> : c'est ce qu'un lecteur d'écran et un moteur attendent d'une
 * touche. Le socle repose `kbd` sur --font-mono (tokens/base.css) ; la touche, elle, est
 * en corps de texte, comme les maquettes — .ds-kbd le redit.
 *
 * Une combinaison est une SUITE de touches, jamais une touche qui contient « ⌘K » :
 *     <Kbd>⌘</Kbd> <Kbd>K</Kbd>
 * Ce n'est pas un Badge (pilule, 1.5rem, méta) ni un chip : une touche est un carré à
 * coins à peine adoucis, et sa hauteur est la sienne.
 */
export interface KbdProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export function Kbd({ className = '', children, ...rest }: KbdProps): JSX.Element {
  return <kbd className={cn('ds-kbd', className)} {...rest}>{children}</kbd>;
}
