# POXIOL Commercial Seal P0 — Changed Files Manifest

- Date: 2026-09-02
- Base: `origin/main` at `1bf324c947b94e06af8300a624981df6d298f72b`
- Branch: `codex/poxiol-commercial-seal-p0`
- Scope: approved Source Gate and P0 only

## Added

- `content/governance/claim-ledger.json` — approved static claim source of truth.
- `lib/governance/claims.ts` — immutable approved-wording accessor.
- `lib/sports-page-copy.ts` — category-scoped shared sports headings.
- `scripts/check-commercial-claim-ledger.test.mts`
- `scripts/check-commercial-content-hygiene-output.test.mjs`
- `scripts/check-commercial-redirects.test.mjs`
- `scripts/check-customization-claims.test.mts`
- `scripts/check-sports-page-copy.test.mts`
- `scripts/check-sports-page-copy-output.test.mjs`
- `docs/superpowers/specs/2026-09-02-poxiol-commercial-seal-p0-design.md`
- `docs/superpowers/plans/2026-09-02-poxiol-commercial-seal-p0.md`
- `docs/operations/2026-09-02-poxiol-commercial-seal-p0-report.md`
- `docs/operations/2026-09-02-poxiol-commercial-seal-p0-changed-files.md`
- `docs/operations/2026-09-02-poxiol-commercial-seal-p0-claim-changes.md`
- `docs/operations/2026-09-02-poxiol-commercial-seal-p0-redirect-report.md`

## Modified — buyer-visible and runtime

- `app/customization/custom-packaging/page.tsx`
- `app/customization/fabric-options/page.tsx`
- `app/customization/logo-name-number/page.tsx`
- `app/customization/private-label/page.tsx`
- `components/cms/ArticleTemplate.tsx`
- `components/forms/ContactForm.tsx`
- `components/sports/SportsLandingPage.tsx`
- `components/v8/VerifiedMediaPlaceholder.tsx`
- `lib/buyer-decision.ts`
- `lib/legacy-claim-normalizer.ts`
- `lib/sanity/content.ts`
- `lib/v8/media.ts`
- `lib/week3-guides.ts`
- `public/_redirects`

## Modified — release records and tests

- `construction/route-release.json`
- `package.json`
- `scripts/check-inquiry-context-forms.test.mjs`
- `scripts/check-project-inquiry-recovery.test.mjs`
- `scripts/check-public-inquiry-integrity.mjs`
- `scripts/check-real-production-components.test.mts`
- `scripts/check-v8-accessibility.test.mjs`
- `scripts/check-v8-architecture.test.mts`
- `scripts/check-v8-phase6-release.test.mts`
- `scripts/check-v8-urls.test.mjs`

## Removed — replaced by HTTP 301

- `components/CategoryRedirect.tsx`
- `app/builder/page.tsx`
- `app/custom-american-football-uniforms/page.tsx`
- `app/custom-basketball-uniforms/page.tsx`
- `app/custom-esports-jerseys/page.tsx`
- `app/custom-golf-wear/page.tsx`
- `app/custom-ice-hockey-jerseys/page.tsx`
- `app/custom-rugby-uniforms/page.tsx`
- `app/custom-running-marathon-wear/page.tsx`
- `app/custom-soccer-kits/page.tsx`
- `app/custom-tennis-wear/page.tsx`
- `app/custom-training-wear/page.tsx`
- `app/custom-volleyball-uniforms/page.tsx`

## Explicitly unchanged

- DNS and Cloudflare account settings.
- Cloudflare production bindings and CSP Reporting Production.
- Sanity project configuration and Published documents.
- Formspree account and endpoint ownership.
- Analytics accounts or third-party analytics products.
- Existing tracked or untracked visual assets; no V10 asset was used.
