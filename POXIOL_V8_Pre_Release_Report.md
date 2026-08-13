# POXIOL V8 Pre-Release Report

Date: 2026-08-12
Branch: `feature/poxiol-v8-growth-upgrade`
Status: Phase 6 audit complete; no commit, push, PR, merge or deployment performed.

## 1. Complete Page Inventory

| Page | V8 role | Primary conversion path | Audit status |
| --- | --- | --- | --- |
| `/` | Main B2B teamwear sales funnel | Free Mockup / Sample / Quote | Pass |
| `/products/basketball-uniforms/` | Only approved primary basketball commercial landing page | Free Mockup / Sample | Pass |
| `/youth-team-uniforms/` | Youth team manager landing page | Free Mockup | Pass |
| `/school-teamwear/` | School and academy landing page | School solution / Sample | Pass |
| `/club-teamwear-program/` | Multi-team club program landing page | Club program / Sample | Pass |
| `/private-label-teamwear/` | Sports brand and distributor OEM landing page | Quote | Pass |
| `/customization/` | Design and customization journey | Free Mockup / Manufacturing / Quote | Pass |
| `/factory/` | POXIOL identity and manufacturing capability | Manufacturing / QC / Inquiry | Pass |
| `/manufacturing/` | Production process authority page | QC / Sample / Inquiry | Pass |
| `/quality-control-process/` | Quality authority page | Sample / Quote | Pass |
| `/free-mockup/` | Early design-interest entry | Free Mockup form | Pass |
| `/get-quote/` | Project quotation entry | Quote form | Pass |
| `/sample-order/` | High purchase-intent sample entry | Sample form | Pass |
| `/contact/` | General inquiry entry | General inquiry form | Pass |

All 14 pages were checked from the final static output. Each has one H1, a self-referencing canonical, working internal links, no document-level horizontal overflow and an accessible conversion path.

## 2. Architecture Summary

- `lib/v8` is the shared source for brand positioning, buyers, processes, CTAs, FAQs, page configuration, verified media rules and lead classification.
- `components/v8` provides configurable Hero, buyer, design, manufacturing, QC, FAQ, CTA, buyer-page, authority-page and qualification-form compositions.
- Homepage, buyer pages, basketball, trust pages and conversion pages consume shared V8 data rather than maintaining separate business rules.
- Sanity fields remain available. V8 code overlays only the release-critical facts, metadata and media-safety behavior.
- CMS production media requires `verified === true`, a valid URL and Alt Text for images. Missing or unverified media displays `Verified production visual pending`.

## 3. SEO Status

### Passed

- Canonical audit: 75 audited routes, 0 failures.
- Missing canonicals: 0.
- Duplicate canonicals: 0.
- Missing H1: 0.
- Duplicate H1: 0.
- Sitemap: 74 unique URLs; all 14 V8 pages included.
- Organization and WebSite Schema preserved on the Homepage.
- FAQ visible questions and FAQPage Schema use the same page data on every audited FAQ page.
- Basketball page outputs one BreadcrumbList, one Product, one Service and one FAQPage structure.
- Product Schema no longer publishes unverified `InStock` or fixed MOQ data.
- `/custom-basketball-uniforms/` has a Cloudflare 301 to `/products/basketball-uniforms/`, a matching no-JavaScript fallback link and is excluded from the Sitemap.
- `/custom-basketball-uniform-manufacturer/` and `/production-process/` do not exist.
- The remaining V8 basketball commercial link found in Week 3 guide data now points to `/products/basketball-uniforms/`.
- Factory, Manufacturing and Quality Control now have distinct intent-specific titles and descriptions while preserving their canonical URLs.

### SEO limitation requiring a separate migration decision

Existing indexed routes remain outside the V8 URL consolidation change:

- `/products/basketball-uniforms-1/` through other numbered legacy product variants.
- `/custom-basketball-uniforms-for-schools/`.
- `/oem-basketball-apparel-manufacturer/`.

They predate V8 and may have indexed value or backlinks. They were not deleted, redirected or re-canonicalized during Phase 6. A separate Search Console/backlink review is required before any migration.

## 4. Conversion System Status

The unified Project Qualification Form includes buyer role, sport, quantity, deadline, customization requirements, Logo, reference image, optional tech pack, WhatsApp and Email.

- Browser-rendered form fields: 13.
- Native form method: POST.
- Normal JavaScript submission: Formspree multipart request using the existing endpoint.
- No external CRM or database was added.
- Analytics does not include personal form values.

Lead scenarios verified:

| Scenario | Landing page | CTA destination | Expected classification | Result |
| --- | --- | --- | --- | --- |
| Youth Team Manager, 50+ sets, clear timeline, design asset | `/youth-team-uniforms/` | `/free-mockup/` | HIGH | Pass |
| Sports Brand OEM Buyer, 50+ sets, clear timeline, design asset | `/private-label-teamwear/` | `/get-quote/` | HIGH | Pass |
| Basketball buyer, 10-49 sets, clear project, no asset | `/products/basketball-uniforms/` | `/sample-order/` | MEDIUM | Pass |

LOW classification is used for research-stage or incomplete projects.

## 5. Production Safety Status

- No V8 production slot renders an unverified image or video in the final output.
- Homepage, basketball, buyer, factory, manufacturing and QC proof areas use `Verified production visual pending` when media is unavailable.
- The unverified legacy `mockup-process.webp` people visual was removed from the Customization and Free Mockup output without deleting the asset file.
- The unverified legacy global people image was removed from Open Graph and preload output.
- Unverified fixed claims such as global `MOQ 1`, fixed sample time, `Verified Alibaba Store`, fast-track scheduling, basketball GSM/tolerance and `100% manual QC` were removed from the audited release pages or replaced with consultation-based wording.
- No debug statements, test data, TODO, FIXME or HACK markers were found in the production TypeScript/JavaScript sources.

## 6. Test Results

| Validation | Result |
| --- | --- |
| `npm run check:v8` | Pass |
| `npx tsc --noEmit` | Pass |
| `npm test` | Pass |
| `npm run build` | Pass |
| Static pages generated | 143 / 143 |
| Canonical/H1 audit | 0 failures |
| Phase 6 source check | Pass |
| Phase 6 built-output check | Pass |
| Desktop browser page checks | 14 / 14 pass |
| Mobile checks: 390x844, 375x812, 360x800 | 42 / 42 pass |
| Mobile horizontal overflow | 0 |
| Controls below 44 px | 0 |
| Missing mobile conversion CTA | 0 |

Build warnings remain for existing raw `<img>` usage and Node's module-type detection. They do not fail the build. The local build could not query Sanity redirects, so the generated file retained the two approved base redirect rules.

## 7. Known Limitations

1. Formspree end-to-end delivery was not triggered because that would create a real external lead. FormData assembly, validation, error handling and success routes are covered by automated tests.
2. `NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT` must be present in the Preview and Production build environment. Without it, client-side submission shows the configured error and the native action has no endpoint.
3. `verificationNote` is currently optional in Sanity. The runtime gate is effective, but publishing workflow should require a human provenance check before setting `verified=true`.
4. Legacy basketball-related indexed pages need a separate SEO migration decision after checking Search Console, backlinks and traffic.
5. Existing raw `<img>` warnings and Node module-type warnings remain technical debt; neither was expanded into an unrelated Phase 6 refactor.
6. Other legacy pages outside the 14-page V8 release inventory may still contain old numeric claims or visual assets. A separate full-site evidence audit is recommended before future expansion.

## 8. Deployment Checklist

- [x] Work is on `feature/poxiol-v8-growth-upgrade`.
- [x] V8 source, TypeScript, existing tests and production build pass.
- [x] Canonical, H1, Sitemap, Schema, FAQ and redirect checks pass.
- [x] Desktop and three mobile viewport checks pass.
- [x] V8 production media uses verified gates or neutral placeholders.
- [x] No commit, push, PR, merge or deployment was performed in Phase 6.
- [ ] Final human review of this report and working-tree diff.
- [ ] Confirm Formspree endpoint exists in the deployment environment.
- [ ] Confirm Cloudflare Preview returns HTTP 301 for `/custom-basketball-uniforms/`.
- [ ] Confirm CI can access Sanity redirect data or explicitly accept base redirects only.
- [ ] Decide whether legacy basketball-related indexed URLs require a later migration.
- [ ] Approve the first V8 commit.
- [ ] After commit approval, run the same release gates against the committed tree before push or PR.

## Release Recommendation

The audited 14-page V8 release candidate is ready for first-commit review. It is not yet approved for deployment. The remaining items are environment and legacy-URL decisions, not failures in the current V8 page implementation.
