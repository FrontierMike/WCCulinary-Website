// Phone taps, sent to Google Analytics as a `phone_click` event.
//
// The contact form reports itself — its thank-you page is the enquiry key
// event — but tapping the number opens the dialler and leaves no page view
// behind, and GA4's enhanced measurement ignores tel: links. On a phone, where
// most ad clicks land, the call often is the whole enquiry, so without this
// every caller shows up as a visit that went nowhere.
//
// One listener on the document covers every tel: link on every page, so a new
// Call button needs no wiring of its own. `link_location` records which one was
// tapped; register it as a custom dimension in GA4 to compare them.

export function trackPhoneClicks() {
  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href^="tel:"]');
    // gtag is defined inline in <head>; the guard only matters if that
    // snippet is ever removed.
    if (!link || typeof window.gtag !== 'function') return;
    window.gtag('event', 'phone_click', {
      link_location: locate(link),
      link_url: link.href,
    });
  });
}

function locate(link) {
  if (link.closest('.mobile-actions')) return 'mobile_bar';
  if (link.closest('header')) return 'header';
  if (link.closest('footer')) return 'footer';
  return 'page';
}
