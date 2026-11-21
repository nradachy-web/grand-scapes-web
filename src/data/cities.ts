/* The towns. Grand Blanc is home, so its service pages ARE the main service
   pages. Every town gets a hub at /service-areas/<id>-mi/. A service-in-a-town
   page exists only where the matrix below says so: the matrix follows Keyword
   Planner demand (_source/research/keyword-demand.json, pulled 2026-11-21) and
   the services a town actually buys, so a full grid was deliberately not built.

   The towns are the ones within about 25 minutes of the shop on Embury Road.
   Rob has not confirmed the list yet (OPEN-QUESTIONS.md). */

import { SERVICES, service, type Service, type ServiceId } from './services';

export type Area = 'Grand Blanc and south' | 'Flint and west' | 'North and east' | 'Oakland County line';

export interface City {
  id: string;
  name: string;
  county: 'Genesee' | 'Oakland';
  area: Area;
  home?: boolean;
  /** Rough drive from the shop, minutes. Used in copy as "about N minutes". */
  minutes: number;
  /** Position on the area map, from real coordinates: x = west to east, y = north to south, 0 to 100. The shop sits at [45, 42]. */
  map: [number, number];
}

const ALL: City[] = [
  { id: 'grand-blanc', name: 'Grand Blanc', county: 'Genesee', area: 'Grand Blanc and south', home: true, minutes: 5, map: [49, 37] },
  { id: 'fenton', name: 'Fenton', county: 'Genesee', area: 'Grand Blanc and south', minutes: 20, map: [32, 76] },
  { id: 'linden', name: 'Linden', county: 'Genesee', area: 'Grand Blanc and south', minutes: 25, map: [15, 71] },
  { id: 'holly', name: 'Holly', county: 'Oakland', area: 'Oakland County line', minutes: 20, map: [49, 78] },
  { id: 'goodrich', name: 'Goodrich', county: 'Genesee', area: 'North and east', minutes: 20, map: [76, 40] },
  { id: 'ortonville', name: 'Ortonville', county: 'Oakland', area: 'Oakland County line', minutes: 25, map: [90, 60] },
  { id: 'clarkston', name: 'Clarkston', county: 'Oakland', area: 'Oakland County line', minutes: 30, map: [96, 95] },
  { id: 'flint', name: 'Flint', county: 'Genesee', area: 'Flint and west', minutes: 20, map: [36, 11] },
  { id: 'flint-township', name: 'Flint Township', county: 'Genesee', area: 'Flint and west', minutes: 20, map: [17, 14] },
  { id: 'mundy-township', name: 'Mundy Township', county: 'Genesee', area: 'Flint and west', minutes: 15, map: [26, 33] },
  { id: 'swartz-creek', name: 'Swartz Creek', county: 'Genesee', area: 'Flint and west', minutes: 25, map: [4, 28] },
  { id: 'burton', name: 'Burton', county: 'Genesee', area: 'North and east', minutes: 15, map: [52, 15] },
  { id: 'davison', name: 'Davison', county: 'Genesee', area: 'North and east', minutes: 20, map: [74, 5] },
];

/** Every town the content may name. Content validates against this list. */
export const ALL_CITIES = ALL;
export const CITIES = ALL;
export const city = (id: string) => CITIES.find((c) => c.id === id)!;
export const AREAS: Area[] = ['Grand Blanc and south', 'Flint and west', 'North and east', 'Oakland County line'];
export const inArea = (a: Area) => CITIES.filter((c) => c.area === a);
export const areaId = (a: Area) => a.toLowerCase().replace(/[^a-z]+/g, '-');
export const hubPath = (c: City) => `/service-areas/${c.id}-mi/`;
export const cityLabel = (c: City) => `${c.name}, MI`;

const AWAY = ['fenton', 'linden', 'holly', 'goodrich', 'ortonville', 'clarkston', 'flint', 'flint-township', 'mundy-township', 'swartz-creek', 'burton', 'davison'];

/** service id: towns that get their own page. */
export const MATRIX: Partial<Record<ServiceId, string[]>> = {
  'lawn-mowing': AWAY,
  'snow-removal': AWAY,
  'landscaping': AWAY,
  'fall-cleanup': AWAY,
  'flower-beds': ['fenton', 'flint', 'davison', 'clarkston', 'holly', 'goodrich', 'burton', 'swartz-creek'],
  'spring-cleanup': ['fenton', 'davison', 'clarkston', 'goodrich', 'holly', 'flint-township', 'mundy-township', 'burton'],
  'shrub-trimming': ['fenton', 'clarkston', 'davison', 'flint-township', 'burton'],
  'commercial': ['flint', 'burton', 'flint-township', 'fenton', 'davison'],
};

const slugFor = (s: Service, c: City) => `${s.townSlug}-${c.id}-mi`;

/** Every service and town pair that gets its own page. */
export const TOWN_PAGES = Object.entries(MATRIX).flatMap(([sid, ids]) =>
  (ids ?? []).filter((id) => CITIES.some((c) => c.id === id)).map((id) => {
    const s = service(sid), c = city(id);
    return { service: s, city: c, slug: slugFor(s, c), key: `${s.id}--${c.id}` };
  }),
);

/** The page for one service in one town, or the main service page when it has none. */
export function townPath(s: Service, c: City): string {
  return TOWN_PAGES.some((p) => p.service.id === s.id && p.city.id === c.id) ? `/${slugFor(s, c)}/` : s.path;
}
export const hasTownPage = (s: Service, c: City) => TOWN_PAGES.some((p) => p.service.id === s.id && p.city.id === c.id);
export const townsFor = (s: Service) => TOWN_PAGES.filter((p) => p.service.id === s.id).map((p) => p.city);
export const servicesIn = (c: City) => SERVICES.filter((s) => hasTownPage(s, c));
