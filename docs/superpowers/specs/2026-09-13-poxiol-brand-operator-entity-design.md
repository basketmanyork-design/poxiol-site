# POXIOL Brand Operator Entity and Attribution Design

## Status

- Design path: Architectural
- Selected approach: Option A — truth-first entity pilot
- Design confirmed by owner: 2026-09-13
- Written specification review: approved by owner on 2026-09-13
- English-only compatibility difference: approved by owner on 2026-09-13
- Production baseline: `66b4b0a5c25dd14526fbe1faf52ee58e22c94c41`

## Objective

Improve POXIOL's machine-readable brand identity and buyer-visible trust signals without inventing people or broadening unverified company claims. The pilot will:

1. identify POXIOL as a Brand;
2. identify Quanzhou Lanren Electronic Commerce Co., Ltd. as the brand operator;
3. publish the owner-approved operator relationship on the About page and in machine-readable data;
4. remove the eight current personal-style author profiles and Person schema references; and
5. preserve existing URLs, page titles, page headings, article bodies, navigation and conversion paths.

This work improves entity consistency. It does not guarantee immediate inclusion or recommendation by ChatGPT, Gemini, Perplexity or another answer engine.

## Confirmed Business Fact

The owner explicitly authorized public use of this exact relationship:

> POXIOL is a brand operated by Quanzhou Lanren Electronic Commerce Co., Ltd.

The owner confirmed the Chinese legal name:

> 泉州篮人电子商务有限公司

The English company name follows the official USPTO record supplied and independently checked during design:

> QUANZHOU LANREN ELECTRONIC COMMERCE CO., LTD.

Public English prose may use title case, while machine-readable `legalName` will preserve the official uppercase spelling.

## Safety Boundaries

- Do not claim that POXIOL currently owns an active or valid United States trademark registration.
- Do not publish the address visible in the supplied documents.
- Do not publish or infer a relationship with Basketman.
- Do not claim that the legal operator owns a factory or is the product manufacturer.
- Do not introduce personal names, portraits, initials, biographies, job titles, credentials or Person schema.
- Do not invent a replacement expert or reviewer.
- Do not modify product claims, production capacity, delivery promises, pricing, MOQ, certifications or customer stories.
- Do not modify H1, metadata title, canonical URL, route, navigation, form, analytics, CMS data or third-party configuration.
- Do not copy the supplied document photographs into the repository or public site.

## Entity Model

Use separate identifiers so that a brand relationship cannot silently become a manufacturing claim.

### Brand

```json
{
  "@type": "Brand",
  "@id": "https://www.poxiol.com/#brand",
  "name": "POXIOL",
  "url": "https://www.poxiol.com/"
}
```

### Operator

```json
{
  "@type": "Organization",
  "@id": "https://www.poxiol.com/#operator",
  "name": "Quanzhou Lanren Electronic Commerce Co., Ltd.",
  "legalName": "QUANZHOU LANREN ELECTRONIC COMMERCE CO., LTD.",
  "url": "https://www.poxiol.com/",
  "brand": {"@id": "https://www.poxiol.com/#brand"}
}
```

### Website and content relationships

- `WebSite.publisher` points to `#operator`.
- `WebSite.about` points to `#brand`.
- `Product.brand` points to `#brand`.
- The existing unverified `Product.manufacturer` relationship is removed; it must not be redirected to `#operator`.
- `Service.provider`, `Article.author`, `Article.publisher` and `CreativeWork.provider` may point to `#operator` because they describe the operator's website and published content, not ownership of production facilities.
- No `sameAs` trademark link, registration number or trademark status is added.
- Public HTML and JSON-LD remain English-only. The confirmed Chinese legal name is exposed only in `/brand.json`, which is not HTML and remains machine-readable.

## Buyer-Visible Copy

The About page receives one non-duplicating identity section before the manufacturing-process section.

- Eyebrow: `Brand Identity`
- Heading: `Brand Operator`
- Body:

> POXIOL is a brand operated by Quanzhou Lanren Electronic Commerce Co., Ltd.

Pages that currently show a personal expert card will instead show a compact organization attribution:

> Published by POXIOL

The CTA label on those pages changes from `Contact Our Experts` to:

> Contact POXIOL

No other visible article copy changes.

## Attribution Scope

The following eight current personal-style attribution blocks are replaced by POXIOL organization attribution:

1. `/how-to-order-custom-basketball-uniforms/`
2. `/soccer-jersey-buying-guide/`
3. `/oem-vs-odm-sportswear/`
4. `/best-sportswear-fabrics/`
5. `/how-sublimation-printing-works-for-teamwear/`
6. `/how-to-choose-a-teamwear-manufacturer/`
7. `/custom-soccer-uniforms-for-academies/`
8. `/soccer-jersey-supplier-australia/`

The source must contain no runtime references to David Zhang, Sarah Miller or Michael Chen after implementation. Existing historical documentation is not rewritten.

## Components and Exact File Scope

Only these nine implementation/test files may change under this specification:

### `lib/geo-v1.ts`

- Replace the single ambiguous organization constant with explicit `brand` and `operator` constants.
- Store the exact approved English operator names used in public HTML and JSON-LD.
- Store the exact About-page operator statement.
- Extend `applyAboutGeoV1` to prepend the identity section exactly once, using normalized title matching to prevent duplication when CMS or fallback data already contains it.
- Preserve the existing About heading, description and manufacturing-process behavior.

### `components/seo/GEOStructuredData.tsx`

- Emit one Brand node and one Operator Organization node in the homepage graph.
- Update Website, Product, Service, Article and CreativeWork references according to the entity model above.
- Remove Product `manufacturer` rather than mapping it to the operator.
- Preserve all unrelated schema fields and canonical URLs.

### `lib/pseo.ts`

- Replace the personal `author` model with a constrained POXIOL organization-publisher marker.
- Replace all eight personal data blocks with that shared POXIOL marker.
- Preserve every slug, title, H1, introduction, body and FAQ unchanged.

### `app/[slug]/page.tsx`

- Replace Person author schema with an Operator Organization reference.
- Preserve Article schema only for the same eight attributed pages; do not add Article schema to the other PSEO pages.
- Replace the personal expert card with `Published by POXIOL`.
- Change only the affected CTA label from `Contact Our Experts` to `Contact POXIOL`.
- Preserve FAQ schema, internal links, page structure and routes.

### `public/brand.json`

- Preserve the current top-level `brand` string for compatibility.
- Add an `operator` object containing official English legal name, confirmed Chinese legal name and the approved relationship sentence.
- Add stable `brandId` and `operatorId` values matching the JSON-LD identifiers.
- Normalize all POXIOL URLs in this file to the canonical `https://www.poxiol.com/` host form.
- Do not add the supplied address, trademark status, trademark number, people or unverified relationships.

### `scripts/check-geo-v1.test.mts`

- Lock the Brand and Operator constants, identifiers and approved text.
- Assert About identity-section idempotency.
- Assert the operator is not represented as Product manufacturer.
- Assert the PSEO source has eight POXIOL publisher markers and none of the three removed names.

### `lib/v8/brand.ts`

- Consume the canonical Brand display name and Operator identifier from `GEO_V1`.
- Preserve the existing `organizationId` interface name as a compatibility boundary while pointing it to `#operator`.
- Derive the entity description from the approved homepage entity paragraph; do not reintroduce an ambiguous organization constant.

### `scripts/check-v8-architecture.test.mts`

- Lock the V8 compatibility identifier to `https://www.poxiol.com/#operator` and the Brand display name to `POXIOL`.

### `components/seo/GEOStructuredData.tsx`

- Perform the minimal forward-compatible migration of existing `GEO_V1.organization` consumers to the canonical Operator values and approved homepage entity paragraph.
- Leave the complete Brand/Operator graph and Product manufacturer cleanup to the later schema task.

### `scripts/check-geo-v1-output.mjs`

- Validate the rendered homepage Brand/Operator graph and confirm it contains no CJK ideographs.
- Validate the exact About operator sentence appears once.
- Validate all eight affected pages contain `Published by POXIOL`, contain no removed name or personal biography, contain no Person schema and retain their canonical URL.
- Validate the Article author/publisher references point to `#operator` on only those eight pages.
- Validate no Product schema uses `#operator` as `manufacturer`.
- Validate `public/brand.json` parses and matches the canonical entity IDs and legal names.
- Preserve the existing English-only rendered-HTML gate without exceptions.

No `package.json` change is required. The existing GEO test commands will be used directly.

## Data Flow

1. `lib/geo-v1.ts` is the runtime source of truth for entity identifiers, names and approved visible copy.
2. The homepage schema reads those constants and publishes the Brand, Operator and Website graph.
3. The About transform reads the approved English statement and inserts it once, regardless of whether the page came from CMS or legacy fallback.
4. PSEO data identifies only the eight pages that carry organization attribution.
5. The root-slug template renders the buyer-visible attribution and Article relationships.
6. `public/brand.json` remains a static machine-readable summary; regression tests enforce parity with the runtime source of truth.

## Failure Behavior

- Entity IDs, English names or approved English text differing between runtime schema and `brand.json` fail tests.
- A duplicate About operator section fails tests.
- Any occurrence of the three removed personal names in public runtime sources or rendered output fails tests.
- Any Person schema on the eight affected pages fails tests.
- Any `manufacturer` link to the operator fails tests.
- Any CJK ideograph in rendered HTML, including JSON-LD, continues to fail the existing English-only output gate.
- Build, canonical, sitemap, route-release, form or buyer-visible regression failure blocks commit/push/deployment.
- If live output differs from the approved candidate, deployment is treated as failed and rolled back.

## Verification Plan

### Test-first behavior

Before implementation, add regression assertions and confirm that they fail against baseline for the expected reasons: missing Brand/Operator separation, missing About statement and existing personal attributions.

After implementation, run:

1. `npm run check:geo-v1`
2. a Production-equivalent static build using the repository's approved loopback review variables;
3. `npm run check:geo-v1:output`
4. the complete `npm test`
5. TypeScript with incremental output disabled;
6. `git diff --check`;
7. canonical, sitemap, route-release, construction-release and release-indexing gates; and
8. inquiry-path regression for `/get-quote/` without submitting real data.

### Rendered pages

Validate at minimum:

- `/`
- `/about/`
- all eight attribution-scope URLs
- `/products/basketball-uniforms/`
- `/products/soccer-jerseys/`
- `/custom-baseball-softball-uniforms/`
- `/get-quote/`
- `/sitemap.xml`
- `/robots.txt`
- `/brand.json`

### Production verification

After an approved implementation passes every local gate:

- verify the deployed release marker and Git SHA;
- verify every listed URL returns the expected status;
- parse live homepage, About, eight affected pages and `brand.json`;
- confirm the three names and Person schema are absent;
- confirm the approved English operator statement and Brand/Operator identifiers are present;
- confirm the Chinese legal name appears in `/brand.json` but not rendered HTML or JSON-LD;
- confirm no operator-as-manufacturer assertion exists; and
- confirm the inquiry form remains available without submitting it.

## SEO, GEO and CRO Impact

### Expected benefit

- Gives crawlers and answer engines a consistent Brand-to-Operator relationship.
- Removes fabricated-looking personal expertise signals that can weaken trust.
- Aligns buyer-visible copy with structured and static machine-readable data.
- Preserves existing search URLs and commercial content.

### Limits

- This is an owned-site entity foundation, not third-party corroboration.
- It may improve entity interpretation but cannot by itself create ChatGPT recommendations.
- External citations, independent mentions and evidence-backed buyer content remain later phases.

### Risks

- Schema consumers may temporarily reprocess the changed entity graph.
- Removing personal profiles reduces the appearance of named E-E-A-T, but the existing names are unverified and therefore present a larger trust risk if retained.
- The Chinese legal name is limited to the public machine-readable `/brand.json`; buyer-visible HTML and JSON-LD remain English-only under the existing hard gate.

## Git, Deployment and Rollback

- Work only from the clean linked worktree based on baseline `66b4b0a5c25dd14526fbe1faf52ee58e22c94c41`.
- Preserve unrelated files and stop if the baseline, target files or branch state drift before implementation.
- Commit only the nine approved implementation/test files plus the approved planning documents.
- Before Production deployment, record the then-current active Cloudflare Production Deployment ID and release marker.
- If Production verification fails, restore that recorded deployment and verify the previous marker and critical URLs.
- A source rollback may revert only the scoped implementation commit; destructive reset is forbidden.

## Approval Semantics

Owner review of this written specification is the final design gate. After written-spec approval, the next step is a detailed implementation plan. Production execution remains bound to this exact scope, copy and entity model. Any new public claim, new URL, new page, additional runtime file, address disclosure, trademark claim, Basketman relationship, factory-ownership claim, CMS mutation or analytics/configuration change invalidates the approval and requires a difference review.
