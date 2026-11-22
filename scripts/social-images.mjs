// Square 1080x1080 crops for Facebook and Instagram, from a folder of originals.
//
// Run: npm run social -- "originals/November 2026 catering"
// Output: social/<folder-slug>/*.jpg — gitignored, upload them and delete.
//
// ponytail: sharp again (ships with Astro), one size. Square posts fine on
// both feeds; if Instagram portrait is wanted later, change SIZE to [1080, 1350].

import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SIZE = [1080, 1080];

const src = process.argv[2];
if (!src) {
  console.error('Usage: npm run social -- "originals/<folder>"');
  process.exit(1);
}

const slug = path.basename(src).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const dest = path.join('social', slug);
await mkdir(dest, { recursive: true });

const files = (await readdir(src)).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort();
for (const name of files) {
  const out = path.join(dest, `${path.basename(name, path.extname(name))}.jpg`);
  await sharp(path.join(src, name))
    .rotate() // EXIF orientation before the crop
    // `attention` keeps the plate, not the centre of the tray, when the food
    // sits off to one side.
    .resize(SIZE[0], SIZE[1], { fit: 'cover', position: sharp.strategy.attention })
    // ponytail: one fixed lift for stainless-kitchen lighting. Tune these three
    // numbers if a batch comes out flat or over-cooked — no per-photo settings.
    .modulate({ brightness: 1.03, saturation: 1.06 })
    .sharpen()
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(out);
  console.log(out);
}
console.log(`${files.length} images → ${dest}`);
