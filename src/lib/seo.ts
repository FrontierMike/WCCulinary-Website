// One place for the facts search engines read, and the helpers that shape them.
//
// Everything here has to be true. Google treats structured data that
// contradicts the page as spam, so a claim only belongs in this file once the
// site also states it in prose. That is why there are no opening hours, no
// price range and no aggregateRating: the business publishes none of them, and
// inventing them risks a manual action against the whole domain.

export const SITE = 'https://wcculinary.com';

/** Node ids, so the JSON-LD on every page joins into one graph instead of
 *  repeating a detached copy of the business on each URL. */
export const ID = {
  business: `${SITE}/#business`,
  website: `${SITE}/#website`,
  chef: `${SITE}/#janet-wait`,
};

export const BUSINESS_NAME = 'West Coast Culinary Creations';
export const PHONE = '+1-604-626-6527';
export const EMAIL = 'jan@wcculinary.com';

/** White Rock, BC. There is no storefront — this is a service-area business —
 *  so this is the centre it works out from, not an address to visit. */
export const GEO = { latitude: 49.0253, longitude: -122.8028 };

export const PROFILES = [
  'https://www.instagram.com/west_coast_culinary_creations/',
  'https://www.facebook.com/profile.php?id=61556583523585',
  'https://maps.google.com/?cid=11488159639631320576',
];

/** Every municipality the business will travel to, in rough order of how much
 *  work comes from each. This is the list `areaServed` publishes and the list
 *  the "Where do you cook?" answer names — they are deliberately the same, so
 *  the markup and the prose cannot drift apart. */
export const SERVICE_AREA = [
  'White Rock',
  'South Surrey',
  'Surrey',
  'Langley',
  'Delta',
  'Tsawwassen',
  'Ladner',
  'Richmond',
  'Vancouver',
  'Burnaby',
  'New Westminster',
  'Coquitlam',
  'Port Moody',
  'Port Coquitlam',
  'North Vancouver',
  'West Vancouver',
  'Maple Ridge',
  'Pitt Meadows',
  'Abbotsford',
];

/** Astro builds to directories, so every canonical on this site ends in a
 *  slash. A node pointing at "/weddings" while the canonical says
 *  "/weddings/" hands Google two URLs for one page — so normalise here, in
 *  the one place that builds absolute URLs. */
const abs = (path: string) => {
  const u = new URL(path, SITE);
  if (!u.pathname.endsWith('/')) u.pathname += '/';
  return u.toString();
};

const city = (name: string) => ({
  '@type': 'City',
  name,
  containedInPlace: {
    '@type': 'AdministrativeArea',
    name: 'British Columbia',
    containedInPlace: { '@type': 'Country', name: 'Canada' },
  },
});

/** The business itself, at a stable @id so every other node on the site points
 *  at it with a one-line reference rather than repeating it. */
export const businessNode = (description: string) => ({
  '@type': 'LocalBusiness',
  '@id': ID.business,
  // schema.org has no catering class. `additionalType` is the documented way
  // to say what this business is without inventing one.
  additionalType: 'https://en.wikipedia.org/wiki/Catering',
  name: BUSINESS_NAME,
  description,
  url: `${SITE}/`,
  telephone: PHONE,
  email: EMAIL,
  image: `${SITE}/og.jpg`,
  logo: { '@type': 'ImageObject', url: `${SITE}/og.jpg` },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'White Rock',
    addressRegion: 'BC',
    addressCountry: 'CA',
  },
  geo: { '@type': 'GeoCoordinates', ...GEO },
  // Roughly White Rock to the North Shore — the far edge of what one event day
  // allows, and the same limit the FAQ describes in words.
  serviceArea: {
    '@type': 'GeoCircle',
    geoMidpoint: { '@type': 'GeoCoordinates', ...GEO },
    geoRadius: '60000',
  },
  areaServed: SERVICE_AREA.map(city),
  founder: { '@id': ID.chef },
  employee: { '@id': ID.chef },
  currenciesAccepted: 'CAD',
  knowsAbout: [
    'Private chef services',
    'Wedding catering',
    'Corporate catering',
    'Wine pairing dinners',
    'Gluten-free and coeliac-safe catering',
    'Seasonal West Coast cuisine',
  ],
  sameAs: PROFILES,
});

/** Janet, as a person. The Red Seal ticket and the twelve restaurant years are
 *  the strongest credibility signals the site has, and until now they existed
 *  only as prose. */
export const chefNode = () => ({
  '@type': 'Person',
  '@id': ID.chef,
  name: 'Janet Wait',
  givenName: 'Janet',
  familyName: 'Wait',
  jobTitle: 'Red Seal Chef',
  description:
    "Red Seal certified chef, and for twelve years the owner and chef of Jan's on the Beach, an award-winning gourmet bistro in White Rock. She now cooks private dinners and caters events across the Lower Mainland.",
  worksFor: { '@id': ID.business },
  hasCredential: [
    {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'certification',
      name: 'Red Seal Certified Chef, Cook trade',
      recognizedBy: {
        '@type': 'Organization',
        name: 'Interprovincial Standards Red Seal Program',
      },
    },
    {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'certification',
      name: 'FOODSAFE Level 1',
      recognizedBy: {
        '@type': 'Organization',
        name: 'BC Centre for Disease Control',
      },
    },
  ],
  knowsAbout: [
    'Gluten-free kitchen protocol',
    'Coeliac-safe food service',
    'West Coast seasonal cooking',
  ],
  sameAs: PROFILES,
});

export const websiteNode = () => ({
  '@type': 'WebSite',
  '@id': ID.website,
  url: `${SITE}/`,
  name: BUSINESS_NAME,
  inLanguage: 'en-CA',
  publisher: { '@id': ID.business },
});

/** A crumb trail for the current page. Google renders it in place of the raw
 *  URL in results. `trail` excludes Home, which is prepended here. */
export const breadcrumbNode = (trail: [string, string][]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [['Home', '/'] as [string, string], ...trail].map(([name, path], i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
    item: abs(path),
  })),
});

/** One service, offered across the whole service area — so each service page
 *  is a described offering rather than a page that happens to mention
 *  catering, and each one carries the geography on its own. */
export const serviceNode = (opts: { name: string; description: string; path: string }) => ({
  '@type': 'Service',
  serviceType: opts.name,
  name: opts.name,
  description: opts.description,
  url: abs(opts.path),
  provider: { '@id': ID.business },
  areaServed: SERVICE_AREA.map(city),
  availableChannel: {
    '@type': 'ServiceChannel',
    serviceUrl: abs('/contact'),
    servicePhone: { '@type': 'ContactPoint', telephone: PHONE },
  },
});

/** Wraps a page's nodes in the @graph envelope — one <script> per page, not
 *  five, so a crawler resolves every @id reference in a single parse. */
export const graph = (nodes: object[]) => ({
  '@context': 'https://schema.org',
  '@graph': nodes,
});
