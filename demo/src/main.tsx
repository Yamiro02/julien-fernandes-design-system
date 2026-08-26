import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
/* Les fondations en JS, la couche Tailwind en CSS (voir styles.css) — le montage
   exact d'une app consommatrice.
   DEUX FICHIERS, jamais `styles.css` : la vitrine monte le SOCLE puis UNE marque, comme
   le ferait un projet client. C'est ce qui permet de substituer brand-test.css sans
   toucher à une seule ligne du socle. Le choix se fait à la construction, dans
   vite.config.ts, qui alias `virtual:brand` sur l'un ou l'autre fichier. */
import '@julienfernandes/ds/core.css';
import 'virtual:brand';
import './styles.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
