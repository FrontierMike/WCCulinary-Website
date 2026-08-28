// The Services menu, in one place. The header dropdown and the footer columns
// both read from here, so adding a service no longer means editing the header,
// the footer and the home page and hoping they agree.
import { services, indexOnly } from '../data/services';

const bySlug = Object.fromEntries([...services, ...indexOnly].map((s) => [s.slug, s]));

/** Menu order. A bare string is a service slug — its label and path come from
 *  services.ts. An explicit [label, path] pair is for a format that is a
 *  section of a page rather than a page of its own. */
const ORDER: (string | [string, string])[] = [
  'weddings',
  'private-dining',
  'corporate',
  'celebrations',
  // Wine pairing dinners is two sections of the private-dining page. It keeps a
  // menu entry because people search and ask for it by name.
  ['Wine pairing dinners', 'private-dining#wine-dinners'],
  'gluten-free-catering',
  'gluten-free-consulting',
];

export const serviceLinks: [string, string][] = ORDER.map((entry) => {
  if (Array.isArray(entry)) return entry;
  const service = bySlug[entry];
  if (!service) throw new Error(`nav.ts: ORDER lists "${entry}", which is not a service in services.ts`);
  return [service.title, service.slug];
});

// A service page in no menu is reachable only by search. That is a mistake
// every time, so fail the build instead of shipping the orphan.
const listed = new Set(ORDER.filter((e): e is string => typeof e === 'string'));
const orphans = [...services, ...indexOnly].filter((s) => !listed.has(s.slug));
if (orphans.length) {
  throw new Error(`nav.ts: service page(s) missing from the Services menu: ${orphans.map((s) => s.slug).join(', ')}`);
}

// The footer keeps gluten-free in its own column — two audiences, and the
// events site stays positioned as events. Same list, split for layout.
const isGlutenFree = (path: string) => path.startsWith('gluten-free');
export const eventServiceLinks = serviceLinks.filter(([, path]) => !isGlutenFree(path));
export const glutenFreeLinks = serviceLinks.filter(([, path]) => isGlutenFree(path));

/** Slugs whose pages should light up the "Services" parent in the header. */
export const serviceSlugs = new Set(serviceLinks.map(([, path]) => path.split('#')[0]));
