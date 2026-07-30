# POXIOL Content Sprint 1 Safe Published Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the approved procurement, unsupported-claim, and MVP-category risks from already published POXIOL content without deleting data, publishing broader optimizations, exposing credentials, or changing public URLs.

**Architecture:** Treat backup, audit, Draft mutation, Preview acceptance, publication, and production validation as separate fail-closed gates. Sanity reads and writes use the connected Sanity tools against project `oqpv1xbc`, dataset `production`; every patch targets a Draft and carries the `_rev` obtained immediately before mutation. Repository changes are limited to audit evidence, a deterministic safety checker and its CI wiring, plus a frontend visibility fix only if Preview proves the current `publishStatus: unpublished` suppression is insufficient.

**Tech Stack:** Next.js 14 static export, TypeScript 5, Node.js 22, Sanity Studio 3.37, GROQ, GitHub Actions, Cloudflare Pages, Node built-in test/assert APIs.

## Global Constraints

- Work only on `feature/content-sprint-1-safe-published-fixes`, created from the latest `origin/main`; never push directly to `main`.
- Use Strategy A: broader products, FAQs, guides, cases, SEO, internal links, alt text and structured-content improvements stay Draft and are not published in this delivery.
- Before any Sanity mutation, export the complete `production` dataset outside the Git repository and record only its path, size, SHA-256 and timestamp.
- Never print, copy into documentation, or commit the backup contents, Sanity tokens, Cloudflare tokens, deploy hooks or other credentials.
- Never delete, discard, unpublish, bulk-publish, Seed, Dataset Import, upload assets, force-push, change GA4, change GTM, or change Cloudflare configuration.
- Only correct content that is already Published: approved procurement values, unsupported public claims, or verified MVP/test visibility.
- Approved procurement values are exactly: `Sample MOQ: 1 set`; `Sample production: 2–3 working days after mockup approval`; `Bulk production: 7–12 working days after sample or artwork approval`; `QC: inspection before shipment`; `Size tolerance: ±2 cm`.
- Historical case-study timelines are not general procurement standards and must not be rewritten.
- Unsupported facts must be removed, hidden, or replaced only with neutral process wording; do not invent equipment, capacity, certification, customer or performance claims.
- Preserve all document IDs, slugs, references, public URLs and rollback records.
- Every Sanity patch must use `ifRevisionId`; a revision conflict stops that document until it is re-read and re-reviewed.
- Publish one accepted Draft at a time; do not publish any document whose Preview, metadata, JSON-LD, link or reference check fails.
- Keep PR #39 independent.
- Use UTF-8 without BOM for every new or edited text file.

---

### Task 1: Establish the backup and clean-worktree gate

**Files:**
- Read: `studio/sanity.cli.ts`
- Read: `.gitignore`
- No tracked files are changed in this task.

**Interfaces:**
- Consumes: local branch `feature/content-sprint-1-safe-published-fixes`; Sanity CLI configuration for project `oqpv1xbc` and dataset `production`.
- Produces: a verified external dataset export at `C:\Users\baske\poxiol-private-backups\poxiol-production-before-content-sprint-1-<timestamp>.tar.gz`, plus its byte size and SHA-256 for Task 2.

- [ ] **Step 1: Confirm the branch, clean state and baseline**

Run from the repository worktree:

```powershell
$repo = (Resolve-Path '.').Path
git -c safe.directory="$repo" branch --show-current
git -c safe.directory="$repo" status --short
git -c safe.directory="$repo" rev-parse HEAD
git -c safe.directory="$repo" log -3 --oneline
```

Expected: branch is `feature/content-sprint-1-safe-published-fixes`; `git status --short` has no output; HEAD contains the approved design commit `fc81e7a`.

- [ ] **Step 2: Verify the export command without exporting**

Run outside the restricted sandbox if the Sanity CLI cannot read its user configuration:

```powershell
Set-Location studio
.\node_modules\.bin\sanity.cmd dataset export --help
Set-Location ..
```

Expected: exit code `0`, and help documents the dataset name, output path and overwrite behavior. Do not continue if the command requires a dataset mutation or if authentication is unavailable.

- [ ] **Step 3: Export the complete production dataset outside Git**

Run:

```powershell
$privateBackupDir = 'C:\Users\baske\poxiol-private-backups'
New-Item -ItemType Directory -Force -Path $privateBackupDir | Out-Null
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backupTarget = Join-Path $privateBackupDir "poxiol-production-before-content-sprint-1-$timestamp.tar.gz"
Set-Location studio
.\node_modules\.bin\sanity.cmd dataset export production $backupTarget
Set-Location ..
```

Expected: the CLI reports a successful export. Do not use `--overwrite`; the timestamped destination must be new.

- [ ] **Step 4: Verify the backup without reading its contents**

Run:

```powershell
$backupFile = Get-Item -LiteralPath $backupTarget
$backupHash = Get-FileHash -Algorithm SHA256 -LiteralPath $backupTarget
if ($backupFile.Length -le 0) { throw 'Sanity backup is empty' }
if ($backupTarget.StartsWith($repo, [System.StringComparison]::OrdinalIgnoreCase)) { throw 'Backup is inside the Git repository' }
[pscustomobject]@{
  Path = $backupFile.FullName
  SizeBytes = $backupFile.Length
  Sha256 = $backupHash.Hash
  ExportedAt = $backupFile.LastWriteTimeUtc.ToString('o')
}
```

Expected: non-zero size, a 64-character SHA-256, and an absolute path outside the repository. Do not list archive entries.

- [ ] **Step 5: Reconfirm that backup work changed no repository file**

Run:

```powershell
git -c safe.directory="$repo" status --short
git -c safe.directory="$repo" ls-files --error-unmatch $backupTarget 2>$null
if ($LASTEXITCODE -eq 0) { throw 'Backup unexpectedly became tracked' }
```

Expected: clean worktree and the backup is not tracked. If any check fails, stop before Task 2 and perform no Sanity mutation.

---

### Task 2: Generate the final read-only Published/Draft risk inventory

**Files:**
- Create: `docs/CONTENT_SPRINT_1_PUBLIC_RISK_AUDIT.md`
- Create: `docs/CONTENT_SPRINT_1_PUBLIC_RISK_AUDIT.json`
- Create: `docs/CONTENT_SPRINT_1_AUDIT.md`
- Temporary, never commit: `tmp/content-sprint-1/risk-inventory.json`

**Interfaces:**
- Consumes: backup metadata from Task 1; Sanity `_query_documents` with `published`, `drafts` and `raw` perspectives.
- Produces: exact document IDs, revisions, field paths and decisions; the machine-readable JSON contract consumed by Task 3.

- [ ] **Step 1: Create the ignored temporary workspace**

Run:

```powershell
New-Item -ItemType Directory -Force -Path 'tmp\content-sprint-1' | Out-Null
git -c safe.directory="$repo" check-ignore 'tmp/content-sprint-1/risk-inventory.json'
```

Expected: `tmp/content-sprint-1/risk-inventory.json` is ignored. If it is not ignored, add `/tmp/` to `.gitignore` and commit that one-line safety change before storing temporary results.

- [ ] **Step 2: Query Published counts and candidate fields**

Use Sanity `_query_documents` with resource `{projectId: "oqpv1xbc", dataset: "production"}`, perspective `published`, limit `500`, and this query:

```groq
*[_type in [
  "sitePage",
  "productCategory",
  "product",
  "faqItem",
  "article",
  "caseStudy",
  "procurementStandards"
]] | order(_type asc, _id asc) {
  _id,
  _type,
  _rev,
  _updatedAt,
  "slug": slug.current,
  publishStatus,
  activeStatus,
  navigationVisibility,
  homepageVisibility,
  showOnHomepage,
  featured,
  displayOrder,
  seo,
  title,
  pageTitle,
  categoryName,
  productName,
  projectTitle,
  question,
  answer,
  shortAnswer,
  fullAnswer,
  heroEyebrow,
  heroTitle,
  heroDescription,
  introduction,
  contentSections,
  homepageUspCards,
  homepageSectionHeadings,
  inquirySupport,
  bottomCTA,
  procurementOverride,
  sampleMOQ,
  sampleProductionTime,
  bulkProductionTime,
  bulkProductionNote,
  qcStandard,
  sizeTolerance,
  mixedSizes
}
```

Expected: a read-only result set. Do not paste entire documents into Git; save only a local temporary copy needed for the field-path scan.

- [ ] **Step 3: Query Draft and raw reconciliation views**

Run the same projection twice: once with perspective `drafts`, once with perspective `raw`. For `raw`, retain only `_id`, `_type`, `_rev`, `_updatedAt`, slug, status and fields matching a risk. Normalize `drafts.<id>` to its published base ID only for comparison; never alter the real ID used for patching.

Expected: the audit can distinguish Published, Draft and duplicate raw versions without exposing identity or credentials.

- [ ] **Step 4: Classify every text occurrence**

Scan the temporary results case-insensitively for:

```text
15-25 Days
15–25 Days
7-21 days
7–21 days
10-14 days
10–14 days
30,000+ units monthly
30,000+ monthly
KIAN ink
EPSON print heads
```

Also flag claims containing an unsupported numeric capacity, equipment model/brand, certification, factory-audit result, customer count or guaranteed outcome. For every match record:

```json
{
  "documentId": "published base document ID",
  "draftId": "drafts.<published base document ID>",
  "type": "Sanity schema type",
  "publishedRev": "published revision",
  "draftRev": "draft revision or null",
  "slug": "slug or null",
  "fieldPath": "exact Sanity field path",
  "riskCode": "obsolete_procurement | unsupported_capacity | unsupported_equipment | unsupported_certification | unsupported_result | mvp_visibility",
  "publiclyVisible": true,
  "publishedDraftDifference": "same | different | no_draft",
  "decision": "publish_safe_correction | keep_draft_manual_review | no_change_historical",
  "approvedReplacement": "exact approved replacement, empty when the field is hidden",
  "manualReview": false
}
```

Historical project timelines receive `decision: "no_change_historical"`.

- [ ] **Step 5: Reconcile the two Soccer category documents**

Use Sanity `_query_documents`, perspective `raw`, query:

```groq
*[_type == "productCategory" && (
  _id in ["product-category-soccer-mvp", "drafts.product-category-soccer-mvp"] ||
  slug.current in ["soccer-jerseys", "soccer-kits"]
)] | order(_id asc) {
  _id,
  _rev,
  _updatedAt,
  categoryName,
  "slug": slug.current,
  publishStatus,
  activeStatus,
  navigationVisibility,
  homepageVisibility,
  showOnHomepage,
  featured,
  displayOrder,
  seo,
  "incomingReferences": count(*[references(^._id)])
}
```

Expected: identify `product-category-soccer-mvp` as the MVP/test duplicate and identify the authoritative `soccer-jerseys` category. If either identity is ambiguous or references would be broken, set the MVP item to `keep_draft_manual_review` and do not publish a visibility change.

- [ ] **Step 6: Write the machine-readable audit**

Create `docs/CONTENT_SPRINT_1_PUBLIC_RISK_AUDIT.json` with this exact top-level contract:

```json
{
  "strategy": "A",
  "projectId": "oqpv1xbc",
  "dataset": "production",
  "generatedAt": "ISO-8601 timestamp",
  "backup": {
    "path": "absolute external path",
    "sizeBytes": 1,
    "sha256": "64 uppercase hexadecimal characters",
    "exportedAt": "ISO-8601 timestamp"
  },
  "publishedDocumentsScanned": 0,
  "draftDocumentsScanned": 0,
  "findings": [],
  "safePublishedDocumentIds": [],
  "draftOnlyDocumentIds": [],
  "manualReviewDocumentIds": [],
  "remainingPublishedRiskCounts": {
    "obsoleteProcurement": 0,
    "unsupportedCapacity": 0,
    "kian": 0,
    "epson": 0,
    "mvpSoccerVisible": 0
  },
  "validation": {
    "previewPassed": false,
    "productionPassed": false,
    "jsonLdConsistent": false,
    "ga4Preserved": false,
    "cloudflareAnalyticsSingle": false,
    "emailObfuscationDisabled": false
  }
}
```

Replace numeric zeroes and empty arrays with observed values. The backup size must be the actual non-zero byte count. Do not include full document bodies or secrets.

- [ ] **Step 7: Write the two human-readable audits**

In `docs/CONTENT_SPRINT_1_PUBLIC_RISK_AUDIT.md`, include:

- backup path, size, SHA-256 and timestamp;
- Published and Draft scan counts;
- one row per risk with document ID, type, slug, field path, risk code, proposed handling, publication decision and manual-review state;
- explicit sections for `15–25 Days`, `30,000+ units monthly`, `KIAN ink`, `EPSON print heads`, and the MVP Soccer category;
- the statement that no document, asset or revision was deleted.

In `docs/CONTENT_SPRINT_1_AUDIT.md`, include route-level recommendations for homepage, Products, basketball, soccer, factory, manufacturing, quality control, FAQ, free mockup, get quote, contact and the closest existing buying guide. Mark every new FAQ, guide, SEO, link, alt and structured-content proposal `Draft only — not published in this delivery`.

- [ ] **Step 8: Validate encoding and commit the read-only evidence**

Run:

```powershell
node scripts/check-cms-safety.mjs
git -c safe.directory="$repo" diff --check
git -c safe.directory="$repo" status --short
git -c safe.directory="$repo" add docs/CONTENT_SPRINT_1_PUBLIC_RISK_AUDIT.md docs/CONTENT_SPRINT_1_PUBLIC_RISK_AUDIT.json docs/CONTENT_SPRINT_1_AUDIT.md
git -c safe.directory="$repo" commit -m "docs(content): audit Sprint 1 published risks"
```

Expected: only the three audit files are committed; no backup or temporary query result is staged.

---

### Task 3: Add deterministic content-safety regression checks

**Files:**
- Create: `scripts/check-content-sprint-1-safety.mjs`
- Create: `scripts/check-content-sprint-1-safety-test.mjs`
- Modify: `.github/workflows/cms-pr-check.yml`
- Read: `docs/CONTENT_SPRINT_1_PUBLIC_RISK_AUDIT.json`

**Interfaces:**
- Consumes: the JSON contract from Task 2.
- Produces: `validateSprint1Audit(audit): void`, a fixture self-test and a no-secret GitHub CI step.

- [ ] **Step 1: Write the failing fixture test**

Create `scripts/check-content-sprint-1-safety-test.mjs`:

```js
import assert from 'node:assert/strict'
import {validateSprint1Audit} from './check-content-sprint-1-safety.mjs'

const valid = {
  strategy: 'A',
  projectId: 'oqpv1xbc',
  dataset: 'production',
  backup: {
    path: 'C:\\Users\\baske\\poxiol-private-backups\\backup.tar.gz',
    sizeBytes: 1024,
    sha256: 'A'.repeat(64),
    exportedAt: '2026-07-29T00:00:00.000Z',
  },
  publishedDocumentsScanned: 1,
  draftDocumentsScanned: 1,
  findings: [],
  safePublishedDocumentIds: [],
  draftOnlyDocumentIds: [],
  manualReviewDocumentIds: [],
  remainingPublishedRiskCounts: {
    obsoleteProcurement: 0,
    unsupportedCapacity: 0,
    kian: 0,
    epson: 0,
    mvpSoccerVisible: 0,
  },
  validation: {
    previewPassed: true,
    productionPassed: true,
    jsonLdConsistent: true,
    ga4Preserved: true,
    cloudflareAnalyticsSingle: true,
    emailObfuscationDisabled: true,
  },
}

assert.doesNotThrow(() => validateSprint1Audit(valid))
assert.throws(
  () => validateSprint1Audit({
    ...valid,
    remainingPublishedRiskCounts: {...valid.remainingPublishedRiskCounts, kian: 1},
  }),
  /remainingPublishedRiskCounts\.kian/,
)
assert.throws(
  () => validateSprint1Audit({...valid, backup: {...valid.backup, sizeBytes: 0}}),
  /backup\.sizeBytes/,
)
assert.throws(
  () => validateSprint1Audit({
    ...valid,
    validation: {...valid.validation, productionPassed: false},
  }),
  /validation\.productionPassed/,
)

console.log('content Sprint 1 safety fixture tests passed')
```

- [ ] **Step 2: Run the fixture test and confirm the module is missing**

Run:

```powershell
node scripts/check-content-sprint-1-safety-test.mjs
```

Expected: FAIL with module-not-found for `check-content-sprint-1-safety.mjs`.

- [ ] **Step 3: Implement the safety checker**

Create `scripts/check-content-sprint-1-safety.mjs`:

```js
import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const zeroRiskKeys = [
  'obsoleteProcurement',
  'unsupportedCapacity',
  'kian',
  'epson',
  'mvpSoccerVisible',
]
const requiredValidationKeys = [
  'previewPassed',
  'productionPassed',
  'jsonLdConsistent',
  'ga4Preserved',
  'cloudflareAnalyticsSingle',
  'emailObfuscationDisabled',
]

export function validateSprint1Audit(audit) {
  if (audit.strategy !== 'A') throw new Error('strategy must be A')
  if (audit.projectId !== 'oqpv1xbc') throw new Error('projectId must be oqpv1xbc')
  if (audit.dataset !== 'production') throw new Error('dataset must be production')
  if (!Number.isInteger(audit.backup?.sizeBytes) || audit.backup.sizeBytes <= 0) {
    throw new Error('backup.sizeBytes must be a positive integer')
  }
  if (!/^[A-F0-9]{64}$/.test(audit.backup?.sha256 || '')) {
    throw new Error('backup.sha256 must be 64 uppercase hexadecimal characters')
  }
  if (!/poxiol-private-backups/i.test(audit.backup?.path || '')) {
    throw new Error('backup.path must be an external private backup path')
  }
  for (const key of zeroRiskKeys) {
    if (audit.remainingPublishedRiskCounts?.[key] !== 0) {
      throw new Error(`remainingPublishedRiskCounts.${key} must equal 0`)
    }
  }
  for (const key of requiredValidationKeys) {
    if (audit.validation?.[key] !== true) {
      throw new Error(`validation.${key} must equal true`)
    }
  }
}

const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isDirectRun) {
  const auditPath = path.join(process.cwd(), 'docs', 'CONTENT_SPRINT_1_PUBLIC_RISK_AUDIT.json')
  validateSprint1Audit(JSON.parse(fs.readFileSync(auditPath, 'utf8')))
  console.log('content Sprint 1 safety checks passed')
}
```

- [ ] **Step 4: Run the fixture test**

Run:

```powershell
node scripts/check-content-sprint-1-safety-test.mjs
```

Expected: `content Sprint 1 safety fixture tests passed`.

- [ ] **Step 5: Add CI steps after `Content blocker validation`**

Modify `.github/workflows/cms-pr-check.yml`:

```yaml
      - name: Content Sprint 1 safety self-test
        run: node scripts/check-content-sprint-1-safety-test.mjs

      - name: Content Sprint 1 published-risk gate
        run: node scripts/check-content-sprint-1-safety.mjs
```

The published-risk gate will intentionally remain red until Tasks 5–8 update the audit validation to production-accepted values.

- [ ] **Step 6: Run checks and commit**

Run:

```powershell
node scripts/check-content-sprint-1-safety-test.mjs
node scripts/check-cms-safety.mjs
git -c safe.directory="$repo" diff --check
git -c safe.directory="$repo" add scripts/check-content-sprint-1-safety.mjs scripts/check-content-sprint-1-safety-test.mjs .github/workflows/cms-pr-check.yml
git -c safe.directory="$repo" commit -m "test(content): enforce Sprint 1 publication safeguards"
```

Expected: fixture, safety scan and diff check pass.

---

### Task 4: Apply revision-guarded safe corrections to Drafts only

**Files:**
- Modify after each accepted Draft patch: `docs/CONTENT_SPRINT_1_PUBLIC_RISK_AUDIT.md`
- Modify after each accepted Draft patch: `docs/CONTENT_SPRINT_1_PUBLIC_RISK_AUDIT.json`
- Temporary, never commit: `tmp/content-sprint-1/risk-inventory.json`

**Interfaces:**
- Consumes: Task 2 findings whose `decision` is `publish_safe_correction`.
- Produces: reviewed Draft revisions only; no Published document changes in this task.

- [ ] **Step 1: Re-read each eligible document immediately before patching**

For every `safePublishedDocumentIds` item, use Sanity `_query_documents` with perspective `raw` and:

```groq
*[_id in [$publishedId, "drafts." + $publishedId]] | order(_id asc) {
  _id,
  _type,
  _rev,
  _updatedAt,
  "slug": slug.current,
  publishStatus,
  activeStatus,
  navigationVisibility,
  homepageVisibility,
  showOnHomepage,
  featured,
  seo,
  title,
  pageTitle,
  categoryName,
  question,
  answer,
  shortAnswer,
  fullAnswer,
  heroDescription,
  introduction,
  contentSections,
  procurementOverride
}
```

Pass `$publishedId` from the audited finding. If the current revision differs from Task 2, update the audit row, re-review the field and do not reuse the old revision.

- [ ] **Step 2: Patch obsolete general procurement text to approved copy**

Use Sanity `_patch_documents` on the published base ID or existing Draft ID; the tool must save to Draft. Include `ifRevisionId` from Step 1 and only a `set` for each audited field path. The exact copy is:

```text
Sample MOQ: 1 set
Sample production: 2–3 working days after mockup approval
Bulk production: 7–12 working days after sample or artwork approval
Quality control: inspection before shipment
Size tolerance: ±2 cm
```

For prose fields, replace only the obsolete procurement sentence and preserve surrounding copy. Do not patch case-study project timelines.

- [ ] **Step 3: Patch unsupported public claims without inventing facts**

For each audited claim:

- remove `30,000+ units monthly` and `30,000+ monthly capacity` from the exact field;
- if deleting the sentence leaves the field empty, unset that optional field;
- if a process transition is grammatically required, use only `Production requirements and schedules are confirmed after project review.`;
- for an FAQ whose question is specifically about KIAN ink or EPSON print heads, set its Draft to `publishStatus: "unpublished"` and `active: false` instead of inventing an answer;
- for a broader printing FAQ, remove the brand/model claim and retain only already-supported process language.

Each `_patch_documents` call must contain one document, the current `ifRevisionId`, and only the reviewed field operations.

- [ ] **Step 4: Patch the MVP Soccer Draft visibility**

After Task 2 proves it is the duplicate/test category, call Sanity `_patch_documents` for `product-category-soccer-mvp` with its current revision guard and:

```json
{
  "publishStatus": "unpublished",
  "activeStatus": false,
  "navigationVisibility": false,
  "homepageVisibility": false,
  "showOnHomepage": false,
  "featured": false,
  "seo.indexStatus": "noindex"
}
```

Do not change `_id`, slug, title, references, images or assets.

- [ ] **Step 5: Re-query Drafts and verify the patch scope**

For each patched document, query perspective `drafts` and confirm:

- the target field contains the approved replacement or visibility value;
- no non-target field changed compared with the pre-patch projection;
- no new slug, reference, asset or document appeared;
- Published perspective remains unchanged.

Record the new Draft `_rev` and a field-level before/after summary in the audit; do not copy entire documents.

- [ ] **Step 6: Record broader recommendations as Draft-only work**

Update `docs/CONTENT_SPRINT_1_AUDIT.md` with concrete recommendations for new FAQs, guides, SEO, internal links, alt text and structured modules, each marked `Draft only — not created or published in this safe-fix delivery`. This prevents the public-risk patch from silently expanding into a content rewrite.

- [ ] **Step 7: Commit the Draft-stage evidence**

Run:

```powershell
node scripts/check-content-sprint-1-safety-test.mjs
node scripts/check-cms-safety.mjs
git -c safe.directory="$repo" diff --check
git -c safe.directory="$repo" add docs/CONTENT_SPRINT_1_PUBLIC_RISK_AUDIT.md docs/CONTENT_SPRINT_1_PUBLIC_RISK_AUDIT.json docs/CONTENT_SPRINT_1_AUDIT.md
git -c safe.directory="$repo" commit -m "docs(content): record Sprint 1 draft corrections"
```

Expected: only evidence changes are committed; Sanity changes remain Draft.

---

### Task 5: Validate Preview and decide whether a frontend visibility fix is necessary

**Files:**
- Conditional modify: `lib/sanity/content.ts`
- Conditional modify: `scripts/check-cms-list-mode.mjs`
- Modify: `docs/CONTENT_SPRINT_1_PUBLIC_RISK_AUDIT.md`
- Modify: `docs/CONTENT_SPRINT_1_PUBLIC_RISK_AUDIT.json`

**Interfaces:**
- Consumes: Task 4 Drafts and the existing `mergeCmsList` suppression contract.
- Produces: accepted Preview evidence, or a narrowly tested boolean visibility fix.

- [ ] **Step 1: Build Sanity Preview from the patched Drafts**

Run with a server-only read token available in the execution environment; do not print it:

```powershell
$env:NEXT_PUBLIC_CONTENT_SOURCE = 'sanity-preview'
$env:CMS_LEGACY_LIST_MODE = 'merge'
npm run build
Remove-Item Env:NEXT_PUBLIC_CONTENT_SOURCE
Remove-Item Env:CMS_LEGACY_LIST_MODE
```

Expected: build succeeds; `SANITY_READ_TOKEN` is never written to a command, file, log or `NEXT_PUBLIC_` variable.

- [ ] **Step 2: Inspect the affected Preview routes**

Serve `out` locally and inspect:

```powershell
npx serve out -l 4181
```

Check:

- `/`
- `/products/`
- `/products/basketball-uniforms/`
- `/products/soccer-jerseys/`
- `/manufacturing/`
- `/factory/`
- `/about/`
- `/faq/`
- `/free-mockup/`
- `/get-quote/`
- `/contact/`

Expected: no MVP Soccer test card, no current general `15–25 Days`, no public `30,000+ units monthly`, no KIAN/EPSON claim, no broken navigation, and no new 404.

- [ ] **Step 3: Test whether `publishStatus: unpublished` suppresses the MVP category**

If `/products/` omits `product-category-soccer-mvp`, record that no frontend code change is required and skip Steps 4–7.

If it remains visible, continue with the boolean mapper fix below.

- [ ] **Step 4: Add a failing mapper-contract assertion**

Append this assertion to `scripts/check-cms-list-mode.mjs`:

```js
const isCategoryActive = (activeStatus) => activeStatus !== false && activeStatus !== 'inactive'
assert('boolean false category is inactive', isCategoryActive(false) === false)
assert('legacy inactive category is inactive', isCategoryActive('inactive') === false)
assert('missing category status stays active', isCategoryActive(undefined) === true)
```

Before changing production code, also assert that an unpublished category suppresses the same Legacy slug; the existing assertion `unpublished suppresses legacy` must remain passing.

- [ ] **Step 5: Run the focused test**

Run:

```powershell
node scripts/check-cms-list-mode.mjs
```

Expected: the new test documents the intended boolean contract. If the test was written against the old mapper expression, it must fail before Step 6.

- [ ] **Step 6: Apply the minimal TypeScript mapper fix**

In `lib/sanity/content.ts`, change:

```ts
activeStatus?: string
```

to:

```ts
activeStatus?: boolean | 'inactive'
```

and change:

```ts
active: category.activeStatus !== 'inactive',
```

to:

```ts
active: category.activeStatus !== false && category.activeStatus !== 'inactive',
```

Do not change GROQ fields, category slugs, list-mode behavior or other document mappers.

- [ ] **Step 7: Re-run Preview and commit the conditional fix**

Run:

```powershell
node scripts/check-cms-list-mode.mjs
npx tsc --noEmit
$env:NEXT_PUBLIC_CONTENT_SOURCE = 'sanity-preview'
$env:CMS_LEGACY_LIST_MODE = 'merge'
npm run build
Remove-Item Env:NEXT_PUBLIC_CONTENT_SOURCE
Remove-Item Env:CMS_LEGACY_LIST_MODE
git -c safe.directory="$repo" diff --check
git -c safe.directory="$repo" add lib/sanity/content.ts scripts/check-cms-list-mode.mjs
git -c safe.directory="$repo" commit -m "fix(content): respect boolean category visibility"
```

Expected: `/products/` omits the MVP category. This commit must not exist if Step 3 already passed.

- [ ] **Step 8: Record Preview acceptance**

Update the audit with the checked routes, exact timestamp, Preview result, JSON-LD comparison and any retained manual-review Draft. Set `validation.previewPassed` to `true` only when every affected Preview route passes.

---

### Task 6: Publish only the individually accepted safe corrections

**Files:**
- Modify: `docs/CONTENT_SPRINT_1_PUBLIC_RISK_AUDIT.md`
- Modify: `docs/CONTENT_SPRINT_1_PUBLIC_RISK_AUDIT.json`

**Interfaces:**
- Consumes: Task 5 accepted Draft IDs and current Draft revisions.
- Produces: individually published safe fixes and a post-publication evidence trail.

- [ ] **Step 1: Freeze the publication allowlist**

In the audit, list exact base document IDs under `safePublishedDocumentIds`. The list may contain only:

- already Published documents with approved procurement corrections;
- already Published documents with unsupported claims removed or hidden;
- `product-category-soccer-mvp` after duplicate/test confirmation.

Every new/expanded content item remains in `draftOnlyDocumentIds`.

- [ ] **Step 2: Re-read one Draft and Published pair**

Before each publish, use perspective `raw` to fetch the base and Draft IDs. Confirm:

- Draft `_rev` equals the accepted Preview revision;
- published `_rev` equals the audited pre-change revision;
- no unexpected fields changed;
- no new slug or reference exists.

If any revision or field differs, stop that document, re-audit it, and do not publish it in the same call as another document.

- [ ] **Step 3: Publish one accepted Draft**

Call Sanity `_publish_documents` with exactly one base document ID and resource `{projectId: "oqpv1xbc", dataset: "production"}`. Do not pass multiple IDs.

Expected: the tool reports success for that one document.

- [ ] **Step 4: Verify the Published result before continuing**

Query perspective `published` by exact `_id`. Confirm intended values and re-run the risk scan for that document. Record the new Published `_rev` and timestamp in the audit.

Repeat Steps 2–4 for each allowlisted ID. On any failure, stop publishing remaining documents.

- [ ] **Step 5: Confirm Draft-only content was not published**

Query every `draftOnlyDocumentIds` entry in `raw` perspective and verify there is no new published version caused by this task. Confirm no asset, document or reference was deleted.

- [ ] **Step 6: Commit publication evidence**

Run:

```powershell
node scripts/check-content-sprint-1-safety-test.mjs
node scripts/check-cms-safety.mjs
git -c safe.directory="$repo" diff --check
git -c safe.directory="$repo" add docs/CONTENT_SPRINT_1_PUBLIC_RISK_AUDIT.md docs/CONTENT_SPRINT_1_PUBLIC_RISK_AUDIT.json
git -c safe.directory="$repo" commit -m "docs(content): record approved published corrections"
```

Expected: the JSON safety gate still fails only because production validation flags remain false; risk counts reflect the actual Published query.

---

### Task 7: Run local, schema, static-output and live-content verification

**Files:**
- Modify: `docs/CONTENT_SPRINT_1_PUBLIC_RISK_AUDIT.md`
- Modify: `docs/CONTENT_SPRINT_1_PUBLIC_RISK_AUDIT.json`
- Modify: `docs/CONTENT_SPRINT_1_AUDIT.md`

**Interfaces:**
- Consumes: Published content from Task 6 and repository code.
- Produces: completed zero-risk counts and validation evidence required by the CI gate.

- [ ] **Step 1: Re-query all Published business content**

Repeat Task 2’s Published query and scan. Set these counts from observed results:

```json
{
  "obsoleteProcurement": 0,
  "unsupportedCapacity": 0,
  "kian": 0,
  "epson": 0,
  "mvpSoccerVisible": 0
}
```

Do not set a count to zero unless the query proves it.

- [ ] **Step 2: Install and run root checks**

Run:

```powershell
npm ci
npx tsc --noEmit
node scripts/check-cms-visibility.mjs
node scripts/check-cms-list-mode.mjs
node scripts/check-article-route-conflicts.mjs
node scripts/check-cms-redirects.mjs
node scripts/check-cms-safety.mjs
node scripts/check-content-sprint-1-safety-test.mjs
```

Expected: every command exits `0`.

- [ ] **Step 3: Build all three content modes**

Run:

```powershell
$env:CMS_LEGACY_LIST_MODE = 'merge'
$env:NEXT_PUBLIC_CONTENT_SOURCE = 'legacy'
npm run build
node scripts/check-sitemap-output.mjs

Remove-Item -Recurse -Force .next, out
Remove-Item Env:NEXT_PUBLIC_CONTENT_SOURCE
npm run build
node scripts/check-sitemap-output.mjs

Remove-Item -Recurse -Force .next, out
$env:NEXT_PUBLIC_CONTENT_SOURCE = 'sanity-preview'
npm run build
node scripts/check-sitemap-output.mjs

Remove-Item Env:NEXT_PUBLIC_CONTENT_SOURCE
Remove-Item Env:CMS_LEGACY_LIST_MODE
```

Expected: all builds pass; sitemap contains no Draft URL; the Preview token remains server-only. Before each recursive removal, confirm `.next` and `out` resolve under the worktree.

- [ ] **Step 4: Scan static output**

For the default Sanity build, scan `out` for:

```text
15-25 Days
15–25 Days
30,000+ units monthly
KIAN ink
EPSON print heads
Soccer Kits Draft category content
```

Expected: no public occurrence of these current-risk strings. Confirm the approved `1 set`, `2–3 working days`, `7–12 working days`, `inspection before shipment` and `±2 cm` values appear where procurement standards are shown.

- [ ] **Step 5: Validate Studio**

Run:

```powershell
Set-Location studio
npm ci --legacy-peer-deps
npx tsc --noEmit -p tsconfig.check.json
.\node_modules\.bin\sanity.cmd schema validate --level error
npm run build
Set-Location ..
```

Expected: TypeScript, schema validation and build all pass. Do not deploy the schema or Studio.

- [ ] **Step 6: Validate public routes and infrastructure**

Request and verify status `200`:

```text
https://www.poxiol.com/products/
https://www.poxiol.com/products/basketball-uniforms/
https://www.poxiol.com/products/soccer-jerseys/
https://www.poxiol.com/faq/
https://www.poxiol.com/free-mockup/
https://www.poxiol.com/get-quote/
https://www.poxiol.com/contact/
https://www.poxiol.com/sitemap.xml
https://www.poxiol.com/robots.txt
https://www.poxiol.com/llms.txt
```

At this pre-merge stage, live production may still reflect the previous build. Record that distinction; use Preview/static output for content acceptance and reserve production acceptance for Task 9.

- [ ] **Step 7: Validate visible content, JSON-LD, analytics and contacts**

Use a real browser against the Preview/static deployment and verify:

- visible FAQ text and `FAQPage` JSON-LD contain the same approved values;
- sitemap contains no Draft URL;
- `G-W5YLNQ39X1` appears once;
- no `GTM-` container or legacy Okki script appears;
- Cloudflare Web Analytics beacon loads once;
- `/cdn-cgi/l/email-protection`, `email-decode.min.js` and `data-cfemail` do not appear;
- `mailto:` and `wa.me` remain valid;
- no affected route returns an unexpected 404/500.

- [ ] **Step 8: Complete validation evidence and run the publication gate**

Set the audit validation fields that are proven by Preview/local checks. Leave `productionPassed` false until Task 9. Run:

```powershell
node scripts/check-content-sprint-1-safety-test.mjs
node scripts/check-cms-safety.mjs
git -c safe.directory="$repo" diff --check
```

Expected: self-test and general safety pass; the main Sprint 1 gate remains intentionally blocked on production acceptance.

- [ ] **Step 9: Commit the pre-PR validation record**

Run:

```powershell
git -c safe.directory="$repo" add docs/CONTENT_SPRINT_1_PUBLIC_RISK_AUDIT.md docs/CONTENT_SPRINT_1_PUBLIC_RISK_AUDIT.json docs/CONTENT_SPRINT_1_AUDIT.md
git -c safe.directory="$repo" commit -m "docs(content): verify Sprint 1 safe corrections"
```

---

### Task 8: Push the branch, create the review PR and pass required checks

**Files:**
- Modify only if a check finds a real defect: the exact file reported by that check.
- Modify after Preview deployment evidence: `docs/CONTENT_SPRINT_1_PUBLIC_RISK_AUDIT.md`
- Modify after Preview deployment evidence: `docs/CONTENT_SPRINT_1_PUBLIC_RISK_AUDIT.json`

**Interfaces:**
- Consumes: validated branch from Task 7.
- Produces: PR `fix(content): clean published procurement and unverified manufacturing claims` with successful required checks.

- [ ] **Step 1: Audit the final branch diff**

Run:

```powershell
git -c safe.directory="$repo" status --short
git -c safe.directory="$repo" diff --check origin/main...HEAD
git -c safe.directory="$repo" diff --name-only origin/main...HEAD
git -c safe.directory="$repo" diff --numstat origin/main...HEAD
node scripts/check-cms-safety.mjs
```

Expected: no backup, token, temporary query result, build output, binary image or unrelated file is present.

- [ ] **Step 2: Push without force**

Run:

```powershell
git -c safe.directory="$repo" push -u origin feature/content-sprint-1-safe-published-fixes
```

Expected: normal fast-forward push succeeds.

- [ ] **Step 3: Create the PR**

Create a PR with:

```text
Base: main
Compare: feature/content-sprint-1-safe-published-fixes
Title: fix(content): clean published procurement and unverified manufacturing claims
```

The body must include Strategy A rationale; exact Published IDs corrected; Draft-only IDs; manual-review IDs; backup path, size, SHA-256 and timestamp; local/Preview validation; and explicit statements that no document, asset or revision was deleted, no Seed/Import ran, GA4 was unchanged and Cloudflare configuration was unchanged.

- [ ] **Step 4: Wait for required checks and Preview deployment**

Run:

```powershell
gh pr checks --repo basketmanyork-design/poxiol-site --watch
```

Expected: every required check passes. A non-required external check may be documented, but required failures must be fixed rather than bypassed.

- [ ] **Step 5: Validate the PR Preview**

Repeat Task 7’s route, content, JSON-LD, analytics, contact and email-obfuscation checks against the PR Preview URL. Confirm the MVP Soccer category is absent and all existing authoritative category URLs remain `200`.

- [ ] **Step 6: Update evidence and enable the CI gate**

Set `validation.previewPassed`, `jsonLdConsistent`, `ga4Preserved`, `cloudflareAnalyticsSingle` and `emailObfuscationDisabled` to `true` only after observed Preview checks. Keep `productionPassed: false`; to avoid asserting production before merge, the CI checker must accept `productionPassed: false` before merge and require it in the post-merge verification command:

Change `validateSprint1Audit` to accept an options object:

```js
export function validateSprint1Audit(audit, {requireProduction = false} = {}) {
  // existing structural and zero-risk checks remain unchanged
  const previewKeys = [
    'previewPassed',
    'jsonLdConsistent',
    'ga4Preserved',
    'cloudflareAnalyticsSingle',
    'emailObfuscationDisabled',
  ]
  for (const key of previewKeys) {
    if (audit.validation?.[key] !== true) {
      throw new Error(`validation.${key} must equal true`)
    }
  }
  if (requireProduction && audit.validation?.productionPassed !== true) {
    throw new Error('validation.productionPassed must equal true')
  }
}
```

The direct-run CI path calls `validateSprint1Audit(audit)`; the post-production check in Task 9 imports it and calls `validateSprint1Audit(audit, {requireProduction: true})`.

- [ ] **Step 7: Update the fixture and re-run checks**

Add this case to `scripts/check-content-sprint-1-safety-test.mjs`:

```js
assert.doesNotThrow(() =>
  validateSprint1Audit(
    {...valid, validation: {...valid.validation, productionPassed: false}},
    {requireProduction: false},
  ),
)
assert.throws(
  () =>
    validateSprint1Audit(
      {...valid, validation: {...valid.validation, productionPassed: false}},
      {requireProduction: true},
    ),
  /validation\.productionPassed/,
)
```

Run:

```powershell
node scripts/check-content-sprint-1-safety-test.mjs
node scripts/check-content-sprint-1-safety.mjs
node scripts/check-cms-safety.mjs
git -c safe.directory="$repo" diff --check
```

Expected: all commands pass.

- [ ] **Step 8: Commit, push and wait for the updated checks**

Run:

```powershell
git -c safe.directory="$repo" add scripts/check-content-sprint-1-safety.mjs scripts/check-content-sprint-1-safety-test.mjs docs/CONTENT_SPRINT_1_PUBLIC_RISK_AUDIT.md docs/CONTENT_SPRINT_1_PUBLIC_RISK_AUDIT.json
git -c safe.directory="$repo" commit -m "fix(content): clean published procurement and unverified manufacturing claims"
git -c safe.directory="$repo" push origin feature/content-sprint-1-safe-published-fixes
gh pr checks --repo basketmanyork-design/poxiol-site --watch
```

Expected: required checks pass for the new head. Do not force-push.

---

### Task 9: Merge, monitor production and close the verification loop

**Files:**
- Modify before merge: `docs/CONTENT_SPRINT_1_PUBLIC_RISK_AUDIT.md`
- Modify before merge: `docs/CONTENT_SPRINT_1_PUBLIC_RISK_AUDIT.json`
- No repository file is changed after merge unless a separate reviewed hotfix is required.

**Interfaces:**
- Consumes: green PR from Task 8.
- Produces: merge commit, successful Cloudflare production deployment, verified live content and final report.

- [ ] **Step 1: Confirm the PR head and required checks**

Run:

```powershell
gh pr view --repo basketmanyork-design/poxiol-site --json number,url,state,isDraft,headRefOid,baseRefName,mergeable,mergeStateStatus,statusCheckRollup
gh pr checks --repo basketmanyork-design/poxiol-site --required
```

Expected: base `main`, expected feature head, mergeable, and all required checks pass.

- [ ] **Step 2: Merge with a merge commit**

Run:

```powershell
$head = gh pr view --repo basketmanyork-design/poxiol-site --json headRefOid --jq .headRefOid
gh pr merge --repo basketmanyork-design/poxiol-site --merge --match-head-commit $head
```

Expected: merge succeeds without `--admin`, squash, rebase or force.

- [ ] **Step 3: Monitor the `poxiol-site` production deployment**

Use the existing Cloudflare connection or:

```powershell
npx wrangler pages deployment list --project-name poxiol-site
```

Poll for at most 15 minutes, every 30 seconds. The accepted deployment must be environment `production`, branch `main`, and commit equal to the PR merge commit. Do not change project configuration.

- [ ] **Step 4: Verify live routes with cache-busting**

Check ordinary and timestamped URLs for:

- `/`
- `/products/`
- `/products/basketball-uniforms/`
- `/products/soccer-jerseys/`
- `/faq/`
- `/free-mockup/`
- `/get-quote/`
- `/contact/`
- `/sitemap.xml`
- `/robots.txt`
- `/llms.txt`

Expected: all critical pages return `200`; no Draft URL enters sitemap; no unexpected 404/500; ordinary and cache-busting responses contain the same approved procurement facts.

- [ ] **Step 5: Run final production risk and infrastructure checks**

Confirm live production:

- does not expose `15-25 Days`, `15–25 Days`, `30,000+ units monthly`, `KIAN ink`, `EPSON print heads`, or the MVP Soccer test card;
- shows `Sample MOQ: 1 set`, `2–3 working days after mockup approval`, `7–12 working days after sample or artwork approval`, inspection before shipment and `±2 cm`;
- has visible FAQ text equal to `FAQPage` JSON-LD;
- loads `G-W5YLNQ39X1` once, no GTM and no old Okki script;
- loads Cloudflare Web Analytics once;
- contains no `/cdn-cgi/l/email-protection`, `email-decode.min.js` or `data-cfemail`;
- preserves `mailto:` and `wa.me`.

- [ ] **Step 6: Complete the production acceptance record**

On the feature branch only, set `validation.productionPassed` to `true` after the live checks. Run:

```powershell
node -e "import('./scripts/check-content-sprint-1-safety.mjs').then(({validateSprint1Audit}) => { const fs=require('node:fs'); const audit=JSON.parse(fs.readFileSync('docs/CONTENT_SPRINT_1_PUBLIC_RISK_AUDIT.json','utf8')); validateSprint1Audit(audit,{requireProduction:true}); console.log('production acceptance passed') })"
```

Because the PR is already merged, do not push this evidence directly to `main`. Store it in the final execution report unless a separate documentation-only PR is explicitly approved.

- [ ] **Step 7: Apply rollback rules if production regresses**

If any live risk remains:

1. verify whether it comes from Sanity Published content, Legacy fallback or cache;
2. if cache-only, purge through existing authorized controls and re-test;
3. if content, create a reviewed Draft restoring the affected fields from the verified external backup;
4. publish only that rollback Draft;
5. if code, create a separate hotfix branch and PR from current `main`;
6. never delete the backup, document, Draft or asset.

- [ ] **Step 8: Deliver the final Sprint 1 report**

Report:

- Strategy A, branch, PR, merge commit and production commit;
- backup path and SHA-256;
- Published and Draft scan counts;
- finding and fix counts for procurement, capacity, KIAN/EPSON and MVP Soccer;
- IDs published, kept Draft and requiring manual review;
- status of Products, basketball, soccer, FAQ, free mockup, get quote and contact;
- old-parameter, claim, trademark, JSON-LD, sitemap, robots, llms.txt, GA4, Cloudflare analytics, email-obfuscation and broken-link results;
- remaining risks and the next action: begin the separately reviewed Sprint 1 Draft optimization track.

Do not begin the Draft optimization track automatically.
