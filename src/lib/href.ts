/** Build a site-root-relative URL, honouring the configured base path.
 *
 *  The /wcc demo build sets a BASE_URL, so links cannot be written as bare
 *  "/about" — they have to carry the base. This was copy-pasted into seven
 *  files before it lived here; import it rather than redefining it.
 *
 *  Every page URL ends in a slash. Astro builds each page to a directory and
 *  the canonical tags and the sitemap name the slashed form; Cloudflare
 *  answers the slashless one with a 307 to it. Linking to "/contact" made
 *  every internal click, and every crawler following a link, pay that extra
 *  hop through a redirect marked temporary.
 *
 *  Fragments pass through; append a query string after the call:
 *  href('private-dining#menus') → '/private-dining/#menus'
 *  href('contact') + '?service=Weddings' → '/contact/?service=Weddings'
 */
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export const href = (path: string) => {
  const [page, hash] = path.split('#');
  return `${base}/${page}/`.replace(/\/+/g, '/') + (hash ? `#${hash}` : '');
};
