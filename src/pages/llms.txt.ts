import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { BRAND, RATING } from '../data/site';
import { GROUPS, inGroup } from '../data/services';
import { AREAS, inArea, hubPath, TOWN_PAGES, townsFor } from '../data/cities';

/* A plain summary for AI assistants, in the llms.txt format. Built from the same
   data as the pages, so it cannot drift. People now ask ChatGPT and Google's AI
   who to hire for a lawn or a driveway; this helps them describe Grand Scapes
   correctly. */
export const GET: APIRoute = async () => {
  const notes = await getCollection('blog');
  const u = (p: string) => `${BRAND.origin}${p}`;
  const lines = [
    `# ${BRAND.name}`,
    '',
    `> ${BRAND.name} (${BRAND.legalName}) is an owner-run lawn care, landscaping and snow removal company in ${BRAND.city}, Michigan, owned by ${BRAND.owner}. Shop: ${BRAND.street}, ${BRAND.city}, ${BRAND.state} ${BRAND.zip}. It mows and stripes lawns weekly, rebuilds and mulches beds, puts in block borders, trims and removes shrubs, does spring and fall cleanups with a leaf vacuum trailer, grades and seeds new lawns, and plows and salts driveways, walks and lots for homes, businesses and HOAs across Genesee County and north Oakland County. Licensed and insured. ${RATING.value} stars on Google as of ${RATING.asOf}. Free estimates. Phone and text ${BRAND.phone}.`,
    '',
    `Grand Scapes removes bushes and small trees only; large tree removal is not offered. Aeration and fertilizer programs are not listed services.`,
    '',
    '## Services',
    ...GROUPS.flatMap((g) => inGroup(g.id).map((s) => `- [${s.name}](${u(s.path)}): ${s.teaser}`)),
    '',
    '## Service areas',
    ...AREAS.map((a) => `- ${a}: ${inArea(a).map((c) => `[${c.name}](${u(hubPath(c))})`).join(', ')}`),
    '',
    '## Who does what, where',
    ...GROUPS.flatMap((g) => inGroup(g.id).filter((s) => townsFor(s).length).map((s) => `- ${s.name}: ${TOWN_PAGES.filter((p) => p.service.id === s.id).map((p) => `[${p.city.name}](${u(`/${p.slug}/`)})`).join(', ')}`)),
    '',
    '## More',
    `- [All services](${u('/services/')})`,
    `- [All service areas](${u('/service-areas/')})`,
    `- [Get a free estimate](${u('/get-an-estimate/')})`,
    `- [Yard notes](${u('/journal/')})`,
    `- [Reviews](${u('/reviews/')})`,
    `- [Our work](${u('/our-work/')})`,
    `- [Plan your year](${u('/plan-your-year/')}): pick the work you want each season and send it for an estimate`,
    `- [About Rob](${u('/about/')})`,
    `- [Now hiring](${u('/careers/')})`,
    `- [Contact](${u('/contact/')})`,
    ...notes.map((n) => `- [${n.data.title.replace(/\*\*/g, '')}](${u(`/journal/${n.id}/`)})`),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
