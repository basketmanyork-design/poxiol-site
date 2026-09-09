# Approved homepage Banner release — 2026-09-09

## Authority and scope

The owner explicitly authorized production release with “上线” after reviewing the local desktop and mobile Banner preview. The owner briefly selected option 1 to approve `/blog/custom-teamwear-production-notes/`, but the public Sanity dataset does not contain that article. The owner then selected option 2, explicitly authorizing a Banner-only production release; the CMS route is excluded.

- Desktop: publish the owner-supplied 2172×724, 3:1 POXIOL teamwear illustration without cropping.
- Mobile: retain the reviewed 1774×887, 2:1 teamwear illustration with live HTML heading and inquiry controls.
- CMS route: `/blog/custom-teamwear-production-notes/` is excluded. No existing public route is added, removed or redirected by this release.
- Both images are registered as `ILLUSTRATION_NON_PROOF`. They must not be presented as a club, factory, quality-control, delivery, or customer-project case study.
- The existing `Upload Your Design` and `Build Your Range` link text, destinations, form behavior, global navigation, analytics, commercial policy, and all non-hero home-page content remain unchanged.

## Verification before deployment

- Asset digest allowlist pins the reviewed desktop and mobile WebP files.
- Homepage integration, homepage output, and product-visualization output checks pass.
- Static production build succeeds.
- Local browser verification covers 1440px desktop and 390px mobile: uncropped desktop 3:1 visual, mobile 2:1 visual, no horizontal overflow, no console errors or failed requests, and the existing `Build Your Range` flow reaches the quote form without a submission.

## Deployment and rollback

Publish through the existing Git `main` integration for Cloudflare Pages project `poxiol-site`. Verify the immutable deployment URL and `https://www.poxiol.com/` after the Pages build completes. Roll back only if post-deployment smoke verification fails, using the immediately previous production commit and Pages deployment recorded before this release.
