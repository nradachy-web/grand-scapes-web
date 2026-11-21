/* Google reviews, word for word, typos and all. These four are the ones his old
   site showed as screenshots of his Google listing (archived 2024-09-16). No
   words are changed. Names are first name and last initial, as Google shows them.
   More can be added from his listing once Rob shares access (OPEN-QUESTIONS.md).

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
  { id: 'rick-b', name: 'Rick B.', job: 'A 7 1/2 acre lawn, all year', services: ['lawn-mowing', 'landscape-maintenance', 'fall-cleanup', 'spring-cleanup', 'commercial'],
    text: 'Rob and his crew have been taking care of our 7 1/2 acre lawn all year.  I can not say enough good things about these guys.  They do a beautiful job, are very respectful of our property and are very careful to not let our dogs get out. I would highly recommend Grand Scapes.' },
  { id: 'stacy', name: 'Stacy', job: 'Weekly lawn care', services: ['lawn-mowing', 'landscape-maintenance', 'spring-cleanup'],
    text: 'Rob and his team have done a wonderful job on our lawn this season. We are so pleased! They are meticulous, they are on time each week and the couple of times that I needed to reach out to communicate, they are quick to respond. No problems whatsoever with this company.', excerpt: true, more: ' I would recommend them to anyone! Definitely give them a call if you are in need of lawn care!' },
  { id: 'bob-s', name: 'Bob S.', job: 'Bushes, a cherry tree and a bed redone', services: ['bush-removal', 'flower-beds', 'edging-walls', 'landscaping', 'shrub-trimming'],
    text: 'Rob and crew removed our 25 year-old bushes and cherry tree, re-scaped our flower bed and installed black mesh and new mulch. They also removed our old brick edging and replaced with a natural edge that still prevents chips from flowing into the lawn. They did a magnificent job and all in just two days.', excerpt: true, more: ' I HIGHLY recommend them to anyone wanting any type of landscaping done. Five big stars!' },
  { id: 'james-a', name: 'James A.', job: 'Landscape update around the home', services: ['landscaping', 'flower-beds', 'edging-walls', 'landscape-maintenance', 'grading-lawns'],
    text: "Grand Scapes did an amazing job updating my landscape around my home. They were on time, suggested what I needed to do to make it look great, quoted me a price and executed.  I've since referred Grand Scapes to other clients of mine and they to raved about the quality work they do.", excerpt: true, more: " I highly recommend them for all your needs.  They do amazing work.  Treat your property as if it's there own." },
];

export const review = (id: string) => REVIEWS.find((r) => r.id === id);
export const forService = (id: ServiceId, n = 3) => {
  const hits = REVIEWS.filter((r) => r.services.includes(id));
  return (hits.length >= n ? hits : [...hits, ...REVIEWS.filter((r) => !hits.includes(r))]).slice(0, n);
};
