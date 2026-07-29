# Content Sprint 1 Preview Validation

## Initial validation target (historical)

- Verified at: `2026-07-29 22:29:19 +08:00`
- Commit: `90f65281c1d5e1dee7b6985e353097f1ddd24cf2`
- Immutable URL: `https://f78487d4.poxiol-site.pages.dev`
- Mode evidenced by output: Legacy fallback
- Sanity writes: `0`
- Published documents changed: `0`
## Initial fallback observations (historical)

- Preview Method: Cloudflare Pages branch static export
- Preview URL: `https://f78487d4.poxiol-site.pages.dev`
- Authentication: Required for Draft reads, but the deployed output proves the Draft path was unavailable
- Pages Tested: `/`, `/products/`, `/faq/`, `/manufacturing/`, `/factory/`, all 35 affected article routes, sitemap, robots and llms
- Homepage: Route availability PASS; Draft rendering NOT VERIFIABLE
- Products: Route availability PASS; Draft rendering NOT VERIFIABLE
- FAQ: Fallback visible/JSON-LD consistency PASS; reviewed Draft replacement NOT VERIFIABLE
- Manufacturing: Route availability PASS; Draft rendering NOT VERIFIABLE
- `15–25 Days`: NOT VERIFIABLE in Draft Preview
- `30,000+ units`: NOT VERIFIABLE in Draft Preview
- KIAN: NOT VERIFIABLE in Draft Preview
- EPSON: NOT VERIFIABLE in Draft Preview
- Procurement Standards: PASS in Legacy fallback only
- MVP Soccer Visibility: NOT VERIFIABLE as a Draft-specific effect
- JSON-LD: PASS for fallback content; Draft-specific consistency NOT VERIFIABLE
- Sitemap Impact: PASS for fallback output; Draft-specific impact NOT VERIFIABLE
- GA4: FAIL on this Pages Preview
- Remaining Issues: Rebuild with `sanity-preview` and the server-only read token, then repeat validation.

## Authenticated Preview Revalidation

- Revalidated at: `2026-07-29`
- Commit: `01f2bcf230468fa660f0c74b627f466c4932477d`
- Preview URL: `https://33b1a0d6.poxiol-site.pages.dev`
- Environment: Cloudflare Pages Preview
- Content Source: `sanity-preview`
- Draft Data Source: Sanity `production` dataset, `drafts` perspective
- Missing Variable: None
- Missing Token: No. A Viewer-only secret is configured for Preview only.
- Production Environment Changed: No
- Build Log Error: None. Build and deploy stages reported success.
- Build Evidence: 158 generation inputs/build routes, including previously absent CMS-only Draft article routes.
- Deployment Result: Core HTML routes return the Next.js 404 shell; public static files such as `robots.txt` and `llms.txt` remain available.

The build route table classifies the core App Router pages as dynamic (`ƒ`). The Preview client uses `cache: no-store`, while the project uses Next.js `output: export`. The authenticated Draft reads therefore make the pages dynamic and prevent their HTML from being emitted into the static `out/` deployment.

This is an architecture incompatibility, not a missing Cloudflare variable or a failed Sanity authentication. Fixing it requires a separately approved code change to make the build-time Preview path compatible with static export. No such code change was made in this validation stage.

Current Draft Validation: **FAIL**

Current Ready for Controlled Publish: **NO**

## Current acceptance result (`33b1a0d6`)

| Check | Result | Evidence |
| --- | --- | --- |
| Immutable deployment identity | PASS | Cloudflare Pages Preview deployment matches commit `01f2bcf230468fa660f0c74b627f466c4932477d` |
| Authenticated Draft build evidence | PASS | Build processed 158 generation inputs/build routes and discovered CMS-only Draft article routes |
| `/` route availability | FAIL | HTTP 404; Next.js 404 shell |
| `/products/` route availability | FAIL | HTTP 404; Next.js 404 shell |
| `/faq/` route availability | FAIL | HTTP 404; Next.js 404 shell |
| `/manufacturing/` route availability | FAIL | HTTP 404; Next.js 404 shell |
| `/factory/` route availability | FAIL | HTTP 404; Next.js 404 shell |
| Affected article route availability | FAIL | Tested Draft article routes return HTTP 404 |
| `/sitemap.xml` | FAIL | HTTP 404; no current Preview sitemap can be validated |
| `robots.txt` | PASS | HTTP 200, canonical sitemap present, no site-wide block |
| `llms.txt` | PASS | HTTP 200 and non-empty |
| Draft replacement rendering | NOT VERIFIABLE | Core rendered routes are unavailable |
| `15–25 Days` risk removed in Draft Preview | NOT VERIFIABLE | Core rendered routes are unavailable |
| `30,000+ units monthly` replacement | NOT VERIFIABLE | Core rendered routes are unavailable |
| KIAN / EPSON replacement | NOT VERIFIABLE | Core rendered routes are unavailable |
| Procurement Standards | NOT VERIFIABLE | Homepage is unavailable |
| MVP Draft visibility fields effective | NOT VERIFIABLE | Core routes and sitemap are unavailable; 404 is not proof of selective suppression |
| SEO / canonical / breadcrumb | NOT VERIFIABLE | Core rendered routes are unavailable |
| FAQ visible/JSON-LD consistency | NOT VERIFIABLE | FAQ route is unavailable |
| GA4 `G-W5YLNQ39X1` | NOT VERIFIABLE | Core rendered routes are unavailable |
| Cloudflare Web Analytics | NOT VERIFIABLE | Core rendered routes are unavailable |

## Historical fallback deployment result (`f78487d4`)

The initial immutable Preview deployment returned HTTP 200 for the core routes, but its output was Legacy fallback. It is retained only as historical evidence that the previous Preview build did not consume Draft data. Its route, FAQ/JSON-LD, sitemap, contact-link and analytics observations are not the current acceptance result.

## Historical procurement standards visible on homepage

The following Legacy-fallback values are present and internally consistent:

- `Sample MOQ: 1 set.`
- `Sample production: 2-3 working days after mockup approval.`
- `Bulk production: 7-12 working days after sample or artwork approval.`
- `Quality control: Inspection before shipment.`
- `Size tolerance: +/-2 cm.`
- `Mixed adult and youth sizes are supported.`

These checks validate the deployed fallback output only. They do not validate the reviewed Draft documents.

## Historical affected article coverage

- Blog: `0/20` affected routes returned 200.
- Guide/Resource: `10/15` affected routes returned 200.
- Total: `10/35` returned 200; `25/35` returned 404.
- The 10 successful routes are Legacy-known URLs and cannot prove Draft consumption.

## Decision

**Preview acceptance: FAIL**

**Controlled publish authorized by this validation: NO**

The current Preview environment and Viewer-only token are correctly configured, and authenticated Draft reads are evidenced during the build. The remaining blocker is architectural: `cache: no-store` makes the App Router pages dynamic while the deployment requires static `output: export`. A separately approved static-export-compatible Preview implementation is required before repeating Draft-specific checks or publishing any of the 38 reviewed corrections.
