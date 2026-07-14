import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/page-content.js';

function createMockResponse() {
  return {
    statusCode: 200,
    headers: {},
    setHeader(name, value) {
      this.headers[name] = value;
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
    end(payload) {
      if (payload !== undefined) {
        this.body = payload;
      }
      return this;
    },
  };
}

test('returns fallback Sail Rock content when WordPress is unavailable', async () => {
  const originalFetch = global.fetch;
  global.fetch = async (url) => {
    if (String(url).includes('/wp-json/ktd/v1/page-content')) {
      return new Response(JSON.stringify({ code: 'rest_no_route', message: 'No route was found' }), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      });
    }

    throw new Error(`Unexpected fetch: ${url}`);
  };

  try {
    const req = { method: 'GET', query: { slug: 'sail-rock', locale: 'en' } };
    const res = createMockResponse();

    await handler(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.source, 'fallback');
    const imagesRow = res.body.rows.find((row) => row.section_key === 'images');
    assert.ok(imagesRow);
    assert.match(String(imagesRow.content_value || ''), /\/images\/sailrock\.webp/);
  } finally {
    global.fetch = originalFetch;
  }
});
