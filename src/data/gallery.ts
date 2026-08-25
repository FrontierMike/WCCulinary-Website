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
  'lamchops': 'Rack of lamb, carved and plated with jus',
  'salmononseafoodrisotto': 'Salmon over seafood risotto',
  'seafood': 'A seafood course, plated',
  'turkeydinner': 'Roast turkey dinner, carved and plated',
  'tuscan-chicken': 'Tuscan chicken, plated with sauce',
  'img-1033-collage': 'A set of dishes from one event',
  'camerazoom-20140603190224595': 'Charcuterie boards being built along the pass',
  'plating-line-romesco': 'Plates finished with green beans and romesco',
};

const GENERIC = [
  'A plated course from a recent event',
  'A dish plated for service',
  'Food prepared for a private event',
  'A course from a recent dinner',
  'Plates ready for service',
  'A dish from Jan’s kitchen',
  'A course served at a private event',
];

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
  src: ImageMetadata;
  alt: string;
}

const photos: Photo[] = Object.entries(files)
  .map(([path, mod]) => ({ name: path.match(/([^/]+)\.jpg$/)![1], src: mod.default }))
  .filter((p) => !EXCLUDE.has(p.name))
  .sort((a, b) => a.name.localeCompare(b.name)) // stable input order before shuffling
  .map((p, i) => ({ src: p.src, alt: NAMED[p.name] ?? GENERIC[i % GENERIC.length] }));

// Fisher-Yates with the seeded PRNG.
const rnd = mulberry32(20260815);
for (let i = photos.length - 1; i > 0; i--) {
  const j = Math.floor(rnd() * (i + 1));
  [photos[i], photos[j]] = [photos[j], photos[i]];
}

export default photos;
