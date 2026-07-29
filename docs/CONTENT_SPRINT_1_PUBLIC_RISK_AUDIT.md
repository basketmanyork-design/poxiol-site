# Content Sprint 1 Public Risk Audit

Project `oqpv1xbc`, dataset `production`; generated 2026-07-29. Strategy A keeps broader optimization Draft-only.

## Backup gate

- Path: `C:\Users\baske\poxiol-private-backups\poxiol-production-before-content-sprint-1-20260729-163129.tar.gz`
- Size: 18,320,418 bytes
- SHA-256: `41EB90017A7AF31AFC67C9BE45E6AEF4F9DB27B319D7820F3F815D333E0424E0`
- Timestamp: 2026-07-29T08:31:29.000Z

The archive exists, has non-zero size, is outside the repository, and has a 64-character SHA-256. The CLI export help command was verified; no second export was created.

## Scope and counts

Published 115, Draft 115, raw 230 (one published and one Draft record per audited item). Registered/audited counts are sitePage 11, productCategory 6, product 19, faqItem 38, article 35, caseStudy 5, procurementStandards 1; `blogPost` and `seoArticle` are zero. Read-only raw reconciliation found no additional risk family occurrence outside the records below.

No Sanity write, publish, delete, discard, asset upload, Seed, Dataset Import, or CMS-content change was performed. No document, asset, or revision was deleted.

## Finding table

| IDs / revisions | Type / slug / field | Current matching value | Frontend, JSON-LD, sitemap | Difference / decision |
| --- | --- | --- | --- | --- |
| 35 article IDs listed below; each Draft ID is `drafts.<ID>`; published/Draft revisions are separately retained in the raw read result | `article`; listed slug; `body` | `Bulk Production (15-25 Days Depending on Order Size)` | Article routes and listing cards; Article JSON-LD may expose body-derived copy; sitemap route remains | Same risk in Published and Draft (revisions differ); Draft-only/manual review. Use approved `Bulk production: 7–12 working days after sample or artwork approval`; do not alter historical case-study timelines. |
| `8acf321171a945f8` / `drafts.8acf321171a945f8`; `kqd32DnwMDSkqBnWPyf2fu` / `kqd32DnwMDSkqBnWPyMs18` | `sitePage` / `factory` / `seo.metaDescription` | `Visit the POXIOL teamwear factory. 15+ years experience, 30,000+ monthly capacity.` | `/factory/` metadata; JSON-LD metadata impact; sitemap indexed | Same; publish-safe correction: remove unsupported capacity claim. |
| `faq-58b766260485677a` / `drafts.faq-58b766260485677a`; `C90lXvqhCRFE4tCBds9BKg` / `C90lXvqhCRFE4tCBdqZzqo` | `faqItem` / `what-ink-technology-is-used-for-poxiol-sublimation` / `answer[0].children[0].text` | `We use high-grade Italian KIAN ink and Japanese EPSON print heads.` | FAQ route/UI and FAQPage JSON-LD; noindex/excluded sitemap | Same; publish-safe correction: remove brand/equipment and performance guarantees; use neutral controlled-process wording. |
| `product-category-soccer-mvp` / `drafts.product-category-soccer-mvp`; `C90lXvqhCRFE4tCBdst34w` / `eJ7skWqptDvdh6OpbTcoab` | `productCategory` / `soccer-kits` / `heroDescription` | `Draft category content for custom soccer jerseys and shorts.` | Products category card/detail route; Product-category sitemap impact depends mapper | Same; manual review before a visibility change. |

### 15-25 Days

35 Published articles and their Draft twins carry the exact body sentence above. The IDs/slugs are: `1a4beee0b08c447b`/`oem-soccer-apparel-manufacturer`, `1acc9d32e8864706`/`sublimation-printing-guide`, `2388a6983a6749ad`/`custom-baseball-jerseys-for-clubs`, `2cd8d1d866944b0b`/`custom-teamwear-new-york`, `2db6595af05b4e9f`/`private-label-teamwear-manufacturing`, `34b07755040843b8`/`school-basketball-uniform-order-checklist`, `3900f85e30c74441`/`custom-basketball-jerseys-melbourne`, `3b755c5ec256421a`/`oem-volleyball-apparel-manufacturer`, `3dd3f85d023143d5`/`how-to-choose-a-teamwear-manufacturer`, `4a3889e2e6d1405d`/`soccer-teamwear-supplier-uk`, `4ac9e2e2eb6149b0`/`teamwear-manufacturer-evaluation-checklist`, `4d1d7e4b47094557`/`custom-soccer-uniforms-for-academies`, `4d483268e5a1428e`/`best-sportswear-fabrics`, `4d7bbe57713f4522`/`sports-uniform-fabric-guide`, `56e5833532ce4262`/`teamwear-sample-approval-checklist`, `58cc84bcbce544b9`/`custom-basketball-uniform-manufacturer-guide`, `59dd3d86161c4c96`/`custom-sports-apparel-distributor`, `5b8c25a077a24255`/`basketball-uniform-size-guide`, `5df7417df6e44eb4`/`custom-basketball-uniform-fabric-gsm`, `69a3eb85420a43b6`/`soccer-teamwear-supplier-usa`, `7051bee69c564b25`/`custom-basketball-uniforms-for-schools`, `71674287d04f4461`/`oem-vs-odm-sportswear`, `87c9e4a99a064048`/`oem-basketball-apparel-manufacturer`, `8f9baf0284bd4513`/`b2b-sourcing-faq`, `93770d475f374564`/`custom-soccer-kits-wholesale-guide`, `96636fb2fea64bad`/`soccer-jersey-buying-guide`, `9a8f9472c1484a04`/`custom-soccer-kits-london`, `9f01531eac5844f8`/`custom-teamwear-moq-production-time`, `ac118ecd57c74a80`/`how-to-order-custom-basketball-uniforms`, `cb591874158c4428`/`soccer-jersey-supplier-australia`, `e65bf3aad1db4481`/`private-label-teamwear-launch-checklist`, `eeddf3fde684446c`/`how-sublimation-printing-works-for-teamwear`, `f01c3f9ef9d14bc8`/`how-to-choose-teamwear-manufacturer-china`, `f1550549e7154f6f`/`custom-volleyball-uniforms-for-schools`, and `f68d4d8d1cc74350`/`oem-baseball-apparel-manufacturer`.

`7-21 days` and `10-14 days` (ASCII or en dash) had zero matches. The 35 are not case studies, so the historical-timeline exception did not apply.

### 30,000+ units monthly

One indexed Factory page SEO field has `30,000+ monthly capacity`; it is public metadata and needs removal, not a substitute capacity claim.

### KIAN ink and EPSON print heads

One FAQ has both strings in the same portable-text sentence. It is noindex/excluded from sitemap but still a public route and FAQPage JSON-LD consumer; correct the existing Draft, verify Preview, then publish individually if accepted.

### MVP Soccer category

`product-category-soccer-mvp` (`soccer-kits`) is a published duplicate/test category: display order 20, 2 incoming references, and visible Draft-category wording. The authoritative `soccer-jerseys` category is `2c48bf03e89d4274`, display order 1, featured, and has 8 incoming references. Do not hide/delete the MVP category until the two incoming references and frontend list-mode behavior are reviewed; treat it as manual-review, not immediately publish-safe.
