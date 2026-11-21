/* The service registry: names, URLs and the one-line facts that the menu, cards
   and town pages share. Page copy lives in src/content.

   Every service here is backed by his old site (2024), his own photos or a
   Google review. Aeration, fertilizing, sod, gutters and power washing are not
   listed until Rob confirms them (see _source/private-docs/OPEN-QUESTIONS.md). */

import type { PhotoId } from './photos';

export type ServiceId =
  | 'lawn-mowing' | 'grading-lawns'
  | 'landscaping' | 'flower-beds' | 'edging-walls' | 'shrub-trimming' | 'bush-removal' | 'landscape-maintenance' | 'irrigation'
  | 'spring-cleanup' | 'fall-cleanup'
  | 'snow-removal' | 'salting' | 'commercial';

export type GroupId = 'lawn' | 'landscape' | 'seasons' | 'snow';

export interface Service {
  id: ServiceId;
  name: string;
  /** Short name for menus and chips. */
  short: string;
  /** Lower case, for use mid sentence. */
  noun: string;
  path: string;
  /** Slug used for the service-in-a-town pages: /{townSlug}-{city}-mi/. */
  townSlug: string;
  /** How the town page names it: "Lawn mowing in Fenton, MI". */
  townName: string;
  group: GroupId;
  photo: PhotoId;
  /** The full bleed photo band near the end of the page. */
  band: PhotoId;
  teaser: string;
  /** In the estimate form's quick picks. */
  pick?: boolean;
}

export const GROUPS: { id: GroupId; name: string; blurb: string; photo: PhotoId }[] = [
  { id: 'lawn', name: 'Lawn care', blurb: 'Weekly mowing finished in clean stripes, and new lawns graded and seeded from bare dirt.', photo: 'mower-stripes' },
  { id: 'landscape', name: 'Landscaping', blurb: 'Bed makeovers, block borders, mulch, trimming and the upkeep that keeps a front yard sharp.', photo: 'tree-bed-after' },
  { id: 'seasons', name: 'Spring and fall', blurb: 'Beds cleared, leaves vacuumed up and hauled off, and the yard reset for the season.', photo: 'leaf-vac' },
  { id: 'snow', name: 'Snow and ice', blurb: 'Driveways, walks and lots plowed and salted by our own trucks, homes and businesses.', photo: 'plow-fleet' },
];

const ALL: Service[] = [
  { id: 'lawn-mowing', name: 'Weekly lawn mowing', short: 'Lawn mowing', noun: 'lawn mowing', path: '/lawn-mowing/', townSlug: 'lawn-mowing', townName: 'Lawn mowing', group: 'lawn', photo: 'curve-stripes-colonial', band: 'crosscut-lawn', pick: true,
    teaser: 'Mowed, trimmed, edged and blown off on the same day every week, finished in clean stripes.' },
  { id: 'grading-lawns', name: 'Grading and new lawns', short: 'New lawns', noun: 'grading and new lawn work', path: '/grading-and-new-lawns/', townSlug: 'yard-grading', townName: 'Yard grading and new lawns', group: 'lawn', photo: 'deere-grading', band: 'straw-seed',
    teaser: 'Rough or bare ground shaped with our track loaders, then seeded and covered so it comes in even.' },
  { id: 'landscaping', name: 'Landscaping', short: 'Landscaping', noun: 'landscaping', path: '/landscaping/', townSlug: 'landscaping', townName: 'Landscaping', group: 'landscape', photo: 'stone-house-bed', band: 'block-bed-wide', pick: true,
    teaser: 'Old beds torn out and rebuilt: new shape, new border, new plants and a finish that lasts.' },
  { id: 'flower-beds', name: 'Mulch and flower bed makeovers', short: 'Mulch and beds', noun: 'mulch and flower bed work', path: '/mulch-and-flower-beds/', townSlug: 'mulch-installation', townName: 'Mulch installation', group: 'landscape', photo: 'block-bed-corner', band: 'tree-bed-drive', pick: true,
    teaser: 'Beds weeded, edged and laid with fabric and fresh mulch, black, brown or red.' },
  { id: 'edging-walls', name: 'Bed edging and block walls', short: 'Edging and walls', noun: 'bed edging and block wall work', path: '/bed-edging-and-block-walls/', townSlug: 'landscape-edging', townName: 'Landscape edging and block walls', group: 'landscape', photo: 'tree-bed-after', band: 'block-bed-front',
    teaser: 'Tired brick borders out, clean block walls, boulders or a cut natural edge in.' },
  { id: 'shrub-trimming', name: 'Shrub and hedge trimming', short: 'Shrub trimming', noun: 'shrub trimming', path: '/shrub-trimming/', townSlug: 'shrub-trimming', townName: 'Shrub and hedge trimming', group: 'landscape', photo: 'gazebo-hedges', band: 'stone-house-bed',
    teaser: 'Shrubs and hedges shaped back to clean lines, clippings raked out and hauled away.' },
  { id: 'bush-removal', name: 'Bush and small tree removal', short: 'Bush removal', noun: 'bush and small tree removal', path: '/bush-removal/', townSlug: 'bush-removal', townName: 'Bush and small tree removal', group: 'landscape', photo: 'kubota-dig', band: 'block-bed-wide',
    teaser: 'Overgrown bushes and small trees out, roots and all, so the bed can start over.' },
  { id: 'landscape-maintenance', name: 'Landscape maintenance', short: 'Bed upkeep', noun: 'landscape maintenance', path: '/landscape-maintenance/', townSlug: 'landscape-maintenance', townName: 'Landscape maintenance', group: 'landscape', photo: 'block-bed-colonial', band: 'tree-bed-after',
    teaser: 'Weeding, edging, trimming and touch ups through the season, so the beds stay finished.' },
  { id: 'irrigation', name: 'Irrigation', short: 'Irrigation', noun: 'irrigation work', path: '/irrigation/', townSlug: 'sprinkler-repair', townName: 'Sprinkler repair', group: 'landscape', photo: 'sprinkler-lawn', band: 'side-yard-stripes',
    teaser: 'Sprinkler repairs, new zones and seasonal service, so the lawn gets the water it needs.' },
  { id: 'spring-cleanup', name: 'Spring cleanup', short: 'Spring cleanup', noun: 'spring cleanup', path: '/spring-cleanup/', townSlug: 'spring-cleanup', townName: 'Spring cleanup', group: 'seasons', photo: 'block-bed-trailer', band: 'mulch-colonial', pick: true,
    teaser: 'Winter debris out, beds cleaned and edged, the first cut done, ready for mulch.' },
  { id: 'fall-cleanup', name: 'Fall cleanup and leaf removal', short: 'Leaf removal', noun: 'fall cleanup', path: '/fall-cleanup-and-leaf-removal/', townSlug: 'leaf-removal', townName: 'Fall cleanup and leaf removal', group: 'seasons', photo: 'leaf-vac', band: 'leaf-windrow', pick: true,
    teaser: 'Leaves vacuumed into our trailer and hauled away, beds cut back and the lawn left clean.' },
  { id: 'snow-removal', name: 'Snow removal and plowing', short: 'Snow plowing', noun: 'snow removal', path: '/snow-removal/', townSlug: 'snow-removal', townName: 'Snow removal', group: 'snow', photo: 'plow-deep', band: 'plow-fleet', pick: true,
    teaser: 'Driveways plowed by our own trucks through the winter, on a seasonal plan or per push.' },
  { id: 'salting', name: 'Salting and sidewalks', short: 'Salting', noun: 'salting and sidewalk clearing', path: '/salting-and-sidewalks/', townSlug: 'salting', townName: 'Salting and ice control', group: 'snow', photo: 'salt-spreader', band: 'walk-cleared',
    teaser: 'Walks and steps cleared, and salt down where people walk and cars stop.' },
  { id: 'commercial', name: 'Commercial grounds and snow', short: 'Commercial', noun: 'commercial grounds and snow work', path: '/commercial/', townSlug: 'commercial-snow-removal', townName: 'Commercial snow removal', group: 'snow', photo: 'commercial-lot', band: 'plow-fleet-2', pick: true,
    teaser: 'Lots, drives and walks plowed and salted, and the grounds mowed and kept, for businesses and HOAs.' },
];

/** Every service the content may name. Content validates against this list. */
export const ALL_SERVICES = ALL;
export const SERVICES = ALL;
export const service = (id: string) => SERVICES.find((s) => s.id === id)!;
export const inGroup = (g: GroupId) => SERVICES.filter((s) => s.group === g);
