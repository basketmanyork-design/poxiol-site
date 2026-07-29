# POXIOL Buyer Knowledge Base Batch 1 Design

## Objective

Create five high-commercial-value B2B buyer knowledge assets as Sanity Drafts without publishing, duplicating search intent, changing established URLs, inventing evidence, or modifying Production content.

The batch uses the approved strategy:

> Existing URL Upgrade + New High-Level Knowledge Assets

## Safety Boundaries

- All article and supporting-author changes remain Draft-only.
- Do not publish, delete, discard, or replace Published documents.
- Do not run Seed or Dataset Import.
- Do not upload assets.
- Do not invent people, customers, results, certifications, equipment, capacity, or performance data.
- Use only approved procurement standards:
  - Sample MOQ: 1 set.
  - Sample production: 2–3 working days after mockup approval.
  - Bulk production: 7–12 working days after sample or artwork approval.
  - Bulk timing remains subject to confirmed scope and production schedule.
  - Quality control: inspection before shipment.
  - Size tolerance: ±2 cm.
- Existing Published case-study pages may be referenced, but the guides must not add or restate unverified case facts.
- Every mutation must use an expected revision guard and target one Draft document at a time.
- No token, credential, authorization header, or raw Sanity error response may be logged or committed.

## Document Plan

### Existing Draft upgrades

#### Custom Basketball Uniform Buying Guide

- Existing Published ID: `ac118ecd57c74a80`
- Draft ID: `drafts.ac118ecd57c74a80`
- Existing slug: `how-to-order-custom-basketball-uniforms`
- Article type: `guide`
- Canonical route: `https://www.poxiol.com/guides/how-to-order-custom-basketball-uniforms/`
- Preserve the existing document identity, slug, article type, route, and Published revision.
- Upgrade only the Draft overlay.

#### Custom Soccer Jersey Buying Guide

- Existing Published ID: `96636fb2fea64bad`
- Draft ID: `drafts.96636fb2fea64bad`
- Existing slug: `soccer-jersey-buying-guide`
- Article type: `blog`
- Canonical route: `https://www.poxiol.com/blog/soccer-jersey-buying-guide/`
- Preserve the existing document identity, slug, article type, route, and Published revision.
- Upgrade only the Draft overlay.

The existing route is under `/blog/` because the current document type is `blog`. Moving it to `/guides/` would violate the approved keep-URL rule.

#### Custom Teamwear MOQ and Production Time Guide

- Existing Published ID: `9f01531eac5844f8`
- Draft ID: `drafts.9f01531eac5844f8`
- Existing slug: `custom-teamwear-moq-production-time`
- Article type: `resource`
- Canonical route: `https://www.poxiol.com/resources/custom-teamwear-moq-production-time/`
- Preserve the existing document identity, slug, article type, route, and Published revision.
- Upgrade only the Draft overlay.

### New Draft articles

#### Custom Teamwear Manufacturer Buying Guide

- Draft ID: `drafts.article.custom-teamwear-manufacturer-buying-guide`
- Reference ID after a later approved publish: `article.custom-teamwear-manufacturer-buying-guide`
- Slug: `custom-teamwear-manufacturer-buying-guide`
- Article type: `guide`
- Canonical route: `https://www.poxiol.com/guides/custom-teamwear-manufacturer-buying-guide/`

#### Teamwear Quality Control Checklist

- Draft ID: `drafts.article.teamwear-quality-control-checklist`
- Reference ID after a later approved publish: `article.teamwear-quality-control-checklist`
- Slug: `teamwear-quality-control-checklist`
- Article type: `guide`
- Canonical route: `https://www.poxiol.com/guides/teamwear-quality-control-checklist/`

## Supporting Author Drafts

The current dataset contains only `POXIOL Editorial Team`. Create two approved team-identity Drafts:

- `drafts.author.poxiol-production-team`
  - Name: `POXIOL Production Team`
  - Role: `Teamwear Production and Sourcing Team`
  - Brand: `POXIOL`
  - Active: `true`
- `drafts.author.poxiol-quality-control-team`
  - Name: `POXIOL Quality Control Team`
  - Role: `Teamwear Quality Control Team`
  - Brand: `POXIOL`
  - Active: `true`

References use the non-draft base IDs:

- `author.poxiol-production-team`
- `author.poxiol-quality-control-team`

Author allocation:

- Manufacturer, Basketball, Soccer and MOQ guides: `POXIOL Production Team`
- Quality Control Checklist: `POXIOL Quality Control Team`
- Reviewer for all five: `POXIOL Production Team`

No personal names, biographies, credentials, or avatars are invented.

## Content Structure

Each guide contains the following visible editorial sections:

1. Direct Answer
2. Buyer Type
3. Key Specifications
4. Procurement Checklist
5. Common Mistakes
6. Sample Process
7. Production Timeline
8. Quality Control Process
9. Procurement Risk Notes
10. FAQ
11. Related Products
12. Related Case Studies
13. CTA

The body uses the registered `portableText` schema:

- Heading blocks for section hierarchy.
- Paragraph and list blocks for explanations and checklists.
- `tableBlock` for buyer parameters and comparison tables.
- `callout` with warning tone for procurement risks.

FAQ remains structured through `faqReferences`; this ensures the same FAQ content can be rendered visibly and emitted as FAQPage JSON-LD.

## Search Intent Map

| Asset | Primary intent | Primary keyword | Secondary keywords |
| --- | --- | --- | --- |
| Manufacturer Guide | Broad supplier evaluation | custom teamwear manufacturer buying guide | choose teamwear manufacturer, teamwear supplier checklist, sportswear factory evaluation |
| Basketball Guide | Basketball-specific buying | custom basketball uniform buying guide | basketball jersey manufacturer, basketball uniform specifications, custom basketball team sets |
| Soccer Guide | Soccer-specific buying | custom soccer jersey buying guide | soccer kit manufacturer, custom soccer kit specifications, football jersey sourcing |
| MOQ Guide | MOQ and production timeline | custom teamwear MOQ | sample production time, teamwear production timeline, custom sportswear lead time |
| QC Checklist | Quality assurance | teamwear quality control checklist | sportswear QC inspection, custom uniform quality checklist, pre-shipment apparel inspection |

The Direct Answer and headings must maintain these separate intents. Content must not reuse identical introductions, checklists, FAQ sets, metadata, or conclusion copy across the five assets.

## SEO and Structured Data

Each Draft receives:

- A unique `seo.seoTitle`, no longer than 70 characters.
- A unique `seo.metaDescription`, between 20 and 180 characters.
- An explicit HTTPS `seo.canonicalUrl` matching the established or approved route.
- One unique focus keyword and a non-overlapping secondary keyword set.
- `seo.schemaType = "Article"`.
- `seo.indexStatus = "index"` for editorial review; Draft visibility rules keep it off Production.
- `structuredDataType = "Article"`.
- Open Graph title and description matching the page intent.
- `lastReviewedAt` set at write time.
- Existing `publishedAt` preserved for upgraded documents.
- New Drafts do not receive a `publishedAt` value.

BreadcrumbList and Article JSON-LD are generated by the existing Article template. FAQPage is emitted only when `faqReferences` resolves to visible FAQ content.

## FAQ Reuse Policy

Do not create new FAQ documents in Batch 1. Reuse existing Published FAQ documents where the question matches the guide intent and the answer complies with the approved procurement standards.

Do not reference:

- `faq-58b766260485677a` (`What ink technology is used for POXIOL sublimation?`)
- Any FAQ containing unverified equipment brands, production claims, trademarks, or obsolete procurement parameters.
- MVP FAQ documents when an approved non-MVP equivalent exists.

The implementation plan will define a deterministic, ordered FAQ reference set for each article and validate the referenced answer text before mutation.

## Related Products

Only reference existing non-MVP Published product documents. Exclude:

- `product-basketball-mvp`
- `product-soccer-mvp`

Recommended product clusters:

- Manufacturer Guide: basketball jerseys, soccer jerseys, training tops.
- Basketball Guide: basketball jerseys, basketball shorts, reversible jerseys, full team sets.
- Soccer Guide: soccer jerseys, soccer shorts, team socks, goalkeeper kits.
- MOQ Guide: full basketball team sets, soccer jerseys, training tops.
- QC Checklist: representative basketball, soccer and training-wear products.

Each reference must be resolved to an existing base document ID before writing.

## Related Case Studies

Use only existing Published case-study pages:

- `case-study-case-003` — basketball program
- `case-study-case-002` — soccer kit project
- `case-study-case-001` — multi-sport program
- `case-study-case-004` — distributor teamwear program, where broad sourcing context is needed

The current case documents do not have complete `realOrExample` or `evidenceStatus` metadata. The guides may link to the existing pages but must not repeat customer, result, volume, timeline, or testimonial claims from them. Evidence classification remains a publish-review item.

## CTA Policy

Each guide uses an existing internal route:

- Primary CTA: `/get-quote/`
- Supporting CTA where contextually relevant: `/free-mockup/`

CTA labels remain buyer-focused and do not promise results or timelines.

## Mutation Workflow

1. Query all target slugs, Canonicals, Published IDs, Draft IDs, authors, FAQ IDs, product IDs and case IDs.
2. Abort on duplicate slug, duplicate Canonical, unexpected article type, missing target, or revision change.
3. Run a dry-run mutation plan that outputs only document IDs, revisions, field paths and counts.
4. Create the two supporting author Drafts one at a time.
5. Upgrade the three existing article Drafts one at a time using their current Draft revisions.
6. Create the two new article Drafts one at a time with deterministic IDs.
7. Query all seven Drafts back using the Draft perspective.
8. Confirm zero Published document revisions changed.

No bulk replace or transaction spanning multiple documents is allowed.

## Validation

### Identity and visibility

- Exactly five target article Drafts exist.
- The three upgrades retain existing base IDs, slugs and article types.
- The two new assets have deterministic Draft IDs.
- All five have `publishStatus = "draft"`.
- No new Published article or author document exists.

### Content

- Every required content section is present.
- Direct Answer is the first substantive section.
- Each article contains a parameter table, checklist, FAQ references, procurement-risk callout and CTA.
- Only approved procurement parameters appear.
- No obsolete `15–25 Days`, `7–21 days`, or `10–14 days` values appear.
- No KIAN, EPSON, unsupported capacity, certification, customer-count, result or testimonial claims appear.
- No invented author, customer, case, certification or measurement appears.

### SEO and GEO

- Five unique primary keyword intents.
- Five unique SEO titles and descriptions.
- Five unique Canonicals with no dataset conflict.
- Breadcrumb and Article schema requirements are supported.
- FAQPage is supported only by visible referenced FAQ content.
- Direct Answer, parameter table, checklist, FAQ and risk notes are present.

### Links and references

- All product, case, FAQ and author references resolve in Draft perspective.
- No MVP product or risky FAQ reference is used.
- Internal CTA routes exist.
- Existing URLs and Canonicals remain unchanged for upgraded documents.

### Safety

- Published article count and revisions remain unchanged.
- No publish, delete, asset upload, Seed or Dataset Import occurs.
- No secret is printed, saved, or committed.
- GA4 and Cloudflare configuration remain untouched.

## Known Publish Blockers

These Drafts can be ready for editorial review without being ready to publish:

1. The current Cloudflare Draft Preview has a static-export incompatibility: `cache: no-store` makes Preview pages dynamic under `output: export`.
2. The current frontend Article resolver flattens Portable Text and does not render `tableBlock` as a visible table.
3. Existing related case studies require evidence-status review before their links are approved for publication.

The implementation must report these blockers and must not publish automatically.
