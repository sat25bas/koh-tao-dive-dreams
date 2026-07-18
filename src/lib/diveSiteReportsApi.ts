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
const USE_MOCK_DATA = true;

// Mock dive reports for testing
const MOCK_REPORTS: DiveSiteReport[] = [
  {
    id: '1',
    site: 'Sail Rock',
    region: 'Koh Tao',
    submittedBy: 'Sarah Chen',
    role: 'Dive Pro',
    date: '2026-07-18',
    visibilityM: 20,
    current: 3,
    waves: 2,
    temperatureC: 29,
    sightings: ['Reef Shark', 'Grouper', 'Barrel Sponge'],
    notes: 'Excellent conditions today. Saw a large grouper near the pinnacle.'
  },
  {
    id: '2',
    site: 'Chumphon Pinnacle',
    region: 'Koh Tao',
    submittedBy: 'Marco Rossi',
    role: 'Fun Diver',
    date: '2026-07-17',
    visibilityM: 18,
    current: 4,
    waves: 3,
    temperatureC: 28,
    sightings: ['Sea Turtle', 'Angelfish', 'Clownfish'],
    notes: 'Strong current but amazing marine life.'
  },
  {
    id: '3',
    site: 'Shark Island',
    region: 'Koh Tao',
    submittedBy: 'Emily Thompson',
    role: 'Fun Diver',
    date: '2026-07-16',
    visibilityM: 22,
    current: 2,
    waves: 1,
    temperatureC: 30,
    sightings: ['Blacktip Reef Shark', 'Moray Eel', 'Parrotfish'],
    notes: 'Perfect weather. Calm seas and great visibility.'
  },
  {
    id: '4',
    site: 'Manta Point',
    region: 'Nusa Penida',
    submittedBy: 'Alex Kumar',
    role: 'Dive Pro',
    date: '2026-07-18',
    visibilityM: 15,
    current: 5,
    waves: 2,
    temperatureC: 27,
    sightings: ['Manta Ray', 'Trevally', 'Snapper'],
    notes: 'Saw 3 manta rays! Strong current but worth it.'
  },
  {
    id: '5',
    site: 'Blue Cave',
    region: 'Okinawa',
    submittedBy: 'Yuki Tanaka',
    role: 'Fun Diver',
    date: '2026-07-15',
    visibilityM: 16,
    current: 2,
    waves: 1,
    temperatureC: 26,
    sightings: ['Goby', 'Shrimp', 'Soft Coral'],
    notes: 'Beautiful blue light in the cave. Peaceful dive.'
  }
];

/**
 * Fetch all dive site reports with optional filters
 */
export async function getDiveSiteReports(params?: {
  region?: string;
  site?: string;
  limit?: number;
  offset?: number;
}): Promise<DiveSiteReport[]> {
  if (USE_MOCK_DATA) {
    let reports = MOCK_REPORTS;

    if (params?.region) {
      reports = reports.filter((r) => r.region === params.region);
    }
    if (params?.site) {
      reports = reports.filter((r) => r.site === params.site);
    }
    if (params?.limit) {
      reports = reports.slice(0, params.limit);
    }
    if (params?.offset) {
      reports = reports.slice(params.offset);
    }

    return reports;
  }

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
    console.error('Failed to fetch dive site reports, using mock data:', error);
    let reports = MOCK_REPORTS;
    
    if (params?.region) {
      reports = reports.filter(r => r.region === params.region);
    }
    if (params?.site) {
      reports = reports.filter(r => r.site === params.site);
    }
    if (params?.limit) {
      reports = reports.slice(0, params.limit);
    }
    if (params?.offset) {
      reports = reports.slice(params.offset);
    }
    
    return reports;
  }
}

/**
 * Submit a new dive site report
 */
export async function submitDiveSiteReport(
  report: SubmitDiveSiteReportPayload
): Promise<DiveSiteReport> {
  if (USE_MOCK_DATA) {
    const mockResponse: DiveSiteReport = {
      id: String(Date.now()),
      ...report,
    };
    MOCK_REPORTS.unshift(mockResponse);
    return mockResponse;
  }

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
    console.error('Failed to submit dive site report, using mock:', error);
    // Create mock response with the submitted data
    const mockResponse: DiveSiteReport = {
      id: String(Date.now()),
      ...report,
    };
    // Add to mock data so it appears in the list
    MOCK_REPORTS.unshift(mockResponse);
    return mockResponse;
  }
}

/**
 * Get a single dive site report by ID
 */
export async function getDiveSiteReport(id: string): Promise<DiveSiteReport> {
  if (USE_MOCK_DATA) {
    const report = MOCK_REPORTS.find((item) => item.id === id);
    if (report) {
      return report;
    }
    throw new Error(`Mock report not found: ${id}`);
  }

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
  if (USE_MOCK_DATA) {
    const index = MOCK_REPORTS.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`Mock report not found: ${id}`);
    }
    MOCK_REPORTS[index] = {
      ...MOCK_REPORTS[index],
      ...report,
    } as DiveSiteReport;
    return MOCK_REPORTS[index];
  }

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
  if (USE_MOCK_DATA) {
    const index = MOCK_REPORTS.findIndex((item) => item.id === id);
    if (index !== -1) {
      MOCK_REPORTS.splice(index, 1);
    }
    return;
  }

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
