# POXIOL Dual-Dimension Product System Design

Date: 2026-08-29

Status: Owner-selected architecture A; implementation requires final written-spec approval

Environment: local construction worktree only; no Preview, production deployment, Sanity write, DNS, analytics or form-endpoint change

## 1. Objective

Add a buyer-facing product discovery system organized by two dimensions:

1. Sport category.
2. Wearing scenario.

The system must help a first-time international buyer find a relevant starting point quickly, while supporting POXIOL's Full Teamwear expansion logic and protecting the site from unsupported product, certification, delivery or production claims.

## 2. Approved scope

### 2.1 Sport categories

The public taxonomy contains twelve distinct sport categories:

1. Soccer
2. Basketball
3. Track & Field
4. Badminton
5. Volleyball
6. Baseball & Softball
7. Ice Hockey
8. American Football
9. Rugby
10. Tennis
11. Cricket
12. Golf

American Football and Rugby remain separate categories in labels, inquiry context, URLs and future SEO planning.

### 2.2 Wearing scenarios

The public taxonomy contains three wearing scenarios:

1. Match Day
2. Warm-Up & Training
3. Off-Field & Travel

These scenarios describe the buyer's use context. They do not create a guarantee that every product combination is available. Final product construction, material, quantity, sample plan and timing remain subject to project review.

### 2.3 Out of scope for this implementation

- Creating 36 sport-by-scenario landing pages.
- Publishing new customer cases, testimonials, factory evidence or certification claims.
- Publishing catalog images that contain third-party brands, athletes, clubs, national teams, leagues or sponsor marks.
- Replacing existing canonical URLs for Basketball, Soccer or Baseball.
- Production deployment, Cloudflare Preview creation, Sanity production writes or analytics activation.

## 3. Architecture decision

Use one code-owned, typed product taxonomy as the source of truth for discovery. The product hub and homepage consume this source directly. Existing CMS product categories continue to supply approved deep product content, but CMS availability must not remove an owner-approved sport from the discovery taxonomy.

This separates two concerns:

- **Discovery taxonomy:** twelve sports and three scenarios, always present in the local construction build.
- **Deep content maturity:** a sport can link to a mature category page or remain a project-review entry until approved content and media are available.

No claim may be inferred from discovery presence alone.

## 4. Data model

Create `lib/product-taxonomy.ts` with these public types:

```ts
type SportContentStage = 'deep-page' | 'project-review'

type SportCategory = {
  id: string
  label: string
  shortLabel: string
  description: string
  contentStage: SportContentStage
  href: string
  inquiryProduct: string
  image?: {
    src: string
    alt: string
    status: 'approved-poxiol' | 'internal-review'
  }
}

type WearingScenario = {
  id: 'match-day' | 'warm-up-training' | 'off-field-travel'
  label: string
  description: string
  productGroups: readonly string[]
  inquiryProduct: string
}
```

The module exports:

- `SPORT_CATEGORIES`, in the approved owner order.
- `WEARING_SCENARIOS`, in the approved owner order.
- `getSportCategory(id)`.
- `getScenario(id)`.
- `productDiscoveryInquiryHref({sport, scenario, source})`.

`productDiscoveryInquiryHref` uses the existing safe inquiry query contract. The selected combination is encoded as a human-readable `product` value such as `Soccer - Warm-Up & Training`, with the selected sport in the existing `sport` parameter and a first-party source path. No arbitrary user data is added to URLs.

## 5. Content maturity and link behavior

### 5.1 Mature deep pages retained

- Basketball → `/products/basketball-uniforms/`
- Soccer → `/products/soccer-jerseys/`
- Baseball & Softball → `/custom-baseball-softball-uniforms/`

### 5.2 Project-review entries

Track & Field, Badminton, Volleyball, Ice Hockey, American Football, Rugby, Tennis, Cricket and Golf appear in discovery with restrained category descriptions and a CTA such as `Discuss This Sport Program`.

Their CTA opens the existing quote flow with sport and source context. These entries must not expose unverified technical specifications, minimum quantities, production times or visual evidence.

Existing legacy routes may remain redirects during this phase. Creating new canonical sport pages requires a later content-and-evidence approval.

## 6. Product hub experience

Update `/products/` into the primary dual-dimension discovery hub.

### 6.1 First viewport

Keep the established black POXIOL visual system, English-only copy and current header. Replace the narrow five-category promise with a clear explanation that buyers can start by sport or wearing scenario.

Primary in-page actions:

- `Browse by Sport` → `#sports`
- `Browse by Wearing Scenario` → `#scenarios`

### 6.2 Browse by sport

Render all twelve sports in a responsive, accessible grid or rail. Each entry contains:

- sport label;
- one restrained use-oriented sentence;
- content-stage-aware CTA;
- approved POXIOL image only when available;
- a code-native typographic or geometric background when no approved public image exists.

Cards must not use broken-image boxes, generic stock placeholders or third-party catalog imagery. An internal-review AI image must not move into `public/` until it passes the existing asset allowlist and brand review.

### 6.3 Browse by wearing scenario

Render three large scenario panels rather than 36 repeated cards:

- **Match Day:** competition uniforms and coordinated match components, confirmed per sport and project.
- **Warm-Up & Training:** training tops, warm-up layers, tracksuits and practice apparel, confirmed per project.
- **Off-Field & Travel:** hoodies, jackets, polos, travel sets and team accessories, confirmed per project.

Each scenario panel offers the twelve sports as compact selection links. A selected sport-scenario combination continues to the contextual quote flow.

### 6.4 Evidence language

Every scenario section includes one shared qualification line:

`Product construction, material, quantity and timing are confirmed after the project brief is reviewed.`

This qualification is visible, not hidden in a tooltip.

## 7. Homepage integration

Add a compact dual-entry product discovery section to the current hybrid homepage after the audience section and before buyer-risk controls.

The section contains:

- a concise heading: `Find the Right Teamwear Starting Point`;
- two paths: `Shop by Sport` and `Shop by Wearing Scenario`;
- all twelve sport labels as text links;
- the three scenario labels as larger visual links;
- one `View the Full Product System` link to `/products/`.

The homepage does not repeat the entire product hub and does not add new unsupported product claims. The existing end-of-page range section is updated to use the same taxonomy source instead of maintaining a separate three-link list.

## 8. Header navigation

Keep the header compact. Do not add twelve sport links to the dropdown.

The Products menu becomes:

- All Products
- Browse by Sport
- Browse by Wearing Scenario
- Basketball Uniforms
- Soccer Kits

The two discovery links use stable `/products/` anchors and retain the two strongest mature category entry points. Individual scenario links remain inside the product hub instead of expanding the header. Mobile and desktop menus use the same source.

## 9. Inquiry path

The product hub uses the existing first-party contextual inquiry system.

For a sport-scenario combination:

1. Buyer selects a sport.
2. Buyer selects or enters a scenario path.
3. CTA opens `/get-quote/` with a safe product reference, sport and source.
4. The current quote form displays the product reference for buyer review and editing.
5. Form submission includes the existing requested-product, source-sport and origin-page fields.

No automatic order, price, production commitment or new external transmission is introduced.

`PROJECT_SPORT_OPTIONS` is expanded to the twelve distinct sports plus `Multi-Sport Teamwear` and `Other`. `American Football` and `Rugby` remain separate. `Track & Field` replaces the ambiguous combined `Running / Training Wear` sport value; Training remains a scenario, not a sport.

## 10. SEO, GEO and indexing

- Update `/products/` title and description to reflect multi-sport custom Teamwear and the three wearing scenarios.
- Use one H1 on `/products/`.
- Use semantic H2 headings for sport and scenario discovery.
- Update Products FAQ copy to list the twelve sport categories without claiming identical specifications across them.
- Collection structured data may reference the product hub anchors and approved mature pages, but must not present project-review entries as standalone Product pages.
- Do not add project-review entries to the sitemap as new URLs.
- Preserve Basketball, Soccer and Baseball canonical ownership.
- Keep all visible copy English-only.

## 11. CMS and release governance

- No Sanity production writes are part of this change.
- The code-owned taxonomy is owner-approved business structure.
- CMS product categories remain content records, not the discovery source of truth.
- A later CMS schema update may mirror the taxonomy only after preview validation and separate approval.
- No generated or catalog image is published unless present in the public asset allowlist and cleared for POXIOL-only branding.
- Publication remains PREVIEW-READY / PRODUCTION NO-GO until existing owner gates are satisfied.

## 12. Accessibility and responsive behavior

- All discovery actions are links or buttons with descriptive accessible names.
- Keyboard focus remains visible.
- Anchor targets include scroll margin for the fixed header.
- Desktop target: 1440 and 1280 widths.
- Mobile target: 390, 375 and 360 widths.
- No horizontal overflow.
- Sport labels must not be truncated.
- Scenario panels stack into a single readable column on narrow screens.
- The contextual inquiry CTA remains reachable without hover.
- Reduced-motion preferences are respected.

## 13. Error and fallback behavior

- A missing approved image uses a code-native typographic or geometric background, never a broken image, generic stock placeholder or third-party image.
- An unknown sport/scenario id fails closed to `/products/` or an uncontextualized `/get-quote/` link.
- If CMS category resolution fails, the twelve discovery entries remain visible; only CMS-owned deep content falls back under existing policy.
- If JavaScript is unavailable, all sport and scenario links remain ordinary usable links.

## 14. Implementation boundaries

Expected new files:

- `lib/product-taxonomy.ts`
- `components/products/ProductDiscovery.tsx`
- `scripts/check-product-taxonomy.test.mts`
- `scripts/check-product-taxonomy-output.mjs`

Expected modified files:

- `app/products/page.tsx`
- `components/hybrid/HomepageHybrid.tsx`
- `components/hybrid/HomepageHybrid.module.css`
- `lib/hybrid/home.ts`
- `lib/navigation.ts`
- `lib/v8/leads.ts`
- `lib/inquiry-context.ts`
- `lib/products-page.ts`
- `package.json`

Other files may be touched only when a failing focused test proves they are required. Existing unrelated mobile-inquiry and form changes in the worktree must be preserved.

## 15. Test-first implementation plan boundary

Implementation follows TDD after this specification is approved.

The first focused test must fail because the current site does not expose:

- exactly twelve approved sports in the owner-approved order;
- exactly three scenarios;
- distinct American Football and Rugby values;
- homepage and Products hub consumption of the shared taxonomy;
- safe contextual inquiry links;
- the expanded form sport options;
- compact navigation anchors;
- English-only rendered output.

After the RED result, implement the smallest shared taxonomy and UI required to pass. Then run:

- focused taxonomy source test;
- existing inquiry-context and form tests;
- navigation and mobile guards;
- TypeScript/Next build;
- final output test against `out/`;
- desktop and mobile Browser/IAB review;
- inquiry path click-through without submitting a real form;
- public-asset and third-party-logo guards.

## 16. Acceptance criteria

The change is ready for owner review when:

1. `/products/` visibly supports browsing by twelve sports and three scenarios.
2. Homepage visibly exposes both discovery dimensions without overcrowding the first viewport.
3. American Football and Rugby are separate everywhere.
4. All project-review categories use qualified language and contextual quote CTAs.
5. Basketball, Soccer and Baseball retain their canonical deep pages.
6. Header navigation remains compact on desktop and mobile.
7. Selected sport-scenario combinations reach the quote form with an editable product reference.
8. No third-party catalog image or unapproved generated image is public.
9. English-only, accessibility, mobile overflow, inquiry-context, build and output tests pass.
10. No Preview or production deployment occurs without a separate owner authorization.

## 17. Rollback

The feature remains isolated to the current construction branch. Before deployment, rollback is a targeted revert of the taxonomy, discovery component and listed consumer changes. Existing canonical sport pages, forms, CMS data and public evidence records are not deleted or migrated.
