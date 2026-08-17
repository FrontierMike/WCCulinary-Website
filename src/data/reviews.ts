// Reviews, split by where they were earned.
//
// Format is [quote, caption]. Catering captions name the event and the town;
// restaurant captions name the year, so the two read differently even when a
// quote is pulled out on its own elsewhere on the site.
//
// WRAP PASTED REVIEWS IN BACKTICKS, not 'single quotes'. Real reviews are full
// of apostrophes ("we've", "Jan's") and every one of them ends a single-quoted
// string early and breaks the build. Backticks don't care:
//
//   [`We've eaten here for years — "the best on the coast", my dad calls it.`,
//    `Dinner service · 2016`],
//
// The only characters backticks mind are a backtick and a literal ${, neither
// of which turns up in a restaurant review.

/** Catering and private dining — the current business. */
export const catering: [string, string][] = [
  // PLACEHOLDER. These six are the design's stand-in copy — replace with real,
  // attributable reviews before launch. See the README's before-launch list.
  ['She fed sixty people in a hall with no real kitchen and it came out like a restaurant. Two guests asked for her card before dessert.',
   'Wedding, sixty guests · Crescent Beach'],
  ['We book her for the same client dinner every quarter now. It arrives when she says it will and there has never been a correction to the invoice.',
   'Corporate client dinner · South Surrey'],
  ['Eight of us at our own table, four courses, and my wife did not stand up once all evening. That was the actual gift.',
   'Anniversary dinner at home · White Rock'],
  ['My daughter has coeliac disease. It is the first catered dinner where I did not have to watch her plate all night.',
   'Fiftieth birthday · Ocean Park'],
  ['She talked us out of the menu we asked for and into a better one, and she was right. That is worth more than being agreeable.',
   'Wedding, forty guests · Langley'],
  ['The kitchen was cleaner when she left than when she arrived. I keep telling people that and they keep not believing me.',
   'Private dinner for ten · South Surrey'],
];

/** Jan's on the Beach. Same chef, same suppliers, different room.
 *  Paste as many as you want — the page counts them itself and they load as
 *  you scroll, so a long list costs nothing until someone scrolls into it. */
export const restaurant: [string, string][] = [
  // PLACEHOLDER — real ones go here.
  ['Best meal we have had on this side of the water. We drove out from Vancouver on a friend’s word and we were not sorry.',
   'Dinner service · 2016'],
  ['My husband cannot eat gluten and he ordered off the same menu as the rest of us. He still talks about it.',
   'Dinner service · 2018'],
  ['Twelve years of Friday nights here. Never once a bad plate.',
   'Regular · 2009–2021'],
];

/** What the restaurant actually earned, not what is published below it.
 *  Only the honest total belongs here — it is the claim doing the persuading. */
export const restaurantTotal = 'over a thousand five-star reviews';
