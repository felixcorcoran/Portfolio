import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

export default defineConfig({
  // Subdominio técnico de la marca (la web de servicios es felixcorcoran.es)
  site: 'https://dev.felixcorcoran.es',
  vite: {
    plugins: [tailwindcss()]
  },
  output: 'server',
  adapter: vercel(),
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false
    }
  }
});