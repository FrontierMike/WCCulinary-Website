/** Build a site-root-relative URL, honouring the configured base path.
 *
 *  The /wcc demo build sets a BASE_URL, so links cannot be written as bare
 *  "/about" — they have to carry the base. This was copy-pasted into seven
 *  files before it lived here; import it rather than redefining it.
 *
 *  Fragments and query strings pass through untouched:
 *  href('private-dining#menus') → '/private-dining#menus'
 */
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export const href = (path: string) => `${base}/${path}`.replace(/\/+/g, '/');
