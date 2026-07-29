# Content Sprint 1 Preview Validation

## Validation target

- Verified at: `2026-07-29 22:29:19 +08:00`
- Commit: `90f65281c1d5e1dee7b6985e353097f1ddd24cf2`
- Immutable URL: `https://f78487d4.poxiol-site.pages.dev`
- Mode evidenced by output: Legacy fallback
- Sanity writes: `0`
- Published documents changed: `0`
## Required acceptance fields

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

## Result summary

| Check | Result | Evidence |
| --- | --- | --- |
| Immutable deployment identity | PASS | Cloudflare Pages Check Run and exact commit match |
| `/` route availability | PASS | HTTP 200; Draft rendering remains NOT VERIFIABLE |
| `/products/` route availability | PASS | HTTP 200; Draft rendering remains NOT VERIFIABLE |
| `/faq/` route availability | PASS | HTTP 200; Draft rendering remains NOT VERIFIABLE |
| `/manufacturing/` route availability | PASS | HTTP 200; Draft rendering remains NOT VERIFIABLE |
| `/factory/` route availability | PASS | HTTP 200; Draft rendering remains NOT VERIFIABLE |
| MVP Draft visibility fields effective | NOT VERIFIABLE | HTTP 404 is also explained by Legacy fallback |
| Authoritative `/products/soccer-jerseys/` | PASS | HTTP 200 |
| Draft article route coverage | FAIL | 25 of 35 affected routes return 404; the remaining 10 are Legacy-known routes |
| Draft replacement rendering | FAIL | Output follows Legacy fallback; Draft data is not verifiably consumed |
| `15-25 Days` risk removed in Draft Preview | NOT VERIFIABLE | No old phrase is visible, but Draft content is not loaded |
| `30,000+ units monthly` replacement | NOT VERIFIABLE | `/factory/` uses Legacy metadata, not the reviewed Draft |
| KIAN / EPSON replacement | NOT VERIFIABLE | The affected Draft FAQ is not rendered; absence is fallback, not proof |
| Sitemap excludes Draft/Preview URLs | PASS | 65 URLs; zero `draft`/`preview` URLs |
| MVP Draft sitemap suppression effective | NOT VERIFIABLE | Zero entries in fallback output does not prove Draft fields were consumed |
| `robots.txt` | PASS | HTTP 200, canonical sitemap present, no site-wide block |
| `llms.txt` | PASS | HTTP 200 and non-empty |
| FAQ visible/JSON-LD consistency | PASS | 22 FAQ entities; every question and answer is present visibly |
| Homepage FAQ visible/JSON-LD consistency | PASS | 7 FAQ entities; every question and answer is present visibly |
| Static email and WhatsApp paths | PASS | `mailto:` and `wa.me` present on tested core pages |
| GA4 `G-W5YLNQ39X1` | FAIL | Headless Chrome after hydration found neither the ID nor the gtag loader |
| Cloudflare Web Analytics | NOT VERIFIABLE | No beacon found on the Pages Preview; production behavior was not inferred |

## Procurement standards visible on homepage

The following Legacy-fallback values are present and internally consistent:

- `Sample MOQ: 1 set.`
- `Sample production: 2-3 working days after mockup approval.`
- `Bulk production: 7-12 working days after sample or artwork approval.`
- `Quality control: Inspection before shipment.`
- `Size tolerance: +/-2 cm.`
- `Mixed adult and youth sizes are supported.`

These checks validate the deployed fallback output only. They do not validate the reviewed Draft documents.

## Affected article coverage

- Blog: `0/20` affected routes returned 200.
- Guide/Resource: `10/15` affected routes returned 200.
- Total: `10/35` returned 200; `25/35` returned 404.
- The 10 successful routes are Legacy-known URLs and cannot prove Draft consumption.

## Decision

**Preview acceptance: FAIL**

**Controlled publish authorized by this validation: NO**

The deployment is healthy as a static Legacy fallback, but it is not a valid Draft Preview. Configure/recheck the branch Preview build environment, rebuild the same branch, and repeat all Draft-specific checks before publishing any of the 38 reviewed corrections.
