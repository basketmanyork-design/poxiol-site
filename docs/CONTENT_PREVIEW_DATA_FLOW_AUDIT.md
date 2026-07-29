# POXIOL Content Preview Data Flow Audit

## Scope

Read-only architecture audit for branch `feature/content-sprint-1-safe-published-fixes` at commit `90f65281c1d5e1dee7b6985e353097f1ddd24cf2`.

No Sanity mutation or publish, Cloudflare configuration change, pull request, or production change was performed during this audit.

## Production Data Source

- Default content source: `sanity`.
- Sanity project: `NEXT_PUBLIC_SANITY_PROJECT_ID` or the code default `oqpv1xbc`.
- Dataset: `NEXT_PUBLIC_SANITY_DATASET` or the code default `production`.
- Perspective: `published`.
- CDN: enabled.
- Cache: `force-cache`.
- Token: not required and not used.
- Rendering model: Next.js static export. Sanity data is read during `next build` and written into `out/`.

Production remains on Published Sanity content when `NEXT_PUBLIC_CONTENT_SOURCE` is absent or equals `sanity`.

## Preview Data Source

- Preview method: Cloudflare Pages branch static build.
- Content source: `sanity-preview`.
- Dataset: Sanity `production`.
- Perspective: `drafts`.
- CDN: disabled.
- Cache: `no-store`.
- Authentication: server-only `SANITY_READ_TOKEN`.
- Browser token: none.

The repository has no Next.js `draftMode()` implementation, Preview API route, Preview cookie, Sanity Presentation tool, or Studio Preview action. Because the site is a static export, a Draft change requires a new Preview build before it can appear.

## Fallback Data Source

- `legacy` mode does not query Sanity.
- A failed `sanity` or `sanity-preview` query falls back to repository Legacy data.
- A missing Preview token is treated as a failed Preview query and therefore also falls back.
- Legacy sources include `lib/cms/legacy.ts`, `lib/home-data.ts`, `lib/sports-pages.ts`, and related local content modules.
- `CMS_LEGACY_LIST_MODE` controls merge/strict list behavior. Migration Preview should remain in `merge` unless complete strict coverage is separately approved.

## Required Environment Variables

### Cloudflare Preview only

- `NEXT_PUBLIC_CONTENT_SOURCE=sanity-preview`
- `SANITY_READ_TOKEN` as a server-only read secret
- Optional existing public configuration:
  - `NEXT_PUBLIC_SANITY_PROJECT_ID=oqpv1xbc`
  - `NEXT_PUBLIC_SANITY_DATASET=production`

Do not create `NEXT_PUBLIC_SANITY_READ_TOKEN`.

### Cloudflare Production

- `NEXT_PUBLIC_CONTENT_SOURCE=sanity` or leave it unset to use the default.
- Production does not require and should not receive `SANITY_READ_TOKEN`.

## Current Missing Configuration

The verified branch deployment at `https://f78487d4.poxiol-site.pages.dev` used Legacy fallback rather than Draft data.

The repository Preview client is already correctly configured. The missing or invalid state is in the Cloudflare Pages Preview build environment:

- `NEXT_PUBLIC_CONTENT_SOURCE=sanity-preview` is not verifiably active, or
- `SANITY_READ_TOKEN` is absent/invalid for the Preview build.

The public deployment cannot reveal Cloudflare environment values, so these possibilities cannot be distinguished without authenticated Cloudflare project access.

## Client and Bundle Safety

- `lib/sanity/client.ts` imports `server-only`.
- `SANITY_READ_TOKEN` is read only from `process.env` and used only in the build-time Authorization header.
- Preview uses `useCdn: false`, `perspective: drafts`, and `cache: no-store`.
- Production uses `useCdn: true`, `perspective: published`, and `cache: force-cache`.
- `NEXT_PUBLIC_CONTENT_SOURCE` is a public mode selector, not a credential.
- A rebuilt Preview must still be scanned to confirm that neither the token value nor a client-side token variable appears in `out/` or `.next/static`.

## Audit Conclusion

- Production Data Source: Published Sanity.
- Preview Data Source: Authenticated Sanity Drafts during a Cloudflare Preview build.
- Fallback Data Source: Repository Legacy content.
- Current Preview Result: Legacy fallback.
- Code change required: No.
- Cloudflare Preview configuration required: Yes.
- Controlled Publish ready: No.
