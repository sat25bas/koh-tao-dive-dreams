import test from 'node:test';
import assert from 'node:assert/strict';
import { getCourseImageFallbackUrl, resolveCourseImageUrl } from './courseImages';

test('resolves bare course image filenames to the public image host', () => {
  assert.equal(
    resolveCourseImageUrl('photo-1682687982423-295485af248a.avif'),
    'https://api.divinginasia.com/images/photo-1682687982423-295485af248a.avif'
  );
});

test('resolves known local course image filenames to local public assets', () => {
  assert.equal(resolveCourseImageUrl('openwater.png'), '/images/openwater.png');
});

test('keeps absolute course image URLs unchanged', () => {
  const url = 'https://divinginasia.com/images/openwater.png';
  assert.equal(resolveCourseImageUrl(url), url);
});

test('returns a known-good fallback for commonly broken course image names', () => {
  const fallback = getCourseImageFallbackUrl('photo-1682687982423-295485af248a.avif');
  assert.equal(
    fallback,
    '/images/photo-1659518893171-b15e20a8e201.avif'
  );
});
