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
| Production published inventory | Verified by full export |
| Analytics audit | Completed |
| Analytics implementation | Implemented; live collection remains disabled until a real GA4 ID is provided |
| Search Console API verification | Blocked by unavailable authenticated access |
| Cloudflare API analytics/deploy-hook operations | Blocked by unavailable Cloudflare API credentials |

## Remaining risks

- Existing published content has 18 missing SEO fields.
- Nine published FAQ category documents are missing the currently required `title` field.
- A real GA4 Measurement ID has not been provided; production analytics correctly remains disabled.
- Google Analytics Data API, Search Console and Cloudflare authenticated reporting require approved server-side credentials.
- Cloudflare Deploy Hook configuration cannot be changed without Cloudflare API/dashboard access.