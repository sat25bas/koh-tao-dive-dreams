import {
  parseBody,
  buildReport,
  listReports,
  insertReport,
} from './dive-site-reports-store.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const reports = await listReports(req.query || {});
      return res.status(200).json(reports);
    } catch (error) {
      console.error('Failed to list dive site reports:', error?.message || error);
      return res.status(500).json({ error: 'Unable to list dive site reports' });
    }
  }

  if (req.method === 'POST') {
    try {
      const payload = parseBody(req);
      const report = buildReport(payload);
      const inserted = await insertReport(report);
      return res.status(201).json(inserted);
    } catch (error) {
      console.error('Failed to insert dive site report:', error?.message || error);
      return res.status(500).json({ error: 'Unable to create dive site report' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
