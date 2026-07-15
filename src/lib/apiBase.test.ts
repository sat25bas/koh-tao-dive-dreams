import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveApiBaseUrl } from './apiBase';

test('does not auto-fallback to the API host when no explicit API base is configured', () => {
  const previousWindow = (globalThis as typeof globalThis & { window?: Window }).window;
  (globalThis as typeof globalThis & { window?: Window }).window = {
    location: { hostname: 'www.divinginasia.com' },
  } as Window;

  try {
    assert.equal(resolveApiBaseUrl(), '');
  } finally {
    if (previousWindow === undefined) {
      delete (globalThis as typeof globalThis & { window?: Window }).window;
    } else {
      (globalThis as typeof globalThis & { window?: Window }).window = previousWindow;
    }
  }
});
