/* Check content files against the rules, without building the site.

     node scripts/check-content.mjs src/content/towns/sod-installation--troy.json
     node scripts/check-content.mjs            (every content file)

   It reads only the files you name (plus the others in the same folder, to
   catch copy that was pasted between town pages), writes nothing, and exits 1
   on any problem. Safe to run while other people are editing other files. */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'astro/zod';
import { makeSchemas } from '../src/content.schema.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

// ids, read from the data files so there is one source of truth
const photosTs = read('src/data/photos.ts');
const ids = {
  photos: [...photosTs.matchAll(/^\s*'?([a-z0-9-]+)'?: \{ alt:/gm)].map((m) => m[1]),
  pairs: [...photosTs.matchAll(/^\s*'([a-z-]+)': \{ before:/gm)].map((m) => m[1]),
  reviews: [...read('src/data/reviews.ts').matchAll(/\{ id: '([a-z0-9-]+)', name:/g)].map((m) => m[1]),
  services: [...read('src/data/services.ts').matchAll(/\{ id: '([a-z-]+)', name:/g)].map((m) => m[1]),
  cities: [...read('src/data/cities.ts').matchAll(/\{ id: '([a-z-]+)', name: '([^']+)'/g)].map((m) => m[1]),
};
const cityNames = Object.fromEntries([...read('src/data/cities.ts').matchAll(/\{ id: '([a-z-]+)', name: '([^']+)'/g)].map((m) => [m[1], m[2]]));
const homeCity = (read('src/data/cities.ts').match(/\{ id: '([a-z-]+)'[^}]*home: true/) || [])[1];
const servicesTs = read('src/data/services.ts');
const servicePaths = [...servicesTs.matchAll(/path: '([^']+)'/g)].map((m) => m[1]);
const townSlugs = [...servicesTs.matchAll(/townSlug: '([^']+)'/g)].map((m) => m[1]);

const schemas = makeSchemas(z, ids);

const blogDir = join(ROOT, 'src/content/blog');
const blogSlugs = existsSync(blogDir) ? readdirSync(blogDir).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, '')) : [];

// the matrix decides which service-in-a-town pages exist
const citiesTs = read('src/data/cities.ts');
const slugOf = Object.fromEntries([...servicesTs.matchAll(/\{ id: '([a-z-]+)', name: '[^']+', short: '[^']+', noun: '[^']+', path: '[^']+', townSlug: '([^']+)'/g)].map((m) => [m[1], m[2]]));
const AWAY = [...(citiesTs.match(/const AWAY = \[([^\]]+)\]/)?.[1] ?? '').matchAll(/'([a-z-]+)'/g)].map((m) => m[1]);
const matrixSrc = citiesTs.slice(citiesTs.indexOf('export const MATRIX'), citiesTs.indexOf('const slugFor'));
const matrix = [
  ...[...matrixSrc.matchAll(/'([a-z-]+)': \[([^\]]+)\]/g)].flatMap((m) => [...m[2].matchAll(/'([a-z-]+)'/g)].map((c) => [m[1], c[1]])),
  ...[...matrixSrc.matchAll(/'([a-z-]+)': AWAY/g)].flatMap((m) => AWAY.map((c) => [m[1], c])),
];
const validPaths = new Set([
  '/', '/services/', '/service-areas/', '/about/', '/contact/', '/get-an-estimate/', '/privacy-policy/', '/reviews/', '/our-work/', '/plan-your-year/', '/careers/', '/journal/',
  ...blogSlugs.map((s) => `/journal/${s}/`),
  ...servicePaths,
  ...ids.cities.map((c) => `/service-areas/${c}-mi/`),
  ...matrix.map(([s, c]) => `/${slugOf[s]}-${c}-mi/`),
]);

const FORBIDDEN = [
  [/[–—]/, 'an en or em dash'],
  [/\b(100%|every single|all) (five|5)[- ]star/i, 'a claim that every review is five stars'],
  [/#1\b|number one\b|\bthe best\b|\bbest (landscap|lawn|snow|in (michigan|genesee|town|the))|top[- ]rated|award[- ]winning|\bpremier\b|\bleading\b/i, 'a ranking or superlative claim'],
  [/guarantee(d|s)?\b|warrant(y|ies|ied)\b/i, 'a guarantee or warranty (not confirmed by Rob)'],
  [/\b(bonded|certified|accredited)\b/i, 'a bond or certification claim (only "licensed and insured" is sourced, from his own trailer)'],
  [/\bBBB\b|better business bureau/i, 'a BBB mention (profile not verified)'],
  [/\b(since (19|20)\d\d|\d+\+? years?( of|in| in) (experience|business)|(\d+|five|six|seven|eight)(th)? (seasons?|years?) in business|family[- ]owned|veteran[- ]owned|woman[- ]owned)\b/i, 'years in business or an ownership claim (not sourced)'],
  [/\$\s?\d/, 'a price (Rob does not publish prices)'],
  [/\b(cheap|cheapest|lowest price|unbeatable|affordable)\b/i, 'a price boast'],
  [/\baerat(e|ion|ing)\b|\bfertiliz|\bweed (control|and feed)|\bgrub control|\bpesticide|\bherbicide/i, 'aeration, fertilizing or weed control (not confirmed: OPEN-QUESTIONS)'],
  [/\bsod\b/i, 'sod (not confirmed: new lawns are seed and straw in his photos)'],
  [/\bgutter|power wash|pressure wash|deck stain|seal ?coat/i, 'gutters, washing or staining (not confirmed)'],
  [/landscape lighting|outdoor lighting|\blighting install/i, 'lighting (not confirmed)'],
  [/paver install|install(ing|s)? (new )?pavers|new (paver )?patio|patio install|build (a|your) patio|hardscap/i, 'paver, patio or hardscape installs (not confirmed)'],
  [/stump grind|large tree|tree removal service|tree service|\barborist/i, 'big tree work (only small trees are sourced)'],
  [/24\/7|around the clock|any time of (the )?(day|night)|\bzero tolerance\b/i, 'round the clock snow service (not confirmed)'],
  [/\b\d+(\.\d+)?[- ]?(inch|in\.|")( of snow)?[- ]trigger|trigger (depth )?(of|at) \d/i, 'a plow trigger depth (not confirmed)'],
  [/\b(free|free of charge) (estimate|quote)s?\b.*\b(today|same day|within)\b/i, 'a speed promise on estimates (not confirmed)'],
  [/\bsame[- ]day\b|\bwithin (an|one|\d+) (hour|day)s?\b|\b\d+[- ]hour response/i, 'a response time promise (not confirmed)'],
  [/lorem ipsum|TODO|TBD\b|XXX/i, 'placeholder text'],
  [/our (local|town) pages (cover|for)|we also have (local )?pages|this page (covers|is about)/i, 'talk about the website itself: write for the homeowner'],
  [/\b(our|we have|with) (a )?\d+[- ](person|man|member)\b|\b(\d+|two|three|four|five|six) (crews|trucks|plow trucks|employees|plows)\b/i, 'a crew or fleet size (not sourced)'],
  [/\bMisty|\bHD Landscape|\bCAMP\b|\bNelligan/i, 'another company by name'],
];

const strings = (node, out = []) => {
  if (typeof node === 'string') out.push(node);
  else if (Array.isArray(node)) node.forEach((n) => strings(n, out));
  else if (node && typeof node === 'object') Object.values(node).forEach((n) => strings(n, out));
  return out;
};
const sentences = (s) =>
  s
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*/g, '')
    .split(/(?<=[.!?])\s+/)
    .map((x) => x.trim())
    .filter((x) => x.length >= 70);

const args = process.argv.slice(2);
const kinds = ['services', 'towns', 'cities', 'blog'];
const all = kinds.flatMap((k) => {
  const dir = join(ROOT, 'src/content', k);
  return existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => join(dir, f)) : [];
});
const targets = args.length ? args.map((a) => resolve(a)) : all;

let failed = 0;
for (const file of targets) {
  const problems = [];
  const warn = [];
  const kind = basename(dirname(file));
  const name = basename(file, '.json');
  let data;
  try {
    data = JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    console.log(`FAIL ${file}\n  not valid JSON: ${e.message}`);
    failed++;
    continue;
  }
  if (!schemas[kind]) {
    console.log(`FAIL ${file}\n  not inside src/content/{services,towns,cities,blog}`);
    failed++;
    continue;
  }
  const parsed = schemas[kind].safeParse(data);
  if (!parsed.success) for (const issue of parsed.error.issues) problems.push(`${issue.path.join('.')}: ${issue.message}`);

  // file name agrees with what is inside
  if (kind === 'services' && data.service !== name) problems.push(`file is ${name}.json but service is "${data.service}"`);
  if (kind === 'cities' && data.city !== name) problems.push(`file is ${name}.json but city is "${data.city}"`);
  if (kind === 'towns' && `${data.service}--${data.city}` !== name) problems.push(`file is ${name}.json but inside it says ${data.service}--${data.city}`);
  // the file name is the post's address
  if (kind === 'blog' && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) problems.push(`file name ${name}.json is not a clean address (lower case words joined by single hyphens)`);
  if (kind === 'blog' && data.title && !data.title.includes('**')) warn.push('title has no ** accent phrase');

  const texts = strings(data);
  const joined = texts.join('\n');

  for (const [re, what] of FORBIDDEN) {
    const m = joined.match(re);
    if (m) problems.push(`contains ${what}: "…${joined.slice(Math.max(0, m.index - 30), m.index + 40).replace(/\s+/g, ' ')}…"`);
  }

  // links
  for (const m of joined.matchAll(/\]\(([^)\s]+)\)/g)) {
    const url = m[1];
    if (/^(tel:\+18109903040|sms:\+18109903040|#quote)$/.test(url)) continue;
    if (/^https?:/.test(url)) {
      problems.push(`outside link ${url}: link only to pages on this site`);
      continue;
    }
    if (!validPaths.has(url)) problems.push(`link to ${url}, which is not a page on this site`);
  }

  // town and city pages must name the town where a search looks for it
  const town = cityNames[data.city];
  if ((kind === 'towns' || kind === 'cities') && town) {
    if (!data.meta?.title?.includes(town)) problems.push(`meta.title does not name ${town}`);
    if (!data.hero?.kicker?.includes(town)) problems.push(`hero.kicker does not name ${town}`);
    const words = joined.split(/\s+/).length;
    if (words < 420) problems.push(`only ${words} words: too thin to be worth a page`);
    if (!/Grand Scapes/.test(data.hero?.lede ?? '')) problems.push('hero.lede does not name Grand Scapes');
    const first = data.faq?.[0];
    if (first && (!first.q.includes(town) || !/Grand Scapes/.test(first.a))) problems.push(`the first FAQ must ask about ${town} by name and its answer must name Grand Scapes`);
    for (const f of data.faq ?? []) {
      if (new RegExp(`\\b(my|our) ${town}\\b`).test(f.q)) problems.push(`FAQ uses the town as an adjective: "${f.q}"`);
    }
    if ((data.logistics?.facts ?? []).some((f) => /^county$/i.test(f.label))) problems.push('the County fact tells a homeowner nothing: replace it');
    const mentions = (joined.match(new RegExp(town, 'g')) || []).length;
    if (mentions > 22) warn.push(`${town} is named ${mentions} times: reads stuffed, cut some`);
  }

  // copy pasted between pages of the same kind
  if (kind !== 'services') {
    const mine = new Set(texts.flatMap(sentences));
    const dir = dirname(file);
    for (const other of readdirSync(dir).filter((f) => f.endsWith('.json') && join(dir, f) !== file)) {
      let theirs;
      try {
        theirs = strings(JSON.parse(readFileSync(join(dir, other), 'utf8'))).flatMap(sentences);
      } catch {
        continue;
      }
      const shared = theirs.filter((s) => mine.has(s));
      if (shared.length) problems.push(`${shared.length} sentence(s) identical to ${other}, e.g. "${shared[0].slice(0, 90)}…"`);
    }
  }

  if (problems.length) {
    failed++;
    console.log(`FAIL ${file}\n` + problems.map((p) => '  ' + p).join('\n'));
  } else {
    console.log(`ok   ${file}`);
  }
  if (warn.length) console.log(warn.map((w) => '  note: ' + w).join('\n'));
}
process.exit(failed ? 1 : 0);
