# CMS candidate baseline review — 2026-10-14

## Decision and boundary

The Owner authorized review and handling of the CMS candidate baseline so the approved Clarity release can proceed. This update records the current **local, read-only migration inventory**. It does not authorize a Sanity import, draft edit, publication, schema deployment, Cloudflare configuration change, or a claim about the current production dataset.

The previous baseline was generated at commit `73c5738d971d3e18f5e01e6d30144bdd582b969a` on 2026-09-03. Its 128 candidate keys no longer match the current `main` source at `b686286344130cdf5f85c57c23dc7354af918d4e`. The Clarity branch did not change any source consumed by the CMS dry run: `lib/faq.ts`, `lib/sports-pages.ts`, or `public/_redirects`.

## Exact source-inventory reconciliation

| Type | Previous | Current | Cause |
| --- | ---: | ---: | --- |
| FAQ items | 35 | 35 | One question changed from “Who does POXIOL work with?” to “Who can request support from POXIOL?”, replacing its question-hash key. |
| Products | 17 | 11 | Six old product-detail routes now have existing 301 redirects to maintained category pages, so the migration dry run excludes them. No published product is deleted by this inventory update. |
| Redirect rules | 27 | 53 | Twenty-eight current rules were added; two earlier rules were replaced when their destinations changed to maintained pages. The source routes of those two rules still exist. |
| **All candidates** | **128** | **148** | 29 keys added, 9 keys removed; net +20. |

The six excluded product routes are four basketball detail routes, `/products/soccer-jerseys-soccer-jerseys/`, and `/products/training-wear-training-tops/`; each redirects to its maintained category route in `public/_redirects`. The two replaced redirect rules are `/blog/custom-sports-apparel-distributor/` (now directly to `/private-label-teamwear/`) and `/guides/school-basketball-uniform-order-checklist/` (now directly to `/guides/how-to-order-custom-basketball-uniforms/`). The complete old and new candidate keys are in the committed `docs/CMS_MIGRATION_DRY_RUN_SUMMARY.json` diff; the precise 301 source and destination pairs are in the already committed `public/_redirects` file.

## Validation

- The dry run reports 148 candidates, zero unsupported schema types, zero article/route conflicts, zero missing SEO/alt/asset blockers, and zero unresolved corrupted or obsolete MVP decisions. It performs no network access or CMS writes.
- All 53 current 301 source paths are unique. Following redirects produces no cycle, and every final local destination exists in the canonical built `out` directory. `scripts/check-cms-redirects.mjs` passes.
- The exact candidate-key SHA-256 (sorted keys joined with LF) is `6ae15e2745a3dc3485c4cac8265de1c574c26cdaf7cc7cd1d2eb885d610ff7f8`. The preflight keeps an exact count and hash gate; it has not been relaxed.
- The dry-run report's `existingSanityDraftInventory` and `existingPublishedInventory` are a historical Checkpoint C snapshot. The generator does not query today's Sanity dataset. Those fields and its projected draft classifications cannot be used as a current migration or publishing approval.

The generated reports, preflight gate, and self-test fixture were updated together. This baseline update only aligns local candidate inventory with source changes already present on `main`.
