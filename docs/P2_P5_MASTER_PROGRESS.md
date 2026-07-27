# POXIOL P2-P5 Master Progress

Production URL: https://www.poxiol.com/

Initial main commit: `fc5402c9f95effae76d740da3d210456105a9eb0`

Phase 1 status: complete and production-verified.

## Package Status

| Package | Branch | PR | Merge Commit | Production Commit | Status |
| --- | --- | --- | --- | --- | --- |
| P5-A CMS content foundation | `feature/p5a-cms-content-foundation` | Not opened | Not merged | Not deployed | Documentation started |
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

