# URLs

The old Grand Scapes site was one page (a Carrd site) with in-page anchors (`/#lawnservice`, `/#landscaping`, `/#irrigation`, `/#snowremoval`, `/#springandfallcleanups`, `/#apply`). Anchors never reach a server, so nothing needs a forward: `/` still answers.

Service pages: `/<service>/` (see `path` in `src/data/services.ts`). Town hubs: `/service-areas/<town>-mi/`. Service in a town: `/<townSlug>-<town>-mi/`, only where `MATRIX` in `src/data/cities.ts` says so.

Other pages: `/services/`, `/service-areas/`, `/our-work/`, `/plan-your-year/`, `/reviews/`, `/about/`, `/contact/`, `/get-an-estimate/`, `/careers/`, `/journal/` and `/journal/<slug>/`, `/privacy-policy/`. Not in the sitemap: `/thank-you/`, `/careers/thanks/`, `/404`.
