// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://wcculinary.com',
  // Thank-you pages are noindex — keep them out of the sitemap too, so nothing
  // invites a crawler to hit the pages that count enquiries.
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/contact/thank-you/'),
      // priority is a hint about relative importance within this site, not a
      // ranking lever — crawlers use it to budget. The home page and the
      // services people search for lead; about, gallery and reviews support
      // them. changefreq is honest: menus and photos move, the rest does not.
      serialize: (item) => {
        const path = new URL(item.url).pathname;
        const support = ['/about/', '/gallery/', '/reviews/', '/404/'];
        item.priority = path === '/' ? 1.0 : support.includes(path) ? 0.6 : 0.8;
        item.changefreq = path === '/gallery/' || path === '/' ? 'monthly' : 'yearly';
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
