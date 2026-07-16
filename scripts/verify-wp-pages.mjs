#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const dotenv = await import('dotenv');
dotenv.config({ path: path.join(process.cwd(), '.env') });

const WP_URL = process.env.VITE_WP_API_BASE || process.env.WP_URL || '';
if (!WP_URL) { console.error('Set VITE_WP_API_BASE in .env or pass WP_URL'); process.exit(1); }

const authArg = process.env.WP_AUTH || process.argv[2];
if (!authArg) { console.error('Provide WP_AUTH="username:app-password" env or arg'); process.exit(1); }
const basic = Buffer.from(authArg, 'utf8').toString('base64');

const dir = path.join(process.cwd(), 'scripts/output/cms-pages/specialties');
if (!fs.existsSync(dir)) { console.error('Payload dir missing:', dir); process.exit(1); }

const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
console.log(`Verifying ${files.length} pages at ${WP_URL}`);

for (const f of files) {
  const p = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  const slug = (p.page || '').split('/').filter(Boolean).pop();
  try {
    const url = `${WP_URL.replace(/\/+$/, '')}/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&context=edit`;
    const res = await fetch(url, { headers: { Authorization: `Basic ${basic}` } });
    const text = await res.text();
    if (!res.ok) {
      console.log(`${slug} => HTTP ${res.status} ${text.replace(/\n/g,' ' )}`);
    } else {
      const arr = JSON.parse(text);
      if (!arr.length) console.log(`${slug} => not found (empty response)`);
      else {
        const page = arr[0];
        console.log(`${slug} => id=${page.id} status=${page.status} link=${page.link}`);
      }
    }
  } catch (err) {
    console.log(`${slug} => error: ${err.message || err}`);
  }
}
