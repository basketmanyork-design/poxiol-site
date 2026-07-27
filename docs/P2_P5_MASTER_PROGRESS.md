# POXIOL P2-P5 Master Progress

Production URL: https://www.poxiol.com/

Initial main commit: `fc5402c9f95effae76d740da3d210456105a9eb0`

Phase 1 status: complete and production-verified.

## Package Status

| Package | Branch | PR | Merge Commit | Production Commit | Status |
| --- | --- | --- | --- | --- | --- |
| P5-A CMS content foundation | `feature/p5a-cms-content-foundation` | Not opened | Not merged | Not deployed | Schema and resolver foundation validated locally |
| P2 product taxonomy and FAQ matching | `feature/p2-product-taxonomy-content-matching` | Not opened | Not merged | Not deployed | Pending P5-A |
| P3 trust evidence and conversion | `feature/p3-trust-evidence-conversion` | Not opened | Not merged | Not deployed | Pending P2 |
| P4 SEO and GEO content system | `feature/p4-seo-geo-content-system` | Not opened | Not merged | Not deployed | Pending P3 |
| P5-B admin workflow finalization | `feature/p5b-admin-workflow-finalization` | Not opened | Not merged | Not deployed | Pending P4 |

## Current Verified Baseline

- Domain redirects: verified in Phase 1.
- Email obfuscation: off in Phase 1 final verification.
- `mailto:`: present in Phase 1 final verification.
- WhatsApp: present in Phase 1 final verification.
- Procurement singleton: `_id == "procurementStandards"`.
- Sample MOQ: `1 set`.
- Sample production: `2-3 working days`.
- Bulk production: `7-12 working days`.
- Size tolerance: `±2 cm`.
- Quality control: inspection before shipment.
- Homepage FAQ and FAQPage JSON-LD: consistent in Phase 1 final verification.

## Global Risk Register

| Risk | Handling |
| --- | --- |
| Git transport instability | Use retries; if persistent, use GitHub API with exact branch/head checks. |
| Existing Sanity drafts may include MVP or corrupted data | Reconcile before write; back up externally; import/update Draft only after explicit package task reaches migration apply. |
| Unsupported schema types in migration candidates | Exclude from import candidates and report as unsupported schema coverage failures. |
| Evidence-limited case studies | Label as anonymized or example scenarios; never invent client facts. |
| Legal claims needing company registration details | Use neutral policy language and mark legal review required. |
| Cloudflare email obfuscation regression | Verify `/cdn-cgi/l/email-protection`, `email-decode.min.js`, and `data-cfemail` are absent after each production deployment. |

## Next Package

P5-A begins from latest `main` after this documentation commit. Its first deliverable is a backward-compatible CMS schema and resolver foundation, not a data migration.


## P5-A Local Validation

Validated before opening the P5-A PR:

- Root TypeScript: `npx tsc --noEmit` passed.
- Root static build: `npm run build` passed.
- CMS visibility tests passed.
- CMS merge/strict list-mode tests passed.
- Article route conflict check passed.
- Redirect generator fixture tests passed.
- Content blocker checks passed.
- Reconciliation validation passed.
- Schema coverage validation passed.
- Explicit P5-A file safety scan passed for BOM, NUL bytes, mojibake patterns and token/secret patterns.
- Studio dependency install was verified in a short-path validation copy with `npx --yes npm@10.8.2 ci --legacy-peer-deps` because local npm 10.9.8 exits with its internal `Exit handler never called!` bug on this Windows workspace.
- Studio TypeScript check passed with `npx tsc --noEmit -p tsconfig.check.json`.
- Studio schema validation passed with `npx sanity schema validate --level error`.
- Studio build passed with `npm run build`.

No Sanity writes, Seed, Dataset Import, asset upload, Cloudflare changes or production deployment were performed for P5-A validation.
