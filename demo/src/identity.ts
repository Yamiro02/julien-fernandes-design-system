import { BRAND_MONOGRAM, BRAND_NAME, BRAND_WORDMARK_LINES } from '@julienfernandes/ds';

/* L'IDENTITÉ DU PROJET — pas celle du design system.
   Un mot-marque, un lieu, un prénom d'exemple : ce sont des CONTENUS d'application, pas
   des jetons. Le socle n'en porte aucun ; ce fichier tient le rôle du projet qui les
   fournit — et par défaut il ne fournit rien, donc la vitrine affiche le PLACEHOLDER
   livré dans `src/brand.ts`. C'est ce que doit voir quelqu'un qui vient de copier le
   dossier : « ACME », qu'on ne peut pas oublier de remplacer. */
const MODE = import.meta.env.VITE_BRAND;

export const IDENTITY =
  MODE === 'jf'
    ? { wordmark: ['Julien', 'Fernandes'], monogram: 'JF', prenom: 'Julien',
        personne: 'Julien Fernandes', lieu: 'Busan · Corée du Sud',
        titre: 'Julien Fernandes — Design System' }
  : MODE === 'test'
    ? { wordmark: ['Northwind', 'Labs'], monogram: 'NL', prenom: 'Astrid',
        personne: 'Astrid Nyquist', lieu: 'Reykjavík · Islande',
        titre: 'Northwind Labs — Design System' }
    : { wordmark: BRAND_WORDMARK_LINES, monogram: BRAND_MONOGRAM, prenom: 'Alex',
        personne: BRAND_NAME, lieu: 'Ville · Pays',
        titre: BRAND_NAME + ' — Design System' };
