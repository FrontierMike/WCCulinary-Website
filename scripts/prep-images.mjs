// Downsize the client's originals into src/assets/images/ so astro:assets can
// work with them. The originals are ~6000px / up to 13MB and stay out of git
// (see .gitignore); these derivatives are what the repo ships.
//
// Run: npm run images
//
// ponytail: sharp comes with Astro, so no new dependency. Re-running is cheap
// and idempotent — it skips a file whose output already exists.

import { readdir, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'public/Images';
const DEST = 'src/assets/images';
const MAX_EDGE = 1800; // plenty for a full-bleed hero; astro:assets shrinks from here

export function slugify(filename) {
  return path
    .basename(filename, path.extname(filename))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (/\.(jpe?g|png)$/i.test(entry.name)) out.push(full);
  }
  return out;
}

async function main() {
  if (!existsSync(SRC)) {
    console.error(`No ${SRC}/ — nothing to do.`);
    process.exit(0);
  }
  await mkdir(DEST, { recursive: true });

  const files = await walk(SRC);
  const taken = new Map();
  let done = 0;
  let bytesIn = 0;
  let bytesOut = 0;

  for (const file of files) {
    let slug = slugify(file);
    // Two source files can slugify the same; suffix the later ones.
    if (taken.has(slug)) {
      const n = taken.get(slug) + 1;
      taken.set(slug, n);
      slug = `${slug}-${n}`;
    } else {
      taken.set(slug, 1);
    }

    // The logo needs its transparency, so it stays a PNG.
    const isLogo = /logo/i.test(slug);
    const out = path.join(DEST, `${slug}.${isLogo ? 'png' : 'jpg'}`);

    bytesIn += (await stat(file)).size;
    if (existsSync(out)) {
      bytesOut += (await stat(out)).size;
      continue;
    }

    const pipeline = sharp(file)
      .rotate() // honour EXIF orientation before resizing
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true });

    await (isLogo
      ? pipeline.png({ compressionLevel: 9 })
      : pipeline.jpeg({ quality: 82, mozjpeg: true })
    ).toFile(out);

    bytesOut += (await stat(out)).size;
    done++;
    if (done % 25 === 0) console.log(`  ${done} converted…`);
  }

  const mb = (b) => (b / 1024 / 1024).toFixed(1);
  console.log(`${files.length} images → ${DEST} (${done} new)`);
  console.log(`${mb(bytesIn)} MB in → ${mb(bytesOut)} MB out`);
}

main();
