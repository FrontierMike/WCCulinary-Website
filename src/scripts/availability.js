// How far ahead Jan is booked, and the sentence fragment that follows from it.
//
// One number. Every availability note on the site — the home hero, the closing
// call to action on each page, the hint under the contact form's date field —
// reads it from here, so when the calendar loosens or tightens this is the only
// line to change. (The prose in FAQ.astro and services.ts says "about two
// months" in words; change those with it.)
export const BOOKED_MONTHS = 2;

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];

/** The first date likely to be free: today plus BOOKED_MONTHS. */
export function firstOpenDate(now = new Date()) {
  return new Date(now.getFullYear(), now.getMonth() + BOOKED_MONTHS, now.getDate());
}

/** "early January", "mid March" — as precise as the claim honestly is. */
export function bookingFrom(now = new Date()) {
  const d = firstOpenDate(now);
  const part = d.getDate() <= 10 ? 'early' : d.getDate() <= 20 ? 'mid' : 'late';
  return `${part} ${MONTHS[d.getMonth()]}`;
}

/** The pages are static, so the month baked in at build time goes stale
 *  between deploys. This rewrites it from the visitor's own clock; without JS
 *  the built text stands, which is at worst a few weeks conservative. */
export function fillBookingFrom() {
  const text = bookingFrom();
  for (const el of document.querySelectorAll('[data-booking-from]')) el.textContent = text;
}
