// First-touch attribution, captured once per session.
//
// By the time someone reaches the contact form, document.referrer is just the
// previous page on this site — the useful referrer (Google, Instagram, a venue's
// website) is long gone. So we record it on the first page of the visit and
// carry it to the form submission, which travels server-side through the Worker
// where no ad blocker can drop it.
//
// The landing path keeps its query string, so any ?utm_* tags ride along for
// free. Cloudflare Web Analytics strips those, which is half the reason this
// exists.

const KEY = 'wcc-attribution';

export function capture() {
  try {
    if (sessionStorage.getItem(KEY)) return;

    let referrer = '';
    if (document.referrer) {
      // A malformed referrer would otherwise throw and take the page script
      // down with it.
      try {
        const url = new URL(document.referrer);
        if (url.host !== location.host) referrer = document.referrer;
      } catch {
        /* unparseable referrer — treat as none */
      }
    }

    sessionStorage.setItem(
      KEY,
      JSON.stringify({ landing: location.pathname + location.search, referrer }),
    );
  } catch {
    // Storage disabled or full. Attribution is a nice-to-have; the form is not.
  }
}

/** `{ landing, referrer }`, or empty strings if nothing was captured. */
export function attribution() {
  try {
    const stored = JSON.parse(sessionStorage.getItem(KEY) || '{}');
    return { landing: stored.landing || '', referrer: stored.referrer || '' };
  } catch {
    return { landing: '', referrer: '' };
  }
}
