# POXIOL Production Activation Progress

This document records verified production activation checkpoints without storing tokens, private keys, deploy hooks or customer PII.

## Execution context

- Initial audited main commit: `9514a27b8def052aa93336785fadb8d63679bbf9`
- Activation PR: `#33`
- Activation merge commit: `dde6b4fcf98c6badf6f2092ed0595fd09435d133`
- Sanity project: `oqpv1xbc`
- Sanity dataset: `production`
- Studio delivery: Cloudflare Pages project `poxiol-admin`
- Frontend delivery: Cloudflare Pages project `poxiol-site`

## Backup

- Backup path: `C:\Users\baske\poxiol-private-backups\sanity-production-before-content-activation-20260727-213005.tar.gz`
- Backup size: `18320101` bytes
- Backup SHA-256: `36097daa9df8bdba67b47a7d37ce61db2d749932bbd2fde652017f1a59fddc89`
- Documents exported: 274
- Assets exported: 19
- Backup verification: passed; the archive is outside the Git repository and is non-empty
- Existing Phase 1 procurement backup remains outside the repository and was not modified

## Production content inventory

The verified export contains 137 published business documents and 137 draft variants. Production content migration was already completed by the previously merged CMS migration work, so no duplicate bulk import was performed during activation.

| Type | Published | Drafts |
| --- | ---: | ---: |
| article | 35 | 35 |
| author | 1 | 1 |
| caseStudy | 5 | 5 |
| faqCategory | 18 | 18 |
| faqItem | 38 | 38 |
| footerSettings | 1 | 1 |
| navigationSettings | 1 | 1 |
| procurementStandards | 1 | 1 |
| product | 19 | 19 |
| productCategory | 6 | 6 |
| sitePage | 11 | 11 |
| siteSettings | 1 | 1 |

- Unknown document types: 0
- Duplicate published singletons: 0
- Duplicate published slugs: 0
- Broken published references: 0
- Missing published slugs: 0
- Missing published SEO fields: 18
- Missing published image alt fields: 0
- Missing required FAQ category titles: 9

## Procurement singleton

- Published singleton count: 1
- Document ID: `procurementStandards`
- Sample MOQ: verified as 1 set
- Sample production: verified as 2–3 working days after mockup approval
- Bulk production: verified as 7–12 working days after sample or artwork approval
- Bulk production note: verified
- QC before shipment: verified
- Size tolerance: verified as ±2 cm
- Mixed adult/youth sizes: verified

## Activation status

| Checkpoint | Status |
| --- | --- |
| Root TypeScript and production build | Passed |
| CMS safety checks | Passed |
| Studio TypeScript, schema validation and build | Passed |
| Analytics Settings schema | Implemented and deployed to the Schema Registry |
| Production schema deployment | Passed via the local Studio workspace |
| Production content migration | Previously completed; duplicate import skipped |
| Reconciliation migration dry run | 121 candidates: 116 skip, 5 FAQ category conflicts, 0 create, 0 update; dataset unchanged |
| Production published inventory | Verified by full export |
| Analytics audit | Completed |
| Analytics implementation | Real GA4 Measurement ID published in the unique `analyticsSettings` singleton; production rebuild required |
| Search Console API verification | Blocked by unavailable authenticated access |
| Cloudflare API analytics/deploy-hook operations | Blocked by unavailable Cloudflare API credentials |

## Remaining risks

- Existing published content has 18 missing SEO fields.
- Nine published FAQ category documents are missing the currently required `title` field.
- Five logical FAQ category pairs use legacy/current slug variants and require manual merge review before any future migration apply.
- The `poxiol-admin` Cloudflare Pages production alias is still serving an older bundle even though the latest `main` branch preview contains Analytics Settings and Analytics Operations. Set the Pages production branch to `main`.
- Google Analytics Data API, Search Console and Cloudflare authenticated reporting require approved server-side credentials.
- Cloudflare Deploy Hook configuration cannot be changed without Cloudflare API/dashboard access.

## Final production validation

- Analytics PR: `#34`; merge commit `3c3505019805c552709c95a225bf99a1d35be298`
- Migration reconciliation PR: `#35`; merge commit `52094f6452f44230f33c2c4683b82736b7c9b71f`
- Sitemap integrity hotfix PR: `#36`; merge commit `ccfe3683f47f06b2eb137db98daaa95f51b6d375`
- Cloudflare Pages `poxiol-site`: production deployment succeeded for `ccfe3683f47f06b2eb137db98daaa95f51b6d375`
- Cloudflare Pages `poxiol-admin`: deployment succeeded for the same approved source state
- Production pages: homepage, products, projects, resources, FAQ, contact, get quote, free mockup and legal pages returned HTTP 200
- Sitemap: 89 canonical production URLs; all returned below HTTP 400; no duplicates, Draft URLs or non-canonical hosts
- Homepage FAQ: 7 visible questions; visible questions and answers matched the FAQPage JSON-LD
- Procurement values: Sample MOQ 1 set, sample production 2–3 working days and bulk production 7–12 working days verified in live HTML
- Static contact fallback: `mailto:` and `wa.me` links verified; Cloudflare email obfuscation markers absent
- Domain redirects: HTTP and apex-domain variants redirect to `https://www.poxiol.com/`
- Cloudflare Web Analytics: one beacon is present in production HTML; authenticated dashboard reporting was not available
- GA4: the unique published `analyticsSettings` singleton is configured for `G-W5YLNQ39X1`; this activation commit triggers a fresh production site build
- Draft public exposure: no Draft URL appeared in the sitemap or inspected production HTML
- Migration apply: not executed because the production dataset already contains the prior migration and five FAQ category reconciliation conflicts remain
- Sanity writes during this activation: created the unique published `analyticsSettings` singleton after a verified external dataset backup
- Deploy Hook: not configured or verified because authenticated Cloudflare project access is unavailable
- Search Console: sitemap is publicly valid, but property verification/submission status could not be authenticated
- Workers Builds: the known non-required Workers integration still fails; Cloudflare Pages is the verified production delivery path

Production activation is operational for the existing CMS content and static site delivery. GA4 is configured; final closure still requires the `poxiol-admin` Pages production branch to point to `main`, plus the previously recorded Search Console, Deploy Hook and FAQ category follow-up work.