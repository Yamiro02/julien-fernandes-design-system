/// <reference types="vite/client" />

/* `virtual:ds-entry` est un alias résolu dans vite.config.ts vers l'un des trois montages
   — le styles.css du paquet par défaut, brand-jf-entry.css ou brand-test-entry.css.
   TypeScript ne peut pas le résoudre seul : on le lui déclare. */
declare module 'virtual:ds-entry';
