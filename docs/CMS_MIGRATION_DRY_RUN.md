# POXIOL CMS Migration Dry Run

This deterministic dry run is read-only. It reads local legacy source files, compares planned document types against the registered local Studio schema, writes ignored temporary artifacts, and produces summary reports. It does not query Sanity, read tokens, write Sanity documents, upload assets, run Seed, run Dataset Import, modify Cloudflare, deploy schema, or deploy Studio.

Dry run hash: `aed8d140b033b3aa59e4a1d7e2328ee728e9a067cc176d7f2d0e9e84ff2f7d6d`

## Local Candidate Inventory

| Source | Count |
| --- | ---: |
| homepageSportCategoryCards | 12 |
| productCategories | 5 |
| productsOrProductTypes | 17 |
| caseStudies | 5 |
| faqItems | 35 |
| articles | 35 |
| coreSitePages | 11 |
| contactCardsEmbeddedIntoSitePage | 4 |
| inquiryTypesEmbeddedIntoSitePages | 7 |

## Existing Sanity Draft Inventory

| Type | Count |
| --- | ---: |
| article | 1 |
| author | 1 |
| caseStudy | 6 |
| faqCategory | 9 |
| faqItem | 34 |
| procurementStandards | 1 |
| product | 2 |
| productCategory | 2 |
| siteSettings | 1 |

## Existing Published Inventory

| Type | Count |
| --- | ---: |
| article | 0 |
| author | 0 |
| caseStudy | 0 |
| faqCategory | 0 |
| faqItem | 0 |
| footerSettings | 0 |
| navigationSettings | 0 |
| procurementStandards | 0 |
| product | 0 |
| productCategory | 0 |
| redirectRule | 0 |
| sitePage | 0 |
| siteSettings | 0 |

Published business document count is currently 0.

## Corrected Planned Documents by Type

| Sanity type | Candidate count |
| --- | ---: |
| article | 34 |
| author | 1 |
| caseStudy | 5 |
| faqCategory | 9 |
| faqItem | 35 |
| footerSettings | 1 |
| navigationSettings | 1 |
| procurementStandards | 1 |
| product | 17 |
| productCategory | 5 |
| sitePage | 11 |
| siteSettings | 1 |

Corrected candidate count: 121
Unsupported schema type count: 0
Unsupported schema types: none

## ID Strategy Correction

- Stable dry-run key: `candidateKey`
- Singleton final IDs: `footerSettings`, `navigationSettings`, `procurementStandards`, `siteSettings`
- Ordinary document final IDs: Sanity-generated IDs; candidates use legacyKey/legacySource/legacyRoute for deterministic matching.
- Relationship references must not use predicted refs. A future real import must first match or create target drafts, capture real IDs, then attach references.
- Migratable documents include `legacyKey`, `legacySource`, and `legacyRoute` for matching and audit; these are not buyer-facing fields.

## Reconciliation Summary

- Reuse existing drafts: 2
- Update existing drafts: 40
- Create new drafts: 79
- Duplicate existing: 0
- Obsolete MVP candidates: 10
- Corrupted existing: 5
- Manual review count: 19

## Conflict Summary

- Route conflict count: 0
- Article conflict count: 0

### Article conflict plan

- `how-to-choose-teamwear-manufacturer-china`: authoritative `/guides/how-to-choose-teamwear-manufacturer-china/`; Resource candidate renamed to teamwear-manufacturer-evaluation-checklist; no redirect is generated because this is a migration candidate, not a confirmed published legacy URL.
- `private-label-teamwear-manufacturing`: authoritative `/guides/private-label-teamwear-manufacturing/`; Resource candidate renamed to private-label-teamwear-launch-checklist; no redirect is generated because this is a migration candidate, not a confirmed published legacy URL.
- `how-to-order-custom-basketball-uniforms`: authoritative `/guides/how-to-order-custom-basketball-uniforms/`; Blog/PSEO candidate is highly overlapping with the guide and is marked merged_into_authoritative_article, so it is not emitted as a second article document.
- `sublimation-printing-guide`: authoritative `/guides/sublimation-printing-guide/`; Distinct blog candidate uses slug how-sublimation-printing-works-for-teamwear.

## Content Quality Findings

- Missing SEO count: 0
- Missing alt count: 0
- Broken asset count: 0

### Missing SEO

- None.

### Missing Alt

- None.

### Broken Asset Paths

- None.

## Manual Review Items


- Existing corrupted case studies: 5 titles contain mojibake and 5 lack valid slugs.
- Existing MVP drafts must be reviewed manually; automatic discard/publish/update is forbidden.

## Read-only guarantees

- Sanity network access: false
- Token access: false
- Sanity dataset modified: false
- Cloudflare modified: false
- Schema deployed: false
- Asset upload performed: false
