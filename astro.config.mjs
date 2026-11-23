// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { inSeason } from './src/data/christmas.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://wcculinary.com',
  // Post-submit pages are noindex — keep them out of the sitemap too, so
  // nothing invites a crawler to hit the pages that count enquiries. The
  // Christmas page joins them once the season is over: it stays at its URL
  // for anyone holding a link, but it goes noindex and should not be
  // submitted for crawling while it is out of date.
  integrations: [
    sitemap({
      filter: (page) => {
        const hidden = ['/contact/thank-you/', '/contact/order-received/'];
        if (!inSeason()) hidden.push('/christmas-turkey-dinners/');
        return !hidden.some((p) => page.includes(p));
      },
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
