import test from 'node:test';
import assert from 'node:assert/strict';
import { depositFromTotal, totalPayableNowFromTotal } from './depositRate';

test('total payable now uses the 10% deposit amount only', () => {
  assert.equal(depositFromTotal(11500), 1150);
  assert.equal(totalPayableNowFromTotal(11500), 1150);
  assert.equal(totalPayableNowFromTotal(0), 0);
});
