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
│   ├── components/
│   │   └── Contact.astro   # contact form + client fetch to /api/contact
│   └── pages/index.astro
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

## Deployment

Cloudflare Workers Builds is connected to this repo:

- **Push to a non-`main` branch** → preview version with its own URL. Production is untouched.
- **Push/merge to `main`** → production deploy.

## TODO — DNS

Not configured yet. Once the domain is chosen:

- Point the domain at Cloudflare, add a route/custom domain for the Worker.
- SSL/TLS mode must be **Full** or **Full (strict)** — Flexible causes redirect loops.
- Verify the sending domain in Resend and add its SPF/DKIM records, plus DMARC.
- Update `CONTACT_FROM` and the `og:url` meta in `src/layouts/Base.astro`.
