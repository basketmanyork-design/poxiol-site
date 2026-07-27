# POXIOL P2-P5 Production CMS Design

## Baseline

Repository: `basketmanyork-design/poxiol-site`

Production baseline commit: `fc5402c9f95effae76d740da3d210456105a9eb0`

Phase 1 is complete and must not regress. The production site already has:

- canonical `https://www.poxiol.com/` redirects;
- `procurementStandards` singleton usage;
- MOQ `1 set`, sample `2-3 working days`, bulk `7-12 working days`, QC before shipment, and `±2 cm` tolerance;
- static contact fallbacks for Home, Contact, Get Quote, and Free Mockup;
- `mailto:` and `wa.me` without Cloudflare email obfuscation;
- homepage FAQ and FAQPage JSON-LD consistency;
- CMS source modes: `legacy`, `sanity`, and `sanity-preview`.

## Current Architecture

The frontend is a static Next.js export with TypeScript and Tailwind. CMS reads are server-only through `lib/sanity/client.ts`, mapped in `lib/sanity/content.ts`, and protected by legacy fallback types in `lib/cms/*`. The Sanity Studio is under `studio/`, with registered schemas in `studio/schemaTypes/index.ts`, custom desk structure in `studio/deskStructure.ts`, and CI in `.github/workflows/cms-pr-check.yml`.

Current registered content types include:

- singletons: `siteSettings`, `navigationSettings`, `footerSettings`, `procurementStandards`;
- documents: `sitePage`, `productCategory`, `product`, `caseStudy`, `faqCategory`, `faqItem`, `article`, `author`, `redirectRule`;
- objects: SEO, image-with-alt, portable text, page sections, CTA, FAQ/reference helpers, procurement override.

## Target Architecture

P2-P5 will ship as five independent production packages from latest `main`:

1. P5-A CMS content foundation.
2. P2 product taxonomy, products, and FAQ matching.
3. P3 trust evidence, cases, legal pages, and conversion.
4. P4 SEO/GEO knowledge center and internal links.
5. P5-B admin workflow, preview, publishing, and SOP closeout.

Each package uses its own branch, PR, CI, merge commit, Cloudflare production deployment, live acceptance, and progress update. No package may directly push to `main`, force push, rewrite URLs without redirects, expose secrets, or remove Phase 1 behavior.

## Content Model

The existing schema set is extended rather than duplicated.

### Global settings

`siteSettings`, `navigationSettings`, `footerSettings`, and `procurementStandards` remain singletons. All email, WhatsApp, logo, footer, Alibaba, and global SEO values resolve from these singletons with legacy fallback.

### Pages

`sitePage` remains the authoritative model for homepage and core pages. It supports stable page keys, H1, hero, content sections, CTA, related content, SEO, publish status, `noindex`, and last review metadata. Page sections remain modular and ordered, using the existing `pageSection` object and extensions for hero, intro, rich text, statistics, product grid, feature grid, process, specification table, comparison table, buyer checklist, factory evidence, QC process, case studies, FAQ, and CTA.

### Products and categories

`productCategory` controls category pages, navigation visibility, homepage visibility, sort order, procurement references, related FAQs, related cases, related guides, SEO, and active/publish status.

`product` controls product detail pages with images, alt text, descriptions, fabric/composition/GSM, printing, customization areas, size range, procurement overrides, packaging, OEM/private-label flags, related content, structured data, featured status, order, and publish status.

### FAQ

`faqItem` remains reusable. A single FAQ can be referenced by many products, categories, pages, and articles. Duplicate FAQ copies are disallowed by migration checks and matching tests.

### Case studies

`caseStudy` distinguishes `Real Project`, `Anonymized Real Project`, and `Example Project Scenario`. Evidence-limited cases must not present invented client names, testimonials, order quantities, certifications, or legal claims.

### Articles

The existing `article` document is the canonical knowledge model. It must distinguish blog, guide, resource, and SEO article use cases by `articleType` and route. Cross-type slug conflicts are blocked by tests.

### Redirects

`redirectRule` remains build-time only. `scripts/generate-cms-redirects.mjs` appends validated Sanity redirect rules to `out/_redirects` without modifying tracked `public/_redirects`.

## Data Flow

Production mode:

1. `NEXT_PUBLIC_CONTENT_SOURCE` omitted or `sanity`.
2. Published Sanity perspective only.
3. No frontend token.
4. CDN reads are allowed.
5. Only documents visible for production are rendered.
6. Sanity failure falls back to legacy without old procurement values.

Preview mode:

1. `NEXT_PUBLIC_CONTENT_SOURCE=sanity-preview`.
2. `SANITY_READ_TOKEN` is server-only.
3. Draft perspective and `no-store`.
4. Draft and published content can render; unpublished remains hidden.
5. Token never appears in browser bundles, logs, PR bodies, or docs.

Legacy mode:

1. `NEXT_PUBLIC_CONTENT_SOURCE=legacy`.
2. No Sanity fetch.
3. Existing visual parity and public URLs are preserved.

## Migration Strategy

Migration remains deterministic and non-destructive:

- dry-run first;
- backup outside the repository before writes;
- import/update Drafts only after explicit package approval;
- never delete unknown Sanity documents;
- never publish automatically during migration;
- use `legacyKey`, `legacySource`, and `legacyRoute` for matching;
- use real Sanity IDs only after read/create resolution;
- classify existing drafts as reuse, update, create, duplicate, obsolete MVP, corrupted, or manual review.

## SEO, GEO, and Structured Data

Every public route must have stable title, description, canonical, OG data, H1, internal links, sitemap inclusion status, and JSON-LD only when matching visible content exists. FAQPage JSON-LD must always use the same resolved FAQ data visible on the page. Article, Product, Service, Organization, WebSite, BreadcrumbList, ItemList, and CreativeWork schemas are emitted only when their visible content exists.

`llms.txt` must match the current site positioning, procurement standards, product scope, key guides, and contact paths.

## Compliance Rules

The site must not use unauthorized brand, league, tournament, or partnership claims including Nike, Adidas, Jordan, Puma, Under Armour, New Balance, NBA, WNBA, NCAA, FIBA, Olympic, AAU, official partner, official supplier, licensed manufacturer, or authorized league supplier.

The standing IP statement remains:

> Buyers must own or be authorized to use all submitted team names, logos, sponsor marks and artwork. POXIOL does not reproduce unauthorized league, club or third-party trademarks.

Evidence-limited content uses neutral language, hidden fields, `Not publicly disclosed`, `Example Project Scenario`, or `Reviewed by POXIOL Production Team` rather than invented facts.

## Error Handling

- Sanity query failure never returns a blank page or 500 when legacy fallback exists.
- Empty Sanity result and Sanity network/API failure remain distinguishable.
- Strict list mode treats a successful empty CMS list as authoritative empty.
- Merge list mode preserves legacy routes during migration while allowing published CMS override and unpublished CMS suppression.
- Redirect generation warns and preserves base redirects when Sanity redirect reads fail.

## Testing and Deployment

Each package must run:

- `npm ci`
- `npx tsc --noEmit`
- `npm run build`
- CMS visibility tests
- merge/strict fallback tests
- article route conflict tests
- redirect tests
- migration dry run checks when migration logic changes
- safety scans for secrets, mutation verbs, old procurement values, and email obfuscation
- Studio `npm ci --legacy-peer-deps`
- Studio TypeScript or `tsconfig.check.json`
- `npx sanity schema validate --level error`
- Studio build

After merge, Cloudflare production deployment must be for `main` and the merge commit. Live acceptance checks normal and cache-busting requests, key pages, mailto, WhatsApp, old parameters, FAQ/JSON-LD consistency, sitemap, robots, and domain redirects.

## Rollback

Each package is isolated. Rollback is by reverting the package merge commit, not by force pushing or deleting data. Sanity content changes require an external backup and Draft-only strategy before any approved apply step. Cloudflare rollback uses prior production deployment only when source rollback cannot deploy quickly.

