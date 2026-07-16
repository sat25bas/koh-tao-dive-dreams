: !/usr/bin/env node
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

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const slugRe = /slug\s*:\s*'([^']+)'/g;
let match;
let count = 0;
while ((match = slugRe.exec(arrText)) !== null) {
  const slug = match[1];
  const idx = match.index;
  // look backwards up to 300 chars to find title
  const back = arrText.slice(Math.max(0, idx - 400), idx + 200);
  const titleMatch = back.match(/title\s*:\s*'([^']+)'/);
  const descMatch = back.match(/description\s*:\s*'([^']+)'/);
  const durationMatch = back.match(/duration\s*:\s*'([^']+)'/);
  const priceTHBMatch = back.match(/priceTHB\s*:\s*([0-9]+)/);
  const priceUSDMatch = back.match(/priceUSD\s*:\s*([0-9]+)/);
  const priceEURMatch = back.match(/priceEUR\s*:\s*([0-9]+)/);

  const title = (titleMatch && titleMatch[1]) || slug.replace(/-/g, ' ');
  const description = (descMatch && descMatch[1]) || '';
  const duration = (durationMatch && durationMatch[1]) || '1 day';
  const priceTHB = (priceTHBMatch && Number(priceTHBMatch[1])) || 3500;
  const priceUSD = (priceUSDMatch && Number(priceUSDMatch[1])) || 0;
  const priceEUR = (priceEURMatch && Number(priceEURMatch[1])) || 0;

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
