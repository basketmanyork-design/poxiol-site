# POXIOL V9.1A Owner Truth Closure Design

Date: 2026-08-19

## Boundary

V9.1A encodes the seven approved owner decisions and prepares a revision-safe Production Sanity migration. It does not start V9.2, merge PR #66, deploy Production, invent evidence, or change the approved basketball size-chart image.

## Truth model

The central registry uses seven stable IDs: `CLAIM_FACTORY_RELATIONSHIP`, `CLAIM_MOQ`, `CLAIM_TIMELINE`, `CLAIM_SHIPPING`, `CLAIM_SIZE_TOLERANCE`, `CLAIM_CERTIFICATION`, and `CLAIM_PROJECT_AUTHENTICITY`. Each record stores the owner decision status separately from the public truth status. Public rendering continues to accept only verified or conditional facts, or an approved safe replacement.

String scanning remains a legacy-discovery tool. It is not the identity system: discovered claims are mapped to a stable policy ID, while structured procurement, project, certificate, and category fields are governed directly by those IDs and enums.

## CMS migration

The V9.1A Before Snapshot is freshly read from `oqpv1xbc / production`. The plan stores the document ID, type, captured revision, field path, before value, proposed value, stable claim policy, reason, and risk classification. Unknown fields are never included in a patch. Deletes are forbidden.

Apply mode sends one revision-guarded document patch at a time. A changed revision is recorded as `REVISION_CONFLICT` and skipped; it is never force-written. Successful application must be followed by a fresh Production read-back before any alignment claim is accepted.

## Publication controls

- Factory positioning uses `Custom Teamwear Manufacturer` or `Teamwear Manufacturing Partner`; `Factory Direct` is restricted.
- MOQ, production timing, and shipping are project-dependent. Numerical values are not global defaults.
- Mockup, sample, and bulk timing values may exist only as internal operational targets.
- The approved `±2 cm` basketball measurement tolerance remains independent from returns policy, which stays `POLICY_REVIEW_REQUIRED`.
- Certificates require complete holder, name, scope, number/document, issuer, validity, and POXIOL-offering relationship evidence.
- Projects use one of the six approved authenticity classes; public use is controlled by class and buyer authorization.
- Product/category lifecycle uses `ACTIVE_VERIFIED`, `MANUFACTURABLE_NOT_PROVEN`, `PLANNED`, or `DISABLED`.

## Evidence and redirects

The existing evidence gate remains. Certificate and project evidence gain structured fields, and the nine Production proof slots remain `CONTENT_ASSET_REQUIRED`; no AI substitute is generated.

The 19 root/blog pairs receive a structural ownership review. Traffic/backlink evidence is explicitly `TRAFFIC_DATA_NOT_AVAILABLE` when unavailable. Existing redirects are not changed by this review without an approved decision.

## Completion rule

With no Production write credential, engineering can be completed and pushed to the existing Draft PR, but the release status remains `BLOCKED_ON_CMS_WRITE`. V9.1A cannot be called complete and PR #66 remains Draft.
