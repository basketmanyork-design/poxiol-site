# POXIOL P2-P5 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete P2-P5 as independent production packages while preserving Phase 1 behavior.

**Architecture:** Extend the existing Sanity schema, GROQ, resolver, legacy fallback, and static Next.js export architecture. Each package ships through an isolated branch, PR, CI, merge commit, Cloudflare production deployment, and live acceptance.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Sanity Studio, GROQ, Cloudflare Pages, GitHub Actions, Node 22.

## Global Constraints

- Base each package on latest `main`.
- Do not push directly to `main`.
- Do not force push.
- Do not use `git reset --hard`.
- Do not use `git clean -fd`.
- Do not expose tokens, API keys, environment variable values, deploy hooks, or customer-private data.
- Do not remove Phase 1 behaviors.
- Do not delete Sanity documents to implement unpublish; use `active`, `unpublished`, or `archived`.
- Keep `procurementStandards` as the singleton `_id == "procurementStandards"`.
- Keep MOQ `1 set`, sample `2-3 working days`, bulk `7-12 working days`, QC before shipment, and `±2 cm`.
- Keep Cloudflare Email Address Obfuscation off and verify `/cdn-cgi/l/email-protection` stays absent.
- Use Merge Commit for PR integration; do not use squash, rebase, admin bypass, or force.

---

## File Structure Map

- `lib/sanity/client.ts`: server-only Sanity fetch behavior and source mode.
- `lib/sanity/queries.ts`: GROQ projections for CMS documents.
- `lib/sanity/content.ts`: Sanity-to-CMS mapping and resolver functions.
- `lib/cms/types.ts`: frontend CMS data contracts.
- `lib/cms/legacy.ts`: legacy fallback data and visual parity data.
- `lib/cms/listMode.ts`: merge/strict list behavior.
- `lib/cms/visibility.ts`: production/preview visibility rules.
- `components/cms/*.tsx`: CMS page/article/product rendering helpers.
- `components/ui.tsx`: chrome, footer, contact links, and floating WhatsApp.
- `app/**/page.tsx`: route integration and metadata.
- `app/sitemap.ts`: public URL inventory.
- `scripts/*.mjs` and `scripts/*.ts`: migration, redirect, conflict, and safety checks.
- `studio/schemaTypes/**`: Sanity schemas and validation.
- `studio/deskStructure.ts`: Studio navigation and content operations.
- `docs/P2_P5_MASTER_PROGRESS.md`: package status ledger.
- `docs/POXIOL_CMS_ADMIN_SOP.md`: final admin SOP.

---

### Task 1: P2-P5 Baseline Documentation

**Files:**
- Create: `docs/superpowers/specs/2026-07-27-poxiol-p2-p5-design.md`
- Create: `docs/superpowers/plans/2026-07-27-poxiol-p2-p5-implementation.md`
- Create: `docs/P2_P5_MASTER_PROGRESS.md`

**Interfaces:**
- Consumes: production baseline commit and existing project structure.
- Produces: design, implementation plan, and progress ledger used by all packages.

- [ ] **Step 1: Create branch**

Run:

```bash
git checkout main
git pull --ff-only origin main
git checkout -b feature/p5a-cms-content-foundation
```

Expected: branch is created from latest `main`.

- [ ] **Step 2: Write documentation**

Create the three files listed above with the exact package sequence P5-A, P2, P3, P4, P5-B and the Phase 1 constraints.

- [ ] **Step 3: Validate docs**

Run:

```bash
git diff --check
```

Expected: no secrets, no placeholders, no whitespace errors.

- [ ] **Step 4: Commit**

Run:

```bash
git add docs/superpowers/specs/2026-07-27-poxiol-p2-p5-design.md docs/superpowers/plans/2026-07-27-poxiol-p2-p5-implementation.md docs/P2_P5_MASTER_PROGRESS.md
git commit -m "docs(cms): plan P2-P5 production implementation"
```

---

### Task 2: P5-A Schema and Resolver Foundation

**Files:**
- Modify: `studio/schemaTypes/objects/common.ts`
- Modify: `studio/schemaTypes/objects/pageSection.ts`
- Modify: `studio/schemaTypes/objects/reusable.ts`
- Modify: `studio/schemaTypes/singletons/siteSettings.ts`
- Modify: `studio/schemaTypes/singletons/navigation.ts`
- Modify: `studio/schemaTypes/singletons/procurementStandards.ts`
- Modify: `studio/schemaTypes/documents/sitePage.ts`
- Modify: `studio/schemaTypes/documents/productCategory.ts`
- Modify: `studio/schemaTypes/documents/product.ts`
- Modify: `studio/schemaTypes/documents/caseStudy.ts`
- Modify: `studio/schemaTypes/documents/faqItem.ts`
- Modify: `studio/schemaTypes/documents/article.ts`
- Modify: `studio/schemaTypes/documents/author.ts`
- Modify: `studio/schemaTypes/index.ts`
- Modify: `lib/cms/types.ts`
- Modify: `lib/sanity/queries.ts`
- Modify: `lib/sanity/content.ts`
- Modify: `scripts/cms-migration-dry-run.ts`
- Modify: `docs/P2_P5_MASTER_PROGRESS.md`

**Interfaces:**
- Consumes: existing schema registrations and Phase 1 resolvers.
- Produces: backward-compatible fields for P2-P4 without duplicate document types.

- [ ] **Step 1: Add schema coverage test before changes**

Run:

```bash
node scripts/check-cms-schema-coverage.mjs
```

Expected: current baseline passes or reports only known baseline gaps.

- [ ] **Step 2: Extend existing schemas only**

Add missing fields to the existing document types. Do not create `blogPost`, `seoArticle`, `contactCard`, `homepageSportCategoryCard`, or `inquiryType` unless the existing `article`, `sitePage`, or singleton models cannot represent the content.

- [ ] **Step 3: Extend GROQ and CMS types**

Update projections and TypeScript interfaces so every new schema field has a typed resolver target. Keep `SANITY_READ_TOKEN` server-only and keep published mode token-free.

- [ ] **Step 4: Update dry run schema coverage**

Ensure every planned candidate type is registered in `studio/schemaTypes/index.ts`. Unsupported schema types must be reported as blockers and excluded from import candidates.

- [ ] **Step 5: Validate P5-A locally**

Run:

```bash
npm ci
npx tsc --noEmit
npm run build
node scripts/check-cms-visibility.mjs
node scripts/check-cms-list-mode.mjs
node scripts/check-cms-schema-coverage.mjs
node scripts/check-cms-safety.mjs
cd studio
npm ci --legacy-peer-deps
npx tsc --noEmit -p tsconfig.check.json
npx sanity schema validate --level error
npm run build
```

Expected: all checks pass.

- [ ] **Step 6: Commit and ship P5-A**

Commit:

```bash
git add studio lib scripts docs/P2_P5_MASTER_PROGRESS.md
git commit -m "feat: establish CMS content foundation"
```

Push, create PR to `main`, wait for required checks, merge with merge commit, verify Cloudflare production, and update `docs/P2_P5_MASTER_PROGRESS.md`.

---

### Task 3: P2 Product Taxonomy, Product Pages, and FAQ Matching

**Files:**
- Modify: `app/products/page.tsx`
- Modify: `app/products/[slug]/page.tsx`
- Modify: `app/products/basketball-uniforms/page.tsx`
- Modify: `app/products/soccer-jerseys/page.tsx`
- Modify: `app/products/training-wear/page.tsx`
- Modify: `app/products/hoodies-jackets/page.tsx`
- Modify: `app/products/team-accessories/page.tsx`
- Modify: `components/sports/SportsLandingPage.tsx`
- Modify: `components/cms/PageTemplate.tsx`
- Modify: `lib/sanity/content.ts`
- Modify: `lib/sanity/queries.ts`
- Modify: `lib/cms/types.ts`
- Modify: `lib/cms/legacy.ts`
- Modify: `scripts/check-cms-content-blockers.mjs`
- Modify: `scripts/check-cms-final-preflight.mjs`
- Modify: `docs/P2_P5_MASTER_PROGRESS.md`

**Interfaces:**
- Consumes: P5-A schema/resolver foundation.
- Produces: CMS-driven category/product pages and matched FAQ data.

- [ ] **Step 1: Write route inventory**

Generate a route list for `/products/`, static category routes, and dynamic product routes. Confirm category slugs are not emitted as product detail slugs.

- [ ] **Step 2: Implement product/category resolvers**

Use `getProduct(slug)` for details and category-specific resolvers for static category pages. Avoid `getProducts().find(...)`.

- [ ] **Step 3: Implement FAQ matching**

Match FAQ by explicit references first, then category/product context. Do not render cross-sport FAQ on unrelated pages.

- [ ] **Step 4: Validate product structured data**

Product JSON-LD must match visible product name, image, category, procurement values, and URL.

- [ ] **Step 5: Validate P2 locally**

Run:

```bash
npm ci
npx tsc --noEmit
npm run build
node scripts/check-cms-visibility.mjs
node scripts/check-cms-list-mode.mjs
node scripts/check-cms-content-blockers.mjs
node scripts/check-cms-final-preflight.mjs
```

Expected: product routes build, no cross-sport FAQ, no old procurement values, no email obfuscation markers in static output.

- [ ] **Step 6: Commit and ship P2**

Commit:

```bash
git add app/products components/sports components/cms lib scripts docs/P2_P5_MASTER_PROGRESS.md
git commit -m "feat: rebuild product taxonomy and content matching"
```

Push, PR, checks, merge, production deployment, and live acceptance.

---

### Task 4: P3 Trust Evidence, Cases, Legal Pages, and Conversion

**Files:**
- Modify: `app/about/page.tsx`
- Modify: `app/factory/page.tsx`
- Modify: `app/manufacturing/page.tsx`
- Modify: `app/quality-control-process/page.tsx`
- Modify: `app/customization/page.tsx`
- Modify: `app/contact/page.tsx`
- Modify: `app/get-quote/page.tsx`
- Modify: `app/free-mockup/page.tsx`
- Modify: `app/projects/page.tsx`
- Modify: `app/projects/[slug]/page.tsx`
- Create or modify legal route files for privacy, terms, and IP policy according to existing route conventions.
- Modify: `components/forms/*`
- Modify: `lib/sanity/content.ts`
- Modify: `lib/sanity/queries.ts`
- Modify: `lib/cms/legacy.ts`
- Modify: `lib/case-studies.ts`
- Modify: `app/sitemap.ts`
- Modify: `docs/P2_P5_MASTER_PROGRESS.md`

**Interfaces:**
- Consumes: CMS page model, case schema, site settings, and procurement singleton.
- Produces: trust pages, case pages, legal pages, and static conversion fallback consistency.

- [ ] **Step 1: Audit claims**

Search for unauthorized brands, leagues, official partnership language, fabricated testimonials, fabricated quantities, and unsupported factory certifications.

- [ ] **Step 2: Implement evidence-aware case rendering**

Render `Real Project`, `Anonymized Real Project`, or `Example Project Scenario` labels based on CMS data. Hide unavailable evidence rather than inventing values.

- [ ] **Step 3: Complete legal pages**

Add or complete Privacy, Terms, and IP policy pages. Include the standing IP authorization statement and avoid legal claims needing unavailable company registration details.

- [ ] **Step 4: Validate conversion paths**

Contact, Get Quote, and Free Mockup must render `mailto:`, `wa.me`, and static fallback content without JavaScript.

- [ ] **Step 5: Validate P3 locally**

Run:

```bash
npm ci
npx tsc --noEmit
npm run build
node scripts/check-cms-safety.mjs
node scripts/check-cms-final-preflight.mjs
```

Expected: no unauthorized claims, no old procurement values, no loading placeholders, legal routes build.

- [ ] **Step 6: Commit and ship P3**

Commit:

```bash
git add app components/forms lib scripts docs/P2_P5_MASTER_PROGRESS.md
git commit -m "feat: strengthen trust evidence and B2B conversion"
```

Push, PR, checks, merge, production deployment, and live acceptance.

---

### Task 5: P4 SEO, GEO, Knowledge Center, and Internal Links

**Files:**
- Modify: `app/blog/page.tsx`
- Modify: `app/blog/[slug]/page.tsx`
- Modify: `app/guides/page.tsx`
- Modify: `app/guides/[slug]/page.tsx`
- Modify: `app/resources/page.tsx`
- Modify: `app/resources/[slug]/page.tsx`
- Modify: static guide/resource route files that remain public.
- Modify: `components/cms/ArticleTemplate.tsx`
- Modify: `components/seo/*`
- Modify: `lib/guides-data.ts`
- Modify: `lib/resources-data.ts`
- Modify: `lib/pseo.ts`
- Modify: `lib/sanity/content.ts`
- Modify: `lib/sanity/queries.ts`
- Modify: `app/sitemap.ts`
- Modify: `public/llms.txt`
- Create: `docs/P4_GEO_QUERY_TESTS.md`
- Modify: `docs/P2_P5_MASTER_PROGRESS.md`

**Interfaces:**
- Consumes: article schema, product/category/case/FAQ references.
- Produces: non-duplicative knowledge routes, internal link clusters, valid JSON-LD, sitemap, robots, and llms alignment.

- [ ] **Step 1: Block article route conflicts**

Run `node scripts/check-article-route-conflicts.mjs` and fix every duplicate route by choosing an authoritative route and redirect plan.

- [ ] **Step 2: Upgrade article rendering**

Render title, slug, excerpt, image alt, body, article type, author, reviewer, methodology, references, related products, related categories, related cases, related articles, FAQ references, CTA, SEO, canonical, OG, index status, Article JSON-LD, and BreadcrumbList.

- [ ] **Step 3: Build internal link clusters**

Link products, categories, cases, FAQ, guides, resources, and quote/mockup CTAs. Avoid orphan pages.

- [ ] **Step 4: Update GEO documentation**

Create `docs/P4_GEO_QUERY_TESTS.md` with ten specified query prompts. Mark unavailable external AI testing as `Not tested` rather than fabricating results.

- [ ] **Step 5: Validate P4 locally**

Run:

```bash
npm ci
npx tsc --noEmit
npm run build
node scripts/check-article-route-conflicts.mjs
node scripts/check-cms-final-preflight.mjs
```

Expected: no duplicate article routes, schema matches visible content, sitemap/llms content aligns.

- [ ] **Step 6: Commit and ship P4**

Commit:

```bash
git add app components lib public/llms.txt scripts docs/P4_GEO_QUERY_TESTS.md docs/P2_P5_MASTER_PROGRESS.md
git commit -m "feat: build SEO and GEO content system"
```

Push, PR, checks, merge, production deployment, and live acceptance.

---

### Task 6: P5-B Admin Workflow and Final Closeout

**Files:**
- Modify: `studio/deskStructure.ts`
- Modify: `studio/schemaTypes/**`
- Modify: `studio/sanity.config.ts`
- Modify: `lib/sanity/content.ts`
- Modify: `lib/sanity/queries.ts`
- Create: `docs/POXIOL_CMS_ADMIN_SOP.md`
- Modify: `docs/CMS_PRODUCTION_SETUP.md`
- Modify: `docs/P2_P5_MASTER_PROGRESS.md`

**Interfaces:**
- Consumes: completed P2-P4 content types and route behavior.
- Produces: final Studio workflow, preview/publish documentation, admin SOP, and production closeout.

- [ ] **Step 1: Optimize Studio navigation**

Group Dashboard, Website Pages, Products, Product Categories, Customer Cases, FAQ, Blog, SEO Articles, Authors, Media, Navigation, Contact Settings, Website Settings, and Procurement Standards.

- [ ] **Step 2: Add editorial review views**

Expose missing SEO, missing alt, draft, published, archived, recently updated, and content needing review as Studio lists. Keep implementation lightweight and maintainable.

- [ ] **Step 3: Finalize preview and workflow docs**

Document Draft, Preview, Publish, Unpublish, Restore, and Cloudflare deployment checks. Do not claim server-side permission boundaries beyond the Sanity plan capabilities.

- [ ] **Step 4: Write admin SOP**

Create `docs/POXIOL_CMS_ADMIN_SOP.md` covering login, pages, products, categories, images, alt, cases, FAQ, blog, SEO articles, contact settings, preview, publish, unpublish, restore, Cloudflare checks, common errors, and rollback.

- [ ] **Step 5: Validate P5-B locally**

Run:

```bash
npm ci
npx tsc --noEmit
npm run build
cd studio
npm ci --legacy-peer-deps
npx tsc --noEmit -p tsconfig.check.json
npx sanity schema validate --level error
npm run build
```

Expected: frontend and Studio pass.

- [ ] **Step 6: Commit and ship P5-B**

Commit:

```bash
git add studio lib docs/POXIOL_CMS_ADMIN_SOP.md docs/CMS_PRODUCTION_SETUP.md docs/P2_P5_MASTER_PROGRESS.md
git commit -m "feat: finalize CMS administration and publishing workflow"
```

Push, PR, checks, merge, production deployment, and live acceptance.

---

## Final Acceptance

- [ ] All package PRs are merged.
- [ ] Cloudflare production deploys the final main commit.
- [ ] Key routes return 200.
- [ ] No critical 404 or 500.
- [ ] `mailto:` and `wa.me` work.
- [ ] `/cdn-cgi/l/email-protection` is absent.
- [ ] No old procurement values.
- [ ] FAQ visible content matches JSON-LD.
- [ ] Product/category/case/article structured data matches visible content.
- [ ] Sitemap, robots, and `llms.txt` are consistent.
- [ ] Mobile smoke test passes.
- [ ] No unauthorized brand/league/official supplier claims.
- [ ] `docs/P2_P5_MASTER_PROGRESS.md` contains branch, PR, checks, merge commit, production commit, migration status, validation status, and remaining risks for every package.

