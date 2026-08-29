# WCCulinary
West Coast Culinary Creations site

Static [Astro](https://astro.build) build with Tailwind v4, hosted on **Cloudflare Workers** (free tier), with a contact form handled by a Worker route that emails leads via Resend.

Same architecture as the Frontier MFG site (`../FrontierMFG-Website`).

---

## Architecture

```
Visitor
  │
  ▼
Cloudflare Worker (wcculinary-website)
  ├── request matches a static file ──► served from ./dist (no Worker code runs)
  └── POST /api/contact ─────────────► worker/index.js handler
                                         ├── honeypot check
                                         ├── validate fields
                                         └── email via Resend
```

Astro builds to `./dist`. The Worker serves those files through the `ASSETS` binding, so Worker code only runs for unmatched paths (`/api/contact`). No Astro adapter — the site is a pure static build.

## Project structure

```text
/
├── public/                 # static assets, copied to dist as-is
│   └── favicon.svg
├── src/
│   ├── layouts/Base.astro  # <html> shell, <head>, global wiring
│   ├── styles/global.css   # Tailwind entry + theme tokens
│   ├── components/         # SiteHeader, SiteFooter, PageHero, FAQ, CTA, …
│   ├── data/services.ts    # every service page, as content
│   ├── lib/nav.ts          # the Services menu — header and footer read it
│   └── pages/              # file-based routes
├── worker/
│   ├── index.js            # Worker: serves assets + handles /api/contact
│   └── index.test.mjs      # validation tests (node --test)
├── wrangler.jsonc          # Worker config (name, main, assets dir/binding)
├── astro.config.mjs        # Astro config (Tailwind via Vite plugin)
├── .nvmrc                  # pins Node 22 for the build
└── package.json
```

## Commands

| Command            | Action                                      |
| :----------------- | :------------------------------------------ |
| `npm install`      | Install dependencies                        |
| `npm run dev`      | Astro dev server (front end only)           |
| `npm run build`    | Build static site to `./dist/`              |
| `npm test`         | Run Worker validation tests                 |
| `npx wrangler dev` | Run Worker + assets locally                 |

`npm run dev` does **not** run the Worker, so `/api/contact` returns 404 under it. Use `npm run build` then `npx wrangler dev` to exercise the full thing.

### Pinned versions

`astro`, `tailwindcss`, and `@tailwindcss/vite` are pinned to exact versions, and `overrides.vite` forces a single Vite 7. Without the override npm hoists Vite 8 to satisfy `@tailwindcss/vite`'s peer range while Astro nests its own Vite 7 — two copies, and the build fails with `Missing field 'tsconfigPaths'`. Bump these together, deliberately.

---

## Cloudflare setup (one time)

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Import a repository**.
2. Connect `FrontierMike/WCCulinary-Website`, branch `main`.
3. Worker name must be **`wcculinary-website`** — it has to match `name` in `wrangler.jsonc`.
4. Build command: `npm run build` · Deploy command: `npx wrangler deploy`.
5. Add the variables below under Worker → Settings → Variables and Secrets.

### Environment variables

| Variable         | Type   | Purpose                                                     |
|------------------|--------|-------------------------------------------------------------|
| `RESEND_API_KEY` | Secret | Resend API key with Sending access (`re_...`)               |
| `CONTACT_TO`     | Var    | Where form submissions are emailed                          |
| `CONTACT_FROM`   | Var    | Sender, e.g. `WCC Website <noreply@yourdomain.com>` — the domain must be verified in Resend |

Until all three are set, `/api/contact` returns `{ ok: false, error: "Contact form is not configured yet." }` with a 500. The rest of the site is unaffected.

For local Worker testing, put the same values in a `.dev.vars` file (gitignored).

## Conversion tracking

Cloudflare Web Analytics has no custom events and strips query strings, so
conversions are tracked by **path** instead: a successful form submission
redirects to `/contact/thank-you/<service-slug>`, and page views of those paths
are the enquiry count, split by service.

- The slugs come from `enquiryOptions` in `src/data/services.ts`, which also
  fills the form's Service dropdown — one list, so the two cannot drift.
- The pages are `noindex` and excluded from the sitemap. Without that, crawler
  hits would inflate the numbers they exist to measure.
- In the dashboard: filter Path by `/contact/thank-you/` for total enquiries,
  group by Path for the service mix, and compare against `/contact` page views
  for a form completion rate.

The beacon is not in this repo. Web Analytics is set to automatic injection on
the `wcculinary.com` hostname, so Cloudflare adds the script at the edge —
nothing to build, and no `PUBLIC_CF_BEACON_TOKEN`. Adding a second beacon in the
markup would double-count every page view. `www` 301s to the apex before a page
renders, and `preview` is left uncounted on purpose.

Channel attribution does **not** come from analytics. It comes from the enquiry
email, which carries three fields the Worker adds:

| Field | Source |
|---|---|
| `heard-from` | The "How did you hear about me?" answer — catches word of mouth, venue referrals and the restaurant's reputation, which no pixel can see |
| `landing` | First page of the visit, query string intact, so `?utm_*` tags survive |
| `referrer` | External referrer captured on that first page, before internal navigation overwrites it |

`landing` and `referrer` are captured once per session by
`src/scripts/attribution.js` and travel with the form POST, so an ad blocker
cannot drop them. Copy all three into `booking-log.xlsx` (gitignored), whose
**By channel** tab turns them into booked revenue per channel — the number that
should actually decide marketing spend, and the one analytics can never produce
because it never learns which enquiries closed.

## Navigation

The header is four items — **Services · Gallery · Reviews · About** — plus the
phone number and the Enquire button. Every service hangs off the Services
dropdown, so the header names destinations instead of pointing at an index
page, and no service page is more than one click from anywhere on the site.

`src/lib/nav.ts` is the single source of truth. Both the header dropdown and
the footer's Services and Gluten-free columns read `serviceLinks` from it, and
it **fails the build** if a service exists in `src/data/services.ts` but is in
no menu — an unlinked page is reachable only by search, which is a mistake
every time.

Three pages were removed to get here:

| Removed | Why | Where the content went |
|---|---|---|
| `/services` | A wrapper whose only job was to list the other pages, and the home page already lists them all | Nothing to move — the Services dropdown replaces it |
| `/menus` | Derived every menu from `services[].sections`, so it duplicated the service pages verbatim | Already on each service page; anchored at `#menus` |
| `/wine-dinners` | The thinnest service page; the plan doc always allowed it to sit under private dining | Two sections of `/private-dining`, anchored at `#wine-dinners` |

Wine pairing dinners keeps its Service dropdown option and its
`/contact/thank-you/wine-dinners` route — people book it by name, and the
conversion split is worth keeping. That comes from `extraEnquiryOptions` in
`src/data/services.ts`.

`worker/index.js` 301s the three retired paths. Nothing had been indexed when
they were removed (the site was preview-only and `noindex`), so that table is
for bookmarks — and it is the place to add the old WordPress paths at cutover.

The Services dropdown uses no JavaScript: it opens on `:hover` and
`:focus-within`, so clicking the button focuses it and clicking away dismisses
it. Below 1280px the whole nav collapses into the existing `<details>` panel,
where the services are listed inline with no second toggle.

---

## Search (SEO)

The site targets the Lower Mainland: White Rock and South Surrey first, then
Surrey, Langley, Delta, Richmond, Vancouver and outward. It does that from the
eleven pages it already has — there are deliberately no per-city landing pages,
because a dozen near-identical pages with the town name swapped is the doorway
page pattern Google filters out, and it would triple the size of an eleven-page
site to chase it.

### Where the geography lives

Four places, and they have to agree:

| File | What it holds |
| :--- | :--- |
| `src/lib/seo.ts` | `SERVICE_AREA` — the list. Everything below reads from it or mirrors it. |
| `src/components/SiteFooter.astro` | The footer line. Imports `SERVICE_AREA` directly, so it cannot drift. |
| `src/components/FAQ.astro` | The "Where do you cook?" answer. Prose, written by hand — **update it when the list changes.** |
| `src/data/services.ts` | Per-page `seo.title` / `seo.description`. |

Adding a town means editing `SERVICE_AREA` and the FAQ answer. Removing one
means the same. The footer and the `areaServed` markup follow automatically.

### Structured data

`src/lib/seo.ts` builds one `@graph` per page: `LocalBusiness`, `Person`
(Janet, with both certifications and their issuing bodies), `WebSite`, plus a
`BreadcrumbList` and a `Service` on the pages that have one. Nodes reference
each other by `@id` rather than repeating themselves.

**The rule in that file: a claim goes in the markup only once the site states
it in prose.** That is why there are no opening hours, no `priceRange` and no
`aggregateRating` — none of them are published anywhere on the site, and
markup that contradicts the page is a manual-action risk for the whole domain.
When per-head rates land (see TODO), `priceRange` becomes fair game.

Check changes with the [Rich Results Test](https://search.google.com/test/rich-results)
and [Schema Markup Validator](https://validator.schema.org/) against a built page.

### The part that is not in this repo

For a local catering business, the website is the smaller half. In rough order
of what actually produces enquiries:

- [ ] **Google Business Profile.** Set up as a *service-area business* — no
      street address shown, service areas listed instead. Primary category
      `Caterer`; add `Personal chef` and `Wedding caterer` as secondaries. Keep
      the name, phone and White Rock locality identical to what the site
      publishes. This outranks everything below it.
- [ ] **Reviews on Google, not just on the site.** The six real notes in
      `src/data/reviews.ts` are on this site only, where they help conversion
      and do nothing for ranking. Review count and recency are among the
      strongest local ranking factors there are. The Reviews page already has
      the ask and the button — the work is asking every client, every time.
- [ ] **Identical name, phone and locality everywhere** — Business Profile,
      Facebook, Instagram, any directory. Mismatches split the entity.
- [ ] **A handful of good citations, not fifty bad ones.** Apple Business
      Connect (feeds Maps and Siri, usually missed), Bing Places, the wedding
      verticals, the White Rock / South Surrey chamber. The BC Celiac
      Association connection is real — see the restaurant reviews — and that
      kind of link is worth more than any directory.
- [ ] **Vendor links.** Venues, planners and photographers she has actually
      worked with. Reciprocal vendor listings are the natural link profile for
      a caterer and the only link building worth the time.
- [ ] **Search Console.** Submit `https://wcculinary.com/sitemap-index.xml` and
      watch the query report. It is the only way to know whether any of this
      worked.

### What to expect

Local map results weight distance from the searcher heavily. White Rock, South
Surrey and Surrey are genuinely winnable in the map pack; Langley and Delta are
plausible. **Vancouver and the North Shore realistically are not** — a White
Rock business does not appear in a Vancouver map pack whatever the site says.
What the pages above can win there is ordinary organic results for longer
queries, which is worth having but is a different and slower thing.

The strongest keyword on this site is not geographic. Gluten-free and
coeliac-safe catering is low-competition, high-intent, and backed by twelve
years of running the program in a working restaurant — and people with coeliac
disease will drive across the region. It pulls from a far wider radius than
anything else here.

---

## Deployment

Cloudflare Workers Builds is connected to this repo:

- **Push to a non-`main` branch** → preview version with its own URL. Production is untouched.
- **Push/merge to `main`** → production deploy.

---

## TODO

**Domain / DNS** — live on `wcculinary.com`; the Worker, the custom domains and
Web Analytics are all done.
- [ ] Confirm SSL/TLS mode is **Full** or **Full (strict)** (Flexible causes redirect loops)

**Contact form**
- [ ] Verify the sending domain in Resend, add its SPF/DKIM records + DMARC
- [ ] Set `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM` in the Worker
- [ ] Submit a real test message end to end
- [ ] Auto-log leads somewhere structured, the way Frontier MFG writes to Notion.
      Deferred on purpose — `booking-log.xlsx` (gitignored, holds client data) is
      the manual version for now, and the enquiry email already carries the
      `heard-from` / `landing` / `referrer` fields it would need.

**Design + content**

All eleven pages are built to **handoff v2** (`design_handoff_wcculinary_site_v2`,
in the zip at the repo root). What is left is real content, not layout.

The handoff shipped fourteen. `/services`, `/menus` and `/wine-dinners` were
removed afterwards to flatten the navigation — see *Navigation* below.

Every review and menu on the site is real. The home page and service-page
quotes are excerpts of the six in `src/data/reviews.ts` and repeat its
captions verbatim — keep them in step when that file changes.

- [ ] **Prune the gallery to Jan's 128.** v2 says she cut the set to 128; the
      build derives ~150 from `src/assets/images/` minus `EXCLUDE` in
      `src/data/gallery.ts`. The bundle ships no asset list, so which 22 came
      out is unknown — get the list from Jan and add them to `EXCLUDE`.
- [ ] Replace the home closing-block photo (`jan-plating`) — client is choosing one
- [ ] Rewrite the generic gallery alt text (`GENERIC` in `src/data/gallery.ts`)
- [ ] Per-head rates, once they are set. The site states no prices at all now:
      the FAQ answer in `src/components/FAQ.astro` explains how pricing works
      and promises a written quote, and the consulting page lists engagement
      models without rates. Nothing needs deleting first — just add numbers.
- [ ] Swap the Reviews page's "Leave a Google review" button for the
      `g.page/r/…/review` link once the Business Profile finishes verifying.
      It uses a `#lrd=…,3` search URL until then — works, but it leans on
      Google's internal URL format.
- [ ] Credentials block on About: every line needs an awarding body and a year
- [ ] Community organisations named on About
- [ ] Self-host Instrument Sans/Serif instead of the Google Fonts link. It is a
      render-blocking stylesheet on a third-party origin, so it costs a DNS
      lookup and a TLS handshake before any text paints — the one Core Web
      Vitals item left on the site.
