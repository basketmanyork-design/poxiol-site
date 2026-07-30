# Basketball Product Deep Optimization Sprint 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `/products/basketball-uniforms/` into a Sanity-controlled B2B buying decision page while preserving its URL, visual system, static export, analytics, and procurement singleton.

**Architecture:** Extend the existing `productCategory` with optional decision-page fields and reuse `pageSection`, Product, FAQ, Case, Guide, CTA, and procurement types. A focused Basketball resolver composes those sources into the existing `SportsLandingPage`; legacy data remains emergency fallback only. Sanity changes are Revision Guard Draft writes, followed by isolated Preview validation and a Controlled Publish report without publication.

**Tech Stack:** Next.js 14 static export, React, TypeScript, Sanity Studio 3.37, GROQ, Node.js 22, Cloudflare Pages.

## Global Constraints

- Do not change the Basketball URL or canonical.
- Do not create a Basketball `sitePage`.
- Do not duplicate Product, FAQ, Case, Guide, or procurement content.
- Do not modify GA4, Cloudflare architecture, Header, Footer, or brand styling.
- Do not delete documents or assets.
- Sanity writes are Draft-only and guarded by exact revisions.
- Do not run Seed or Dataset Import.
- Do not Publish automatically.

---

### Task 1: Backup and current-state audit

**Files:**
- Create: `docs/BASKETBALL_SPRINT_1_AUDIT.md`
- Create outside Git: timestamped Sanity production export

**Interfaces:**
- Consumes: project `oqpv1xbc`, dataset `production`, current `origin/main`
- Produces: verified backup metadata and exact Draft/Published revisions for the five target documents

- [ ] Verify the feature worktree is clean and based on current `origin/main`.
- [ ] Export the production dataset outside the repository and calculate size and SHA-256.
- [ ] Query Basketball category, four Products, procurement singleton, candidate FAQ/Case/Guide references, and current frontend fallback behavior.
- [ ] Write the audit report without tokens, raw customer data, or private configuration.
- [ ] Stop all mutation work if backup verification fails.

### Task 2: Add failing schema and resolver tests

**Files:**
- Create: `scripts/check-basketball-decision-page.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `productCategoryBySlugQuery`, `SportsPageData`, Basketball resolver
- Produces: `npm run check:basketball-decision-page`

- [ ] Add assertions for optional Schema fields, procurement singleton query, reference reuse, unchanged canonical, and forbidden-claim rejection.
- [ ] Add fixture tests for Published, Preview, API failure, strict empty, and FAQ/JSON-LD consistency.
- [ ] Run the test and verify it fails before implementation.

### Task 3: Extend the Sanity schema without breaking existing categories

**Files:**
- Modify: `studio/schemaTypes/documents/productCategory.ts`
- Modify only if validation needs shared logic: `studio/schemaTypes/validation.ts`

**Interfaces:**
- Produces: optional `heroProofPoints`, `decisionSections`, `primaryCta`, `secondaryCta`, and `bottomCta`

- [ ] Add the five optional fields using existing `pageSection` and `callToAction` types.
- [ ] Extend risk validation to nested decision content.
- [ ] Validate duplicate references and published readiness without making existing categories invalid.
- [ ] Run Studio TypeScript and schema validation.

### Task 4: Extend GROQ and resolver composition

**Files:**
- Modify: `lib/sanity/queries.ts`
- Modify: `lib/sanity/content.ts`
- Modify: `lib/cms/types.ts`
- Modify: `lib/sports-pages.ts`

**Interfaces:**
- Produces: `getBasketballDecisionPage(legacyData)` and an extended `SportsPageData`

- [ ] Extend the category projection with decision fields and CTA projections.
- [ ] Add decision-section, Product-card, Case, and CTA types.
- [ ] Compose Category, Products, procurement singleton, FAQ, Case, and Guide references.
- [ ] Ensure standard procurement values come only from `_id == "procurementStandards"`.
- [ ] Preserve merge/strict/preview visibility semantics and emergency fallback.
- [ ] Run the failing test and verify the resolver cases pass.

### Task 5: Extend `SportsLandingPage` in the current visual system

**Files:**
- Modify: `components/sports/SportsLandingPage.tsx`
- Modify only for resolver wiring: `app/products/basketball-uniforms/page.tsx`

**Interfaces:**
- Consumes: extended `SportsPageData`
- Produces: CMS-driven Basketball Hero, solutions, Product cards, process, references, and CTA

- [ ] Render CMS Hero proof points and CTAs with existing button components.
- [ ] Render Buyer Solutions and Customization in existing card/evidence layouts.
- [ ] Render Product document cards with valid routes and CMS alt text.
- [ ] Render singleton procurement standards and buyer checklist.
- [ ] Render process, Case, FAQ, Guide, and bottom CTA modules only when populated.
- [ ] Keep visible FAQ and FAQPage JSON-LD on the same array.
- [ ] Preserve Product, Service, BreadcrumbList, GA4, Header, Footer, and mobile layout.

### Task 6: Complete local verification

**Files:**
- Update: `docs/BASKETBALL_SPRINT_1_AUDIT.md`

**Interfaces:**
- Produces: reproducible local validation evidence

- [ ] Run `npm ci`, Basketball checks, `npx tsc --noEmit`, and `npm run build`.
- [ ] Run legacy, Published Sanity, and sanity-preview builds.
- [ ] Run Studio install, TypeScript, schema validation, and build.
- [ ] Run `git diff --check`, UTF-8, secret, browser-token, forbidden-claim, and binary-diff scans.
- [ ] Confirm no images or other binary assets changed.

### Task 7: Revision Guard Dry Run and Draft migration

**Files:**
- Create: `scripts/audit-basketball-decision-page.mjs`
- Create: `scripts/apply-basketball-decision-page-drafts.mjs`
- Create: `docs/BASKETBALL_SPRINT_1_DRAFT_REPORT.md`

**Interfaces:**
- Consumes: exact audited revisions and server-only `SANITY_AUTH_TOKEN`
- Produces: one Category Draft and four Product Drafts

- [ ] Implement read-only audit and deterministic Dry Run output.
- [ ] Implement an allowlisted Draft-only writer requiring `WRITE_BASKETBALL_DRAFTS_ONLY`.
- [ ] Statically reject publish, unpublish, delete, create, asset upload, Seed, and Dataset Import operations.
- [ ] Run Dry Run twice and verify identical output.
- [ ] Re-read revisions immediately before mutation.
- [ ] Patch the five Drafts with `ifRevisionId`; record IDs, before/after revisions, changed field paths, and timestamps.
- [ ] Query Draft and Published perspectives to prove Published content is unchanged.

### Task 8: Preview deployment and browser validation

**Files:**
- Create: `docs/BASKETBALL_SPRINT_1_PREVIEW_VALIDATION.md`

**Interfaces:**
- Consumes: Cloudflare Preview environment with `sanity-preview` and server-only read token
- Produces: a real Preview URL and pass/fail report

- [ ] Push the feature branch and wait for Cloudflare Preview.
- [ ] Verify the Preview deployment is not Production.
- [ ] Test Desktop and Mobile rendering of the Basketball route.
- [ ] Validate Hero, solutions, Products, procurement, process, checklist, FAQ, Cases, Guides, and CTA.
- [ ] Validate canonical, metadata, Product, Service, FAQPage, and BreadcrumbList JSON-LD.
- [ ] Validate GA4 `G-W5YLNQ39X1`, event wiring, one Cloudflare beacon, mailto, and WhatsApp.
- [ ] Confirm no Draft URL enters the Production Sitemap.

### Task 9: Controlled Publish preparation and PR

**Files:**
- Create: `docs/BASKETBALL_SPRINT_1_CONTROLLED_PUBLISH_REPORT.md`

**Interfaces:**
- Produces: approved publish order, rollback data, feature commit, PR, and CI result

- [ ] Record the five target IDs, fields changed, before/after summary, exact Draft revisions, rollback snapshots, and publish order.
- [ ] Do not publish any document.
- [ ] Commit implementation with `feat(content): optimize basketball category for B2B buying journey`.
- [ ] Push `feature/basketball-product-deep-optimization-sprint-1`.
- [ ] Create PR titled `feat(content): optimize basketball category buying experience`.
- [ ] Wait for CMS, build, TypeScript, Studio, and Cloudflare Preview checks.
- [ ] Report unresolved risks and the next Controlled Publish action.
