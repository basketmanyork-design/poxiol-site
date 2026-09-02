# POXIOL Commercial Seal P0 Execution Report

## 1. Outcome

The approved P0 commercial-seal scope is implemented on the isolated branch `codex/poxiol-commercial-seal-p0`. Source tests, output tests, the complete production build command, route-release validation, canonical audit, form recovery suite, and focused visual QA pass.

This is a **Preview Gate candidate**, not a production release and not the completion of P1–P7. No production account, DNS, Sanity Published document, Formspree account, Analytics account, or CSP Reporting Production setting was changed.

## 2. Source and rollback boundary

- Official source base: `origin/main` commit `1bf324c947b94e06af8300a624981df6d298f72b`.
- Worktree: `E:\Poxiol团队\POXIOL独立站\.worktrees\poxiol-commercial-seal-p0`.
- Branch: `codex/poxiol-commercial-seal-p0`.
- Changed-file inventory: [2026-09-02-poxiol-commercial-seal-p0-changed-files.md](./2026-09-02-poxiol-commercial-seal-p0-changed-files.md).
- Before merge or deploy, rollback is simply to retain `main` and discard this isolated branch/worktree.
- After a future merge, rollback should use reviewed `git revert` commits in reverse order; do not reset shared history. The 301 and route manifest must be reverted in the same rollback change.

## 3. P0 result matrix

| Gate | Result | Evidence |
|---|---|---|
| Draft / Placeholder / Pending / Demo / internal construction copy | PASS in generated buyer-visible HTML/TXT | `check:commercial-hygiene:output` scans every generated page after stripping scripts/styles. |
| FAQ question/answer mismatch | PASS | MOQ/order-quantity questions and answers are normalized as one semantic pair. |
| `draft procurement standard` | PASS | Exact legacy sentence maps to the approved order-quantity wording. |
| `No external CRM...` | PASS | Replaced with approved inquiry-information purpose wording. |
| Template leakage | PASS for shared sports template | Basketball-specific shared headings are now generated from the current product label; five categories are regression-tested. |
| Dangerous absolute claims | PASS for targeted P0 customization pages | Highest-grade, zero-fading, never-crack/fade, perfect-arrival, retail-ready and launch/scale wording removed or bounded. |
| Fake redirects | PASS | Retired pages removed; unique HTTP 301 rules added. |
| Broken internal links | PASS in generated output | Every rendered `<a>` target resolves to output or an approved redirect source. |
| Buyer-facing legacy email exceptions | PASS | 0 files contain `@york.cn` or `@basketman.cn`; 17 rendered files contain `sales@poxiol.com`. |
| Old V10 assets | PASS | No visual asset added, renamed, referenced, or modified. |

## 4. Claim Change Report

The ledger at `content/governance/claim-ledger.json` contains seven immutable, owner-approved static records with Claim, Source, Source Date, Evidence Type, Approved Wording, Publish Scope, Dynamic/Static, and Owner Approval.

| Claim ID | Old public risk | New governed behavior | Reason / evidence |
|---|---|---|---|
| `inquiry-information-purpose` | “No external CRM is connected” and profiling status | Buyer information is limited to inquiry review, quotation, sampling and order communication. | Owner-approved P0 wording; internal system state does not belong on the buyer surface. |
| `order-quantity-confirmation` | Order-quantity question could retain a sample answer; “draft procurement standard” leaked | Question and answer are normalized together to project-specific quantity confirmation. | Owner-approved P0 wording; prevents semantic mismatch. |
| `sublimation-comparison` | “Zero Fading”; “never crack, peel, or fade”; “hundreds of washes” | Non-absolute comparison for compatible polyester fabric. | Owner-supplied safe wording; no test evidence supports absolutes. |
| `fabric-review` | Highest-grade/performance guarantees and invented fabric names | Fabric is reviewed by product, construction, intended use, availability and sample. | No approved evidence for the former performance assertions. |
| `decoration-placement-review` | Perfect color/placement implications | Artwork, colors, names, numbers and placement are reviewed before method confirmation. | Project-specific feasibility boundary. |
| `packaging-review` | Perfect arrival, time saving, eco/export-grade and fully-custom availability claims | Packing, grouping, labeling and branding requirements are confirmed during quotation/sample review. | No approved packaging evidence or universal availability record. |
| `private-label-review` | Launch/scale, high-quality, retail-ready, plus empty visual proof slots | Options are confirmed before production; empty proof placeholders removed. | No approved proof for blanket private-label capability claims. |

No factory size, employee, equipment, QC count, certification, sales, rating, delivery, response-time, reorder-rate, or Alibaba dynamic metric was invented or added.

## 5. Asset Review Manifest and gaps

| ID | File | Source | Real/AI | Usage | IP / privacy | Status |
|---|---|---|---|---|---|---|
| P0-NONE | None | None | None | No new visual asset in P0 | No new exposure | DIRECT (no-op) |

Remaining P1 evidence gaps are unchanged: showroom overview, basketball area, soccer area, designer at work, digital printing, laser cutting, sewing, QC inspection, measurement, and packing. These require real approved capture; AI substitution remains prohibited.

## 6. Redirect Report

All mappings are unique `301` rules in `public/_redirects`; the competing App Router pages and the JavaScript redirect component were removed.

| Retired source | Destination |
|---|---|
| `/custom-basketball-uniforms/` | `/products/basketball-uniforms/` |
| `/custom-soccer-kits/` | `/products/soccer-jerseys/` |
| `/custom-training-wear/` | `/products/training-wear/` |
| `/custom-american-football-uniforms/` | `/products/` |
| `/custom-esports-jerseys/` | `/products/` |
| `/custom-golf-wear/` | `/products/` |
| `/custom-ice-hockey-jerseys/` | `/products/` |
| `/custom-rugby-uniforms/` | `/products/` |
| `/custom-running-marathon-wear/` | `/products/` |
| `/custom-tennis-wear/` | `/products/` |
| `/custom-volleyball-uniforms/` | `/products/` |
| `/builder/` | `/free-mockup/` |

The generated output contains 39 base redirect rules. Local Sanity redirect retrieval was unavailable during the offline build, so the existing safe fallback retained only the base rules; no Sanity data was written.

## 7. SEO Regression Report

- Production build exported 112 Next routes and a sitemap with 80 URLs.
- Canonical audit: 81 audited URLs, 0 failures, 0 path mismatches, 0 missing/duplicate canonicals, 0 sitemap/noindex conflicts, 0 missing/duplicate H1 among the audited canonical set.
- Redirect sources are excluded from the sitemap and every redirect destination is rendered.
- `construction/route-release.json` is deterministic and current: 100 public baseline routes, 80 candidate sitemap routes, 109 rendered routes, no unexplained removal and no owner-410 requirement.
- The regenerated manifest also records the pre-existing candidate addition `/blog/custom-teamwear-production-notes/`; this was not created by P0.
- Parameterized inquiry URLs remain outside the sitemap and continue to resolve to the canonical form routes.
- Remaining P5 item: the non-sitemap subpage `/customization/private-label/` uses its visible section heading as an `h2`, not `h1`. It is recorded for the later full SEO pass rather than expanding P0 scope.

## 8. Form Regression Report

- `/free-mockup/`, `/get-quote/`, and `/sample-order/` retain native POST forms.
- Contact/general inquiry and project inquiry paths remain separate.
- Full conversion CTA suite passes, including mobile bar behavior, prefill/editing, file input behavior, uncertain-delivery lockout, retry boundaries, success pages, analytics-failure isolation, and 23 project-recovery scenarios.
- Visual interaction smoke test selected `Basketball` and `100–299 sets` on the local mobile quote form without submitting or transmitting buyer data.
- Browser console: 0 relevant errors or warnings on the tested local pages.

## 9. Mobile QA and screenshots

P0 smoke QA used the in-app browser at a requested 390 × 844 viewport (375 CSS-pixel content width reported by the browser) plus a 1440 × 900 desktop viewport.

- Homepage identity, hero, controls and analytics-choice interaction: PASS.
- Quote form select controls: PASS.
- Private-label page: PASS for wrapping, sticky CTA clearance, removed placeholders and no horizontal overflow.
- Full P6 coverage at 375 × 667, 390 × 844 and 430 × 932 is **not complete** and remains gated for P6.

Screenshot evidence is stored outside the repository:

- Before (current production private-label mobile): `C:\Users\Administrator\.codex\visualizations\2026\09\02\01a06112-0fc9-7f42-b7f7-4e2ff4e0aafe\poxiol-p0-private-label-before-production-mobile.png`
- After (local branch private-label mobile): `C:\Users\Administrator\.codex\visualizations\2026\09\02\01a06112-0fc9-7f42-b7f7-4e2ff4e0aafe\poxiol-p0-private-label-mobile-390x844.png`
- After (local branch homepage desktop): `C:\Users\Administrator\.codex\visualizations\2026\09\02\01a06112-0fc9-7f42-b7f7-4e2ff4e0aafe\poxiol-p0-home-desktop.png`
- After (local branch quote interaction mobile): `C:\Users\Administrator\.codex\visualizations\2026\09\02\01a06112-0fc9-7f42-b7f7-4e2ff4e0aafe\poxiol-p0-get-quote-mobile-390x844.png`

## 10. Performance Report

No Lighthouse or real-user Core Web Vitals claim is made in P0. The optimized Next build succeeds. Existing `<img>` lint warnings remain in legacy/CMS/product surfaces and are a P6 performance backlog item. Dependency installation reported 12 audit findings (1 low, 2 moderate, 9 high); no unsafe automatic dependency upgrade was attempted.

## 11. Verification evidence

Environment: official Node.js `22.23.2`, npm `10.9.8`, local review origin `http://127.0.0.1:4466` for the governed hybrid-build gate.

- `npm test` — PASS.
- `npm run check:v8` — PASS.
- `npm run check:commercial-claims` — PASS (4 tests).
- `npm run check:commercial-sports-copy` — PASS (5 tests).
- `npm run check:commercial-redirects` — PASS (3 tests).
- `npm run check:commercial-customization` — PASS (3 tests).
- `npm run check:commercial-hygiene:output` — PASS, including generated-link integrity.
- `npm run check:conversion-ctas` — PASS.
- `npx tsc --noEmit` — PASS.
- `npm run build` — PASS from the start after deterministic route-manifest regeneration.
- `git diff --check` — PASS.

## 12. Remaining risks and next approval gates

1. P1–P7 remain unimplemented and must not be reported as commercial-seal completion.
2. Real Factory, QC, product, Alibaba buyer proof and case-study evidence remain asset/permission gates.
3. P2 core product maturity, P3 CRO simplification, P4 trust/legal work, P5 full SEO pass, P6 full mobile/performance and P7 analytics validation remain separate stages.
4. No Cloudflare Preview deployment, push, pull request, merge, or production deployment has been performed.
5. CSP Reporting Production remains an independent owner approval gate.
6. Sanity Published writes remain an independent approval gate.

## 13. Production deployment checklist (not executed)

1. Owner reviews this report, claim ledger and redirect mappings.
2. Push the isolated branch and create a review PR only after approval.
3. Run a Cloudflare Preview build with current environment bindings; do not add Production CSP reporting bindings.
4. Re-run source, build, output, form, canonical, redirect and visual checks against Preview.
5. Confirm Sanity redirect overlay behavior in Preview without Published writes.
6. Obtain explicit merge/deploy approval.
7. After deployment, verify HTTP status/canonical for all 12 retired URLs, live forms without submission side effects, sitemap, robots and key mobile routes.
8. If any release gate fails, stop and revert the reviewed commit set; do not hot-edit production accounts.

