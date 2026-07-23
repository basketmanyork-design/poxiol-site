# POXIOL CMS Migration Dry Run

This deterministic dry run is read-only. It reads local legacy source files, compares planned document types against the registered local Studio schema, writes ignored temporary artifacts, and produces summary reports. It does not query Sanity, read tokens, write Sanity documents, upload assets, run Seed, run Dataset Import, modify Cloudflare, deploy schema, or deploy Studio.

Dry run hash: `1d3e54cdf39dd43fa6a0289e9a6394906cbb1fb08cae398ebf3b16cc7df90ffe`

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
| article | 35 |
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

Corrected candidate count: 122
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
- Create new drafts: 80
- Duplicate existing: 0
- Obsolete MVP candidates: 10
- Corrupted existing: 5
- Manual review count: 25

## Conflict Summary

- Route conflict count: 0
- Article conflict count: 4

### Article conflict plan

- `how-to-choose-teamwear-manufacturer-china`: authoritative `/guides/how-to-choose-teamwear-manufacturer-china/`; Keep the fuller B2B guide as authoritative; rename the resource/checklist candidate or redirect the resource URL after manual approval.
- `private-label-teamwear-manufacturing`: authoritative `/guides/private-label-teamwear-manufacturing/`; Keep the guide as authoritative; convert the resource to a distinct checklist slug or redirect after manual approval.
- `how-to-order-custom-basketball-uniforms`: authoritative `/guides/how-to-order-custom-basketball-uniforms/`; Keep the ordering guide as authoritative; merge the blog/PSEO article into the guide or rename and redirect the blog URL.
- `sublimation-printing-guide`: authoritative `/guides/sublimation-printing-guide/`; Keep the technical guide as authoritative; merge or rename the blog overview and plan redirect if the blog URL is public.

## Content Quality Findings

- Missing SEO count: 20
- Missing alt count: 5
- Broken asset count: 2

### Missing SEO

- sitePage.page-about (sitePage) missing metaDescription; fallback source: app/about/page.tsx; auto-fill available: true; manual review: true
- sitePage.page-about (sitePage) missing seoTitle; fallback source: app/about/page.tsx; auto-fill available: true; manual review: true
- sitePage.page-contact (sitePage) missing metaDescription; fallback source: app/contact/page.tsx; auto-fill available: true; manual review: true
- sitePage.page-contact (sitePage) missing seoTitle; fallback source: app/contact/page.tsx; auto-fill available: true; manual review: true
- sitePage.page-customization (sitePage) missing metaDescription; fallback source: app/customization/page.tsx; auto-fill available: true; manual review: true
- sitePage.page-customization (sitePage) missing seoTitle; fallback source: app/customization/page.tsx; auto-fill available: true; manual review: true
- sitePage.page-factory (sitePage) missing metaDescription; fallback source: app/factory/page.tsx; auto-fill available: true; manual review: true
- sitePage.page-factory (sitePage) missing seoTitle; fallback source: app/factory/page.tsx; auto-fill available: true; manual review: true
- sitePage.page-free-mockup (sitePage) missing metaDescription; fallback source: app/free-mockup/page.tsx; auto-fill available: true; manual review: true
- sitePage.page-free-mockup (sitePage) missing seoTitle; fallback source: app/free-mockup/page.tsx; auto-fill available: true; manual review: true
- sitePage.page-get-quote (sitePage) missing metaDescription; fallback source: app/get-quote/page.tsx; auto-fill available: true; manual review: true
- sitePage.page-get-quote (sitePage) missing seoTitle; fallback source: app/get-quote/page.tsx; auto-fill available: true; manual review: true
- sitePage.page-manufacturing (sitePage) missing metaDescription; fallback source: app/manufacturing/page.tsx; auto-fill available: true; manual review: true
- sitePage.page-manufacturing (sitePage) missing seoTitle; fallback source: app/manufacturing/page.tsx; auto-fill available: true; manual review: true
- sitePage.page-oem-odm (sitePage) missing metaDescription; fallback source: app/oem-odm/page.tsx; auto-fill available: true; manual review: true
- sitePage.page-oem-odm (sitePage) missing seoTitle; fallback source: app/oem-odm/page.tsx; auto-fill available: true; manual review: true
- sitePage.page-quality-control-process (sitePage) missing metaDescription; fallback source: app/quality-control-process/page.tsx; auto-fill available: true; manual review: true
- sitePage.page-quality-control-process (sitePage) missing seoTitle; fallback source: app/quality-control-process/page.tsx; auto-fill available: true; manual review: true
- sitePage.page-sample-order (sitePage) missing metaDescription; fallback source: app/sample-order/page.tsx; auto-fill available: true; manual review: true
- sitePage.page-sample-order (sitePage) missing seoTitle; fallback source: app/sample-order/page.tsx; auto-fill available: true; manual review: true

### Missing Alt

- /images/sports-pages/basketball/hero.png (productCategory.category-basketball-uniforms); candidate alt: Custom basketball uniforms hero image
- /images/sports-pages/soccer/hero.png (productCategory.category-soccer-jerseys); candidate alt: Custom soccer kits hero image
- /images/sports-pages/training/hero.png (productCategory.category-training-wear); candidate alt: Custom training wear hero image
- /images/poxiol-v62/home_hero_v62.png (sitePage.page-homepage); candidate alt: POXIOL custom teamwear manufacturing hero image
- /images/poxiol-v6/manufacturing_packing_global_delivery.png (sitePage.page-manufacturing); candidate alt: POXIOL packing and global delivery process image

### Broken Asset Paths

- /images/poxiol-v62/projects_soccer_club_kit_launch.png (caseStudy.case-study-australia-soccer-club-kit-project); recommended: /images/poxiol-v62/project_soccer_club_v62.png
- /images/poxiol-v62/projects_basketball_academy_uniform_program.png (caseStudy.case-study-usa-basketball-academy-uniform-program); recommended: manual search required

## Manual Review Items

- Checkpoint A visual review is not final acceptance; these differences block final PR merge until resolved.
- H1 changed on About, Factory, Manufacturing, Quality Control, Customization, OEM/ODM, Free Mockup, Sample Order, Get Quote, Basketball, and Soccer.
- Factory image count changed from 4 to 1.
- Free Mockup image count changed from 1 to 0.
- Products section count changed from 3 to 2.
- Free Mockup section count changed from 4 to 3.
- Existing corrupted case studies: 5 titles contain mojibake and 5 lack valid slugs.
- Existing MVP drafts must be reviewed manually; automatic discard/publish/update is forbidden.

## Read-only guarantees

- Sanity network access: false
- Token access: false
- Sanity dataset modified: false
- Cloudflare modified: false
- Schema deployed: false
- Asset upload performed: false
