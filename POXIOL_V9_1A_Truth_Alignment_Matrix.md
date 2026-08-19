# POXIOL V9.1A Truth Alignment Matrix

Updated: 2026-08-19
Target: `oqpv1xbc / production`

## Four-layer status

| Truth area | Production Sanity | Frontend rendered content | Metadata | Schema / JSON-LD | Alignment result |
| --- | --- | --- | --- | --- | --- |
| Factory relationship | Legacy values remain in the Before Snapshot; 74 planned audit changes | Safe normalization and approved manufacturer/partner wording | Built output has no unexplained public `Factory Direct` use | Generated schemas use the same normalized CMS/fallback content | `BLOCKED_ON_CMS_WRITE` |
| MOQ | Legacy one-set values remain; 59 planned audit changes | Default is product/project-confirmed | Source/output scan has no unexplained numeric MOQ claim | FAQ/schema content is generated from the governed public copy | `BLOCKED_ON_CMS_WRITE` |
| Mockup/sample/bulk timing | Legacy numeric values remain; 272 planned audit changes | Numeric timings are not public guarantees; safe dependency wording is rendered | Built metadata scan has no unexplained fixed-timeline claim | Generated FAQ/Article/Product schema uses the same safe content | `BLOCKED_ON_CMS_WRITE` |
| Shipping | Legacy fixed timing remains; 38 planned audit changes | Destination/method/order dependency wording is used | Built metadata scan has no unexplained shipping promise | Schema output shares the governed copy | `BLOCKED_ON_CMS_WRITE` |
| Size tolerance / returns | Migration separates measurement fields and sets `POLICY_REVIEW_REQUIRED` | No automatic returns exclusion is rendered | No tolerance-to-return exclusion in metadata | No tolerance-to-return exclusion in schema | `BLOCKED_ON_CMS_WRITE`; approved basketball image unchanged |
| Certifications | No `evidenceRecord` exists in the fresh snapshot | Incomplete certificate evidence is hidden | No verified certificate badge/claim unlocked | Certificate output cannot be unlocked without complete evidence | Aligned fail-closed; verified certificates `0` |
| Projects | Five current records lack approved authenticity/authorization; plan marks all `UNVERIFIED` and draft | Legacy rendering remains normalized, but CMS ownership is not closed | No verified customer-result metadata claim accepted | No project may become proof from media alone | `BLOCKED_ON_CMS_WRITE`; verified real projects `0` |
| Category publication | Six category patches gain explicit lifecycle state | Navigation/sitemap helpers enforce the state registry | Planned/unproven defaults do not receive promoted landing metadata | Canonical/product schema remains limited to approved public pages | Engineering aligned; CMS write pending |

## Verification evidence

| Check | Result |
| --- | --- |
| Fresh Production read snapshot | PASS: 120 relevant documents captured at `2026-08-19T02:05:24.778Z` |
| V9.1A plan | PASS: 84 patches, 549 field-level rows, 0 deletes |
| Unexplained source RED claims | PASS: 0 `PUBLIC_REVIEW` |
| Local built-output truth scan | PASS: 71 sitemap URLs, 95 non-redirect outputs, 2 exact safe/legal residuals, local-fallback profile |
| Canonical integrity | PASS: 71/71 audited, 0 failures |
| Orphans | PASS: 0 in the approved sitemap graph |
| Fake redirects | PASS: 0; owner-review routes use real 404 handling |
| Frontend build | PASS |
| Root and Studio TypeScript | PASS |
| Sanity Studio build | PASS |

## Alignment conclusion

Frontend, metadata and schema controls use the approved V9.1A truth model and are fail-closed. Production Sanity still contains the legacy values represented by 549 planned changes. Therefore the four layers are **not yet finally aligned** and no Production CMS read-back can be claimed. Final alignment requires an authorized apply followed by a fresh Production read-back and field-by-field diff verification.
