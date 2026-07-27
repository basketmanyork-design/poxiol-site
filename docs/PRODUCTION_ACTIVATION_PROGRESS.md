# POXIOL Production Activation Progress

This document records production activation checkpoints without storing tokens, private keys, deploy hooks or customer PII.

## Execution context

- Initial main commit: `9514a27b8def052aa93336785fadb8d63679bbf9`
- Activation branch: `feature/production-activation-content-analytics`
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
- Backup verification: passed; archive exists outside the Git repository and is non-empty
- Existing Phase 1 backup retained: `sanity-procurementStandards-before-phase1-20260727-124500.json`

## Current production inventory

The verified export contains 137 published business documents and 137 draft variants:

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

Because production already contains migrated published and draft content, a new migration apply must reconcile by stable source identity and must not perform an empty-dataset import.

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
| Root TypeScript baseline | Passed |
| Root production build baseline | Passed |
| CMS safety checks baseline | Passed |
| Studio TypeScript baseline | Passed |
| Sanity schema validation baseline | Passed |
| Studio build baseline | Pending rerun with approved local Sanity config access |
| Analytics Settings schema | Implemented locally; not deployed |
| Production schema deployment | Not started |
| Migration dry run | Existing deterministic dry run available; production reconciliation pending |
| Draft import | Not started |
| Preview validation | Not started |
| Controlled publish | Not started |
| Deploy Hook | Not configured |
| Analytics audit | Not started |
| Analytics code | Not started |
| Cloudflare production verification | Not started |

## Remaining risks

- Existing published content has 18 missing SEO fields.
- Nine published FAQ category documents are missing the currently required `title` field.
- Existing draft variants must be reconciled before any write.
- Analytics identifiers and Google API credentials have not been provided; analytics must remain disabled until a real public ID is configured.
- Search Console and Cloudflare Web Analytics status still require authenticated read-only verification.
