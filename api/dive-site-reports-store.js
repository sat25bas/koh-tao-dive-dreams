import fs from 'fs';
import os from 'os';
import path from 'path';

const STORE_FILENAME = path.join(process.cwd(), 'api', 'dive-site-reports-store.json');
const TMP_STORE_FILENAME = path.join(os.tmpdir(), 'dive-site-reports-store.json');
let memoryReports = null;

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function isWritableDirectory(dir) {
  try {
    fs.accessSync(dir, fs.constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

function getStorePath() {
  if (isWritableDirectory(path.dirname(STORE_FILENAME))) {
    return STORE_FILENAME;
  }
  return TMP_STORE_FILENAME;
}

function getSupabaseConfig() {
  const url = (
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    ''
  ).trim().replace(/\/$/, '');

  const apiKey = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    ''
  ).trim();

  const schema = 'public';
  const table = (process.env.SUPABASE_DIVE_SITE_REPORTS_TABLE || 'dive_site_reports').trim();

  if (!url || !apiKey) {
    return null;
  }

  return { url, apiKey, schema, table };
}

function hasSupabaseConfig() {
  return Boolean(getSupabaseConfig());
}

async function supabaseRequest(path, options = {}) {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error('Supabase configuration is missing');
  }

  const endpoint = `${config.url}/rest/v1/${path}`;
  const response = await fetch(endpoint, {
    method: options.method || 'GET',
    headers: {
      apikey: config.apiKey,
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      'Accept-Profile': config.schema,
      'Content-Profile': config.schema,
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text || null;
  }

  if (!response.ok) {
    const message = (data && (data.message || data.error_description || data.error)) || text || `Supabase request failed (${response.status})`;
    throw new Error(String(message));
  }

  return data;
}

export async function listReports(query = {}) {
  if (hasSupabaseConfig()) {
    const config = getSupabaseConfig();
    const clauses = [];

    if (query.region) {
      clauses.push(`region=eq.${encodeURIComponent(String(query.region).trim())}`);
    }
    if (query.site) {
      const value = String(query.site).trim();
      if (value) {
        clauses.push(`site=ilike.%25${encodeURIComponent(value)}%25`);
      }
    }
    if (query.offset != null && query.offset !== '') {
      clauses.push(`offset=${Number(query.offset) || 0}`);
    }
    if (query.limit != null && query.limit !== '') {
      clauses.push(`limit=${Number(query.limit) || 0}`);
    }

    const order = 'order=date.desc.nullslast';
    const queryString = [order, ...clauses].filter(Boolean).join('&');
    const rows = await supabaseRequest(`${config.table}?select=*&${queryString}`);
    return Array.isArray(rows) ? rows : [];
  }

  return filterReports(loadReports(), query);
}

export async function getReportById(id) {
  if (hasSupabaseConfig()) {
    const config = getSupabaseConfig();
    const safeId = encodeURIComponent(String(id));
    const rows = await supabaseRequest(`${config.table}?select=*&id=eq.${safeId}&limit=1`);
    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error('Dive site report not found');
    }
    return rows[0];
  }

  const reports = loadReports();
  const report = reports.find((item) => item.id === id);
  if (!report) {
    throw new Error('Dive site report not found');
  }
  return report;
}

export async function insertReport(report) {
  if (hasSupabaseConfig()) {
    const config = getSupabaseConfig();
    const rows = await supabaseRequest(`${config.table}?select=*`, {
      method: 'POST',
      headers: {
        Prefer: 'return=representation',
      },
      body: report,
    });
    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error('Failed to insert dive site report');
    }
    return rows[0];
  }

  const reports = loadReports();
  reports.unshift(report);
  saveReports(reports);
  return report;
}

export async function updateReportById(id, updates) {
  if (hasSupabaseConfig()) {
    const config = getSupabaseConfig();
    const safeId = encodeURIComponent(String(id));
    const rows = await supabaseRequest(`${config.table}?select=*&id=eq.${safeId}`, {
      method: 'PATCH',
      headers: {
        Prefer: 'return=representation',
      },
      body: updates,
    });
    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error('Dive site report not found');
    }
    return rows[0];
  }

  const reports = loadReports();
  const index = reports.findIndex((report) => report.id === id);
  if (index === -1) {
    throw new Error('Dive site report not found');
  }
  reports[index] = { ...reports[index], ...updates };
  saveReports(reports);
  return reports[index];
}

export async function deleteReportById(id) {
  if (hasSupabaseConfig()) {
    const config = getSupabaseConfig();
    const safeId = encodeURIComponent(String(id));
    await supabaseRequest(`${config.table}?id=eq.${safeId}`, {
      method: 'DELETE',
      headers: {
        Prefer: 'return=minimal',
      },
    });
    return;
  }

  const reports = loadReports();
  const nextReports = reports.filter((report) => report.id !== id);
  if (nextReports.length === reports.length) {
    throw new Error('Dive site report not found');
  }
  saveReports(nextReports);
}

export function loadReports() {
  const storePath = getStorePath();

  if (memoryReports !== null) {
    return memoryReports;
  }

  if (!fs.existsSync(storePath)) {
    return [];
  }

  try {
    const raw = fs.readFileSync(storePath, 'utf8');
    const parsed = safeJsonParse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load dive site reports store:', err.message || err);
    return [];
  }
}

export function saveReports(reports) {
  const storePath = getStorePath();

  try {
    fs.writeFileSync(storePath, JSON.stringify(reports, null, 2), 'utf8');
    return;
  } catch (err) {
    console.warn('Unable to write dive report store, using in-memory fallback:', err.message || err);
    memoryReports = reports;
  }
}

export function parseBody(req) {
  if (!req || req.body == null) return {};
  if (typeof req.body === 'string') {
    return safeJsonParse(req.body) || {};
  }
  return req.body;
}

export function normalizeString(value) {
  if (value == null) return '';
  return String(value).trim();
}

export function normalizeSightings(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return String(value).split(/\s*,\s*/).map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

export function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function buildReport(payload) {
  const sightings = Array.isArray(payload.sightings)
    ? payload.sightings.map((item) => String(item).trim()).filter(Boolean)
    : typeof payload.sightings === 'string'
      ? String(payload.sightings).split(/\s*,\s*/).filter(Boolean)
      : [];

  return {
    id: normalizeString(payload.id) || createId(),
    site: normalizeString(payload.site),
    region: normalizeString(payload.region),
    submittedBy: normalizeString(payload.submittedBy) || normalizeString(payload.submitted_by) || normalizeString(payload.name),
    role: normalizeString(payload.role) || 'Fun Diver',
    date: normalizeString(payload.date) || new Date().toISOString().slice(0, 10),
    visibilityM: Number(payload.visibilityM ?? payload.visibility_m ?? 0) || 0,
    current: Number(payload.current ?? 0) || 0,
    waves: Number(payload.waves ?? 0) || 0,
    temperatureC: Number(payload.temperatureC ?? payload.temperature_c ?? 0) || 0,
    sightings,
    notes: normalizeString(payload.notes) || normalizeString(payload.description) || '',
  };
}

export function filterReports(reports, query) {
  let result = reports;
  if (query.region) {
    result = result.filter((report) => String(report.region).toLowerCase() === String(query.region).toLowerCase());
  }
  if (query.site) {
    result = result.filter((report) => String(report.site).toLowerCase() === String(query.site).toLowerCase());
  }

  const offset = Number(query.offset ?? 0) || 0;
  const limit = Number(query.limit || 0) || 0;

  if (offset > 0) {
    result = result.slice(offset);
  }
  if (limit > 0) {
    result = result.slice(0, limit);
  }

  return result;
}

export { hasSupabaseConfig };