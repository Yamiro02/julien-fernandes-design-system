/// <reference types="vite/client" />

/* `virtual:brand` est un alias résolu dans vite.config.ts vers le fichier de marque
   choisi à la construction — brand-jf.css par défaut, brand-test.css avec VITE_BRAND=test.
   TypeScript ne peut pas le résoudre seul : on le lui déclare. */
declare module 'virtual:brand';
