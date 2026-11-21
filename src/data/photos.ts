/* The photo library. Every picture here is Rob's own: his job photos from the
   shared Drive folder (2021 to 2024) and a few that survive only in the archived
   copy of his old site. Color and light are corrected; nothing is added or moved,
   except house numbers, which are cloned out.

   The illustration panels (mowing patterns, seasons, reveals) use AI pictures that
   live in src/assets/panel and are always labeled as illustrations there.

   `alt` says what is in the frame; `caption` is what may be printed under it.
   Never caption a photo with a town: the jobs are not labeled by location.

   Add a photo: put the original in _source, add it to scripts/photos.py, run
   `npm run photos`, then describe it here. */

import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/*.jpg', { eager: true });
const byId: Record<string, ImageMetadata> = {};
for (const [path, mod] of Object.entries(files)) byId[path.split('/').pop()!.replace(/\.jpg$/, '')] = mod.default;

type Kind = 'real' | 'ai';
/** `focus` says where a fixed crop should anchor when the subject is not in the middle. */
interface Entry { alt: string; caption: string; kind?: Kind; focus?: 'top' | 'bottom' | 'left' | 'right' }

export const PHOTOS = {
  // lawns
  'mower-stripes': { alt: 'A zero turn mower parked on a big lawn freshly cut in light and dark stripes, under a blue sky', caption: 'Fresh stripes, mower still on the lawn' },
  'curve-stripes-colonial': { alt: 'Curved light and dark mowing stripes sweeping across a wide lawn in front of a white two story home', caption: 'Curved stripes on a wide front lawn' },
  'crosscut-lawn': { alt: 'A lawn mowed in a crosshatch of diagonal stripes, with evergreens behind', caption: 'A crosscut pattern, mowed in two directions' },
  'cul-de-sac-stripes': { alt: 'Curved mowing stripes following a driveway around a cul-de-sac lawn', caption: 'Stripes that follow the drive' },
  'ranch-stripes': { alt: 'Straight mowing stripes running across the front lawn of a gray ranch home', caption: 'Straight stripes on a ranch front lawn' },
  'side-yard-stripes': { alt: 'Arcing mowing stripes across a large side yard beside a two story home and its foundation beds', caption: 'Arcs across a big side yard' },
  'young-tree-stripes': { alt: 'Straight stripes running past a young tree toward a two story home', caption: 'Straight stripes past a young tree' },
  'deck-lawn': { alt: 'A shaded back lawn with faint stripes below a wood deck', caption: 'A back lawn below the deck' },
  'curb-edge': { alt: 'A lawn edged sharp along a concrete curb, with stripes in the grass', caption: 'Edged clean along the curb' },
  'walk-edge': { alt: 'A lawn edged in a straight line along a sidewalk, with stripes in the grass', caption: 'Edged straight along the walk' },
  'neighborhood-stripes': { alt: 'A front lawn with wide straight stripes beside a trimmed hedge and a sidewalk', caption: 'Wide stripes by the hedge' },
  'tree-line-stripes': { alt: 'Long straight stripes running across a big lawn toward a line of trees', caption: 'Long stripes toward the tree line' },
  'checker-close': { alt: 'A close view of a lawn mowed in a checkerboard pattern', caption: 'Checkerboard, up close' },
  'truck-trailer': { alt: 'A white pickup towing the Grand Scapes enclosed trailer, parked by a striped lawn', caption: 'Our truck and trailer on a job' },
  'fall-mowing': { alt: 'A crew member on a zero turn mower cutting a lawn in late fall, with bare trees behind', caption: 'A late season cut' },
  'fall-rider': { alt: 'A crew member driving a zero turn mower with a bagger along a driveway in fall', caption: 'Bagging the last cut of the fall' },
  // beds, borders and walls
  'tree-bed-after': { alt: 'A curved bed around a tree, finished in black mulch inside a new gray block wall along a walk', caption: 'A tree bed rebuilt with a block wall' },
  'tree-bed-drive': { alt: 'The same black mulch tree bed seen from the driveway, its block wall stepping down at the corner', caption: 'A block wall stepping down at the drive' },
  'block-bed-front': { alt: 'A front bed of black mulch and young perennials held by a gray block wall in front of a brick colonial', caption: 'A front bed in a new block wall' },
  'block-bed-colonial': { alt: 'A brick colonial with a long front bed of black mulch inside a low gray block wall', caption: 'A long front bed, black mulch and block' },
  'block-bed-wide': { alt: 'A wide view of a brick colonial with fresh black mulch beds in gray block walls and a green lawn', caption: 'The whole front, finished' },
  'block-bed-corner': { alt: 'A corner tree bed of black mulch inside a curved gray block wall beside a driveway', caption: 'A corner bed in a curved block wall' },
  'block-bed-trailer': { alt: 'A curved black mulch bed with a gray block border and a boulder, with our trailer at the curb behind it', caption: 'A finished bed, trailer still at the curb' },
  'block-bed-side': { alt: 'A curved side bed of black mulch and perennials inside a gray block border on a brick home', caption: 'A curved side bed in block' },
  'block-bed-door': { alt: 'A brick colonial with a fresh black mulch bed and gray block border running to the front door', caption: 'A fresh bed to the front door' },
  'stone-house-bed': { alt: 'A curved front bed of hostas, shrubs and dark mulch in front of a stone and brick home with a tall arched window', caption: 'A curved front bed with hostas' },
  'sign-bed': { alt: 'A Grand Scapes yard sign in a sweeping black mulch bed beside flowering shrubs and a striped lawn', caption: 'Our sign in a finished bed' },
  'mulch-colonial': { alt: 'A two story home with new curved beds of dark brown mulch along the walk and the front', caption: 'New beds along the front walk' },
  'gazebo-hedges': { alt: 'Clipped round shrubs and a low hedge beside a paver patio and a white gazebo', caption: 'Clipped shrubs by the patio' },
  // ground work
  'deere-grading': { alt: 'A compact track loader grading bare soil in front of a new two story home', caption: 'Grading a new build' },
  'kubota-dig': { alt: 'A compact track loader digging out old shrubs along the front of a home while a crew member works behind it', caption: 'Digging out old shrubs' },
  'straw-seed': { alt: 'A newly graded and seeded yard covered in straw beside a dark sided home', caption: 'New seed under straw' },
  'boulder-wall': { alt: 'A curved wall of large boulders holding a graded slope covered in straw below a deck', caption: 'A boulder wall on a new slope' },
  // leaves
  'leaves-before': { alt: 'A thick band of fallen leaves across a lawn in front of a white porch home with a blue metal roof', caption: 'Leaves down, before the cleanup' },
  'leaf-vac': { alt: 'A crew member running a truck mounted leaf vacuum hose over a pile of leaves at the curb', caption: 'Vacuuming leaves at the curb' },
  'leaf-trailer': { alt: 'A black dump trailer with a green leaf vacuum mounted on the front, parked in a driveway', caption: 'The leaf vacuum trailer' },
  'leaf-curb': { alt: 'A long pile of leaves at the curb with the leaf vacuum trailer behind it', caption: 'Leaves piled for the vacuum' },
  'leaf-loader': { alt: 'Leaves being pulled into the vacuum from a pile on the street', caption: 'Loading the leaves' },
  'leaf-pile': { alt: 'A tall pile of fallen leaves blown up in front of a garage', caption: 'A whole yard of leaves in one pile' },
  'leaf-windrow': { alt: 'A row of leaves blown to the edge of a lawn along a driveway, with the truck behind', caption: 'Leaves blown into a row' },
  'leaf-tree': { alt: 'Leaves gathered around a big tree in a front yard, with our trailer at the street', caption: 'Gathering leaves under the big tree' },
  'leaf-crew': { alt: 'A crew working a long pile of leaves on a lawn toward the trailer at the curb', caption: 'The crew working the pile' },
  'leaf-slope': { alt: 'Leaves blown down a sloped side yard beside a stone home', caption: 'Leaves off a sloped side yard' },
  // snow and ice
  'plow-fleet': { alt: 'Three white pickup trucks with snow plows lined up side by side on a gravel lot', caption: 'The plow trucks' },
  'plow-fleet-2': { alt: 'Three white plow trucks parked in a row, blades down, under bare trees', caption: 'Plows ready for the season' },
  'plow-drive': { alt: 'A white pickup with a plow at the end of a driveway after a light snow', caption: 'A plow truck on the route' },
  'plow-pair': { alt: 'Two white plow trucks with stainless blades in a driveway after a snowfall', caption: 'Two trucks on one drive' },
  'plow-lawn': { alt: 'Two white pickup trucks with plows parked by a snowy lawn', caption: 'Between pushes' },
  'drive-cleared': { alt: 'A plowed driveway down to wet concrete in front of a garage, with snow on either side', caption: 'A driveway plowed to the concrete' },
  'salt-spreader': { alt: 'A walk behind spreader full of blue ice melt on a cleared walk between snowbanks', caption: 'Ice melt going down on a walk' },
  'walk-cleared': { alt: 'A long sidewalk cleared of snow down to the concrete, with snowbanks on both sides', caption: 'A walk cleared to the concrete' },
  'plow-deep': { alt: 'A white pickup with a plow pushing through deep snow in a driveway', caption: 'Plowing after a heavy snow' },
  'commercial-lot': { alt: 'A plowed drive and parking area in front of a large three story building after snow', caption: 'A commercial lot after a push' },
  'salted-drive': { alt: 'A long driveway covered in blue ice melt in front of a home after snow', caption: 'A driveway treated with ice melt' },
  'plow-push': { alt: 'A plow truck pushing snow off a concrete driveway beside tall evergreens', caption: 'Clearing a drive by the evergreens' },
  // around the work
  'mulch-crew': { alt: 'A crew member shoveling dark mulch from a trailer into a wheelbarrow', caption: 'Loading mulch for the beds' },
  'rose-bed': { alt: 'A bed of dark mulch with red roses and evergreens edged in natural stone by a brick porch', caption: 'Roses and evergreens in a stone edged bed' },
  'kubota-trailer': { alt: 'A compact track loader working along the side of a home next to a dump trailer', caption: 'Out with the old plantings' },
  'sprinkler-lawn': { alt: 'A sprinkler head spraying across a striped lawn beside a large home', caption: 'A zone running on a striped lawn' },
  'sprinkler-walk': { alt: 'A sprinkler spraying the lawn along a curving walk in early fall', caption: 'Heads set to water the lawn, not the walk' },
  'sprinkler-trench': { alt: 'A narrow trench in the lawn with irrigation pipe in the bottom', caption: 'A new line going in' },
  'flower-urn': { alt: 'A stone urn of red begonias and tall grass on a patio', caption: 'Color in an urn' },
  'trailer-2023': { alt: 'The Grand Scapes truck and enclosed trailer parked on a residential street', caption: 'Truck and trailer, parked for the day' },
  // before and after frames
  'ba-drive-before': { alt: 'Before: a tree bed with an old brick border, weeds and overgrown perennials along a walk', caption: 'Before' },
  'ba-drive-after': { alt: 'After: the same tree bed in fresh black mulch inside a new gray block wall', caption: 'After' },
  'ba-front-before': { alt: 'Before: a crowded front bed with a red Japanese maple and an old brick border', caption: 'Before' },
  'ba-front-after': { alt: 'After: the same front bed opened up, in fresh black mulch inside a gray block wall', caption: 'After' },
} satisfies Record<string, Entry>;

export type PhotoId = keyof typeof PHOTOS;
export const PHOTO_IDS = Object.keys(PHOTOS) as [PhotoId, ...PhotoId[]];

export const photo = (id: PhotoId) => {
  const e = PHOTOS[id] as Entry;
  const src = byId[id];
  if (!src) throw new Error(`No file for photo ${id}: run npm run photos`);
  return { ...e, kind: e.kind ?? 'real', src };
};

export interface Pair { before: PhotoId; after: PhotoId; title: string; note: string; ratio?: number }

export const PAIRS = {
  'ba-drive': { before: 'ba-drive-before', after: 'ba-drive-after', title: 'Brick border out, block wall in', note: 'The weedy bed and the old brick edging came out. A gray block wall went in, stepping down at the walk, then fabric and black mulch.', ratio: 4 / 3 },
  'ba-front': { before: 'ba-front-before', after: 'ba-front-after', title: 'A crowded front bed, opened up', note: 'The old brick border came out for a gray block wall, the bed was cleaned out and opened up, and it was finished in black mulch.', ratio: 4 / 3 },
} satisfies Record<string, Pair>;
export type PairId = keyof typeof PAIRS;
