# POXIOL Content Sprint 1 Safe Published Fixes — Design

## Objective

Apply Strategy A to remove deterministic public-content risks from the POXIOL
production Sanity dataset, while keeping all broader content optimization work
as Draft. The work must preserve existing URLs, references, analytics, contact
paths, and rollback options.

## Approved public standards

Only these procurement statements may be used as current general standards:

- Sample MOQ: 1 set
- Sample production: 2–3 working days after mockup approval
- Bulk production: 7–12 working days after sample or artwork approval
- Quality control: inspection before shipment
- Size tolerance: ±2 cm

The content must also state that buyers must own or be authorized to use team
names, logos, sponsor marks, and artwork when that context appears.

## Scope boundary

### Eligible for publication

A correction can be published only when it:

- edits content that is already Published and publicly visible;
- replaces an obsolete general procurement value with an approved value;
- removes an unsupported capacity, equipment, certification, customer, or
  outcome claim;
- hides an identified MVP/test or duplicate category without deleting it;
- adds no new fact, promise, customer story, certification, capacity figure, or
  URL;
- preserves references and produces no duplicate slug or 404;
- passes Preview, structured-data, sitemap, analytics, and contact-path checks.

### Must remain Draft

New or materially expanded products, categories, FAQs, articles, guides, case
studies, SEO fields, internal links, image alt text, and structured-content
modules remain Draft. Legal content, unverified numbers, incomplete content,
missing-alt content, and FAQ-conflicted content also remain Draft.

## Current evidence

The initial read-only Published audit found:

- 11 `sitePage` documents;
- 6 `productCategory` documents;
- 19 `product` documents;
- 38 `faqItem` documents;
- 35 `article` documents.

Public pages currently expose these risks:

- `homepage` and `manufacturing` contain a 15–25 day bulk-production statement;
- `about` and `manufacturing` contain a 30,000+ monthly-capacity statement;
- the FAQ and basketball page expose KIAN ink and EPSON print-head claims;
- `/products/` exposes `product-category-soccer-mvp` as “Soccer Kits Draft
  category content”;
- Published CMS content also contains other statements that require evidence,
  including equipment, production-capacity, certification, and result claims.

The exact inventory must be regenerated immediately before any mutation and
recorded in `docs/CONTENT_SPRINT_1_PUBLIC_RISK_AUDIT.md`.

## Isolated Git delivery

Work runs on `feature/content-sprint-1-safe-published-fixes`, created from the
latest `origin/main`. PR #39 remains independent.

The branch contains:

- the risk and content audit documents;
- a content-change report with document IDs and before/after field summaries;
- only the minimum code changes proven necessary for public visibility;
- focused regression/safety checks when code behavior changes.

It does not contain the Sanity export, tokens, temporary query results, or build
outputs.

## Backup gate

Before any Sanity mutation:

1. Export the complete `production` dataset.
2. Store it outside the Git repository under a private local backup directory.
3. Record the absolute path, file size, SHA-256, project ID, dataset, export
   time, and export command result.
4. Confirm the repository is clean and the backup is not under a tracked path.
5. Stop all mutations if export or hash verification fails.

The backup contents are never printed, copied into documentation, or committed.
The PR body may contain only the path, size, SHA-256, and timestamp.

## Read-only reconciliation

Query Published and Draft perspectives separately. For every matching risk,
record:

- `_id`, `_type`, `_rev`, slug, and current visibility state;
- exact field path containing the risk;
- whether the field is visible, metadata, JSON-LD input, or reference data;
- Published and Draft difference;
- proposed neutral replacement or visibility change;
- publication decision and manual-review status.

Use document revisions as optimistic-lock guards. If a revision changes after
the audit, re-read and re-review that document instead of overwriting it.

## Deterministic content corrections

### Procurement time and quality statements

Replace only general procurement standards. Historical case-study timelines are
not changed. Convert 15–25-day and other obsolete general statements to the
approved 7–12 working-day statement. Preserve the existing approved sample MOQ,
sample-production, QC, and tolerance wording where it is already correct.

### Unsupported manufacturing claims

Remove or neutralize:

- `30,000+ units monthly`;
- KIAN ink;
- EPSON print heads;
- unsupported equipment, capacity, certification, customer-volume, delivery
  outcome, or performance statements discovered by the final scan.

No substitute fact may be invented. Use a process-only description such as
“Production requirements and schedules are confirmed after project review”
only when it accurately describes the current workflow. Otherwise hide the
field or leave the change as Draft for manual review.

### MVP Soccer category

First confirm that `product-category-soccer-mvp` is the duplicate/test category
and that the authoritative public category is `soccer-jerseys`.

Do not delete the MVP document or assets. Update its Draft to:

- `publishStatus: unpublished`;
- `activeStatus: false`;
- `navigationVisibility: false`;
- `homepageVisibility: false`;
- `showOnHomepage: false`;
- `featured: false`;
- `seo.indexStatus: noindex`.

After Preview proves it no longer appears in `/products/`, publish only this
visibility correction. Keep its slug and document ID for rollback.

The current schema defines `activeStatus` as boolean, while the frontend mapper
compares it to the string `inactive`. The MVP suppression therefore must not
depend on `activeStatus` alone. `publishStatus: unpublished` is the authoritative
suppression signal in the current merge resolver. A minimal code fix is allowed
only if Preview proves that the existing resolver still renders the document.

## Draft optimization track

The broader Sprint 1 audit covers:

- homepage;
- products hub;
- basketball and soccer category pages;
- factory, manufacturing, and quality control;
- FAQ hub;
- free mockup, get quote, and contact;
- the closest existing custom-teamwear buying guide.

Findings go to `docs/CONTENT_SPRINT_1_AUDIT.md`. Proposed FAQ, guide, SEO,
internal-link, alt-text, and structured-data improvements are drafted but not
published in this safe-fix delivery. No duplicate article or new URL is created
without a separate approved review.

## Mutation and publication workflow

For each eligible document:

1. Re-read Published and Draft versions.
2. Create or patch only the Draft with an `_rev` guard.
3. Record field-level before/after summaries without copying sensitive content.
4. Run Sanity Preview and inspect the affected route.
5. Check visible copy, metadata, JSON-LD, links, and references.
6. Publish that document individually.
7. Re-query Published and confirm only the intended fields changed.
8. Stop and retain Draft if any check fails.

No bulk publish, deletion, discard, asset upload, Seed, Dataset Import, or
unpublish operation is permitted.

## Validation

Before PR merge:

- root build and TypeScript pass;
- Studio TypeScript, schema validation, and Studio build pass;
- CMS content blocker and risk scans pass;
- Published queries contain no current 15–25-day general standard;
- Published queries expose no 30,000+ capacity, KIAN, or EPSON claim;
- Products Preview omits the MVP Soccer category;
- Products, basketball, soccer, FAQ, free mockup, get quote, and contact render;
- sitemap contains no Draft URL;
- robots and llms.txt respond correctly;
- visible content and JSON-LD agree;
- GA4 remains `G-W5YLNQ39X1`;
- Cloudflare Web Analytics loads once;
- email obfuscation remains disabled;
- `mailto:` and `wa.me` remain valid;
- critical-link scan finds no unexpected 404/500.

The current `main` baseline has no `npm test` script. Verification therefore
uses existing CI checks, explicit TypeScript/build commands, and focused
regression scripts added only for changed code behavior.

## PR and production rollout

Create a PR titled:

`fix(content): clean published procurement and unverified manufacturing claims`

The PR body records Strategy A, corrected Published documents, Draft-only
documents, manual-review items, backup path/size/SHA-256, and validation
results. Do not force push or push directly to `main`.

After Required Checks pass, merge through GitHub. Wait for the Cloudflare
production deployment from the merge commit and verify the live site. Do not
change Cloudflare configuration, GA4 code, GTM, or procurement-standard values.

## Failure and rollback handling

- Backup failure: no mutation.
- Revision conflict: re-read and re-review; do not overwrite.
- Preview failure: retain Draft and do not publish.
- Partial publication failure: stop; do not publish remaining documents.
- Live regression: restore affected fields from the verified backup through a
  reviewed Draft, then publish only the rollback.
- Missing permissions: finish all read-only evidence and report the single
  blocked action without weakening safety checks.
