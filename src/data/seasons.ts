/* A year with Grand Scapes: what the crew does to one yard, season by season.
   The Season Dial shows it on four pictures of the same house made one from the
   other, so they line up to the pixel. Every line here is a service on the site
   (see _source/private-docs/FACTS.md). */

export type SeasonId = 'spring' | 'summer' | 'fall' | 'winter';

export interface Season {
  id: SeasonId;
  name: string;
  /** Months, as a Michigan yard counts them. */
  months: string;
  /** Month numbers 1 to 12, for the year ribbon and for opening on today. */
  span: number[];
  title: string;
  items: string[];
  link: { label: string; path: string };
}

export const SEASONS: Season[] = [
  {
    id: 'spring',
    name: 'Spring',
    months: 'March to May',
    span: [3, 4, 5],
    title: 'Wake the yard up.',
    items: ['Spring cleanup: winter debris out, beds cleaned and edged', 'Fresh mulch where the beds look thin', 'Shrubs shaped before they take off', 'The first cuts of the year'],
    link: { label: 'Spring cleanup', path: '/spring-cleanup/' },
  },
  {
    id: 'summer',
    name: 'Summer',
    months: 'June to August',
    span: [6, 7, 8],
    title: 'Sharp, every single week.',
    items: ['Mowed, trimmed, edged and blown off on your day', 'Stripes the whole street can see', 'Beds weeded and kept tidy', 'New beds, block walls and installs'],
    link: { label: 'Weekly lawn mowing', path: '/lawn-mowing/' },
  },
  {
    id: 'fall',
    name: 'Fall',
    months: 'September to November',
    span: [9, 10, 11],
    title: 'Leaves out before the snow.',
    items: ['Leaves vacuumed into our trailer and hauled away', 'The last cuts of the year', 'Beds cut back and cleaned up', 'Shrubs tidied for winter'],
    link: { label: 'Fall cleanup and leaf removal', path: '/fall-cleanup-and-leaf-removal/' },
  },
  {
    id: 'winter',
    name: 'Winter',
    months: 'December to February',
    span: [12, 1, 2],
    title: 'Open when it snows.',
    items: ['Driveways plowed by our own trucks', 'Walks and steps cleared', 'Ice melt where people walk', 'Lots and drives for businesses and HOAs'],
    link: { label: 'Snow removal', path: '/snow-removal/' },
  },
];

export const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
