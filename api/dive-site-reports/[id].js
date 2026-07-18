import {
  loadReports,
  saveReports,
  parseBody,
  normalizeString,
} from '../dive-site-reports-store.js';

function getCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
//
function normalizeSightings(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return String(value).split(/\s*,\s*/).map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

export default async function handler(req, res) {
  getCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const id = normalizeString(req.query?.id || req.params?.id);
  if (!id) {
    return res.status(400).json({ error: 'Missing report id' });
  }

  const reports = loadReports();
  const index = reports.findIndex((report) => report.id === id);

  if (req.method === 'GET') {
    if (index === -1) {
      return res.status(404).json({ error: 'Dive site report not found' });
    }
    return res.status(200).json(reports[index]);
  }

  if (index === -1) {
    return res.status(404).json({ error: 'Dive site report not found' });
  }

  if (req.method === 'PUT') {
    const payload = parseBody(req);
    const existing = reports[index];

    const updatedReport = {
      ...existing,
      site: normalizeString(payload.site) || existing.site,
      region: normalizeString(payload.region) || existing.region,
      submittedBy: normalizeString(payload.submittedBy) || normalizeString(payload.submitted_by) || normalizeString(payload.name) || existing.submittedBy,
      role: normalizeString(payload.role) || existing.role,
      date: normalizeString(payload.date) || existing.date,
      visibilityM: Number(payload.visibilityM ?? payload.visibility_m ?? existing.visibilityM) || existing.visibilityM,
      current: Number(payload.current ?? existing.current) || existing.current,
      waves: Number(payload.waves ?? existing.waves) || existing.waves,
      temperatureC: Number(payload.temperatureC ?? payload.temperature_c ?? existing.temperatureC) || existing.temperatureC,
      sightings: payload.sightings != null ? normalizeSightings(payload.sightings) : existing.sightings,
      notes: normalizeString(payload.notes) || normalizeString(payload.description) || existing.notes,
    };

    reports[index] = updatedReport;
    saveReports(reports);
    return res.status(200).json(updatedReport);
  }

  if (req.method === 'DELETE') {
    reports.splice(index, 1);
    saveReports(reports);
    return res.status(204).end();
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
