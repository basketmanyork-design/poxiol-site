# POXIOL V9.1 Implementation Report

Release: Truth Foundation + Canonical Architecture
Work period: 2026-08-17 to 2026-08-18
Branch: `feature/poxiol-v9-1-truth-foundation`
Base: `origin/main` at `ae452f70b4a027822fc4340db683746e90653fc1`

## Outcome

The source-code portion of V9.1 is implemented: risky public claims are removed or governed, taxonomy and canonical ownership are explicit, the sitemap and internal-link graph are tightened, and Sanity receives claim/evidence schema plus a revision-safe migration tool.

This is **not a Production-complete release**. The Cloudflare Preview and required HTTP/browser acceptance passed, but the production Sanity migration remains blocked by missing project access. No Production deployment or merge was performed.

## Before and after

| Area | Before | V9.1 result |
| --- | --- | --- |
| Public claim control | Repeated free-text claims plus render-time cleanup | Structured claim statuses, public-value resolver, source scanner and output scanner |
| Risky source residuals | Factory/direct, universal timing, MOQ, capacity, brands and absolute language present | Zero unexplained `PUBLIC_REVIEW` matches in source scan |
| Rendered risky residuals | Not centrally measured | 71 sitemap URLs and 140 non-redirect HTML outputs scanned; six exact-allowlisted safe/legal residual matches only |
| Taxonomy | Duplicate and unconfirmed product/sport ownership | Three explicit groups with publish/nav/sitemap states |
| Soccer category | Competing `soccer-jerseys` / `soccer-kits` ownership | `/products/soccer-jerseys/` is primary; duplicate redirects and is hidden in migration plan |
| Sitemap | 100 URLs | 71 approved canonical URLs |
| Internal-link orphans | 27 | 0 in approved sitemap graph |
| Redirect contract | Partial | 27 permanent redirects plus one verification rewrite |
| Unconfirmed sports pages | Public stubs | Eight routes return verified Preview 404 responses with `X-Robots-Tag: noindex` and are omitted from sitemap/navigation |
| Evidence | Marketing copy could imply proof | Typed evidence record, strict approval filter and CMS references; no invented evidence |
| CMS cleanup | 120-document public snapshot | 84-patch / 537-change / zero-delete guarded plan; apply blocked by access |

## Implemented architecture

- `lib/truth/`: claim statuses, safe public copy and structured procurement rules.
- `lib/site-taxonomy.ts`: public taxonomy, navigation and sitemap policy.
- `lib/canonical-architecture.ts` and `lib/sitemap-policy.ts`: canonical ownership, deny list and redirect expectations.
- `lib/evidence/`: evidence type, public eligibility filter and Sanity mapping.
- Sanity schemas: reusable `claimPolicy` object and `evidenceRecord` document; references added to Site Page, Category, Product, Case Study and Article.
- Migration tooling: snapshot, plan, apply and verify phases; known-field whitelist, revision guards, one transaction, zero deletes and no blind retry.
- Test tooling: source claim scan, built-output claim scan, canonical/taxonomy tests, evidence tests and real-snapshot migration simulation.

## CMS migration

| Item | Result |
| --- | --- |
| Public snapshot | 120 documents saved before changes |
| Planned patches | 84 |
| Planned field changes | 537 |
| Planned deletes | 0 |
| Revision protection | Every patch uses `ifRevisionID` |
| Apply | Not run |
| Reason | No approved write token; signed-in Sanity account does not list project `oqpv1xbc` |
| After snapshot / applied diff | Not created because no migration was applied |

The runtime legacy claim normalizer remains active by design until an authorized CMS migration and post-migration verification succeed.

## Verification evidence

- Full test suite: passed.
- `check:v9`: passed; zero unexplained public-review matches in the final source scan.
- Root TypeScript: passed.
- Sanity Studio TypeScript: passed locally and in the final GitHub integration check.
- Production static build: passed; 169 static-generation steps and 124 generated pages in the recorded build.
- Canonical output gate: passed with zero failures.
- V9.1 built-output truth gate: passed across 71 sitemap URLs and 140 non-redirect HTML outputs; six matches are exact-allowlisted legal dependency or safe-negation contexts.
- OpenNext local transform: Next build and site gates passed, then Windows dependency tracing failed. OpenNext does not guarantee full Windows support.
- Wrangler Pages local attempt: rules parsed, but static assets returned 404 on this Windows host; results were rejected rather than reported as site behavior.
- Pages Functions build: passed with Wrangler 4.119.0; the generated invocation list contains only the eight owner-review routes. Cloudflare Preview verified that all eight preserve the 404 page body, return status 404 and add `X-Robots-Tag: noindex`.
- GitHub `CMS Production Integration Check`: passed, including three static builds, sitemap checks, safety scan, Studio TypeScript, schema validation and Studio build.

## Preview acceptance

Accepted Preview: `https://d9497bf1.poxiol-site.pages.dev`

1. Twelve required core/base routes returned 200.
2. Four representative canonical redirects returned 301 with the expected `Location`.
3. All eight owner-review sport routes returned 404 plus `X-Robots-Tag: noindex`.
4. `/sitemap.xml` returned 200 with 71 URLs and excluded redirect sources and owner-review routes.
5. The ten required pages passed desktop checks at measured 1440 x 900 and mobile checks at measured 390 x 844: no horizontal overflow, broken image, empty CTA target, missing main content, missing navigation, off-screen interactive control or browser console error was observed.

## Known limitations and owner confirmation

- CMS truth cleanup is planned, not applied. An authorized owner must run it and review the generated diff.
- No evidence records were fabricated; proof coverage remains empty until real assets are supplied and approved.
- Factory relationship, numeric operating claims, certifications, case authenticity, future sports offers and Team Accessories need owner decisions.
- The 19 root-to-blog redirects should receive a traffic/backlink review before Production merge.
- This release does not redesign the homepage, merge the branch or deploy Production.
