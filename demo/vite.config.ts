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
      /* LE COMMUTATEUR DE MARQUE. VITE_BRAND=test charge la palette hostile de recette
         (demo/brand-test.css) à la place de celle de Julien, SANS qu'une ligne du socle
         change. Si la vitrine rend cohérente dans les deux thèmes et qu'aucune valeur de
         Julien ne transparaît, c'est que le socle n'en porte plus aucune. */
      'virtual:brand': process.env.VITE_BRAND === 'test'
        ? fileURLToPath(new URL('./brand-test.css', import.meta.url))
        : fileURLToPath(new URL('../src/styles/brand-jf.css', import.meta.url)),
      '@julienfernandes/ds/styles.css': fileURLToPath(new URL('../src/styles/index.css', import.meta.url)),
      '@julienfernandes/ds/core.css': fileURLToPath(new URL('../src/styles/core.css', import.meta.url)),
      '@julienfernandes/ds/brand-jf.css': fileURLToPath(new URL('../src/styles/brand-jf.css', import.meta.url)),
      '@julienfernandes/ds/brand-content.css': fileURLToPath(new URL('../src/styles/brand-content.css', import.meta.url)),
      '@julienfernandes/ds/brand-content': fileURLToPath(new URL('../src/brand-content.tsx', import.meta.url)),
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
