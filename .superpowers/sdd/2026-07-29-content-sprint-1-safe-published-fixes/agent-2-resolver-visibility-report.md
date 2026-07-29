STATUS: DONE_WITH_CONCERNS
Fields Reviewed:
- `publishStatus`: unpublished CMS categories suppress matching legacy list items in merge mode and resolve to null as singles.
- `activeStatus`: schema is boolean; resolver now recognizes both `false` and legacy `inactive`.
- `navigationVisibility`: projected and mapped, but Header consumes only configured site navigation, not category documents.
- `homepageVisibility` / `showOnHomepage`: mapped with the current field taking precedence; homepage excludes categories explicitly set false.
- `featured`: projected by no category resolver consumer; it does not affect public category visibility.
- `seo.indexStatus`: maps to `seo.noIndex`; category sitemap routes are not CMS-derived.
Products Resolver:
`getProductCategories` now removes inactive mapped categories after merge/strict resolution, so Product cards and the shared CollectionPage JSON-LD list use the same active result.
Category Resolver:
`getProductCategory` now receives all visibility projections and returns null for an inactive mapped category. Unpublished items remain suppressed by the shared single resolver.
Homepage Resolver:
Homepage cards now exclude categories with `homepageVisibility: false`; the legacy `showOnHomepage` field is respected when the current field is absent.
Navigation Resolver:
Header reads `getSiteChrome().headerNavigation`; it does not resolve or render CMS category documents, so category visibility flags cannot add a navigation entry.
Sitemap Resolver:
`app/sitemap.ts` has no CMS category query/resolver and therefore emits no CMS category route that could bypass unpublished/noindex filtering.
JSON-LD Resolver:
Products CollectionPage JSON-LD and cards both map the same `categories` variable from `getProductCategories`.
Noindex Handling:
The category SEO projection maps `seo.indexStatus === 'noindex'` to `seo.noIndex`. No CMS category sitemap generation exists.
Files Changed:
- `lib/sanity/content.ts`
- `lib/sanity/queries.ts`
- `scripts/check-cms-list-mode.mjs`
- `.superpowers/sdd/2026-07-29-content-sprint-1-safe-published-fixes/agent-2-resolver-visibility-report.md`
Commit:
`fix(content): respect CMS category visibility controls`
Tests:
- `node scripts/check-cms-list-mode.mjs` (including required boolean/legacy/missing active-status cases and source contracts): PASS
- `node scripts/check-cms-visibility.mjs`: PASS
- `npx tsc --noEmit`: PASS
- `npm run build`: PASS
- `node scripts/check-cms-content-blockers.mjs`: PASS
- `node scripts/check-cms-safety.mjs`: PASS
- `git diff --check`: PASS
- Generated `out/products/index.html`: `soccer-kits` / `Soccer Kits` absent; authoritative `soccer-jerseys` / `Soccer Jerseys` present.
