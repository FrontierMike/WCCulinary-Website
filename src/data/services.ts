// Service page content. Copy is from the design handoff and is final —
// treat edits here as copy changes, not code changes.
//
// MENUS: client names are deliberately left off — put one back only with that
// client's permission.

export type Section = {
  /** Renders as the section's DOM id, so it can be linked into from the nav
   *  (e.g. /private-dining#wine-dinners). Only set it where something links. */
  id?: string;
  kicker?: string;
  /** Optional only for `quote` — the testimonial band carries no heading. */
  heading?: string;
  lead?: string;
  note?: string;
} & (
  /** `photo` sets the narrative beside a picture instead of running full width.
   *  `slot` is a key in src/data/images.ts; `ratio` overrides the 4/3 box. */
  | { type: 'narrative'; paras: string[]; photo?: { slot: string; alt: string; ratio?: string } }
  | { type: 'cards'; cards: { title: string; body: string }[] }
  | { type: 'steps'; steps: { title: string; body: string }[] }
  | { type: 'lists'; lists: { title: string; items: string[] }[] }
  | { type: 'menus'; menus: { tag: string; title: string; items: string[] }[] }
  | { type: 'quote'; text: string; attribution: string }
);

export interface Service {
  slug: string;
  /** Nav label, and the order services appear in — see src/lib/nav.ts. */
  title: string;
  /** What the service is called in the Service markup. The nav label is a
   *  menu word — "Weddings", "Corporate" — and naming a schema.org Service
   *  that tells a crawler nothing. This is the same thing as a person would
   *  search for. Defaults to `title`. */
  serviceName?: string;
  /** One-line description of the service. Written for the Services index,
   *  which no longer exists; nothing renders it today. Kept because it is the
   *  only short-form copy for each service. */
  summary: string;
  imageSlot: string;
  imageAlt: string;
  /** FAQ variant key; '' uses the shared six questions only. */
  faqVariant: string;
  hero: { kicker: string; heading: string; lead: string };
  seo: { title: string; description: string };
  sections: Section[];
  cta: { heading: string; body: string };
}

const DIETARY = 'Dietary restrictions are handled within the main menu rather than as a separate plate.';

export const services: Service[] = [
  {
    slug: 'private-dining',
    title: 'Private dining',
    serviceName: 'Private chef and private dining',
    summary: 'Two to thirty-two people, three, four or five courses, cooked in your kitchen and served to your table.',
    imageSlot: 'private-dining-tacos',
    imageAlt: 'A plated course served at a private dinner',
    faqVariant: 'private-dining',
    hero: {
      kicker: 'Private dining',
      heading: 'I cook in your kitchen. You do not get up.',
      lead: 'Two to thirty-two people, three, four or five courses, served to your table. It is the easiest way to eat my food, and the way I most like to cook it.',
    },
    seo: {
      title: 'Private chef at home — White Rock to Vancouver | West Coast Culinary Creations',
      description: 'A Red Seal chef cooks three, four or five courses in your own kitchen, for two to thirty-two people. Private chef dinners and wine pairing dinners across White Rock, South Surrey, Langley, Vancouver and the Lower Mainland.',
    },
    sections: [
      {
        type: 'narrative',
        kicker: 'The evening',
        photo: { slot: 'sec-private', alt: 'Seared scallops on tasting spoons, plated for a private dinner', ratio: '3 / 4' },
        heading: 'What actually happens when I cook at your house.',
        paras: [
          'I arrive about two hours before you sit down, with everything already shopped and most of the prep done. I work quietly — you should be pouring wine, not hosting me.',
          'Courses come out when the table is ready for them, plated in your kitchen and served by me or a server if we have one. Between courses I clear.',
          'When the last plate goes down I wash, put your kitchen back exactly as I found it, and let myself out. Most people do not realise I have gone.',
        ],
      },
      {
        type: 'cards',
        kicker: 'How it works',
        heading: 'The shape of a private dinner.',
        cards: [
          { title: 'Typical counts', body: 'Two to thirty-two. Eight to twelve is the sweet spot — one table, one conversation, and every course lands hot.' },
          { title: 'The format', body: 'Three, four or five fixed courses — we talk it through and pick the one that suits your evening. The same menu for the whole table apart from dietary changes, which is what lets me cook restaurant food in a home kitchen.' },
          { title: 'How the menu gets built', body: 'We talk for twenty minutes — what you like, what you never want to see again, who has restrictions. I write the menu around what is good that week and send it for approval.' },
          { title: 'What it costs', body: 'Per guest, covering groceries, cooking, service and cleanup. A server is added for tables over twelve. No packages — you get a quote for your evening.' },
        ],
      },
      {
        id: 'menus',
        type: 'menus',
        kicker: 'Recent menus',
        heading: 'Menus I have cooked in someone’s kitchen.',
        note: 'Want it built around specific bottles? That is a wine pairing dinner — the menus are further down this page.',
        menus: [
          {
            tag: 'Three courses',
            title: 'Dinner party for twelve',
            items: [
              'Mixed greens, apple cider vinaigrette',
              'Pistachio-crusted halibut',
              'Lemon risotto, grilled seasonal vegetables',
              'Chocolate mousse',
            ],
          },
          {
            tag: 'Three courses',
            title: 'Dinner for six',
            items: [
              'Mixed greens, honey balsamic dressing',
              'Baked ham with honey mustard glaze',
              'Cheesy scalloped potatoes, spicy green beans',
              'Brownies',
            ],
          },
          {
            tag: 'Seven courses',
            title: 'Small plates dinner for fourteen',
            items: [
              'Poached pear on Brie crostini',
              'Spicy crab salad in wonton tarts',
              'Duck salad — romaine, radicchio, mandarin, confit duck, orange champagne dressing',
              'Pork tenderloin lettuce wraps — basil, mint, cilantro, lemongrass, ginger, lime',
              'Palate cleanser: lemongrass sorbet',
              'Oregano chicken on Mexican street corn — feta, lime, Tajín',
              'Mongolian lamb popsicle — crisp potato and onion, hoisin, black bean, sesame',
              'Palate cleanser: basil sorbet',
              'Grand Marnier and orange glazed wild salmon and prawns, lemon risotto',
              'Palate cleanser: sparkling lemon water',
              'Lemon mousse',
            ],
          },
        ],
      },
      {
        type: 'lists',
        kicker: 'The practical part',
        heading: 'What I need, and what you do not have to think about.',
        lists: [
          {
            title: 'From your kitchen',
            items: [
              'An oven, a stovetop, a sink and some counter space',
              'I bring my own knives, pans and serving pieces',
              'A small kitchen is fine — tell me and I write a menu that suits it',
              'Use your own plates, or I bring plates and take them away dirty',
            ],
          },
          {
            title: 'Handled by me',
            items: [
              'Shopping — groceries are inside the per-guest price',
              'Every course cooked and plated on site',
              'Service between courses, and clearing',
              'Dishes washed, counters wiped, recycling sorted, kitchen as it was',
            ],
          },
          {
            title: 'Good to know',
            items: [
              'Two weeks is comfortable; ask about a nearer date anyway',
              'A private dinner is far easier to slot in than an event',
              DIETARY,
              'Coeliac guests get dedicated equipment and separated prep',
            ],
          },
        ],
      },
      {
        id: 'wine-dinners',
        type: 'menus',
        kicker: 'Wine pairing dinners',
        heading: 'What a wine dinner actually looks like.',
        menus: [
          {
            tag: 'Okanagan whites',
            title: 'Five courses',
            items: [
              'Steamed clams, white wine, garlic, herbs · dry Riesling',
              'Seared scallop, pesto, crisp pancetta · Chardonnay',
              'Halibut, pepper relish, new potato · Pinot Gris',
              'Aged cheeses, quince, walnut · late-harvest Viognier',
              'Almond and olive oil cake, roasted plums · Muscat',
            ],
          },
          {
            tag: 'Big reds, November',
            title: 'Five courses',
            items: [
              'Beef carpaccio, aioli, parmesan · Gamay',
              'Wild mushroom and thyme tart · Pinot Noir',
              'Duck breast, wild rice, cherry · Syrah',
              'Braised short rib, celeriac, gremolata · Cabernet blend',
              'Dark chocolate pâté, crème fraîche · fortified red',
            ],
          },
        ],
      },
      {
        type: 'narrative',
        kicker: 'Book a private wine dinner',
        heading: 'The same format, for your table.',
        note: `I am not licensed to sell alcohol — for private dinners the wine is yours, or bought by you on my recommendation. ${DIETARY}`,
        paras: [
          'Bring bottles you have been saving and I will write the courses around them, or tell me a region and a budget and I will handle the wine too.',
          'Eight to twenty guests, at your house or a venue. Five or six courses, poured and served in sequence.',
          'Wine dinners are the natural first step if you are considering me for something larger — most of my wedding clients started at one.',
        ],
      },
      {
        type: 'quote',
        text: 'The food was delicious, and we truly appreciated how you went above and beyond to accommodate our requests.',
        attribution: 'School parent Christmas party · E & S',
      },
    ],
    cta: {
      heading: 'Pick a Saturday and I will write you a menu.',
      body: 'Two to thirty-two people. Tell me the date and roughly what you like to eat.',
    },
  },

  {
    slug: 'weddings',
    title: 'Weddings',
    serviceName: 'Wedding catering',
    summary: 'Intimate weddings up to seventy-five guests, with one consultation and the chef you hired on the line.',
    imageSlot: 'svc-weddings',
    imageAlt: 'A chocolate pâté dessert plated with raspberry coulis and cream',
    faqVariant: 'weddings',
    hero: {
      kicker: 'Weddings',
      heading: 'Small weddings, cooked by the chef you hired.',
      lead: 'Intimate weddings — up to about seventy-five guests. One menu consultation, and I am the person on the line on the day. Not a name on your contract.',
    },
    seo: {
      title: 'Small wedding catering — White Rock to Vancouver | West Coast Culinary Creations',
      description: 'Intimate wedding catering up to seventy-five guests by Red Seal chef Janet Wait, across White Rock, Surrey, Langley and Metro Vancouver. One consultation, and the chef you hired cooking on the day.',
    },
    sections: [
      {
        type: 'narrative',
        kicker: 'Why smaller is better food',
        photo: { slot: 'sec-weddings', alt: 'A seafood platter of crab, mussels, prawns, scallops and salmon', ratio: '3 / 4' },
        heading: 'Seventy-five plates can leave a real kitchen properly. Three hundred cannot.',
        paras: [
          'A banquet kitchen cooking for three hundred has to hold food at temperature for an hour before it reaches a table. Everything is chosen for how well it survives that wait, which is why catered food has the reputation it does.',
          'At your scale I can cook to order, finish plates as they go out, and serve fish that was still whole that morning. The constraint is what makes the food good — not something to apologise for.',
          'It also means I am cooking one wedding that weekend. Yours.',
        ],
      },
      {
        type: 'steps',
        kicker: 'How the year runs',
        heading: 'From first email to the last plate.',
        steps: [
          { title: 'Inquiry', body: 'Your date, venue, guest count and budget range. I answer within two business days and tell you plainly whether the venue can support the service you want.' },
          { title: 'Menu consultation', body: 'An hour, in person where possible. What you both actually like to eat, what is in season on your date, and every dietary need at the table — built into the menu, not added to it. We edit until the menu is right.' },
          { title: 'The day', body: 'We arrive early and set the kitchen. A timed service plan goes to your photographer and MC. You eat a hot plate at your own wedding — I take that personally.' },
        ],
      },
      {
        type: 'lists',
        kicker: 'The contract',
        heading: 'What is included, and what is not.',
        lists: [
          {
            title: 'Included',
            items: [
              'Menu design and a full menu consultation',
              'All food, prepared and finished on site',
              'Kitchen team and service staff, with a lead server',
              'Rental coordination — china, glassware, flatware, linen',
              'Allergen mapping by guest and by seat',
              'Setup, service and full kitchen cleanup',
            ],
          },
          {
            title: 'Not included',
            items: [
              'Bar service and alcohol — I work alongside your bar, or refer one',
              'The rental items themselves, billed at cost with no markup',
              'Venue fees, corkage and any venue-required insurance riders',
              'Gratuity — never added automatically',
              'Wedding cake, unless it is on the dessert menu we design',
            ],
          },
          {
            title: 'Good to know',
            items: [
              'A signed menu and deposit hold the date; the balance is due one week prior',
              'Final guest count confirms twelve days out',
              'I travel through the Fraser Valley and to the Gulf Islands',
              'Venues without a kitchen are workable — ask before you book one',
            ],
          },
        ],
      },
      {
        type: 'menus',
        kicker: 'Sample wedding menus',
        heading: 'Menus I have cooked. Yours will not be one of them.',
        menus: [
          {
            tag: 'Late summer',
            title: 'Four courses, seated',
            items: [
              'Chilled sweet corn velouté, Dungeness crab, chive oil',
              'Heirloom tomato, burrata, basil, aged balsamic',
              'Sablefish in miso butter, summer beans, new potato',
              'Okanagan peach tart, brown butter ice cream',
            ],
          },
          {
            tag: 'Autumn',
            title: 'Family style, shared platters',
            items: [
              'Grazing table: local cheeses, cured meats, preserves',
              'Little gem salad, anchovy dressing, rye crumb',
              'Braised short rib, celeriac purée, gremolata',
              'Roasted carrots, hazelnut, honey · Herbed rice pilaf',
              'Dark chocolate pâté, crème fraîche, raspberry',
            ],
          },
          {
            tag: 'Reception',
            title: 'Passed canapés, standing',
            items: [
              'Seared scallop, pesto, crisp pancetta',
              'Smoked salmon, caper, pickled onion on rye',
              'Puff pastry pinwheel, sun-dried tomato, herbs',
              'Chicken satay, peanut, lime',
              'Beef carpaccio crostini, aioli, parmesan',
              'Lemon tart, torched meringue',
            ],
          },
        ],
      },
      {
        type: 'quote',
        text: 'Everyone was raving about their meal last night! The meal was wonderful.',
        attribution: 'Small wedding at a local winery',
      },
      {
        type: 'narrative',
        kicker: 'Venues worked',
        heading: 'Where I have cooked weddings.',
        note: 'Working with a venue not listed? Send it — most kitchens are workable and I will tell you honestly if one is not.',
        paras: [
          'Private homes and gardens across South Surrey and White Rock, waterfront halls at Crescent Beach, community and legion halls, farm properties in Langley and Cloverdale, and Gulf Island rentals.',
        ],
      },
    ],
    cta: {
      heading: 'Tell me your date and I will tell you honestly if it works.',
      body: 'Date, venue, guest count and budget range. I answer within two business days.',
    },
  },

  {
    slug: 'corporate',
    title: 'Corporate',
    serviceName: 'Corporate and office lunch catering',
    summary: 'Office lunches, board dinners and client entertaining on fixed delivery windows and plain per-head pricing.',
    imageSlot: 'svc-corporate',
    imageAlt: 'A buffet line of chafing dishes with guests serving themselves',
    faqVariant: 'corporate',
    hero: {
      kicker: 'Corporate catering',
      heading: 'Office lunches and client dinners, delivered when we said.',
      lead: 'Fixed delivery windows, plain per-head pricing, itemised invoices and repeat accounts. Restaurant food, run on office logistics.',
    },
    seo: {
      title: 'Corporate & office lunch catering — White Rock to Vancouver | West Coast Culinary Creations',
      description: 'Office lunch and board dinner catering with fixed delivery windows, per-head pricing, PO numbers and itemised invoices. Surrey, White Rock, Langley, Burnaby, Richmond and Vancouver.',
    },
    sections: [
      {
        type: 'lists',
        kicker: 'Logistics',
        heading: 'The parts you actually need to plan around.',
        lists: [
          {
            title: 'Delivery windows',
            items: [
              'Breakfast — 7:30 to 9:00',
              'Lunch — 11:15 to 12:30',
              'Dinner — 4:30 to 6:00',
              'Delivery is inside a thirty-minute window you choose, not a two-hour one',
            ],
          },
          {
            title: 'Lead times',
            items: [
              'Drop-off lunch — three business days',
              'Board or client dinner — one week',
              'Events over forty people — two weeks',
              'Standing weekly orders — set once, then no lead time at all',
            ],
          },
          {
            title: 'Accounts and invoicing',
            items: [
              'Purchase order numbers carried on every invoice',
              'One monthly invoice for recurring orders',
              'GST registered · WCB covered · liability insured',
            ],
          },
        ],
      },
      {
        type: 'menus',
        kicker: 'Sample menus',
        heading: 'Priced per head.',
        lead: 'Choose one menu for the room, or two and I will label everything.',
        note: 'Boxed individual lunches, breakfast platters and grazing tables are all available.',
        menus: [
          {
            tag: 'Lunch',
            title: 'Working lunch, drop-off',
            items: [
              'Chicken satay with peanut and lime',
              'Roasted vegetable and goat cheese pinwheels',
              'Market green salad, honey balsamic vinaigrette',
              'Grain salad with lemon, herbs, toasted seeds',
              'Chocolate pâté squares and fresh berries',
            ],
          },
          {
            tag: 'Dinner',
            title: 'Casual dinner for forty',
            items: [
              'Greek and Caesar salads',
              'Tortellini alfredo, garlic toast',
              'Greek chicken, roasted potatoes, mixed vegetables',
              'Brownies, tarts, cheesecake squares',
            ],
          },
          {
            tag: 'Dinner',
            title: 'Corporate dinner for nine',
            items: [
              'Orange, radicchio and romaine salad',
              'Chicken piccata',
              'Roasted potatoes, seasonal vegetables',
              'Pecan squares',
            ],
          },
        ],
      },
      {
        type: 'narrative',
        kicker: 'Dietary accommodation, handled by name',
        photo: { slot: 'sec-corporate', alt: 'Crudite and cheese platters laid out for an office lunch' },
        heading: 'One wrong plate is the thing people remember.',
        paras: [
          'You are ordering for a room you do not control. Send me the restrictions with the headcount and every affected portion arrives labelled with the guest’s name.',
          `${DIETARY} Vegetarian, vegan, dairy-free and nut-free are routine — no surcharge.`,
          'Coeliac guests are cooked with dedicated equipment and separated prep. Full ingredient lists are available on request for anyone who needs to check a label.',
        ],
      },
      {
        type: 'cards',
        kicker: 'Ordering',
        heading: 'Setting up an account.',
        cards: [
          { title: 'First order', body: 'Send it through the quote form. After that I keep your delivery details, dietary list and PO format on file, and you can order by email in two lines.' },
          { title: 'Minimum order', body: 'Ten people for drop-off, or the equivalent value. Below that, boxed individual lunches are the better option.' },
          { title: 'Staff and serviceware', body: 'Drop-off arrives ready to serve on platters, with compostable serviceware at no charge. Plated dinners are quoted with service staff; china and glassware rent at cost.' },
          { title: 'Cancellations', body: 'Free up to the lead time for your order type. Inside that window, food already purchased is billed.' },
        ],
      },
      {
        type: 'quote',
        text: 'Many thanks to you and your crew for doing such a fantastic job, we appreciated it and so did our guests. Looking forward to working with you again!',
        attribution: 'Catered event · L',
      },
    ],
    cta: {
      heading: 'Send one lunch and see how it lands.',
      body: 'Headcount, date and delivery window is enough to quote. Repeat accounts order by email after that.',
    },
  },

  {
    slug: 'celebrations',
    title: 'Celebrations',
    serviceName: 'Birthday, anniversary and celebration catering',
    summary: 'Birthdays, milestones, anniversaries and parties — drop-off trays through to full service with staff.',
    imageSlot: 'svc-celebrations',
    imageAlt: 'Plated chicken on arugula with pineapple salsa and an orchid garnish',
    faqVariant: 'celebrations',
    hero: {
      kicker: 'Celebrations',
      heading: 'Birthdays, milestones, anniversaries, and the parties in between.',
      lead: 'Fiftieths, sixtieths, engagement parties, retirements, a good excuse in general. At home or at a venue, from drop-off trays to full service with staff.',
    },
    seo: {
      title: 'Birthday & anniversary catering — White Rock to Vancouver | West Coast Culinary Creations',
      description: 'Birthday, milestone and anniversary catering by a Red Seal chef. Drop-off trays through to full service, at home or at a venue, across Surrey, White Rock, Langley, Delta and Metro Vancouver.',
    },
    sections: [
      {
        type: 'cards',
        kicker: 'How much of it I do',
        heading: 'Three levels of service.',
        cards: [
          { title: 'Drop-off', body: 'Platters arrive ready to serve, labelled, with serving pieces. You put them out.' },
          { title: 'Set up and go', body: 'I arrive, set the table, lay everything out and leave it looking right. Pickup the next morning.' },
          { title: 'Full service', body: 'I cook on site with staff to pass, pour, clear and wash. You do not enter the kitchen.' },
        ],
      },
      {
        type: 'menus',
        kicker: 'Sample menus',
        heading: 'Four formats that suit a party.',
        menus: [
          {
            tag: 'Canapés and seated',
            title: 'Golden anniversary for twenty-four',
            items: [
              'Chicken satay',
              'Mini quesadillas',
              'Vegetable platter',
              'Charcuterie and cheese boards',
              'Plated pear and blue cheese salad',
              'Grilled chicken and spinach ravioli',
              'Roasted potatoes and vegetables',
            ],
          },
          {
            tag: 'Canapés and family style',
            title: 'Seventy-fifth birthday for twenty',
            items: [
              'Chicken satay',
              'Cioppino shots',
              'Sun-dried tomato and Brie crostini',
              'Plated grilled peach salad',
              'Grilled chicken and ribs, family style',
              'Roasted potatoes, grilled vegetables',
            ],
          },
          {
            tag: 'Four courses',
            title: 'Summer party for eight',
            items: [
              'Bruschetta',
              'Brie and tomato jam crostini',
              'Meat and cheese charcuterie',
              'Grand Marnier and orange salmon and prawns',
              'Lemon risotto, asparagus, multicoloured carrots',
              'Grand Marnier strawberries on angel food cake, whipped cream',
            ],
          },
          {
            tag: 'Shared',
            title: 'Meze table',
            items: [
              'Hummus and baba ganoush with warm pita',
              'Marinated olives and dolmades',
              'Spanakopita, spinach and feta in filo',
              'Falafel with tahini and lemon',
              'Steamed clams or mussels in white wine',
            ],
          },
        ],
      },
      {
        type: 'narrative',
        kicker: 'At home, or at a venue',
        photo: { slot: 'sec-celebrations', alt: 'A cocktail garnished for a celebration', ratio: '4 / 5' },
        heading: 'A home kitchen goes further than people expect.',
        paras: [
          'At home is warmer and cheaper, and a domestic kitchen is enough for far more than people expect — I have cooked forty covers out of a galley kitchen with one oven. What a home cannot absorb is rentals and standing room, so past about forty the venue starts to pay for itself.',
          'If you have not booked anywhere yet, ask me first. Whether a room has a kitchen, water and a service door changes the menu more than any other factor.',
        ],
      },
      {
        type: 'lists',
        kicker: 'Practical',
        heading: 'The things people ask before booking.',
        lists: [
          {
            title: 'Pricing',
            items: [
              'Per guest, set by the menu and how much service you want',
              'Drop-off is the lowest, full service with staff the highest',
              'Send your headcount and format and I will send a real number',
            ],
          },
          {
            title: 'Kit and kitchen',
            items: [
              'Compostable serviceware included',
              'China, glass and linen rent at cost, or use your own',
              'I need an oven, a sink and counter space — send a photo if unsure',
            ],
          },
          {
            title: 'Timing and bar',
            items: [
              'Two to four weeks for most parties; December fills by mid-October',
              'No liquor licence, so bar service is yours or a licensed provider’s',
              'I build the food around what you are pouring',
              DIETARY,
            ],
          },
        ],
      },
      {
        type: 'cards',
        kicker: 'Guest counts',
        heading: 'What changes as the room gets bigger.',
        cards: [
          { title: '8 – 20', body: 'A dinner party. Plated courses, cooked in your kitchen, served to the table. This is the format where the food is at its best.' },
          { title: '20 – 40', body: 'Canapés and grazing, or family-style platters on a long table. One server keeps the room moving and clears as it goes. Still fits in most homes.' },
          { title: '40 – 75', body: 'A venue, rentals and a kitchen team. Buffet or stations rather than plated, unless the room is set for seated service. Bar handled separately.' },
        ],
      },
      {
        type: 'quote',
        text: 'Thank you again for the amazing food! Everyone was raving about it!',
        attribution: 'Evening celebration · S & L',
      },
    ],
    cta: {
      heading: 'Tell me what we are celebrating.',
      body: 'The date, the headcount and where — that is enough for a quote inside two business days.',
    },
  },
];

services.push({
  slug: 'gluten-free-catering',
  title: 'Gluten-free catering',
  serviceName: 'Gluten-free and coeliac-safe catering',
  summary: 'Coeliac guests get the same dinner as everyone else — dedicated equipment, separated prep, documented protocol.',
  imageSlot: 'svc-gluten-free',
  imageAlt: 'A platter of steamed clams with basil and chilli',
  faqVariant: 'gf',
  hero: {
    kicker: 'Gluten-free catering',
    heading: 'Coeliac guests get the same dinner as everyone else.',
    lead: 'Not a substitute plate carried out after the others. A menu written so that the gluten-free version is the version — cooked with dedicated equipment, on separated surfaces, by a chef who ran a gluten-free program in a working restaurant for twelve years.',
  },
  seo: {
    title: 'Gluten-free & coeliac-safe catering — Lower Mainland BC | West Coast Culinary Creations',
    description: 'Coeliac-safe catering across Metro Vancouver and the Fraser Valley — dedicated equipment, separated prep and verified sourcing, by a Red Seal chef who ran a gluten-free restaurant program for twelve years.',
  },
  sections: [
    {
      type: 'cards',
      kicker: 'Kitchen protocols',
      heading: 'Exactly how it is handled, so you can judge it yourself.',
      lead: 'Anyone can say "we can do gluten free." The community has heard it and been made ill by it. So here is the actual process, in enough detail that you can decide whether it is good enough for the person you are worried about.',
      cards: [
        { title: 'Separated prep, before anything else starts', body: 'Gluten-free work is prepped first, on cleaned and sanitised surfaces, before any flour is opened that day. Dedicated boards, knives, pans, tongs and utensils — colour coded, stored separately, never in the shared rotation.' },
        { title: 'Sourcing checked to the label', body: 'Every ingredient is verified — including stocks, soy and fish sauces, mustards, spice blends, baking powder and anything processed on shared lines. Suppliers are asked directly about their own facilities.' },
        { title: 'On-site process', body: 'No shared fryer oil, ever. Separate service utensils and a covered holding area. Where there is a buffet, gluten-free items are placed first in the line and physically separated so nobody drags a serving spoon across them.' },
        { title: 'Guests logged by seat', body: 'Coeliac guests are recorded by name and seat number and the plate is carried by a server who has been told which one it is. Nothing depends on a guest having to ask at the table.' },
        { title: 'What I do not claim', body: 'I am not a third-party certified gluten-free facility, and I will not say I am. What I have is documented protocol and twelve years of practice. If you need certification, ask and I will tell you honestly where the line is.' },
      ],
    },
    {
      type: 'narrative',
      kicker: 'The restaurant years',
      photo: { slot: 'sec-gluten-free', alt: 'Heirloom tomato and bocconcini salad on a blue plate' },
      heading: 'People drove from Vancouver for it, week after week.',
      paras: [
        "Jan's on the Beach ran a real gluten-free program — not two token items, but a menu where most dishes could be made properly gluten free, cooked in a kitchen with the equipment and the discipline to do it.",
        'People drove from Vancouver and out of the Valley for it, week after week, for years. Coeliac families booked their birthdays with us because it was the one place a kid could order what everybody else was ordering.',
        'That is the whole credential. It is also why I take this seriously enough to write it out rather than put a leaf icon on the menu.',
      ],
    },
    {
      type: 'menus',
      kicker: 'Sample menus',
      heading: 'Wholly gluten-free menus — nothing adapted, nothing missing.',
      menus: [
        {
          tag: 'Four courses',
          title: 'Seated dinner',
          items: [
            'Steamed clams, white wine, garlic, herbs',
            'Buckwheat crêpe, smoked salmon, dill crème',
            'Crisp polenta, wild mushroom ragù, aged parmesan',
            'Almond and olive oil cake, roasted plums',
          ],
        },
        {
          tag: 'Passed',
          title: 'Reception canapés',
          items: [
            'Seared scallop, pesto, crisp pancetta',
            'Prawn cocktail, cucumber, lemon',
            'Beef carpaccio on polenta, aioli, parmesan',
            'Chicken satay, peanut, lime',
            'Brown butter brownie bites',
          ],
        },
        {
          tag: 'Shared',
          title: 'Wedding, family style',
          items: [
            'Grazing table — cheeses, cured meats, preserves',
            'Market greens, pear, blue cheese, walnut',
            'Braised short rib, celeriac purée, gremolata',
            'Roasted carrots, hazelnut, honey',
            'Chocolate pâté, crème fraîche, raspberry',
          ],
        },
      ],
    },
    {
      type: 'lists',
      kicker: 'Straight answers',
      heading: 'The questions coeliac clients actually ask.',
      lists: [
        {
          title: 'Certification and mixed menus',
          items: [
            'The kitchen is not certified gluten free, and I will not claim otherwise',
            'Documented protocols in a kitchen that also handles gluten',
            'If you need a certified facility I will say so rather than take the booking',
            'Mixed menus are most of what I do — GF portions prepped first, plated separately, covered',
          ],
        },
        {
          title: 'Equipment and staff',
          items: [
            'Nothing gluten free ever goes through shared oil',
            'Dedicated oil, or the dish is cooked another way',
            'Every person on the team is briefed on cross-contamination before service',
            'Serving staff are told by seat, not by tray',
          ],
        },
        {
          title: 'Transparency',
          items: [
            'Full ingredient lists for your menu on request, including brands',
            'If a dish is compromised in transport or on site, it does not go out',
            'I tell you why. That has been the rule for twelve years.',
          ],
        },
      ],
    },
    {
      type: 'quote',
      text: 'Thank you for your care, thoughtfulness and professionalism during this meaningful time for our family.',
      attribution: 'Two days of gluten-free catering, memorial · C & Family',
    },
  ],
  cta: {
    heading: 'Tell me who is coming and what they cannot eat.',
    body: 'Same enquiry form as everything else. Put the restriction in the message and I will answer that part first.',
  },
});

/** Listed on the Services index but built as its own page — it has a
 *  different audience and its own inquiry form. */
export const indexOnly = [
  {
    slug: 'gluten-free-consulting',
    title: 'Gluten-free consulting',
    summary: 'Menu development, kitchen protocol and staff training for restaurants, care facilities and food manufacturers.',
    imageSlot: 'jan-award',
    imageAlt: 'Chef Janet Wait with an award from the restaurant years',
  },
];

export const bySlug = (slug: string) => services.find((s) => s.slug === slug);

/** The contact form's Service dropdown, as [label, slug].
 *
 *  One list drives three things: the <select> options, the thank-you page the
 *  form redirects to on success, and the routes that page generates. Cloudflare
 *  Web Analytics strips query strings, so the slug in the path is what carries
 *  the attribution — /contact/thank-you/weddings is the conversion event.
 *
 *  "Not sure yet" is first so an untouched form reports honestly rather than
 *  silently attributing every direct visit to whatever happened to be first. */
/** Enquiry types with no page of their own. Wine pairing dinners live on the
 *  private-dining page now, but people still book them by name and the
 *  conversion split is worth keeping — the thank-you route comes from here. */
const extraEnquiryOptions: [string, string][] = [['Wine pairing dinners', 'wine-dinners']];

export const enquiryOptions: [string, string][] = [
  ['Not sure yet', 'not-sure'],
  ...services.map((s): [string, string] => [s.title, s.slug]),
  ...indexOnly.map((s): [string, string] => [s.title, s.slug]),
  ...extraEnquiryOptions,
];

// A duplicate slug would collapse two services onto one thank-you route and
// quietly merge their numbers. Fail the build instead.
const slugs = enquiryOptions.map(([, slug]) => slug);
if (new Set(slugs).size !== slugs.length) {
  throw new Error(`Duplicate enquiry slug in enquiryOptions: ${slugs.join(', ')}`);
}

/** Self-reported attribution. The offline options are the point — word of
 *  mouth and venue referrals are invisible to every analytics tool there is,
 *  and for this business they are probably the largest channels. */
export const heardFrom = [
  'Google or another search engine',
  'Instagram',
  'Facebook',
  'A friend or family recommendation',
  'My venue, planner or another vendor',
  "I knew Jan's on the Beach",
  'An event you catered',
  'Other',
];
