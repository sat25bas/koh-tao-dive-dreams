const WP_CANONICAL_URL = 'https://admin.divinginasia.com';
const PAGE_CONTENT_PATH = '/wp-json/ktd/v1/page-content';
const MAX_SLUG_LENGTH = 200;
const REQUEST_TIMEOUT_MS = 10_000;

const CONTENT_OVERIDES = {
  'fun-diving': {
    predicate: (locale) => locale.startsWith('en'),
    sections: {
      fun_diving_hero_subtitle:
        "Experience the best of Koh Tao's underwater world with our professionally guided fun dive trips. Discover colorful coral reefs, encounter extraordinary marine life, and create unforgettable memories.",
      fun_diving_hero_title: 'Fun Diving Koh Tao',
    },
  },
};

const OPEN_WATER_FALLBACK = {
  en: [
    {
      section_key: 'overview',
      content_value:
        'Open Water Diver course: a comprehensive beginner program that covers theory, confined water skills, and open water dives to certify you as a recreational diver. Learn essential safety, buoyancy, and underwater navigation skills with experienced instructors.',
    },
    {
      section_key: 'images',
      content_value: 'https://divinginasia.com/images/openwater.png',
    },
  ],
  nl: [
    {
      section_key: 'overview',
      content_value:
        'Open Water Diver cursus: een complete beginnerscursus met theorie, zwembadvaardigheden en open water duiken om je te certificeren als recreatieve duiker. Leer essentiële veiligheids- en navigatievaardigheden onder begeleiding van ervaren instructeurs.',
    },
    {
      section_key: 'images',
      content_value: 'https://divinginasia.com/images/openwater.png',
    },
  ],
};

const FALLBACK_PAGE_CONTENT = {
  'open-water': OPEN_WATER_FALLBACK,
  opewater: OPEN_WATER_FALLBACK,
  'sail-rock': {
    en: [
      {
        section_key: 'overview',
        content_value:
          "Koh Tao's premier deep dive site featuring large schools of fish, whalesharks, and giant barracuda. Sail Rock is widely regarded as the Gulf of Thailand's premier scuba diving site. Located 40 minutes offshore, this impressive granite pinnacle rises from the deep blue ocean to within 18 meters of the surface. The site is famous for its 'Chimney' - a distinctive vertical swim-through that creates a natural vortex attracting large pelagic fish.",
      },
      {
        section_key: 'quick_facts_depth',
        content_value: '18-40m',
      },
      {
        section_key: 'quick_facts_difficulty',
        content_value: 'Advanced',
      },
      {
        section_key: 'quick_facts_location',
        content_value: '40 minutes offshore',
      },
      {
        section_key: 'quick_facts_best_time',
        content_value: 'Year-round, best in dry season (December-May)',
      },
      {
        section_key: 'what_you_can_see',
        content_value: 'Whalesharks\nGiant Barracuda\nMalabar Grouper\nSailfish',
      },
      {
        section_key: 'marine_life_highlights',
        content_value:
          'Whalesharks (frequent sightings)\nGiant Barracuda schools\nMalabar Grouper\nSailfish and Eagle Rays\nChevron Barracuda\nLarge Snapper and Fusilier schools\nKing Mackerel\nBrown Marbled Grouper',
      },
      {
        section_key: 'diving_tips',
        content_value:
          'Advanced certification required - this is a deep dive site\nStrong current awareness essential - stay with your guide\nUse a dive computer for accurate depth and time monitoring\nWhalesharks are most active in the morning - early boat departure recommended\nBring a wide-angle lens for photographing large pelagics\nConserve air due to depth and potential current\nPerfect for deep specialty course dives',
      },
      {
        section_key: 'images',
        content_value:
          'https://api.divinginasia.com/images/sailrock.webp\nhttps://api.divinginasia.com/images/marine-life-hero.webp\nhttps://api.divinginasia.com/images/whale.webp\nhttps://api.divinginasia.com/images/photo-1682686580849-3e7f67df4015.avif\nhttps://api.divinginasia.com/images/photo-1659518893171-b15e20a8e201.avif\nhttps://api.divinginasia.com/images/chumphon-pinnacle-top.webp',
      },
    ],
    nl: [
      {
        section_key: 'overview',
        content_value:
          "Dé top-diepduiklocatie van Koh Tao met grote visscholen, walvishaaien en reuzenbarracuda's. Sail Rock wordt algemeen beschouwd als de beste duiksite in de Golf van Thailand. Deze imposante granieten rotspiek ligt op ongeveer 40 minuten varen van Koh Tao en stijgt op vanuit diepblauw water tot circa 18 meter onder het oppervlak.",
      },
      {
        section_key: 'quick_facts_depth',
        content_value: '18-40m',
      },
      {
        section_key: 'quick_facts_difficulty',
        content_value: 'Gevorderd',
      },
      {
        section_key: 'quick_facts_location',
        content_value: '40 minuten uit de kust',
      },
      {
        section_key: 'quick_facts_best_time',
        content_value: 'Hele jaar, beste periode in droogseizoen (december-mei)',
      },
      {
        section_key: 'what_you_can_see',
        content_value: 'Walvishaaien\nReuzenbarracuda\nMalabar tandbaars\nZeilvis',
      },
      {
        section_key: 'marine_life_highlights',
        content_value:
          'Walvishaaien (regelmatige waarnemingen)\nScholen reuzenbarracuda\nMalabar tandbaars\nZeilvis en adelaarsrog\nChevron-barracuda\nGrote scholen snapper en fusilier\nKoningsmakreel\nGemarmerde tandbaars',
      },
      {
        section_key: 'diving_tips',
        content_value:
          'Gevorderde certificering vereist - dit is een diepduiksite\nStromingsbewustzijn is essentieel - blijf bij je gids\nGebruik een duikcomputer voor nauwkeurige diepte- en tijdsbewaking\nWalvishaaien zijn vaak actiever in de ochtend - vroeg vertrek aanbevolen\nNeem een groothoeklens mee voor grote pelagische soorten\nSpaar lucht in verband met diepte en mogelijke stroming\nPerfect voor specialisaties in diepduiken',
      },
      {
        section_key: 'images',
        content_value:
          'https://api.divinginasia.com/images/sailrock.webp\nhttps://api.divinginasia.com/images/marine-life-hero.webp\nhttps://api.divinginasia.com/images/whale.webp\nhttps://api.divinginasia.com/images/photo-1682686580849-3e7f67df4015.avif\nhttps://api.divinginasia.com/images/photo-1659518893171-b15e20a8e201.avif\nhttps://api.divinginasia.com/images/chumphon-pinnacle-top.webp',
      },
    ],
  },
};

function buildSlugVariants(slug) {
  if (typeof slug !== 'string') return [];
  const clean = slug.trim().replace(/^[#/]+/, '');
  if (!clean) return [];
  const normalized = clean.replace(/^\/+/, '');
  return [...new Set([clean, normalized, `/${normalized}`, `/courses/${normalized}`].filter(Boolean))];
}

function normalizeRows(rows) {
  if (!Array.isArray(rows)) return [];
  return rows.map((row) => ({
    section_key: row?.section_key ?? null,
    content_value: row?.content_value ?? null,
    updated_at: row?.updated_at ?? null,
    content_type: row?.content_type ?? null,
  }));
}

function applyContentFixes(rows, slug, locale) {
  if (!Array.isArray(rows) || !rows.length) return rows || [];

  const normalizedSlug = String(slug || '')
    .replace(/^\/+/, '')
    .toLowerCase();
  const normalizedLocale = String(locale || '').toLowerCase();

  const overrideConfig = CONTENT_OVERIDES[normalizedSlug];
  if (!overrideConfig || !overrideConfig.predicate(normalizedLocale)) {
    return rows;
  }

  const sectionOverrides = overrideConfig.sections;
  return rows.map((row) => {
    if (row?.section_key && sectionOverrides[row.section_key]) {
      return { ...row, content_value: sectionOverrides[row.section_key] };
    }
    return row;
  });
}

function dedupeRows(rows) {
  if (!Array.isArray(rows) || rows.length <= 1) return rows || [];
  const seen = new Set();
  return rows.filter((row) => {
    if (!row?.section_key) return true;
    if (seen.has(row.section_key)) return false;
    seen.add(row.section_key);
    return true;
  });
}

function getFallbackRows(slug, locale) {
  if (typeof slug !== 'string' && slug != null) return [];

  const normalizedSlug = String(slug || '')
    .replace(/^\/+/, '')
    .toLowerCase();
  const normalizedLocale = String(locale || '').toLowerCase();
  const slugConfig = FALLBACK_PAGE_CONTENT[normalizedSlug];

  if (!slugConfig) return [];

  const rows = slugConfig[normalizedLocale] || slugConfig.en || [];
  return Array.isArray(rows) ? rows.map((row) => ({ ...row })) : [];
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout ?? REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchFromWordPress(slug, locale) {
  const wpBase = String(process.env.WP_BOOKING_URL || '')
    .trim()
    .replace(/\/$/, '') || WP_CANONICAL_URL;
  if (!wpBase) return [];

  const variants = buildSlugVariants(slug);
  if (!variants.length) return [];

  const combined = [];

  for (const variant of variants) {
    try {
      const params = new URLSearchParams({
        slug: variant,
        locale: String(locale || ''),
        nocache: String(Date.now()),
      });
      const response = await fetchWithTimeout(
        `${wpBase}${PAGE_CONTENT_PATH}?${params.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'cache-control': 'no-cache',
          },
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        continue;
      }

      const data = await response.json().catch(() => []);
      if (Array.isArray(data) && data.length) {
        combined.push(...data);
      }
    } catch {
      continue;
    }
  }

  return dedupeRows(normalizeRows(combined));
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rawSlug = String(req.query?.slug || '').trim().replace(/^#/, '');
  const locale = String(req.query?.locale || 'en').trim() || 'en';

  if (!rawSlug || rawSlug.length > MAX_SLUG_LENGTH) {
    return res.status(400).json({ error: 'Missing or invalid slug query parameter' });
  }

  try {
    const wpRows = await fetchFromWordPress(rawSlug, locale);
    const fallbackRows = getFallbackRows(rawSlug, locale);

    if (!wpRows.length && !fallbackRows.length) {
      return res.status(404).json({
        error: 'No page content found in WordPress',
        rows: [],
        source: 'wordpress',
      });
    }

    const rows = applyContentFixes(wpRows.length ? wpRows : fallbackRows, rawSlug, locale);

    return res.status(200).json({
      rows,
      source: wpRows.length ? 'wordpress' : 'fallback',
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to load page content from WordPress',
      details: error instanceof Error ? error.message : 'unknown error',
    });
  }
}
