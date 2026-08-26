/**
 * ══════════════════════════════════════════════════════════════════════════════
 * IDENTITÉ TEXTUELLE — ✏️ À REMPLIR
 * ══════════════════════════════════════════════════════════════════════════════
 * Le SEUL endroit du paquet où le nom de la marque est écrit en dur. `Logo`, `Navbar`,
 * `Footer`, `Sidebar` et `Avatar` lisent d'ici : vous changez ces trois constantes, tout
 * le système suit.
 *
 *   npm run rebrand -- "@votre-scope/ds" "Votre Nom"
 *
 * réécrit ce fichier pour vous.
 *
 * LES VALEURS SONT DES PLACEHOLDERS, PAS UNE MARQUE. Elles portaient un nom réel :
 * un projet qui oubliait de les remplir — ou d'alimenter la fente `brand` de Navbar, Footer
 * ou Sidebar, qui retombent sur `Logo` — livrait le nom de quelqu'un d'autre EN SILENCE, et
 * ça pouvait survivre jusqu'en production. « ACME » se voit à la première seconde.
 *
 * Ces constantes ne sont que des DÉFAUTS : chaque composant garde sa prop, qui l'emporte.
 * Une app multi-marques passe la sienne à chaque appel sans toucher à ce fichier.
 * ══════════════════════════════════════════════════════════════════════════════
 */

/** Nom complet — libellés d'accessibilité, aria-label, alt d'avatar. */
export const BRAND_NAME = 'Acme';

/** Initiales — variante `monogram` du logo, repli de l'Avatar. 1 à 3 lettres. */
export const BRAND_MONOGRAM = 'AC';

/**
 * Le mot-marque, ligne par ligne. Une seule entrée = variantes `wordmark` et `stacked`
 * identiques. Deux entrées (`['Ma', 'Marque']`) = `stacked` empile les deux lignes,
 * `wordmark` les rend sur une seule.
 */
export const BRAND_WORDMARK_LINES: readonly string[] = ['Acme'];
