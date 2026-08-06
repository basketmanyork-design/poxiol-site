# POXIOL Week 3 High-Intent Guides Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade Certificates & Testing, add two controlled resource guides, and rebuild focused procurement internal links without Sanity writes or unrelated changes.

**Architecture:** Keep `/certificates-testing/` as the existing static route. Add exactly two static guide records to a shared procurement-guide model consumed by the existing Resources listing and `app/resources/[slug]/page.tsx` resolver; static records win deterministically for their slugs. Generate visible sections and Article/BreadcrumbList/FAQPage schemas from the same data model and FAQ array.

**Tech Stack:** Next.js 15.5.21, TypeScript, existing React components, static export/OpenNext Cloudflare, Sanity read-only resolver.

## Global Constraints

- Preserve `origin/main` base `068d672f66352c3d221badc77032fdec953355f3` and all first-week/Fabric-GSM content.
- Approved URLs only: `/certificates-testing/`, `/resources/custom-basketball-uniform-manufacturer-guide/`, `/resources/custom-soccer-kits-wholesale-guide/`.
- Static guide records are limited to the two approved slugs; no duplicate Sanity source may compete at runtime.
- No Sanity mutation, dependency upgrade, Week 4 work, image changes, or homepage changes.
- Claims must be evidence-tiered and conditional; no invented certificates, tests, prices, fixed timing, capacity, customers, brands, teams, leagues, or unsupported numbers.

---

### Task 1: Baseline and source guard

**Files:**
- Read: `app/resources/[slug]/page.tsx`, `app/resources/page.tsx`, `app/certificates-testing/page.tsx`, `lib/sanity/content.ts`, `app/sitemap.ts`
- Test: `scripts/check-week3-guide-contracts.test.mjs`

- [ ] Confirm clean isolated worktree, main commit, sitemap count, current Sanity revision, and that both approved resource slugs are absent from Published, Draft, and sitemap.
- [ ] Query Sanity read-only using project `oqpv1xbc`, dataset `production`, `perspective=published` and `drafts`, `useCdn=false`; print IDs/revisions only, never credentials.
- [ ] Write the Week 3 contract test with failing assertions for missing static resolution, Resources entries, visible H1, self-canonical, Article/BreadcrumbList/FAQPage schema, semantic links, and missing evidence tiers on Certificates.
- [ ] Run `node scripts/check-week3-guide-contracts.test.mjs` and verify it fails for the expected missing behavior.

### Task 2: Shared procurement guide model

**Files:**
- Create: `lib/week3-guides.ts`
- Test: `scripts/check-week3-guide-contracts.test.mjs`

- [ ] Define typed `Week3Guide` data with slug, title, description, intent, sections, FAQs, related links, and CTA.
- [ ] Add only `custom-basketball-uniform-manufacturer-guide` and `custom-soccer-kits-wholesale-guide`.
- [ ] Ensure FAQs are the single source for visible FAQ and FAQPage JSON-LD.
- [ ] Keep all claims conditional and evidence-labeled, with no forbidden names or unsupported precise claims.

### Task 3: Existing resolver and Resources merge

**Files:**
- Modify: `app/resources/[slug]/page.tsx`
- Modify: `app/resources/page.tsx`
- Modify: `app/sitemap.ts`
- Test: `scripts/check-week3-guide-contracts.test.mjs`

- [ ] Add deterministic static-first lookup for the two approved slugs while preserving Sanity resource lookup for all other slugs.
- [ ] Add static guide params and metadata without changing existing CMS route behavior.
- [ ] Merge static and Sanity Resources cards by slug with deterministic de-duplication.
- [ ] Add both approved URLs to sitemap exactly once with existing trailing-slash canonical convention.

### Task 4: Shared procurement page renderer and schemas

**Files:**
- Create: `components/Week3ProcurementGuide.tsx`
- Modify: `app/resources/[slug]/page.tsx`
- Test: `scripts/check-week3-guide-contracts.test.mjs`

- [ ] Render one visible H1, direct answer, decision context, conditional comparison, scenario guidance, cost/timing/quality factors, supplier questions, sample/evidence checklist, inquiry inputs, visible FAQs, internal links, and CTA.
- [ ] Emit Article, BreadcrumbList, and FAQPage JSON-LD from the same guide/FAQ data rendered to the page.
- [ ] Preserve existing classes and site CTA/form/link behavior; do not introduce a second CMS or route.

### Task 5: Upgrade Certificates & Testing evidence tiers

**Files:**
- Modify: `app/certificates-testing/page.tsx`
- Test: `scripts/check-week3-guide-contracts.test.mjs`

- [ ] Replace unsupported certainty with three explicit sections: currently verified evidence; project/order confirmation; buyer-requirements-dependent confirmation.
- [ ] Keep route, title, canonical, FAQ source, and existing design structure.
- [ ] Ensure visible FAQ and FAQPage schema remain identical and contain no unverified claims.

### Task 6: Focused internal links

**Files:**
- Modify: `app/resources/page.tsx`
- Modify: relevant existing Product, FAQ, Factory, and Quality page files identified by route audit
- Test: `scripts/check-week3-guide-contracts.test.mjs`

- [ ] Add only semantically relevant links to the three Week 3 topics from Resources, basketball/soccer product pages, FAQ, Factory, and Quality pages.
- [ ] Do not touch homepage, add keyword-only links, or create Related Guides loops.
- [ ] Assert both new guides are discoverable from Resources and at least one relevant product/quality context.

### Task 7: Full local gates

**Files:** none beyond Tasks 1–6

- [ ] Run `npm ci`, `npm test`, TypeScript, ESLint, CMS safety, static Published build, Preview build, Studio TypeScript/schema/build, OpenNext build, Wrangler dry-run, canonical/H1, JSON-LD, sitemap, internal-link, risk/unsupported-number, UTF-8, broken-image, token scans, and `git diff --check`.
- [ ] Run desktop/mobile browser checks for all three pages, Resources, relevant product/FAQ/quality pages; require no overflow, broken images, console errors, or broken CTA/form/mail links.
- [ ] Re-read Sanity Published/Draft and confirm zero writes and Release count zero.

### Task 8: Commit, PR, CI, merge, Production

**Files:** journal outside repository

- [ ] Review diff for only Week 3 pages, shared model/template, focused links, tests, and plan/spec docs; binary changes must be zero.
- [ ] Commit `feat: add week 3 procurement decision guides` and push branch.
- [ ] Create non-draft PR, wait for all real CI, diagnose only concrete failures, and merge only when green.
- [ ] Verify main merge commit, Cloudflare Pages/Worker build and deployment IDs as exposed; mark unavailable IDs as `NOT EXPOSED`.
- [ ] Run Production sitemap, canonical/H1, schema, risk, broken-image, browser and link acceptance.
- [ ] Append scope correction, mappings, revisions, writes, CI, deployment, acceptance, Week 3 status, Week 4 not started, and rollback state to `C:\tmp\controlled-publish-journal-20260803-continuation.json`; validate JSON and compute SHA-256.

### Task 9: Final report

- [ ] Report source correction, three URLs, worktree/branch/base/feature/PR/merge, CI/deployment IDs, changed files, Sanity state, brief coverage, evidence gaps, sitemap delta, SEO/link/security/browser results, journal hash, rollback need, and `IN PROGRESS — WEEK 4 NOT STARTED`.