// worker/index.js
// Cloudflare Worker entry point for the West Coast Culinary Creations site.
// - Serves the static Astro build (the `dist` folder) via the ASSETS binding.
// - Handles POST /api/contact: validates, then emails the lead via Resend.
//
// ponytail: email only. FrontierMFG also logs leads to Notion; add that here
// only if the inbox stops being enough.

const RESEND_API = "https://api.resend.com/emails";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // endsWith, not ===, so the /wcc demo build's /wcc/api/contact hits it too.
    if (url.pathname.endsWith("/api/contact")) {
      if (request.method !== "POST") {
        return json({ ok: false, error: "Method not allowed." }, 405);
      }
      return handleContact(request, env);
    }

    // Everything else: serve the static site (and its own 404 handling).
    return env.ASSETS.fetch(request);
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
          `\nMessage:\n${fields.message}\n`,
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
