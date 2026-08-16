# Catering Website — Plan & Design Brief

**Business:** West Coast Culinary Creations (`wcculinary.com`)
**Principal:** Chef Janet Wait ("Chef Jan"), Certified Red Seal Chef
**Service area:** South Surrey & White Rock, BC
**Current site:** WordPress, four pages (Home / News / Contact / Gallery). Being replaced.

**Status:** Planning. Not yet built.
**Purpose of this document:** hand off to a designer/build tool with positioning, sitemap, and per-page content requirements already settled.

---

## 1. Situation

- Owner-operated catering business. Ran Jan's on the Beach, an award-winning restaurant in White Rock, for twelve years before this.
- Currently ~100% of bookings come from repeat customers and word of mouth. **Zero from marketing.** There is no acquisition channel.
- Strong reputation in the gluten-free/celiac community — customers used to travel long distances for Jan's on the Beach's GF items. Not everything she makes is gluten-free, and most current clients don't care about it.
- Small-scale operator. Not competing for 300-person banquets.
- **Certified Red Seal Chef.** This is a formal, verifiable credential and almost no competing caterer has one. Use it.
- **Gluten-free consulting** is a second revenue line with a completely different buyer — restaurants, commercial kitchens, and food operators rather than event hosts. Scoped in section 4. It is the only part of the business not limited by geography.
- **Certifications and awards** exist from the Jan's on the Beach years and were never put on the current site. These are unused assets — see About in section 4.

**Existing assets to carry over:** circular WCCC logo, mailing list (already collecting), Facebook page, twelve gallery photos from 2024.

**Search keywords should target both "White Rock" and "South Surrey"** — they are used interchangeably locally and neither alone covers the market.

**What the website is for:** acquiring strangers. Existing clients already know her and don't need convincing.

---

## 2. Positioning

**The brand is: a restaurateur who cooks at your event — not a catering company.**

Standard catering is banquet food optimised for volume, and buyers quietly expect it to be mediocre. Twelve years running a real restaurant is the counter-argument, and it's provable through the wine dinners and private chef work.

Direction for the headline (not final copy):
> Twelve years running Jan's on the Beach. Now cooking at your table.

(The existing tagline *Chef designed, chef made!* already carries this idea and should be kept — see section 8.)

**Gluten-free is a capability and an acquisition channel — not the brand.**

This distinction drives the site architecture. Someone searching "gluten free caterer White Rock" lands on the dedicated GF page directly from Google; they never see the homepage. So that page can rank and convert without gluten appearing anywhere in the main brand. There is no trade-off to make.

- Homepage, nav, service pages: no GF emphasis.
- One deep GF page, footer-linked: full depth, targets the search vertical.
- Every service page FAQ: one line only — dietary restrictions are handled within the main menu, not as a separate plate. This reassures general-market hosts who have one guest with a restriction. It is not a GF pitch.

**Do not let GF language migrate into the hero, nav, or a badge.** This is a deliberate constraint, not an oversight.

---

## 3. Sitemap

```
EVENTS (main site)
Home
├── Weddings
├── Corporate
├── Celebrations
├── Private Dining
├── Wine Dinners
├── Menus
├── Gallery
├── About
└── Contact

GLUTEN-FREE CLUSTER (footer-linked, cross-linked to each other)
├── Gluten-Free Catering        → consumer, local, event hosts
└── Gluten-Free Consulting      → B2B, not geographically limited
```

**Header nav:** Home · Weddings · Corporate · Celebrations · Private Dining · Menus · Gallery · About · Contact

Wine Dinners can sit under Private Dining until there are public dates to promote, then surface in the header as "Upcoming Dinners."

**On the gluten-free cluster:** two pages, two audiences, mutually reinforcing in search. Neither belongs in the main nav — the events site stays positioned as in section 2. Both are reached from the footer, from Menus, and from each other. A restaurant owner researching a GF program and a bride with celiac arrive on different pages from different queries and never see the other one.

---

## 4. Page specifications

### Home
**Job:** establish that this is chef-led, not catering-company food, in under five seconds.

- Hero: the restaurant story as thesis. Food photography, not a stock banquet hall.
- Five service tiles linking to the service pages.
- Two or three testimonials, attributed to event type.
- Short "how it works" — inquiry → menu design → tasting → event.
- **Upcoming Dinners module** — see below.
- Not a menu dump. Not a services checklist.

**Upcoming Dinners module (self-hiding).** A short list of public ticketed dinners with dates and a ticket link, placed below the service tiles.

Build rule: filter the list to future dates only, and **render nothing at all when the result is empty** — no heading, no container, no "no events scheduled" message. The section is simply absent from the page.

Why it's specified this way: the standard failure for a small-business events section is that it rots. A visitor who lands eighteen months later and sees a dinner from the previous year reads the business as inactive — and this site has already demonstrated that pattern (2024 gallery, 2024 homepage announcement). Self-hiding fails invisibly instead of visibly, and requires no maintenance discipline to stay correct.

Trivial to implement in any CMS; it's a build note, not a design decision. But it must be specified up front, because the default behaviour of most event widgets is to show an empty state.

---

### Weddings
`/weddings` — targets "wedding catering White Rock", "small wedding catering White Rock"
**Job:** convert the highest-value, highest-emotion booking.

Required sections:
- Intimate-scale framing (roughly under 80 guests). This is a positive, not a limitation — state why smaller events get better food.
- Process: inquiry → menu consultation → tasting → event day
- What's included vs. what isn't (staffing, rentals, delivery, gratuity, tastings)
- Sample wedding menus
- Venues worked with
- Price anchor: starting per-person or event minimum
- Testimonial from a wedding client
- FAQ, including the one-line dietary note

**Photography:** heaviest requirement on the site. Real events, plated food, table settings.

---

### Corporate
`/corporate` — targets "corporate catering White Rock", "office lunch catering White Rock"
**Job:** win a repeat account. This buyer is an office administrator who wants certainty, not romance.

Required sections:
- Delivery windows and lead times
- Per-head pricing tiers, stated plainly
- Invoicing, purchase orders, repeat-account setup
- Sample lunch and dinner menus
- Dietary accommodation (this buyer genuinely cares — they're ordering for a room they don't control)
- FAQ

**Tone:** dry and logistical. Least emotional page on the site. Resist making it match the wedding page's voice.

---

### Celebrations
`/celebrations` — targets "50th birthday catering White Rock", "anniversary party catering White Rock"
**Job:** capture milestone events.

Merges milestone birthdays, anniversaries, and general private parties. Same buyer, same format, same menu structure — separate pages would be near-duplicates and would compete with each other in search.

Required sections:
- Guest-count bands with what changes at each
- At-home vs. venue
- Staffing options (drop-off through full service)
- Sample menus
- Price anchor
- FAQ

---

### Private Dining
`/private-dining` — targets "private chef White Rock", "private chef dinner party White Rock"
**Job:** sell the easiest first purchase. Highest margin, lowest overhead, smallest commitment.

Required sections:
- She cooks in your kitchen — describe the actual experience
- Typical counts (6–20)
- Fixed-course format and how menus get built
- Pricing structure
- FAQ

This is the natural conversion for someone who attended a wine dinner and isn't ready to book a wedding.

---

### Wine Dinners
`/wine-dinners` — targets "wine pairing dinner White Rock"
**Job:** dual — sell private wine dinners, and fill seats at ticketed public ones.

- **Primary CTA is email signup**, not the booking form. Everything else on the site converts to an inquiry; this page converts to a list.
- Upcoming public dinners with dates and tickets — same self-hiding rule as the homepage module. When there's nothing scheduled, the page falls back to private wine dinner booking and past menus rather than showing an empty calendar.
- Past dinner menus as proof of menu-design capability. These carry the page during quiet stretches, so they're not optional filler.
- Private wine dinner booking as secondary path

**Why this page matters more than its revenue suggests:** ticketed public dinners are paid marketing that generates revenue instead of costing it. Every attendee is a warm lead, an email address, and a photo. This is the credential that supports the whole "not a caterer" positioning.

---

### Menus
`/menus`
- Sample menus organised by service page, with real dish names
- Full menu PDF optionally gated behind an email capture; samples stay open regardless
- Links out to each service page and to the GF page

---

### Gallery
`/gallery`
- **Event write-ups, not a photo grid.** Each entry: guest count, venue, occasion, what was served.
- Feeds imagery to the Weddings and Celebrations pages
- Filterable by event type if the build supports it

---

### About
`/about`
**Job:** carry the entire positioning. This page is doing more work than its position in the nav suggests, and it is the proof source that every service page borrows from.

Two distinct halves — keep them visually separate.

**Half one — the story.** First person, in Chef Jan's own voice. The years at Jan's on the Beach, why she moved to catering and private dining, how she works now. Chef photography, not a logo. Link prominently from the homepage hero.

**Half two — credentials.** A structured block, not prose. There is a set of certifications and awards from the restaurant years that were never put on the old site; this is unused proof sitting idle.

| Include | Format |
|---|---|
| Red Seal certification | Name it plainly, with the trade designation |
| Culinary training and qualifications | Institution and year |
| Food safety certifications (FOODSAFE etc.) | Current ones only — expired certs are worse than none |
| Awards for Jan's on the Beach | **Awarding body + year + category, every time.** An unattributed "award-winning" claim reads as filler; "Best Restaurant, [awarding body], 2019" is verifiable and does real work |
| Gluten-free specific training or recognition | Feeds the consulting page's credibility directly |
| Press and reviews | Publication and date; link out where the original is still live |

**Rules for this block:**
- Verifiable claims only. Anything that can't be attributed to a body and a year comes out.
- Don't list everything. A wall of minor awards dilutes the significant ones — pick the strongest five to eight. The rest can live in a collapsed "additional recognition" list if she wants them recorded.
- Order by weight, not chronology.
- Mark up with structured data (`award` property on `Person`) so the credentials are machine-readable.

**This block serves three pages.** Pull the Red Seal and gluten-free credentials onto `/gluten-free-consulting` (operator proof), the restaurant awards onto `/weddings` (reassurance at the highest-value decision), and one line into the homepage. Write it once here, reference it everywhere.

**Half three — community involvement.** Short. One paragraph plus a plain list of the organisations and causes she cooks for.

This is character evidence, not a booking driver — nobody hires a caterer because she supports a charity, but it makes a host who is already considering her feel better about the choice. Treat it accordingly: it earns a block on About, not a page and not a nav item.

Rules:
- **Static text. No dates, no "upcoming."** A dated list becomes stale the moment an event passes, and a stale list is worse than no list. Name organisations and the nature of the involvement, not individual event dates.
- Name the organisations rather than saying "various local charities." Specific is credible; generic reads as padding.
- Don't link out to the organisations' event or ticketing pages. That sends a warm visitor to someone else's site mid-consideration.
- Photography from these events is usually her best-looking work. Route it to Gallery; only one image belongs here.

**Where the actual return on charity work happens — offline, not on this page.** Listed here so it doesn't get lost, though it isn't a website task:
- Attribution at the event itself: signage, program mention, name on menu cards. If guests eat her food and never learn whose it was, the donation produced nothing.
- Follow-up with organisers afterward. They sit on boards, run committees, and personally host the kind of events she caters. Highest-value contacts in the room.
- Permission to photograph and use the images.

---

### Contact
`/contact`
Form fields: name, email, phone, event date, guest count, venue or location, service type, budget range, message.

Budget range and guest count are the important ones — they filter out inquiries that waste her time.

---

### Gluten-Free Catering
`/gluten-free-catering` — targets "gluten free caterer White Rock", "celiac safe catering White Rock"
**Footer-linked. Also linked from Menus. Not in the main nav.**

This is the deepest page on the site. Depth is what makes it rank, and no competitor in the market has written it properly.

Required sections:
- Kitchen protocols in specifics: dedicated prep surfaces, sourcing, staff process, separate equipment
- Sample fully-GF menus
- Jan's on the Beach's history with the community
- FAQ answering what celiac clients actually ask (cross-contamination, staff training, whether mixed menus are safe, what happens on-site)
- Standard inquiry form

**Compliance warning:** do not use "certified gluten-free" unless a third-party certification (GFCO or equivalent) is actually held. Describe protocols instead. If safety claims are made to celiac clients, the protocols must genuinely exist — this community verifies, and the reputational damage from a failure is permanent.

Cross-link to Gluten-Free Consulting for the operator audience.

---

### Gluten-Free Consulting
`/gluten-free-consulting` — targets "gluten free menu consultant", "gluten free restaurant consulting", "celiac safe kitchen training", "gluten free menu development"
**Footer-linked. Cross-linked from Gluten-Free Catering. Not in the main nav.**

**Job:** sell a B2B service to restaurants and food operators.

This is the one line of the business that isn't geographically constrained. Menu development, protocol design, and staff training can be delivered remotely or on contract anywhere, so the keywords should be national rather than local — do not append "White Rock" to them. Different buyer, different sales cycle, likely different margin.

**The credential stack is unusually strong here and should lead the page:** a Red Seal chef who ran a restaurant for over a decade with a gluten-free program good enough that customers travelled for it. That is operator-level proof, not marketing language, and it is what a restaurant owner is actually buying.

Required sections:
- Who it's for — restaurants, commercial kitchens, care facilities, food manufacturers, event venues. Name the segments; a generic "businesses" framing converts nobody.
- What's delivered. Break the engagement into named components rather than describing it as one blob:
  - Menu development and recipe conversion
  - Kitchen protocol and cross-contamination audit
  - Staff training
  - Supplier and ingredient sourcing
  - Certification-readiness support, if applicable
- Engagement model — one-off audit vs. ongoing retainer, typical duration, remote vs. on-site
- Pricing model. Day rate or project range. Same argument as the catering pages: stating it filters out the wrong inquiries.
- Proof — the Jan's on the Beach gluten-free program as a case study, written up properly. This is the strongest page content available and it currently exists nowhere.
- FAQ aimed at operator objections: cost, kitchen disruption, staff resistance, liability

**Separate inquiry form.** A restaurant owner should not be asked for their event date and guest count. Fields: business name, business type, current GF handling, what they're trying to solve, timeline.

**Same compliance warning as above** — describe capability and protocols, never claim certifications not actually held.

---

## 5. Deliberately excluded

Listed so they don't get added back during design.

| Excluded | Reason |
|---|---|
| Christmas party page | Seasonal and capacity-limited. Handled by a September homepage banner and an email to past clients. December fills without search traffic. |
| Charity events page | Business development activity, not a service sold. Belongs on About, if anywhere. |
| Buffet / plated / drop-off pages | Service formats, not search intents. Handled inside the service pages above. |
| Location pages | Only worth building once there's a second distinct service area. |
| Blog | Only if it will actually be maintained. A stale blog is worse than none. |

**Total: 12 pages** — 10 in the events site, 2 in the gluten-free cluster. Four to six strong pages beat twenty thin ones; templated location and service permutations get suppressed in search. The two GF pages earn their place because they serve different audiences with genuinely different content, not because they're variations on a theme.

---

## 6. Global elements

- **Price anchor on every service page.** Starting per-person rate or event minimum. Most caterers hide this; its absence generates inquiries that have to be disqualified manually. State it.
- **Dietary line in every service page FAQ.** One sentence. Consistent wording across pages.
- **Single inquiry form component**, reused, with service type prefilled per page.
- **Footer:** service area, contact, social, links to both gluten-free pages.
- **Self-hiding rule for anything dated.** Any time-sensitive content — dinner dates, seasonal banners, the Christmas promotion — renders only when in range and disappears otherwise. Nothing on this site should be capable of displaying a stale date.

---

## 7. Technical

- Unique title tag and H1 per page, matching the target phrase
- `LocalBusiness` + `Service` structured data
- Cross-link every service page to its matching menu section and gallery entries
- Mobile-first; most event research happens on phones
- **Google Business Profile setup and review collection is likely worth more than the entire website for local discovery.** Do it in parallel, not after.

---

## 8. Visual direction

Derived from an audit of the current site at `wcculinary.com`.

### Audit of what exists

The current site is a stock WordPress theme: centred circular logo, small text nav, blog sidebar with "Recent Posts" and a search field, footer mailing-list form. It reads as a personal announcement page, which is what it was built to be. Three things in it are worth keeping and the rest should go.

**Keep:**

| Asset | Why |
|---|---|
| Black-and-white portrait of Chef Jan | The single most distinctive element on the current site. A B&W chef portrait is unusual in this category and it does the "a person cooks here" work instantly. |
| Tagline: *Chef designed, chef made!* | Already says exactly what section 2 argues the brand should say. Short, plain, no hospitality-speak. Keep the words; the exclamation mark is negotiable. |
| First-person voice | Chef Jan writing as herself is the differentiator against corporate caterers. Do not sand this into brand copy. Copy should stay in first person on Home, About, and Private Dining. |
| Circular WCCC logo | Constrains the palette (see open items). Reuse unless it's genuinely unusable. |

**Replace:**

- **Homepage framing.** It currently opens on her career transition — *embarking on a new phase*, *having sold my restaurant*. That's an announcement from 2024, and a visitor in 2026 reads a business in flux. Reframe around the visitor's event. The restaurant history moves to About, where it works as credential rather than news.
- **Blog sidebar, search field, "Recent Posts."** Blog furniture on a business site. Remove.
- **Gallery.** Twelve uncaptioned phone photos, newest from September 2024, no alt text. See section 4 — this becomes event write-ups with real captions.
- **Generic theme layout.** Centred logo over a thin nav bar is the default for every small food business on WordPress.

### Direction

**Signature element: colour is reserved for food.** People and process are black and white — the existing chef portrait becomes a system rather than a one-off, extended across About, process shots, and hands-at-work imagery. Food is the only thing on the site rendered in full colour. This makes the food literally the brightest thing on every page, it builds directly on the one good asset already there, and it is cheap to execute consistently across mixed-quality photography.

Spend the boldness here. Everything else stays quiet.

**Coastal, with restraint.** *West Coast* Culinary Creations, *Jan's on the Beach*, White Rock. The location is genuinely part of the story and the palette can reflect it — cool greys, wet sand, weathered wood, overcast Pacific light rather than tropical blues.

Explicitly avoid the seaside-town clichés: rope, anchors, driftwood script fonts, seafoam gradients, wave dividers, boat imagery. The reference is a grey February morning on the pier, not a nautical gift shop.

**Typography.** A characterful display face used with restraint, paired with a highly legible body face. Avoid gold or copper script — the default for catering and the fastest way to read as templated. Avoid the high-contrast serif on warm-cream background combination, which is the current default look for AI-generated food sites.

**Layout.**
- Full-bleed food photography carries the hero, with the B&W portrait as a secondary anchor rather than the lead image.
- Generous whitespace. Small-restaurant scale, not hospitality-group density.
- Menus set as menus — this is a chef's site, and the typographic treatment of a menu is a chance to show craft rather than dump a list.

**Constraints.**
- Restraint over decoration. Type and spacing carry the quality signal.
- No gluten-free visual cues (leaf icons, "GF" badges, green accents) anywhere outside `/gluten-free-catering`. This is a hard rule from section 2.
- Motion: minimal. A scroll reveal on food imagery at most. No hero video.
- Quality floor: responsive to mobile, visible keyboard focus, reduced motion respected, real alt text on every image.

---

## 9. Build priority

The website is a 6–12 month play. These come first and will produce bookings sooner:

1. **Reactivate the Jan's on the Beach customer list.** Twelve years of customers, many of whom traveled for her food. A large share likely don't know she caters. Old POS records, mailing list, the restaurant's Facebook page, personal contacts. Potentially worth more than a year of SEO.
2. **Ask repeat clients for referrals.** They've almost certainly never been asked. Specific asks outperform general ones.
3. **Google Business Profile + reviews** from those same clients.
4. **Website.**
5. **Venue and community partnerships.** For small weddings, preferred-caterer lists are how bookings happen — and celiac-safe capability is a selling point *for the venue*. Separately: Canadian Celiac Association chapters, GF community groups, dietitians, GF bakeries. Relationship work, not advertising.

**Phase 1 build:** Home, Weddings, Corporate, Celebrations, Private Dining, Menus, About, Contact.
**Phase 2:** Gallery (needs photography), Wine Dinners (needs a scheduled date), Gluten-Free Catering, Gluten-Free Consulting (needs the Jan's on the Beach case study written).

---

## 10. Open items

- [ ] **Sample the circular WCCC logo for exact hex values.** The palette in section 8 has to be derived from it, and it wasn't retrievable from the site.
- [ ] **Full list of certifications and awards** with awarding body and year for each. Needed before About can be written, and it feeds three other pages.
- [ ] List of charity organisations and causes she works with, for the community block on About. Past and upcoming both — but the page copy names organisations, not dated events.
- [ ] Gluten-free consulting: confirm target segments, engagement model, and pricing. Is it remote, on-site, or both?
- [ ] Written case study of the Jan's on the Beach gluten-free program — the anchor content for the consulting page
- [ ] Pricing: per-person starting rates and event minimums per service line
- [ ] Capacity — is she currently turning work away, or are weekends open? This determines whether marketing should aim at volume or at raising prices.
- [ ] Photography inventory — what exists, what needs shooting
- [ ] Existing brand assets from Jan's on the Beach (logo, palette, typefaces) — does anything transfer, or is WCCC a clean break?
- [ ] Export the existing mailing list before migrating off the current WordPress install
- [ ] Does the old restaurant customer list exist in any retrievable form?
- [ ] Actual GF kitchen protocols, documented, before the GF page is written
- [ ] Review current pricing before launch. Referral-only businesses are typically underpriced; marketing brings strangers who will price-shop.
