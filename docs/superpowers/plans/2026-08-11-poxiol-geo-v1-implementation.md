# POXIOL GEO V1 Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make POXIOL consistently readable as a B2B custom teamwear manufacturer across the homepage, About page, product templates, FAQ, Organization Schema, and crawler policy using one local fact source.

**Architecture:** Add a code-owned `lib/geo-v1.ts` module for approved facts and pure resolver functions. Reuse the existing homepage, CMS page, sports landing, product detail, FAQ Schema, and Tailwind component systems; page files consume resolved shared data without deleting Sanity fields. Add runtime data/resolver tests before production changes, then verify rendered output with a dedicated HTML contract plus the repository's existing build, canonical, sitemap, and H1 checks.

**Tech Stack:** Next.js 15 App Router, React 18, TypeScript, Tailwind CSS, Sanity CMS, Node.js contract scripts, Cloudflare-compatible static build.

## Global Constraints

- Canonical domain is exactly `https://www.poxiol.com`.
- Organization `@id` is exactly `https://www.poxiol.com/#organization`.
- Keep Next.js, Tailwind CSS, Sanity CMS, and Cloudflare deployment architecture unchanged.
- Keep existing pages, CMS fields, CTA destinations, SEO assets, and deployment workflow.
- Add no unsupported factory, staffing, capacity, customer, certification, or delivery claims.
- Use existing confirmed product fields before the fallback `Confirmed during project consultation`.
- Work locally only: no commit, push, pull request, Sanity publish, Production deploy, or remote-history change.
- Do not download or restore unrelated large media unless a verification command proves it is required.

---

## Modification Scope

### Create

- `lib/geo-v1.ts` — canonical GEO V1 facts, FAQ merge logic, About override, and normalized product GEO resolvers.
- `components/sections/GeoV1Sections.tsx` — reusable homepage and product GEO renderers using existing Tailwind styles.
- `scripts/check-geo-v1.test.mts` — Node 22 runtime contract for approved data, About override, product fallbacks, and FAQ merging.
- `scripts/check-geo-v1-output.mjs` — rendered HTML contract for page copy, Manufacturing Process, product fields, FAQPage, Organization, canonical domain, H1, sitemap, and crawler rules.
- `docs/POXIOL_GEO_V1_IMPLEMENTATION_REPORT.md` — final local implementation and validation report.

### Modify

- `package.json` — add `check:geo-v1` and include it in the existing test chain.
- `scripts/check-buyer-decision-clarity.test.mjs` — replace the stale pre-GEO hero-title expectation with the approved shared GEO V1 hero behavior.
- `lib/buyer-decision.ts` — source desktop and mobile hero wording from shared GEO data.
- `app/page.tsx` — insert the shared homepage entity and customer sections after the hero.
- `app/about/page.tsx` — apply the narrow About safety override after Sanity resolution.
- `app/products/[slug]/page.tsx` — render shared product overview, specifications, and recommendations from `CmsProduct` fields.
- `components/sports/SportsLandingPage.tsx` — resolve shared category-product details and use one FAQ array for visible FAQ plus JSON-LD.
- `components/seo/GEOStructuredData.tsx` — source the single Organization node from shared GEO data while retaining WebSite Schema.
- `public/robots.txt` — add only the missing Google-Extended allowance.

## Shared Data Structure

`lib/geo-v1.ts` will export immutable data and pure functions with these interfaces:

```ts
export type GeoFaq = {question: string; answer: string}
export type GeoRow = {label: string; value: string}

export type GeoProductDetails = {
  overview: GeoRow[]
  specifications: GeoRow[]
  recommendedFor: readonly string[]
}

export const GEO_V1 = {
  canonicalBaseUrl: 'https://www.poxiol.com',
  organization: {
    id: 'https://www.poxiol.com/#organization',
    name: 'POXIOL',
    url: 'https://www.poxiol.com',
    description: 'Custom Teamwear Manufacturer specializing in basketball, soccer and multi-sport uniforms.',
    industry: 'Sportswear Manufacturing',
  },
  homepage: {
    heroHeading: 'Custom Teamwear Manufacturer for Basketball, Soccer & Multi-Sport Teams',
    heroDescription: 'POXIOL provides OEM custom uniforms for clubs, schools, sports brands and distributors with full customization, flexible MOQ and quality-controlled production.',
    entityTitle: 'Who Is POXIOL?',
    entityParagraphs: [
      'POXIOL is a B2B custom sportswear manufacturer specializing in basketball uniforms, soccer kits and multi-sport team apparel.',
      'We support clubs, schools, teamwear brands and distributors with customized production including team logos, names, numbers, colors and private label solutions.',
    ],
    customerTitle: 'Who We Help',
    customerSegments: [
      {title: 'Youth Teams', description: 'Custom uniforms for basketball and soccer programs.'},
      {title: 'Schools & Academies', description: 'Teamwear solutions for school sports programs.'},
      {title: 'Sports Brands', description: 'OEM and private label manufacturing support.'},
      {title: 'Distributors', description: 'Bulk custom apparel production.'},
    ],
  },
  about: {
    heading: 'B2B Custom Teamwear Manufacturer',
    description: 'POXIOL is a B2B custom teamwear manufacturer specializing in basketball uniforms, soccer kits and multi-sport apparel. We help sports clubs, schools, teamwear brands and distributors develop customized uniforms through OEM and private label production, from design confirmation to production and quality inspection.',
    processTitle: 'Manufacturing Process',
    processSteps: [
      {title: 'Design Confirmation', description: 'Confirm the uniform design, colors, logos, names, numbers and project requirements.'},
      {title: 'Sample Development', description: 'Develop a sample for design, material and construction review before bulk production.'},
      {title: 'Material Preparation', description: 'Prepare the materials confirmed for the approved product specification.'},
      {title: 'Production', description: 'Produce the customized teamwear according to the confirmed specification.'},
      {title: 'Quality Inspection', description: 'Inspect customization, sizing and packing details before shipment.'},
      {title: 'International Shipping', description: 'Arrange international shipping using the method confirmed for the order.'},
    ],
  },
  product: {
    missingValue: 'Confirmed during project consultation',
    recommendedFor: ['Youth Basketball Teams', 'School Programs', 'Sports Clubs', 'Teamwear Brands', 'Distributors'],
  },
  basketballFaqs: [
    {
      question: 'Is POXIOL a manufacturer or trading company?',
      answer: 'POXIOL specializes in custom teamwear manufacturing and provides OEM and private label production services for basketball, soccer and multi-sport apparel.',
    },
    {
      question: 'Can small teams order custom basketball uniforms?',
      answer: 'POXIOL supports sample development and flexible order quantities for teams testing new designs before bulk production.',
    },
    {
      question: 'Can basketball jerseys include custom names and numbers?',
      answer: 'Yes, teams can customize logos, player names, numbers and colors.',
    },
    {
      question: 'What information is needed for a custom uniform quote?',
      answer: 'Customers can provide team design, logo files, quantity, size breakdown and customization requirements.',
    },
  ],
} as const

export function applyAboutGeoV1(page: CmsPage): CmsPage
export function buildCmsProductGeoDetails(product: CmsProduct): GeoProductDetails
export function buildSportsProductGeoDetails(data: SportsPageData): GeoProductDetails
export function mergeGeoFaqs(priority: readonly GeoFaq[], existing: readonly GeoFaq[]): GeoFaq[]
export function resolveSportsFaqs(data: SportsPageData): GeoFaq[]
```

## Component Reuse

`components/sections/GeoV1Sections.tsx` exports:

```tsx
export function HomepageGeoEntitySections()
export function ProductGeoSections({details}: {details: GeoProductDetails})
```

- `HomepageGeoEntitySections` uses the existing black/neutral/lime visual language, `SectionHeading`, responsive Tailwind grids, and no new client-side JavaScript.
- `ProductGeoSections` renders one Product Overview definition list, one horizontally scrollable semantic Technical Specifications table, and one Recommended For card/list group.
- About uses the existing `CmsPageTemplate` `processSteps` branch rather than a new renderer.
- FAQ keeps the existing `<details>` markup and `FAQSchema`; only the resolved input array changes.

## Rollback Method

No Git history is changed. If rollback is later approved, inspect `git diff` first, then restore only the modified tracked files listed above with explicit `git restore -- <exact paths>`. Remove only these new files after separate deletion approval:

- `lib/geo-v1.ts`
- `components/sections/GeoV1Sections.tsx`
- `scripts/check-geo-v1.test.mjs`
- `docs/POXIOL_GEO_V1_IMPLEMENTATION_REPORT.md`
- `docs/superpowers/specs/2026-08-11-poxiol-geo-v1-design.md`
- `docs/superpowers/plans/2026-08-11-poxiol-geo-v1-implementation.md`

Never use `git reset --hard`, broad `git clean`, or recursive deletion against the repository root.

---

### Task 1: Add the GEO V1 Failing Runtime and Rendered Contracts

**Files:**
- Create: `scripts/check-geo-v1.test.mts`
- Create: `scripts/check-geo-v1-output.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: approved strings and file paths from the design specification.
- Produces: `npm run check:geo-v1`, a deterministic runtime contract, and `npm run check:geo-v1:output`, a rendered-output contract.

- [ ] **Step 1: Write the runtime data and resolver contract before production code**

Create a Node 22 TypeScript assertion script that imports and executes the real shared module. It uses independent literal fixtures and checks the behavior that would break if an override, field priority, fallback, or FAQ merge were removed:

```ts
import assert from 'node:assert/strict'
import {
  GEO_V1,
  applyAboutGeoV1,
  buildCmsProductGeoDetails,
  buildSportsProductGeoDetails,
  resolveSportsFaqs,
} from '../lib/geo-v1.ts'

assert.equal(GEO_V1.homepage.heroHeading, 'Custom Teamwear Manufacturer for Basketball, Soccer & Multi-Sport Teams')
assert.equal(GEO_V1.organization.id, 'https://www.poxiol.com/#organization')

const about = applyAboutGeoV1({
  key: 'about', slug: 'about', title: 'About', eyebrow: 'Original', heading: 'Old heading', description: 'Old description',
  sections: [{type: 'richText', title: 'Existing section', body: 'Keep me'}],
  seo: {title: 'Existing SEO title', description: 'Existing SEO description'},
})
assert.equal(about.heading, 'B2B Custom Teamwear Manufacturer')
assert.equal(about.sections[0].type, 'processSteps')
assert.deepEqual(about.sections[0].steps?.map((step) => step.title), ['Design Confirmation', 'Sample Development', 'Material Preparation', 'Production', 'Quality Inspection', 'International Shipping'])
assert.equal(about.sections[1].title, 'Existing section')
assert.equal(about.seo.title, 'Existing SEO title')

const product = buildCmsProductGeoDetails({
  slug: 'test-jersey', title: 'Test Jersey', categoryTitle: 'Basketball Uniforms', description: 'Fixture',
  detailImages: [], productionImages: [], qcImages: [], packagingImages: [], fabricOptions: [],
  fabric: 'Confirmed mesh', printing: 'Confirmed sublimation', customizationOptions: ['Logo', 'Name', 'Number'],
  sizeRange: 'Youth to adult', oem: true, privateLabel: true,
  procurementOverride: {moq: '1 sample set'}, relatedFaqs: [], featured: false,
  seo: {title: 'Fixture', description: 'Fixture'}, displayOrder: 0, active: true,
})
assert.equal(product.specifications.find((row) => row.label === 'Fabric')?.value, 'Confirmed mesh')
assert.equal(product.specifications.find((row) => row.label === 'MOQ')?.value, '1 sample set')

const missingProduct = buildCmsProductGeoDetails({
  slug: 'fallback-jersey', title: 'Fallback Jersey', description: 'Fixture',
  detailImages: [], productionImages: [], qcImages: [], packagingImages: [],
  fabricOptions: [], customizationOptions: [], relatedFaqs: [], featured: false,
  seo: {title: 'Fallback fixture', description: 'Fallback fixture'},
  displayOrder: 0, active: true,
})
assert.equal(missingProduct.specifications.find((row) => row.label === 'Fabric')?.value, 'Confirmed during project consultation')

const basketballFaqs = resolveSportsFaqs({slug: 'products/basketball-uniforms', faqs: [{question: 'Existing question?', answer: 'Existing answer.'}]} as never)
assert.equal(basketballFaqs[0].question, 'Is POXIOL a manufacturer or trading company?')
assert.equal(basketballFaqs.filter((faq) => faq.question === 'Is POXIOL a manufacturer or trading company?').length, 1)
assert.equal(basketballFaqs.at(-1)?.question, 'Existing question?')

const sportsDetails = buildSportsProductGeoDetails({
  slug: 'products/basketball-uniforms', h1: 'Custom Basketball Uniforms', primaryKeyword: 'custom basketball uniforms',
  procurementTable: [{item: 'Fabric', specification: 'Confirmed category fabric'}], buyerTypes: [{title: 'Sports Clubs', description: 'Fixture'}],
} as never)
assert.equal(sportsDetails.specifications.find((row) => row.label === 'Fabric')?.value, 'Confirmed category fabric')
assert.equal(sportsDetails.specifications.find((row) => row.label === 'Available Sizes')?.value, 'Confirmed during project consultation')

console.log('POXIOL GEO V1 runtime checks passed')
```

- [ ] **Step 2: Write the rendered-output contract before production code**

Create `scripts/check-geo-v1-output.mjs`. It reads `out/index.html`, `out/about/index.html`, `out/products/basketball-uniforms/index.html`, `out/sitemap.xml`, and `public/robots.txt`. It must:

- count visible `<h1>` tags after removing scripts and require exactly one on each route;
- require one canonical link whose resolved host is `www.poxiol.com` on each route;
- require the exact homepage H1, subtitle, entity definition, and four customer segment headings;
- require the About B2B definition and all six process steps;
- require all Product Overview and Technical Specifications labels plus Recommended For on the basketball route;
- parse every `application/ld+json` script as JSON, flatten arrays and `@graph`, and require exactly one Organization node with the approved `@id`, description, industry, name, and URL;
- require a FAQPage whose questions include all four approved basketball questions, while also requiring the same questions in visible HTML;
- require sitemap URLs to start with `https://www.poxiol.com`;
- require explicit `Allow: /` blocks for GPTBot, PerplexityBot, Google-Extended, and ClaudeBot.

- [ ] **Step 3: Add package commands**

Add:

```json
"check:geo-v1": "node --experimental-strip-types scripts/check-geo-v1.test.mts",
"check:geo-v1:output": "node scripts/check-geo-v1-output.mjs"
```

Prepend `npm run check:geo-v1 &&` to the existing `test` script without removing any existing command.

The baseline test command currently fails before GEO work because two existing `.mjs` checks import `.ts` modules without enabling Node 22 type stripping. Change only those two command segments to:

```json
"node --experimental-strip-types scripts/check-high-intent-guides-content-gaps.test.mjs",
"node --experimental-strip-types scripts/check-high-intent-guides-week2.test.mjs --source-only"
```

Do not add `"type": "module"` or change application module semantics.

Update `scripts/check-buyer-decision-clarity.test.mjs` so its homepage conclusion assertion reads the approved hero heading from the shared GEO runtime module rather than locking the removed pre-GEO title. Keep every other risk, CTA, evidence, and route assertion.

- [ ] **Step 4: Run the runtime check and verify the RED state**

Run: `npm run check:geo-v1`

Expected: FAIL because `lib/geo-v1.ts` does not exist yet. The failure must be a module-not-found error for the missing production module, not a syntax error in the test script.

---

### Task 2: Implement the Shared GEO Data and Pure Resolvers

**Files:**
- Create: `lib/geo-v1.ts`
- Test: `scripts/check-geo-v1.test.mts`

**Interfaces:**
- Consumes: `CmsPage`, `CmsProduct`, and `SportsPageData` type-only imports.
- Produces: `GEO_V1`, `applyAboutGeoV1`, `buildCmsProductGeoDetails`, `buildSportsProductGeoDetails`, `mergeGeoFaqs`, and `resolveSportsFaqs` with the signatures defined above.

- [ ] **Step 1: Add exact approved immutable facts**

Implement the full `GEO_V1` object from the Shared Data Structure, including all four exact approved FAQ answers.

- [ ] **Step 2: Add deduplicated FAQ resolution**

Normalize question text with lowercasing, trimming, and whitespace collapse. When `data.slug === 'products/basketball-uniforms'`, return priority basketball FAQs followed by existing non-duplicates; otherwise return existing FAQ unchanged.

- [ ] **Step 3: Add the About safety override**

Return a new `CmsPage` object with shared heading and description. Prepend the shared `processSteps` section unless `page.sections` already contains a section whose normalized title is `manufacturing process`. Preserve every other field and section.

- [ ] **Step 4: Add product detail resolvers**

For `CmsProduct`, use:

```ts
const missing = GEO_V1.product.missingValue
const customization = product.customizationOptions.length ? product.customizationOptions.join(', ') : 'Logos, names, numbers and colors'
const productionType = [product.oem ? 'OEM' : '', product.privateLabel ? 'Private Label' : ''].filter(Boolean).join(' / ') || missing
```

Use `product.fabric`, `product.printing`, `product.sizeRange`, and `product.procurementOverride?.moq` before `missing`. Use category/product fields for application and existing buyer-type data when available.

For `SportsPageData`, match exact procurement row labels case-insensitively and return the row specification. Never derive technical values from marketing paragraphs.

- [ ] **Step 5: Run the focused check**

Run: `npm run check:geo-v1`

Expected: still FAIL because page and component consumers are not yet wired. This is the correct intermediate RED state.

---

### Task 3: Wire Homepage and About Page Safety Overrides

**Files:**
- Create: `components/sections/GeoV1Sections.tsx`
- Modify: `lib/buyer-decision.ts`
- Modify: `app/page.tsx`
- Modify: `app/about/page.tsx`
- Test: `scripts/check-geo-v1.test.mts`

**Interfaces:**
- Consumes: `GEO_V1.homepage`, `applyAboutGeoV1`, `SectionHeading`, and existing `CmsPageTemplate` process rendering.
- Produces: exact responsive homepage entity/customer sections and deterministic About hero/process content.

- [ ] **Step 1: Create the reusable homepage renderer**

Render `Who Is POXIOL?` and `Who We Help` from `GEO_V1.homepage`. Use server components, semantic `<section>`, `<h2>`, `<p>`, and four cards in `grid gap-5 md:grid-cols-2 lg:grid-cols-4`.

- [ ] **Step 2: Source the hero constants from shared data**

In `lib/buyer-decision.ts`, import `GEO_V1` and set desktop heading, mobile heading, and description to `GEO_V1.homepage.heroHeading` and `GEO_V1.homepage.heroDescription`. Keep the exported constant names for compatibility.

- [ ] **Step 3: Insert homepage sections after the hero**

Import and render `<HomepageGeoEntitySections />` immediately after the closing hero section and before existing buyer-decision content. Do not change CTA markup or destinations.

- [ ] **Step 4: Apply the About override at the route boundary**

Use:

```tsx
const page = applyAboutGeoV1(await getSitePage(pageKey))
return <CmsPageTemplate page={page} />
```

Apply the same resolver in `generateMetadata` so visible hero and page metadata remain based on one resolved page object without deleting Sanity fields.

- [ ] **Step 5: Run the focused check**

Run: `npm run check:geo-v1`

Expected: homepage and About assertions PASS; product, Schema, and robots assertions remain RED.

---

### Task 4: Add Shared Product GEO Sections and Basketball FAQ Consistency

**Files:**
- Modify: `components/sections/GeoV1Sections.tsx`
- Modify: `app/products/[slug]/page.tsx`
- Modify: `components/sports/SportsLandingPage.tsx`
- Test: `scripts/check-geo-v1.test.mts`

**Interfaces:**
- Consumes: `GeoProductDetails`, `buildCmsProductGeoDetails`, `buildSportsProductGeoDetails`, and `resolveSportsFaqs`.
- Produces: Product Overview, Technical Specifications, Recommended For, and one shared basketball FAQ array for visible markup and JSON-LD.

- [ ] **Step 1: Add `ProductGeoSections`**

Render:

```tsx
<dl>{details.overview.map(({label, value}) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
<table><tbody>{details.specifications.map(({label, value}) => <tr key={label}><th scope="row">{label}</th><td>{value}</td></tr>)}</tbody></table>
<ul>{details.recommendedFor.map((item) => <li key={item}>{item}</li>)}</ul>
```

Wrap each structure with the existing neutral/lime Tailwind patterns and horizontal table overflow for mobile.

- [ ] **Step 2: Wire the Sanity product-detail template**

Call `buildCmsProductGeoDetails(product)` after product resolution and render `<ProductGeoSections details={geoDetails} />` after the existing description/options section.

- [ ] **Step 3: Wire the sports-category template**

At the top of `SportsLandingPage`, create:

```ts
const resolvedFaqs = resolveSportsFaqs(data)
const geoDetails = buildSportsProductGeoDetails(data)
```

Pass `resolvedFaqs` to `<FAQSchema>`, render the same array in visible `<details>`, and render `<ProductGeoSections details={geoDetails} />` after the procurement summary.

- [ ] **Step 4: Run the focused check**

Run: `npm run check:geo-v1`

Expected: product field and FAQ consistency assertions PASS; Schema and robots assertions remain RED.

---

### Task 5: Align Organization Schema and AI Crawler Rules

**Files:**
- Modify: `components/seo/GEOStructuredData.tsx`
- Modify: `public/robots.txt`
- Test: `scripts/check-geo-v1.test.mts`

**Interfaces:**
- Consumes: `GEO_V1.organization` and `GEO_V1.canonicalBaseUrl`.
- Produces: one homepage Organization node, retained WebSite node, canonical Organization reference, and four explicit AI crawler allowances.

- [ ] **Step 1: Source Organization Schema from shared data**

Import `GEO_V1`, keep one `@graph`, and set the Organization node to:

```ts
{
  '@type': 'Organization',
  '@id': GEO_V1.organization.id,
  name: GEO_V1.organization.name,
  url: GEO_V1.organization.url,
  description: GEO_V1.organization.description,
  industry: GEO_V1.organization.industry,
}
```

Keep the WebSite node and set its `publisher.@id` to `GEO_V1.organization.id`. Do not introduce a second Organization object.

- [ ] **Step 2: Add Google-Extended to robots**

Preserve all existing rules and append before the Sitemap line:

```text
User-agent: Google-Extended
Allow: /
```

- [ ] **Step 3: Verify the GREEN state**

Run: `npm run check:geo-v1`

Expected: PASS with `POXIOL GEO V1 contract checks passed`.

---

### Task 6: Run Existing Tests and Resolve Regressions

**Files:**
- Modify only a task file above when a failure proves the GEO V1 change caused a regression.

**Interfaces:**
- Consumes: all completed GEO V1 implementation.
- Produces: passing source and repository contract suites without weakening existing assertions.

- [ ] **Step 1: Run the GEO V1 check independently**

Run: `npm run check:geo-v1`

Expected: PASS.

- [ ] **Step 2: Run existing tests**

Run: `npm test`

Expected: every existing script plus `check:geo-v1` exits 0.

- [ ] **Step 3: Run the focused basketball test**

Run: `npm run check:basketball-decision-page`

Expected: `Basketball decision-page checks passed`.

- [ ] **Step 4: Inspect the diff for unsupported claims and duplicate copy**

Run:

```powershell
git diff --check
git diff --stat
rg -n "Custom Teamwear Manufacturer for Basketball, Soccer & Multi-Sport Teams|Is POXIOL a manufacturer or trading company\?" app components lib
```

Expected: no whitespace errors; approved literal facts occur in the shared module rather than separate page copies.

---

### Task 7: Build, SEO Validation, and Final Report

**Files:**
- Create: `docs/POXIOL_GEO_V1_IMPLEMENTATION_REPORT.md`
- Modify only task files above if fresh verification identifies a GEO V1 regression.

**Interfaces:**
- Consumes: built static output and test logs.
- Produces: evidence-backed local completion report.

- [ ] **Step 1: Run the production build**

Run: `npm run build`

Expected: exit 0, no TypeScript error, all static routes generated, CMS redirect generation completed, image/GSC checks passed, and canonical checks passed.

- [ ] **Step 2: Run canonical and H1 verification explicitly**

Run: `npm run check:canonical`

Expected JSON summary: `failures: 0`, `canonicalMissing: 0`, `canonicalDuplicates: 0`, `missingH1: 0`, and `duplicateH1: 0`.

- [ ] **Step 3: Run sitemap output verification**

Run: `node scripts/check-sitemap-output.mjs`

Expected: exit 0 and URLs use `https://www.poxiol.com`.

- [ ] **Step 4: Inspect rendered GEO output**

Run: `npm run check:geo-v1:output`

Expected: PASS after reading `out/index.html`, `out/about/index.html`, `out/products/basketball-uniforms/index.html`, `out/sitemap.xml`, and `public/robots.txt` and proving the exact hero/entity/About/process/product/FAQ text, one visible H1 per page, one canonical link per page, canonical Organization JSON-LD, FAQPage consistency, sitemap domain, and crawler allowances.

- [ ] **Step 5: Write the implementation report**

Create `docs/POXIOL_GEO_V1_IMPLEMENTATION_REPORT.md` with:

- Completed Changes
- GEO Data Structure
- Files Modified
- Homepage Changes
- About Changes
- Product Template Changes
- FAQ and Schema Updates
- Robots Update
- Build Status
- SEO Validation
- Unresolved Issues
- Remaining GEO Recommendations

Use only actual command results; record failures honestly and do not claim completion when a required command did not pass.

- [ ] **Step 6: Perform the final local audit**

Run:

```powershell
git status --short
git diff --check
git diff --name-only
```

Expected: only planned local files are modified or created; no commit, push, PR, CMS publish, or deployment occurred.
