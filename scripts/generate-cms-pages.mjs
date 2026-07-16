#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const src = path.join(process.cwd(), 'src/pages/Specialties.en.tsx');
const outDir = path.join(process.cwd(), 'scripts/output/cms-pages/specialties');
if (!fs.existsSync(src)) {
  console.error('Source Specialties.en.tsx not found:', src);
  process.exit(1);
}
const raw = fs.readFileSync(src, 'utf8');

const start = raw.indexOf('const SPECIALTIES_EN');
if (start === -1) {
  console.error('Could not find SPECIALTIES_EN in file');
  process.exit(1);
}
const arrStart = raw.indexOf('[', start);
const arrEnd = raw.indexOf('];', arrStart);
if (arrStart === -1 || arrEnd === -1) {
  console.error('Could not locate array bounds');
  process.exit(1);
}
const arrText = raw.slice(arrStart + 1, arrEnd);

// Split objects by '},' that appear at top-level assuming no nested '},' within strings
const objects = arrText.split(/},\s*\n/).map(s => s.trim()).filter(Boolean);

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const extract = (objText, key) => {
  const re = new RegExp(`${key}\s*:\s*'([^']*)'`);
  const m = objText.match(re);
  return m ? m[1] : '';
};
const extractNum = (objText, key) => {
  const re = new RegExp(`${key}\s*:\s*([0-9]+)`);
  const m = objText.match(re);
  return m ? Number(m[1]) : 0;
};

let count = 0;
for (const obj of objects) {
  const slug = extract(obj, 'slug');
  if (!slug) continue;
  const title = extract(obj, 'title') || slug.replace(/-/g, ' ');
  const description = extract(obj, 'description') || '';
  const duration = extract(obj, 'duration') || '1 day';
  const priceTHB = extractNum(obj, 'priceTHB') || 3500;
  const priceUSD = extractNum(obj, 'priceUSD') || 0;
  const priceEUR = extractNum(obj, 'priceEUR') || 0;

  const payload = {
    page: `specialties/${slug}`,
    locale: 'en',
    content: {
      hero_title: title,
      hero_subtitle: description,
      course_overview: description,
      price_thb: String(priceTHB),
      price_usd: String(priceUSD),
      price_eur: String(priceEUR),
      duration,
    }
  };

  const outPath = path.join(outDir, `${slug}.json`);
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf8');
  count += 1;
}
console.log(`Wrote ${count} CMS page payload(s) to ${outDir}`);
