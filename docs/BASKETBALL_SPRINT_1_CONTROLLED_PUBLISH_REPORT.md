# Basketball Product Deep Optimization Sprint 1 Controlled Publish Plan

## Release boundary

This is a plan only. No document is published by this commit or report.

- Publish mode: manual, controlled, revision-guarded
- Documents in scope: 5
- URL changes: 0
- Canonical changes: 0
- Deletes: 0
- Seed / Dataset Import: prohibited
- Asset uploads: 0
- Production Cloudflare changes: 0

## Revision-guarded documents

| Publish order | Role | Draft ID | Expected Draft revision | Public ID | Current Published revision |
| --- | --- | --- | --- | --- | --- |
| 1 | Full team sets | `drafts.061bfa7135304966` | `z7UkfLUBQqOTgWEGeS9URg` | `061bfa7135304966` | `kqd32DnwMDSkqBnWPz90Sd` |
| 2 | Basketball jerseys | `drafts.a116b52b29234e52` | `z7UkfLUBQqOTgWEGeS9UEE` | `a116b52b29234e52` | `kqd32DnwMDSkqBnWPyf2fu` |
| 3 | Basketball shorts | `drafts.6b8199fa3c644add` | `z7UkfLUBQqOTgWEGeS9UIi` | `6b8199fa3c644add` | `kqd32DnwMDSkqBnWPyezTl` |
| 4 | Reversible jerseys | `drafts.34811e3aade14fff` | `LeWgMGX3K1V7TqsV7NG4Da` | `34811e3aade14fff` | `eJ7skWqptDvdh6OpbTFOtl` |
| 5 | Basketball category | `drafts.product-category-basketball-mvp` | `cy0PIHNgypUOR28qMFm16E` | `product-category-basketball-mvp` | `C90lXvqhCRFE4tCBds9HeQ` |

Before any future publish operation, both the Draft and Published revisions must still equal the values above. Any mismatch stops the release and requires a new read-only review.

## Fields changed

### Basketball category

Draft-only changes cover:

- Hero title, description, image alt fallback, proof points, and two CTAs
- Buyer types and target markets
- Basketball solution formats
- Customization and specification guidance
- Sample, production, and QC process
- Quote checklist
- `procurementStandards` singleton reference
- Existing Product, FAQ, Case Study, and Guide references
- Bottom CTA
- SEO description, canonical confirmation, display order, and visibility configuration

### Four Product documents

Draft-only changes cover distinct:

- Buyer-oriented short and full descriptions
- Benefits
- Fabric options
- Customization options
- Existing FAQ references
- Display order

No Product slug, URL, category reference, asset, or Published document was changed during Draft preparation.

## Publish order and validation gates

1. Re-read the 5 Drafts and 5 Published documents.
2. Verify every expected revision exactly.
3. Re-run risk, URL, canonical, reference, SEO, and structured-data checks.
4. Publish the four Product Drafts one at a time in the order above.
5. Re-query each public Product anonymously after publication.
6. Publish the Basketball category last.
7. Rebuild the static Production site from the approved main commit after the code PR is merged.
8. Validate the live route, sitemap, JSON-LD, FAQ equality, contact CTAs, GA4, and responsive layout.

Publishing the category last prevents its public page from pointing to Product content that has not yet been published.

## Rollback method

- Preserve the existing external Sanity backup.
- Preserve the current Published revisions listed above.
- If validation fails after controlled publication, restore only the affected public document from the verified pre-Sprint backup or Sanity document history.
- Rebuild the static site and repeat Production validation.
- Do not delete Draft or Published documents during rollback.

## Approval state

- Draft Preview: PASS
- Required CI: PASS at pre-report commit
- Controlled publish preparation: COMPLETE
- Automatic publish: NOT AUTHORIZED
- Production content changed by this plan: NO

A separate explicit approval is required before executing any publish operation.
