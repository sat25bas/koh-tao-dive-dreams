import test from 'node:test';
import assert from 'node:assert/strict';
import { getCourseImageFallbackUrl, resolveCourseImageUrl } from './courseImages';

test('resolves bare course image filenames to the public image host', () => {
  assert.equal(
    resolveCourseImageUrl('photo-1682687982423-295485af248a.avif'),
    'https://api.divinginasia.com/images/photo-1682687982423-295485af248a.avif'
  );
});

test('keeps absolute course image URLs unchanged', () => {
  const url = 'https://divinginasia.com/images/openwater.png';
  assert.equal(resolveCourseImageUrl(url), url);
});

test('returns a known-good fallback for commonly broken course image names', () => {
  const fallback = getCourseImageFallbackUrl('photo-1682687982423-295485af248a.avif');
  assert.equal(
    fallback,
    'https://api.divinginasia.com/images/photo-1659518893171-b15e20a8e201.avif'
  );
});
