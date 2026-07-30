# Content Sprint 1 Preview Validation

## Accepted Preview

- Environment: Cloudflare Pages Preview
- Branch: `feature/content-sprint-1-safe-published-fixes`
- Source commit: `0978c8d`
- Static Preview implementation commit: `16a0e092916e48bc81d1e619a54f5c394fe46326`
- Immutable URL: `https://00f11f97.poxiol-site.pages.dev`
- Content source: `sanity-preview`
- Sanity perspective: `drafts`
- Authentication: server-only Viewer token
- Production environment changed: no
- Published Sanity documents changed during validation: `0`

## Pages tested

All returned HTTP 200 and rendered successfully in headless Chrome:

- `/`
- `/products/`
- `/faq/`
- `/manufacturing/`
- `/guides/custom-teamwear-manufacturer-buying-guide/`
- `/guides/teamwear-quality-control-checklist/`
- `/guides/how-to-order-custom-basketball-uniforms/`
- `/blog/soccer-jersey-buying-guide/`
- `/resources/custom-teamwear-moq-production-time/`
- `/sitemap.xml`
- `/robots.txt`
- `/llms.txt`

## Content and risk validation

| Check | Result |
| --- | --- |
| `15-25 Days` absent from accepted scope | PASS |
| `30,000+ units` absent from accepted scope | PASS |
| `KIAN ink` absent from accepted scope | PASS |
| `EPSON print heads` absent from accepted scope | PASS |
| Sample MOQ is 1 set | PASS |
| Sample production is 2-3 working days after mockup approval | PASS |
| Bulk production is 7-12 working days after sample or artwork approval | PASS |
| QC uses inspection before shipment | PASS |
| Homepage size tolerance is +/-2 cm | PASS |

The manufacturing Draft needed one additional revision-guarded correction.
Only `drafts.67d89e7018894286` was patched; the Published revision was not
modified.

## MVP Soccer visibility

| Surface | Result |
| --- | --- |
| Products list | PASS - test category absent |
| Homepage | PASS - test category absent |
| Navigation | PASS - test category absent |
| Sitemap | PASS - no MVP document ID or MVP title |
| JSON-LD | PASS - test category absent |

Legitimate public URLs containing `soccer-kits` remain in the sitemap; they
are not the archived MVP category.

## SEO and structured data

- All five Batch 1 pages have a unique Title and Meta Description.
- Existing URLs and Canonicals are preserved for the three upgraded articles.
- The two new guide Canonicals use their approved new routes.
- BreadcrumbList and Article JSON-LD are present on all five article pages.
- Each page renders five visible related FAQs and five matching `FAQPage`
  entries.
- Homepage visible FAQ and JSON-LD match: 7 of 7.
- FAQ page visible FAQ and JSON-LD match: 22 of 22.
- No Draft-only URL is exposed through the Production sitemap.
- Preview responses carry `X-Robots-Tag: noindex`.

## Browser and security checks

- Nine page URLs rendered with Chrome Headless exit code 0.
- No observed `TypeError`, `ReferenceError` or uncaught browser exception.
- Preview HTML contains no `SANITY_READ_TOKEN` name.
- Preview loads no GA4 or GTM, by fail-closed design.
- Production continues to load GA4 `G-W5YLNQ39X1` once.
- Production continues to load Cloudflare Web Analytics once.

## Remaining gate

Draft Preview acceptance: **PASS**

Controlled Publish content gate: **PASS**

Controlled Publish execution: **BLOCKED**

The static Preview implementation, Portable Text table/callout renderer,
organization author schema handling and category visibility corrections are
not yet present in `main`. Publishing before those code changes are reviewed,
checked, merged and deployed could produce degraded Production rendering.
