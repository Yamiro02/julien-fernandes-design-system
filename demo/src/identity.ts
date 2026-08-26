/* L'IDENTITÉ DU PROJET — pas celle du design system.
   Un mot-marque, un monogramme, un prénom d'exemple : ce sont des CONTENUS d'application,
   pas des jetons. Le socle n'en porte aucun depuis que `Logo` est paramétré ; ce fichier
   tient le rôle du client qui les fournit.
   Sous VITE_BRAND=test, la vitrine change d'identité en même temps que de palette : sans
   ça, une vitrine aux couleurs froides afficherait encore « JULIEN FERNANDES » et le test
   du template resterait ambigu à l'œil, même s'il est vert à la mesure. */
const TEST = import.meta.env.VITE_BRAND === 'test';

export const IDENTITY = TEST
  ? { wordmark: ['Northwind', 'Labs'], prenom: 'Astrid', personne: 'Astrid Nyquist',
      lieu: 'Reykjavík · Islande', titre: 'Northwind Labs — Design System' }
  : { wordmark: ['Julien', 'Fernandes'], prenom: 'Julien', personne: 'Julien Fernandes',
      lieu: 'Busan · Corée du Sud', titre: 'Julien Fernandes — Design System' };
