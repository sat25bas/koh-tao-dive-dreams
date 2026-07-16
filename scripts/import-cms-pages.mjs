#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const dotenv = await import('dotenv');
dotenv.config({ path: path.join(process.cwd(), '.env') });

const WP_URL = process.env.VITE_WP_API_BASE || process.env.WP_URL || '';
if (!WP_URL) {
  console.error('WP API base not configured. Set VITE_WP_API_BASE in .env or pass WP_URL env var.');
  process.exit(1);
}

const authArg = process.env.WP_AUTH || process.argv[2];
if (!authArg) {
  console.error('Provide credentials via WP_AUTH="username:app-password" env var or as first argument');
  process.exit(1);
}
const basic = Buffer.from(authArg, 'utf8').toString('base64');

const dir = path.join(process.cwd(), 'scripts/output/cms-pages/specialties');
if (!fs.existsSync(dir)) {
  console.error('No generated payloads found at', dir);
  process.exit(1);
}

const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
if (!files.length) {
  console.error('No JSON payloads to import');
  process.exit(1);
}

const payloads = files.map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));

const importUrl = `${WP_URL.replace(/\/+$/, '')}/wp-json/ktd/v1/page-content/import?dryRun=true`;

console.log(`Importing ${payloads.length} payloads to ${importUrl} (dry run)`);

try {
  const res = await fetch(importUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${basic}`,
    },
    body: JSON.stringify(payloads),
  });

  const text = await res.text();
  console.log('Response status:', res.status);
  try { console.log('Response JSON:', JSON.parse(text)); } catch { console.log('Response body:', text); }
} catch (err) {
  console.error('Import failed:', err.message || err);
  process.exit(1);
}

console.log('Dry-run import completed. If output looks good, re-run without ?dryRun=true (edit importUrl in this script).');
