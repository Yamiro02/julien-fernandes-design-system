import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
/* Les fondations en JS, la couche Tailwind en CSS (voir styles.css) — le montage
   exact d'une app consommatrice.
   `virtual:ds-entry` est résolu à la construction par vite.config.ts, sur l'un des trois
   montages : le `styles.css` du paquet (défaut, donc la palette de placeholder — et c'est
   la ligne que `npm run rebrand` repointe), l'instance de référence, ou la palette de
   recette. Aucune ligne du socle ne change entre les trois. */
import 'virtual:ds-entry';
import './styles.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
