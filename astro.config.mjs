// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://wcculinary.com',
  // Thank-you pages are noindex — keep them out of the sitemap too, so nothing
  // invites a crawler to hit the pages that count enquiries.
  integrations: [sitemap({ filter: (page) => !page.includes('/contact/thank-you/') })],
  vite: {
    plugins: [tailwindcss()]
  }
});
