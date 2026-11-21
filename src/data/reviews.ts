/* Google reviews, word for word, typos and all. Five were read from his Google
   listing with the Places API on 2026-11-21 (_source/research/details_*.json);
   four are the ones his old site showed as screenshots (archived 2024-09-16).
   No words are changed. A long review may be cut at a sentence end and is then
   marked `excerpt`; two are cut before a sentence with a long dash, which the
   site's style never prints. Names are first name and last initial.

   Nothing on the site says "every review is five stars". */

import type { ServiceId } from './services';

export interface Review {
  id: string;
  name: string;
  text: string;
  excerpt?: boolean;
  /** The rest of the review, for the reviews page. */
  more?: string;
  /** What the job was, in the review's own terms. */
  job: string;
  services: ServiceId[];
}

export const REVIEWS: Review[] = [
  { id: 'reckless-cards', name: 'Reckless Cards', job: 'Trees trimmed, bushes out, mulch, topsoil and seed', services: ['shrub-trimming', 'bush-removal', 'landscape-maintenance', 'flower-beds', 'grading-lawns', 'landscaping'],
    text: 'We had an absolutely fantastic experience from start to finish. During our initial walkthrough, they listened carefully, took notes, offered great suggestions, and had a quote back to us quickly. Once the work started, the communication was outstanding. They kept us informed throughout the entire process and always asked for our approval before moving forward with anything additional.', excerpt: true },
  { id: 'mark-v', name: 'Mark V.', job: 'Beds, an irrigation line and new plants', services: ['landscaping', 'flower-beds', 'irrigation', 'landscape-maintenance', 'spring-cleanup'],
    text: 'Rob and his team did an exceptional job on my landscaping. They cleaned up my flower beds, fixed an irrigation line, mulched, and planted a Japanese Maple, grasses, and perennials.', excerpt: true },
  { id: 'rick-b', name: 'Rick B.', job: 'A 7 1/2 acre lawn, all year', services: ['lawn-mowing', 'landscape-maintenance', 'fall-cleanup', 'spring-cleanup', 'commercial'],
    text: 'Rob and his crew have been taking care of our 7 1/2 acre lawn all year.  I can not say enough good things about these guys.  They do a beautiful job, are very respectful of our property and are very careful to not let our dogs get out. I would highly recommend Grand Scapes.' },
  { id: 'stacy', name: 'Stacy', job: 'Weekly lawn care', services: ['lawn-mowing', 'landscape-maintenance', 'spring-cleanup'],
    text: 'Rob and his team have done a wonderful job on our lawn this season. We are so pleased! They are meticulous, they are on time each week and the couple of times that I needed to reach out to communicate, they are quick to respond. No problems whatsoever with this company.', excerpt: true, more: ' I would recommend them to anyone! Definitely give them a call if you are in need of lawn care!' },
  { id: 'bob-s', name: 'Bob S.', job: 'Bushes, a cherry tree and a bed redone', services: ['bush-removal', 'flower-beds', 'edging-walls', 'landscaping', 'shrub-trimming'],
    text: 'Rob and crew removed our 25 year-old bushes and cherry tree, re-scaped our flower bed and installed black mesh and new mulch. They also removed our old brick edging and replaced with a natural edge that still prevents chips from flowing into the lawn. They did a magnificent job and all in just two days.', excerpt: true, more: ' I HIGHLY recommend them to anyone wanting any type of landscaping done. Five big stars!' },
  { id: 'kandice-w', name: 'Kandice W.', job: 'Bigger landscape jobs, twice', services: ['landscaping', 'edging-walls', 'flower-beds', 'bush-removal'],
    text: "This is our 2nd time using Grandscapes for the bigger landscape jobs we've needed done around the house. (see before and afters)  Rob and his crew have always been very kind, curtious, punctual, and professional. Rob goes the extra mile to make sure his customers are happy (which i approciate bc i can be very particular) hes very knowledgeable and pays attention to detail.", excerpt: true, more: ' He is resonable on price and not pushy in any way.   We have a few more jobs that need done around the yard and will definitely use Grand Scapes for future projects.' },
  { id: 'jason-p', name: 'Jason P.', job: 'A two day fix for a wet yard', services: ['grading-lawns', 'landscaping'],
    text: 'I don’t do this typically but I wanted to take a minute and give Rob and his team at Grand Scapes a shout out for an amazing experience! As you all know the water is getting pretty crazy around our neck of the woods and our yard was no exception. We started looking for solutions and from the moment we met his team, Grand Scapes was amazing. As I sit watching them finish the two day project, I am so thankful that we selected them. They were courteous, polite and friendly to myself, family, and neighbors.', excerpt: true, more: ' Their work went beyond my expectations from start to finish and I could not be happier. If you are looking for a recommendation for work on your property, know that they come highly recommended from the Poirier family! Thank you Rob and crew for a wonderful job done!' },
  { id: 'stephanie-s', name: 'Stephanie S.', job: 'House and poolside landscaping', services: ['landscaping', 'flower-beds'],
    text: 'Rob and his crew were fantastic!  They have transformed our house and poolside area.  We are beyond thrilled with the landscaping & couldn’t recommend them more!' },
  { id: 'james-a', name: 'James A.', job: 'Landscape update around the home', services: ['landscaping', 'flower-beds', 'edging-walls', 'landscape-maintenance', 'grading-lawns'],
    text: "Grand Scapes did an amazing job updating my landscape around my home. They were on time, suggested what I needed to do to make it look great, quoted me a price and executed.  I've since referred Grand Scapes to other clients of mine and they to raved about the quality work they do.", excerpt: true, more: " I highly recommend them for all your needs.  They do amazing work.  Treat your property as if it's there own." },
];

export const review = (id: string) => REVIEWS.find((r) => r.id === id);
export const forService = (id: ServiceId, n = 3) => {
  const hits = REVIEWS.filter((r) => r.services.includes(id));
  return (hits.length >= n ? hits : [...hits, ...REVIEWS.filter((r) => !hits.includes(r))]).slice(0, n);
};
