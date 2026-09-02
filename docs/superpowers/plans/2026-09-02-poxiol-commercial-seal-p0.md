# POXIOL Commercial Seal P0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clear the approved P0 content, claim, FAQ, template, redirect, and broken-link defects while preserving production accounts, inquiry contracts, and CSP boundaries.

**Architecture:** Introduce a small immutable Claim Ledger and pair-aware FAQ adapter, keep unverified evidence fail-closed without buyer-visible placeholders, derive shared sports headings from page data, and move legacy navigation entirely to Cloudflare HTTP 301 rules. Verify both focused functions and generated buyer-visible output.

**Tech Stack:** Next.js 15.5.21, React 18.3.1, TypeScript 5.9.3, Node.js 22.23.2, Node test runner, Cloudflare Pages static redirects.

**Spec:** `docs/superpowers/specs/2026-09-02-poxiol-commercial-seal-p0-design.md`

## Global Constraints

- Work only on `codex/poxiol-commercial-seal-p0`, based on `1bf324c947b94e06af8300a624981df6d298f72b`.
- Do not modify DNS, Cloudflare account/Production bindings, Sanity project configuration or Published documents, Formspree account, Analytics account, API tokens, CSP Production, or customer data.
- Do not submit a real inquiry.
- Keep `sales@poxiol.com` as the buyer-facing email.
- Add no company metrics, certifications, delivery promises, customer stories, ratings, reviews, V10 assets, or new visual assets.
- Preserve the existing Formspree field names, action, method, attachment names, and analytics calls.
- Every behavior change follows RED → GREEN → REFACTOR.
- The existing Windows CRLF-only `check-hybrid-integration` baseline failure is recorded but not modified by P0.

---

### Task 1: Establish the P0 Claim Ledger and pair-aware FAQ contract

**Files:**
- Create: `content/governance/claim-ledger.json`
- Create: `lib/governance/claims.ts`
- Create: `scripts/check-commercial-claim-ledger.test.mts`
- Modify: `lib/legacy-claim-normalizer.ts`
- Modify: `lib/sanity/content.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `getApprovedClaimWording(id: ApprovedClaimId): string`
- Produces: `normalizeBuyerFacingFaq(question: string, answer: string): {question: string; answer: string}`
- Consumes: existing `normalizeBuyerFacingClaim` and `normalizeBuyerFacingQuestion`

- [ ] **Step 1: Write the failing Claim Ledger and FAQ-pair tests**

Add tests that validate every required ledger field, reject non-approved runtime claims, resolve the approved order-quantity wording, and prove that `Does POXIOL support MOQ 1 set?` plus a sample answer becomes the approved order-quantity pair.

```ts
assert.equal(getApprovedClaimWording('order-quantity-confirmation'), 'Order quantity depends on the product format and project requirements. Share the sport, product, estimated quantity and customization needs so the order structure can be confirmed for the quotation.')
assert.deepEqual(
  normalizeBuyerFacingFaq('Does POXIOL support MOQ 1 set?', 'Yes. POXIOL supports a one-set sample before bulk production.'),
  {question: 'How is the order quantity confirmed?', answer: getApprovedClaimWording('order-quantity-confirmation')},
)
```

- [ ] **Step 2: Run the new test and verify RED**

Run:

```powershell
node --no-warnings --experimental-strip-types --test scripts/check-commercial-claim-ledger.test.mts
```

Expected: FAIL because the ledger, loader, and pair normalizer do not exist.

- [ ] **Step 3: Add the smallest ledger and loader**

Create approved static entries only for inquiry purpose, order-quantity confirmation, sublimation comparison, fabric review, decoration placement, packaging review, and private-label review. Each entry uses the exact fields required by the spec. `getApprovedClaimWording` throws for missing or non-approved IDs.

- [ ] **Step 4: Implement pair-aware FAQ normalization everywhere**

Add `normalizeBuyerFacingFaq` and replace every Sanity mapping that separately calls `normalizeBuyerFacingQuestion` and `normalizeFaqAnswer`. Preserve unpublished-FAQ suppression keys and all non-MOQ answers.

- [ ] **Step 5: Run focused and existing FAQ governance tests**

Run:

```powershell
node --no-warnings --experimental-strip-types --test scripts/check-commercial-claim-ledger.test.mts
node --no-warnings --experimental-strip-types scripts/check-legacy-content-governance.test.mts
```

Expected: PASS.

- [ ] **Step 6: Commit Task 1**

```powershell
git add content/governance/claim-ledger.json lib/governance/claims.ts lib/legacy-claim-normalizer.ts lib/sanity/content.ts scripts/check-commercial-claim-ledger.test.mts package.json
git commit -m "fix: govern p0 claims and faq pairs"
```

### Task 2: Remove buyer-visible internal status language

**Files:**
- Create: `scripts/check-commercial-content-hygiene-output.test.mjs`
- Modify: `components/forms/ContactForm.tsx`
- Modify: `components/v8/VerifiedMediaPlaceholder.tsx`
- Modify: `components/cms/ArticleTemplate.tsx`
- Modify: `scripts/check-v8-accessibility.test.mjs`
- Modify: `scripts/check-real-production-components.test.mts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `getApprovedClaimWording('inquiry-information-purpose')`
- Produces: output scan command `npm run check:commercial-hygiene:output`

- [ ] **Step 1: Build the unchanged branch and record current generated output**

Run `npm run build`. Record build status separately from the later P0 verification.

- [ ] **Step 2: Write the failing buyer-visible output test**

The test recursively reads generated `out/**/*.html` and `out/**/*.txt`, strips scripts and styles from HTML, and reports route plus phrase for every buyer-visible match. It rejects the exact internal and dangerous phrases listed in the spec and verifies the three inquiry routes still contain a POST form.

- [ ] **Step 3: Run the new output test and verify RED**

Run:

```powershell
node scripts/check-commercial-content-hygiene-output.test.mjs
```

Expected: FAIL on the existing CRM, pending-media, FAQ, and dangerous-claim output.

- [ ] **Step 4: Hide missing evidence and replace CRM status copy**

`VerifiedMediaPlaceholder` returns `null` for absent/unverified media. `ArticleTemplate` renders no image-status card when there is no approved image. ContactForm consumes the approved inquiry-purpose wording and removes the CRM status line while preserving the form contract.

- [ ] **Step 5: Update old tests to the approved fail-closed behavior**

Replace expectations that the fallback is visibly rendered with expectations that the shared media gate returns no buyer-visible placeholder while verified images still use `next/image` and verified videos retain poster, controls, and `preload="none"`.

- [ ] **Step 6: Run focused tests**

Run:

```powershell
node scripts/check-v8-accessibility.test.mjs
node --no-warnings --experimental-strip-types scripts/check-real-production-components.test.mts
node scripts/check-public-inquiry-integrity.mjs
```

Expected: PASS.

- [ ] **Step 7: Commit Task 2**

```powershell
git add components/forms/ContactForm.tsx components/v8/VerifiedMediaPlaceholder.tsx components/cms/ArticleTemplate.tsx scripts/check-commercial-content-hygiene-output.test.mjs scripts/check-v8-accessibility.test.mjs scripts/check-real-production-components.test.mts package.json
git commit -m "fix: hide internal buyer-facing status copy"
```

### Task 3: Remove sports-template leakage

**Files:**
- Create: `lib/sports-page-copy.ts`
- Create: `scripts/check-sports-page-copy.test.mts`
- Modify: `components/sports/SportsLandingPage.tsx`
- Modify: `package.json`

**Interfaces:**
- Produces: `sportsPageSectionCopy(productLabel: string)` returning `productTypes` and `relatedProjects` heading objects.
- Consumes: existing `productLabel` derived from `data.primaryKeyword`.

- [ ] **Step 1: Write failing table-driven tests**

Use hand-derived literals for Basketball, Soccer, Training Wear, Team Hoodies, and Team Accessories. Every result must contain its own product label and Training/Hoodies/Accessories results must not contain `Basketball`.

- [ ] **Step 2: Run and verify RED**

Run:

```powershell
node --no-warnings --experimental-strip-types --test scripts/check-sports-page-copy.test.mts
```

Expected: FAIL because the helper does not exist.

- [ ] **Step 3: Implement the pure copy helper and consume it**

Use these patterns:

```ts
productTypes: {
  eyebrow: `${productLabel} Options`,
  title: `Choose the Right ${productLabel} Format`,
  subtitle: 'Compare the product format that fits your roster, use case and customization plan.',
}
relatedProjects: {
  eyebrow: 'Related Planning Scenarios',
  title: `${productLabel} Project Planning References`,
  subtitle: 'Review related planning formats before defining your roster, artwork and delivery plan.',
}
```

- [ ] **Step 4: Run focused sports tests**

Run:

```powershell
node --no-warnings --experimental-strip-types --test scripts/check-sports-page-copy.test.mts
npm run check:core-sports
```

Expected: PASS.

- [ ] **Step 5: Commit Task 3**

```powershell
git add lib/sports-page-copy.ts components/sports/SportsLandingPage.tsx scripts/check-sports-page-copy.test.mts package.json
git commit -m "fix: scope shared sports headings by category"
```

### Task 4: Replace fake redirects and repair the confirmed broken link

**Files:**
- Create: `scripts/check-commercial-redirects.test.mjs`
- Modify: `public/_redirects`
- Modify: `lib/week3-guides.ts`
- Delete: `components/CategoryRedirect.tsx`
- Delete: the eleven `app/custom-*/page.tsx` files listed in the spec that only render `CategoryRedirect`
- Delete: `app/builder/page.tsx`
- Modify: existing source tests that require the basketball redirect component fallback
- Modify: `package.json`

**Interfaces:**
- Consumes: `parseRedirects` from `scripts/generate-cms-redirects.mjs`
- Produces: exactly one permanent mapping for every approved legacy source.

- [ ] **Step 1: Write failing redirect behavior tests**

Parse `public/_redirects`, assert the exact source/destination/status table from the spec, assert every source is unique, assert none of the redirect-only App Router pages exists, and assert the Soccer Product Range link equals `/products/soccer-jerseys/`.

- [ ] **Step 2: Run and verify RED**

Run:

```powershell
node --test scripts/check-commercial-redirects.test.mjs
```

Expected: FAIL because the 301 rules are missing and redirect-only pages still exist.

- [ ] **Step 3: Add redirects, remove redirect pages, and repair the link**

Update `public/_redirects` with the approved table, delete only the redirect-only route components, and replace `/products/soccer-jerseys-1/` with `/products/soccer-jerseys/`.

- [ ] **Step 4: Run redirect, sitemap, and guide tests**

Run:

```powershell
node --test scripts/check-commercial-redirects.test.mjs
npm run check:cms-redirects
node --experimental-strip-types scripts/check-guide-route-integrity.test.mjs
node scripts/check-week3-guide-contracts.test.mjs
npm run check:route-release:unit
```

Expected: PASS.

- [ ] **Step 5: Commit Task 4**

```powershell
git add public/_redirects lib/week3-guides.ts scripts/check-commercial-redirects.test.mjs package.json app components/CategoryRedirect.tsx scripts
git commit -m "fix: replace legacy client redirects with http 301s"
```

### Task 5: Replace unsupported customization claims

**Files:**
- Create: `scripts/check-customization-claims.test.mts`
- Modify: `app/customization/fabric-options/page.tsx`
- Modify: `app/customization/logo-name-number/page.tsx`
- Modify: `app/customization/custom-packaging/page.tsx`
- Modify: `app/customization/private-label/page.tsx`
- Modify: `package.json`

**Interfaces:**
- Consumes: approved Claim Ledger wording for fabric, sublimation, placement, packaging, and private-label review.

- [ ] **Step 1: Write failing tests for ledger-backed page contracts**

The tests require the four pages to import `getApprovedClaimWording`, reject the dangerous phrases from the spec, reject `Label Visual`, `Tag Visual`, and `Hangtag Visual`, and verify each required Claim ID resolves to an approved record.

- [ ] **Step 2: Run and verify RED**

Run:

```powershell
node --no-warnings --experimental-strip-types --test scripts/check-customization-claims.test.mts
```

Expected: FAIL on the existing absolute claims and visual placeholders.

- [ ] **Step 3: Apply neutral, project-specific copy**

Consume the approved ledger wording. Remove invented proprietary fabric names and empty visual blocks. Keep the pages, metadata, header/footer, and existing approved destinations. Do not add product imagery.

- [ ] **Step 4: Run focused tests**

Run:

```powershell
node --no-warnings --experimental-strip-types --test scripts/check-customization-claims.test.mts
npm run check:legacy-content
```

Expected: PASS.

- [ ] **Step 5: Commit Task 5**

```powershell
git add app/customization content/governance lib/governance scripts/check-customization-claims.test.mts package.json
git commit -m "fix: replace unsupported customization claims"
```

### Task 6: Full P0 regression, records, and handoff

**Files:**
- Create: `docs/operations/2026-09-02-poxiol-commercial-seal-p0-report.md`
- Create: `docs/operations/2026-09-02-poxiol-commercial-seal-p0-changed-files.md`
- Create: `docs/operations/2026-09-02-poxiol-commercial-seal-p0-claim-changes.md`
- Create: `docs/operations/2026-09-02-poxiol-commercial-seal-p0-redirect-report.md`
- Modify only if generated contracts require it: route/release manifests governed by existing scripts.

**Interfaces:**
- Consumes: all Task 1–5 tests and generated `out/`.
- Produces: auditable P0 evidence and a Preview deployment Gate; no Production deployment.

- [ ] **Step 1: Run typecheck**

Run `npx tsc --noEmit`. Expected: exit 0.

- [ ] **Step 2: Run the complete source test suite**

Run `npm test`. Expected: no new failure; separately report the known Windows CRLF-only baseline result if still present.

- [ ] **Step 3: Run production build**

Run `npm run build`. Expected: exit 0 and generated `out/`.

- [ ] **Step 4: Run output acceptance gates**

Run:

```powershell
npm run check:commercial-hygiene:output
npm run check:final-seo-output
npm run check:canonical
npm run check:buyer-facing:output
npm run check:conversion-ctas
npm run check:route-release
```

Expected: PASS.

- [ ] **Step 5: Verify branch scope and protected boundaries**

Run `git diff --check`, inspect `git diff origin/main...HEAD`, and confirm there are no changes to CSP Production, DNS, Cloudflare bindings, Sanity project configuration, Formspree account configuration, Analytics account configuration, or assets.

- [ ] **Step 6: Write the four operation records**

Record baseline, changed files, old/new/reason/evidence for every Claim change, exact redirect mapping, test commands, known CRLF baseline exception, unresolved risks, Preview Gate, and rollback commits.

- [ ] **Step 7: Commit Task 6**

```powershell
git add docs/operations package.json construction content public
git commit -m "docs: record commercial seal p0 verification"
```

- [ ] **Step 8: Stop at Preview deployment Gate**

Do not push, merge, create a Production deployment, alter Sanity Published content, or deploy CSP Production. Present the verified branch for owner review.
