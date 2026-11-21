/* Every business fact in one place. A page never types a phone number, a rating
   or a link: it reads them from here. Sources are in _source/private-docs/FACTS.md. */

export const BRAND = {
  name: 'Grand Scapes',
  legalName: 'Grand Scapes LLC',
  owner: 'Rob Couchman',
  ownerFirst: 'Rob',
  phone: '(810) 990-3040',
  phoneHref: 'tel:+18109903040',
  smsHref: 'sms:+18109903040',
  phoneE164: '+18109903040',
  email: 'robandtiffany@grandscapesllc.com',
  /* The shop, as printed on his Google listing. */
  street: '8200 Embury Rd, Suite 3',
  city: 'Grand Blanc',
  state: 'MI',
  zip: '48439',
  geo: { lat: 42.9102775, lng: -83.6469148 },
  region: 'Genesee County',
  origin: 'https://grandscapesllc.com',
};

/* Read from his Google listing on 2026-11-21. The signed-out view shows the
   rating but not the count, so no count is printed until Rob confirms it. */
export const RATING = {
  value: '4.9',
  count: 0,
  countLabel: '',
  asOf: '2026-11-21',
};

export const LINKS = {
  google: 'https://www.google.com/maps/place/Grand+Scapes+LLC/data=!4m2!3m1!1s0x88237fc7f57bec0b:0xd5f2289471bf8b75',
  facebook: 'https://www.facebook.com/grandscapesllc',
  instagram: '',
};

/** The social links in the order they are shown, skipping any without an address. */
export const SOCIAL = [
  { name: 'Facebook', href: LINKS.facebook },
  { name: 'Instagram', href: LINKS.instagram },
].filter((s) => s.href);

/* Hours from the Google listing (Saturday read as 8 AM to 8 PM). */
export const HOURS = { open: '8 AM', note: 'Calls and texts from 8 AM' };

export const FORM = {
  /* Web3Forms key. Empty until the form is created and a real test arrives: an
     empty key shows the phone number instead of pretending to send. */
  key: import.meta.env.PUBLIC_WEB3FORMS_KEY ?? '',
  endpoint: 'https://api.web3forms.com/submit',
};

export const APPLY = {
  subject: 'New job application from grandscapesllc.com',
};

export const TRACKING = {
  /* The GA4 property his old site carried (archived copy, March 2025), kept so
     history carries over. Nick set it up in March 2024. */
  ga4: 'G-0PWXM5WCSH',
  host: 'grandscapesllc.com',
};
