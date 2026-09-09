# Approved fabric library release — 2026-09-09

## Authority and scope

Owner explicitly approved “同意，批准面料库上线” after the recommendation FABRIC REFERENCES FOR YOUR TEAMWEAR PROJECT. Publish the reviewed 29 originals on the existing `/customization/fabric-options/` route. No categories, selected subset, toolbar, placement advice, new routes, inquiry copy edits, or fabricated material specifications.

The source-order IDs PX-F001–PX-F029 and crop windows match the reviewed local package. All original JPEG hashes match. Native CSS confines the visible area; no raster retouching, AI regeneration, or inferred GSM/composition/performance claims. Original files are public photo assets; only reference codes and visible-texture descriptions appear in the page.

## Verification before deployment

- New rendered-component, hash/window and binary allowlist tests: RED on missing implementation, then 3/3 PASS. Guard blocks an unregistered 30th asset.
- Full `npm test`: PASS.
- Full `npm run build`: PASS, 139 static pages. Production form endpoint retained; strict legacy mode enabled.
- TypeScript: PASS. Lint: PASS with pre-existing image warnings elsewhere.
- Deterministic construction release manifest: regenerated; check PASS.
- Playwright, 1440/768/390 × 900: correct heading, 29 sequential cards, no categories, no horizontal overflow, all originals decoded after scrolling, no console errors. Sample CTA clicked through to existing contact form; zero submissions.
- Fresh production baseline compared with candidate: homepage, soccer, basketball and four inquiry pages unchanged; fabric-page links/CTA and forms unchanged; sitemap byte-identical.
- Browser plugin/skill not available; regular Playwright used against the actual built application. Reference differences are intentional: live Header/Footer and existing inquiry/consent controls retained; review-only notes omitted.

Evidence remains in the project workspace `tmp_artifact/fabric-release/` (not deployed or committed).

## Limitations and operational notes

- Original JPEGs are approximately 1.5–2.8 MB each. Native lazy loading defers later images but browser thresholds vary: initial requests observed 22 desktop / 16 tablet / 8 mobile. No throttled-network performance claim is made; loading all 29 transfers the original asset payload.
- No Safari, physical-device, real form submission or email-delivery test in this release. Inquiry behavior is unchanged and tested by existing gates and navigation parity.
- Local Node runtime is 24.19.0; repository declares 22.x. Local checks pass; Cloudflare's actual build remains the final release gate.
- First local build was rejected because local review environment variables were omitted. Added the required explicit local origin and review mode; no guard code relaxed. A QA URL assertion originally required a trailing slash; corrected to accept the existing contact route with or without it.

## Deployment and rollback

Use existing Git-main Cloudflare Pages integration for `poxiol-site`, not a same-named Worker. Final production verification is recorded separately after deployment completes.

Rollback baseline: commit `32470b499f76b8c838644848835023cb5bedae57`; Pages deployment `0505716c-b1be-417c-9a9d-6fe9dc869288` (`https://0505716c.poxiol-site.pages.dev`). No rollback performed.
