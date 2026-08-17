# POXIOL V9.1 Truth Foundation + Canonical Architecture Design

Date: 2026-08-17

## Goal

Make public POXIOL content use one verifiable fact model across Sanity, local fallbacks, metadata, schema, sitemap, redirects and rendered pages. V9.1 does not redesign the homepage, create new visual themes, invent proof, merge a PR or deploy Production.

## Baseline and safety

- Base every change on `origin/main` commit `ae452f70b4a027822fc4340db683746e90653fc1`.
- Work only in `feature/poxiol-v9-1-truth-foundation` inside its isolated worktree.
- Preserve the V9.0 audit report and all files in the old worktree.
- Preserve historical CMS values in a versioned before snapshot and per-document migration record.
- Never bulk-delete Sanity documents or unknown fields.
- Stop at Draft PR and Preview review. Production deployment remains prohibited.

## Design decisions

### 1. Truth is structured and status-aware

Claims use these public governance states: `VERIFIED`, `CONDITIONAL`, `OPERATIONAL_TARGET`, `UNVERIFIED`, `PLACEHOLDER`, and `OWNER_CONFIRMATION_REQUIRED`. A reusable Sanity claim policy stores the public value, legacy value, evidence note, public rule, review owner and review date. Public code consumes the structured public value and does not silently rewrite old CMS strings.

Unknown enterprise facts are not guessed. Factory relationship, fixed MOQ, fixed lead times, company history, capacity, certifications, shipping commitments and return exclusions remain `OWNER_CONFIRMATION_REQUIRED` or `POLICY_REVIEW_REQUIRED` until the owner supplies evidence.

### 2. One taxonomy feeds all consumers

`lib/site-taxonomy.ts` owns the SPORTS, TEAMWEAR and MANUFACTURING SOLUTIONS groups. Each entry records its current public readiness, canonical path and navigation/sitemap eligibility. Header navigation, product hub links and sitemap rules consume this registry instead of keeping separate category lists.

Unconfirmed categories such as Pickleball or a missing canonical Hockey page may exist as internal taxonomy entries, but they are not automatically published or added to the sitemap.

### 3. Canonical architecture is a versioned ledger

`lib/canonical-architecture.ts` owns route intent, canonical target, decision status, redirect status, sitemap eligibility and index policy. `public/_redirects`, sitemap generation and regression tests are checked against the ledger.

The 19 exact root-pSEO/blog duplicates use the linked `/blog/<slug>/` route as the canonical owner because the root variants are sitemap orphans while the blog variants belong to a discoverable content hub. Confirmed migrations receive one-hop 301 rules. Legacy sport stubs without a confirmed matching offer are removed from the fake-redirect state and return an honest non-success response until owner review; they are not mass-redirected to an unrelated page.

### 4. Evidence is private by default

An evidence record supports image or video, caption, process stage, related products/sports/projects/capabilities, evidence date, verification status, internal notes and public/private state. Verification states are `VERIFIED`, `PENDING`, `INTERNAL_ONLY`, and `REJECTED`.

Only a complete `VERIFIED` and public-approved record may render. Empty, pending, internal or rejected evidence returns no public card. Existing production-media slots remain supported and are bridged into the same policy without inventing media.

### 5. CMS migration is reviewable and reversible

The migration tool has explicit `snapshot`, `plan`, `apply`, and `verify` modes. It records affected IDs and revisions, writes before and after snapshots, uses revision guards, patches only known risk fields, and emits a field-level diff. It never deletes documents or unknown fields.

The first migration replaces fixed public commitments with conditional project-review wording, separates size tolerance from return policy, marks project scenarios honestly, aligns metadata, and records owner decisions. If a write credential is unavailable, the tool still produces the exact plan and snapshots, but V9.1 cannot be declared complete.

## Data flow

1. Sanity stores approved public values plus claim/evidence status.
2. Query projections return the structured fields unchanged.
3. Runtime mapping filters by status and public approval; it does not transform unsafe prose into different prose.
4. Metadata and JSON-LD use the same mapped public fields.
5. Taxonomy and canonical ledgers drive navigation, sitemap, redirects and internal link checks.
6. Regression tests scan source, generated output and CMS snapshots for unsupported claims.

## Failure handling

- A CMS read failure may use an already-safe local fallback.
- An unsafe or incomplete evidence record is hidden without an empty placeholder.
- An unresolved enterprise fact renders the approved conditional replacement and remains in the Owner Decision Register.
- A redirect loop, chain, non-canonical target or sitemap redirect fails the build.
- A CMS mutation revision conflict stops that document and reports it; it is never overwritten blindly.

## Verification

- Source tests cover claim policies, taxonomy consumers, evidence publication rules, canonical uniqueness, redirect chains, sitemap eligibility, metadata/schema text and migration plans.
- Production build checks generated routes, canonical tags, sitemap contents and unsupported claim residue.
- HTTP checks verify redirect status, location, chain and final canonical.
- Preview QA covers the required desktop and mobile routes with measured viewports and no-regression checks.

## Owner decisions preserved

- Legal relationship behind “Factory Direct”.
- Numeric MOQ by product/project.
- Sample, production and shipping commitments.
- Company history, scale and capacity.
- Certification scope and validity.
- Return-policy consequences of manufacturing tolerance.
- Public eligibility of unconfirmed sport categories and historical legacy URLs.
