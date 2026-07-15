const IMAGE_HOST = 'https://api.divinginasia.com/images/';
const LOCAL_IMAGE_PATH = '/images/';
const BROKEN_IMAGE_HOST = 'api.divinginasia.com/images/';

const LOCAL_IMAGE_FILENAMES = new Set([
  'openwater.png',
  'photo-1659518893171-b15e20a8e201.avif',
  'photo-1682686580849-3e7f67df4015.avif',
  'sailrock.webp',
  'chumphon-pinnacle-top.webp',
  'mango-bay.webp',
  'marine-life-hero.webp',
  'sharkisand.jpg',
  'whale-shark-snorkelling-fos-sustainable-certification-medium-1.webp',
  'turtle.avif',
  'logo.png',
  'logo.avif',
  'logo-new.png',
  'downline.png',
  'downline.jpg',
  'efr.jpeg',
  'sidemount-diver-underwater.jpg',
]);

const LOCAL_IMAGE_ALIAS: Record<string, string> = {
  'scubadiver-hero.png': '/images/sidemount-diver-underwater.jpg',
};

const BROKEN_IMAGE_FALLBACKS: Record<string, string> = {
  'photo-1682687982423-295485af248a.avif': '/images/photo-1659518893171-b15e20a8e201.avif',
  'photo-1618865181016-a80ad83a06d3.avif': '/images/photo-1659518893171-b15e20a8e201.avif',
  'photo-1647825194145-2d94e259c745.avif': '/images/photo-1682686580849-3e7f67df4015.avif',
  'photo-1613853250147-2f73e55c1561.avif': '/images/photo-1659518893171-b15e20a8e201.avif',
  'openwater.png': '/images/openwater.png',
  'scubadiver-hero.png': '/images/sidemount-diver-underwater.jpg',
};

const getLocalImagePath = (filename: string) => `${LOCAL_IMAGE_PATH}${filename}`;

export const resolveCourseImageUrl = (image?: string | null): string => {
  if (!image) {
    return getLocalImagePath('photo-1659518893171-b15e20a8e201.avif');
  }

  const trimmed = image.trim();
  if (!trimmed) {
    return getLocalImagePath('photo-1659518893171-b15e20a8e201.avif');
  }

  if (trimmed.startsWith('/images/')) {
    return trimmed;
  }

  if (trimmed.startsWith('images/')) {
    return `/${trimmed}`;
  }

  if (/^(https?:)?\/\//i.test(trimmed)) {
    const filename = trimmed.split('/').pop() || trimmed;
    if (LOCAL_IMAGE_ALIAS[filename]) {
      return LOCAL_IMAGE_ALIAS[filename];
    }

    if (trimmed.includes(BROKEN_IMAGE_HOST)) {
      return getLocalImagePath(filename);
    }

    return trimmed;
  }

  const filename = trimmed.split('/').pop() || trimmed;
  if (LOCAL_IMAGE_ALIAS[filename]) {
    return LOCAL_IMAGE_ALIAS[filename];
  }

  if (trimmed.startsWith('/images/')) {
    return trimmed;
  }

  if (trimmed.startsWith('images/')) {
    return `/${trimmed}`;
  }

  if (LOCAL_IMAGE_FILENAMES.has(filename)) {
    return getLocalImagePath(filename);
  }

  return `${IMAGE_HOST}${filename}`;
};

export const getCourseImageFallbackUrl = (image?: string | null): string => {
  const filename = (image || '').trim().split('/').pop() || '';
  if (BROKEN_IMAGE_FALLBACKS[filename]) {
    return BROKEN_IMAGE_FALLBACKS[filename];
  }
  if (LOCAL_IMAGE_FILENAMES.has(filename)) {
    return getLocalImagePath(filename);
  }
  return resolveCourseImageUrl(image);
};
