# POXIOL V9.1A Owner Truth Closure Implementation Plan

> Scope: execute on `feature/poxiol-v9-1-truth-foundation`, update Draft PR #66, do not merge or deploy Production.

## 1. Lock the owner decisions with behavior tests

- Add tests for stable claim IDs, decision statuses, public replacements, project publication rules, certificate completeness, category lifecycle gates, and proof-slot requirements.
- Add migration tests that assert structured policy IDs, complete audit rows, zero deletes, unknown-field preservation, and revision-conflict classification.
- Run the new tests first and confirm failure.

## 2. Implement the shared truth model

- Add `lib/truth/owner-decisions.ts`.
- Extend claim-policy types and Sanity projections/schema with owner decision fields.
- Add explicit project authenticity and category publication helpers.
- Extend evidence records for certificate and project verification while preserving the current public filter.
- Add the nine Production proof slots as governed `CONTENT_ASSET_REQUIRED` records.

## 3. Upgrade and regenerate the migration

- Upgrade `scripts/v9-sanity-truth-migration.mts` to V9.1A.
- Capture a fresh public-read snapshot from `oqpv1xbc / production`.
- Generate `docs/v9-1a/sanity-migration-plan.json` with full per-change audit information.
- Do not run apply without `SANITY_WRITE_TOKEN`; do not create after/diff/result files when no mutation occurred.

## 4. Complete governance reports

- Create the Owner Decision Register, Truth Alignment Matrix, Redirect Ownership Review, and Migration Report.
- Record the CMS write blocker separately from code/frontend/metadata/schema verification.
- Record 0/9 proof slots as content work, not an engineering failure.

## 5. Verify and hand off

- Run repository tests, V9 source/output gates, TypeScript, Studio build, Production build, schema/metadata/canonical/sitemap/redirect/internal-link gates.
- Recheck poxiol-site and poxiol-admin checks and the latest Preview.
- Perform desktop 1440x900 and mobile 390x844 no-regression checks on the required routes when the latest Preview is available.
- Commit and push only this V9.1A scope, update existing Draft PR #66, and keep it Draft because Production CMS apply/read-back is incomplete.
