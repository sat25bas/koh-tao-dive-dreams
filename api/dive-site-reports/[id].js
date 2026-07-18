import {
  parseBody,
  normalizeString,
  normalizeSightings,//
  getReportById,
  updateReportById,
  deleteReportById,
} from '../dive-site-reports-store.js';

function getCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
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

  if (req.method === 'GET') {
    try {
      const report = await getReportById(id);
      return res.status(200).json(report);
    } catch (error) {
      return res.status(404).json({ error: 'Dive site report not found' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const payload = parseBody(req);
      const updates = {
        site: normalizeString(payload.site) || undefined,
        region: normalizeString(payload.region) || undefined,
        submittedBy: normalizeString(payload.submittedBy) || normalizeString(payload.submitted_by) || normalizeString(payload.name) || undefined,
        role: normalizeString(payload.role) || undefined,
        date: normalizeString(payload.date) || undefined,
        visibilityM: payload.visibilityM != null ? Number(payload.visibilityM) : payload.visibility_m != null ? Number(payload.visibility_m) : undefined,
        current: payload.current != null ? Number(payload.current) : undefined,
        waves: payload.waves != null ? Number(payload.waves) : undefined,
        temperatureC: payload.temperatureC != null ? Number(payload.temperatureC) : payload.temperature_c != null ? Number(payload.temperature_c) : undefined,
        sightings: payload.sightings != null ? normalizeSightings(payload.sightings) : undefined,
        notes: normalizeString(payload.notes) || normalizeString(payload.description) || undefined,
      };

      const filteredUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {});

      const updatedReport = await updateReportById(id, filteredUpdates);
      return res.status(200).json(updatedReport);
    } catch (error) {
      console.error('Failed to update dive site report:', error?.message || error);
      return res.status(404).json({ error: 'Dive site report not found' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await deleteReportById(id);
      return res.status(204).end();
    } catch (error) {
      return res.status(404).json({ error: 'Dive site report not found' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
