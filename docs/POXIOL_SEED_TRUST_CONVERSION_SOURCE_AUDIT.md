# POXIOL Seed-Trust-Conversion Preview Source Audit

Date: 2026-08-01
Branch: `preview/poxiol-seed-trust-conversion-20260801`
Production baseline: `55f490a0e782dfce44a85ca9c3fa83588fdcc026`

## Safety boundary

- Five existing Sanity Drafts were updated with Revision Guards.
- Corresponding Published revisions were re-read after mutation and remain unchanged.
- No Sanity Release was created, no document was published and no asset was uploaded.
- The branch is local only. It has not been pushed and no pull request exists.
- Production static export, GA4, Cloudflare Analytics, UTM handling, URLs and canonical architecture are unchanged.

## Source map

| Content | Previous source | Preview source | Production impact |
| --- | --- | --- | --- |
| Homepage hero and proof badge | `app/page.tsx`, homepage CMS content and legacy fallback | Homepage Draft plus safe code fallback | None |
| Homepage trust journey | Homepage `contentSections` | `CmsHomeContent.trustSections` rendered server-side | None |
| Customization flow | Customization sitePage | Existing Customization Draft `contentSections` | None |
| Quality-control checks | QC sitePage | Existing QC Draft `contentSections` | None |
| Basketball buying journey | Product-category document and related documents | Existing Basketball Category Draft with references | None |
| Sublimation equipment answer | Published FAQ and matching Draft | Existing FAQ Draft with neutral process wording | None |
| Project images | Case-study CMS field or matched legacy local asset | CMS image only; otherwise verification-pending placeholder | None |
| Static HTML | Next.js `output: export` | Generated locally after content resolution | None |

## Blocked claims

| Claim | Located in | Preview handling |
| --- | --- | --- |
| `3,000+ Teams Served` | Homepage code badge and legacy fallback | Removed from Preview branch; replaced with process and QC proof |
| `KIAN ink` | Published risk FAQ and historic production HTML | Published unchanged; existing FAQ Draft uses neutral process wording |
| `EPSON print heads` | Published risk FAQ and historic production HTML | Published unchanged; existing FAQ Draft uses neutral process wording |
| `15-25 Days` | Homepage Published/Draft USP and process copy | Published unchanged; Homepage Draft uses approved timing and no old range |

## Published revision verification

| Document | Published revision after Draft changes |
| --- | --- |
| Homepage `691b156d8e3f49bd` | `kqd32DnwMDSkqBnWPyezTl` |
| Customization `23e722da0b66490c` | `eJ7skWqptDvdh6OpbTFOtl` |
| QC `82ca7167e20342ac` | `kqd32DnwMDSkqBnWPyf2fu` |
| Basketball category `product-category-basketball-mvp` | `z7UkfLUBQqOTgWEGeSHtjQ` |
| Risk FAQ `faq-58b766260485677a` | `C90lXvqhCRFE4tCBds9BKg` |

## Missing buyer-approved evidence assets

1. Buyer-approved physical basketball sample photography with confirmed usage rights.
2. Buyer-approved multi-team roster or packing photography without third-party marks.
3. Verified images and clean titles for the five existing case-study records currently lacking CMS imagery.
4. Written evidence for any future customer counts, order volumes, equipment brands, certifications or performance-result claims.

Until these assets are supplied and approved, the Preview omits the image or displays `Project imagery pending verification`. No substitute identity, quantity, result or branded evidence was invented.

## Preview credential status

The repository supports `NEXT_PUBLIC_CONTENT_SOURCE=sanity-preview` with a server-only `SANITY_READ_TOKEN`, draft perspective and `useCdn: false`. The current local process has no `SANITY_READ_TOKEN`; a real Draft-resolved frontend build is unavailable until that server-only environment variable is supplied outside Git and logs.
