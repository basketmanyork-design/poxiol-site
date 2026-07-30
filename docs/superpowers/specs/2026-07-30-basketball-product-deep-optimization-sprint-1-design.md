# Basketball Product Deep Optimization Sprint 1 Design

**Status:** Proposed for implementation approval
**Date:** 2026-07-30
**Target route:** `https://www.poxiol.com/products/basketball-uniforms/`
**Content workflow:** Draft -> Preview -> Validation -> Controlled Publish

## 1. Goal

Upgrade the existing Basketball category page into a B2B basketball-uniform buying decision page while preserving its URL, black/white/lime visual system, Header, Footer, GA4 integration, static export architecture, and current page skeleton.

The optimized page must help clubs, schools, academies, brands, distributors, and other B2B buyers evaluate product options, customization, fabrics, sampling, production, quality control, cases, and next actions without relying on unverified claims.

## 2. Scope and Non-Goals

### In scope

- Strengthen the Hero with a direct answer, proof points, and two CMS-managed CTAs.
- Present CMS-managed buyer types and basketball solutions.
- Use independently managed Product documents for product cards.
- Present customization and fabric decision information.
- Resolve approved procurement parameters from the `procurementStandards` singleton.
- Present a CMS-managed manufacturing process and buyer checklist.
- Reuse existing FAQ, Case Study, and Guide documents through references.
- Render the page CTA from the Basketball category.
- Keep visible FAQ content and FAQPage JSON-LD on the same resolver result.
- Keep Product, Service, BreadcrumbList, and FAQPage JSON-LD aligned with visible content.
- Create and validate Draft changes before any Controlled Publish.

### Out of scope

- No new `sitePage` document for Basketball.
- No duplicate Product, FAQ, Case Study, Guide, or procurement fields.
- No URL, canonical-path, Header, Footer, brand visual, GA4, Cloudflare architecture, or Production environment changes.
- No new claims about capacity, equipment brands, certifications, customer counts, or performance results without evidence.
- No deletion of existing documents or assets.
- No automatic publication.

## 3. Current-State Findings

The current route already uses `SportsLandingPage` and preserves the intended black/white/lime visual system. The page includes Hero, procurement table, buyer cards, customization evidence, product/design cards, FAQ, related guides, and a bottom CTA.

The current Published Basketball `productCategory` is shallow:

- It has a title, description, introduction, hero image, and `publishStatus`.
- It does not currently provide buyer types, product types, decision modules, FAQ references, Case references, Guide references, SEO, or visibility controls.

Four Published Basketball Product documents exist, but their copy and option fields are repetitive. Their Product-specific media, related content, display order, CTA, and SEO coverage are incomplete.

The frontend therefore gets much of its current depth from `lib/sports-pages.ts`. Sprint 1 replaces that dependency for the optimized Basketball page while retaining legacy data only as emergency fallback when a Sanity request fails.

## 4. Content Ownership

| Content | Authoritative source | Rule |
|---|---|---|
| Basketball Hero, direct answer, proof points, page module order, page CTAs | Basketball `productCategory` | Do not create a duplicate `sitePage`. |
| Product names, descriptions, images, fabrics, customization, Product SEO | Existing `product` documents | Product fields remain independently managed. |
| Sample MOQ, sample time, bulk time, QC, size tolerance, mixed sizes | `_id == "procurementStandards"` | Never duplicate these values in the category or Product drafts. |
| FAQ question and answer | Existing `faqItem` documents | Category stores ordered `faqReference` values only. |
| Case facts and media | Existing `caseStudy` documents | Category stores references only. |
| Buying-guide content | Existing `article` documents | Category stores references only. |
| Header, Footer, email, WhatsApp | Existing global CMS settings | No Basketball-specific copies. |
| Legacy page data | `lib/sports-pages.ts` | Emergency fallback only when the Sanity request fails. |

## 5. `productCategory` Schema Extension

### 5.1 Fields added to `productCategory`

Add the following fields to the existing `content` and `display` groups:

```ts
defineField({
  name: 'heroProofPoints',
  title: 'Hero proof points',
  type: 'array',
  of: [{type: 'string'}],
  group: 'content',
  validation: (Rule) => Rule.max(6),
})

defineField({
  name: 'decisionSections',
  title: 'Buying decision sections',
  type: 'array',
  of: [{type: 'pageSection'}],
  group: 'content',
})

defineField({
  name: 'primaryCta',
  title: 'Primary CTA',
  type: 'callToAction',
  group: 'display',
})

defineField({
  name: 'secondaryCta',
  title: 'Secondary CTA',
  type: 'callToAction',
  group: 'display',
})

defineField({
  name: 'bottomCta',
  title: 'Bottom CTA',
  type: 'callToAction',
  group: 'display',
})
```

The existing fields remain authoritative for:

- `heroTitle`
- `heroDescription`
- `introduction`
- `heroImage`
- `buyerTypes`
- `productTypes`
- `keyFeatures`
- `coreBenefits`
- `relatedFaqs`
- `relatedCaseStudies`
- `relatedGuides`
- visibility, ordering, publication status, and SEO

### 5.2 `decisionSections` usage

The Basketball category uses existing `pageSection` objects with the following deterministic section types:

| Section type | Basketball use | Fields |
|---|---|---|
| `featureGrid` | Buyer solutions | `eyebrow`, `title`, `body`, `steps` |
| `featureGrid` | Customization and fabric decisions | `eyebrow`, `title`, `body`, `steps`, optional `image` |
| `processSteps` | Manufacturing process | `eyebrow`, `title`, `body`, `steps` |
| `buyerChecklist` | RFQ and sample-approval checklist | `eyebrow`, `title`, `body`, `facts`, `cta` |
| `caseStudies` | Case module heading and ordering context | `eyebrow`, `title`, `body`; records come from `relatedCaseStudies` |
| `faq` | FAQ module heading | `eyebrow`, `title`, `body`; answers come from `relatedFaqs` |
| `cta` | Optional supporting CTA module | `title`, `body`, `cta` |

The resolver does not accept duplicated Product, FAQ, Case, Guide, or procurement content inside these sections. It only consumes presentation copy and module structure from the section.

### 5.3 Validation rules

- `heroProofPoints`: maximum six non-empty strings.
- `decisionSections`: enabled sections require a title and unique `displayOrder`.
- `processSteps`: at least three steps when the section is enabled.
- `buyerChecklist`: at least four facts when the section is enabled.
- CTAs: internal paths must start with `/`; external URLs must use `https`.
- `relatedFaqs`, `relatedCaseStudies`, and `relatedGuides`: duplicate references are rejected.
- `publishStatus == "published"` requires `activeStatus == true`, indexable SEO, Hero alt text, SEO title, meta description, and canonical.
- Existing risk-word validation remains active.
- Extend the existing risk validation field list to cover heroProofPoints and decisionSections.

## 6. Frontend Data Contract

Extend `SportsPageData` without replacing the existing route component:

```ts
type SportsDecisionSection = {
  type: 'buyerSolutions' | 'customization' | 'manufacturingProcess' | 'buyerChecklist'
  eyebrow?: string
  title: string
  body?: string
  items: Array<{title: string; description: string}>
  facts?: string[]
  image?: {url: string; alt: string}
  cta?: {label: string; href: string}
}

type SportsProductCard = {
  slug: string
  title: string
  description: string
  image?: {url: string; alt: string}
  fabricOptions: string[]
  customizationOptions: string[]
  featured: boolean
  displayOrder: number
}
```

Add these optional fields to `SportsPageData`:

- `heroProofPoints`
- `primaryCta`
- `secondaryCta`
- `productCards`
- `decisionSections`
- `relatedCases`
- `bottomCta`

The existing fields remain so other sports category routes are not forced into this Sprint.

## 7. Resolver and Query Design

### 7.1 Query changes

Extend `productCategoryBySlugQuery` to fetch:

- `heroProofPoints`
- `decisionSections` using the existing page-section projection
- `primaryCta`
- `secondaryCta`
- `bottomCta`
- existing ordered FAQ, Case, and Guide references

Continue using the existing Product query for Product cards. Do not embed Product copies in the category query.

Fetch `procurementStandards` with:

```groq
*[_id == "procurementStandards"][0]
```

### 7.2 Basketball resolver

Introduce a focused resolver:

```ts
getBasketballDecisionPage(
  legacyData: SportsPageData,
): Promise<SportsPageData | null>
```

It composes:

1. Basketball `productCategory`
2. Published or Preview-visible Basketball Products
3. `procurementStandards`
4. Referenced FAQ items
5. Referenced Case Studies
6. Referenced Guides
7. Legacy emergency fallback

`getCmsSportsPageBySlug` remains the shared entry point. It delegates only the `basketball-uniforms` category to `getBasketballDecisionPage`; other category routes retain their existing behavior.

### 7.3 Fallback rules

- `legacy` mode never accesses Sanity.
- `sanity` mode accepts only `publishStatus == "published"`.
- `sanity-preview` accepts `draft` and `published`, but excludes `unpublished`.
- A successful Sanity response with an intentionally absent section does not restore that section from legacy.
- A network/API failure enables emergency legacy fallback.
- During `CMS_LEGACY_LIST_MODE=merge`, missing Product documents can fall back by matching Slug.
- During `strict`, a successful empty CMS result remains empty.

### 7.4 Procurement composition

The procurement table is assembled at build time:

1. Standard rows from `procurementStandards`:
   - Sample MOQ: `1 set`
   - Sample production: `2–3 working days after mockup approval`
   - Bulk production: `7–12 working days after sample or artwork approval`
   - Bulk schedule note
   - QC: inspection before shipment
   - Size tolerance: `±2 cm`
   - Mixed adult and youth sizes supported
2. Basketball-specific rows derived from Product/category data:
   - Product options
   - Fabric options
   - Printing/customization
   - Size range
   - Packaging/private label

No category or Product draft stores a second copy of the standard procurement values.

## 8. `SportsLandingPage` Extension

Keep the current section order and visual components. Changes are data-driven extensions:

1. **Hero**
   - Use CMS Hero eyebrow, H1, direct-answer description, image with CMS alt, proof points, and two CTAs.
   - Keep the current two-column layout and lime radial treatment.

2. **Procurement Standards**
   - Keep the current table/checklist layout.
   - Render singleton-derived standard rows and CMS-derived Product rows.

3. **Buyer Types / Basketball Solutions**
   - Keep the existing card grid.
   - Render the ordered `featureGrid` buyer-solutions section.

4. **Customization and Fabric**
   - Keep the current dark evidence section.
   - Render section steps and an optional CMS image.

5. **Product Cards**
   - Replace generic design cards with Product document cards.
   - Each card links to `/products/<product-slug>/`.
   - Use Product image alt, description, fabric summary, and customization summary.
   - Hide cards without a visible Product document.

6. **Manufacturing Process**
   - Add a process-step row using the existing visual vocabulary.
   - Do not claim equipment brands, capacity, certifications, or fixed results.

7. **Case References**
   - Render referenced Published/Preview-visible cases only.
   - Use existing case title, country, product context, image, and route.

8. **FAQ and Guides**
   - Render referenced FAQs and Guides.
   - FAQPage JSON-LD uses the exact rendered FAQ array.

9. **Bottom CTA**
   - Preserve the current large dark CTA treatment.
   - Render CMS label and URL with existing contact/WhatsApp/email settings.

No visual redesign, global component rewrite, or Header/Footer change is included.

## 9. SEO and Structured Data

- Canonical remains `https://www.poxiol.com/products/basketball-uniforms/`.
- Metadata uses the same category resolver as the page.
- Product Schema describes the Basketball category offer and uses visible page copy.
- Service Schema remains one instance.
- BreadcrumbList remains Home -> Products -> Basketball Uniforms.
- FAQPage is emitted only when visible referenced FAQs exist.
- Product cards do not emit duplicate top-level Product Schema on the category page.
- No Draft URL enters the Production Sitemap.
- No duplicate GA4 or Cloudflare Web Analytics loader is added.

## 10. Sanity Draft Migration Plan

### 10.1 Pre-write backup and audit

1. Export the `production` dataset to a timestamped file outside the Git repository.
2. Record backup path, size, SHA-256, project, dataset, and verification result without logging credentials.
3. Query raw and Published perspectives for:
   - Basketball category
   - Four Basketball Products
   - Candidate FAQs
   - Candidate Case Studies
   - Candidate Guides
   - `procurementStandards`
4. Record exact document IDs and revisions.
5. Stop if the backup cannot be verified or revisions change during planning.

### 10.2 Draft targets

Update Drafts for:

- Existing Basketball `productCategory`
- Existing Basketball Jerseys Product
- Existing Basketball Shorts Product
- Existing Reversible Jerseys Product
- Existing Full Team Sets Product

Do not create new Products, FAQs, Cases, Guides, or procurement documents.

### 10.3 Category Draft content

The category Draft receives:

- complete Hero and proof points
- Buyer Solutions section
- Customization/Fabric section
- Manufacturing Process section
- Buyer Checklist section
- Product, FAQ, Case, and Guide references
- primary, secondary, and bottom CTAs
- SEO and canonical
- visibility and display controls

### 10.4 Product Draft content

Each Product Draft receives only Product-owned fields:

- unique Product name, short and full description
- Product-specific image and alt
- fabric and customization options
- size/packaging details when supported by existing evidence
- related Case/Guide/FAQ references
- display order, featured flag, CTA, and SEO

No Product Draft duplicates singleton procurement standards.

## 11. Revision Guard Implementation Plan

Create two scripts:

### `scripts/audit-basketball-decision-page.mjs`

- Read-only.
- Requires no write token.
- Queries Published and Draft perspectives.
- Produces a redacted report with IDs, revisions, missing fields, duplicate references, route/canonical conflicts, unsupported claims, missing alt text, and unresolved references.
- Exits non-zero for any blocking issue.

### `scripts/apply-basketball-decision-page-drafts.mjs`

- Requires server-only `SANITY_AUTH_TOKEN`.
- Requires exact confirmation text `WRITE_BASKETBALL_DRAFTS_ONLY`.
- Contains an allowlist of the five existing target IDs.
- Uses `ifRevisionId` for every patch.
- Writes Drafts only.
- Does not call publish, unpublish, delete, create, createIfNotExists, createOrReplace, asset upload, Seed, Dataset Import, or Cloudflare APIs.
- Logs document ID, before revision, after revision, changed field paths, and timestamp.
- Never logs token values, headers, identities, or raw API bodies.

Dry Run output must list every intended field change before the write command can run.

## 12. Preview and Validation Gates

Preview uses:

- `NEXT_PUBLIC_CONTENT_SOURCE=sanity-preview`
- server-only `SANITY_READ_TOKEN`
- Draft perspective
- `useCdn=false`
- `cache=no-store`
- isolated Cloudflare Preview environment

Production remains:

- static export
- Published perspective
- CDN/cache-enabled
- no Draft token in the browser

Preview must pass:

- HTTP 200 at `/products/basketball-uniforms/`
- unchanged URL and canonical
- expected Hero, Buyer Types, Solutions, Customization, Product Cards, Procurement, Process, Checklist, FAQ, Cases, Guides, and CTA
- Product cards link to valid Product routes
- image alt coverage
- no empty modules or horizontal overflow
- visible FAQ equals FAQPage JSON-LD
- Product, Service, BreadcrumbList, and FAQPage JSON-LD validation
- no old procurement parameters or prohibited claims
- GA4 remains `G-W5YLNQ39X1` and loads once
- Cloudflare Web Analytics remains one beacon
- email and WhatsApp links remain CMS-controlled
- no Draft URL in Production Sitemap

## 13. Controlled Publish

Controlled Publish is allowed only after the Preview report has no blockers.

Publish order:

1. Four Product Drafts, one at a time
2. Basketball category Draft
3. Trigger the existing `poxiol-site` Production rebuild
4. Validate the deployment-specific URL
5. Validate `https://www.poxiol.com/products/basketball-uniforms/`

Before each publish:

- re-read current Draft revision
- verify the revision matches the approved report
- verify Slug and canonical are unchanged
- verify no prohibited claims or broken references

No bulk publish and no unrelated Draft publication are allowed.

## 14. Rollback

- Keep the external dataset backup.
- Record previous Published revisions for all five target documents.
- If Preview fails, retain Drafts and do not publish.
- If Production validation fails after publish, restore the five approved previous document snapshots as Drafts, review them, and republish only with explicit approval.
- Do not delete documents or assets.
- A Cloudflare rollback may select the previous successful `poxiol-site` Production deployment without changing architecture.

## 15. Implementation Verification

### Frontend

- `npm ci`
- `npx tsc --noEmit`
- resolver tests for Published, Preview, strict, merge, and request-failure fallback
- Basketball page structured-data tests
- `NEXT_PUBLIC_CONTENT_SOURCE=legacy npm run build`
- default Published Sanity build
- `NEXT_PUBLIC_CONTENT_SOURCE=sanity-preview npm run build` with Preview-only environment

### Studio

- `npm ci --legacy-peer-deps`
- `npx tsc --noEmit`
- `npx sanity schema validate --level error`
- `npm run build`

### Safety

- `git diff --check`
- UTF-8 scan
- Secret scan
- browser-bundle token scan
- no binary/image changes
- no mutation verbs outside the allowlisted Draft script
- no Seed or Dataset Import
- no Production writes before Controlled Publish approval

## 16. Acceptance Criteria

Sprint 1 is complete only when:

- Basketball content is fully controlled by `productCategory`, Product documents, references, and the procurement singleton.
- Legacy is emergency fallback, not the normal Published data source.
- Preview passes all visual, content, SEO, JSON-LD, analytics, and safety gates.
- Only the five approved Drafts are published.
- The Production static rebuild succeeds.
- The live Basketball page returns HTTP 200 with the approved content and unchanged URL/canonical.
- No unrelated Sanity, GA4, Cloudflare, Product page, or global visual changes occur.
