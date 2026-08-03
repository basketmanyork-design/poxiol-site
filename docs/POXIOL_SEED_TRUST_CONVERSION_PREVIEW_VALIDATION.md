# POXIOL Seed–Trust–Conversion Preview Validation

Date: 2026-08-01

## Payload identity

- Branch: `preview/poxiol-seed-trust-conversion-20260801`
- Production baseline: `55f490a0e782dfce44a85ca9c3fa83588fdcc026`
- Delivery boundary: local branch and five existing Sanity Drafts only
- Published writes: `0`
- Sanity Releases: `0`
- Remote pushes: `0`
- Pull requests: `0`

## Preview method

The repository already supports a server-only Draft data path:

```powershell
$env:NEXT_PUBLIC_CONTENT_SOURCE='sanity-preview'
# SANITY_READ_TOKEN must be preconfigured server-side outside Git and logs.
npm run dev -- --port 3000
```

- Draft perspective: `drafts`
- Preview CDN: disabled
- Token source: server-only `SANITY_READ_TOKEN`
- Production path: published perspective with the existing static export and cache behavior
- Exit Preview: stop the local server and remove `NEXT_PUBLIC_CONTENT_SOURCE` from the local process

The current process, user environment and machine environment do not contain `SANITY_READ_TOKEN`. Therefore a real Draft-resolved browser Preview was **not** fabricated or reported as passed. Draft values were validated read-only through the authenticated Sanity connector, and rendering/fallback behavior was validated against a local legacy static export.

## Draft validation

| Draft | Final revision | Validation |
| --- | --- | --- |
| `drafts.691b156d8e3f49bd` | `qcaTVTRXzt1TXDF4uscNRk` | Homepage hero, sample-first CTA, multi-team planning, QC and Real Sample Evidence |
| `drafts.23e722da0b66490c` | `x4IhIh6n4J6As9mI7VDbh3` | Logo → Design Preview → Sample flow |
| `drafts.82ca7167e20342ac` | `x4IhIh6n4J6As9mI7VDee6` | Fabric, print, size, logo, roster and packing checks |
| `drafts.product-category-basketball-mvp` | `x4IhIh6n4J6As9mI7VDn35` | Buyer journey plus four product and four FAQ references |
| `drafts.faq-58b766260485677a` | `x4IhIh6n4J6As9mI7VDrfO` | Neutral sublimation-process answer without equipment brands |

All five corresponding Published revisions were re-read after the Draft changes and remain unchanged. Active or scheduled Sanity Releases: `0`.

## Browser smoke test

Actual headless Chrome testing was completed on the safe local static fallback at desktop `1440 × 1000` and mobile `390 × 844`.

| Route | Desktop | Mobile | H1 | Runtime errors | Overflow | Broken images | Empty modules |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | PASS | PASS | 1 | 0 | No | 0 | 0 |
| `/products/basketball-uniforms/` | PASS | PASS | 1 | 0 | No | 0 | 0 |
| `/customization/` | PASS | PASS | 1 | 0 | No | 0 | 0 |
| `/quality-control-process/` | PASS | PASS | 1 | 0 | No | 0 | 0 |
| `/projects/` | PASS | PASS | 1 | 0 | No | 0 | 0 |

Homepage smoke checks also found one `mailto:` link, three WhatsApp links and three existing public file inputs. The inquiry integrity test confirms Formspree attachment handling, UTM preservation, status handling and analytics hooks remain present.

## Safety and metadata validation

- Unsupported exact claims in safe source/static Preview: `0` matches for `3,000+ Teams Served`, `KIAN ink`, `EPSON print heads`, `15-25 Days` and `15–25 Days`.
- Homepage visible FAQ and `FAQPage` use the same resolver result.
- Existing metadata, canonical architecture, Organization/WebSite/Product/FAQ/Breadcrumb components and routes were not replaced.
- `sitemap.xml`, `robots.txt` and `llms.txt` are present in the export.
- GA4, Cloudflare Analytics and UTM implementation were unchanged; analytics contract tests pass.
- Browser bundle occurrences of `SANITY_READ_TOKEN`: `0`.
- Binary changes: `0`.
- UTF-8/BOM/mojibake scan findings: `0`.

## Verification results

- Source contract tests: PASS
- Public inquiry integrity: PASS
- Analytics core/integration: PASS
- CMS safety scan: PASS
- TypeScript: PASS
- ESLint: PASS with existing `no-img-element` warnings only
- Default published Sanity static build: PASS
- Legacy safe static build: PASS (`115` generated routes; `113` HTML files)
- Generated Preview HTML contracts: PASS
- Studio TypeScript: PASS
- Sanity Schema validation: PASS (`0` errors)
- Studio build: PASS
- `git diff --check`: PASS
- Final clean-install repeat: stopped after excessive Windows execution time; an earlier clean install succeeded and every dependency-backed check above completed successfully afterward.

## Missing buyer-approved assets

1. Buyer-approved physical basketball sample photography with confirmed usage rights.
2. Buyer-approved multi-team roster or packing photography without third-party marks.
3. Verified images and clean titles for five existing case-study records that do not have CMS imagery.
4. Written evidence before any future customer count, order volume, named equipment, certification or performance-result claim.

The Preview displays a verification-pending placeholder where project imagery is absent and does not invent a customer, quantity, result or branded proof.

## Acceptance state

- Code payload: READY FOR LOCAL REVIEW
- Draft data: READ-ONLY VERIFIED
- Draft-resolved browser Preview: BLOCKED — server-only `SANITY_READ_TOKEN` is not configured in the local environment
- Production: UNCHANGED
- Publish approval: NOT REQUESTED / NOT PERFORMED
