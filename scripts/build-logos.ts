/**
 * Pre-build step: distill the 2400+ shanghairanking records down to a
 * { schoolName -> logo_url } map so we don't ship rank/score/etc. into the bundle.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = resolve(ROOT, 'scripts/source/universities.json');
const OUT = resolve(ROOT, 'src/data/logos.json');

interface RawRecord {
  rank: string;
  name: string;
  logo_url: string;
}

const raw = JSON.parse(readFileSync(SRC, 'utf8')) as RawRecord[];
const map: Record<string, string> = {};

for (const rec of raw) {
  // names look like "清华大学Tsinghua University/一流大学A类/985/211"
  // grab the leading Chinese block (continuous CJK chars + a few punctuation marks)
  const m = rec.name.match(/^[一-龥（）()·—\-\s]+/);
  const cn = (m ? m[0] : rec.name).trim();
  if (cn && rec.logo_url && !map[cn]) {
    map[cn] = rec.logo_url;
  }
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(map, null, 0));
console.log(`[build-logos] wrote ${Object.keys(map).length} mappings → ${OUT}`);
