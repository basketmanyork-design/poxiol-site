# POXIOL Buyer Decision Clarity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make POXIOL's homepage and supporting pages answer the nine core buyer questions with evidence-bounded content, consistent actions and a safe Controlled Publish path.

**Architecture:** Add a typed, code-owned buyer-decision content layer and focused React sections while preserving the existing Sanity resolver and Cloudflare Pages pipeline. Narrow Sanity changes to three existing Drafts protected by fresh revisions; evidence safety, FAQ consistency and CTA normalization are enforced by reusable code and tests.

**Tech Stack:** Next.js 14 static export, React 18, TypeScript, Tailwind CSS, Node test scripts, Sanity GROQ/HTTP API, GitHub CLI, Cloudflare Pages Git integration.

## Global Constraints

- Do not invent prices, customers, order volume, capacity, tenure, certification, project evidence, testimonials, refunds, replacement, compensation, customs clearance or delivery guarantees.
- Preserve GA4, UTM, Formspree, WhatsApp, mailto and file-upload behavior.
- Do not restore or create Cloudflare Workers Builds.
- All Sanity Draft mutations use fresh revision guards; Published writes stay zero until Preview, CI, merge and Production code deployment pass.
- Publish only the three locked task Drafts; Sanity Release count remains zero.
- Keep existing URLs and basketball vertical positioning.

---

### Task 1: Buyer-decision integrity contract

**Files:**
- Create: `scripts/check-buyer-decision-clarity.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: repository source files and generated `out/` HTML.
- Produces: `npm run check:buyer-decision` with `--source-only` support.

- [ ] **Step 1: Write the failing source contract**

Assert the exact homepage H1, eight decision section labels, permitted CTA vocabulary, `/shipping-after-sales/`, evidence fields, FAQ resolver reuse, sitemap inclusion, absence of unsupported strong claims and absence of client token references.

- [ ] **Step 2: Run the contract and confirm RED**

Run: `node scripts/check-buyer-decision-clarity.test.mjs --source-only`

Expected: failure for the missing shared content module, shipping route and homepage sections.

- [ ] **Step 3: Add generated-output assertions**

When `out/` exists, parse `/index.html`, `/shipping-after-sales/index.html`, `/faq/index.html`, `/projects/index.html` and key CMS pages. Assert exactly one H1, one matching canonical, valid JSON-LD, visible decision labels, FAQ/JSON-LD question equality, neutral evidence labels and no risky phrases.

- [ ] **Step 4: Integrate the source contract into `npm test`**

Add `check:buyer-decision` and call its source-only mode before existing contracts.

- [ ] **Step 5: Commit the RED contract**

```powershell
git add scripts/check-buyer-decision-clarity.test.mjs package.json
git commit -m "test: define buyer decision clarity contracts"
```

### Task 2: Shared decision content and homepage flow

**Files:**
- Create: `lib/buyer-decision.ts`
- Create: `components/sections/BuyerDecisionSections.tsx`
- Modify: `app/page.tsx`
- Modify: `lib/sanity/content.ts`
- Modify: `lib/home-data.ts`

**Interfaces:**
- Produces: `BUYER_DECISION_SECTIONS`, `BUYER_DECISION_FAQS`, `APPROVED_CTA_LABELS`, `normalizeBuyerFacingClaim(text)` and `<BuyerDecisionSections />`.
- Consumes: current CMS homepage media, categories, contact links and safe procurement facts.

- [ ] **Step 1: Run the Task 1 contract to retain RED**

Run: `node scripts/check-buyer-decision-clarity.test.mjs --source-only`.

- [ ] **Step 2: Implement typed evidence-bounded content**

Define the eight sections, seven pricing factors, quote-includes/buyer-input lists, quality approval checkpoints, six-step issue workflow, shipping conditions, trust explanation and final actions. Use only the approved 7–12 and 3–7 conditional timing statements.

- [ ] **Step 3: Render the homepage flow**

Normalize the H1 to `Factory-Direct Custom Teamwear for Clubs, Schools and Sportswear Brands`, state the four offer categories and insert the decision sections in the required order. Preserve the hero image, form, upload field and existing links.

- [ ] **Step 4: Neutralize fallback strong claims**

Replace fallback tenure, capacity and 50-country statements with `B2B teamwear experience`, `Production planning based on confirmed quantity and schedule`, and `Global shipping support based on confirmed destination and method`.

- [ ] **Step 5: Run source contract and TypeScript**

Run: `node scripts/check-buyer-decision-clarity.test.mjs --source-only` and `npx tsc --noEmit`.

- [ ] **Step 6: Commit**

```powershell
git add lib/buyer-decision.ts components/sections/BuyerDecisionSections.tsx app/page.tsx lib/sanity/content.ts lib/home-data.ts
git commit -m "feat: clarify homepage buyer decisions"
```

### Task 3: Shipping and after-sales route

**Files:**
- Create: `app/shipping-after-sales/page.tsx`
- Modify: `app/sitemap.ts`
- Modify: `lib/buyer-decision.ts`

**Interfaces:**
- Consumes: shared production, shipping and issue-review content.
- Produces: indexable `/shipping-after-sales/` with metadata, breadcrumb JSON-LD and contact actions.

- [ ] **Step 1: Confirm the route test is RED**

Run: `node scripts/check-buyer-decision-clarity.test.mjs --source-only`.

- [ ] **Step 2: Add the page**

Render one visible H1, self-canonical, breadcrumb, production planning, shipping method selection, destination confirmation, tracking updates, conditional customs/duties copy, issue review and contact CTA.

- [ ] **Step 3: Add sitemap entry**

Insert `shipping-after-sales` into the static sitemap paths without modifying or removing existing entries.

- [ ] **Step 4: Run source contract and route integrity tests**

Run: `node scripts/check-buyer-decision-clarity.test.mjs --source-only` and `node scripts/check-guide-route-integrity.test.mjs`.

- [ ] **Step 5: Commit**

```powershell
git add app/shipping-after-sales/page.tsx app/sitemap.ts lib/buyer-decision.ts
git commit -m "feat: add shipping and after-sales guidance"
```

### Task 4: Evidence-safe projects and schema

**Files:**
- Modify: `studio/schemaTypes/documents/caseStudy.ts`
- Modify: `lib/cms/types.ts`
- Modify: `lib/sanity/queries.ts`
- Modify: `lib/sanity/content.ts`
- Modify: `app/projects/page.tsx`
- Modify: `app/projects/[slug]/page.tsx`
- Create: `docs/POXIOL_VERIFIED_EVIDENCE_GAPS.md`

**Interfaces:**
- Produces: `buyerAuthorizationStatus`, `approvedImageStatus`, `evidenceNote`, `verifiedProcess` and `verifiableResultStatement` on `CmsProject`.
- Rule: only `evidenceStatus=verified`, public buyer authorization and approved image/result fields may render a verified label or result statement.

- [ ] **Step 1: Add failing evidence assertions**

Extend the source contract to require all fields and to reject `Real Project`, customer success, result and testimonial output when verification metadata is incomplete.

- [ ] **Step 2: Extend schema, query and model**

Add enumerated authorization/image fields and bounded evidence text. Project missing values map to `example`, image is omitted unless approved, and unsupported result/testimonial fields are suppressed.

- [ ] **Step 3: Update project rendering**

Use `Manufacturing Scenario` or `Example Scenario` for unverified records and retain `Project imagery pending verification` for missing approved imagery.

- [ ] **Step 4: Document evidence gaps**

List the missing buyer authorization, public image approval and verifiable result evidence without naming an unverified buyer as a success case.

- [ ] **Step 5: Run contracts, TypeScript and Studio typecheck**

Run: `node scripts/check-buyer-decision-clarity.test.mjs --source-only`, `npx tsc --noEmit`, and `npm --prefix studio run typecheck`.

- [ ] **Step 6: Commit**

```powershell
git add studio/schemaTypes/documents/caseStudy.ts lib/cms/types.ts lib/sanity/queries.ts lib/sanity/content.ts app/projects docs/POXIOL_VERIFIED_EVIDENCE_GAPS.md
git commit -m "feat: enforce verified project evidence boundaries"
```

### Task 5: FAQ single source and CTA normalization

**Files:**
- Modify: `lib/buyer-decision.ts`
- Modify: `lib/sanity/content.ts`
- Modify: `app/faq/page.tsx`
- Modify: `components/seo/StructuredData.tsx`
- Modify: `components/cms/PageTemplate.tsx`
- Modify: `components/sports/SportsLandingPage.tsx`
- Modify: `app/products/[slug]/page.tsx`
- Modify: `app/projects/page.tsx`
- Modify: `app/fabric-guide/page.tsx`
- Modify: `app/printing-guide/page.tsx`
- Modify: `lib/b2b-faq.ts`

**Interfaces:**
- Produces: FAQ groups whose visible entries and `FAQPage` JSON-LD use the same resolved array.
- Preserves: all CTA hrefs, form actions, analytics attributes, WhatsApp, mailto and upload fields.

- [ ] **Step 1: Extend failing contracts for FAQ equality and CTA vocabulary**

Reject old navigational labels and the subcontracting accusation. Allow task-specific form submit labels.

- [ ] **Step 2: Resolve the ten buyer FAQs once**

Merge the ten safe decision FAQs into `getFaqGroups`; pass the resolved groups to both visible markup and generated JSON-LD.

- [ ] **Step 3: Normalize CTA display labels**

Use `Get a Free Mockup`, `Talk to a Teamwear Specialist`, and on product pages `Start with 1 Sample`, while preserving destinations and event behavior.

- [ ] **Step 4: Neutralize the unsupported supplier inference**

Replace it with a statement that sample timing depends on the approved mockup, materials and confirmed schedule.

- [ ] **Step 5: Run source contracts, analytics and public inquiry tests**

Run `npm test`, `node scripts/check-analytics-integration.mjs`, and `node scripts/check-public-inquiry-integrity.mjs`.

- [ ] **Step 6: Commit**

```powershell
git add lib/buyer-decision.ts lib/sanity/content.ts app/faq/page.tsx components/seo/StructuredData.tsx components/cms/PageTemplate.tsx components/sports/SportsLandingPage.tsx app/products/[slug]/page.tsx app/projects/page.tsx app/fabric-guide/page.tsx app/printing-guide/page.tsx lib/b2b-faq.ts
git commit -m "feat: unify buyer FAQ and conversion actions"
```

### Task 6: Revision-guarded Draft updates and Preview

**Files:**
- Create: `scripts/apply-buyer-decision-clarity-drafts.mjs`
- Create: `docs/POXIOL_BUYER_DECISION_DRAFT_LEDGER.json`

**Interfaces:**
- Allowed IDs only: `drafts.67d89e7018894286`, `drafts.a01d7979a987463a`, `drafts.d17c91e8e04842c4`.
- Produces: before/after revision ledger and no Published mutations.

- [ ] **Step 1: Write mutation guard tests**

Assert the allowlist, dry-run default, `ifRevisionID`, `perspective=drafts`, `useCdn=false`, transaction abort behavior, zero Release API calls and zero Published IDs.

- [ ] **Step 2: Implement the dry-run/apply script**

Read fresh Drafts, verify type/pageKey, patch only approved fields, submit one guarded transaction and re-read revisions. Never print token data.

- [ ] **Step 3: Run dry-run and review exact field paths**

Expected changes: remove tenure/capacity from About, use manufacturer identity and neutral production planning in Manufacturing, and remove unsupported response timing/unverified brand email from Contact.

- [ ] **Step 4: Apply guarded Draft transaction**

Only run when `SANITY_WRITE_TOKEN` is present and Editor-authorized. Abort without retry on any revision mismatch.

- [ ] **Step 5: Build real Draft Preview**

Set `NEXT_PUBLIC_CONTENT_SOURCE=sanity-preview` only for the process, require `SANITY_READ_TOKEN`, and run `npm run build`; no resolver fallback warning is accepted.

- [ ] **Step 6: Record revisions and commit script/ledger**

```powershell
git add scripts/apply-buyer-decision-clarity-drafts.mjs docs/POXIOL_BUYER_DECISION_DRAFT_LEDGER.json
git commit -m "chore: guard buyer decision content drafts"
```

### Task 7: Full local gates and browser Preview

**Files:**
- Modify only defects directly proven by the gates.

- [ ] **Step 1: Run code gates**

Run `npm ci`, `npm test`, `node scripts/check-cms-safety.mjs`, `npx tsc --noEmit`, `npm run lint`, `npm run build`, and the real Draft Preview build.

- [ ] **Step 2: Run Studio gates**

Run Studio typecheck, schema validation and Studio build using the scripts defined in `studio/package.json`.

- [ ] **Step 3: Run output audits**

Run buyer-decision, analytics, sitemap, canonical/H1, JSON-LD, UTF-8, token-bundle, risk-term and broken-image audits against Published and Draft output.

- [ ] **Step 4: Run browser acceptance**

Validate all sitemap URLs and the nine key pages at 1440x1000 and 390x844 for HTTP, layout, images, console, CTA, WhatsApp, mailto, forms and upload fields without submitting an inquiry.

- [ ] **Step 5: Review diff**

Run `git diff --check`, confirm binary changes zero, Published writes zero, Release count zero and Workers changes zero.

### Task 8: PR, CI, Pages and Controlled Publish

**Files:**
- Update: final Controlled Publish journal only.

- [ ] **Step 1: Push and create a ready PR**

Push `feat/buyer-decision-clarity-20260805` without force and create a non-draft PR to `main` with audit evidence and the three-Draft allowlist.

- [ ] **Step 2: Wait for every actual check**

Require CMS Production Integration, poxiol-site Pages, poxiol-admin Pages and all other checks to succeed. Confirm Workers Builds check count is zero.

- [ ] **Step 3: Merge and verify Production code deployment**

Merge under branch protection, record merge commit, and wait for both Pages Production deployments. Do not modify Cloudflare configuration.

- [ ] **Step 4: Re-read three Draft and Published revisions**

Abort on any mismatch. Save a Published JSON backup with SHA-256 before publishing.

- [ ] **Step 5: Publish exactly three locked Drafts**

Use guarded publish actions, stop without retry on the first failure, verify three new Published revisions, zero remaining task Drafts and Release count zero.

- [ ] **Step 6: Wait for existing Pages rebuild and run Production acceptance**

Audit the full sitemap plus key pages for all local gates, browser behavior and nine buyer questions.

- [ ] **Step 7: Finalize journal**

Record branch, commits, PR, CI, deployment IDs, Draft revisions, Published write count, Release count, nine-question before/after matrix, evidence/policy gaps, Production audits and rollback status; validate JSON and calculate SHA-256.

