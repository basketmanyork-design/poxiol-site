# POXIOL Controlled Publish Plan

Status: **PREVIEW PASSED; CODE INTEGRATION REQUIRED BEFORE PUBLISH**

This plan records the exact, reversible publication order for the reviewed
Draft content. It does not authorize publication before the code gate.

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
- Accepted immutable Preview:
  `https://00f11f97.poxiol-site.pages.dev`
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

## Passed gates

- Five article routes render from authenticated Draft data.
- Required procurement values are correct.
- Risk terms are absent from the accepted Preview scope.
- Visible FAQ and FAQPage JSON-LD match.
- Title, Meta Description, Canonical, Breadcrumb and Article JSON-LD pass.
- The archived MVP Soccer category is absent from Products, homepage,
  navigation, sitemap and JSON-LD.
- Preview browser output contains no server token.
- Production GA4 remains unchanged.

## Remaining gate

Before any publish:

1. review and merge the static Preview, Portable Text, author schema and
   category visibility code into `main`;
2. wait for required checks;
3. deploy that approved Production commit;
4. re-read every target Draft revision and abort on a mismatch.

## Publish order and verification

1. Publish the manufacturing safety correction.
2. Publish the two team author documents.
3. Publish the three existing URL upgrades one at a time.
4. Publish the two new guides one at a time.
5. Trigger the approved Production build.
6. Verify each public route, sitemap, JSON-LD, GA4 and contact links.

No bulk publish, document deletion, asset upload, Seed or Dataset Import is
allowed.
