import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

/* La démo consomme le design system depuis ses sources : ce qui est vérifié à
   l'écran est exactement ce qui est publié. */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@julienfernandes/ds/styles.css': fileURLToPath(new URL('../src/styles/index.css', import.meta.url)),
      '@julienfernandes/ds': fileURLToPath(new URL('../src/index.ts', import.meta.url)),
    },
  },
  server: {
    port: 5273,
    open: false,
    fs: {
      /* Les polices auto-hébergées (Anton, JetBrains Mono) vivent dans le paquet,
         au-dessus de la racine de la démo. */
      allow: [fileURLToPath(new URL('..', import.meta.url))],
    },
  },
});
