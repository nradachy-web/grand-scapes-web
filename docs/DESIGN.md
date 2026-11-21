# Design: Clean lines

## The idea
Rob's work is lines. Fresh stripes in summer, a crisp bed edge in spring and fall, a driveway plowed down to the concrete in winter. The site opens on one of his real lawns, his zero turn still sitting on the fresh stripes, and the headline says the whole business: "Sharp lines, every season."

## Two planes and a swoosh
| Plane | Token | Use |
|---|---|---|
| Ink | `--ink` #0b0d0c, the logo black | Heroes, the interactive panels, proof, the estimate band, the footer |
| Paper | `--paper` #eff1ec, a cool clean concrete | Reading bands |
| White | `--white` #fafbf8 | A second light plane |

Where ink meets a light band they meet on the swoosh from Rob's logo (`Edge.astro`): a long curve rising to the right, carrying a crescent of mowed stripes in the logo's two greens. Use `has-edge` on the band above so the curve has room.

## One accent
Lawn lime `--lime` #84d455 on ink, with ink text on it. `--green` #0d7337 for buttons on paper (white text, 6:1). `--green-ink` for green text on paper. The two logo greens (`--stripe-a`, `--stripe-b`) appear only in stripes: the swoosh, the tick before every eyebrow, the swatches. A brushed chrome hairline sits under the header. Gold is for stars only.

## Type
Inter Tight, one variable family, upright and italic subsets (about 46 KB). Headlines at 740 to 780 with tight tracking; one phrase per heading in a heavy 820 italic, the racing slant of his lettering: `**like this**` in any heading. Sentence case.

## Motion
One page-load moment on the home page, "the first pass": a dark veil lifts off the photo, the words rise, then one soft band of light travels across the lawn the way a fresh stripe catches the sun. Opacity and transform only. Below that, motion answers the visitor. Nothing slides in on scroll. Reduced motion gets a still page.

## Signature panels
- **Pick your stripes** (`StripePicker.astro`): one front lawn in five patterns. AI illustrations made as edits of one base, so only the grass changes. Radio buttons and `:has()`, no script. "Ask Rob for this pattern" fills the estimate form.
- **Season Dial** (`SeasonDial.astro`): the same house in four seasons, opens on today's season.
- **Drag to reveal** (`RevealPanel.astro`): mow a shaggy lawn, clear the leaves, plow the drive.
- **Mulch picker** (`BedPicker.astro`, `scripts/bed.py`): one of Rob's real beds; brown and red change only the mulch pixels.
- **Before and after** (`BeforeAfter.astro`): two of his real bed rebuilds, aligned with SIFT and RANSAC (`scripts/photokit.py`).
- **Plan your year** (`/plan-your-year/`): pick the work for each season, send the plan to the form.
- **Area map** (`AreaMap.astro`): towns from real coordinates, I-75, US-23 and the shop.

## Photos: tell the truth about which is which
`src/data/photos.ts` holds only Rob's own photos: color corrected, house numbers cloned out, nothing else added or moved. The panels use AI illustrations from `src/assets/panel`, always tagged "Illustration". Never caption a photo with a town. Nick does not want a filterable gallery, expand icons or a modal viewer.

## Performance rules. These are why it scores.
- No client framework, no external stylesheet. CSS is inlined.
- The hero is art directed, preloaded by media query, `fetchpriority="high"`, never lazy.
- The logo is one small WebP per density, the same file on every page.
- Every image has width and height. Everything below the hero is lazy.
- Google Analytics waits for the first touch, scroll or key press, except ad visits and the thank-you page.
- No scroll-linked animation and no video on load.

## Answer engines
`robots.txt` welcomes the AI crawlers, `/llms.txt` is built from the same data as the pages, JSON-LD names the business, the shop, services, area and FAQ on every page, and pages open with the direct answer.
