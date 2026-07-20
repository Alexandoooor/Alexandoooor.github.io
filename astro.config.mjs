// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://portfolio.alexandermagnusson.net',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      // Dual themes so code blocks follow the site's light/dark toggle
      // (dark colors are applied via the [data-theme="dark"] rules in syntax.css)
      themes: {
        light: 'github-light',
        dark: 'tokyo-night',
      },
    },
  },
});
