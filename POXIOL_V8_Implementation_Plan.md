# POXIOL V8 Full Growth Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a reusable V8 B2B growth system that turns POXIOL's existing SEO-safe site into a clear buyer journey without duplicating commercial intent or using unverified manufacturing media.

**Architecture:** Extend the existing GEO V1 and Sanity fallback architecture with a typed `lib/v8` fact/config layer, reusable `components/v8` sections, one unified qualification form, optional verified-media CMS slots and output-level SEO guards. Existing pages keep their URLs and consume shared configs; new buyer pages use one shared template.

**Tech Stack:** Next.js 15, React 18, TypeScript, Tailwind CSS, Sanity CMS, Formspree, Node.js 22 test scripts, Cloudflare Pages static delivery.

## Global Constraints

- Work only on `feature/poxiol-v8-growth-upgrade`.
- Do not deploy Production, modify Cloudflare configuration, write CMS data or modify a database.
- Keep Next.js, Tailwind CSS and Sanity CMS.
- Preserve existing Canonicals, Organization/WebSite Schema and indexed URLs.
- Do not create `/custom-basketball-uniform-manufacturer/` or `/production-process/`.
- Keep `/products/basketball-uniforms/` as the only primary basketball commercial landing page.
- Implement `/custom-basketball-uniforms/` → `/products/basketball-uniforms/` as HTTP 301.
- Do not render unverified production images or videos.
- Use `Verified production visual pending` when verified media is unavailable.
- Visible FAQ and FAQPage JSON-LD must use the same array.
- Missing product or production facts must use consultation language, never invented values.
- New business code follows test-first red → green → refactor order.

---

### Task 1: Lock V8 URL, architecture and safety contracts

**Files:**
- Create: `scripts/check-v8-architecture.test.mjs`
- Create: `scripts/check-v8-urls.test.mjs`
- Modify: `package.json`
- Test: `scripts/check-v8-architecture.test.mjs`
- Test: `scripts/check-v8-urls.test.mjs`

**Interfaces:**
- Consumes: current route files, `public/_redirects`, `app/sitemap.ts`, `lib/navigation.ts`.
- Produces: `npm run check:v8` as the required focused validation entry point.

- [ ] **Step 1: Write failing architecture checks**

Assert the planned files and exports exist, rejected routes do not exist, and unsafe media is not referenced by V8 components:

```js
assert.ok(existsSync('lib/v8/index.ts'))
assert.ok(existsSync('components/v8/VerifiedMediaPlaceholder.tsx'))
assert.equal(existsSync('app/custom-basketball-uniform-manufacturer/page.tsx'), false)
assert.equal(existsSync('app/production-process/page.tsx'), false)
assert.doesNotMatch(v8Sources, /images\/poxiol-v6\/manufacturing_/)
```

- [ ] **Step 2: Write failing URL checks**

Validate the exact redirect, main basketball Canonical, rejected routes, Sitemap and commercial link consolidation:

```js
assert.match(redirects, /^\/custom-basketball-uniforms\/ \/products\/basketball-uniforms\/ 301$/m)
assert.equal(commercialLinksToLegacy.length, 0)
assert.equal(sitemap.includes('/custom-basketball-uniform-manufacturer/'), false)
assert.equal(sitemap.includes('/production-process/'), false)
```

- [ ] **Step 3: Run the focused checks and verify failure**

Run:

```powershell
node scripts/check-v8-architecture.test.mjs
node scripts/check-v8-urls.test.mjs
```

Expected: FAIL because the V8 layer and HTTP 301 do not exist.

- [ ] **Step 4: Add the package script only**

Add:

```json
"check:v8": "node scripts/check-v8-architecture.test.mjs && node scripts/check-v8-urls.test.mjs && node --experimental-strip-types scripts/check-v8-lead-qualification.test.mts && node scripts/check-v8-output.mjs && node scripts/check-v8-mobile-layout.test.mjs && node scripts/check-v8-accessibility.test.mjs"
```

The later test files are added by later tasks; until then run individual scripts.

- [ ] **Step 5: Commit the test contract**

```powershell
git add package.json scripts/check-v8-architecture.test.mjs scripts/check-v8-urls.test.mjs
git commit -m "test: define POXIOL V8 architecture contracts"
```

---

### Task 2: Implement the shared V8 data layer

**Files:**
- Create: `lib/v8/types.ts`
- Create: `lib/v8/brand.ts`
- Create: `lib/v8/processes.ts`
- Create: `lib/v8/faqs.ts`
- Create: `lib/v8/pages.ts`
- Create: `lib/v8/media.ts`
- Create: `lib/v8/index.ts`
- Test: `scripts/check-v8-architecture.test.mjs`

**Interfaces:**
- Consumes: `GEO_V1` from `lib/geo-v1.ts`, existing CTA routes and approved page roles.
- Produces: `V8_BRAND`, `V8_BUYERS`, `V8_PROCESSES`, `V8_PAGE_CONFIGS`, `getV8PageConfig`, `getV8Faqs`, `resolveVerifiedMedia`.

- [ ] **Step 1: Extend failing tests with exact data expectations**

Test brand positioning, five buyers, seven journey stages, eight manufacturing stages, six QC stages and the fallback phrase.

```js
assert.equal(V8_MEDIA_FALLBACK, 'Verified production visual pending')
assert.deepEqual(V8_BUYERS.map((buyer) => buyer.id), ['youth-teams', 'schools', 'clubs', 'sports-brands', 'distributors'])
assert.deepEqual(V8_PROCESSES.journey.map((step) => step.id), ['idea', 'design', 'mockup', 'sample', 'production', 'qc', 'shipment'])
```

- [ ] **Step 2: Run and confirm failure**

```powershell
node scripts/check-v8-architecture.test.mjs
```

Expected: FAIL on missing V8 exports.

- [ ] **Step 3: Implement typed data and pure selectors**

Use the approved stable interface:

```ts
export function getV8PageConfig(pageId: V8PageId): V8PageConfig
export function getV8Faqs(filter: {pageId: V8PageId; buyerId?: V8BuyerId}): V8FaqItem[]
export function resolveVerifiedMedia(asset?: V8MediaAsset): V8MediaAsset | null
```

`brand.ts` imports the canonical and Organization facts from `GEO_V1`; it does not redefine them.

- [ ] **Step 4: Run checks**

```powershell
node scripts/check-v8-architecture.test.mjs
npm run check:geo-v1
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add lib/v8 scripts/check-v8-architecture.test.mjs
git commit -m "feat: add shared POXIOL V8 data layer"
```

---

### Task 3: Add verified-media CMS slots without publishing content

**Files:**
- Create: `studio/schemaTypes/objects/verifiedMediaAsset.ts`
- Create: `studio/schemaTypes/objects/productionMediaSet.ts`
- Modify: `studio/schemaTypes/index.ts`
- Modify: `studio/schemaTypes/documents/sitePage.ts`
- Modify: `studio/schemaTypes/objects/pageSection.ts`
- Modify: `lib/cms/types.ts`
- Modify: `lib/sanity/queries.ts`
- Modify: `lib/sanity/content.ts`
- Test: `scripts/check-v8-architecture.test.mjs`

**Interfaces:**
- Consumes: Sanity `imageWithAlt`, page projections and `V8MediaAsset`.
- Produces: optional `productionMedia` on CMS pages/sections and a resolver that exposes only verified assets.

- [ ] **Step 1: Write failing schema and query assertions**

Assert the schema contains the six image and three video stage keys, verification flag, alt and caption fields; assert GROQ projects them.

- [ ] **Step 2: Run and confirm failure**

```powershell
node scripts/check-v8-architecture.test.mjs
```

- [ ] **Step 3: Implement the Sanity objects**

`verifiedMediaAsset` fields:

```ts
mediaType: 'image' | 'video'
stage: V8MediaStage-compatible string
image?: imageWithAlt
video?: file
altText?: string
caption?: string
verified: boolean
verificationNote?: string
```

`productionMediaSet` exposes exact stage fields: `fabricInspection`, `printing`, `cutting`, `sewing`, `qc`, `packing`, `factoryOverviewVideo`, `productionWorkflowVideo`, `qualityInspectionVideo`.

- [ ] **Step 4: Map CMS assets safely**

The content resolver must discard `verified !== true`, missing URL and image assets without Alt Text. No content migration or Dataset write is run.

- [ ] **Step 5: Validate Studio and frontend types**

```powershell
npm --prefix studio run typecheck
npx tsc --noEmit
node scripts/check-cms-schema-coverage.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit**

```powershell
git add studio/schemaTypes lib/cms/types.ts lib/sanity/queries.ts lib/sanity/content.ts scripts/check-v8-architecture.test.mjs
git commit -m "feat: add verified production media slots"
```

---

### Task 4: Build reusable V8 presentation components

**Files:**
- Create: `components/v8/V8Hero.tsx`
- Create: `components/v8/CustomerSegmentation.tsx`
- Create: `components/v8/BuyerProblems.tsx`
- Create: `components/v8/SolutionCards.tsx`
- Create: `components/v8/DesignJourney.tsx`
- Create: `components/v8/ManufacturingTimeline.tsx`
- Create: `components/v8/ProductionProof.tsx`
- Create: `components/v8/SampleApproval.tsx`
- Create: `components/v8/QualityControl.tsx`
- Create: `components/v8/FAQSection.tsx`
- Create: `components/v8/FinalCTA.tsx`
- Create: `components/v8/VerifiedMediaPlaceholder.tsx`
- Create: `components/v8/V8BuyerLandingPage.tsx`
- Create: `components/v8/index.ts`
- Test: `scripts/check-v8-accessibility.test.mjs`

**Interfaces:**
- Consumes: typed configs from `lib/v8`, existing `SectionHeading`, `PrimaryButton`, `SecondaryButton`, and `FAQSchema`.
- Produces: configurable sections with no page-local content copies.

- [ ] **Step 1: Write failing component and accessibility checks**

Check semantic landmarks, a configurable heading level, ordered process lists, visible focus classes, media fallback text and FAQ single-source props.

- [ ] **Step 2: Verify failure**

```powershell
node scripts/check-v8-accessibility.test.mjs
```

- [ ] **Step 3: Implement the smallest shared component API**

Representative contracts:

```ts
export function V8Hero({config, media}: {config: V8HeroConfig; media?: V8MediaAsset}): JSX.Element
export function FAQSection({title, faqs, schema}: {title: string; faqs: V8FaqItem[]; schema?: boolean}): JSX.Element
export function ProductionProof({steps, media}: {steps: V8ProcessStep[]; media?: V8MediaAsset[]}): JSX.Element
```

- [ ] **Step 4: Implement safe media rendering**

`VerifiedMediaPlaceholder` is rendered whenever `resolveVerifiedMedia` returns `null`. Verified images use responsive dimensions; verified videos require controls and no autoplay audio.

- [ ] **Step 5: Run checks**

```powershell
node scripts/check-v8-architecture.test.mjs
node scripts/check-v8-accessibility.test.mjs
npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```powershell
git add components/v8 scripts/check-v8-accessibility.test.mjs
git commit -m "feat: add reusable POXIOL V8 sections"
```

---

### Task 5: Implement the HTTP 301 and consolidate basketball links

**Files:**
- Modify: `public/_redirects`
- Modify: `components/CategoryRedirect.tsx`
- Modify: `lib/navigation.ts`
- Modify: `lib/cms/legacy.ts`
- Modify: `lib/home-data.ts`
- Modify: `lib/high-intent-guides.js`
- Modify: `lib/week3-guides.ts`
- Modify: `public/llms.txt`
- Test: `scripts/check-v8-urls.test.mjs`

**Interfaces:**
- Consumes: approved target `/products/basketball-uniforms/`.
- Produces: Cloudflare Pages 301 and zero internal commercial links to the legacy route.

- [ ] **Step 1: Run URL test and record red state**

```powershell
node scripts/check-v8-urls.test.mjs
```

- [ ] **Step 2: Add exact 301**

```text
/custom-basketball-uniforms/ /products/basketball-uniforms/ 301
```

- [ ] **Step 3: Normalize internal commercial links**

Change only links with commercial basketball intent. Keep informational resource URLs intact and ensure their CTA points to the main product page.

- [ ] **Step 4: Run URL and existing route checks**

```powershell
node scripts/check-v8-urls.test.mjs
node scripts/check-guide-route-integrity.test.mjs
node scripts/check-canonical-integrity.test.mjs
```

- [ ] **Step 5: Commit**

```powershell
git add public/_redirects components/CategoryRedirect.tsx lib/navigation.ts lib/cms/legacy.ts lib/home-data.ts lib/high-intent-guides.js lib/week3-guides.ts public/llms.txt scripts/check-v8-urls.test.mjs
git commit -m "fix: consolidate basketball commercial URLs"
```

---

### Task 6: Build the unified Project Qualification Form

**Files:**
- Create: `lib/v8/leads.ts`
- Create: `scripts/check-v8-lead-qualification.test.mts`
- Create: `components/v8/ProjectQualificationForm.tsx`
- Modify: `components/forms/ContactForm.tsx`
- Modify: `components/forms/FreeMockupForm.tsx`
- Modify: `app/contact/page.tsx`
- Modify: `app/get-quote/page.tsx`
- Modify: `app/free-mockup/page.tsx`
- Modify: `app/sample-order/page.tsx`
- Test: `scripts/check-public-inquiry-integrity.mjs`
- Test: `scripts/check-v8-lead-qualification.test.mts`

**Interfaces:**
- Consumes: Formspree endpoint, analytics functions, CTA intent and shared option data.
- Produces: one form component with `intent`, `sourcePage`, `leadPriority`, UTM and three attachments.

- [ ] **Step 1: Write failing lead classification tests**

```ts
assert.equal(classifyLead({quantity: '50-99', deadline: '2026-10-01', assetCount: 1, requirements: 'Basketball set'}), 'HIGH')
assert.equal(classifyLead({quantity: '10-49', deadline: '2026-10-01', assetCount: 0, requirements: 'Need price'}), 'MEDIUM')
assert.equal(classifyLead({quantity: 'research', deadline: '', assetCount: 0, requirements: ''}), 'LOW')
```

- [ ] **Step 2: Run both form checks and confirm current failure**

```powershell
node --experimental-strip-types scripts/check-v8-lead-qualification.test.mts
node scripts/check-public-inquiry-integrity.mjs
```

Expected: missing lead classifier and the existing three-file ContactForm regression.

- [ ] **Step 3: Implement the pure classifier**

`classifyLead` parses shared quantity bands rather than labels embedded in components. A clear timeline means a non-empty valid date. Design assets mean at least one selected file.

- [ ] **Step 4: Implement one configurable form**

```ts
type ProjectQualificationFormProps = {
  intent: 'mockup' | 'quote' | 'sample' | 'contact'
  title: string
  subtitle: string
  ctaLabel: string
  successUrl: string
  publicEmail: string
  whatsappHref: string
  defaultSport?: string
}
```

Restore exactly three named file inputs and append `logo_file`, `reference_design_file`, `size_chart_tech_pack_file` to `FormData` only when selected.

- [ ] **Step 5: Preserve analytics and failure fallback**

Keep `trackFormStart`, `trackFileUpload`, `trackFormSubmit`, `trackLead`, router success navigation, public Email and WhatsApp fallback.

- [ ] **Step 6: Replace page wrappers, not endpoints**

Contact, Get Quote, Free Mockup and Sample Order pass different intents and success URLs to the shared component. Do not change environment variables or submit test leads.

- [ ] **Step 7: Run form tests**

```powershell
node --experimental-strip-types scripts/check-v8-lead-qualification.test.mts
node scripts/check-public-inquiry-integrity.mjs
npx tsc --noEmit
```

Expected: PASS, removing the known ContactForm failure through real restoration.

- [ ] **Step 8: Commit**

```powershell
git add lib/v8/leads.ts components/v8/ProjectQualificationForm.tsx components/forms app/contact app/get-quote app/free-mockup app/sample-order scripts/check-v8-lead-qualification.test.mts
git commit -m "feat: add V8 project qualification form"
```

---

### Task 7: Rebuild the Homepage as the V8 sales funnel

**Files:**
- Modify: `app/page.tsx`
- Modify: `lib/sanity/content.ts`
- Modify: `lib/v8/pages.ts`
- Test: `scripts/check-v8-output.mjs`
- Test: `scripts/check-v8-mobile-layout.test.mjs`

**Interfaces:**
- Consumes: `getV8PageConfig('homepage')`, existing GEO/Schema, Homepage CMS content and shared sections.
- Produces: the approved eight-section funnel without duplicate old modules.

- [ ] **Step 1: Write failing output checks**

Check the approved Hero, two CTAs, four buyer cards, three buyer problems, six design steps, production fallback, solution links, five Homepage FAQ questions and final CTA.

- [ ] **Step 2: Run and confirm failure**

```powershell
node scripts/check-v8-output.mjs --source-only
```

- [ ] **Step 3: Replace page-local repeated sections with shared components**

Keep Header, Footer, OrganizationSchema, WebSite and Breadcrumb. Render the approved V8 sequence, then retain only non-duplicative guides/GEO support sections.

- [ ] **Step 4: Preserve mobile conversion behavior**

Hero main CTA must finish above the sticky bar at 390×844, 375×812 and 360×800. Customer cards use one column on narrow screens.

- [ ] **Step 5: Run focused checks**

```powershell
npm run check:geo-v1
node scripts/check-v8-output.mjs --source-only
node scripts/check-v8-mobile-layout.test.mjs --source-only
```

- [ ] **Step 6: Commit**

```powershell
git add app/page.tsx lib/sanity/content.ts lib/v8/pages.ts scripts/check-v8-output.mjs scripts/check-v8-mobile-layout.test.mjs
git commit -m "feat: build V8 homepage sales funnel"
```

---

### Task 8: Upgrade the existing basketball landing page

**Files:**
- Modify: `components/sports/SportsLandingPage.tsx`
- Modify: `lib/sports-pages.ts`
- Modify: `lib/v8/pages.ts`
- Modify: `lib/v8/faqs.ts`
- Modify: `scripts/check-basketball-decision-page.mjs`
- Test: `scripts/check-v8-output.mjs`
- Test: `scripts/check-geo-v1-output.mjs`

**Interfaces:**
- Consumes: current basketball CMS resolver, `getV8PageConfig('basketball')`, existing product details and shared FAQ.
- Produces: the only basketball commercial page with buyer, customization, manufacturing, sample, QC and CTA modules.

- [ ] **Step 1: Add failing basketball expectations**

Assert the page includes Buyer Problems, Buyer Fit, Customization, Sample Approval, Manufacturing, QC, shared FAQ and both CTAs; assert its Canonical remains unchanged.

- [ ] **Step 2: Run and confirm failure**

```powershell
node scripts/check-basketball-decision-page.mjs
node scripts/check-v8-output.mjs --source-only
```

- [ ] **Step 3: Integrate shared V8 components**

Preserve existing CMS content and product facts. Avoid showing duplicate GEO product sections or duplicate FAQ blocks; page and FAQ Schema use one resolved array.

- [ ] **Step 4: Add process authority links**

Link Manufacturing → `/manufacturing/`, Quality Control → `/quality-control-process/`, Request Sample → `/sample-order/`.

- [ ] **Step 5: Run checks**

```powershell
node scripts/check-basketball-decision-page.mjs
npm run check:geo-v1
node scripts/check-v8-urls.test.mjs
npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```powershell
git add components/sports/SportsLandingPage.tsx lib/sports-pages.ts lib/v8/pages.ts lib/v8/faqs.ts scripts/check-basketball-decision-page.mjs scripts/check-v8-output.mjs
git commit -m "feat: upgrade basketball conversion landing page"
```

---

### Task 9: Create the four buyer landing pages from one template

**Files:**
- Create: `app/youth-team-uniforms/page.tsx`
- Create: `app/school-teamwear/page.tsx`
- Create: `app/private-label-teamwear/page.tsx`
- Create: `app/club-teamwear-program/page.tsx`
- Modify: `lib/v8/pages.ts`
- Modify: `lib/v8/faqs.ts`
- Modify: `components/v8/V8BuyerLandingPage.tsx`
- Test: `scripts/check-v8-output.mjs`

**Interfaces:**
- Consumes: a `buyerPageId`, shared template, buyer-specific config and FAQ filter.
- Produces: four distinct URLs with unique Metadata, H1, buyer pain points, solutions, FAQ, Schema and CTA.

- [ ] **Step 1: Write failing route/content checks**

For each route assert a unique title, H1, description, Canonical, buyer pain points and FAQ subset. Assert no page targets “Custom Basketball Uniform Manufacturer”.

- [ ] **Step 2: Run and confirm failure**

```powershell
node scripts/check-v8-output.mjs --source-only
```

- [ ] **Step 3: Implement one page template**

Each route is a thin wrapper:

```tsx
export default function Page() {
  return <V8BuyerLandingPage pageId="youth-team-uniforms" />
}
```

Use equivalent unique `pageId` values for the other three routes.

- [ ] **Step 4: Add Service, Breadcrumb and shared FAQ Schema**

Only factual, visible content is included. No ratings, prices, named customers or unsupported results.

- [ ] **Step 5: Run checks**

```powershell
node scripts/check-v8-output.mjs --source-only
npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```powershell
git add app/youth-team-uniforms app/school-teamwear app/private-label-teamwear app/club-teamwear-program components/v8/V8BuyerLandingPage.tsx lib/v8/pages.ts lib/v8/faqs.ts scripts/check-v8-output.mjs
git commit -m "feat: add V8 buyer landing page system"
```

---

### Task 10: Upgrade Customization into the design conversion page

**Files:**
- Modify: `app/customization/page.tsx`
- Modify: `lib/cms/legacy.ts`
- Modify: `lib/v8/pages.ts`
- Test: `scripts/check-v8-output.mjs`

**Interfaces:**
- Consumes: existing CMS page, `DesignJourney`, `SampleApproval`, `ProjectQualificationForm`.
- Produces: Idea/Logo/Reference → Mockup → Sample flow with `mockup` intent.

- [ ] **Step 1: Add failing checks for design conversion**

Assert `Create Your Team Uniform`, Logo, Sport, Colors, Reference, Quantity, Deadline, Mockup, Sample and `Create My Uniform` are present.

- [ ] **Step 2: Run and confirm failure**

```powershell
node scripts/check-v8-output.mjs --source-only
```

- [ ] **Step 3: Apply a code safety overlay after CMS resolution**

Preserve Sanity fields and non-duplicative sections. Render the shared design journey and qualification form without deleting CMS content models.

- [ ] **Step 4: Run checks and commit**

```powershell
node scripts/check-v8-output.mjs --source-only
npx tsc --noEmit
git add app/customization/page.tsx lib/cms/legacy.ts lib/v8/pages.ts scripts/check-v8-output.mjs
git commit -m "feat: turn customization into a design funnel"
```

---

### Task 11: Separate Factory, Manufacturing and Quality Control intent

**Files:**
- Modify: `app/factory/page.tsx`
- Modify: `app/manufacturing/page.tsx`
- Modify: `app/quality-control-process/page.tsx`
- Modify: `lib/cms/legacy.ts`
- Modify: `lib/sanity/content.ts`
- Modify: `lib/v8/pages.ts`
- Modify: `lib/v8/processes.ts`
- Test: `scripts/check-v8-output.mjs`

**Interfaces:**
- Consumes: existing CMS pages and shared process/media components.
- Produces: three non-overlapping authority pages and the approved internal path.

- [ ] **Step 1: Write failing role-boundary checks**

Factory must contain identity/capability/categories/reasons and link to Manufacturing. Manufacturing must contain eight production stages, timeline, sample-to-bulk and link to QC. QC must contain six inspection stages and Request Sample.

- [ ] **Step 2: Add duplicate-copy guards**

Assert Factory does not render the full eight-step manufacturing workflow and Manufacturing does not render the full six-step QC authority block.

- [ ] **Step 3: Run and confirm failure**

```powershell
node scripts/check-v8-output.mjs --source-only
```

- [ ] **Step 4: Implement safe page overlays and media fallbacks**

Reuse `ManufacturingTimeline`, `ProductionProof`, `QualityControl`, `VerifiedMediaPlaceholder` and `FinalCTA`. Do not select existing unverified factory images as proof.

- [ ] **Step 5: Update unique Metadata and Breadcrumbs**

Keep existing URLs/Canonicals. Metadata must match the separate intents and avoid duplicated title/description pairs.

- [ ] **Step 6: Run checks and commit**

```powershell
node scripts/check-v8-output.mjs --source-only
node scripts/check-v8-urls.test.mjs
npx tsc --noEmit
git add app/factory app/manufacturing app/quality-control-process lib/cms/legacy.ts lib/sanity/content.ts lib/v8 scripts/check-v8-output.mjs
git commit -m "feat: clarify factory manufacturing and QC journeys"
```

---

### Task 12: Complete internal linking, product CTA and SEO architecture

**Files:**
- Modify: `app/products/[slug]/page.tsx`
- Modify: `app/products/page.tsx`
- Modify: `app/solutions/page.tsx`
- Modify: `app/resources/page.tsx`
- Modify: `components/cms/ArticleTemplate.tsx`
- Modify: `components/seo/GEOStructuredData.tsx`
- Modify: `app/sitemap.ts`
- Modify: `lib/navigation.ts`
- Test: `scripts/check-v8-urls.test.mjs`
- Test: `scripts/check-v8-output.mjs`

**Interfaces:**
- Consumes: approved URL graph, existing Schema and buyer pages.
- Produces: consistent page→process→QC→inquiry links, new buyer routes in Sitemap and truthful Schema.

- [ ] **Step 1: Add failing output link and Sitemap checks**

Assert all four buyer pages are in Sitemap, both rejected URLs are absent, product pages link to Manufacturing/QC/Sample and Homepage links to Factory.

- [ ] **Step 2: Add Schema preservation checks**

Assert one Organization, one WebSite, matching FAQPage arrays, correct Breadcrumb items and no new unsupported price/review/media properties.

- [ ] **Step 3: Run and confirm failure**

```powershell
node scripts/check-v8-urls.test.mjs
node scripts/check-v8-output.mjs --source-only
```

- [ ] **Step 4: Implement links and Schema helpers**

Extend existing helpers instead of creating a second Organization. Keep generic product facts fact-based and reuse the existing consultation fallback.

- [ ] **Step 5: Run SEO checks**

```powershell
npm run check:geo-v1
node scripts/check-v8-urls.test.mjs
node scripts/check-canonical-integrity.test.mjs
node scripts/check-guide-route-integrity.test.mjs
```

- [ ] **Step 6: Commit**

```powershell
git add app/products app/solutions/page.tsx app/resources/page.tsx app/sitemap.ts components/cms/ArticleTemplate.tsx components/seo/GEOStructuredData.tsx lib/navigation.ts scripts/check-v8-urls.test.mjs scripts/check-v8-output.mjs
git commit -m "feat: complete V8 SEO and conversion linking"
```

---

### Task 13: Validate mobile, accessibility and performance boundaries

**Files:**
- Modify: `scripts/check-v8-mobile-layout.test.mjs`
- Modify: `scripts/check-v8-accessibility.test.mjs`
- Modify: `app/globals.css`
- Modify: affected `components/v8/*.tsx` only when a check demonstrates a defect

**Interfaces:**
- Consumes: built V8 pages.
- Produces: automated source/output guards plus browser acceptance at the three approved viewports.

- [ ] **Step 1: Add failing mobile assertions**

Check no document-level horizontal overflow, H1 and primary copy stay inside the viewport, Homepage primary CTA is above the sticky bar, buyer cards fit, form inputs are at least 44 px high and page bottom padding clears the sticky CTA.

- [ ] **Step 2: Add accessibility assertions**

Check one H1, labels for every field, associated error messages, keyboard focus styles, ordered process semantics, descriptive media fallback and no empty link/button names.

- [ ] **Step 3: Build and verify initial failures**

```powershell
npm run build
node scripts/check-v8-mobile-layout.test.mjs
node scripts/check-v8-accessibility.test.mjs
```

- [ ] **Step 4: Make the smallest responsive fixes**

Only adjust shared V8 components and required global spacing. Do not add unrelated P2 redesigns.

- [ ] **Step 5: Browser acceptance**

Validate Homepage, Basketball, Customization, Manufacturing, QC and one Buyer Page at:

```text
390×844
375×812
360×800
```

- [ ] **Step 6: Commit**

```powershell
git add app/globals.css components/v8 scripts/check-v8-mobile-layout.test.mjs scripts/check-v8-accessibility.test.mjs
git commit -m "fix: validate V8 mobile and accessibility"
```

---

### Task 14: Run the full release candidate verification and write the final report

**Files:**
- Create: `POXIOL_V8_Final_Report.md`
- Modify: `POXIOL_V8_Audit_Report.md` only to append verified implementation status
- Verify: all V8, GEO, CMS, route, analytics and build checks

**Interfaces:**
- Consumes: complete feature branch and generated `out/`.
- Produces: review-ready branch, Preview validation evidence and no Production deployment.

- [ ] **Step 1: Run focused V8 checks**

```powershell
npm run check:v8
```

Expected: PASS.

- [ ] **Step 2: Run the full existing suite**

```powershell
npm test
```

Expected: PASS, including the restored public inquiry integrity contract.

- [ ] **Step 3: Run the production build**

```powershell
npm run build
```

Expected: compile, type checking, route generation, redirects and Sitemap complete without error.

- [ ] **Step 4: Run rendered-output validation**

```powershell
npm run check:geo-v1:output
node scripts/check-v8-output.mjs
node scripts/check-sitemap-output.mjs
npm run check:canonical
```

- [ ] **Step 5: Validate Git scope**

```powershell
git status --short
git diff --check main...HEAD
git diff --stat main...HEAD
git diff --name-only main...HEAD
```

Confirm no generated output, cache, secrets, CMS export, Dataset data or unverified media entered the branch.

- [ ] **Step 6: Write `POXIOL_V8_Final_Report.md`**

Include:

1. Architecture summary
2. Pages modified
3. New pages
4. Components created
5. Placeholder locations
6. Required future assets
7. Components ready for media replacement
8. Redirect and internal links
9. SEO/GEO impact
10. Conversion and form impact
11. Mobile/accessibility/performance results
12. Build and test results
13. Remaining recommendations

- [ ] **Step 7: Commit the report**

```powershell
git add POXIOL_V8_Audit_Report.md POXIOL_V8_Final_Report.md
git commit -m "docs: add POXIOL V8 implementation report"
```

- [ ] **Step 8: Stop before merge and deployment**

Provide the branch, commit list, changed files, Preview URL if approved separately, test evidence and known issues. Do not merge, push, create a PR or deploy Production without the next explicit approval.
