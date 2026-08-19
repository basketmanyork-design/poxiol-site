# POXIOL V9.0 | Site Truth & Architecture Audit

Audit date: 2026-08-17 (Asia/Shanghai)
Production: https://www.poxiol.com/
Repository: `basketmanyork-design/poxiol-site`
Audit mode: READ ONLY. No code, CMS, Cloudflare, GitHub configuration, PR, merge, or deployment changes were made.

Evidence labels used in this report:

- **CONFIRMED**: directly observed in Production, Git, repository source, or the public Sanity Production dataset during this audit.
- **INFERENCE**: supported by more than one signal but not directly proven.
- **NEEDS VERIFICATION**: access, ownership, approval, or documentary evidence was unavailable.

## 1. Executive Summary

POXIOL already has valuable V8/GEO assets worth keeping: buyer-focused homepage copy, a clear idea-to-shipment journey, three strong core-sport category pages, buyer pages for youth teams/schools/clubs, a useful FAQ and resource system, `llms.txt`, broad schema coverage, and one documented set of real basketball sample photographs.

The V9 blocker is not visual design. It is that the site does not yet have one reliable fact source or one coherent URL system.

The highest-risk findings are:

1. **Sanity remains a legacy-claim source.** The public Production dataset contains fixed or quasi-fixed operational claims across many documents: 2–3 day sample claims in 50 documents, MOQ 1 in 44, 7–12 day bulk production in 39, 3–7 day delivery in 37, and 24-hour promises in 32. The frontend currently rewrites some of these values at render time, but the CMS truth is still unsafe.
2. **Proof architecture is mostly empty.** Factory, Manufacturing, and Quality Control pages render zero images. All nine verified production-media slots are empty. All 19 CMS products lack detail, production, QC, and packaging image sets.
3. **The sitemap and internal-link graph disagree.** Production sitemap contains 100 URLs, but 19 indexable pages linked by the site are absent from it. Twenty-seven sitemap URLs receive no internal links from other sitemap pages; 64 receive one or fewer.
4. **There are two competing content systems.** Root-level pSEO pages and `/blog/<slug>/` pages create 19 exact duplicate-title pairs with self-canonicals. They should not both remain indexable.
5. **Legacy redirects are mostly not redirects.** Only `/custom-basketball-uniforms/` returns a real HTTP 301. Ten sampled old sport URLs return HTTP 200 “Moving to New Location” pages, which can be indexed as thin pages.
6. **Product taxonomy is incomplete and internally inconsistent.** Production has good category pages for basketball, soccer, baseball, training wear, hoodies/jackets, and accessories, but CMS categories duplicate soccer, omit baseball as a formal category, and have no category pages for pickleball, hockey, volleyball, or running/track.
7. **Product detail pages are thin and highly templated.** Three sampled details had 75%–86% vocabulary overlap, one image each, no FAQ, no related products, no packaging section, and no useful lead-time logic. Soccer and Training pages incorrectly recommend themselves to “Youth Basketball Teams.”
8. **Local checkout is not the Production baseline.** Local HEAD is an ancestor of remote `main` and is 12 commits behind it. The audit therefore treats Production, remote main metadata, public Sanity, and local source as separate evidence layers.

Recommended V9.1 is a **truth-foundation sprint**, not a redesign sprint: clean Sanity facts, remove render-time masking, choose canonical URLs, fix real redirects/sitemap/internal links, establish proof-asset governance, and only then start new navigation and page implementation.

## 2. Current Production Status

| Check | Result |
| --- | --- |
| Homepage | HTTP 200 and visually rendered in browser |
| Desktop | Checked at 1440×900; no page-level horizontal overflow detected |
| Mobile | Checked at 390×844 on homepage plus Products, Basketball, Factory, QC, Resources, and Contact; no page-level horizontal overflow detected |
| Sitemap | 100 URLs; all 100 returned HTTP 200 during batch audit |
| SEO basics | All 100 sitemap pages had a title, meta description, canonical, and exactly one H1 |
| Structured data | 93/100 sitemap pages had at least one JSON-LD type; seven had none |
| robots.txt | Public pages allowed; form success/API/admin paths disallowed; major AI crawlers explicitly allowed |
| llms.txt | Present and currently uses mostly project-specific language |
| Production commit | **NEEDS VERIFICATION**. Sitemap `lastmod` timestamps closely follow remote-main merge `ae452f7`, but Cloudflare deployment metadata was not available |
| Browser limitation | Direct browser navigation to `sitemap.xml` was blocked by the browser client; the XML was retrieved read-only over HTTPS instead |

Observed Production strengths:

- Homepage H1 clearly states the manufacturer/buyer positioning.
- Homepage has Organization, WebSite, FAQPage, and BreadcrumbList schema.
- Mobile navigation and homepage inquiry controls fit the viewport.
- Basketball category has the strongest product and real-sample evidence.
- Claim-safe phrasing is visible on several V8 pages: “confirmed during project consultation,” “inspection before shipment,” and project-specific timing.

Observed Production weaknesses:

- The mobile homepage is extremely long (about 19,502 rendered pixels at 390 px width).
- Factory, Manufacturing, QC, About, Projects, Resources, Fabric Guide, and Printing Guide are text-heavy or entirely image-free.
- Search-engine cached results observed on 2026-08-17 still showed older claims including MOQ 1, 2-hour mockup, 2–3 day sample, 7–12 day bulk, 3,000+ teams, and 12 sport categories. This is a cache/index-remediation issue even where current HTML is safer.

## 3. Repository / Deployment Baseline

| Item | Confirmed baseline |
| --- | --- |
| Local repository | `F:\codex\codex-test\poxiol-site` |
| Origin | `https://github.com/basketmanyork-design/poxiol-site.git` |
| Branch | `feature/poxiol-v8-growth-upgrade` |
| Local HEAD | `9eabb7a90c1fece29b3210687633d727df512ba5` |
| Remote feature HEAD | `9eabb7a90c1fece29b3210687633d727df512ba5` |
| Local `origin/main` tracking ref | `a3f37b77ff5c9933f7b71328d8ab214467501a2d` (stale) |
| Live remote `main` | `ae452f70b4a027822fc4340db683746e90653fc1` |
| Remote-main commit | Merge PR #65, 2026-08-16 08:29:52 UTC, “fix: clean up Core Sports V1 production follow-ups” |
| Relationship | Local HEAD is the merge base; remote main is 12 commits ahead and changes 158 files |
| Worktree | Not clean before this audit |
| Existing untracked files preserved | `POXIOL_Legacy_Content_Governance_Plan.md`, `POXIOL_V8_Cloudflare_Build_Diagnosis.md`, `POXIOL_V8_Preview_Validation_Report.md`, `POXIOL_V8_Production_Final_Report.md` |

Build/routing baseline:

- Next.js 15.5.21, React 18, App Router.
- 69 `page.tsx` files: 63 static path files and six dynamic route templates.
- Dynamic routes: root `[slug]`, `blog/[slug]`, `guides/[slug]`, `products/[slug]`, `projects/[slug]`, and `resources/[slug]`.
- Default `npm run build` uses static export unless `POXIOL_OPENNEXT_BUILD=1`.
- `cf:build` uses OpenNext for Cloudflare; `wrangler.jsonc` points to `.open-next/worker.js`.
- `CLOUDFLARE_DEPLOYMENT.md` still describes older Cloudflare Pages static-export settings. Exact current deployment model is **NEEDS VERIFICATION** because repository configuration supports both static export and OpenNext Worker paths.
- A build was not run because this phase is a read-only architecture audit and a build would create generated output. Existing scripts/configuration were inspected instead.

Sanity baseline:

- Project `oqpv1xbc`, dataset `production`, public published perspective.
- Current public business documents checked: 40 articles, 38 FAQ items, 19 products, 6 product categories, 11 site pages, 5 case studies, plus navigation and procurement singletons.
- Sanity is the normal production content source; local legacy data remains as fallback.
- Risky CMS values are normalized by frontend functions such as `normalizeHomepageClaim()` and `normalizeBuyerFacingClaim()`. This is masking, not source cleanup.

## 4. Current Site Architecture

Current architecture is a mixture of five overlapping systems:

1. **Core static pages**: homepage, About, Contact, Factory, Manufacturing, QC, Customization, Products, Resources, FAQ.
2. **CMS category/product pages**: six exported category pages and many dynamic product detail pages.
3. **Buyer V8 pages**: youth, school, club, and private-label pages.
4. **CMS articles**: `/blog/`, `/guides/`, and `/resources/` detail routes.
5. **Root pSEO pages**: `/<keyword-slug>/`, often duplicated again under `/blog/<same-slug>/`.

Key architecture conflicts:

| Conflict | Evidence | Consequence |
| --- | --- | --- |
| Production vs local checkout | Local is 12 commits behind main | Local-only conclusions can be stale |
| CMS truth vs rendered truth | CMS keeps fixed claims; frontend rewrites some | Unsafe content can reappear in another template, API, preview, or future refactor |
| Root pSEO vs Blog | 19 exact duplicate-title pairs with self-canonicals | Duplicate intent and index dilution |
| Sitemap vs links | 19 indexable linked pages absent; 27 sitemap orphans | Discovery and crawl signals conflict |
| Navigation vs taxonomy | Header exposes only Products, Factory, Customization, QC, Resources | Buyer and manufacturing paths are hidden |
| CMS taxonomy vs Production | Duplicate soccer categories; no formal baseball category | Inconsistent product relationships and URL generation |
| Static core pages vs CMS pages | Some pages use V8 typed data, others generic CMS templates | Inconsistent depth, proof, schema, and copy rules |
| Static export vs OpenNext docs | Config and deployment documentation disagree | Deployment runbook is not a reliable source |

## 5. URL Inventory

Decision vocabulary follows the required V9 values only.

### 5.1 Core, conversion, buyer, manufacturing, policy, and category URLs

| Current URL | Page Type | Current Purpose / SEO Role | V9 Decision | Target URL | Action |
| --- | --- | --- | --- | --- | --- |
| `/` | Homepage | Commercial + entity + conversion | KEEP + OPTIMIZE | `/` | Reuse V8; add sport breadth, proof, projects, buyer knowledge |
| `/products/` | Product hub | Commercial category discovery | REBUILD | `/products/` | Rebuild around SPORTS / TEAMWEAR / MANUFACTURING SOLUTIONS |
| `/solutions/` | Mixed sport/solution hub | Commercial | REBUILD | `/solutions/` | Make it the buyer-solution hub, not another product grid |
| `/about/` | Company | Supplier verification | KEEP + OPTIMIZE | `/about/` | Add verifiable company identity; no unsupported history/counts |
| `/contact/` | Conversion | Transactional | KEEP + OPTIMIZE | `/contact/` | Keep; align response-time wording with conditional policy |
| `/free-mockup/` | Conversion | Transactional | KEEP + OPTIMIZE | `/free-mockup/` | Keep; remove unconditional 24-hour source claims |
| `/get-quote/` | Conversion | Transactional | KEEP + OPTIMIZE | `/get-quote/` | Keep; remove unconditional 24-hour source claims |
| `/sample-order/` | Conversion | Transactional | KEEP + OPTIMIZE | `/sample-order/` | Keep; use project-confirmed sample timing |
| `/quote-received/`, `/sample-request-received/`, `/thank-you/` | Success | Non-index conversion state | KEEP | same | Keep noindex and outside sitemap |
| `/factory/` | Factory authority | Supplier verification | REBUILD | `/factory/` | “See How Your Teamwear Is Made”; evidence required |
| `/manufacturing/` | Process authority | Supplier verification + informational | REBUILD | `/manufacturing/` | Keep URL; convert to process hub with real proof |
| `/quality-control-process/` | QC authority | Supplier verification | REBUILD | `/quality-control-process/` | “Quality You Can See”; attach checks to real evidence |
| `/certificates-testing/` | Compliance | Supplier verification | KEEP + OPTIMIZE | `/certificates-testing/` | Keep conditional wording; attach real documents or mark unavailable |
| `/customization/` | Customization hub | Commercial | KEEP + OPTIMIZE | `/customization/` | Replace “Unlimited”; become design/artwork hub |
| `/oem-odm/` | OEM/ODM | Commercial | KEEP + OPTIMIZE | `/oem-odm/` | Add schema and evidence; clarify OEM vs ODM boundaries |
| `/private-label-teamwear/` | Buyer/OEM solution | Commercial | KEEP + OPTIMIZE | `/private-label-teamwear/` | Canonical private-label authority page |
| `/customization/private-label/` | Legacy private-label subpage | Duplicate commercial | MERGE | `/private-label-teamwear/` | Real 301 after content merge |
| `/customization/custom-packaging/` | Packaging | Commercial support | KEEP + OPTIMIZE | `/customization/custom-packaging/` | Add H1/canonical/schema and real packaging proof |
| `/customization/fabric-options/` | Fabric option | Commercial support | MERGE | `/fabric-guide/` | Merge product options into verified fabric authority page |
| `/customization/logo-name-number/` | Decoration | Commercial support | KEEP + OPTIMIZE | `/customization/logo-name-number/` | Retain only if differentiated from main customization page |
| `/fabric-guide/` | Fabric authority | Informational + GEO | KEEP + OPTIMIZE | `/fabric-guide/` | Keep equity; add traceable fabric references/evidence |
| `/printing-guide/` | Printing authority | Informational + GEO | KEEP + OPTIMIZE | `/printing-guide/` | Keep equity; remove “Unlimited”; add method constraints |
| `/shipping-after-sales/` | Logistics/process | Informational + trust | KEEP + OPTIMIZE | `/shipping-after-sales/` | Use as Packing & Shipping; keep timing conditional |
| `/projects/` | Project hub | Supplier verification | REBUILD | `/projects/` | Add to sitemap; label current entries as scenarios until verified |
| `/design-gallery/` | Inspiration | Commercial support | KEEP + OPTIMIZE | `/design-gallery/` | Clearly label visualization vs real finished product |
| `/faq/` | FAQ hub | Informational + GEO | KEEP + OPTIMIZE | `/faq/` | Remove unsupported technical absolutes and duplicate FAQs |
| `/resources/` | Knowledge hub | Informational | KEEP + OPTIMIZE | `/resources/` | Keep as resource entry; clarify relation with `/guides/` |
| `/guides/` | Buying-guide hub | Informational | REBUILD | `/guides/` | Add H1/canonical/schema and sitemap inclusion |
| `/blog/` | Blog hub | Informational | KEEP + OPTIMIZE | `/blog/` | Retain only editorial/news content after pSEO merge |
| `/ai-summary/` | AI summary | AI/GEO | NEED REVIEW | `/ai-summary/` | Confirm purpose vs `llms.txt` and `ai-summary.json` |
| `/builder/` | Tool | Transactional/interactive | NEED REVIEW | `/builder/` | Confirm production readiness and indexing intent |
| `/privacy-policy/`, `/terms/`, `/intellectual-property-policy/` | Policy | Legal | KEEP + OPTIMIZE | same | Keep; restore internal footer links and schema only if useful |

### 5.2 Product taxonomy URLs

| Current URL | Page Type | Current Purpose / SEO Role | V9 Decision | Target URL | Action |
| --- | --- | --- | --- | --- | --- |
| `/products/basketball-uniforms/` | Core sport | Commercial | KEEP + OPTIMIZE | same | Strongest category; preserve |
| `/products/soccer-jerseys/` | Core sport | Commercial | KEEP + OPTIMIZE | same | Preserve; add real product/process proof |
| `/custom-baseball-softball-uniforms/` | Core sport | Commercial | REBUILD | `/products/baseball-uniforms/` | Build canonical category then 301 old URL; verify search equity before migration |
| `/products/training-wear/` | Teamwear | Commercial | KEEP + OPTIMIZE | same | Cover training and warm-up; remove basketball template residue |
| `/products/hoodies-jackets/` | Teamwear | Commercial | KEEP + OPTIMIZE | same | Add correct assets and proof |
| `/products/team-accessories/` | Teamwear | Commercial | NEED REVIEW | same | Keep only if accessories are confirmed sellable scope |
| No current canonical category | Sport | Commercial | REBUILD | `/products/pickleball-wear/` | Future V9 page after product/evidence confirmation |
| `/custom-ice-hockey-jerseys/` (HTTP 200 stub) | Legacy sport | Thin redirect page | 301 REDIRECT | `/products/hockey-jerseys/` | Create target only after offer confirmation; then real 301 |
| `/custom-volleyball-uniforms/` (HTTP 200 stub) | Legacy sport | Thin redirect page | 301 REDIRECT | `/products/volleyball-uniforms/` | Same |
| `/custom-running-marathon-wear/` (HTTP 200 stub) | Legacy sport | Thin redirect page | 301 REDIRECT | `/products/running-track-wear/` | Same |
| `/custom-training-wear/` | Legacy sport | Legacy route | 301 REDIRECT | `/products/training-wear/` | Confirm HTTP behavior and add real 301 |
| `/custom-soccer-kits/` (HTTP 200 noindex stub) | Legacy sport | Thin redirect page | 301 REDIRECT | `/products/soccer-jerseys/` | Replace client redirect with HTTP 301 |
| `/custom-basketball-uniforms/` | Legacy sport | Existing HTTP 301 | KEEP | `/products/basketball-uniforms/` | Existing behavior is correct |
| `/custom-american-football-uniforms/`, `/custom-rugby-uniforms/`, `/custom-golf-wear/`, `/custom-tennis-wear/`, `/custom-esports-jerseys/` | Legacy sports | HTTP 200 stubs | NEED REVIEW | confirmed best-fit product/category or `/products/` | Do not mass-redirect until intent/product support is confirmed |
| `/sports/` | Legacy hub | HTTP 200 “Moving to Products” | 301 REDIRECT | `/products/` | Replace stub with HTTP 301 |

### 5.3 Linked product details absent from sitemap

All are indexable HTTP 200 pages with self-canonicals unless noted.

| Current URLs | Page Type | Current Purpose / SEO Role | V9 Decision | Target URL | Action |
| --- | --- | --- | --- | --- | --- |
| `/products/basketball-uniforms-basketball-jerseys/`<br>`/products/basketball-uniforms-basketball-shorts/`<br>`/products/basketball-uniforms-full-team-sets/`<br>`/products/basketball-uniforms-reversible-jerseys/` | Product detail | Transactional | REBUILD | shorter product URLs under `/products/basketball-uniforms/…` or merge into category | Decide whether each has unique demand/evidence; include retained URLs in sitemap |
| `/products/soccer-jerseys-soccer-jerseys/`<br>`/products/soccer-jerseys-soccer-shorts/`<br>`/products/soccer-jerseys-goalkeeper-kits/` | Product detail | Transactional | REBUILD | shorter soccer product URLs or merge | Fix duplicated names and wrong buyer labels |
| `/products/training-wear-training-tops/`<br>`/products/training-wear-warm-up-jackets/`<br>`/products/training-wear-team-travel-suits/` | Product detail | Transactional | REBUILD | shorter training product URLs or merge | Add differentiated specs/evidence |
| `/products/hoodies-jackets-pullover-hoodies/`<br>`/products/hoodies-jackets-zip-up-jackets/`<br>`/products/hoodies-jackets-fleece-outerwear/` | Product detail | Transactional | REBUILD | shorter outerwear product URLs or merge | Add correct assets and differentiated content |
| `/products/team-accessories-team-socks/`<br>`/products/team-accessories-custom-bags/` | Product detail | Transactional | NEED REVIEW | same or merge into category | Retain only with real capability and media |
| `/products/soccer-jerseys-1/` | Broken link | None | 301 REDIRECT | correct soccer product URL | Currently HTTP 404; fix link and redirect if historical traffic exists |

### 5.4 Projects, guides, resources, pSEO, and blog inventory

| Current URLs | Page Type | Current Purpose / SEO Role | V9 Decision | Target URL | Action |
| --- | --- | --- | --- | --- | --- |
| `/projects/usa-basketball-academy-uniform-program/`<br>`/projects/australia-soccer-club-kit-project/`<br>`/projects/school-athletics-multi-sport-program/`<br>`/projects/middle-east-sports-event-program/`<br>`/projects/distributor-bulk-teamwear-program/` | Project scenarios | Supplier verification | REBUILD | same initially | Keep “scenario” label; publish as real projects only after authorization/evidence |
| `/guides/b2b-sourcing-faq/`<br>`/guides/how-to-order-custom-basketball-uniforms/`<br>`/guides/custom-teamwear-manufacturer-buying-guide/`<br>`/guides/teamwear-quality-control-checklist/`<br>`/guides/sublimation-printing-guide/`<br>`/guides/private-label-teamwear-manufacturing/`<br>`/guides/teamwear-sample-approval-checklist/`<br>`/guides/basketball-uniform-size-guide/`<br>`/guides/how-to-choose-teamwear-manufacturer-china/`<br>`/guides/school-basketball-uniform-order-checklist/`<br>`/guides/reversible-vs-single-layer-basketball-uniforms/`<br>`/guides/custom-basketball-uniform-fabric-gsm/`<br>`/guides/sample-first-vs-bulk-teamwear-order/`<br>`/guides/custom-basketball-uniform-cost-factors/` | Guides | Informational + GEO | KEEP + OPTIMIZE | same | Retain differentiated buyer guides; clean claims and schema duplication |
| `/resources/custom-teamwear-moq-production-time/`<br>`/resources/teamwear-manufacturer-evaluation-checklist/`<br>`/resources/sports-uniform-fabric-guide/`<br>`/resources/private-label-teamwear-launch-checklist/`<br>`/resources/custom-basketball-uniform-manufacturer-guide/`<br>`/resources/custom-soccer-kits-wholesale-guide/` | Resources | Informational + GEO | KEEP + OPTIMIZE | same | Retain only if each has distinct intent from Guides and core pages |
| `/blog/soccer-jersey-buying-guide/` | Blog article | Informational | NEED REVIEW | chosen authoritative guide URL | Consolidate with root and/or guide version based on content/equity |
| Root pSEO: `/best-sportswear-fabrics/`, `/custom-baseball-jerseys-for-clubs/`, `/custom-basketball-jerseys-melbourne/`, `/custom-basketball-uniforms-for-schools/`, `/custom-soccer-kits-london/`, `/custom-soccer-uniforms-for-academies/`, `/custom-sports-apparel-distributor/`, `/custom-teamwear-new-york/`, `/custom-volleyball-uniforms-for-schools/`, `/how-sublimation-printing-works-for-teamwear/`, `/how-to-choose-a-teamwear-manufacturer/`, `/oem-baseball-apparel-manufacturer/`, `/oem-basketball-apparel-manufacturer/`, `/oem-soccer-apparel-manufacturer/`, `/oem-volleyball-apparel-manufacturer/`, `/oem-vs-odm-sportswear/`, `/soccer-jersey-supplier-australia/`, `/soccer-teamwear-supplier-uk/`, `/soccer-teamwear-supplier-usa/`, `/how-to-order-custom-basketball-uniforms/`, `/soccer-jersey-buying-guide/` | pSEO | Commercial/informational | MERGE | corresponding `/blog/`, `/guides/`, product, or buyer authority URL | 27 sitemap orphans include most root pSEO pages; select one owner per intent |
| Blog mirrors: `/blog/best-sportswear-fabrics/`, `/blog/custom-baseball-jerseys-for-clubs/`, `/blog/custom-basketball-jerseys-melbourne/`, `/blog/custom-basketball-uniforms-for-schools/`, `/blog/custom-soccer-kits-london/`, `/blog/custom-soccer-uniforms-for-academies/`, `/blog/custom-sports-apparel-distributor/`, `/blog/custom-teamwear-new-york/`, `/blog/custom-volleyball-uniforms-for-schools/`, `/blog/how-sublimation-printing-works-for-teamwear/`, `/blog/how-to-choose-a-teamwear-manufacturer/`, `/blog/oem-baseball-apparel-manufacturer/`, `/blog/oem-basketball-apparel-manufacturer/`, `/blog/oem-soccer-apparel-manufacturer/`, `/blog/oem-volleyball-apparel-manufacturer/`, `/blog/oem-vs-odm-sportswear/`, `/blog/soccer-jersey-supplier-australia/`, `/blog/soccer-teamwear-supplier-uk/`, `/blog/soccer-teamwear-supplier-usa/`, `/blog/soccer-jersey-buying-guide/` | Blog/pSEO mirrors | Informational | MERGE | chosen authoritative URL per intent | Nineteen exact title duplicates; 301 non-owner URLs after traffic/backlink review |

## 6. Legacy Content Findings

| Finding | Where | Status | Recommendation |
| --- | --- | --- | --- |
| Fixed operational values remain in CMS | 50 docs sample, 44 MOQ, 39 bulk, 37 shipping, 32 “within 24h” | CONFIRMED | Clean at source; do not rely on renderer replacements |
| Frontend claim masking | `lib/sanity/content.ts`, `lib/buyer-decision.ts` | CONFIRMED | Temporary safety net only; remove after source migration and regression tests |
| Old local fallback claims | `lib/home-data.ts`, `lib/b2b-faq.ts`, `lib/guides*.ts`, `lib/sports-pages.ts`, `lib/cms/legacy.ts`, `lib/pseo.ts` | CONFIRMED | Inventory and govern every public fallback string |
| Search index still exposes old claims | Search snapshot on 2026-08-17 | CONFIRMED observation | After source cleanup, request recrawl and monitor snippets |
| Legacy 200 redirect pages | Ten sampled old sport routes plus `/sports/` | CONFIRMED | Replace with HTTP 301 or real content; never leave “Moving” pages indexable |
| Deployment documentation is stale | `CLOUDFLARE_DEPLOYMENT.md` vs OpenNext config | CONFIRMED | Rewrite runbook only in an approved implementation phase |
| Existing project records lack evidence fields | Five public case studies | CONFIRMED | Continue “Manufacturing Scenario” treatment |
| Mojibake case-study titles in Sanity | All five case-study source titles contain `鈥?` | CONFIRMED | Correct source titles in controlled CMS migration |

## 7. Claim Risk Register

| Claim | URL / Source | Evidence Status | Risk | V9 Recommendation |
| --- | --- | --- | --- | --- |
| “Factory-direct manufacturer” | Sitewide; homepage, footer, CMS/source | NEED OWNER CONFIRMATION | RED | Confirm legal/manufacturing relationship and attach operational proof before keeping as core entity claim |
| MOQ 1 set | 44 Sanity docs / 53 fields; local fallbacks | OPERATIONAL TARGET / CONDITIONAL | RED | Replace with “quantity confirmed by project”; publish a number only with scope/conditions |
| Sample in 2–3 days | 50 Sanity docs / 94 fields | OPERATIONAL TARGET / CONDITIONAL | RED | Confirm after design, material, construction, queue, and payment review |
| Mockup within 2 hours | `procurementStandards`; local homepage data | OPERATIONAL TARGET | RED | Remove unconditional public timing; treat as internal SLA only |
| Mockup/quote within 24 hours | 32 Sanity docs | OPERATIONAL TARGET | RED | Use “after project requirements are reviewed” unless SLA evidence/coverage exists |
| Bulk production 7–12 days | 39 Sanity docs / 45 fields | CONDITIONAL | RED | Keep only as documented planning range with quantity/style/queue exceptions; otherwise project-confirmed wording |
| Express shipping 3–7 days | 37 Sanity docs | CONDITIONAL | RED | Carrier/destination/customs dependent; never state as delivery guarantee |
| “±2 cm, not a reason for returns” | `procurementStandards.qualityPromise`; FAQ/guides | UNVERIFIED / POLICY REQUIRED | RED | Remove returns exclusion; define measurement method, garment points, tolerance policy, and approved remedy |
| 30,000+ capacity | Factory Sanity document; renderer currently masks it | UNVERIFIED | RED | Do not publish without dated capacity records and owner approval |
| “Unlimited” customization/colors/design | Live Customization title, Printing Guide, pSEO/CMS | UNVERIFIED / CONDITIONAL | RED | Replace with “broad/full-color options subject to method, artwork, fabric and production review” |
| 100% manual quality inspection | Local guide fallback | UNVERIFIED | RED | Remove until a documented QC protocol supports exact scope and sampling rate |
| KIAN ink / EPSON print heads | Local FAQ/guide fallback | UNVERIFIED | RED | Do not publish equipment-brand claims without current machine/consumable proof |
| 12 sport categories | Legacy/search cache | PLACEHOLDER | YELLOW | State only categories with active pages and confirmed production capability |
| 3,000+ teams served | Search-engine cached homepage snippet | UNVERIFIED | RED | Do not restore without auditable customer/order records and publication approval |
| Certification/testing availability | `/certificates-testing/`; no attached records | CONDITIONAL / NEED OWNER CONFIRMATION | YELLOW | Keep “available depending on project” language; show real current documents with issuer/scope/validity or none |
| Moisture-wicking, breathable, anti-fade, high color fastness | Product/fabric/printing content | CONDITIONAL / UNVERIFIED | YELLOW | Tie to named material/test method and current supplier/test record; avoid universal product claims |
| “Real project” implications | `/projects/*` | PLACEHOLDER | RED | Keep “scenario” until buyer authorization, imagery, order record, and outcome evidence are recorded |
| 3,000 pieces project quantity | Local case-study fallback | UNVERIFIED | RED | Omit unless order record and publication approval exist |

## 8. Product Taxonomy Audit

Current visible/category coverage:

| V9 target | Existing page/source | Decision |
| --- | --- | --- |
| Basketball | `/products/basketball-uniforms/` | KEEP + OPTIMIZE |
| Soccer | `/products/soccer-jerseys/` | KEEP + OPTIMIZE |
| Baseball | `/custom-baseball-softball-uniforms/` but no formal CMS category | REBUILD into consistent product taxonomy |
| Pickleball | No canonical category | Future new page after capability/evidence confirmation |
| Hockey | Old HTTP 200 redirect stub only | Future new page then 301 |
| Volleyball | Old stub and thin school pSEO page | Future canonical category; merge supporting intent |
| Running & Track | Old stub only | Future new page after capability/evidence confirmation |
| Training Wear | `/products/training-wear/` | KEEP + OPTIMIZE |
| Warm-up Suits | Covered inside training/team travel | MERGE into Training unless independent catalog evidence exists |
| Hoodies/Jackets | `/products/hoodies-jackets/` | KEEP + OPTIMIZE |
| Polo Shirts | No page | Future page only if confirmed product line |
| Shorts | Scattered product details | MERGE by sport unless generic team shorts have distinct demand |
| Custom Team Uniforms | Sitewide concept, no single authority page | Use `/products/` + sport pages; new standalone page only if intent is distinct |
| OEM Manufacturing | `/oem-odm/` | KEEP + OPTIMIZE |
| Private Label | `/private-label-teamwear/` plus duplicate subpage | Keep canonical page; merge duplicate |

CMS conflicts:

- Six product-category documents include both “Soccer Jerseys” and “Soccer Kits.”
- Baseball is a major Production page but is not a formal published CMS category.
- Basketball has a published document whose `publishStatus` field still says `draft`; the frontend normalizes this in published mode.
- Most CMS product records have generic or missing sport, buyer, fabric, printing, size, and packaging fields.
- A prior image audit found cross-sport asset misuse and one soccer product assigned to a basketball category.

## 9. Buyer Solution Gap Analysis

| Buyer | Existing coverage | Gaps | V9 decision |
| --- | --- | --- | --- |
| Clubs | `/club-teamwear-program/` is strong on squads, identity, repeat orders | Club shop support, consolidated monthly orders, reorder record model | KEEP + OPTIMIZE |
| Schools | `/school-teamwear/` covers seasons, sizes, repeat supply | Budget/approval roles, delivery-date planning, purchase-order workflow | KEEP + OPTIMIZE |
| Youth Programs | `/youth-team-uniforms/` covers rosters/mixed sizing | Age-range sizing evidence, repeat-season record model | KEEP + OPTIMIZE |
| Sports Brands | Partly combined into `/private-label-teamwear/` | Tech pack intake, trims, packaging evidence, development stages | REBUILD as dedicated solution or clearly separated section |
| Distributors | Mentioned inside Private Label and pSEO | Wholesale assortment, consolidated production, repeat purchasing, account workflow | REBUILD dedicated solution |
| Teamwear Businesses | No dedicated page | Multiple club designs, monthly mixed orders, consolidated production, club-shop support | REBUILD dedicated solution |

Current `/solutions/` is product-program led (basketball, soccer, training, outerwear), not buyer led. V9 should make it the buyer hub and link to the six buyer paths.

## 10. Manufacturing Proof Audit

| Capability | Text Claim | Real Image | Real Video | Process Evidence | QC Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Design | Yes | Product visualization only | No | No dated artwork record | No | CONTENT ASSET REQUIRED |
| Artwork | Yes | No | No | No approval-sheet example | No | CONTENT ASSET REQUIRED |
| Sublimation | Yes | Unverified legacy image exists outside core proof page | No | No step-by-step record | No | CONTENT ASSET REQUIRED |
| Printing | Yes | No verified slot | No | No | No | CONTENT ASSET REQUIRED |
| Cutting | Yes | No | No | No | No | CONTENT ASSET REQUIRED |
| Sewing | Yes | No | No | No | No | CONTENT ASSET REQUIRED |
| Collar construction | Yes | Real basketball sample close-up | No | Finished-result evidence only | No | PARTIAL |
| Binding | Yes | Real basketball sample close-up | No | Finished-result evidence only | No | PARTIAL |
| Labels | Yes | No verified public image | No | No | No | CONTENT ASSET REQUIRED |
| Fabric | Yes | Real basketball mesh close-up | No | No traceable swatch/spec | No | PARTIAL |
| Measurement | Yes | No | No | No checklist/photo | Text only | CONTENT ASSET REQUIRED |
| Logo placement | Yes | Real finished sample visible | No | No approved artwork comparison | Text only | PARTIAL |
| Name / Number | Yes | Real number close-up | No | No roster/approval record | Text only | PARTIAL |
| Color consistency | Yes | No controlled comparison | No | No color target/inspection record | Text only | CONTENT ASSET REQUIRED |
| Packing | Yes | No verified slot | No | No packing-list/photo series | Text only | CONTENT ASSET REQUIRED |
| Shipment preparation | Yes | No verified slot | No | No carton/label/dispatch evidence | No | CONTENT ASSET REQUIRED |

Proof totals:

- Verified production-media CMS slots: **0/9**.
- Products with detail images: **0/19**.
- Products with production images: **0/19**.
- Products with QC images: **0/19**.
- Products with packaging images: **0/19**.
- Real public product proof is currently concentrated in one POXIOL basketball sample set.

Do not fill these gaps with AI-generated factory imagery.

## 11. Factory / QC Findings

### `/factory/`

- Clear entity/capability H1 and cautious V8 copy.
- Zero rendered images and no real factory video.
- Claims capability but does not let a buyer verify factory identity, equipment, line flow, staff/process, or current operation.
- CMS contains a capacity claim that the frontend masks; this is a source-level risk.
- Current page does not meet the V9 goal **“See How Your Teamwear Is Made.”**

### `/quality-control-process/`

- Clear workflow language and conditional “confirmed requirements” framing.
- Zero rendered images, no measurement demonstration, no dated checklist, no defect examples, no pre-shipment record, and no sampling plan.
- Current page describes checks but does not prove they happen.
- Current page does not meet the V9 goal **“Quality You Can See.”**

### `/certificates-testing/`

- Safer than legacy versions: it tells buyers to specify target-market testing requirements.
- “Currently verified evidence” is not accompanied by any downloadable/viewable evidence.
- Until records are attached, evidence status remains **NEEDS VERIFICATION**, not VERIFIED.

## 12. Product Detail Audit

Sampled pages:

- `/products/basketball-uniforms-basketball-jerseys/`
- `/products/soccer-jerseys-soccer-jerseys/`
- `/products/training-wear-training-tops/`

| Requirement | Result |
| --- | --- |
| Clear product name | Partial; H1s are awkward repeated category + product names |
| Buyer type | Present, but soccer/training reuse “Youth Basketball Teams” |
| Sport | Present |
| Fabric | Present but often generic and not evidence-linked |
| Printing | Present as option; “confirmed during consultation” table conflicts with descriptive copy |
| Fit | Mentioned, not structured |
| Customization | Present |
| Names / Numbers | Present on basketball; inconsistent elsewhere |
| MOQ | Safe rendered wording; unsafe CMS source remains |
| Sample | Mentioned, not a complete sample policy |
| Lead Time | Missing as useful decision content |
| Size | Mostly “confirmed during consultation”; no usable size reference |
| Production | Generic |
| QC | Mostly sitewide/footer links, not product-specific checks |
| Packaging | Missing |
| FAQ | Missing |
| CTA | Present |
| Schema | Product + Breadcrumb present |
| Internal Links | Present, but no related-product system |
| Related Products | Missing |

Template/content risks:

- Pairwise vocabulary overlap among sampled pages: 75.3%, 76.3%, and 86.3%.
- Each sampled product has one image.
- Soccer and Training reuse the same generic fabric/customization/buyer blocks.
- Titles are very short (“Soccer Jerseys”, “Training Tops”) while H1s are mechanically duplicated.
- Product detail URLs are absent from sitemap despite being indexable and internally linked.

## 13. SEO / GEO Audit

| Area | Finding | Priority |
| --- | --- | --- |
| Titles/descriptions/H1/canonical | Complete across all 100 sitemap URLs | Preserve |
| Exact duplicate titles | 19 root pSEO/blog pairs | P0 |
| Duplicate descriptions | 18 exact pairs found | P0 |
| Self-canonical duplicates | Both root and blog versions self-canonicalize | P0 |
| Orphan pages | 27 sitemap URLs have zero inbound links from other sitemap pages | P0 |
| Low-link pages | 64 sitemap URLs have one or fewer inbound links | P1 |
| Sitemap omissions | 19 indexable linked pages absent, including `/guides/`, `/projects/`, product details, and customization subpages | P0 |
| Broken internal link | `/products/soccer-jerseys-1/` returns 404 | P0 |
| Missing schema | `/solutions/`, `/design-gallery/`, `/oem-odm/`, `/blog/`, Terms, Privacy, IP policy | P1; policy schema optional |
| Duplicate Breadcrumb schema | Training Wear, Hoodies/Jackets, Team Accessories | P1 |
| Repeated Organization objects | Many article/resource pages render 2–3 Organization nodes | NEED REVIEW; consolidate by stable `@id` |
| hreflang | None on 100 pages | Not an error while site is English-only; add only with real localized equivalents |
| Pagination | No meaningful pagination architecture observed | P2 until content volume grows |
| robots.txt | Good baseline; AI bots allowed | Preserve |
| llms.txt | Present, concise, relatively safe | KEEP + OPTIMIZE after URL migration |
| Sitemap lastmod | Most pages share deployment timestamp rather than content update time | P1 |
| Old redirects | Most sampled old URLs are HTTP 200 stubs | P0 |

Primary intent ownership should be:

- Product/category pages: Commercial + Transactional.
- Buyer pages: Commercial + Supplier fit.
- Factory/Manufacturing/QC/Certificates/Projects: Supplier Verification.
- Guides/Resources/Blog: Informational; one canonical owner per query.
- About/Home/llms/schema: AI/GEO entity support.

Do not create extra GEO pages where an existing product, buyer, or guide page can own the intent.

## 14. Navigation Migration Plan

Current header: Products, Factory, Customization, Quality Control, Resources, Get Quote.

Target migration:

| Target group | Existing reusable URLs | Missing / migration work |
| --- | --- | --- |
| Products | Basketball, Soccer, Baseball, Training | Add confirmed Pickleball, Hockey, Volleyball, Running/Track pages; standardize Baseball URL |
| Solutions | Youth, School, Club, Private Label | Make `/solutions/` buyer hub; add Sports Brands, Distributors, Teamwear Businesses |
| Customization | `/customization/`, `/oem-odm/`, `/private-label-teamwear/` | Add/clarify Design & Artwork; merge duplicate Private Label |
| Manufacturing | Factory, Manufacturing, Fabric Guide, Printing Guide, QC, Shipping | Label pages consistently; add real proof; treat Shipping page as Packing/Shipment |
| Projects | `/projects/` + five scenarios | Add hub to sitemap; do not label scenarios as verified real projects |
| Resources | `/resources/`, `/guides/`, Fabric, Printing, FAQ | Fix Guides hub and define clear hub ownership |
| About | About, Contact | Add Team only when authentic team information/assets exist |

Desktop and mobile menus must use the same information architecture. Keep Get Quote as a persistent CTA, not a substitute for missing solution navigation.

Healy Sport pattern takeaways used only at the concept level:

- Separate OEM, ODM, and Customization paths.
- Product taxonomy is visible from navigation.
- Factory/process proof is treated as a top-level buyer decision.
- Products and manufacturing solutions are not mixed into one list.

No Healy Sport copy, imagery, logos, certification claims, or brand assets should be reused.

## 15. URL Migration / Redirect Recommendations

Rules:

1. Choose one canonical owner for every intent before creating a redirect.
2. Preserve URLs with established equity unless inconsistency causes material buyer/search harm.
3. Use server/edge HTTP 301, not rendered “Moving” pages.
4. Update internal links, sitemap, canonical, schema URLs, `llms.txt`, and navigation in the same release.
5. Keep a versioned redirect ledger with source, target, reason, approval, and verification date.
6. Do not redirect unrelated retired sport URLs to the homepage; use the closest confirmed category or return a deliberate 410 only after traffic/backlink review.

Priority migrations:

| Source | Target | Recommendation |
| --- | --- | --- |
| `/sports/` | `/products/` | 301 |
| `/custom-soccer-kits/` | `/products/soccer-jerseys/` | 301 |
| `/custom-training-wear/` | `/products/training-wear/` | 301 |
| `/custom-baseball-softball-uniforms/` | `/products/baseball-uniforms/` | Future controlled 301 after target launch/equity check |
| `/customization/private-label/` | `/private-label-teamwear/` | 301 after merge |
| `/products/soccer-jerseys-1/` | correct retained soccer product | Fix source link + 301 if URL has history |
| Root pSEO/blog duplicate pairs | chosen authority URL | 19 controlled merges/301s after GSC/backlink review |

## 16. Homepage V9 Gap Analysis

| V9 section | Current state | Decision |
| --- | --- | --- |
| 1. Hero | Strong buyer/manufacturer positioning | Reuse + tighten evidence wording |
| 2. Explore By Sport | Partial: basketball/soccer/baseball only | Expand only after category/capability confirmation |
| 3. Who We Help | Present | Reuse; add Teamwear Businesses |
| 4. Choose Your Production Path | Current “Choose the Right Teamwear Path” is product-led | Rebuild into Custom Team / OEM / Private Label paths |
| 5. Idea to Finished Teamwear | Present | Reuse |
| 6. Manufacturing Proof | Process text exists; proof absent | Add only verified real media |
| 7. Product Proof | Strong basketball sample; weak other sports | Reuse basketball; collect other real products |
| 8. Quality You Can See | Text only | Rebuild with real inspection evidence |
| 9. Real Projects | Missing; current projects are scenarios | Add only verified/authorized records |
| 10. Buyer Knowledge | Resources not surfaced as a clear homepage section | Add curated links, not duplicate content |
| 11. FAQ | Present | Reuse after claim cleanup |
| 12. Start Your Project | Present with detailed form | Reuse; consider shorter first-step mobile flow in later conversion testing |

## 17. Content Asset Requirements

P0 real assets required:

- Factory overview: current exterior/entrance/production floor identity with date/source record.
- Printing/sublimation: machine/process sequence, current equipment only.
- Cutting and sewing: real steps, operators/equipment, approved public use.
- QC: measurement, artwork placement, stitching, color, name/number, quantity, and packing checks.
- Packing/shipment: polybag, labels, carton marks, size grouping, shipment preparation.
- Product sets: real soccer, baseball, training, hoodie/jacket, volleyball, hockey, pickleball, and running samples only for confirmed categories.
- Private label: real neck label, care label, hangtag, barcode, polybag, carton mark.
- Project evidence: buyer-authorized images, approved specifications, and verifiable result statement.
- Certificates/testing: current document, issuer, scope, validity, product/market applicability, and publication permission.

For every asset record, require:

- source/owner;
- capture date;
- product/project association;
- authenticity approval;
- public-use approval;
- stage/capability;
- alt text and caption;
- expiry/review date where applicable.

Status for every missing item: **CONTENT ASSET REQUIRED**. AI-generated images must not be used as factory, QC, product, certificate, or project evidence.

## 18. V9 Implementation Backlog

1. Export a fresh, versioned Sanity published inventory and claim ledger.
2. Replace fixed operational values in `procurementStandards` with conditional fields and structured conditions.
3. Migrate or quarantine fixed claims in 50 affected articles/FAQ/product/category/site-page records.
4. Remove the “not a reason for returns” claim pending approved policy.
5. Add CMS evidence status and owner approval requirements to every public claim class.
6. Decide canonical owner for 19 root/blog duplicate pairs.
7. Repair real HTTP redirects and eliminate 200 redirect stubs.
8. Fix sitemap omissions, orphan pages, broken product link, and lastmod semantics.
9. Consolidate duplicate schema and add missing schema where it provides buyer/search value.
10. Normalize CMS taxonomy and product relationships.
11. Define V9 canonical URL map and frozen redirect ledger.
12. Rebuild Factory/QC/Manufacturing only after evidence assets are approved.
13. Redesign product detail model around specifications, proof, FAQ, related products, and repeat-order support.
14. Rebuild Solutions around the six buyer types.
15. Implement target navigation consistently across desktop/mobile.
16. Update `llms.txt`, schema URLs, internal links, and sitemaps in the same migration.
17. Request recrawl and monitor search snippets after claim/URL cleanup.
18. Update deployment/runbook documentation to the confirmed Cloudflare architecture.

## 19. P0 / P1 / P2 Priorities

### P0 — before V9 visual development

1. Clean Sanity fixed claims and remove frontend masking as the primary safety mechanism.
2. Remove/approve the ±2 cm returns exclusion and factory capacity claim.
3. Resolve 19 duplicate root/blog pairs and define one intent owner.
4. Replace HTTP 200 redirect stubs with controlled redirect decisions.
5. Fix sitemap omissions, 27 orphans, and `/products/soccer-jerseys-1/` 404 link.
6. Establish evidence governance and collect minimum Factory/QC/Manufacturing proof.
7. Correct CMS taxonomy and cross-sport product/buyer data.
8. Freeze the V9 canonical URL and redirect map before navigation implementation.

### P1 — V9.1 architecture implementation

1. Rebuild Products and Solutions hubs.
2. Add missing buyer paths for Sports Brands, Distributors, and Teamwear Businesses.
3. Rebuild Factory, Manufacturing, QC, and Projects with approved evidence.
4. Upgrade product detail template and sitemap inclusion rules.
5. Fix missing/duplicate schema and Guides hub metadata.
6. Add real product assets for confirmed categories.
7. Update internal links, `llms.txt`, breadcrumbs, and navigation.

### P2 — after truth and architecture stabilize

1. Add newly confirmed sport/category pages.
2. Add Team page only with real team information.
3. Add pagination when article volume requires it.
4. Run conversion tests on form length and CTA sequence.
5. Consider localized pages/hreflang only with complete translated equivalents.
6. Expand verified project library and repeat-order tools.

## 20. Recommended V9.1 Scope

V9.1 should be limited to a **Truth Foundation + Canonical Architecture Release**:

1. Sanity claim-source cleanup and structured conditional claim model.
2. Claim/evidence registry with owner approval and expiry/review fields.
3. Final canonical URL inventory and redirect ledger.
4. Removal of pSEO/blog duplicate ownership conflicts.
5. Real HTTP redirects for approved legacy routes.
6. Sitemap/internal-link/schema repair.
7. CMS product taxonomy correction.
8. Minimum verified Factory/QC/Manufacturing proof asset set.
9. Updated navigation specification and page briefs, but only implement pages whose facts/assets are ready.
10. Deployment baseline confirmation and runbook correction.

V9.1 should not include a broad visual redesign, mass creation of thin sport pages, AI factory imagery, or new public claims. Completion gate: Production, CMS, source fallbacks, sitemap, schema, `llms.txt`, navigation, and redirect rules must all tell the same story.

---

## Audit completion record

| Item | Result |
| --- | --- |
| Production checked | YES — Desktop + Mobile |
| Sitemap URLs audited | 100 |
| Additional linked/legacy URLs checked | 30+ |
| Sanity Production checked | YES — public published perspective, read only |
| Healy Sport reference checked | YES — architecture concepts only |
| Code modified | NO |
| CMS modified | NO |
| PR created | NO |
| Deployment triggered | NO |
