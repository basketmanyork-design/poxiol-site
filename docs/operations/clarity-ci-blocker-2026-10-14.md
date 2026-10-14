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

## Approved CI correction

The Owner separately approved reconciling CI for legacy, Published Sanity, and preview, while retaining strict Published checks. The default Sanity step still runs the complete `npm run build` chain, including the exact Published FAQ, CMS card, SEO, legal, analytics, and release gates. Legacy and preview steps now run the Cloudflare build contract, Sitemap output integrity, FAQ schema/visible parity, guarded product-card expectations, legal output, and analytics consent output. Their published-only output snapshots no longer run against a different content source.

The first corrected workflow run passed both legacy and Published builds. The preview build returned the exact legacy product-card set because its CMS read fell back; the initial preview assertion expected only the Published set. The preview check now accepts the complete, exact legacy fallback set or the complete, exact Published set across all three guarded pages, and still rejects mixed or unknown card sets. The Published build retains the single exact Published expectation.

PR #69 remains draft until the new full CI workflow passes, followed by deployment and live consent verification. The approved Clarity change is implemented but **not live** on www.poxiol.com.
