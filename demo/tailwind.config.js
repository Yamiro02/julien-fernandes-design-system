import preset from '../src/tailwind-preset';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    '../src/**/*.{ts,tsx}',
  ],
  corePlugins: {
    /* Le design system embarque son propre reset (tokens/base.css) : h1→h4 en
       Anton CAPS, liens, focus. Le preflight de Tailwind les neutraliserait. */
    preflight: false,
  },
};
