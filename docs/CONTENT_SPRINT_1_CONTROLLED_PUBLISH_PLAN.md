# POXIOL Controlled Publish Plan

Status: **PENDING PREVIEW REVALIDATION AND CODE INTEGRATION**

This plan records the exact, reversible publication order for the reviewed
Draft content. It does not authorize publication by itself.

## Safety baseline

- Sanity project: `oqpv1xbc`
- Dataset: `production`
- External backup:
  `C:\Users\baske\poxiol-private-backups\poxiol-production-documents-before-knowledge-batch-1-20260730-003427.ndjson`
- Backup size: `576526` bytes
- Backup SHA-256:
  `253d07c9bb3303cdce0c0022c0adb30362365130d3b3d45ff4e713b9dcaa68a2`
- Revision Guard and mutation dry-run: completed for the original Batch 1
  document set.
- Published documents changed so far: `0`

## Document plan

| Order | Draft ID | Fields changed | Before | After | Reason | Rollback |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `drafts.67d89e7018894286` | Manufacturing Portable Text in `contentSections` | Current public wording included `15-25 Days` and `30,000+ units` | Approved 2-3 / 7-12 working-day wording and a neutral scalable-production statement | Remove obsolete procurement timing and an unverified capacity claim | Restore the backed-up document version and republish only after revision review |
| 2 | `drafts.author.poxiol-production-team` | Team identity | No published author document | POXIOL Production Team organization identity | Resolve non-fictional author/reviewer references | Unpublish the author only after dependent articles are reverted |
| 3 | `drafts.author.poxiol-quality-control-team` | Team identity | No published author document | POXIOL Quality Control Team organization identity | Resolve non-fictional QC reviewer references | Unpublish the author only after dependent articles are reverted |
| 4 | `drafts.ac118ecd57c74a80` | Title, body, FAQ, related content, CTA, SEO and review metadata | Existing basketball guide | Custom Basketball Uniform Buying Guide, preserving URL and Canonical | Upgrade basketball-specific buying intent without URL churn | Restore the backed-up article version and republish |
| 5 | `drafts.96636fb2fea64bad` | Title, body, FAQ, related content, CTA, SEO and review metadata | Existing soccer article | Custom Soccer Jersey Buying Guide, preserving URL and Canonical | Upgrade soccer-specific buying intent without URL churn | Restore the backed-up article version and republish |
| 6 | `drafts.9f01531eac5844f8` | Title, body, FAQ, related content, CTA, SEO and review metadata | Existing MOQ resource | Custom Teamwear MOQ and Production Time Guide, preserving URL and Canonical | Upgrade production-timeline intent without URL churn | Restore the backed-up article version and republish |
| 7 | `drafts.article.custom-teamwear-manufacturer-buying-guide` | New article document | No published document | Manufacturer selection guide | Add a broad supplier-evaluation asset without duplicating product-specific intent | Unpublish the new article; no existing URL is replaced |
| 8 | `drafts.article.teamwear-quality-control-checklist` | New article document | No published document | Teamwear quality-control checklist | Add a quality-assurance asset without unsupported claims | Unpublish the new article; no existing URL is replaced |

## Required gates

1. The immutable Cloudflare Pages Preview must render all five article routes.
2. The Preview must contain no `15-25 Days`, `30,000+ units`, `KIAN ink` or
   `EPSON print heads` on the validated scope.
3. Visible FAQ content and `FAQPage` JSON-LD must match.
4. Title, Meta Description, Canonical, Breadcrumb and Article JSON-LD must
   pass for each article.
5. The MVP Soccer category must be absent from Products, homepage
   recommendations, sitemap and JSON-LD.
6. The static Preview implementation and Portable Text renderer must be
   reviewed, checked and integrated into `main` before publication.
7. Production must remain static export using the Published perspective.

## Publish order and verification

1. Re-read every target revision and abort on any revision mismatch.
2. Publish the manufacturing safety correction.
3. Publish the two team author documents.
4. Publish the three existing URL upgrades one at a time.
5. Publish the two new guides one at a time.
6. Trigger the approved Production build only after the corresponding code is
   present in `main`.
7. Verify routes, sitemap, JSON-LD, GA4 and contact links after every stage.

No bulk publish, document deletion, asset upload, Seed or Dataset Import is
allowed.
