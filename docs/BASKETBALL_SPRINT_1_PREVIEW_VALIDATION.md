# Basketball Product Deep Optimization Sprint 1 Preview Validation

## Preview method

- Environment: Cloudflare Pages Preview
- Content source: authenticated `sanity-preview`
- Perspective: Drafts
- Preview URL: `https://fa6f72c8.poxiol-site.pages.dev/products/basketball-uniforms/`
- Functional code commit: `b7585d0db5afbf4e8bebfb46263033d654436359`
- Current branch commit at validation start: `fb10cf44b2e77cf4105dc384d4eb36216133c264`
- The later commit only normalizes text line endings and does not alter runtime behavior.
- HTTP status: **200**
- Preview indexing header: `x-robots-tag: noindex`

The Draft source is proven by Draft-only hero copy, proof points, buyer-decision modules, CTA configuration, Product descriptions, and relation-driven content that are absent from the corresponding Published documents.

## Pages tested

| Page | Result | Evidence |
| --- | --- | --- |
| Basketball category | PASS | Real Cloudflare Preview HTML and browser render |
| Preview sitemap | PASS | Route present; no Draft IDs or preview URLs |
| Production Basketball page | PASS / unchanged | HTTP 200; Published production content remains separate |

## Buyer-decision content

- Visible H1: `Custom Basketball Uniform Manufacturer for Clubs, Schools and Sportswear Brands`
- Canonical: `https://www.poxiol.com/products/basketball-uniforms/`
- Proof points:
  - Sample MOQ: 1 set
  - Sample: 2–3 working days
  - Bulk: 7–12 working days
  - QC: Inspection before shipment
- Decision modules:
  - Confirm Every Basketball Uniform Detail
  - From Requirements to Shipment
  - Information Needed for an Accurate Quote
- Product cards:
  - Basketball Jerseys
  - Basketball Shorts
  - Basketball Uniforms Full Team Sets
  - Reversible Jerseys
- Related cases:
  - USA Basketball Academy Uniform Program
  - School Athletics Multi-Sport Program
- Related guide:
  - Custom Basketball Uniform Buying Guide
- Related FAQs: 3

## SEO and structured data

| Check | Result |
| --- | --- |
| Title and meta description | PASS |
| Canonical preserved | PASS |
| BreadcrumbList | PASS |
| Product | PASS |
| Service | PASS |
| FAQPage | PASS |
| Visible FAQ / FAQPage equality | PASS — all 3 visible questions and answers match the FAQPage entities |
| Sitemap route | PASS |
| Draft leakage into sitemap | NONE |

## Risk and safety validation

The Preview contains none of:

- 15–25 Days
- 30,000+ units monthly
- KIAN ink
- EPSON print heads
- `SANITY_READ_TOKEN`
- Draft document IDs
- Mojibake replacement characters

Static contact paths are present:

- `mailto:`
- `wa.me/8613055646888`

## Browser render smoke test

Temporary screenshots were generated outside the repository and are not committed:

- Desktop: 1440 × 1000, non-blank render
- Mobile: 390 × 844, non-blank render

The rendered HTML contains one visible H1, populated product/decision/FAQ modules, working CTA links, and no empty data modules. No image or screenshot binary was added to Git.

## Analytics boundary

Cloudflare Preview analytics is fail-closed and does not introduce a second tracking implementation. A cache-busting read of the Production Basketball page confirmed:

- GA4 measurement ID: `G-W5YLNQ39X1`
- Google tag loader count: 1
- GTM containers: 0
- Email obfuscation payloads: 0

No GA4 code, ID, or Cloudflare configuration was changed in this Sprint.

## Result

- Draft Preview content: **PASS**
- SEO: **PASS**
- JSON-LD: **PASS**
- FAQ consistency: **PASS**
- Product relations: **PASS**
- Case relations: **PASS**
- Guide relation: **PASS**
- Production Sanity writes during Preview: **0**
- Publish operations: **0**

The Draft set is ready for an explicit controlled-publish approval. This report does not authorize or perform publication.
