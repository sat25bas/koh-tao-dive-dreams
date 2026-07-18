/**
 * Dive Site Reports API Client
 * Shared between web and mobile apps
 */

export type DiverRole = 'Dive Pro' | 'Fun Diver';

export type DiveSiteReport = {
  id: string;
  site: string;
  region: string;
  submittedBy: string;
  role: DiverRole;
  date: string;
  visibilityM: number;
  current: 1 | 2 | 3 | 4 | 5;
  waves: 1 | 2 | 3 | 4 | 5;
  temperatureC: number;
  sightings: string[];
  notes: string;
};

export type SubmitDiveSiteReportPayload = Omit<DiveSiteReport, 'id'>;

const API_BASE = 'https://api.divinginasia.com';

/**
 * Fetch all dive site reports with optional filters
 */
export async function getDiveSiteReports(params?: {
  region?: string;
  site?: string;
  limit?: number;
  offset?: number;
}): Promise<DiveSiteReport[]> {
  try {
    const url = new URL(`${API_BASE}/dive-site-reports`);
    
    if (params?.region) url.searchParams.append('region', params.region);
    if (params?.site) url.searchParams.append('site', params.site);
    if (params?.limit) url.searchParams.append('limit', params.limit.toString());
    if (params?.offset) url.searchParams.append('offset', params.offset.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.reports || [];
  } catch (error) {
    console.error('Failed to fetch dive site reports:', error);
    throw error;
  }
}

/**
 * Submit a new dive site report
 */
export async function submitDiveSiteReport(
  report: SubmitDiveSiteReportPayload
): Promise<DiveSiteReport> {
  try {
    const response = await fetch(`${API_BASE}/dive-site-reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(report),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to submit dive site report:', error);
    throw error;
  }
}

/**
 * Get a single dive site report by ID
 */
export async function getDiveSiteReport(id: string): Promise<DiveSiteReport> {
  try {
    const response = await fetch(`${API_BASE}/dive-site-reports/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch dive site report ${id}:`, error);
    throw error;
  }
}

/**
 * Update a dive site report
 */
export async function updateDiveSiteReport(
  id: string,
  report: Partial<SubmitDiveSiteReportPayload>
): Promise<DiveSiteReport> {
  try {
    const response = await fetch(`${API_BASE}/dive-site-reports/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(report),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to update dive site report ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a dive site report
 */
export async function deleteDiveSiteReport(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/dive-site-reports/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Failed to delete dive site report ${id}:`, error);
    throw error;
  }
}
