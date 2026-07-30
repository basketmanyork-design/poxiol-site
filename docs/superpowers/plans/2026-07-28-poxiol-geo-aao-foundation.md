# POXIOL GEO + AAO Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a versioned machine-readable POXIOL capability contract and a schema-aligned, human-reviewed RFQ workflow without replacing the existing SEO, AEO, GEO, CMS, or static Cloudflare deployment.

**Architecture:** Pure JavaScript contract modules provide deterministic data to Node tests, the static asset generator, and Next.js components. The build emits capability, RFQ schema, and agent manifest JSON under `/.well-known/`; `/get-quote/` renders a client form that validates and serializes the same contract before posting multipart data to the existing Formspree endpoint.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript 5, Node.js 22 built-in test runner, Sanity Studio 3, Cloudflare Pages static export, Formspree.

## Global Constraints

- Preserve and strengthen SEO, AEO, and GEO; AAO is additive.
- Do not add automatic quotation, automatic payment, automatic order acceptance, or unattended purchasing.
- Every RFQ must state and require human review.
- Preserve `package-lock.json`; use npm only.
- Keep `output: "export"` and the `out/` Cloudflare Pages deployment.
- Do not add a server API, Server Action, database, secret, or public Formspree endpoint.
- Keep temporary `.cache/` and `.sandbox-home/` content out of Git.
- Use failing tests before production behavior changes.

---

## File Map

- `lib/aao/catalog.mjs`: canonical public capabilities and deterministic document builders.
- `lib/aao/rfq-contract.mjs`: RFQ normalization, validation, and FormData serialization.
- `scripts/generate-aao-assets.mjs`: writes validated machine contracts into `public/.well-known/`.
- `scripts/check-aao-build-output.mjs`: validates exported HTML and machine artifacts.
- `tests/aao-catalog.test.mjs`: catalog and manifest behavior.
- `tests/rfq-contract.test.mjs`: RFQ validation and serialization behavior.
- `tests/aao-build-output.test.mjs`: exported-site integration behavior.
- `components/forms/StructuredRfqForm.tsx`: buyer/agent-facing structured RFQ form.
- `app/get-quote/page.tsx`: CMS page plus structured RFQ form.
- `components/seo/GEOStructuredData.tsx`: canonical organization/service JSON-LD.
- `app/sitemap.ts`, `public/llms.txt`, `public/ai-summary.json`, `public/_headers`: discovery links and cache policy.
- `studio/schemaTypes/singletons/procurementStandards.ts`: structured editorial procurement fields.
- `package.json`: test, typecheck, AAO generation, and build hooks.

---

### Task 1: Canonical AAO Catalog and Machine Asset Generator

**Files:**
- Create: `tests/aao-catalog.test.mjs`
- Create: `lib/aao/catalog.mjs`
- Create: `scripts/generate-aao-assets.mjs`
- Create: `public/.well-known/poxiol-capabilities.json`
- Create: `public/.well-known/poxiol-rfq-schema.json`
- Create: `public/.well-known/poxiol-agent.json`
- Modify: `package.json`

**Interfaces:**
- Produces: `catalog`, `validateCatalog(catalog)`, `createCapabilityDocument(catalog)`, `createRfqSchema(catalog)`, and `createAgentManifest(catalog)`.
- Produces: CLI `node scripts/generate-aao-assets.mjs [output-directory]`.
- The generated contract identifier is `https://www.poxiol.com/.well-known/poxiol-capabilities.json`.

- [ ] **Step 1: Write the failing catalog tests**

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import {
  catalog,
  createAgentManifest,
  createCapabilityDocument,
  createRfqSchema,
  validateCatalog,
} from '../lib/aao/catalog.mjs'

test('publishes comparable capability ranges with manual review', () => {
  assert.deepEqual(validateCatalog(catalog), [])
  const document = createCapabilityDocument(catalog)
  assert.equal(document.contractVersion, '1.0.0')
  assert.equal(document.procurement.sampleLeadTime.unit, 'business_day')
  assert.equal(document.procurement.sampleLeadTime.min, 2)
  assert.equal(document.procurement.sampleLeadTime.max, 3)
  assert.equal(document.actions.requestForQuote.humanReviewRequired, true)
  assert.equal(document.automaticCommerce.quote, false)
})

test('rejects inverted lead-time ranges and duplicate identifiers', () => {
  const invalid = structuredClone(catalog)
  invalid.procurement.sampleLeadTime = {min: 4, max: 2, unit: 'business_day'}
  invalid.sports.push({...invalid.sports[0]})
  assert.deepEqual(validateCatalog(invalid), [
    'procurement.sampleLeadTime min must not exceed max',
    'sports identifiers must be unique',
  ])
})

test('links the RFQ schema and human form without advertising an API', () => {
  const schema = createRfqSchema(catalog)
  const manifest = createAgentManifest(catalog)
  assert.equal(schema.additionalProperties, false)
  assert.ok(schema.required.includes('manualReviewAccepted'))
  assert.equal(manifest.actions.requestForQuote.formUrl, 'https://www.poxiol.com/get-quote/')
  assert.equal(manifest.actions.requestForQuote.schemaUrl, 'https://www.poxiol.com/.well-known/poxiol-rfq-schema.json')
  assert.equal('apiUrl' in manifest.actions.requestForQuote, false)
})
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node --test tests/aao-catalog.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `lib/aao/catalog.mjs`.

- [ ] **Step 3: Implement the minimal catalog and builders**

Define stable identifiers for buyer types, sports, products, customization methods, and regions. Use explicit numeric ranges:

```js
export const catalog = Object.freeze({
  contractVersion: '1.0.0',
  lastReviewed: '2026-07-28',
  organization: {
    id: 'https://www.poxiol.com/#organization',
    name: 'POXIOL',
    legalName: 'POXIOL Teamwear',
    url: 'https://www.poxiol.com/',
    category: 'custom_teamwear_manufacturer',
  },
  procurement: {
    minimumOrder: {value: 1, unit: 'set', qualification: 'Sample and small-order support; project confirmation required.'},
    mockupLeadTime: {min: 2, max: 24, unit: 'hour', qualification: 'After complete requirements are received.'},
    sampleLeadTime: {min: 2, max: 3, unit: 'business_day', qualification: 'After mockup approval.'},
    bulkLeadTime: {min: 7, max: 12, unit: 'business_day', qualification: 'After sample or artwork approval; schedule confirmation required.'},
  },
  actions: {
    requestForQuote: {
      formUrl: 'https://www.poxiol.com/get-quote/',
      humanReviewRequired: true,
      automaticQuote: false,
      automaticOrderAcceptance: false,
    },
  },
})
```

`validateCatalog` must return deterministic messages in field order. Builders must deep-clone their output so callers cannot mutate the canonical catalog.

- [ ] **Step 4: Run the catalog tests and verify GREEN**

Run: `node --test tests/aao-catalog.test.mjs`

Expected: 3 tests pass.

- [ ] **Step 5: Add and test the deterministic generator**

Add a test that calls the generator with a temporary directory, parses all three files, and compares two runs byte-for-byte. The generator must terminate non-zero before writing when `validateCatalog` returns errors.

Run: `node --test tests/aao-catalog.test.mjs`

Expected: generator test fails before CLI support, then passes after `scripts/generate-aao-assets.mjs` is implemented.

- [ ] **Step 6: Add package scripts and generate public assets**

Set:

```json
{
  "scripts": {
    "generate:aao": "node scripts/generate-aao-assets.mjs",
    "test": "node --test tests/*.test.mjs",
    "typecheck": "tsc --noEmit",
    "build": "npm run generate:aao && next build && node scripts/generate-cms-redirects.mjs"
  }
}
```

Run: `npm run generate:aao`

Expected: three valid JSON files are written to `public/.well-known/`.

- [ ] **Step 7: Commit**

```bash
git add package.json lib/aao/catalog.mjs scripts/generate-aao-assets.mjs tests/aao-catalog.test.mjs public/.well-known
git commit -m "feat: publish machine-readable POXIOL capabilities"
```

---

### Task 2: RFQ Contract Validation and Serialization

**Files:**
- Create: `tests/rfq-contract.test.mjs`
- Create: `lib/aao/rfq-contract.mjs`

**Interfaces:**
- Consumes: `catalog` and `createRfqSchema(catalog)` from Task 1.
- Produces: `normalizeRfq(input, now?)`, `validateRfq(input, now?)`, and `toRfqFormData(validRfq)`.
- Validation returns `{ok: true, value}` or `{ok: false, errors: Record<string, string>}`.

- [ ] **Step 1: Write the failing valid-payload test**

```js
test('normalizes a valid RFQ into the published contract', () => {
  const result = validateRfq({
    fullName: '  Alex Buyer  ',
    email: 'alex@example.com',
    country: 'DE',
    buyerType: 'distributor',
    sport: 'basketball',
    productType: 'jersey_shorts_set',
    quantity: '30',
    quantityUnit: 'set',
    targetDeliveryDate: '2026-09-30',
    manualReviewAccepted: true,
  }, new Date('2026-07-28T00:00:00Z'))
  assert.equal(result.ok, true)
  assert.equal(result.value.fullName, 'Alex Buyer')
  assert.equal(result.value.quantity, 30)
  assert.equal(result.value.schemaVersion, '1.0.0')
  assert.equal(result.value.submissionPolicy, 'human_review_required')
})
```

- [ ] **Step 2: Verify RED**

Run: `node --test tests/rfq-contract.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Implement normalization and required-field validation**

Normalize trimmed strings, lowercase email, uppercase two-letter destination country, integer quantity, deduplicated customization arrays, schema version, and submission policy. Never infer a price or delivery promise.

- [ ] **Step 4: Verify GREEN**

Run: `node --test tests/rfq-contract.test.mjs`

Expected: valid-payload test passes.

- [ ] **Step 5: Add failing boundary tests**

Cover:

- quantity `0`, negative, decimal, and non-numeric;
- unknown buyer, sport, product, or unit identifier;
- target date before the supplied `now`;
- missing manual-review acceptance;
- invalid email and country code;
- extra input fields excluded from the normalized payload.

Run: `node --test tests/rfq-contract.test.mjs`

Expected: new tests fail with missing or incorrect field errors.

- [ ] **Step 6: Implement minimal boundary validation**

Use the identifiers in the public RFQ schema. Return one deterministic message per invalid field and do not throw for buyer input errors.

- [ ] **Step 7: Add failing FormData serialization test**

Assert that `toRfqFormData` includes readable scalar fields plus:

```js
assert.equal(formData.get('formType'), 'Structured RFQ v1.0.0')
assert.equal(formData.get('humanReviewRequired'), 'true')
assert.deepEqual(JSON.parse(formData.get('rfqPayload')), validRfq)
```

- [ ] **Step 8: Implement serialization and run GREEN**

Run: `node --test tests/rfq-contract.test.mjs`

Expected: all RFQ tests pass with no network calls.

- [ ] **Step 9: Commit**

```bash
git add lib/aao/rfq-contract.mjs tests/rfq-contract.test.mjs
git commit -m "feat: validate structured RFQ payloads"
```

---

### Task 3: Structured RFQ Page

**Files:**
- Create: `components/forms/StructuredRfqForm.tsx`
- Modify: `app/get-quote/page.tsx`
- Create: `tests/aao-build-output.test.mjs`
- Create: `scripts/check-aao-build-output.mjs`

**Interfaces:**
- Consumes: public RFQ identifiers and `validateRfq` / `toRfqFormData`.
- Produces: a form at `/get-quote/` with `data-rfq-schema-version="1.0.0"`.
- Posts to `NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT`, then routes to `/quote-received/`.

- [ ] **Step 1: Write the failing exported-page contract test**

The test reads `out/get-quote/index.html` and asserts:

```js
assert.match(html, /data-rfq-schema-version="1\.0\.0"/)
assert.match(html, /name="manualReviewAccepted"/)
assert.match(html, /Human review required/)
assert.match(html, /This submission is not an automatic quote or order acceptance\./)
```

Run: `node --test tests/aao-build-output.test.mjs`

Expected: FAIL because the baseline page contains none of these markers.

- [ ] **Step 2: Implement the minimal form UI**

Render accessible labeled controls for every required schema property. Use catalog identifiers as option values and human labels as text. Include optional customization, colors, team/brand, notes, target date, and file inputs.

The submit handler must:

1. call `validateRfq`;
2. show field-specific errors and focus the first invalid field;
3. call `toRfqFormData`;
4. append files and `sourcePage`;
5. post with `Accept: application/json`;
6. route only after a 2xx response.

- [ ] **Step 3: Integrate the form into `/get-quote/`**

Pass CMS chrome values for email and WhatsApp. Keep `FormContactFallback` before the CMS template and add the structured form through `contactSlot`.

- [ ] **Step 4: Build and verify GREEN**

Run:

```bash
npm run build
node --test tests/aao-build-output.test.mjs
```

Expected: build succeeds and the RFQ page contract test passes.

- [ ] **Step 5: Add submission error behavior tests**

Add pure tests to `tests/rfq-contract.test.mjs` for FormData content and a build-output check that the exported page contains the endpoint-configuration error and email/WhatsApp fallback text.

- [ ] **Step 6: Commit**

```bash
git add components/forms/StructuredRfqForm.tsx app/get-quote/page.tsx tests/aao-build-output.test.mjs scripts/check-aao-build-output.mjs
git commit -m "feat: add human-reviewed structured RFQ page"
```

---

### Task 4: Discovery and Canonical JSON-LD

**Files:**
- Modify: `components/seo/GEOStructuredData.tsx`
- Modify: `components/seo/StructuredData.tsx`
- Modify: `app/sitemap.ts`
- Modify: `public/llms.txt`
- Modify: `public/ai-summary.json`
- Modify: `public/_headers`
- Modify: `tests/aao-catalog.test.mjs`
- Modify: `tests/aao-build-output.test.mjs`

**Interfaces:**
- Consumes: Task 1 catalog/builders.
- Produces: one canonical organization ID and a qualified manufacturing service graph.
- Discovery files link all three `/.well-known/` documents.

- [ ] **Step 1: Write failing JSON-LD and discovery tests**

Assert:

- organization ID is `https://www.poxiol.com/#organization`;
- JSON-LD procurement values equal the capability contract;
- no `SearchAction` exists;
- sitemap includes `/ai-summary/` and `/get-quote/`;
- `llms.txt` links the capability contract, RFQ schema, agent manifest, and RFQ page;
- `_headers` applies JSON content type and one-hour public caching under `/.well-known/*`.

Run: `npm test`

Expected: discovery and JSON-LD tests fail against current output.

- [ ] **Step 2: Build canonical JSON-LD from the catalog**

Replace duplicated organization facts with builder output. Keep page-specific FAQ, breadcrumb, product, article, and collection schemas. Remove the nonexistent website search action.

- [ ] **Step 3: Update discovery files and sitemap**

Use `https://www.poxiol.com` consistently. Add explicit “human review required” and “not an automatic quote/order” notes.

- [ ] **Step 4: Build and verify GREEN**

Run:

```bash
npm run build
npm test
```

Expected: catalog, RFQ, discovery, and exported-output tests all pass.

- [ ] **Step 5: Commit**

```bash
git add components/seo app/sitemap.ts public/llms.txt public/ai-summary.json public/_headers tests
git commit -m "feat: connect GEO discovery to AAO contracts"
```

---

### Task 5: Structured Sanity Procurement Fields

**Files:**
- Modify: `studio/schemaTypes/singletons/procurementStandards.ts`
- Modify: `lib/sanity/queries.ts`
- Modify: `lib/cms/types.ts`
- Modify: `tests/aao-catalog.test.mjs`

**Interfaces:**
- Produces optional structured fields: `minimumOrderQuantity`, `minimumOrderUnit`, `mockupLeadTime`, `sampleLeadTime`, `bulkLeadTime`, `lastReviewed`, and `qualificationNotes`.
- Existing `defaultMOQ`, `sampleTime`, `bulkProductionTime`, `mockupTime`, `shippingNotes`, and `qualityPromise` remain readable.

- [ ] **Step 1: Add a failing structured procurement normalization test**

Add `mergeProcurementStandards(catalog, cmsValue)` to the wished-for catalog API and assert:

```js
const merged = mergeProcurementStandards(catalog, {
  minimumOrderQuantity: 5,
  minimumOrderUnit: 'set',
  sampleLeadTime: {min: 4, max: 6, unit: 'business_day'},
  lastReviewed: '2026-07-28',
})
assert.equal(merged.procurement.minimumOrder.value, 5)
assert.deepEqual(merged.procurement.sampleLeadTime, {
  min: 4,
  max: 6,
  unit: 'business_day',
  qualification: catalog.procurement.sampleLeadTime.qualification,
})
```

Run: `node --test tests/aao-catalog.test.mjs`

Expected: FAIL because `mergeProcurementStandards` is not exported.

- [ ] **Step 2: Implement validated merging**

Ignore absent optional CMS values, reject invalid ranges through `validateCatalog`, and preserve repository defaults on invalid CMS input.

- [ ] **Step 3: Add matching Sanity fields, query projection, and types**

Use number validation `Rule.integer().min(1)`, constrained unit lists, min/max objects, ISO date, and explicit qualification notes. Do not remove or rename legacy fields.

- [ ] **Step 4: Verify schema and frontend types**

Run:

```bash
npm run typecheck
node scripts/check-cms-schema-coverage.mjs
node scripts/check-cms-content-blockers.mjs
```

Expected: all commands exit 0.

- [ ] **Step 5: Commit**

```bash
git add studio/schemaTypes/singletons/procurementStandards.ts lib/sanity/queries.ts lib/cms/types.ts lib/aao/catalog.mjs tests/aao-catalog.test.mjs
git commit -m "feat: structure procurement standards in Sanity"
```

---

### Task 6: Full Verification and Documentation

**Files:**
- Create: `docs/POXIOL_GEO_AAO_FOUNDATION.md`
- Modify: `README.md`

**Interfaces:**
- Documents public contracts, versioning, manual review, Formspree configuration, CMS ownership, and future authenticated API boundary.

- [ ] **Step 1: Document operations**

Include exact public URLs, regeneration command, required environment variable, validation commands, contract change rules, and the explicit statement that no automatic quote/payment/order is provided.

- [ ] **Step 2: Run the complete fresh verification**

Run:

```bash
npm run generate:aao
npm run typecheck
npm test
node scripts/check-cms-visibility.mjs
node scripts/check-cms-list-mode.mjs
node scripts/check-article-route-conflicts.mjs
node scripts/check-cms-redirects.mjs
node scripts/check-cms-schema-coverage.mjs
node scripts/check-cms-content-blockers.mjs
node scripts/check-cms-final-preflight-test.mjs
node scripts/check-cms-safety.mjs
npm run build
node scripts/check-aao-build-output.mjs
git diff --check
git status --short
```

Expected:

- TypeScript exits 0.
- All Node tests pass with zero failures.
- Existing CMS checks pass.
- Preflight self-test reports 17/17.
- Static build exports every route and writes redirects.
- AAO output check validates three machine documents and `/get-quote/`.
- `git diff --check` has no whitespace errors.
- `.cache/` is the only untracked temporary directory and is not staged.

`npm run lint` is recorded separately as a pre-existing non-runnable script because the repository has no ESLint configuration and enters interactive initialization.

- [ ] **Step 3: Review the requirement matrix**

Confirm:

- SEO/AEO/GEO assets remain present;
- capability facts are machine comparable;
- RFQ schema is public and versioned;
- form payload is structured and human reviewed;
- no automatic quote, payment, or order path exists;
- no secret or Formspree endpoint is published;
- static export and Sanity fallbacks remain functional.

- [ ] **Step 4: Commit documentation**

```bash
git add README.md docs/POXIOL_GEO_AAO_FOUNDATION.md
git commit -m "docs: document GEO and AAO operations"
```

- [ ] **Step 5: Finish the branch**

Invoke `superpowers:verification-before-completion`, then `superpowers:finishing-a-development-branch`. Do not merge, push, deploy, or open a PR without the user's explicit choice.
