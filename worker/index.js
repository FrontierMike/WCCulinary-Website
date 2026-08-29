// worker/index.js
// Cloudflare Worker entry point for the West Coast Culinary Creations site.
// - Serves the static Astro build (the `dist` folder) via the ASSETS binding.
// - Handles POST /api/contact: validates, then emails the lead via Resend.
//
// ponytail: email only. FrontierMFG also logs leads to Notion; add that here
// only if the inbox stops being enough.

const RESEND_API = "https://api.resend.com/emails";

// Pages that were folded into others when the nav was flattened. Nothing had
// been indexed yet — the site was still preview-only — so these are for
// bookmarks and tidiness rather than rescued ranking. The table is the place
// to add the old WordPress paths at the apex cutover.
const REDIRECTS = new Map([
  // Folded into other pages when the navigation was flattened.
  ["/services", "/"],
  ["/menus", "/private-dining#menus"],
  ["/wine-dinners", "/private-dining#wine-dinners"],

  // --- The WordPress site this replaced -------------------------------
  // Every URL in its sitemap that has no equivalent here. /contact and
  // /gallery kept their paths, so they are absent on purpose. Destinations
  // were read off the slugs; the posts themselves are gone.
  ["/news", "/"],
  ["/a-new-day-begins", "/about"],
  ["/chef-jans-first-cooking-adventure-post-jans-on-the-beach-restaurant", "/about"],
  ["/ignite-a-dream-2024", "/about"],
  ["/gluten-free-bagels-part-1", "/gluten-free-catering"],
  ["/tag/glutenfree-takeout-easterdinner", "/gluten-free-catering"],
  ["/taking-orders-now-for-our-christmas-turkey-dinners", "/celebrations"],
  ["/\u{1F384}-christmas-dinner-takeaway-feast", "/celebrations"],
  ["/\u{1F338}-west-coast-culinary-creations-presents-a-stress-free-easter-feast-\u{1F338}", "/celebrations"],
  ["/how-to-keep-your-strawberries-fresh-for-up-to-2-weeks", "/"],
  ["/happy-victoria-day", "/"],
  ["/category/takeout", "/"],
  ["/category/uncategorized", "/"],
  ["/feed", "/"],
  ["/comments/feed", "/"],
]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // One canonical hostname. www is a custom domain on this Worker purely so
    // it has somewhere to bounce from — every page lives at the apex. First,
    // so nothing else answers on the wrong host. Path and query ride along.
    if (url.hostname.startsWith("www.")) {
      url.hostname = url.hostname.slice(4);
      return Response.redirect(url.toString(), 301);
    }

    // endsWith, not ===, so the /wcc demo build's /wcc/api/contact hits it too.
    if (url.pathname.endsWith("/api/contact")) {
      if (request.method !== "POST") {
        return json({ ok: false, error: "Method not allowed." }, 405);
      }
      return handleContact(request, env);
    }

    // Retired paths. Trailing slash trimmed so /menus and /menus/ both land.
    // Two WordPress slugs open with an emoji, so they arrive percent-encoded
    // and clients disagree on the case of the escapes. Decoding first lets the
    // table above hold the readable form and match either way.
    let raw = url.pathname;
    try {
      raw = decodeURIComponent(raw);
    } catch {
      // Malformed escape sequence — match on the path as it arrived.
    }
    const path = raw.replace(/\/+$/, "") || "/";
    const moved = REDIRECTS.get(path);
    if (moved) {
      return Response.redirect(new URL(moved, url).toString(), 301);
    }

    // Everything else: serve the static site (and its own 404 handling).
    const res = await env.ASSETS.fetch(request);

    // The preview host serves the same pages as production. Keep it out of
    // the index so it never competes with wcculinary.com for its own copy.
    if (url.hostname.startsWith("preview.")) {
      const tagged = new Response(res.body, res);
      tagged.headers.set("X-Robots-Tag", "noindex, nofollow");
      return tagged;
    }
    return res;
  },
};

// Exported for worker/index.test.mjs.
export function validate(data) {
  const name = (data.name || "").trim();
  const email = (data.email || "").trim();
  const message = (data.message || "").trim();

  if (!name || !email || !message) {
    return { error: "Please fill in all required fields." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  const opt = (k) => (data[k] || "").toString().trim();
  return {
    name,
    email,
    message,
    phone: opt("phone"),
    eventDate: opt("event-date"),
    guests: opt("guests"),
    venue: opt("venue"),
    service: opt("service"),
    budget: opt("budget"),
    // Gluten-free consulting uses the same endpoint with an operator-shaped
    // form — different questions, same inbox.
    business: opt("business"),
    businessType: opt("business-type"),
    currentHandling: opt("current-handling"),
    timeline: opt("timeline"),
    // Attribution. `heardFrom` is what they told us; `landing` and `referrer`
    // are what the browser saw on the first page of the visit. They disagree
    // more often than you would think, and the disagreement is the useful part.
    heardFrom: opt("heard-from"),
    landing: opt("landing"),
    referrer: opt("referrer"),
  };
}

async function handleContact(request, env) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid request body." }, 400);
  }

  // Honeypot: real users never fill this. If present, fake success and stop.
  if (data["company-website"]) {
    return json({ ok: true });
  }

  const fields = validate(data);
  if (fields.error) {
    return json({ ok: false, error: fields.error }, 400);
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) {
    console.error("Contact form is missing RESEND_API_KEY / CONTACT_TO / CONTACT_FROM.");
    return json({ ok: false, error: "Contact form is not configured yet." }, 500);
  }

  try {
    const res = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM,
        to: [env.CONTACT_TO],
        reply_to: fields.email,
        subject: `New enquiry — ${fields.service || "General"} — ${fields.name}`,
        text:
          `Name: ${fields.name}\n` +
          `Email: ${fields.email}\n` +
          `Phone: ${fields.phone || "Not specified"}\n` +
          `Service: ${fields.service || "Not specified"}\n` +
          `Event date: ${fields.eventDate || "Not specified"}\n` +
          `Guests: ${fields.guests || "Not specified"}\n` +
          `Venue: ${fields.venue || "Not specified"}\n` +
          `Budget: ${fields.budget || "Not specified"}\n` +
          (fields.business
            ? `\nBusiness: ${fields.business}\n` +
              `Business type: ${fields.businessType || "Not specified"}\n` +
              `Handles GF today: ${fields.currentHandling || "Not specified"}\n` +
              `Timeline: ${fields.timeline || "Not specified"}\n`
            : "") +
          `\nMessage:\n${fields.message}\n` +
          `\n— Where this came from —\n` +
          `Heard about me via: ${fields.heardFrom || "Not answered"}\n` +
          `Landed on: ${fields.landing || "Unknown"}\n` +
          `Referred by: ${fields.referrer || "Direct or unknown"}\n`,
      }),
    });
    if (!res.ok) {
      console.error("Resend send failed:", res.status, await res.text());
      return json({ ok: false, error: "Could not send your message. Please try again." }, 502);
    }
  } catch (err) {
    console.error("Resend send error:", err);
    return json({ ok: false, error: "Could not send your message. Please try again." }, 502);
  }

  return json({ ok: true });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
