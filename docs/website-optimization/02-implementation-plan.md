# POXIOL V1.1 file-level implementation plan

Status: IN_PROGRESS. Review base: `b7840691cd176f57ed591961be2ec4413acb6739`; isolated branch: `codex/poxiol-website-optimization-v1-1`.

| Responsibility | Existing file / planned file | Implementation |
|---|---|---|
| Homepage nine modules | `components/home-optimization/HomepageOptimization.tsx`, `.module.css`, `lib/hybrid/home.ts`, `app/page.tsx` | Render the confirmed nine-module order with visible HTML hero copy and one supplied video. Keep legacy homepage code for regression references, brand tokens and canonical host. |
| Media | `public/website-optimization/`, `scripts/prepare-website-optimization-assets.mjs` | Copy the supplied MP4, derive responsive WebP copies of six supplied PNGs; preserve and rehash originals. Images are design illustrations, not order evidence. |
| Six routes | Existing soccer, basketball, baseball and training routes; new `app/products/running-track-uniforms/page.tsx`, `app/products/warm-up-wear/page.tsx`; shared category component | Map each card to a matching live route and give each route a project/quote inquiry entrance. Preserve all old routes. |
| Shared product detail | `app/products/[slug]/page.tsx`, `lib/inquiry-context.ts` | Add visible direct inquiry and product context; do not invent SKU. Buyer edits remain the submitted product. |
| Four intent forms | `components/forms/ContactForm.tsx`, `components/v8/ProjectQualificationForm.tsx`, `lib/v8/leads.ts`, `lib/project-inquiry-request.ts` | Enforce exact quantity, in-hand date, delivery country/postcode or explicit not-applicable, and email or WhatsApp. Keep notes/files optional. Require a valid provider response before success. |
| Receiving service | Approved `https://formspree.io/f/xnpqqnol`, no owned backend in this repository | Existing endpoint remains. Provider-side field enforcement, durable idempotency, receipt ID, notification state and retry require an authorized receiving service or verified Formspree workflow/API access; these cannot be asserted from frontend code. |
| CMS and release | `studio/`, `lib/sanity/`, `.github/workflows/`, `next.config.mjs`, `app/sitemap.ts`, release scripts | Preserve Sanity dataset and production hooks. Preview uses local loopback/noindex. Document CMS edits and content rollback. |
| Verification | Existing `scripts/check-hybrid-integration.test.mjs`, `scripts/check-v8-homepage-output.mjs`, inquiry tests, build; new targeted V1.1 checks and `docs/website-optimization/` | Update obsolete homepage assertions, test key form behavior, run full gates, capture browser screenshots and record limits. |

Baseline focused tests: hybrid integration 24/24 PASS; V8 lead qualification PASS. Existing site-build worktree is dirty and belongs to a different older repository, so this plan applies to the deployed `basketmanyork-design/poxiol-site` repository.
