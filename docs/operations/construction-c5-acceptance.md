# POXIOL C5 Construction Acceptance

## Decision

**LOCAL CONSTRUCTION COMPLETE — PREVIEW-READY / PRODUCTION NO-GO.**

No deployment, DNS change, CMS production write, real form submission, analytics activation or publication occurred.

This decision means the exact local static artifact is complete enough for a separately authorized Cloudflare Preview review. It is not permission to create that Preview, promote a deployment, change production, publish Sanity content, activate analytics or accept live inquiries.

## Locked artifact

- Release manifest: `construction/release-manifest.json`.
- Release manifest SHA-256: `65253352f5ec5a85510fe1e4a09473f020ba5626e6ca7931b16e24a7840634bd`.
- Source aggregate SHA-256: `f6b3a9b5efa362e7c4012d299a7c412564cf4b107b48961e05e1bff5b87ad809`.
- Output aggregate SHA-256: `84dd470694a092b3c5dc7a979524ae22e5974b1bcd8d262af7a519d0bb511464`.
- Locked output files: 684.
- Build: 124 static pages, exit code 0.
- Preview readiness: `PREVIEW_READY_PRODUCTION_NO_GO`.

## Automated acceptance

`construction/acceptance-command-results.json` records 15 source, build and output commands. Every command exited 0. The locked build recorded 133 passing checks, no failing checks and 124 static pages. The source suite recorded 35 passing checks; the conversion suite recorded 91 passing checks.

The command record stores command names, exit codes, durations, pass/fail counts, static-page count and output hashes only. It stores no environment values, credentials or raw submission data.

## Browser and responsive acceptance

`construction/browser-acceptance.json` records 19 governed routes at four viewports: 1440×900, 768×1024, 390×844 and 320×568. All 76 page scenarios passed:

- one visible H1, canonical metadata and a navigation path;
- no horizontal overflow, blocking overlay or console error;
- no completed broken image;
- no third-party brand asset or prohibited absolute guarantee wording;
- no third-party script, stylesheet or image load;
- at least eight visible inquiry actions per scenario;
- skip link, English document language, labelled controls and no positive tabindex.

The matrix was rerun after the mobile conversion repair. Buyer-visible internal construction language was absent across all governed routes, and the accepted/rejected analytics state rendered as a compact 123×44-pixel `Privacy choices` control. At 390×844, `Build Your Range` retained `Full Teamwear` context and placed the quote form 96 CSS pixels below the viewport top. The approved POXIOL illustration changed from a 1,487,571-byte PNG to an 82,756-byte WebP without changing dimensions, POXIOL marks or non-proof classification.

The matrix uses `/design-gallery/` as the governed product-visualization page. `/product-visualization/` is an asset directory and is not treated as a public page route.

## Inquiry, privacy and analytics acceptance

The local browser preserved the `Full Teamwear` inquiry context from `/solutions/`, displayed the Draft privacy link and exposed the expected submit control. Synthetic local text was used only to exercise fields. Submit was never clicked, no file was selected in the browser and no real request was sent.

The consent interface passed Reject → Change preference → Accept behavior. No analytics script loaded before a choice, after rejection or after acceptance because analytics remains governed as disabled. Attachment selection/removal, timeout recovery, uncertain receipt and no-auto-retry behavior remain covered by the passing automated form contracts.

## Accessibility and local performance

The source accessibility gate passed. Five high-risk browser routes were additionally checked for heading order, labelled controls, skip links, positive tabindex and control touch targets; no sampled failure was recorded. DOM focus order begins with `Skip to Content`.

No Lighthouse package or browser Lighthouse runner was present in the locked workspace. No dependency was installed for acceptance. `construction/lighthouse-local.json` therefore makes no Lighthouse score or production Core Web Vitals claim. It records fresh-tab Chrome DevTools local-lab samples for home, one guide and the quote page; the current homepage sample recorded 14 ms to DOMContentLoaded and 41 ms task duration without network throttling. A true Lighthouse run remains an owner-authorized Preview follow-up.

## Rollback and production boundary

The verified stable production reference remains Cloudflare Pages project `poxiol-site`, commit `ae452f70b4a027822fc4340db683746e90653fc1`, deployment `da1e8d5c-5db3-4522-9ee3-79cbbc0774a4` and immutable URL `https://da1e8d5c.poxiol-site.pages.dev`. The rollback record is read-only and was not executed.

All unresolved owner decisions are listed in `docs/operations/owner-gates.md`. Production remains NO-GO until every mandatory production gate is resolved and the owner gives a new explicit authorization for the exact next external action.
