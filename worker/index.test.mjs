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
  assert.equal(r.name, 'Ada');
  assert.equal(r.email, 'ada@example.com');
  assert.equal(r.message, 'hi');
  assert.equal(r.phone, '555');
});

test('carries the optional event fields through, blank when absent', () => {
  const r = validate({
    name: 'Ada', email: 'ada@example.com', message: 'hi',
    'event-date': '2026-09-12', guests: 24, venue: ' Home ', service: 'Weddings',
  });
  assert.equal(r.eventDate, '2026-09-12');
  assert.equal(r.guests, '24');   // number coerced, not dropped
  assert.equal(r.venue, 'Home');
  assert.equal(r.service, 'Weddings');
  assert.equal(r.budget, '');     // absent → empty, never undefined
});
