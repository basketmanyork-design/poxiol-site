# POXIOL Content Preview Data Flow Audit

## Scope

Architecture and deployment audit for
`feature/content-sprint-1-safe-published-fixes`.

The accepted Preview implementation is represented by code commit
`16a0e092916e48bc81d1e619a54f5c394fe46326` and was revalidated through the
immutable Cloudflare Pages Preview built from `0978c8d`.

## Production data source

- Mode: `sanity` (the default when `NEXT_PUBLIC_CONTENT_SOURCE` is absent).
- Perspective: `published`.
- CDN: enabled.
- Cache: `force-cache`.
- Token: not required and not used.
- Rendering: Next.js static export.

Production remains static and does not use Draft Mode or server rendering.

## Preview data source

- Method: Cloudflare Pages branch Preview build.
- Mode: `sanity-preview`.
- Perspective: `drafts`.
- CDN: disabled.
- Authentication: server-only `SANITY_READ_TOKEN`.
- Cache: build-time `force-cache`, required by `output: export`.
- Freshness: every Preview deployment uses a sanitized Sanity request `tag`
  derived from the Cloudflare commit identifier, causing a new build to issue
  a distinct authenticated Draft query.

The Preview token is read only by the build-time, server-only client. It is
not a `NEXT_PUBLIC_` variable and is not emitted into browser output.

## Static export compatibility correction

The first authenticated implementation used `cache: no-store`. That made the
App Router output dynamic and caused Cloudflare Pages to deploy a 404 shell
instead of generated HTML.

The first static-compatible revision then appended a custom
`previewBuild` query parameter to Sanity Query API requests. Sanity rejected
that undocumented parameter with HTTP 400, so resolvers silently used Legacy
fallback.

The accepted implementation:

1. retains `perspective: drafts`;
2. retains `useCdn: false`;
3. retains the server-only read token;
4. uses static-compatible `force-cache`; and
5. sends the build identifier through Sanity's supported `tag` parameter.

The immutable Preview at
`https://00f11f97.poxiol-site.pages.dev` generated and served the Draft-only
article routes successfully.

## Fallback data source

- `legacy` mode never queries Sanity.
- Failed `sanity` or `sanity-preview` requests use repository Legacy content.
- Successful empty Sanity results remain distinguishable from network/API
  failures according to the existing merge/strict resolver policy.
- Migration Preview remains in merge mode unless strict cutover is separately
  approved.

## Required environment variables

### Cloudflare Preview only

- `NEXT_PUBLIC_CONTENT_SOURCE=sanity-preview`
- `SANITY_READ_TOKEN` as a server-only read secret
- Existing public project and dataset identifiers

### Cloudflare Production

- `NEXT_PUBLIC_CONTENT_SOURCE=sanity` or the default
- no `SANITY_READ_TOKEN`

The Cloudflare Preview environment has the required mode and secret. Production
configuration was not changed.

## Browser and analytics safety

- `lib/sanity/client.ts` imports `server-only`.
- Preview HTML contains zero occurrences of `SANITY_READ_TOKEN`.
- Preview intentionally does not load GA4, preventing Draft traffic from
  contaminating Production analytics.
- Production still loads GA4 `G-W5YLNQ39X1` once and Cloudflare Web Analytics
  once.
- Neither environment contains a GTM container or Cloudflare email-protection
  rewrite.

## Current status

- Production data source: Published Sanity.
- Preview data source: authenticated Sanity Drafts at static build time.
- Fallback data source: repository Legacy content.
- Missing Preview configuration: none.
- Preview architecture validation: PASS.
- Production code integration: pending review and merge to `main`.
