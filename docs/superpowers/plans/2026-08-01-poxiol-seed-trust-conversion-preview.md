# POXIOL Seed–Trust–Conversion Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a traceable local Preview that turns the existing POXIOL pages into a youth-club seed–trust–conversion journey while keeping Production, Published Sanity content, URLs, static export and analytics unchanged.

**Architecture:** The Git branch adds narrowly scoped rendering and safe legacy fallback content. Existing Sanity documents are patched only through guarded Draft mutations; the production documents remain untouched. A static `sanity-preview` build consumes those Drafts with the existing server-only token client, then automated HTML and browser checks prove content, schema, forms and analytics contracts.

**Tech Stack:** Next.js 14 App Router/static export, React 18, TypeScript 5, Tailwind CSS 3, Sanity Studio 3.37, GROQ, Node test scripts, local browser smoke testing.

## Global Constraints

- Work only on `preview/poxiol-seed-trust-conversion-20260801` based on `55f490a0e782dfce44a85ca9c3fa83588fdcc026`.
- Never push the branch, create a PR, deploy Cloudflare, publish Sanity documents, create a Sanity Release, or alter Production configuration.
- Patch only the five approved Draft IDs and require the current `_rev` in every mutation.
- Preserve `output: "export"`, Production Published perspective, GA4, Cloudflare Analytics, UTM, URLs, canonical URLs, sitemap, robots, `llms.txt` and existing JSON-LD architecture.
- Do not invent customers, quantities, certifications, tests, equipment, results or third-party brand/league associations.
- Do not add, delete, copy or modify binary image/SVG assets.
- Never print, persist or commit `SANITY_READ_TOKEN` or any other credential.

---

### Task 1: Establish Preview Contract Tests

**Files:**
- Create: `scripts/check-seed-trust-conversion-preview.mjs`
- Create: `scripts/check-public-inquiry-integrity.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: repository source files and generated `out/**/*.html`.
- Produces: `npm test`, a deterministic zero-network contract suite used before and after every implementation task.

- [ ] **Step 1: Write the failing Preview contract test**

Create a Node script that asserts source or exported HTML includes all of:

```js
const required = [
  'Custom Basketball Uniforms for Growing Youth Clubs',
  'Start with 1 Sample. Scale from One Roster to Every Team in Your Program.',
  'One Club, Multiple Teams',
  'Logo to Design Preview to Sample',
  'Youth and Adult Size Breakdown',
  'Names and Numbers Check',
  'Team-Based Packing',
  'Quality Checks Before Shipment',
]
```

Assert source and `out/**/*.html` do not include:

```js
const forbidden = [
  '3,000+ Teams Served',
  'KIAN ink',
  'EPSON print heads',
  '15-25 Days',
  '15–25 Days',
  'NBA',
  'NCAA',
  'AAU official',
]
```

The script must also assert the five approved route HTML files exist after build.

- [ ] **Step 2: Write the inquiry integrity test**

Assert `components/forms/ContactForm.tsx` still contains three `type="file"` controls, `FormData`, Formspree submission, UTM attribution, WhatsApp and mailto fallbacks. Assert `components/forms/FreeMockupForm.tsx` retains WhatsApp/email handoff and success/error rendering. Do not submit a request.

- [ ] **Step 3: Add a deterministic test command**

Set:

```json
"test": "node scripts/check-seed-trust-conversion-preview.mjs --source-only && node scripts/check-public-inquiry-integrity.mjs && node scripts/check-analytics-core.mjs && node scripts/check-analytics-integration.mjs && node scripts/check-cms-safety.mjs"
```

- [ ] **Step 4: Run RED and verify the expected failure**

Run: `npm test`

Expected: FAIL because the new homepage heading and section copy do not exist yet; inquiry and existing analytics checks must pass before the first failure is reported.

- [ ] **Step 5: Commit the failing contracts**

```powershell
git add package.json scripts/check-seed-trust-conversion-preview.mjs scripts/check-public-inquiry-integrity.mjs
git commit -m "test: define seed trust conversion preview contracts"
```

### Task 2: Create Safe Resolved Content and Remove Unsupported Claims

**Files:**
- Modify: `lib/home-data.ts`
- Modify: `lib/cms/legacy.ts`
- Modify: `lib/sanity/content.ts`
- Modify: `lib/cms/types.ts`
- Test: `scripts/check-seed-trust-conversion-preview.mjs`

**Interfaces:**
- Produces: `CmsHomeContent.trustSections: CmsPageSection[]` and safe fallback values used by Homepage, Customization and QC.
- Preserves: existing `getHomepageContent()`, `getSitePage()` and field-level fallback behavior.

- [ ] **Step 1: Extend the failing test for resolved content**

Require `getHomepageContent()` to expose a `trustSections` array and require the safe fallback source to contain the approved procurement phrases. Require all fallback files to be free of `3,000+`, KIAN, EPSON and 15–25-day wording.

- [ ] **Step 2: Run RED**

Run: `npm test`

Expected: FAIL because `trustSections` is absent and unsupported claims remain in `lib/home-data.ts`.

- [ ] **Step 3: Implement the minimum safe fallback**

Add typed sections with these exact headings:

```ts
[
  'One Club, Multiple Teams',
  'Logo to Design Preview to Sample',
  'Youth and Adult Size Breakdown',
  'Names and Numbers Check',
  'Real Sample Evidence',
  'Quality Checks Before Shipment',
  'Team-Based Packing',
]
```

Replace the team-count metric with `Custom Teamwear Production Support`. Replace device-brand text with `Professional sublimation printing processes are used according to project requirements.` Replace old production timing with `Bulk production: 7–12 working days after sample or artwork approval.` Keep MOQ 1 set, sample production 2–3 working days, inspection before shipment and ±2 cm.

- [ ] **Step 4: Map Sanity sections without changing Production fetch policy**

In `getHomepageContent()`, use enabled `page.sections` ordered by `displayOrder` as `trustSections`, falling back to the safe local sections. Do not alter `contentSource`, caching, tokens or visibility rules.

- [ ] **Step 5: Run GREEN**

Run: `npm test`

Expected: PASS for source-only content contracts.

- [ ] **Step 6: Commit**

```powershell
git add lib/home-data.ts lib/cms/legacy.ts lib/sanity/content.ts lib/cms/types.ts scripts/check-seed-trust-conversion-preview.mjs
git commit -m "fix: replace unsupported claims with verified buyer content"
```

### Task 3: Render the Homepage Seed–Trust–Conversion Journey

**Files:**
- Create: `components/sections/SeedTrustConversionSections.tsx`
- Modify: `app/page.tsx`
- Test: `scripts/check-seed-trust-conversion-preview.mjs`

**Interfaces:**
- Consumes: `CmsPageSection[]`, CMS site chrome, existing CTA components.
- Produces: accessible HTML sections with no new routes and no client-side data fetching.

- [ ] **Step 1: Extend the failing test for homepage structure**

Assert `app/page.tsx` renders one visible `<h1>`, passes `content.trustSections` to the new server component, keeps `<FAQSchema>` sourced from `content.faqs`, and retains `ContactForm`, `chrome.whatsappHref` and `emailHref(chrome.publicEmail)`.

- [ ] **Step 2: Run RED**

Run: `npm test`

Expected: FAIL because `SeedTrustConversionSections` is not rendered.

- [ ] **Step 3: Implement the section renderer**

Render existing `pageSection` types with the current black/white/lime styling. Process steps use ordered cards, evidence grids use factual bullets, missing images omit `<img>`, and CTA links use existing `PrimaryButton`/`SecondaryButton` components.

- [ ] **Step 4: Update the hero without changing layout**

Use CMS-first values and these fallback values:

```ts
heading: 'Custom Basketball Uniforms for Growing Youth Clubs'
description: 'Start with 1 Sample. Scale from One Roster to Every Team in Your Program.'
primary CTA: 'Get a Free Mockup' -> '/free-mockup/'
secondary CTA: 'Start with 1 Sample' -> '/sample-order/'
```

Remove the `3,000+` badge and retain the hero image dimensions and existing layout classes.

- [ ] **Step 5: Run GREEN and typecheck**

Run: `npm test`

Run: `npx tsc --noEmit`

Expected: both PASS.

- [ ] **Step 6: Commit**

```powershell
git add app/page.tsx components/sections/SeedTrustConversionSections.tsx scripts/check-seed-trust-conversion-preview.mjs
git commit -m "feat: add homepage seed trust conversion journey"
```

### Task 4: Extend Basketball, Customization and QC Rendering

**Files:**
- Modify: `components/sports/SportsLandingPage.tsx`
- Modify: `components/cms/PageTemplate.tsx`
- Modify: `lib/sanity/content.ts`
- Test: `scripts/check-seed-trust-conversion-preview.mjs`

**Interfaces:**
- Consumes: `buyerTypes`, `decisionSections`, related products/FAQs/cases/guides and `CmsPageSection` types.
- Produces: CMS-driven buyer scenarios, process steps, QC checks and evidence placeholders.

- [ ] **Step 1: Add failing route contracts**

Require Basketball source/rendered HTML to contain multi-team programs, mixed youth/adult sizes, logo/name/number approval, mockup/sample approval, QC/packing and both Free Mockup/Quote CTAs. Require Customization to contain the exact five-stage flow. Require QC to contain all nine approved checks.

- [ ] **Step 2: Run RED**

Run: `npm test`

Expected: FAIL on missing exact process/QC contracts.

- [ ] **Step 3: Extend `SportsLandingPage` minimally**

Render string `buyerTypes` as buyer cards, preserve existing product cards and related references, render `buyerChecklist`, `evidenceGrid`, `processSteps` and specifications using current components/classes, and hide empty modules.

- [ ] **Step 4: Extend `CmsPageTemplate` minimally**

Map `qcProcess` to ordered process/evidence cards and `buyerChecklist`/`evidenceGrid` to factual grids. Do not change metadata, canonical, hero structure, Header or Footer.

- [ ] **Step 5: Run GREEN and typecheck**

Run: `npm test`

Run: `npx tsc --noEmit`

Expected: both PASS.

- [ ] **Step 6: Commit**

```powershell
git add components/sports/SportsLandingPage.tsx components/cms/PageTemplate.tsx lib/sanity/content.ts scripts/check-seed-trust-conversion-preview.mjs
git commit -m "feat: render buyer process and quality evidence sections"
```

### Task 5: Make Project Evidence Fail Closed

**Files:**
- Create: `components/projects/ProjectEvidenceCard.tsx`
- Modify: `app/projects/page.tsx`
- Modify: `lib/sanity/content.ts`
- Modify: `lib/cms/types.ts`
- Test: `scripts/check-seed-trust-conversion-preview.mjs`

**Interfaces:**
- Consumes: existing `CmsProject` factual fields.
- Produces: a verified-evidence card or a neutral missing-evidence state; never a fabricated image, quantity or result.

- [ ] **Step 1: Write a failing evidence test**

Require project cards to omit image markup when the CMS document has no image and show `Project imagery pending buyer-approved evidence` instead. Require the source to avoid fallback case quantities/results and mojibake titles.

- [ ] **Step 2: Run RED**

Run: `npm test`

Expected: FAIL because the current resolver injects a fallback project image.

- [ ] **Step 3: Implement the fail-closed mapping**

Make project images optional when Sanity documents have no image. Keep an existing legacy image only for a matched legacy project with a real local asset. Normalize known corrupted separator text without changing route slugs or claims.

- [ ] **Step 4: Implement the evidence card**

Render title, country/region and product only when present. Render an image only with a non-empty URL and alt. Render the neutral pending-evidence notice otherwise. Do not invent customer identity or performance results.

- [ ] **Step 5: Run GREEN**

Run: `npm test`

Run: `npx tsc --noEmit`

Expected: both PASS.

- [ ] **Step 6: Commit**

```powershell
git add app/projects/page.tsx components/projects/ProjectEvidenceCard.tsx lib/sanity/content.ts lib/cms/types.ts scripts/check-seed-trust-conversion-preview.mjs
git commit -m "fix: make project evidence fail closed"
```

### Task 6: Apply the Guarded Sanity Draft Payload

**Files:**
- Create: `docs/POXIOL_SEED_TRUST_CONVERSION_DRAFT_LEDGER.json`
- Create: `docs/POXIOL_SEED_TRUST_CONVERSION_SOURCE_AUDIT.md`
- Test: `scripts/check-seed-trust-conversion-preview.mjs`

**Interfaces:**
- Consumes: exact current documents read with the Sanity connector.
- Produces: five Draft updates and a public-safe revision ledger; no Published mutation.

- [ ] **Step 1: Re-read all five Drafts immediately before mutation**

Read exact IDs:

```text
drafts.691b156d8e3f49bd
drafts.23e722da0b66490c
drafts.82ca7167e20342ac
drafts.product-category-basketball-mvp
drafts.faq-58b766260485677a
```

Record `_rev` without logging tokens or identities.

- [ ] **Step 2: Validate the allowlist before mutation**

Abort if any target lacks the `drafts.` prefix, if any `_rev` differs from the immediately preceding read, or if any target type is outside `sitePage`, `productCategory`, `faqItem`.

- [ ] **Step 3: Patch the Homepage Draft with its `_rev` guard**

Set hero heading, description and two CTAs to the approved copy. Replace `contentSections` with ordered `pageSection` objects for One Club/Multiple Teams, Logo→Mockup→Sample, mixed sizing, names/numbers, real sample evidence, QC, team packing and CTA. Use only approved procurement values and no unsupported metrics.

- [ ] **Step 4: Patch Customization and QC Drafts with individual `_rev` guards**

Customization gets the five exact steps: Logo, Design Preview, Sample, Approval, Bulk Production. QC gets Fabric, Print, Size, Logo, Names/Numbers, Color Consistency, Finished Garment, Team-Based Packing and Pre-Shipment Inspection.

- [ ] **Step 5: Patch Basketball Category Draft with its `_rev` guard**

Set buyer types to U.S. youth club owners/directors/program directors and multi-team programs. Set decision sections for roster scaling, mixed sizes, personalization, sample approval, fabric/process, QC/packing and conversion CTA. Preserve slug, SEO, category identity and all existing valid references.

- [ ] **Step 6: Normalize the risk FAQ Draft with its `_rev` guard**

Ensure the answer is exactly `Professional sublimation printing processes are used according to project requirements.` Do not change question, category, slug or Published document.

- [ ] **Step 7: Re-read Draft and Published perspectives**

Prove Drafts contain the new payload and the corresponding Published revisions/content are unchanged. Query active Releases and prove none was created.

- [ ] **Step 8: Write the source audit and ledger**

The JSON ledger contains only IDs, type, before revision, after revision, changed field paths, timestamp and `publishedChanged: false`. The Markdown audit records code, Draft, Published, fallback, static HTML, images and production-page sources plus missing evidence assets.

- [ ] **Step 9: Run the ledger safety test**

Run: `npm test`

Expected: PASS; the ledger contains exactly five allowlisted Draft IDs, no Published IDs and no secrets.

- [ ] **Step 10: Commit**

```powershell
git add docs/POXIOL_SEED_TRUST_CONVERSION_DRAFT_LEDGER.json docs/POXIOL_SEED_TRUST_CONVERSION_SOURCE_AUDIT.md scripts/check-seed-trust-conversion-preview.mjs
git commit -m "docs: record guarded seed trust conversion drafts"
```

### Task 7: Add Deterministic Linting Without Changing Runtime

**Files:**
- Create: `.eslintrc.json`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Produces: non-interactive `npm run lint` compatible with Next.js 14.
- Runtime impact: none.

- [ ] **Step 1: Record the current lint failure**

Run: `npm run lint -- --no-cache`

Expected: FAIL/prompt because ESLint is not configured.

- [ ] **Step 2: Install pinned lint tooling**

Run: `npm install --save-dev eslint@8.57.1 eslint-config-next@14.2.35`

Create:

```json
{
  "extends": ["next/core-web-vitals"]
}
```

- [ ] **Step 3: Run lint and make only scope-related corrections**

Run: `npm run lint -- --no-cache`

Expected: PASS. Do not reformat unrelated files or disable rules globally.

- [ ] **Step 4: Commit**

```powershell
git add .eslintrc.json package.json package-lock.json
git commit -m "chore: add deterministic preview lint check"
```

### Task 8: Build and Validate the Draft Preview

**Files:**
- Create: `docs/POXIOL_SEED_TRUST_CONVERSION_PREVIEW_VALIDATION.md`
- Modify: `scripts/check-seed-trust-conversion-preview.mjs`

**Interfaces:**
- Consumes: `NEXT_PUBLIC_CONTENT_SOURCE=sanity-preview` and server-only `SANITY_READ_TOKEN` already present in the environment.
- Produces: `out/` local static Preview and a validation report; no deployment.

- [ ] **Step 1: Verify token presence without reading it**

Run a boolean-only environment check. Abort the Draft build if missing. Never print value, length, prefix or suffix.

- [ ] **Step 2: Run the complete Preview build**

Run in a process-scoped environment:

```powershell
$env:NEXT_PUBLIC_CONTENT_SOURCE='sanity-preview'
npm run build
```

Expected: PASS and `out/index.html`, `out/products/basketball-uniforms/index.html`, `out/customization/index.html`, `out/quality-control-process/index.html`, `out/projects/index.html` exist.

- [ ] **Step 3: Run generated HTML contracts**

Run: `node scripts/check-seed-trust-conversion-preview.mjs --out out`

Expected: required copy present; unsupported claims, third-party brands/leagues, broken images and technical CMS terminology absent.

- [ ] **Step 4: Run SEO/AEO/GEO checks**

Run: `node scripts/check-sitemap-output.mjs`

Inspect exported metadata and JSON-LD for Organization/WebSite, Product/Service, FAQPage and BreadcrumbList. Assert visible FAQs equal FAQPage questions/answers. Assert sitemap contains Published routes only, robots and `llms.txt` exist and are non-empty.

- [ ] **Step 5: Run analytics, UTM and form checks**

Run: `node scripts/check-analytics-core.mjs`

Run: `node scripts/check-analytics-integration.mjs`

Run: `node scripts/check-public-inquiry-integrity.mjs`

Expected: PASS; GA4 loader/event contracts, UTM retention, WhatsApp, mailto, Formspree and three file uploads remain intact.

- [ ] **Step 6: Run browser smoke tests without submitting forms**

Serve `out/` locally and inspect desktop 1440×1000 and mobile 390×844 for the five target routes. Confirm no console error, horizontal overflow, broken image, blank module or inaccessible CTA. Confirm file inputs are visible and do not select/upload real files.

- [ ] **Step 7: Run Studio validation**

From `studio/`:

```powershell
npm ci --legacy-peer-deps
npx tsc --noEmit
npx sanity schema validate --level error
npm run build
```

Expected: all PASS and no schema deployment.

- [ ] **Step 8: Run root final verification**

```powershell
npm ci
npm test
npm run lint -- --no-cache
npx tsc --noEmit
git diff --check
```

Run strict UTF-8, secret, browser-bundle token and binary-diff scans. Expected: PASS, zero credential matches, zero binary changes.

- [ ] **Step 9: Write the Preview validation report**

Record commands, exit codes, routes, required/forbidden copy, structured data, form contracts, Draft IDs, missing real assets and any unavailable check. Do not represent an unavailable public Preview URL as deployed.

### Task 9: Create the Final Local Preview Commit

**Files:**
- Modify: only files already listed in Tasks 1–8.

**Interfaces:**
- Produces: the final traceable local Preview payload.

- [ ] **Step 1: Review exact diff scope**

Run:

```powershell
git status --short
git diff --stat origin/main
git diff --name-only origin/main
git diff --check
```

Confirm no image/SVG binary changes, build output, environment files, secrets, old GEO/AAO work or unrelated routes.

- [ ] **Step 2: Re-run the full verification commands fresh**

Do not rely on earlier outputs. Re-run root tests/build/lint/typecheck, Studio typecheck/schema/build, generated HTML scans and browser smoke tests.

- [ ] **Step 3: Commit the completed payload**

```powershell
git add -- .eslintrc.json package.json package-lock.json app/page.tsx app/projects/page.tsx components/cms/PageTemplate.tsx components/projects/ProjectEvidenceCard.tsx components/sections/SeedTrustConversionSections.tsx components/sports/SportsLandingPage.tsx lib/cms/legacy.ts lib/cms/types.ts lib/home-data.ts lib/sanity/content.ts scripts/check-public-inquiry-integrity.mjs scripts/check-seed-trust-conversion-preview.mjs docs/POXIOL_SEED_TRUST_CONVERSION_DRAFT_LEDGER.json docs/POXIOL_SEED_TRUST_CONVERSION_SOURCE_AUDIT.md docs/POXIOL_SEED_TRUST_CONVERSION_PREVIEW_VALIDATION.md
git commit -m "Create POXIOL seed trust conversion preview"
```

- [ ] **Step 4: Prove delivery boundaries**

Run `git status --short`, `git rev-parse HEAD`, `git log origin/main..HEAD --oneline`, and `git branch -r --contains HEAD`. Confirm worktree clean, full hash recorded, no remote branch contains the final commit, no PR exists, Published Sanity revisions remain unchanged and no Release exists.

- [ ] **Step 5: Provide the local Preview command**

Report:

```powershell
$env:NEXT_PUBLIC_CONTENT_SOURCE='sanity-preview'
npm run dev -- --port 3000
```

State that `SANITY_READ_TOKEN` must already be present server-side and must not be typed into logs or committed. If no public Preview URL exists, report `Preview URL: LOCAL ONLY`.
