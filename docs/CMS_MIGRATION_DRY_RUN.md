# POXIOL CMS Migration Dry Run

This is a deterministic, non-destructive dry run. It reads local legacy source files only, builds in-memory Sanity document candidates, validates the plan, and writes report artifacts. It does not contact Sanity, read tokens, upload assets, modify datasets, run Seed, run Dataset Import, or modify Cloudflare.

Dry run hash: `11bd3b730c0fd0d4daf23b585d3624c248214fd893525dc87e18bdeaead2f2c1`

## Source inventory

| Source | Count |
| --- | ---: |
| homepageSportCategoryCards | 12 |
| productCategories | 5 |
| customSportLandingPages | 21 |
| productsOrProductTypes | 17 |
| caseStudies | 5 |
| faqGroupsFromFaq | 6 |
| faqItemsFromFaq | 22 |
| faqGroupsFromB2bFaq | 3 |
| faqItemsFromB2bFaq | 9 |
| contactFaqItems | 4 |
| guidesFromGuidesData | 4 |
| buyingGuides | 4 |
| resources | 6 |
| pseoSeoArticles | 21 |
| authors | 1 |
| coreSitePages | 11 |
| navigationDocuments | 1 |
| footerDocuments | 1 |
| redirectRulesFromPublicRedirects | 0 |

## Planned documents by type

| Sanity type | Candidate count |
| --- | ---: |
| article | 35 |
| author | 1 |
| caseStudy | 5 |
| contactCard | 4 |
| faqCategory | 9 |
| faqItem | 35 |
| footerSettings | 1 |
| homepageSportCategoryCard | 12 |
| inquiryType | 7 |
| navigationSettings | 1 |
| product | 17 |
| productCategory | 5 |
| sitePage | 11 |
| siteSettings | 1 |

## Validation summary

- Created candidate count: 144
- Skipped count: 0
- Conflict count: 10
- Invalid count: 10
- Duplicate slug count: 4
- Missing SEO count: 88
- Missing image count: 35
- Missing alt count: 5
- Broken asset path count: 2
- Canonical conflicts: 0
- Route conflicts: 2

## Reference validation

- Product category references: planned via deterministic category.<slug> IDs
- FAQ category references: planned via deterministic faq-category.<slug> IDs
- Article author references: planned via author.poxiol-editorial-team fallback
- Unresolved references: 0

## Asset upload plan

- Upload performed: false
- Candidate asset references: 33
- Existing local assets: 31
- Broken local assets: 2
- Duplicate asset hash groups: 4

Detailed NDJSON and asset manifest files are generated under `tmp/cms-migration-dry-run/` and are intentionally ignored by Git.

## Manual review items

- Article slug how-to-choose-teamwear-manufacturer-china appears across article types: guide, resource.
- Article slug how-to-order-custom-basketball-uniforms appears across article types: blog, guide.
- Article slug private-label-teamwear-manufacturing appears across article types: guide, resource.
- Article slug sublimation-printing-guide appears across article types: blog, guide.
- 2 candidate documents share the deterministic ID article.how-to-choose-teamwear-manufacturer-china.
- 2 candidate documents share the deterministic ID article.how-to-order-custom-basketball-uniforms.
- 2 candidate documents share the deterministic ID article.private-label-teamwear-manufacturing.
- 2 candidate documents share the deterministic ID article.sublimation-printing-guide.
- 9 candidate documents resolve to route /products/.
- 2 candidate documents resolve to route /products/soccer-jerseys/.
- Referenced local asset does not exist: /images/poxiol-v62/projects_soccer_club_kit_launch.png.
- Referenced local asset does not exist: /images/poxiol-v62/projects_basketball_academy_uniform_program.png.
- Checkpoint A visual review is not final acceptance; these differences block final PR merge until resolved.
- Factory image count changed from 4 to 1.
- Free Mockup image count changed from 1 to 0.
- Free Mockup section count changed from 4 to 3.
- H1 changed on About, Factory, Manufacturing, Quality Control, Customization, OEM/ODM, Free Mockup, Sample Order, Get Quote, Basketball, and Soccer.
- Products section count changed from 3 to 2.
- Image candidate has no usable alt text: /images/sports-pages/basketball/hero.png.
- Image candidate has no usable alt text: /images/poxiol-v62/home_hero_v62.png.
- Image candidate has no usable alt text: /images/sports-pages/soccer/hero.png.
- Image candidate has no usable alt text: /images/poxiol-v6/manufacturing_packing_global_delivery.png.
- Image candidate has no usable alt text: /images/sports-pages/training/hero.png.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.
- Document does not have a usable meta description candidate.

## Read-only guarantees

- Sanity network access: false
- Token access: false
- Sanity dataset modified: false
- Cloudflare modified: false
- Asset upload performed: false
