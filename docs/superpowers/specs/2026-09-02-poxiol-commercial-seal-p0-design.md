# POXIOL Commercial Seal P0 Design

**Status:** Approved for implementation by the owner on 2026-09-02 after the PRE-CONSTRUCTION AUDIT.

## Goal

Remove buyer-visible construction language, semantic FAQ errors, unsupported absolute claims, cross-category template leakage, fake client-side redirects, and the confirmed broken internal link without changing production accounts, approved inquiry plumbing, or CSP Production.

## Scope

This design covers P0 only:

1. Buyer-visible content hygiene.
2. Pair-aware FAQ normalization.
3. A single governed Claim Ledger for the neutral P0 wording used by code.
4. Category-neutral shared sports copy.
5. HTTP 301 governance for legacy category and builder routes.
6. Removal of the confirmed `/products/soccer-jerseys-1/` broken link.
7. Neutral rewrites for the four customization pages identified in the audit.

Homepage restructuring, Factory/QC evidence, core-product redesign, form-step redesign, legal-policy expansion, new Analytics events, performance tuning, Production deployment, Sanity Published writes, and CSP Production remain outside this phase.

## Production Baseline

- Repository: `basketmanyork-design/poxiol-site`
- Base: freshly fetched `origin/main` at `1bf324c947b94e06af8300a624981df6d298f72b`
- Branch: `codex/poxiol-commercial-seal-p0`
- Worktree: `.worktrees/poxiol-commercial-seal-p0`
- Runtime: Node.js `22.23.2`, npm `10.9.8`, installed with `npm ci`
- Baseline: the existing suite passes except for one Windows-only CRLF defect in `scripts/check-hybrid-integration.test.mjs`; its first workflow check does not normalize CRLF while the next check does. The P0 implementation will not modify that unrelated test.

## Global Constraints

- No direct development on `main`.
- No DNS, Cloudflare account, Cloudflare Production binding, Sanity project configuration, Formspree account, Analytics account, API token, or CSP Production changes.
- Do not submit a real customer inquiry without a separate form-test Gate.
- Buyer-facing email remains `sales@poxiol.com`.
- Do not create company facts, certifications, numbers, delivery promises, performance guarantees, customer stories, ratings, or reviews.
- Do not use old V10 assets or introduce any new visual asset in P0.
- Preserve valid URLs unless an explicit 301 destination is recorded.
- Keep CSP report-only behavior unchanged.

## Architecture

### 1. Governed P0 Claim Wording

Create `content/governance/claim-ledger.json` as the only source for the neutral P0 claims introduced by this phase. Every record carries:

- `id`
- `claim`
- `source`
- `sourceDate`
- `evidenceType`
- `approvedWording`
- `publishScope`
- `dynamicOrStatic`
- `ownerApproval`

`lib/governance/claims.ts` exposes only records whose owner approval is `APPROVED`. P0 pages consume approved wording by immutable claim ID. Quantitative company claims and dynamic Alibaba metrics are not added.

Approved P0 claims are limited to:

- inquiry-information purpose;
- project-specific order-quantity confirmation;
- the non-absolute sublimation comparison wording supplied in the owner brief;
- project-specific fabric, label, packaging, placement, and sample-review boundaries.

### 2. Pair-Aware FAQ Normalization

The current pipeline normalizes a legacy MOQ question independently from its answer, which can turn a sample FAQ into an order-quantity question with a sample answer. Add `normalizeBuyerFacingFaq(question, answer)` to normalize the pair atomically.

If a legacy MOQ question normalizes to `How is the order quantity confirmed?`, the answer must be replaced by the approved order-quantity wording from the Claim Ledger. Other questions retain the existing claim-normalized answer behavior.

Every Sanity/legacy FAQ adaptation path must call the pair normalizer rather than normalizing question and answer separately.

### 3. Buyer-Visible Hygiene Boundary

Unverified media must continue to fail closed, but a missing asset must render nothing instead of exposing an internal status card. Article image-status fields remain internal data and are not rendered as visible placeholders.

Buyer-visible output must reject:

- `Verified production visual pending`
- `Product imagery pending verification`
- `Moving to New Location`
- `draft procurement standard`
- `No external CRM is connected`
- `No external CRM or unnecessary profiling`
- `Zero Fading`
- `never crack, peel, or fade`
- `highest grade polyester`
- builder beta/construction copy

Legal source constants and CMS draft state fields may remain because the acceptance test scans buyer-visible generated output, not private source vocabulary.

### 4. Shared Sports Copy

Add a pure helper that derives section headings from the current product label. `SportsLandingPage` must use that helper for product formats and related planning scenarios. Training, hoodies, accessories, soccer, and basketball must no longer inherit basketball-only headings.

### 5. Redirect Governance

Remove client-rendered redirect pages and record HTTP 301 rules in `public/_redirects`:

| Source | Destination |
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

The App Router source pages for these redirect sources are removed so generated output cannot expose a competing 200 page. The existing redirect parser, sitemap exclusion, and route-release gates remain authoritative.

### 6. Customization Safety Rewrites

The four audited customization pages stay public but use neutral procurement wording only:

- Fabric options: current availability and sample review, no invented fabric performance.
- Logo/name/number: artwork, placement, and compatible decoration-method review; no absolute fade/crack promise.
- Packaging: requirements and availability confirmed during quotation; no perfect-arrival or time-saving promise.
- Private label: available label/hangtag/care/packaging options confirmed per project; no empty visual placeholders or launch/scale promise.

## Testing

Use strict TDD for every production behavior:

1. Write focused failing tests for the Claim Ledger, FAQ pair, sports copy, redirect map, and broken-link target.
2. Build the unchanged baseline once and run the new buyer-visible hygiene test to prove it fails on current output.
3. Apply the smallest production changes.
4. Run focused tests after each task.
5. Run typecheck, complete `npm test`, production build, output hygiene, redirect, canonical, SEO, buyer-facing, inquiry, and route-release checks.
6. Preserve the known Windows CRLF baseline exception separately; no P0 completion claim may hide a new failure.

## Rollback

Each task is a separate commit. Rollback is performed by reverting the affected task commit or abandoning the isolated branch. No Production deployment is part of this plan. If a later Preview reveals a regression, the Preview is discarded and the prior Production deployment remains untouched.
