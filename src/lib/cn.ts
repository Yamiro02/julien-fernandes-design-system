/**
 * Composition de classes — reproduit exactement la logique des sources
 * (`[...].filter(Boolean).join(' ')`), sans dépendance.
 */
export type ClassValue = string | false | null | undefined;

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}
