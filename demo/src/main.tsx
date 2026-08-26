import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
/* Les fondations en JS, la couche Tailwind en CSS (voir styles.css) — le montage
   exact d'une app consommatrice. */
import '@julienfernandes/ds/styles.css';
import './styles.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
