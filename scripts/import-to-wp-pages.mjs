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

const apiBase = WP_URL.replace(/\/+$/, '') + '/wp-json';

async function getParent() {
  const url = `${apiBase}/wp/v2/pages?slug=specialties`;
  const res = await fetch(url, { headers: { Authorization: `Basic ${basic}` } });
  if (!res.ok) throw new Error(`GET parent failed ${res.status}`);
  const arr = await res.json();
  if (arr.length) return arr[0];
  // create parent
  const createRes = await fetch(`${apiBase}/wp/v2/pages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Basic ${basic}` },
    body: JSON.stringify({ title: 'Specialties', status: 'draft', slug: 'specialties' }),
  });
  if (!createRes.ok) {
    const t = await createRes.text();
    throw new Error(`Create parent failed ${createRes.status}: ${t}`);
  }
  return createRes.json();
}

function buildContent(payload) {
  const c = payload.content || {};
  const parts = [];
  if (c.hero_subtitle) parts.push(`<p>${escapeHtml(c.hero_subtitle)}</p>`);
  if (c.course_overview) parts.push(`<h2>Overview</h2><div>${c.course_overview}</div>`);
  const prices = [];
  if (c.price_thb) prices.push(`THB ${escapeHtml(String(c.price_thb))}`);
  if (c.price_usd) prices.push(`USD ${escapeHtml(String(c.price_usd))}`);
  if (c.price_eur) prices.push(`EUR ${escapeHtml(String(c.price_eur))}`);
  if (prices.length) parts.push(`<p><strong>Price:</strong> ${prices.join(' / ')}</p>`);
  if (c.duration) parts.push(`<p><strong>Duration:</strong> ${escapeHtml(String(c.duration))}</p>`);
  return parts.join('\n');
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function createPages() {
  const parent = await getParent();
  const parentId = parent.id;
  console.log('Using parent page id:', parentId);

  const results = [];
  for (const p of payloads) {
    const pagePath = p.page || '';
    const slugSeg = pagePath.split('/').filter(Boolean).pop() || pagePath;
    const title = p.content?.hero_title || p.content?.title || slugSeg;
    const content = buildContent(p);
    const body = { title, content, slug: slugSeg, parent: parentId, status: 'draft' };

    const res = await fetch(`${apiBase}/wp/v2/pages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Basic ${basic}` },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    if (!res.ok) {
      console.error('Failed', slugSeg, res.status, text);
      results.push({ slug: slugSeg, ok: false, status: res.status, body: text });
    } else {
      try { const json = JSON.parse(text); results.push({ slug: slugSeg, ok: true, id: json.id, link: json.link });
      } catch { results.push({ slug: slugSeg, ok: true, raw: text }); }
    }
  }
  return results;
}

(async function main(){
  console.log(`Creating ${payloads.length} WP pages (draft) under /specialties on ${WP_URL}`);
  try {
    const out = await createPages();
    const ok = out.filter(r=>r.ok).length;
    console.log(`Created: ${ok}, failed: ${out.length - ok}`);
    console.log(JSON.stringify(out, null, 2));
  } catch (err) {
    console.error('Import failed:', err.message || err);
    process.exit(1);
  }
})();
