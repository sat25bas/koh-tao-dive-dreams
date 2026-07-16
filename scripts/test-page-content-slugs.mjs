#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const API_BASE = process.env.VITE_API_BASE_URL || process.env.API_BASE || 'https://api.divinginasia.com';
const slugsToTest = [
  'specialties/deep-diver',
  'deep-diver',
  'specialty-deep-diver',
  'courses/specialties/deep-diver',
  'specialties/photography',
  'photography',
  'specialties/underwater-naturalist',
  'underwater-naturalist'
];

async function test() {
  console.log(`Using API base: ${API_BASE}`);

  for (const slug of slugsToTest) {
    try {
      const url = `${API_BASE.replace(/\/+$/, '')}/api/page-content?slug=${encodeURIComponent(slug)}&locale=en`;
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) {
        console.log(`slug=${slug} => HTTP ${res.status}`);
        continue;
      }
      const payload = await res.json();
      const rows = Array.isArray(payload.rows) ? payload.rows : [];
      console.log(`slug=${slug} => rows=${rows.length} source=${payload.source || 'unknown'}`);
    } catch (err) {
      console.error(`slug=${slug} => error:`, err.message || err);
    }
  }
}

void test();
