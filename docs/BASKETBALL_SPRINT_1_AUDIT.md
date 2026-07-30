# Basketball Product Deep Optimization Sprint 1 Audit

## Safety gate

- Project: `oqpv1xbc`
- Dataset: `production`
- Backup path: `C:\Users\baske\poxiol-private-backups\production-before-basketball-sprint1-20260730-150900.tar.gz`
- Backup size: `18,334,250 bytes`
- Backup SHA-256: `A3F78D3779790F72D1FA6F621D108A5C4007129DF8FE8B9396DF2A9DA40AD3F4`
- Backup verified: **YES**
- Export coverage: 281 documents and 19 assets
- Published mutations performed during audit: **0**
- Draft mutations performed during audit: **0**

The backup is outside the Git repository and must not be committed.

## Target document inventory

| Role | Public ID | Published revision | Existing Draft revision | Current status |
| --- | --- | --- | --- | --- |
| Basketball category | `product-category-basketball-mvp` | `C90lXvqhCRFE4tCBds9HeQ` | `eJ7skWqptDvdh6OpbT3BqJ` | Published with a shallow existing Draft |
| Full team sets | `061bfa7135304966` | `kqd32DnwMDSkqBnWPz90Sd` | `eJ7skWqptDvdh6OpbTcoab` | Published with an existing Draft |
| Reversible jerseys | `34811e3aade14fff` | `eJ7skWqptDvdh6OpbTFOtl` | `eJ7skWqptDvdh6OpbT3CG9` | Published with an existing Draft |
| Basketball shorts | `6b8199fa3c644add` | `kqd32DnwMDSkqBnWPyezTl` | `kqd32DnwMDSkqBnWPyOkiG` | Published with an existing Draft |
| Basketball jerseys | `a116b52b29234e52` | `kqd32DnwMDSkqBnWPyf2fu` | `eJ7skWqptDvdh6OpbT3CVw` | Published with an existing Draft |

All later mutations must target the `drafts.` version of these IDs and use the exact current Draft revision as an optimistic-lock guard.

## Current content state

The category keeps the approved slug `basketball-uniforms` and its existing hero asset, but has no buyer types, target markets, product types, key features, decision sections, CTA controls, or related FAQ/Case/Guide references. The public page therefore relies heavily on `lib/sports-pages.ts`.

The four published products use stable product slugs, but currently share generic descriptions and option lists, use the same display order, and do not have dedicated detail, production, QC, or packaging galleries. This sprint may improve their Draft copy and ordering, but it must not invent assets or manufacturing claims.

## Approved reusable references

- Procurement singleton: `procurementStandards`
- Basketball buying guide: `ac118ecd57c74a80`
- FAQ: `faq-5c385d15e15eaf8e`, `faq-a2dc8dceb5f6bc7b`, `faq-95c2f6a0a59a0ff9`
- Case: `case-study-case-001`, `case-study-case-003`

The two Case Study titles contain known encoding damage in the dataset. Their relationships may be reused, but buyer-facing rendering must use clean fallback labels until those Drafts are separately approved for correction.

## Procurement source of truth

The only standard procurement source is:

```groq
*[_id == "procurementStandards"][0]
```

Audited standards:

- Sample MOQ: 1 set
- Sample production: 2–3 working days after mockup approval
- Bulk production: 7–12 working days after sample or artwork approval
- Quality control: inspection before shipment
- Size tolerance: ±2 cm
- Mixed adult and youth sizes: supported

Product-level procurement overrides are not approved for these four Drafts.

## Frontend audit

- Route: `/products/basketball-uniforms/`
- Canonical: `https://www.poxiol.com/products/basketball-uniforms/`
- Route component: `app/products/basketball-uniforms/page.tsx`
- Current resolver: `getCmsSportsPageBySlug`
- Current view: `components/sports/SportsLandingPage.tsx`
- Static export: retained
- Header, Footer, GA4, and brand styling: out of scope and unchanged

The existing view already provides the approved visual skeleton. The implementation will add optional CMS-controlled data to that skeleton rather than replace it.

## Risk controls

- Reject `15–25 Days`, `10–14 Days`, `30,000+ units monthly`, `KIAN`, and `EPSON`.
- Do not add unsupported production, certification, capacity, customer-count, or equipment claims.
- Do not create duplicate FAQ, Product, Case, Guide, or procurement documents.
- Do not change the URL or canonical.
- Do not Publish, delete, upload assets, Seed, or Dataset Import.
