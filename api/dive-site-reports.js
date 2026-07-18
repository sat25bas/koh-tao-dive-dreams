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

function loadReports() {
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

function saveReports(reports) {
  const storePath = getStorePath();

  try {
    fs.writeFileSync(storePath, JSON.stringify(reports, null, 2), 'utf8');
    return;
  } catch (err) {
    console.warn('Unable to write dive report store, using in-memory fallback:', err.message || err);
    memoryReports = reports;
  }
}

function parseBody(req) {
  if (!req || req.body == null) return {};
  if (typeof req.body === 'string') {
    return safeJsonParse(req.body) || {};
  }
  return req.body;
}

function normalizeString(value) {
  if (value == null) return '';
  return String(value).trim();
}

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildReport(payload) {
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

function filterReports(reports, query) {
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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const reports = loadReports();
    const filtered = filterReports(reports, req.query || {});
    return res.status(200).json(filtered);
  }

  if (req.method === 'POST') {
    const payload = parseBody(req);
    const report = buildReport(payload);
    const reports = loadReports();
    reports.unshift(report);
    saveReports(reports);
    return res.status(201).json(report);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
