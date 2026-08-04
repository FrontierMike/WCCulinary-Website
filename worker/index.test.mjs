// Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validate } from './index.js';

test('rejects missing required fields', () => {
  assert.ok(validate({}).error);
  assert.ok(validate({ name: 'A', email: 'a@b.co' }).error);       // no message
  assert.ok(validate({ name: '   ', email: 'a@b.co', message: 'x' }).error);
});

test('rejects malformed email', () => {
  assert.ok(validate({ name: 'A', email: 'not-an-email', message: 'x' }).error);
  assert.ok(validate({ name: 'A', email: 'a@b', message: 'x' }).error);
});

test('accepts and trims a good submission', () => {
  const r = validate({ name: ' Ada ', email: ' ada@example.com ', message: ' hi ', phone: ' 555 ' });
  assert.equal(r.error, undefined);
  assert.deepEqual(r, { name: 'Ada', email: 'ada@example.com', message: 'hi', phone: '555' });
});
