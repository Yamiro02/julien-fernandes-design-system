import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

/* La démo consomme le design system depuis ses sources : ce qui est vérifié à
   l'écran est exactement ce qui est publié. */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      /* Les clés les plus spécifiques d'abord : Vite retient la première qui
         préfixe la requête. */
      '@julienfernandes/ds/styles.css': fileURLToPath(new URL('../src/styles/index.css', import.meta.url)),
      '@julienfernandes/ds/theme.css': fileURLToPath(new URL('../src/styles/theme.css', import.meta.url)),
      '@julienfernandes/ds': fileURLToPath(new URL('../src/index.ts', import.meta.url)),
    },
  },
  server: {
    /* 5273 par defaut. PORT permet au harness d'assigner un port libre quand une
       autre instance de la vitrine tourne deja. */
    port: Number(process.env.PORT) || 5273,
    open: false,
    fs: {
      /* Les polices auto-hébergées (Anton, JetBrains Mono) vivent dans le paquet,
         au-dessus de la racine de la démo. */
      allow: [fileURLToPath(new URL('..', import.meta.url))],
    },
  },
});
