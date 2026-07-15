const IMAGE_HOST = 'https://api.divinginasia.com/images/';

const BROKEN_IMAGE_FALLBACKS: Record<string, string> = {
  'photo-1682687982423-295485af248a.avif': 'https://api.divinginasia.com/images/photo-1659518893171-b15e20a8e201.avif',
  'photo-1618865181016-a80ad83a06d3.avif': 'https://api.divinginasia.com/images/photo-1659518893171-b15e20a8e201.avif',
  'photo-1647825194145-2d94e259c745.avif': 'https://api.divinginasia.com/images/photo-1682686580849-3e7f67df4015.avif',
  'photo-1613853250147-2f73e55c1561.avif': 'https://api.divinginasia.com/images/photo-1659518893171-b15e20a8e201.avif',
  'openwater.png': 'https://divinginasia.com/images/openwater.png',
};

export const resolveCourseImageUrl = (image?: string | null): string => {
  if (!image) {
    return 'https://api.divinginasia.com/images/photo-1659518893171-b15e20a8e201.avif';
  }

  const trimmed = image.trim();
  if (!trimmed) {
    return 'https://api.divinginasia.com/images/photo-1659518893171-b15e20a8e201.avif';
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const filename = trimmed.split('/').pop() || trimmed;
  return `${IMAGE_HOST}${filename}`;
};

export const getCourseImageFallbackUrl = (image?: string | null): string => {
  const filename = (image || '').trim().split('/').pop() || '';
  return BROKEN_IMAGE_FALLBACKS[filename] || resolveCourseImageUrl(image);
};
