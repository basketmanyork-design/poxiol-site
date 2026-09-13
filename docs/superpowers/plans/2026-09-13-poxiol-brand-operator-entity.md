# POXIOL Brand Operator Entity and Attribution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a truthful, consistent POXIOL Brand-to-Operator relationship while removing eight unverified personal-style author profiles and preserving the English-only site contract.

**Architecture:** `lib/geo-v1.ts` remains the runtime identity source and gains separate Brand and Operator records. Homepage and content schema consume those stable IDs, the About transform publishes one English operator statement, and PSEO pages use a constrained POXIOL organization attribution. `/brand.json` carries the confirmed Chinese legal name outside HTML, with source and rendered-output tests enforcing parity and preventing accidental manufacturer or Person claims.

**Tech Stack:** Next.js 15 App Router, React 18, TypeScript 5, Schema.org JSON-LD, Node.js 22 test runner, static export, Cloudflare Pages.

**Spec:** `docs/superpowers/specs/2026-09-13-poxiol-brand-operator-entity-design.md`

## Global Constraints

- Implementation baseline is commit `b0effed`, whose parent Production source is `66b4b0a5c25dd14526fbe1faf52ee58e22c94c41`.
- Runtime/test scope is exactly seven files: `lib/geo-v1.ts`, `components/seo/GEOStructuredData.tsx`, `lib/pseo.ts`, `app/[slug]/page.tsx`, `public/brand.json`, `scripts/check-geo-v1.test.mts`, and `scripts/check-geo-v1-output.mjs`.
- Public HTML and JSON-LD must contain only English text; the confirmed Chinese legal name `泉州篮人电子商务有限公司` may appear only in `/brand.json` and internal planning records.
- Exact visible statement: `POXIOL is a brand operated by Quanzhou Lanren Electronic Commerce Co., Ltd.`
- Exact official machine legal name: `QUANZHOU LANREN ELECTRONIC COMMERCE CO., LTD.`
- Exact attribution: `Published by POXIOL`.
- Exact affected CTA label: `Contact POXIOL`.
- Never publish an address, trademark registration/status, Basketman relationship, factory-ownership relationship, personal author, credentials, customer claim, pricing, capacity or delivery promise.
- Do not modify H1, metadata title, canonical URL, route, navigation, form behavior, analytics, CMS data, dependencies, `package.json` or Cloudflare configuration.
- Do not map the Operator to `Product.manufacturer`; remove that existing unverified relationship.
- Preserve all unrelated work. Stop if any of the seven target files differs from commit `b0effed` before its task begins.
- Use `apply_patch` for source edits. Do not use destructive Git commands.

## File Responsibility Map

| File | Responsibility |
| --- | --- |
| `lib/geo-v1.ts` | Canonical Brand and Operator values plus idempotent About transformation |
| `components/seo/GEOStructuredData.tsx` | Schema.org graph and entity-reference consumers |
| `lib/pseo.ts` | Eight-page organization-attribution marker; no personal profile data |
| `app/[slug]/page.tsx` | PSEO Article JSON-LD, visible attribution and scoped CTA label |
| `public/brand.json` | Public machine summary, including Chinese legal name outside HTML |
| `scripts/check-geo-v1.test.mts` | Fast source/runtime identity and attribution contract |
| `scripts/check-geo-v1-output.mjs` | Static-output verification across homepage, About, products and eight affected pages |

---

### Task 1: Canonical Brand, Operator and About Identity

**Files:**
- Modify: `scripts/check-geo-v1.test.mts`
- Modify: `lib/geo-v1.ts`

**Interfaces:**
- Consumes: existing `GEO_V1.canonicalBaseUrl` and `applyAboutGeoV1(page: CmsPage): CmsPage`.
- Produces: `GEO_V1.brand`, `GEO_V1.operator`, `GEO_V1.about.operatorSection`, and an idempotent About section titled `Brand Operator`.

- [ ] **Step 1: Add failing identity and About tests**

Replace the old `GEO_V1.organization` assertions in `scripts/check-geo-v1.test.mts` with these exact contracts:

```ts
assert.deepEqual(GEO_V1.brand, {
  id: 'https://www.poxiol.com/#brand',
  name: 'POXIOL',
  url: 'https://www.poxiol.com/',
})
assert.deepEqual(GEO_V1.operator, {
  id: 'https://www.poxiol.com/#operator',
  name: 'Quanzhou Lanren Electronic Commerce Co., Ltd.',
  legalName: 'QUANZHOU LANREN ELECTRONIC COMMERCE CO., LTD.',
  url: 'https://www.poxiol.com/',
})
assert.deepEqual(GEO_V1.about.operatorSection, {
  eyebrow: 'Brand Identity',
  title: 'Brand Operator',
  body: 'POXIOL is a brand operated by Quanzhou Lanren Electronic Commerce Co., Ltd.',
})
```

Update the About assertions so the first call expects `Brand Operator`, `Manufacturing Process`, then the existing section. Reapply `applyAboutGeoV1` to its own result and assert each governed section occurs once:

```ts
assert.deepEqual(
  about.sections.slice(0, 3).map((section) => section.title),
  ['Brand Operator', 'Manufacturing Process', 'Existing section'],
)
const reappliedAbout = applyAboutGeoV1(about)
assert.equal(reappliedAbout.sections.filter((section) => section.title === 'Brand Operator').length, 1)
assert.equal(reappliedAbout.sections.filter((section) => section.title === 'Manufacturing Process').length, 1)
```

- [ ] **Step 2: Run the focused test and confirm the expected failure**

Run:

```powershell
npm run check:geo-v1
```

Expected: FAIL because `GEO_V1.brand`, `GEO_V1.operator` and `GEO_V1.about.operatorSection` do not exist and the About section order is still process-first.

- [ ] **Step 3: Implement the identity source and idempotent section insertion**

In `lib/geo-v1.ts`, replace `organization` with:

```ts
brand: {
  id: 'https://www.poxiol.com/#brand',
  name: 'POXIOL',
  url: 'https://www.poxiol.com/',
},
operator: {
  id: 'https://www.poxiol.com/#operator',
  name: 'Quanzhou Lanren Electronic Commerce Co., Ltd.',
  legalName: 'QUANZHOU LANREN ELECTRONIC COMMERCE CO., LTD.',
  url: 'https://www.poxiol.com/',
},
```

Add this exact child of `about` before the existing manufacturing-process values:

```ts
operatorSection: {
  eyebrow: 'Brand Identity',
  title: 'Brand Operator',
  body: 'POXIOL is a brand operated by Quanzhou Lanren Electronic Commerce Co., Ltd.',
},
```

Update `applyAboutGeoV1` with separate duplicate guards and deterministic ordering:

```ts
const operatorTitle = normalizeText(GEO_V1.about.operatorSection.title)
const processTitle = normalizeText(GEO_V1.about.processTitle)
const hasOperator = page.sections.some((section) => normalizeText(section.title) === operatorTitle)
const hasProcess = page.sections.some((section) => normalizeText(section.title) === processTitle)
const operatorSection: CmsPageSection = {
  type: 'richText',
  ...GEO_V1.about.operatorSection,
}
const processSection: CmsPageSection = {
  type: 'processSteps',
  eyebrow: 'How We Work',
  title: GEO_V1.about.processTitle,
  body: 'A clear custom production workflow from approved design details through shipment preparation.',
  steps: GEO_V1.about.processSteps.map((step) => ({...step})),
}
const governedSections = [
  ...(hasOperator ? [] : [operatorSection]),
  ...(hasProcess ? [] : [processSection]),
]
```

Return `sections: [...governedSections, ...page.sections]` while preserving the existing heading, description, SEO fields and remaining functions.

- [ ] **Step 4: Run the focused test and confirm it passes**

Run:

```powershell
npm run check:geo-v1
```

Expected: PASS with `POXIOL GEO V1 runtime checks passed`.

- [ ] **Step 5: Commit Task 1**

```powershell
git add -- lib/geo-v1.ts scripts/check-geo-v1.test.mts
git diff --cached --check
git commit -m "feat: define POXIOL brand operator identity"
```

---

### Task 2: Structured Entity Graph Without a Manufacturer Claim

**Files:**
- Modify: `scripts/check-geo-v1.test.mts`
- Modify: `components/seo/GEOStructuredData.tsx`

**Interfaces:**
- Consumes: `GEO_V1.brand.id`, `GEO_V1.brand.name`, `GEO_V1.brand.url`, `GEO_V1.operator.id`, `GEO_V1.operator.name`, `GEO_V1.operator.legalName`, and `GEO_V1.operator.url` from Task 1.
- Produces: Brand and Operator nodes plus consistent Website, Product, Service, Article and CreativeWork references.

- [ ] **Step 1: Add failing schema-source contracts**

Add `readFileSync` and `path` imports to `scripts/check-geo-v1.test.mts`, then read the component source:

```ts
const structuredDataSource = readFileSync(
  path.join(process.cwd(), 'components', 'seo', 'GEOStructuredData.tsx'),
  'utf8',
)
assert.match(structuredDataSource, /"@type": "Brand"/)
assert.match(structuredDataSource, /"@id": GEO_V1\.brand\.id/)
assert.match(structuredDataSource, /"@id": GEO_V1\.operator\.id/)
assert.match(structuredDataSource, /"legalName": GEO_V1\.operator\.legalName/)
assert.match(structuredDataSource, /"brand": \{ "@id": GEO_V1\.brand\.id \}/)
assert.doesNotMatch(structuredDataSource, /"manufacturer"/)
assert.doesNotMatch(structuredDataSource, /GEO_V1\.organization/)
```

- [ ] **Step 2: Run the focused test and confirm the expected failure**

Run:

```powershell
npm run check:geo-v1
```

Expected: FAIL because the component still emits one POXIOL Organization, still references `GEO_V1.organization`, and still contains Product `manufacturer`.

- [ ] **Step 3: Replace the homepage entity graph**

In `OrganizationSchema`, emit these nodes in this order:

```ts
{
  "@type": "Brand",
  "@id": GEO_V1.brand.id,
  "name": GEO_V1.brand.name,
  "url": GEO_V1.brand.url,
},
{
  "@type": "Organization",
  "@id": GEO_V1.operator.id,
  "name": GEO_V1.operator.name,
  "legalName": GEO_V1.operator.legalName,
  "url": GEO_V1.operator.url,
  "brand": { "@id": GEO_V1.brand.id },
},
{
  "@type": "WebSite",
  "@id": `${baseUrl}/#website`,
  "url": `${baseUrl}/`,
  "name": "POXIOL Custom Teamwear Manufacturer",
  "publisher": { "@id": GEO_V1.operator.id },
  "about": { "@id": GEO_V1.brand.id },
},
```

Do not emit a Chinese `alternateName` in this graph.

- [ ] **Step 4: Update every schema consumer and remove Product manufacturer**

Make these exact reference changes in the same file:

```ts
"brand": { "@id": GEO_V1.brand.id }
"provider": { "@id": GEO_V1.operator.id }
"author": { "@id": GEO_V1.operator.id }
"publisher": { "@id": GEO_V1.operator.id }
```

Delete the entire Product `manufacturer` property. Apply `provider` to Service and CaseStudy, and `author`/`publisher` to Article. Preserve unrelated fields.

- [ ] **Step 5: Run the focused test and confirm it passes**

Run:

```powershell
npm run check:geo-v1
```

Expected: PASS and no reference to `GEO_V1.organization` or a Product `manufacturer` property remains in the component.

- [ ] **Step 6: Commit Task 2**

```powershell
git add -- components/seo/GEOStructuredData.tsx scripts/check-geo-v1.test.mts
git diff --cached --check
git commit -m "fix: separate POXIOL brand and operator schema"
```

---

### Task 3: Replace Personal PSEO Authors With POXIOL Attribution

**Files:**
- Modify: `scripts/check-geo-v1.test.mts`
- Modify: `lib/pseo.ts`
- Modify: `app/[slug]/page.tsx`

**Interfaces:**
- Consumes: `GEO_V1.operator.id` from Task 1.
- Produces: `POXIOL_PUBLISHER` with literal type `POXIOL`, `PSEOPage.publisher?: typeof POXIOL_PUBLISHER`, exactly eight attributed pages, and no personal author presentation.

- [ ] **Step 1: Add failing attribution tests**

Import `POXIOL_PUBLISHER` and `pseoPages` from `../lib/pseo.ts`. Add:

```ts
assert.equal(POXIOL_PUBLISHER, 'POXIOL')
const attributedPages = pseoPages.filter((page) => page.publisher === POXIOL_PUBLISHER)
assert.equal(attributedPages.length, 8)
assert.deepEqual(
  attributedPages.map((page) => page.slug),
  [
    'how-to-order-custom-basketball-uniforms',
    'soccer-jersey-buying-guide',
    'oem-vs-odm-sportswear',
    'best-sportswear-fabrics',
    'how-sublimation-printing-works-for-teamwear',
    'how-to-choose-a-teamwear-manufacturer',
    'custom-soccer-uniforms-for-academies',
    'soccer-jersey-supplier-australia',
  ],
)
const publicPseoData = JSON.stringify(pseoPages)
for (const name of ['David Zhang', 'Sarah Miller', 'Michael Chen']) {
  assert.doesNotMatch(publicPseoData, new RegExp(name))
}
```

Read `app/[slug]/page.tsx` and assert the new contract:

```ts
const pseoTemplateSource = readFileSync(path.join(process.cwd(), 'app', '[slug]', 'page.tsx'), 'utf8')
assert.match(pseoTemplateSource, /page\.publisher/)
assert.match(pseoTemplateSource, /Published by POXIOL/)
assert.match(pseoTemplateSource, /GEO_V1\.operator\.id/)
assert.match(pseoTemplateSource, /page\.publisher \? "Contact POXIOL" : "Contact Our Experts"/)
assert.doesNotMatch(pseoTemplateSource, /"@type": "Person"/)
assert.doesNotMatch(pseoTemplateSource, /page\.author/)
```

- [ ] **Step 2: Run the focused test and confirm the expected failure**

Run:

```powershell
npm run check:geo-v1
```

Expected: FAIL because publisher fields do not exist and the personal author data and Person schema remain.

- [ ] **Step 3: Replace the PSEO author data model**

In `lib/pseo.ts`, define:

```ts
export const POXIOL_PUBLISHER = 'POXIOL' as const

export type PSEOPage = {
  slug: string
  title: string
  h1: string
  intro: string
  content: string
  publisher?: typeof POXIOL_PUBLISHER
  faqs: {question: string; answer: string}[]
}
```

Replace each of the eight complete personal `author` objects with:

```ts
publisher: POXIOL_PUBLISHER,
```

Do not alter any other page data.

- [ ] **Step 4: Replace the template schema and visible card**

Import `GEO_V1` and key Article output from `page.publisher`:

```ts
const articleSchema = page.publisher ? {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": page.title,
  "description": page.intro,
  "author": {"@id": GEO_V1.operator.id},
  "publisher": {"@id": GEO_V1.operator.id},
} : null
```

Replace the personal card with:

```tsx
{page.publisher ? (
  <div className="rounded-2xl border border-lime-400/20 bg-lime-400/5 px-6 py-4">
    <p className="text-sm font-black uppercase tracking-widest text-lime-400">Published by POXIOL</p>
  </div>
) : null}
```

Change the existing button content only for the eight marked pages:

```tsx
<PrimaryButton>{page.publisher ? "Contact POXIOL" : "Contact Our Experts"}</PrimaryButton>
```

- [ ] **Step 5: Run the focused test and confirm it passes**

Run:

```powershell
npm run check:geo-v1
```

Expected: PASS; exactly eight pages are attributed to POXIOL and the three removed names are absent from runtime PSEO data.

- [ ] **Step 6: Commit Task 3**

```powershell
git add -- lib/pseo.ts 'app/[slug]/page.tsx' scripts/check-geo-v1.test.mts
git diff --cached --check
git commit -m "fix: replace unverified PSEO author profiles"
```

---

### Task 4: Machine Summary and Rendered-Output Contract

**Files:**
- Modify: `scripts/check-geo-v1.test.mts`
- Modify: `public/brand.json`
- Modify: `scripts/check-geo-v1-output.mjs`

**Interfaces:**
- Consumes: canonical entity IDs, exact English statement and eight attributed slugs from Tasks 1–3.
- Produces: canonical `/brand.json` fields and a complete static-output gate covering identity, English-only HTML and attribution.

- [ ] **Step 1: Add failing `brand.json` source assertions**

Add:

```ts
const brandSummary = JSON.parse(readFileSync(path.join(process.cwd(), 'public', 'brand.json'), 'utf8'))
assert.equal(brandSummary.brand, 'POXIOL')
assert.equal(brandSummary.brandId, GEO_V1.brand.id)
assert.equal(brandSummary.operatorId, GEO_V1.operator.id)
assert.deepEqual(brandSummary.operator, {
  name: 'Quanzhou Lanren Electronic Commerce Co., Ltd.',
  legalName: 'QUANZHOU LANREN ELECTRONIC COMMERCE CO., LTD.',
  alternateName: '泉州篮人电子商务有限公司',
  relationship: 'POXIOL is a brand operated by Quanzhou Lanren Electronic Commerce Co., Ltd.',
})
const summaryUrls = JSON.stringify(brandSummary).match(/https:\/\/[^"\\]+/g) || []
assert.ok(summaryUrls.length > 0)
assert.ok(summaryUrls.every((url) => new URL(url).host === 'www.poxiol.com'))
```

- [ ] **Step 2: Run the focused test and confirm the expected failure**

Run:

```powershell
npm run check:geo-v1
```

Expected: FAIL because `brandId`, `operatorId` and `operator` do not exist and several URLs use the apex host.

- [ ] **Step 3: Update `public/brand.json` without changing existing content meaning**

Keep the existing `brand`, category, description, services, products, buyers and advantages. Insert these exact fields after `brand`:

```json
"brandId": "https://www.poxiol.com/#brand",
"operatorId": "https://www.poxiol.com/#operator",
"operator": {
  "name": "Quanzhou Lanren Electronic Commerce Co., Ltd.",
  "legalName": "QUANZHOU LANREN ELECTRONIC COMMERCE CO., LTD.",
  "alternateName": "泉州篮人电子商务有限公司",
  "relationship": "POXIOL is a brand operated by Quanzhou Lanren Electronic Commerce Co., Ltd."
},
```

Normalize every URL in `website` and `importantPages` to `https://www.poxiol.com/...`, retaining the existing paths and trailing slashes.

- [ ] **Step 4: Run the focused test and confirm it passes**

Run:

```powershell
npm run check:geo-v1
```

Expected: PASS and `/brand.json` contains the Chinese legal name while TypeScript/TSX runtime files do not.

- [ ] **Step 5: Expand rendered-output fixtures and assertions**

In `scripts/check-geo-v1-output.mjs`, add all eight static files:

```js
const attributedSlugs = [
  'how-to-order-custom-basketball-uniforms',
  'soccer-jersey-buying-guide',
  'oem-vs-odm-sportswear',
  'best-sportswear-fabrics',
  'how-sublimation-printing-works-for-teamwear',
  'how-to-choose-a-teamwear-manufacturer',
  'custom-soccer-uniforms-for-academies',
  'soccer-jersey-supplier-australia',
]
const attributedPages = Object.fromEntries(
  attributedSlugs.map((slug) => [slug, read(`out/${slug}/index.html`)]),
)
```

Update homepage JSON-LD assertions to require one Brand and one Operator:

```js
const brands = homeNodes.filter((node) => node?.['@type'] === 'Brand')
const organizations = homeNodes.filter((node) => node?.['@type'] === 'Organization')
assert.equal(brands.length, 1)
assert.equal(brands[0]['@id'], 'https://www.poxiol.com/#brand')
assert.equal(brands[0].name, 'POXIOL')
assert.equal(organizations.length, 1)
assert.equal(organizations[0]['@id'], 'https://www.poxiol.com/#operator')
assert.equal(organizations[0].legalName, 'QUANZHOU LANREN ELECTRONIC COMMERCE CO., LTD.')
assert.equal(organizations[0].brand?.['@id'], 'https://www.poxiol.com/#brand')
assert.equal(websites[0].publisher?.['@id'], 'https://www.poxiol.com/#operator')
assert.equal(websites[0].about?.['@id'], 'https://www.poxiol.com/#brand')
```

Add exact About, attribution and safety assertions:

```js
const operatorStatement = 'POXIOL is a brand operated by Quanzhou Lanren Electronic Commerce Co., Ltd.'
assert.equal(aboutText.split(operatorStatement).length - 1, 1)
for (const [slug, html] of Object.entries(attributedPages)) {
  const text = visibleText(html)
  assert.ok(text.includes('Published by POXIOL'), `${slug} is missing POXIOL attribution`)
  assert.ok(text.includes('Contact POXIOL'), `${slug} is missing the scoped CTA`)
  for (const name of ['David Zhang', 'Sarah Miller', 'Michael Chen']) {
    assert.ok(!html.includes(name), `${slug} still contains ${name}`)
  }
  const people = jsonLdNodes(html).filter((node) => node?.['@type'] === 'Person')
  assert.equal(people.length, 0, `${slug} must not emit Person schema`)
  const articles = jsonLdNodes(html).filter((node) => node?.['@type'] === 'Article')
  assert.equal(articles.length, 1, `${slug} must retain one Article schema`)
  assert.equal(articles[0].author?.['@id'], 'https://www.poxiol.com/#operator')
  assert.equal(articles[0].publisher?.['@id'], 'https://www.poxiol.com/#operator')
}
for (const html of [pages.home, pages.about, pages.basketball, ...Object.values(attributedPages)]) {
  assert.doesNotMatch(html, /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/u)
}
const productNodes = jsonLdNodes(pages.basketball).filter((node) => node?.['@type'] === 'Product')
assert.ok(productNodes.every((node) => node.manufacturer === undefined))
```

Parse `public/brand.json` in the output test and assert its three identity fields match the runtime contract, including the Chinese `alternateName`.

- [ ] **Step 6: Commit Task 4 source changes**

```powershell
git add -- public/brand.json scripts/check-geo-v1.test.mts scripts/check-geo-v1-output.mjs
git diff --cached --check
git commit -m "test: lock POXIOL entity output contract"
```

The output test is expected to fail until the fresh static build in Task 5 replaces baseline `out/`.

---

### Task 5: Full Gate, Production Release and Live Verification

**Files:**
- Verify only: all seven implementation/test files and generated ignored output
- Do not modify: runtime source, CMS, analytics, Cloudflare configuration or dependency manifests

**Interfaces:**
- Consumes: the four task commits and existing release/build scripts.
- Produces: verified static output, fast-forward `main`, a Cloudflare Production deployment, live smoke-test evidence and a rollback target captured before release.

- [ ] **Step 1: Verify scope and branch state before the full gate**

Run:

```powershell
git status --short --branch
git diff b0effed..HEAD --name-only
git diff b0effed..HEAD --check
```

Expected changed runtime/test files, excluding planning documents:

```text
app/[slug]/page.tsx
components/seo/GEOStructuredData.tsx
lib/geo-v1.ts
lib/pseo.ts
public/brand.json
scripts/check-geo-v1-output.mjs
scripts/check-geo-v1.test.mts
```

Stop if any other runtime, configuration or dependency file appears.

- [ ] **Step 2: Run the focused source test**

```powershell
npm run check:geo-v1
```

Expected: PASS.

- [ ] **Step 3: Run the complete source regression suite**

```powershell
npm test
```

Expected: exit code 0 with no failed or skipped required gate.

- [ ] **Step 4: Run TypeScript without writing incremental state**

```powershell
.\node_modules\.bin\tsc.cmd --noEmit --incremental false
```

Expected: exit code 0 and no TypeScript error.

- [ ] **Step 5: Create a Production-equivalent static build**

Set only the approved local loopback review variables for this process:

```powershell
$env:POXIOL_INTEGRATION_REVIEW='local'
$env:POXIOL_INTEGRATION_ORIGIN='http://127.0.0.1:4466'
npm run build
```

Expected: exit code 0, 139 generated pages unless the existing deterministic route system reports a new approved count, and no English-only output failure.

If Next.js changes `next-env.d.ts`, compare it to `b0effed` and restore only that generated difference with `apply_patch`; do not use `git checkout`, `git restore` or reset.

- [ ] **Step 6: Run rendered GEO and release gates**

```powershell
npm run check:geo-v1:output
npm run check:canonical
npm run check:route-release
npm run check:construction-release
npm run check:release-indexing-gates
npm run check:buyer-facing:output
```

Expected: all commands exit 0. The English-only gate must pass without an exception, sitemap remains 79 unique canonical URLs, and the eight pages satisfy the new attribution assertions.

- [ ] **Step 7: Verify the inquiry path without submitting data**

Run:

```powershell
$quoteHtml = Get-Content -Raw -LiteralPath 'out\get-quote\index.html' -Encoding UTF8
if ($quoteHtml -notmatch '<form' -or $quoteHtml -notmatch 'formspree') { throw 'GET_QUOTE_FORM_MISSING' }
```

Expected: no output and exit code 0. Do not submit the form.

- [ ] **Step 8: Record the current Production rollback target read-only**

In the authenticated Cloudflare Pages project `poxiol-site`, read the active Production row immediately before push. Record all four values in the execution notes:

Record `project`, `deploymentId`, `sourceCommit` and `releaseMarker` as four labeled values copied from the live Production row. The project must be `poxiol-site`; the expected pre-release source is `66b4b0a5c25dd14526fbe1faf52ee58e22c94c41` and the expected marker is `poxiol_725ea10d5e149d619`. The deployment ID must be a fresh UUID copied from Cloudflare; do not reuse an older ID from project documentation.

- [ ] **Step 9: Fast-forward Production source**

Confirm `origin/main` still equals `66b4b0a5c25dd14526fbe1faf52ee58e22c94c41`, then run:

```powershell
git fetch origin main
git rev-parse origin/main
git push origin HEAD:main
```

Expected: the fetched SHA matches the approved baseline and the push is a fast-forward. If it differs, stop and perform a difference review; do not force push or rebase automatically.

- [ ] **Step 10: Wait for the linked Cloudflare Production deployment**

Use the Cloudflare Pages deployment view to identify the `poxiol-site` Production deployment whose source is the pushed HEAD. Require `Success` before live verification. A failed or canceled deployment is not Production success even if the previous site remains healthy.

- [ ] **Step 11: Verify live pages and machine files**

Issue read-only GET requests to:

```text
https://www.poxiol.com/
https://www.poxiol.com/about/
https://www.poxiol.com/how-to-order-custom-basketball-uniforms/
https://www.poxiol.com/soccer-jersey-buying-guide/
https://www.poxiol.com/oem-vs-odm-sportswear/
https://www.poxiol.com/best-sportswear-fabrics/
https://www.poxiol.com/how-sublimation-printing-works-for-teamwear/
https://www.poxiol.com/how-to-choose-a-teamwear-manufacturer/
https://www.poxiol.com/custom-soccer-uniforms-for-academies/
https://www.poxiol.com/soccer-jersey-supplier-australia/
https://www.poxiol.com/products/basketball-uniforms/
https://www.poxiol.com/products/soccer-jerseys/
https://www.poxiol.com/custom-baseball-softball-uniforms/
https://www.poxiol.com/get-quote/
https://www.poxiol.com/brand.json
https://www.poxiol.com/sitemap.xml
https://www.poxiol.com/robots.txt
```

Require HTTP 200 for every URL. Parse live HTML/JSON and verify:

```text
About English operator statement count = 1
Brand @id count on homepage = 1
Operator @id count on homepage = 1
David Zhang count = 0
Sarah Miller count = 0
Michael Chen count = 0
Person schema count on eight affected pages = 0
Published by POXIOL count on each affected page >= 1
Operator used as Product manufacturer count = 0
brand.json alternateName = 泉州篮人电子商务有限公司
sitemap unique URL count = 79
get-quote form present = true
```

- [ ] **Step 12: Roll back only if the new Production deployment fails live verification**

Restore the exact deployment ID recorded in Step 8 using Cloudflare's Rollback action, then verify the previous release marker and critical URLs `/`, `/about/`, `/get-quote/`, `/sitemap.xml` and `/robots.txt`. Do not change DNS or Cloudflare project configuration. Source rollback, if needed, is a separate scoped revert commit; never reset or force push.

- [ ] **Step 13: Record final evidence**

Report the implementation commit SHAs, pushed Production SHA, new Cloudflare Deployment ID, release marker, test results, live URL status, rollback ID and any non-blocking warnings. Confirm explicitly that CMS, GA4, form submission, address, trademark status, Basketman relationship and factory ownership were untouched.

## Plan Completion Criteria

- All four code/data tasks have their own passing focused test and scoped commit.
- The final diff contains only the approved specification/plan and seven runtime/test files.
- Full source, TypeScript, static build, output, canonical, route, sitemap, construction, buyer-facing and inquiry gates pass.
- Production is either verified on the new SHA or restored to the recorded prior deployment.
- Live HTML contains the English operator statement and no CJK or personal author identity.
- `/brand.json` contains the confirmed Chinese legal name and canonical `www` URLs.
- No unapproved business or manufacturing relationship is introduced.
