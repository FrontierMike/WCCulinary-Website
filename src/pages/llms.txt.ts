// /llms.txt — the business in plain text, for language models that fetch it.
//
// llms.txt is a young convention, not a standard: some assistants read it,
// none promise to. It costs one small file, so it is here. Built from the same
// data the pages and the JSON-LD use, so it cannot drift from them. The
// booking lines are the one hand-written part — keep them in step with the
// shared answers in src/components/FAQ.astro.
//
// Facts only. Every line is something an assistant may repeat to a customer.
import type { APIRoute } from 'astro';
import { services, indexOnly } from '../data/services';
import { SITE, BUSINESS_NAME, PHONE, EMAIL, SERVICE_AREA } from '../lib/seo';

const page = (slug: string) => `${SITE}/${slug}/`;

const body = `# ${BUSINESS_NAME}

> Private chef and boutique catering by Red Seal chef Janet Wait, based in
> White Rock and South Surrey, British Columbia. For twelve years she owned
> and ran Jan's on the Beach, a restaurant in White Rock. She cooks every
> event herself, in the client's kitchen or at their venue.

## Services
${[...services, ...indexOnly]
  .map((s) => `- [${'serviceName' in s && s.serviceName ? s.serviceName : s.title}](${page(s.slug)}): ${s.summary}`)
  .join('\n')}

## Where
There is no storefront; the chef travels to the client. Based in White Rock, BC,
and serving the Lower Mainland: ${SERVICE_AREA.join(', ')}.

## Booking
- Pricing is per head and depends on the menu and the level of service. Every enquiry gets a written quote before anything is booked.
- Notice: two to three weeks for a private dinner; two to three months for weddings and larger events.
- Enquiries are answered personally within one business day.
- Alcohol is not supplied. Clients buy their own; the chef advises on what to buy and serves it.

## Contact
- Phone: ${PHONE.replace('+1-', '')}
- Email: ${EMAIL}
- [Request a quote](${page('contact')})

## More
- [About Chef Janet Wait](${page('about')})
- [Client reviews](${page('reviews')})
- [Photo gallery](${page('gallery')})
`;

export const GET: APIRoute = () =>
  new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
