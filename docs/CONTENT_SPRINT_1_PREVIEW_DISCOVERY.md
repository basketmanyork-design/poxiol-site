# Content Sprint 1 Preview Discovery

## Scope

Read-only discovery performed on 2026-07-29. No Sanity mutation, publish, discard, asset upload, PR creation, or Cloudflare configuration change was performed.
## Preview mechanism

- Preview Method: Cloudflare Pages branch static export.
- Preview URL: `https://f78487d4.poxiol-site.pages.dev`
- Authentication Required: Yes. Draft reads require the server-only `SANITY_READ_TOKEN` during the branch build.
- Draft Data Source: Sanity project `oqpv1xbc`, dataset `production`, `drafts` perspective, `useCdn: false`, `cache: no-store`.
- Production Data Source: The same project and dataset using the `published` perspective and CDN-capable static-build reads.
- How to Enable: Configure the Cloudflare Preview environment with `NEXT_PUBLIC_CONTENT_SOURCE=sanity-preview` and the existing server-only read token, then rebuild this branch.
- How to Exit: Rebuild without the Preview content-source setting. Production remains on the published content source; no browser token or Draft Mode cookie is used.

Repository discovery found no Next.js `draftMode()` implementation, no Preview API route, no Sanity Studio Presentation tool, and no Studio Preview action. The admin deployment is not an alternate front-end Draft Preview entry point.

## Deployment identity

- Repository: `basketmanyork-design/poxiol-site`
- Branch: `feature/content-sprint-1-safe-published-fixes`
- Commit: `90f65281c1d5e1dee7b6985e353097f1ddd24cf2`
- Cloudflare Pages check: `Cloudflare Pages: poxiol-site`
- GitHub check run: `90602089130`
- Cloudflare deployment ID: `f78487d4-67cf-481e-b2b8-eca217f0a124`
- Check conclusion: `success`
- Immutable Preview URL: `https://f78487d4.poxiol-site.pages.dev`
- Branch Preview URL: `https://feature-content-sprint-1-saf.poxiol-site.pages.dev`
- Immutable and branch home-page SHA-256: `62EDC5BCE6EEB7117014913E892168D6757F4BED7DC2DA4F2BD3CB5128ECDB5C`

The immutable URL and branch alias returned byte-identical home pages. This confirms the tested alias points to the deployment for the expected commit.

## Content-source discovery

The public deployment does not expose its Cloudflare build environment, and no Cloudflare API credential is available in the local validation environment. The value of `NEXT_PUBLIC_CONTENT_SOURCE` therefore cannot be read directly.

The deployed output proves that the Draft data path was not used:

- Preview `/factory/` metadata is `Factory information for POXIOL custom teamwear buyers.`
- The Published Sanity `factory` metadata contains the existing capacity statement.
- The Draft Sanity `factory` metadata contains the approved neutral replacement.
- The deployed metadata matches neither Sanity version and matches the Legacy fallback.
- All 20 affected Blog routes return `404`.
- Of the 15 affected Guide/Resource routes, 10 Legacy-known routes return `200` and 5 CMS-only routes return `404`.
- The approved Draft replacements do not provide a unique, verifiable signal in the deployment. One approved production-time phrase appears on a Legacy guide and is already present in repository Legacy data, so it is not evidence that Drafts were read.

Repository behavior explains the observable outcome: `sanity-preview` requires server-only `SANITY_READ_TOKEN`; when it is absent, the query reports `missing-preview-token` and resolvers use Legacy fallback. An explicit `legacy` content source or a failed Sanity request can also produce fallback. Without direct Cloudflare environment/log access, these causes cannot be distinguished, but the deployed output conclusively shows that Draft content was unavailable.

## Related checks

- `Cloudflare Pages: poxiol-admin`: success for the same commit; not used as the front-end Preview.
- `Workers Builds: poxiol-site`: failure for the same commit; separate from the successful Pages Preview.
- GitHub Deployments API returned no deployment object for this commit. The Cloudflare Pages Check Run supplied the authoritative Preview URLs and commit identity.

## Discovery conclusion

**Preview deployment available: YES**

**Expected commit verified: YES**

**Draft content path available: NO**

**Safe to continue to controlled publish: NO**

**Preview unavailable:** The deployment is reachable, but Draft Preview is unavailable because its generated output follows Legacy fallback rather than the Sanity `drafts` perspective. The public deployment does not expose which required Preview environment value is missing or incorrect.

The Cloudflare Preview environment must be configured so the branch build uses `NEXT_PUBLIC_CONTENT_SOURCE=sanity-preview` and receives the existing server-only read token. Rebuild this branch, then repeat Preview validation before any publish.
