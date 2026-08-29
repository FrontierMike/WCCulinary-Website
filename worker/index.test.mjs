// Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker, { validate } from './index.js';

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

test('carries attribution through, blank when absent', () => {
  const r = validate({
    name: 'Ada', email: 'ada@example.com', message: 'hi',
    'heard-from': 'Instagram',
    landing: '/weddings?utm_source=ig',
    referrer: 'https://www.instagram.com/',
  });
  assert.equal(r.heardFrom, 'Instagram');
  assert.equal(r.landing, '/weddings?utm_source=ig');  // query string kept
  assert.equal(r.referrer, 'https://www.instagram.com/');

  const bare = validate({ name: 'Ada', email: 'ada@example.com', message: 'hi' });
  assert.equal(bare.heardFrom, '');
  assert.equal(bare.landing, '');
  assert.equal(bare.referrer, '');
});

// --- Retired paths -----------------------------------------------------
// /services, /menus and /wine-dinners were folded into other pages when the
// navigation was flattened. A stub ASSETS binding stands in for the static
// site, so a passthrough is visible as the sentinel body.
const stubEnv = { ASSETS: { fetch: () => new Response('ASSETS', { status: 200 }) } };
const get = (path) => worker.fetch(new Request(`https://wcculinary.com${path}`), stubEnv);

test('301s the retired paths to where their content went', async () => {
  for (const [from, to] of [
    ['/services', 'https://wcculinary.com/'],
    ['/menus', 'https://wcculinary.com/private-dining#menus'],
    ['/wine-dinners', 'https://wcculinary.com/private-dining#wine-dinners'],
    // Trailing slash is the form Astro's own links take, so it must match too.
    ['/menus/', 'https://wcculinary.com/private-dining#menus'],
  ]) {
    const res = await get(from);
    assert.equal(res.status, 301, `${from} should redirect`);
    assert.equal(res.headers.get('location'), to);
  }
});

test('301s the old WordPress URLs into the new site', async () => {
  for (const [from, to] of [
    ['/news', 'https://wcculinary.com/'],
    ['/gluten-free-bagels-part-1', 'https://wcculinary.com/gluten-free-catering'],
    ['/category/takeout/', 'https://wcculinary.com/'],
    // Emoji slug, percent-encoded the way a browser sends it. Lower and upper
    // case escapes both have to land — clients differ.
    ['/%f0%9f%8e%84-christmas-dinner-takeaway-feast/', 'https://wcculinary.com/celebrations'],
    ['/%F0%9F%8E%84-christmas-dinner-takeaway-feast', 'https://wcculinary.com/celebrations'],
  ]) {
    const res = await get(from);
    assert.equal(res.status, 301, `${from} should redirect`);
    assert.equal(res.headers.get('location'), to);
  }
});

test('301s www to the apex, keeping the path and query', async () => {
  for (const [from, to] of [
    ['https://www.wcculinary.com/', 'https://wcculinary.com/'],
    ['https://www.wcculinary.com/weddings', 'https://wcculinary.com/weddings'],
    ['https://www.wcculinary.com/weddings?utm_source=ig',
     'https://wcculinary.com/weddings?utm_source=ig'],
    // Old WordPress path on www: one hop to the apex, then the table sends it
    // on. Two redirects, but each is a 301 and the chain is short.
    ['https://www.wcculinary.com/news', 'https://wcculinary.com/news'],
  ]) {
    const res = await worker.fetch(new Request(from), stubEnv);
    assert.equal(res.status, 301, `${from} should redirect`);
    assert.equal(res.headers.get('location'), to);
  }
});

test('leaves the apex host alone', async () => {
  const res = await get('/weddings');
  assert.equal(res.status, 200);
  assert.equal(await res.text(), 'ASSETS');
});

test('leaves live pages alone', async () => {
  for (const path of ['/', '/private-dining', '/weddings', '/menus-of-the-day', '/contact', '/gallery']) {
    const res = await get(path);
    assert.equal(res.status, 200, `${path} should be served, not redirected`);
    assert.equal(await res.text(), 'ASSETS');
  }
});
