// Gallery photo list.
//
// The order is a fixed shuffle: seeded PRNG (mulberry32, seed 20260815) so the
// order looks random but never changes between loads. This runs at build time
// on a static site, so the order is baked into the HTML — no runtime shuffle.

import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/images/*.jpg',
  { eager: true },
);

/** Portraits, the logo and the menu scan — not gallery plates. */
const EXCLUDE = new Set([
  '568101',
  'camerazoom-20140517122456578',
  'img-20180328-173006-952',
  'img-3147',
  'img-e3144',
  'janattherestaurant',
  'janet-blackwhite-1024x1024',
  'janwithbiaaward',
  'screenshot-2026-08-14-201754',
  'screenshot-2026-08-14-204208',  // superseded by plating-line-romesco
  'screenshot-2026-08-14-205449',
  'burrowinowlwinedinner22sept2022',
  'wccc-logo-circle',
  // Stock photo bought in for the Christmas takeout page. Not Jan's work, so
  // it does not belong in a gallery of it.
  'christmas-turkey-dinner',
  // Six Signal copies of the November plates, dropped straight in here on
  // 19 Nov instead of through originals/. Never committed, and the same shots
  // ship as nov-2026-* — excluded so a local build matches production.
  'signal-2026-11-19-17-00-47-490',
  'signal-2026-11-19-17-00-47-490-1',
  'signal-2026-11-19-17-00-47-490-2',
  'signal-2026-11-19-17-00-47-490-7',
  'signal-2026-11-19-17-00-47-490-8',
  'signal-2026-11-19-17-02-09-045',
]);

/** Real descriptions where the source filename told us the dish. Everything
 *  else rotates a generic line — these should be rewritten before launch, the
 *  client can identify the dishes. */
const NAMED: Record<string, string> = {
  'boozycreamsicle': 'A creamsicle cocktail, served cold',
  'catering': 'A catering spread laid out for guests',
  'cheesecake': 'Cheesecake, plated and finished',
  'chicken-parm': 'Chicken parmesan, plated for service',
  'chocolate-pate': 'Chocolate pâté with cream',
  'eggs-benny': 'Eggs benedict plated for a brunch service',
  'lamb-barley-risotto': 'Lamb chops over barley risotto with glazed carrots',
  'lamchops': 'Rack of lamb, carved and plated with jus',
  'salmononseafoodrisotto': 'Salmon over seafood risotto',
  'seafood': 'A seafood course, plated',
  'turkeydinner': 'Roast turkey dinner, carved and plated',
  'tuscan-chicken': 'Tuscan chicken, plated with sauce',
  'img-1033-collage': 'A set of dishes from one event',
  'camerazoom-20140603190224595': 'Charcuterie boards being built on the kitchen counter',
  'plating-line-romesco': 'Plates finished with green beans and romesco',
  '808158309-122311522034219450-342153254283530929-n': 'Rows of seafood salads on greens, each with an orange twist',
  'dsc-6439': 'Janet searing prawns at her station',
  'dsc-6453': 'Prawns lifted onto tasting spoons with tongs',
  'dsc-6455': 'Glazed prawns on tasting spoons, close up',
  'dsc-6467': 'Prawn tasting spoons beside marigolds and nasturtiums',
  'dsc-6470': 'Four prawn tasting spoons on a glass platter',
  'dsc-6476': 'Janet holding out a tasting spoon at her station',
  'dsc-6482': 'Rows of tasting cups, each with a bamboo pick',
  'dsc-6483': 'Tasting cups set out beside the flowers',
  'nov-2026-carrot-ginger-soup': 'Carrot ginger soup, finished with microgreens',
  'nov-2026-short-rib-garlic-mash': 'Beef short rib on garlic mash, with greens and gravy',
  'nov-2026-sicilian-yellowfin-tuna': 'Sicilian yellowfin tuna with tomatoes, olives and capers',
  'nov-2026-achiote-chicken-poblano-close': 'Achiote chicken on a rice-stuffed poblano, close up',
  'nov-2026-achiote-chicken-poblano': 'Achiote chicken on rice-stuffed poblanos, lined up and ready to serve',
  'nov-2026-surf-clam-stir-fry': 'Arctic surf clam stir fry with peppers, snow peas and mushrooms',
  'ignite-a-dream-2026-screen-final-new-2048x1152':
    'Poster for Ignite a Dream 2026, the Surrey Fire Fighters charity evening',
};

/** Hover titles. A photo not listed here shows no title. */
const TITLES: Record<string, string> = {
  'nov-2026-carrot-ginger-soup': 'Carrot ginger soup',
  'nov-2026-short-rib-garlic-mash': 'Beef short rib on garlic mash',
  'nov-2026-sicilian-yellowfin-tuna': 'Sicilian yellowfin tuna',
  'nov-2026-achiote-chicken-poblano-close': 'Achiote chicken on rice-stuffed poblanos',
  'nov-2026-achiote-chicken-poblano': 'Achiote chicken on rice-stuffed poblanos',
  'nov-2026-surf-clam-stir-fry': 'Arctic surf clam stir fry',
  ...Object.fromEntries(
    [
      'ignite-a-dream-2026-screen-final-new-2048x1152',
      'dsc-6439', 'dsc-6453', 'dsc-6455', 'dsc-6467', 'dsc-6470', 'dsc-6476', 'dsc-6482', 'dsc-6483',
    ].map((name) => [name, 'Ignite a Dream Charity Event']),
  ),
};

/** Newest work, hoisted above the shuffle in this order. */
const PINNED = [
  'nov-2026-carrot-ginger-soup',
  'nov-2026-short-rib-garlic-mash',
  'nov-2026-sicilian-yellowfin-tuna',
  'nov-2026-achiote-chicken-poblano-close',
  'nov-2026-achiote-chicken-poblano',
  'nov-2026-surf-clam-stir-fry',
];

const GENERIC = [
  'A plated course from a recent event',
  'A dish plated for service',
  'Food prepared for a private event',
  'A course from a recent dinner',
  'Plates ready for service',
  'A dish from Jan’s kitchen',
  'A course served at a private event',
];

/** Fisher-Yates, in place. Takes its randomness as an argument so the
 *  gallery order can be seeded and the homepage strip cannot. */
function shuffle<T>(xs: T[], rnd: () => number): T[] {
  for (let i = xs.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [xs[i], xs[j]] = [xs[j], xs[i]];
  }
  return xs;
}

const sample = <T,>(xs: T[], n: number): T[] => shuffle([...xs], Math.random).slice(0, n);

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Photo {
  name: string;
  src: ImageMetadata;
  alt: string;
  title?: string;
}

const photos: Photo[] = Object.entries(files)
  .map(([path, mod]) => ({ name: path.match(/([^/]+)\.jpg$/)![1], src: mod.default }))
  .filter((p) => !EXCLUDE.has(p.name))
  .sort((a, b) => a.name.localeCompare(b.name)) // stable input order before shuffling
  .map((p, i) => ({
    name: p.name,
    src: p.src,
    alt: NAMED[p.name] ?? GENERIC[i % GENERIC.length],
    title: TITLES[p.name],
  }));

shuffle(photos, mulberry32(20260815));

// Pinned photos to the front, in PINNED order. sort() is stable, so everything
// else keeps the shuffled order above.
const rank = (name: string) => {
  const i = PINNED.indexOf(name);
  return i === -1 ? PINNED.length : i;
};
photos.sort((a, b) => rank(a.name) - rank(b.name));

/** How many of the homepage strip come from the latest batch. Three of ten
 *  keeps “Recent plates” honest without the strip turning into one event. */
const NEW_PER_STRIP = 3;

/** A mostly-random set for the homepage strip, weighted to the newest work:
 *  NEW_PER_STRIP of them are drawn from PINNED, the latest batch, so a recent
 *  plate is always in shot. `exclude` drops photos used elsewhere on the page.
 *
 *  The randomness runs at BUILD time — a static site bakes one set into the
 *  HTML — so the strip changes with every deploy, not with every visit.
 */
export function recentPlates(count: number, exclude: ImageMetadata[] = []): Photo[] {
  const used = new Set(exclude.map((e) => e.src));
  const pool = photos.filter((p) => !used.has(p.src.src));
  const newest = pool.filter((p) => PINNED.includes(p.name));
  if (newest.length === 0) {
    throw new Error('recentPlates: no photo matches PINNED — the names have drifted');
  }
  const older = pool.filter((p) => !PINNED.includes(p.name));
  return shuffle(
    [...sample(newest, NEW_PER_STRIP), ...sample(older, count - NEW_PER_STRIP)],
    Math.random,
  );
}

export default photos;
