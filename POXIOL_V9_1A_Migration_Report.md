# POXIOL V9.1A Migration Report

Updated: 2026-08-19
Project / dataset: `oqpv1xbc / production`
Branch: `feature/poxiol-v9-1-truth-foundation`

## Status

`V9.1A ENGINEERING COMPLETE — BLOCKED ON CMS WRITE`

Engineering and a fresh Production-read plan are complete. Production mutation was not attempted because the dedicated write credential is absent. V9.2 was not started; PR #66 remains Draft; no merge or Production deployment is authorized.

## Access preflight

| Item | Result |
| --- | --- |
| Required permission | Sanity API write permission capable of revision-guarded patch mutations for the listed documents in project `oqpv1xbc`, dataset `production`; read access for post-apply verification |
| Current permission | Anonymous published-data read succeeds; `SANITY_WRITE_TOKEN`, `SANITY_READ_TOKEN`, and `SANITY_AUTH_TOKEN` are not configured |
| Blocked operation | Production patch apply, After Snapshot, applied diff, failed/skipped result file, and Production read-back verification |
| Exact preflight result | `SANITY_WRITE_TOKEN is required for apply mode. No mutation was sent.` |
| Secret handling | No token was created, printed, committed or written to `.env` |

## Before Snapshot

| Field | Value |
| --- | --- |
| File | `docs/v9-1a/sanity-before.ndjson` |
| Manifest | `docs/v9-1a/sanity-before-manifest.json` |
| Captured at | `2026-08-19T02:05:24.778Z` |
| Documents | 120 |
| Affected document IDs | 84, recorded in the manifest and plan |

Document inventory: 40 articles, 38 FAQ items, 19 products, 11 site pages, 6 product categories, 5 case studies, 1 procurement standards document.

## Regenerated plan

| Metric | Result |
| --- | ---: |
| Revision-safe patches | 84 |
| Field-level planned changes | 549 |
| Deletes | 0 |
| Unknown fields overwritten | 0; patches contain only the known-field allowlist |
| Revision protection | Every patch stores the captured revision and sends `ifRevisionID` |

Each field-level row records document ID/type/revision at the patch level and field path, Before, proposed After, stable claim policy, reason, risk classification, truth status and planned result. The increase from the old 537-row V9.1 plan to 549 is caused by explicit owner/category lifecycle fields; the old plan was not reused blindly.

Apply mode sends one document at a time. HTTP 409 is recorded as `REVISION_CONFLICT` and skipped. Other supported results are `APPLIED`, `SKIPPED`, `FAILED` and `NO_CHANGE`. There is no force-write or blind retry.

## Planned truth effects

| Stable policy / governance area | Planned rows |
| --- | ---: |
| Timeline | 272 |
| Factory relationship | 74 |
| Taxonomy/category | 72 |
| MOQ | 59 |
| Shipping | 38 |
| Size tolerance / return separation | 4 |
| Project authenticity | 10 |
| Other legacy claim families | 20 |

All five case studies lack approved authenticity/authorization in the fresh snapshot. The plan classifies them `UNVERIFIED` and changes their public status to draft. No certificate evidence documents exist; verified certificates remain 0.

## Apply and read-back

| Result | Count / status |
| --- | --- |
| `APPLIED` | 0 — blocked before mutation |
| `SKIPPED` | 0 — no apply run |
| `REVISION_CONFLICT` | 0 — no apply run |
| `FAILED` | 0 patches — preflight blocked the operation itself |
| `NO_CHANGE` | 0 — no apply run |
| Production read-back | Not run; no mutation occurred |

Accordingly, `sanity-after.ndjson`, `sanity-applied-diff.json`, and `sanity-failed-skipped.json` were intentionally not created.

## Engineering verification

- `npm test`: PASS.
- `npm run check:v9`: PASS; unexplained `PUBLIC_REVIEW` 0.
- `npm run build`: PASS; 124 static pages generated in the local-fallback build.
- `npm run check:v9:output`: PASS; 71 sitemap URLs, 95 non-redirect HTML outputs, 2 exact safe/legal residuals.
- Root TypeScript: PASS.
- Studio TypeScript: PASS.
- Sanity Studio build: PASS after the sandbox was allowed to read the user-level Sanity CLI config.
- Canonical: 71/71, 0 failures.
- Fake redirects: 0.
- Approved sitemap graph orphans: 0.
- Old head `093efaf`: Cloudflare `poxiol-site` success, `poxiol-admin` success, `cms-pr-check` success.

## Required closure action

Provide an approved, narrowly scoped Sanity write credential through the execution environment (never in the repository). Then recapture revisions, regenerate the plan, apply per document, preserve all conflicts, read back from Production, generate the three post-apply artifacts, rerun four-layer validation, and only then consider moving PR #66 to Ready for Review. Do not merge or deploy Production during that step.
