# POXIOL SEO Operations

## Authoritative release artifacts

- `construction/public-sitemap-baseline.txt` — GET-only snapshot of the existing public paths.
- `construction/route-release.json` — deterministic preserved/added/redirected/withheld/410 comparison.
- `content/release/gone.json` — owner-approved 410 list; currently empty.
- `public/_redirects` — immutable base redirect rules.
- `out/sitemap.xml`, `out/robots.txt` and `out/_redirects` — generated release outputs.

## Required checks

Run `npm run check:final-seo-output`, `npm run check:canonical`, `npm run check:cms-redirects` and `npm run check:route-release` against the exact release build. Any unexplained public URL removal, duplicate route, dead redirect target, legal sitemap leak, missing canonical or sitemap/noindex conflict is release-blocking.

Legal drafts must remain rendered and crawlable until approved so search engines can see their page-level `noindex, nofollow, noarchive`. They must not enter the sitemap while approval is pending.

Do not add a 410, mass redirect or canonical consolidation without an explicit owner-approved route decision. When the sitemap policy or maintained page set changes, update the fixed release modification date, rebuild, regenerate `construction/route-release.json`, review its categories and commit the reviewed manifest.
