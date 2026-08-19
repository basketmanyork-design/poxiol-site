# POXIOL V9.1 Truth Foundation + Canonical Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish one verifiable POXIOL fact source across CMS, code, URLs, metadata, schema and public output without redesigning the site or inventing proof.

**Architecture:** Add status-aware truth, centralized taxonomy, canonical-route and evidence registries; make Sanity and frontend consume the same safe public values; and enforce the contract with source, build-output and HTTP tests. Use a revision-guarded, snapshot-first Sanity migration and stop at Preview plus Draft PR.

**Tech Stack:** Next.js 15, TypeScript, Sanity 3, Cloudflare OpenNext/Pages redirects, Node assertion scripts, PowerShell for Windows-safe verification.

## Global Constraints

- Base commit: `ae452f70b4a027822fc4340db683746e90653fc1` from `origin/main`.
- Working branch: `feature/poxiol-v9-1-truth-foundation`.
- Do not redesign Homepage, add a visual theme, add AI factory images, invent claims, merge PR, or deploy Production.
- Preserve historical CMS values and unknown fields; never bulk-delete documents.
- Unknown enterprise facts use `OWNER_CONFIRMATION_REQUIRED`; return-policy uncertainty uses `POLICY_REVIEW_REQUIRED`.
- Empty or unverified evidence never renders publicly.
- Every approved migration must be one-hop 301 or 308 and absent from sitemap.
- Finish at Preview and Draft PR for owner review.

---

### Task 1: Freeze baseline inventories and executable contracts

**Files:**
- Create: `scripts/check-v9-truth-foundation.test.mts`
- Create: `scripts/check-v9-canonical-architecture.test.mts`
- Create: `scripts/check-v9-evidence.test.mts`
- Create: `scripts/scan-v9-red-claims.mts`
- Modify: `package.json`

**Interfaces:**
- Produces `npm run check:v9`, `npm run scan:v9:claims`, and machine-readable residual findings.

- [ ] Write source tests that import the planned truth, taxonomy, canonical and evidence interfaces and fail because those modules do not exist.
- [ ] Run each test and confirm the expected module-not-found failure.
- [ ] Add only the package scripts needed to run the tests and scanner.
- [ ] Keep test fixtures explicitly marked so residual scans can distinguish fixtures from public claims.
- [ ] Run the tests again and confirm they now fail on missing behavior rather than command setup.

### Task 2: Implement Source of Truth and remove public claim masking

**Files:**
- Create: `lib/truth/claim-policy.ts`
- Create: `lib/truth/public-copy.ts`
- Create: `studio/schemaTypes/objects/claimPolicy.ts`
- Modify: `studio/schemaTypes/index.ts`
- Modify: `studio/schemaTypes/singletons/procurementStandards.ts`
- Modify: `studio/schemaTypes/documents/sitePage.ts`
- Modify: `studio/schemaTypes/documents/productCategory.ts`
- Modify: `studio/schemaTypes/documents/product.ts`
- Modify: `studio/schemaTypes/documents/faqItem.ts`
- Modify: `studio/schemaTypes/documents/article.ts`
- Modify: `studio/schemaTypes/documents/caseStudy.ts`
- Modify: `studio/schemaTypes/validation.ts`
- Modify: `lib/sanity/queries.ts`
- Modify: `lib/sanity/content.ts`
- Modify: claim-bearing local files identified by `scan:v9:claims`

**Interfaces:**
- Produces `ClaimStatus`, `PublicClaimPolicy`, `publicClaimValue(policy)`, and shared conditional wording constants.
- Sanity projections expose structured claim policies without changing their public text.

- [ ] Add failing tests for all six claim states, conditional wording, owner-confirmation behavior, factory-direct suppression, fixed-timeline suppression and tolerance/return separation.
- [ ] Run the truth test and confirm each new assertion fails for the expected missing behavior.
- [ ] Implement the minimal claim policy and shared public copy.
- [ ] Extend Sanity schemas with structured policies and legacy-value preservation.
- [ ] Change runtime mapping to consume approved values unchanged; keep only a detection guard, not text replacement.
- [ ] Replace unsafe local public fallbacks while retaining legitimate test fixtures and contextual uses such as capacity due diligence.
- [ ] Run the truth test and residual scan until every remaining hit is classified as legal fixture, corrected content or owner review.

### Task 3: Unify product taxonomy

**Files:**
- Create: `lib/site-taxonomy.ts`
- Modify: `lib/navigation.ts`
- Modify: `lib/products-page.ts`
- Modify: `app/products/page.tsx`
- Modify: `app/sitemap.ts`
- Modify: `studio/schemaTypes/documents/productCategory.ts`
- Modify: `studio/schemaTypes/documents/product.ts`

**Interfaces:**
- Produces `SITE_TAXONOMY`, `publicTaxonomyGroups()`, `navigableTaxonomyEntries()`, and `sitemapTaxonomyEntries()`.

- [ ] Add failing tests for the exact SPORTS, TEAMWEAR and MANUFACTURING SOLUTIONS groups and for public-readiness filtering.
- [ ] Confirm navigation, product hub and sitemap currently disagree.
- [ ] Implement the central taxonomy with canonical path, capability status and public flags.
- [ ] Rewire navigation, product hub and sitemap to consume the same registry without creating unconfirmed category pages.
- [ ] Run taxonomy and existing core-sports tests.

### Task 4: Implement evidence architecture and graceful hiding

**Files:**
- Create: `lib/evidence/types.ts`
- Create: `lib/evidence/policy.ts`
- Create: `studio/schemaTypes/documents/evidenceRecord.ts`
- Modify: `studio/schemaTypes/index.ts`
- Modify: `studio/schemaTypes/objects/verifiedMediaAsset.ts`
- Modify: `studio/schemaTypes/documents/product.ts`
- Modify: `studio/schemaTypes/documents/caseStudy.ts`
- Modify: `lib/sanity/queries.ts`
- Modify: `lib/sanity/content.ts`
- Modify: existing production-proof components only where empty-state behavior requires it.

**Interfaces:**
- Produces `EvidenceRecord`, `EvidenceVerificationStatus`, `EvidenceCapability`, and `publicEvidence(record)`.

- [ ] Add failing tests for required image/video fields, capability relationships, four verification states and private-by-default behavior.
- [ ] Add a failing render-policy test proving empty, pending, internal and rejected evidence return no public item.
- [ ] Implement the evidence types, Sanity document and publication policy.
- [ ] Bridge existing verified production-media fields through the same policy without creating assets.
- [ ] Run evidence tests and existing real-production/product-visualization tests.

### Task 5: Establish canonical architecture, redirects, sitemap and internal links

**Files:**
- Create: `lib/canonical-architecture.ts`
- Modify: `public/_redirects`
- Modify: `app/sitemap.ts`
- Modify: `app/[slug]/page.tsx`
- Modify: legacy redirect-stub routes under `app/custom-*/page.tsx` and `app/sports/page.tsx`
- Modify: internal links that point to `/products/soccer-jerseys-1/`
- Modify: `public/llms.txt`

**Interfaces:**
- Produces `CANONICAL_URLS`, `redirectEntries()`, `sitemapEntries()`, `ownerReviewEntries()`, and one-hop redirect validation.

- [ ] Add failing tests for unique canonical ownership, 19 exact duplicate pairs, confirmed redirect status, no chains, no redirect URLs in sitemap and no broken soccer link.
- [ ] Confirm the failures reflect current 200 stubs, duplicate owners and sitemap omissions.
- [ ] Implement the route ledger and one-hop redirects for approved migrations.
- [ ] Make unresolved legacy sport offers return an honest non-success state and remain `OWNER_REVIEW` instead of redirecting to unrelated content.
- [ ] Rebuild sitemap from canonical/indexable/production-valid entries and real content dates.
- [ ] Add meaningful hub links for retained pages; merge, noindex or owner-review pages that should not receive artificial links.
- [ ] Run canonical, existing URL and sitemap-output tests.

### Task 6: Build and execute the safe Sanity migration

**Files:**
- Create: `scripts/v9-sanity-truth-migration.mts`
- Create: `scripts/check-v9-sanity-migration.test.mts`
- Create: `docs/v9-1/sanity-before.ndjson`
- Create: `docs/v9-1/sanity-migration-plan.json`
- Create after apply: `docs/v9-1/sanity-after.ndjson`
- Create after apply: `docs/v9-1/sanity-migration-diff.json`

**Interfaces:**
- CLI modes: `snapshot`, `plan`, `apply`, `verify`.
- Mutation patches use `_id` plus `_rev` guards and never unset unknown fields.

- [ ] Add failing fixture tests for procurement, page, FAQ, article, product/category, project, metadata and revision-conflict cases.
- [ ] Implement public-read snapshot and deterministic migration planning without a write token.
- [ ] Verify the plan records before value, after value, status, replacement reason and owner decision for every patch.
- [ ] Before apply, save all affected IDs/revisions and confirm the plan contains zero deletes.
- [ ] Apply only with `SANITY_WRITE_TOKEN`; stop on revision conflict and never retry with blind overwrite.
- [ ] Read the affected documents again, generate field-level diff and run `verify` plus residual claim scans.

### Task 7: Generate the four required governance reports

**Files:**
- Create: `POXIOL_V9_1_Source_of_Truth_Registry.md`
- Create: `POXIOL_V9_1_Canonical_URL_Map.md`
- Create: `POXIOL_V9_1_Proof_Evidence_Matrix.md`
- Create: `POXIOL_V9_1_Implementation_Report.md`

**Interfaces:**
- Reports consume the code registries and migration artifacts; counts must be reproducible.

- [ ] Populate every RED claim with ID, source, URL, current status, evidence, public rule and replacement.
- [ ] Populate every existing URL with intent, canonical target, status, redirect, sitemap and index decision.
- [ ] Populate all 17 capabilities with required/available evidence and public status.
- [ ] Record Before/After for claims, CMS, URLs, redirects, sitemap, orphans and evidence architecture.
- [ ] Add an Owner Decision Register with no guessed business facts.

### Task 8: Full verification, Preview QA and Draft PR gate

**Files:**
- Modify: `POXIOL_V9_1_Implementation_Report.md` with fresh command evidence.
- Create: Draft PR body through the GitHub publishing workflow; do not create a local PR text file containing credentials.

**Interfaces:**
- Produces a Preview URL, measured desktop/mobile QA evidence and a Draft PR only.

- [ ] Run `npm run check:v9`, the existing full `npm test`, Studio type check and Production build with fresh output.
- [ ] Run repository and generated-output RED-claim scans; classify every remaining hit.
- [ ] Start the built app/Preview and verify route status, redirect status/location/chain/final canonical, sitemap, broken links, metadata and schema.
- [ ] Validate Homepage, Products, Basketball, Soccer, Baseball, Factory, QC, Customization, Resources and Contact on desktop and mobile, recording actual `innerWidth`/`innerHeight`.
- [ ] Confirm no layout break, CTA break, missing nav, broken image, redirect loop or accidental hidden content.
- [ ] Update all four reports from fresh evidence.
- [ ] Review `git diff`, commit intentional files, push the branch and create Draft PR `V9.1: Truth Foundation and Canonical Architecture`.
- [ ] Confirm the PR remains Draft, no merge occurred and no Production deployment occurred.
