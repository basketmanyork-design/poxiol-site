# Clarity release CI blocker — 2026-10-14

## Current state

Draft PR #69 contains the approved Microsoft Clarity consent integration and the reviewed CMS candidate baseline. The latest committed head is `058f10c69d04f5ef7a9081452b288f19573d6faf`. CMS preflight passes, but workflow run `38507917426` fails in **Legacy static build** before the default Sanity and preview builds. No merge or production deployment has occurred.

## Reproduced mismatches

The workflow runs the same full `npm run build` in legacy, default Sanity, and Sanity preview modes. Several output tests assert exact Published Sanity content even during the legacy build:

| Gate | Published expectation | Legacy output |
| --- | --- | --- |
| `check-faq-published-drift:output` | 51 FAQ questions | 34 questions |
| `check-sports-category-product-fallback:output` | Published CMS product-card titles on three category pages | Legacy product-card titles (four, three, and two cards respectively) |
| `check-page-open-graph:stage2:output` | Published content hashes and 78 Sitemap URLs | Different legacy content hashes and 75 Sitemap URLs |
| `check-sports-quote-only-schema:output` | `Custom Hoodies & Jackets Manufacturing` schema name | `Custom Hoodies Manufacturing` |
| `check:pseo-open-graph:output` | 78 Sitemap URLs | 75 Sitemap URLs |

The first row is the actual CI failure. The subsequent rows were reproduced locally against the same legacy build output by running the individual output checks. The differences above were present in content sources before the Clarity branch and are separate from the 128-to-148 CMS candidate reconciliation. The local checks for the Melbourne page, OEM/ODM page, and product taxonomy passed. Experimental test edits made during diagnosis were discarded; no CI gate has been changed in this PR.

## Recommendation and release boundary

Reconcile the workflow's three content modes with their intended output contracts in a separate, reviewed CI change. Preserve exact Published Sanity assertions in the Published build. Give legacy and preview builds explicit, source-appropriate expectations, and run all relevant privacy, analytics, SEO, and release gates before merging Clarity. Re-run the full CI workflow and verify the production deployment and consent behavior afterward.

Until that work is approved and passes, PR #69 remains draft. The approved Clarity change is implemented but **not live** on www.poxiol.com.
