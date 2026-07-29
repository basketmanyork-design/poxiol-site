# POXIOL Buyer Knowledge Base Batch 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade three established POXIOL knowledge assets and create two new high-value buyer guides as audited, revision-guarded Sanity Drafts without publishing or changing Production content.

**Architecture:** Use an ignored Sanity CLI workspace to hold a deterministic content manifest, validation tests, sanitized baseline metadata, dry-run results and apply logs. Every Sanity write is a single-document mutation: existing Drafts use `ifRevisionID`, new deterministic Draft IDs use `create`, and all mutations must pass `dryRun: true` before application. A committed completion report records IDs, intent mapping and validation without storing content exports, credentials or raw API responses.

**Tech Stack:** Sanity Studio 3.37.0, `sanity exec --with-user-token`, Sanity JS client mutations, GROQ, Node.js 22, Node test runner, Markdown audit reports.

## Global Constraints

- Work on `feature/content-sprint-1-safe-published-fixes`; never write directly to `main`.
- All five article changes and both supporting author documents remain Draft-only.
- Never publish, delete, discard, run Seed, run Dataset Import, upload assets, deploy Studio, deploy Schema, or modify Cloudflare/GA4.
- Never print, save, commit or include a Token, Authorization header or raw Sanity error body in reports.
- Preserve Published article documents and their `_rev` values.
- Preserve the three established base IDs, slugs, article types and routes.
- Existing Basketball route: `https://www.poxiol.com/guides/how-to-order-custom-basketball-uniforms/`.
- Existing Soccer route: `https://www.poxiol.com/blog/soccer-jersey-buying-guide/`.
- Existing MOQ route: `https://www.poxiol.com/resources/custom-teamwear-moq-production-time/`.
- New Manufacturer route: `https://www.poxiol.com/guides/custom-teamwear-manufacturer-buying-guide/`.
- New QC route: `https://www.poxiol.com/guides/teamwear-quality-control-checklist/`.
- Use only `POXIOL Production Team` and `POXIOL Quality Control Team`; never invent people, credentials or biographies.
- Use only approved procurement values:
  - `Sample MOQ: 1 set.`
  - `Sample production: 2–3 working days after mockup approval.`
  - `Bulk production: 7–12 working days after sample or artwork approval.`
  - `Quality control: inspection before shipment.`
  - `Size tolerance: ±2 cm.`
- Do not state unverified capacity, equipment brands, certifications, customer counts, case results, testimonials or guaranteed outcomes.
- Do not reference `product-basketball-mvp`, `product-soccer-mvp`, `faq-58b766260485677a`, or another MVP/risky document.
- A failed or changed revision, duplicate slug, duplicate Canonical, missing reference or unsafe FAQ blocks all writes.
- Do not mark the batch ready to publish while the static Preview and Portable Text table-rendering blockers remain.

---

## Content Contract

### Target article identity

| Key | Draft ID | Base ID | Article type | Slug |
| --- | --- | --- | --- | --- |
| basketball | `drafts.ac118ecd57c74a80` | `ac118ecd57c74a80` | `guide` | `how-to-order-custom-basketball-uniforms` |
| soccer | `drafts.96636fb2fea64bad` | `96636fb2fea64bad` | `blog` | `soccer-jersey-buying-guide` |
| moq | `drafts.9f01531eac5844f8` | `9f01531eac5844f8` | `resource` | `custom-teamwear-moq-production-time` |
| manufacturer | `drafts.article.custom-teamwear-manufacturer-buying-guide` | `article.custom-teamwear-manufacturer-buying-guide` | `guide` | `custom-teamwear-manufacturer-buying-guide` |
| qc | `drafts.article.teamwear-quality-control-checklist` | `article.teamwear-quality-control-checklist` | `guide` | `teamwear-quality-control-checklist` |

### Exact SEO metadata

| Key | SEO title | Meta description | Focus keyword |
| --- | --- | --- | --- |
| manufacturer | `Custom Teamwear Manufacturer Buying Guide \| POXIOL` | `Evaluate a custom teamwear manufacturer by specifications, sampling, quality control, communication and repeat-order readiness before placing an order.` | `custom teamwear manufacturer buying guide` |
| basketball | `Custom Basketball Uniform Buying Guide \| POXIOL` | `Compare fabric, fit, printing, size mix, samples and QC when sourcing custom basketball jerseys, shorts and reversible team sets.` | `custom basketball uniform buying guide` |
| soccer | `Custom Soccer Jersey Buying Guide \| POXIOL` | `A B2B guide to buying custom soccer jerseys and kits, covering fabric, fit, sponsor artwork, samples, production timing and quality checks.` | `custom soccer jersey buying guide` |
| moq | `Custom Teamwear MOQ and Production Time Guide \| POXIOL` | `Understand sample MOQ, sample production, bulk timelines, approval dependencies and schedule risks when sourcing custom teamwear.` | `custom teamwear MOQ` |
| qc | `Teamwear Quality Control Checklist \| POXIOL` | `Use this practical checklist to review materials, printing, measurements, stitching, personalization, quantities and packing before shipment.` | `teamwear quality control checklist` |

Set `seo.ogTitle` and `seo.ogDescription` to the same unique title and description. Set `seo.schemaType = "Article"`, `seo.indexStatus = "index"`, `seo.nofollow = false`, and `structuredDataType = "Article"`.

Set `lastReviewedAt` and `updatedAt` to the single ISO timestamp captured at apply time for all five Drafts. Preserve the existing `publishedAt` on upgraded documents and omit `publishedAt` from new Drafts.

The existing Article template generates BreadcrumbList and Article JSON-LD from the resolved route and metadata. It generates FAQPage only when the referenced visible FAQ array is non-empty; therefore every Draft must retain five valid `faqReferences`.

### Author references

- Manufacturer, Basketball, Soccer and MOQ:
  - `author._ref = "author.poxiol-production-team"`
  - `reviewedBy._ref = "author.poxiol-production-team"`
- QC:
  - `author._ref = "author.poxiol-quality-control-team"`
  - `reviewedBy._ref = "author.poxiol-production-team"`

### Deterministic FAQ reference sets

| Key | Ordered FAQ IDs |
| --- | --- |
| manufacturer | `faq-33252ab0a6926f06`, `faq-453359d1805fe72b`, `faq-205ea92b5cfb37e6`, `faq-cc10b4077f4722ae`, `faq-5d50bbdc631930aa` |
| basketball | `faq-5c385d15e15eaf8e`, `faq-a2dc8dceb5f6bc7b`, `faq-95c2f6a0a59a0ff9`, `faq-cd22732a9a169194`, `faq-04c7df5ef8a2773e` |
| soccer | `faq-e8fbe50f21163011`, `faq-813dafa082364131`, `faq-ff432213b9506070`, `faq-205ea92b5cfb37e6`, `faq-cc10b4077f4722ae` |
| moq | `faq-5d50bbdc631930aa`, `faq-e0caaeffefe745c1`, `faq-205ea92b5cfb37e6`, `faq-9f99d2124557cb88`, `faq-453359d1805fe72b` |
| qc | `faq-cc10b4077f4722ae`, `faq-04c7df5ef8a2773e`, `faq-0de3dde898e21b57`, `faq-7804abc6a9113d9b`, `faq-9f99d2124557cb88` |

Every FAQ answer must be resolved through Draft perspective and scanned before mutation. A selected answer containing an obsolete procurement value, KIAN, EPSON, a trademark claim, an unsupported capacity/certification claim, or a missing answer blocks the whole batch.

### Deterministic product reference sets

| Key | Ordered product IDs |
| --- | --- |
| manufacturer | `a116b52b29234e52`, `2a600b0ffeaf4b10`, `64a9b79c76a04895` |
| basketball | `a116b52b29234e52`, `6b8199fa3c644add`, `34811e3aade14fff`, `061bfa7135304966` |
| soccer | `2a600b0ffeaf4b10`, `ee1aaca7cc114b7d`, `db33ee8eec054d35`, `a1631f3f7c894178` |
| moq | `061bfa7135304966`, `2a600b0ffeaf4b10`, `64a9b79c76a04895` |
| qc | `a116b52b29234e52`, `2a600b0ffeaf4b10`, `64a9b79c76a04895` |

### Deterministic case-study reference sets

| Key | Ordered case IDs |
| --- | --- |
| manufacturer | `case-study-case-001`, `case-study-case-002`, `case-study-case-003`, `case-study-case-004` |
| basketball | `case-study-case-003`, `case-study-case-001` |
| soccer | `case-study-case-002`, `case-study-case-001` |
| moq | `case-study-case-001`, `case-study-case-004` |
| qc | `case-study-case-001`, `case-study-case-002`, `case-study-case-003` |

These are links only. Do not repeat customer, result, quantity, timing or testimonial claims from case-study content.

### Per-article editorial facts

#### Manufacturer Guide

- Direct Answer: evaluate suppliers by specification control, sample quality, communication, QC evidence and repeat-order readiness, not price alone.
- Buyer Types: clubs, schools, academies, sportswear brands, distributors and custom retailers.
- Specifications: garment scope, fabric/composition/GSM selected per project, decoration method, size range, approved artwork, personalization, packaging and shipping terms.
- Checklist: confirm legal artwork use; send quantity/size breakdown; approve mockup; inspect sample; lock specifications; confirm bulk schedule; define inspection evidence; retain reorder records.
- Common Mistakes: comparing unmatched specifications, skipping the sample, approving incomplete artwork, omitting size breakdowns, relying on verbal changes, ignoring shipping time.
- Sample Process: requirements → mockup → approval → one-set sample → measurement/appearance review → written bulk approval.
- Production: use only the approved sample and bulk production statements; note that complex/peak-season orders require a confirmed schedule.
- QC: verify material, color/print, measurements, stitching, personalization, quantity and packing before shipment.
- Risk callout: low quoted price without a controlled specification and approval record can increase rework and reorder risk.

#### Basketball Guide

- Direct Answer: define jersey/short construction, fabric, fit, decoration, size mix and personalization before comparing suppliers.
- Buyer Types: school teams, clubs, academies, leagues, event organizers and distributors.
- Specifications: jersey and shorts set, single-layer or reversible construction, neckline/armhole finish, fabric/GSM selected per use, names/numbers, logo placement, adult/youth size mix and packing.
- Checklist: artwork permission, roster and size breakdown, reversible-side requirements, color references, sample approval, measurement review, number/name accuracy and packing list.
- Common Mistakes: using a generic size chart, failing to separate reversible-side artwork, late roster changes, unreadable number contrast, assuming every fabric weight fits every use.
- Sample, production and QC sections use only approved timing/tolerance values and basketball-specific print, seam, measurement and personalization checks.
- Risk callout: sponsor and tournament marks require buyer authorization; do not imply licensing.

#### Soccer Guide

- Direct Answer: define whether the order is jerseys only or a full kit, then lock fabric, fit, artwork, numbering, size mix and goalkeeper requirements.
- Buyer Types: clubs, academies, schools, tournaments, distributors and custom retailers.
- Specifications: jersey, shorts, socks, goalkeeper variation, fabric selected per climate/use, fit, collar/cuff, sponsor/logo placement, names/numbers and packaging.
- Checklist: authorized crest/sponsor artwork, home/away/goalkeeper files, roster, size mix, color references, sample approval, production schedule and packing breakdown.
- Common Mistakes: missing goalkeeper requirements, unapproved sponsor logos, inconsistent number files, assuming jersey and sock colors match without samples, treating shipping time as production time.
- Sample, production and QC sections use only approved timing/tolerance values and soccer-specific panel, print, personalization and set-count checks.
- Risk callout: official club/tournament marks must be supplied with authorization.

#### MOQ Guide

- Direct Answer: sample MOQ is one set; sample production is 2–3 working days after mockup approval; bulk production is 7–12 working days after sample or artwork approval, subject to confirmed scope and schedule.
- Buyer Types: first-time buyers, clubs, schools, brands, distributors and buyers planning repeat orders.
- Specifications table: sample MOQ, sample production, bulk production, QC, size tolerance and schedule dependencies.
- Checklist: product, quantity, size breakdown, artwork, personalization, material, packaging, destination, required date and approval contacts.
- Common Mistakes: confusing sample MOQ with bulk pricing, counting shipping as production, changing specifications after approval, requesting dates before supplying complete files.
- Sample Process: requirements → mockup → approval → one-set sample → review → bulk decision.
- Production section explains schedule dependencies without promising delivery time.
- Risk callout: timeline starts from the relevant approval point, not the first inquiry date.

#### QC Checklist

- Direct Answer: inspect materials, print/color, measurements, stitching, personalization, quantities and packing against the approved sample/specification before shipment.
- Buyer Types: sourcing managers, team managers, schools, clubs, brands and distributors.
- Specifications table: inspection area, buyer-approved reference and evidence to retain.
- Checklist stages: incoming material/reference review, approved sample, printing/decoration, cutting/sewing, measurements, personalization, set/count verification, packing and pre-shipment evidence.
- Common Mistakes: no approved reference, checking appearance but not measurements, incomplete roster verification, accepting unclear photos, failing to verify carton/packing counts.
- Sample and production sections explain approval checkpoints and inspection-before-shipment without claiming an unsupported inspection standard or certification.
- Risk callout: do not claim AQL, laboratory testing, certification or third-party inspection unless documented for the specific order.

---

### Task 1: Create a verified pre-write backup and sanitized baseline

**Files:**
- Create outside Git: a timestamped `poxiol-production-before-knowledge-batch-1-YYYYMMDD-HHMMSS.tar.gz` under `C:\Users\baske\poxiol-private-backups`
- Create ignored: `studio/.sanity/content-sprint-2-batch-1/baseline.json`
- Create ignored: `studio/.sanity/content-sprint-2-batch-1/backup-metadata.json`
- Create ignored: `studio/.sanity/content-sprint-2-batch-1/preflight.mjs`

**Interfaces:**
- Consumes: approved design and target IDs in this plan.
- Produces: `baseline.json` containing only IDs, `_rev`, types, slugs, Canonicals, reference existence and counts; backup path/size/SHA-256.

- [ ] **Step 1: Verify the Git boundary**

Run:

```powershell
git branch --show-current
git status --short
git rev-parse HEAD
```

Expected: branch `feature/content-sprint-1-safe-published-fixes`, no unrelated changes, and the approved design/plan commits present.

- [ ] **Step 2: Export the production dataset outside Git**

Run from `studio`:

```powershell
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backupDirectory = Join-Path $env:USERPROFILE 'poxiol-private-backups'
New-Item -ItemType Directory -Force -Path $backupDirectory | Out-Null
$backupPath = Join-Path $backupDirectory "poxiol-production-before-knowledge-batch-1-$stamp.tar.gz"
npx sanity dataset export production $backupPath
$backup = Get-Item -LiteralPath $backupPath
$hash = Get-FileHash -LiteralPath $backupPath -Algorithm SHA256
$metadata = [ordered]@{
  path = $backup.FullName
  size = $backup.Length
  sha256 = $hash.Hash
}
$metadataPath = Join-Path (Resolve-Path '.sanity/content-sprint-2-batch-1').Path 'backup-metadata.json'
[IO.File]::WriteAllText($metadataPath, ($metadata | ConvertTo-Json), (New-Object Text.UTF8Encoding($false)))
```

Do not print archive contents.

- [ ] **Step 3: Verify the backup**

Run:

```powershell
$metadataText = [IO.File]::ReadAllText((Resolve-Path '.sanity/content-sprint-2-batch-1/backup-metadata.json'))
$metadata = $metadataText | ConvertFrom-Json
$backup = Get-Item -LiteralPath $metadata.path
$hash = Get-FileHash -LiteralPath $metadata.path -Algorithm SHA256
if ($backup.Length -le 0) { throw 'Backup is empty' }
if ($hash.Hash -ne $metadata.sha256) { throw 'Backup SHA-256 mismatch' }
if ($hash.Hash -notmatch '^[A-Fa-f0-9]{64}$') { throw 'Backup SHA-256 is invalid' }
Write-Output "BACKUP_VERIFIED path=$($backup.FullName) size=$($backup.Length) sha256=$($hash.Hash)"
```

Expected: file exists, size is greater than zero, SHA-256 is 64 hexadecimal characters. Stop if verification fails.

- [ ] **Step 4: Write the read-only preflight**

`preflight.mjs` must use `getCliClient({apiVersion: "2025-02-19"})`, fetch with `perspective: "raw"` and `useCdn: false`, and emit only the sanitized fields defined by `baseline.json`.

It must assert:

```js
const existing = {
  basketball: {baseId: 'ac118ecd57c74a80', draftId: 'drafts.ac118ecd57c74a80', slug: 'how-to-order-custom-basketball-uniforms', articleType: 'guide'},
  soccer: {baseId: '96636fb2fea64bad', draftId: 'drafts.96636fb2fea64bad', slug: 'soccer-jersey-buying-guide', articleType: 'blog'},
  moq: {baseId: '9f01531eac5844f8', draftId: 'drafts.9f01531eac5844f8', slug: 'custom-teamwear-moq-production-time', articleType: 'resource'},
}
```

It must also assert that neither base nor Draft IDs exist for the two new articles and two author identities.

- [ ] **Step 5: Run the preflight**

Run from `studio`:

```powershell
npx sanity exec .sanity/content-sprint-2-batch-1/preflight.mjs --with-user-token
```

Expected: `PREFLIGHT_OK`, three existing Draft revisions captured, five Published article revisions captured or explicit absence for the two new base IDs, all selected references resolve, no duplicate slug/Canonical, and no mutation request.

### Task 2: Build and test the deterministic Draft manifest

**Files:**
- Create ignored: `studio/.sanity/content-sprint-2-batch-1/manifest.mjs`
- Create ignored: `studio/.sanity/content-sprint-2-batch-1/manifest.test.mjs`
- Create ignored: `studio/.sanity/content-sprint-2-batch-1/manifest-summary.json`

**Interfaces:**
- Consumes: Content Contract above and `baseline.json`.
- Produces: `authors` array with two Draft documents; `articles` array with five full Draft payloads; deterministic body/reference keys.

- [ ] **Step 1: Write manifest validation tests**

Tests must assert:

```js
assert.equal(authors.length, 2)
assert.equal(articles.length, 5)
assert.equal(new Set(articles.map((item) => item.document.slug.current)).size, 5)
assert.equal(new Set(articles.map((item) => item.document.seo.canonicalUrl)).size, 5)
assert.equal(new Set(articles.map((item) => item.document.seo.focusKeyword)).size, 5)
assert.ok(articles.every((item) => item.document.publishStatus === 'draft'))
assert.ok(articles.every((item) => item.document.structuredDataType === 'Article'))
assert.ok(articles.every((item) => item.document.seo.schemaType === 'Article'))
assert.ok(articles.every((item) => item.document.faqReferences.length === 5))
assert.ok(articles.every((item) => item.document.relatedProducts.length >= 3))
assert.ok(articles.every((item) => item.document.relatedCaseStudies.length >= 2))
```

The tests must also inspect Portable Text and require these headings in every article:

```js
[
  'Direct Answer',
  'Buyer Type',
  'Key Specifications',
  'Procurement Checklist',
  'Common Mistakes',
  'Sample Process',
  'Production Timeline',
  'Quality Control Process',
  'Procurement Risk Notes',
]
```

Require at least one `tableBlock`, at least one warning `callout`, a CTA to `/get-quote/` or `/free-mockup/`, and no `publishedAt` on the two new Drafts.

- [ ] **Step 2: Verify the tests fail before the manifest exists**

Run:

```powershell
node --test .sanity/content-sprint-2-batch-1/manifest.test.mjs
```

Expected: FAIL because `manifest.mjs` is absent.

- [ ] **Step 3: Implement Portable Text helpers and exact payload metadata**

Implement deterministic helpers:

```js
export function span(key, text) {
  return {_key: key, _type: 'span', marks: [], text}
}

export function block(key, text, style = 'normal', listItem, level) {
  return {
    _key: key,
    _type: 'block',
    style,
    markDefs: [],
    children: [span(`${key}-span`, text)],
    ...(listItem ? {listItem, level: level || 1} : {}),
  }
}

export function table(key, caption, rows) {
  return {
    _key: key,
    _type: 'tableBlock',
    caption,
    rows: rows.map((cells, index) => ({_key: `${key}-row-${index + 1}`, _type: 'object', cells})),
  }
}

export function callout(key, title, body) {
  return {_key: key, _type: 'callout', title, body, tone: 'warning'}
}

export function reference(key, ref) {
  return {_key: key, _type: 'reference', _ref: ref}
}

export function faqReference(key, ref, displayOrder) {
  return {_key: key, _type: 'faqReference', faq: {_type: 'reference', _ref: ref}, displayOrder}
}
```

Use the exact identity, metadata, authors and reference arrays from the Content Contract.

- [ ] **Step 4: Write the five full bodies**

Each body must implement every fact under its Per-article editorial facts section. Use original English prose with:

Related Products and Related Case Studies are stored in the structured `relatedProducts` and `relatedCaseStudies` arrays defined by the exact reference tables above; do not duplicate case claims in body copy.

- Direct Answer as the first heading and first paragraph.
- One buyer-types list.
- One parameter/specification table.
- At least one five-item procurement checklist.
- At least four common mistakes.
- Numbered sample process.
- Approved production timing statements.
- QC inspection details.
- Warning callout.
- A short closing transition to the CTA.

Do not copy complete paragraphs between articles.

- [ ] **Step 5: Add safety scans to the tests**

Reject:

```js
const forbidden = [
  /15\s*[–-]\s*25\s*days/i,
  /7\s*[–-]\s*21\s*days/i,
  /10\s*[–-]\s*14\s*days/i,
  /30,?000\+?\s*units/i,
  /\bKIAN\b/i,
  /\bEPSON\b/i,
  /\bAQL\b/i,
  /certified|certification guaranteed/i,
  /3,?000\+\s*(clubs|schools|customers)/i,
  /product-basketball-mvp|product-soccer-mvp|faq-58b766260485677a/i,
]
```

Also require the approved MOQ, sample, bulk, QC and tolerance statements in each article where contextually applicable.

- [ ] **Step 6: Run the manifest tests**

Run:

```powershell
node --test .sanity/content-sprint-2-batch-1/manifest.test.mjs
```

Expected: PASS with all five article payloads and two author payloads validated.

### Task 3: Run a seven-document Revision Guard dry run

**Files:**
- Create ignored: `studio/.sanity/content-sprint-2-batch-1/apply.mjs`
- Create ignored: `studio/.sanity/content-sprint-2-batch-1/dry-run-summary.json`

**Interfaces:**
- Consumes: `baseline.json` and exports from `manifest.mjs`.
- Produces: seven successful dry-run results with IDs and action types only.

- [ ] **Step 1: Implement mutation builders**

Existing Draft mutations:

```js
{
  patch: {
    id: item.draftId,
    ifRevisionID: baseline.drafts[item.draftId]._rev,
    set: item.document,
  },
}
```

New Draft mutations:

```js
{
  create: {
    ...item.document,
    _id: item.draftId,
    _type: item.type,
  },
}
```

Do not include `_id`, `_rev`, `_createdAt` or `_updatedAt` in patch `set`.

- [ ] **Step 2: Add safety gates**

Before any mutation:

- Re-fetch all target IDs with raw perspective.
- Compare each existing Draft `_rev` with `baseline.json`.
- Confirm all four new base/Draft ID pairs remain absent.
- Confirm all five slugs and Canonicals remain unique.
- Resolve every author, FAQ, product and case reference.
- Scan resolved FAQ answer text with the forbidden patterns.
- Capture Published `_rev` values for the three existing base IDs.
- Refuse any command except `--dry-run` or `--apply-drafts`.

- [ ] **Step 3: Execute dry run**

For each of seven documents call:

```js
await client.mutate([mutation], {
  dryRun: true,
  returnDocuments: false,
  visibility: 'sync',
})
```

Run:

```powershell
npx sanity exec .sanity/content-sprint-2-batch-1/apply.mjs --with-user-token -- --dry-run
```

Expected:

```text
DRY_RUN_OK authors=2 existingArticlePatches=3 newArticles=2 publishedChanges=0
```

No full payload, FAQ answer, token or raw response may be printed.

### Task 4: Create supporting author Drafts

**Files:**
- Modify ignored: `studio/.sanity/content-sprint-2-batch-1/apply.mjs`
- Update ignored: `studio/.sanity/content-sprint-2-batch-1/apply-summary.json`

**Interfaces:**
- Consumes: dry-run-approved author mutations.
- Produces: two Draft-only author documents with deterministic IDs.

- [ ] **Step 1: Apply only author creates**

Run:

```powershell
npx sanity exec .sanity/content-sprint-2-batch-1/apply.mjs --with-user-token -- --apply-drafts --scope authors
```

Expected:

```text
APPLY_OK scope=authors created=2 updated=0 publishedChanges=0
```

- [ ] **Step 2: Read back and validate**

Require:

- Draft IDs exist.
- Base IDs do not exist.
- Names, roles, brand and active fields match the design.
- No biographies, credentials or avatar claims were added.

### Task 5: Upgrade the three existing article Drafts

**Files:**
- Update ignored: `studio/.sanity/content-sprint-2-batch-1/apply-summary.json`

**Interfaces:**
- Consumes: dry-run-approved patch mutations and verified author Drafts.
- Produces: three upgraded Draft overlays; Published articles unchanged.

- [ ] **Step 1: Apply Basketball Draft patch**

Run:

```powershell
npx sanity exec .sanity/content-sprint-2-batch-1/apply.mjs --with-user-token -- --apply-drafts --scope basketball
```

Expected: one updated Draft; base ID `_rev` unchanged.

- [ ] **Step 2: Read back Basketball**

Validate title, slug, article type, Canonical, required sections, 5 FAQ refs, 4 product refs, 2 case refs, CTA, reviewer and `publishStatus = "draft"`.

- [ ] **Step 3: Apply and verify Soccer**

Run:

```powershell
npx sanity exec .sanity/content-sprint-2-batch-1/apply.mjs --with-user-token -- --apply-drafts --scope soccer
```

Validate that article type remains `blog` and Canonical remains under `/blog/`.

- [ ] **Step 4: Apply and verify MOQ**

Run:

```powershell
npx sanity exec .sanity/content-sprint-2-batch-1/apply.mjs --with-user-token -- --apply-drafts --scope moq
```

Validate that article type remains `resource`, Canonical remains under `/resources/`, and all approved procurement values are exact.

### Task 6: Create the two new Guide Drafts

**Files:**
- Update ignored: `studio/.sanity/content-sprint-2-batch-1/apply-summary.json`

**Interfaces:**
- Consumes: dry-run-approved create mutations and verified author Drafts.
- Produces: two new deterministic Guide Drafts; no Published base documents.

- [ ] **Step 1: Create and verify Manufacturer Guide Draft**

Run:

```powershell
npx sanity exec .sanity/content-sprint-2-batch-1/apply.mjs --with-user-token -- --apply-drafts --scope manufacturer
```

Validate Draft ID, absent base ID, unique slug/Canonical, author/reviewer, required content, 5 FAQs, 3 products, 4 cases and CTA.

- [ ] **Step 2: Create and verify QC Checklist Draft**

Run:

```powershell
npx sanity exec .sanity/content-sprint-2-batch-1/apply.mjs --with-user-token -- --apply-drafts --scope qc
```

Validate Draft ID, absent base ID, unique slug/Canonical, QC author, Production reviewer, required content, 5 FAQs, 3 products, 3 cases and CTA.

### Task 7: Validate the complete Draft batch and write the review report

**Files:**
- Create: `docs/CONTENT_SPRINT_2_BATCH_1_DRAFT_REPORT.md`
- Read ignored: `studio/.sanity/content-sprint-2-batch-1/baseline.json`
- Read ignored: `studio/.sanity/content-sprint-2-batch-1/apply-summary.json`

**Interfaces:**
- Consumes: seven written Drafts and pre-write Published revision snapshot.
- Produces: committed, secret-free review report.

- [ ] **Step 1: Query all target documents with raw and Draft perspectives**

Confirm:

- Exactly five target article Drafts.
- Exactly two supporting author Drafts.
- Three upgraded Published IDs still exist with original `_rev`.
- Two new article base IDs and two new author base IDs remain absent.
- No document was deleted or published.

- [ ] **Step 2: Run content and link checks**

Verify:

- Required headings, table, checklist, sample, production, QC, FAQ and risk content.
- Five unique titles, descriptions, Canonicals and focus keywords.
- All references resolve in Draft perspective.
- All CTA paths exist in the repository.
- Forbidden term scan returns zero.
- Duplicate slug and Canonical scan returns zero.
- Keyword-intent overlap test reports the five approved distinct intents.

- [ ] **Step 3: Verify schema support**

Run from `studio`:

```powershell
npx tsc --noEmit
npx sanity schema validate --level error
npm run build
```

Expected: all PASS. These checks do not publish or deploy.

- [ ] **Step 4: Write the report**

The report must include:

- Backup path, size and SHA-256.
- Existing URLs upgraded.
- New Draft IDs.
- Supporting author Draft IDs.
- Target keyword and intent mapping.
- Related product IDs and labels.
- Related case IDs and labels.
- FAQ reference counts.
- SEO and Schema status.
- Internal-link status.
- Published revision comparison.
- Explicit statements: `Publish executed: NO`, `Seed executed: NO`, `Dataset Import executed: NO`.
- Known blockers: Preview static export, Portable Text table renderer, case evidence metadata.

- [ ] **Step 5: Run repository safety checks**

Run:

```powershell
git diff --check
git status --short
```

Confirm ignored payloads/backups are not staged, no secret or backup is in Git, and only the approved report is new.

- [ ] **Step 6: Commit the report**

```powershell
git add docs/CONTENT_SPRINT_2_BATCH_1_DRAFT_REPORT.md
git commit -m "docs(content): record buyer knowledge base draft batch"
```

Do not push, create a PR or publish unless separately instructed.

