// Christmas takeout turkey dinners — a seasonal offer, not a service.
//
// Every date, price and pickup detail lives here, and two dates drive the
// whole thing. To run it again next year, change the values below and
// nothing else.
//
// Three stages:
//   up to ORDER_BY      strip up, form option in the list, page selling
//   to SEASON_ENDS      strip and form option gone, page says orders have
//                       closed but still shows the pickup time, because the
//                       people who ordered are the ones still looking
//   after SEASON_ENDS   nothing on the site mentions it. The page itself
//                       stays at its URL, noindex and out of the sitemap, so
//                       a link shared on Facebook in December is not a 404
//                       in March — but nothing on the site leads to it and
//                       search drops it.
//
// Stages two and three are applied by a BUILD. The strip removes itself in
// the browser (see ChristmasStrip.astro) because it is the one piece that
// cannot wait; everything else here is baked into static HTML and changes
// when the site is next deployed. Deploy once after Christmas and the offer
// is gone from the site.

// Confirmed by Jan. ORDER_BY is what the strip counts against; keep the label
// on the same date.
export const ORDER_BY = '2026-12-15';
export const ORDER_BY_LABEL = 'Tuesday 15 December';
export const PICKUP = 'Thursday 24 December, 12pm to 4pm';
export const PICKUP_WHERE = 'White Rock. The address goes out with your confirmation.';
/** The last day the offer exists on the site at all. The day after the last
 *  pickup: until then someone who ordered may still be checking the time. */
export const SEASON_ENDS = '2026-12-25';
export const PRICE = '$49.35';
export const YEAR = 2026;

/** The extra option in the contact form’s Service list while orders are open,
 *  and the page the form sends it to afterwards.
 *
 *  That page is deliberately NOT under /contact/thank-you/. The Google Ads
 *  "Contact Us" conversion imports a GA4 key event defined as a page_view
 *  whose path starts with /contact/thank-you/, so anything landing there is
 *  counted and bid on as a catering lead. A $49 takeout box is not one, and
 *  counting it would have the bidding chase turkey orders with the event
 *  budget. Keep this path outside that prefix. */
export const ORDER_FORM_LABEL = 'Christmas turkey dinners';
export const ORDER_THANK_YOU = '/contact/order-received/';

/** Today, where the kitchen is. toISOString() is UTC and would roll the date
 *  over at 4pm Pacific, so the strip would disappear on the afternoon of the
 *  deadline rather than at the end of it.
 *
 *  Pinned to Vancouver because production is built on Cloudflare's machines,
 *  which run on UTC: unpinned, a deploy after 4pm on the 15th would close
 *  orders a day early. */
const today = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Vancouver' });

/** Still taking orders? Called at build time by the strip, the page and the
 *  contact form, and again in the browser by the strip's inline script — a
 *  page built in November is still being served in January unless something
 *  takes it down on the visitor's own clock. */
export const takingOrders = () => today() <= ORDER_BY;

/** Is the offer still part of the site? False from the day after the last
 *  pickup, which takes the page out of search and out of the sitemap and
 *  leaves nothing on the site pointing at it. */
export const inSeason = () => today() <= SEASON_ENDS;
