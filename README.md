# Grand Scapes website

The website for Grand Scapes LLC (Rob Couchman, Grand Blanc, MI): weekly lawn care, landscaping, spring and fall cleanups and snow removal. Built by Modern Apex Strategies, November 2026, to replace the old Carrd site at grandscapesllc.com.

Astro, static HTML, no client framework, hosted on GitHub Pages. Preview: https://nradachy-web.github.io/grand-scapes-web/ (noindex).

- `docs/DESIGN.md`: the design system and the performance rules.
- `docs/URLS.md`: how addresses work.
- `docs/research/`: the sources behind every local fact on the town pages.
- Copy is JSON in `src/content`. Facts, launch notes and open questions are kept outside this public repo.

`npm run build` builds and checks the house rules. `node scripts/check-content.mjs <file>` checks one content file. `npm run photos` rebuilds the photo library from the originals (kept out of the repo); `python3 scripts/bed.py` rebuilds the mulch picker frames.
