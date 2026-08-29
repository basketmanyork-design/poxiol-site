# POXIOL Construction C2 Acceptance

Date: 2026-08-29  
Stage: C2 — page, content and evidence closure  
Result: ACCEPTED FOR C3 CONSTRUCTION ONLY  
Deployment performed: false  
Production authorized: false

## Accepted implementation

- `d31d129` — governed Plan A public-section visibility.
- `136dfb4` — withheld unsupported public proof and qualified retained planning explanations.
- `5ff5ef1` — closed the public asset allowlist and logo-review contract.
- Exactly 9 POXIOL basketball assets are classified as `EVIDENCE`, limited to `basketball-product-detail`.
- 14 product visualizations and 1 teamwear hero asset remain `ILLUSTRATION_NON_PROOF`.
- Every allowlisted binary passed its exact SHA-256 digest, third-party-mark review and POXIOL-mark retention review.

## Withheld inventory

The following families remain absent from public output until governed real evidence is approved:

- factory process proof;
- quality-control proof;
- customer project proof;
- delivery proof;
- repeat-order proof.

Retained buyer education is labelled with the exact limitation that it is a planning explanation and not a customer project, factory record, quality result, delivery result or production guarantee.

## Automated acceptance

- `npm test`: PASS.
- `npm run build:prelaunch`: PASS; 124 static pages generated.
- Plan A page-output suite: 3/3 PASS.
- Final public-asset suite: 5/5 PASS.
- Legacy-media output suite: 10/10 PASS.
- Real-production suite: 9 publishable, 0 blocked, 0 issues.
- Canonical audit: 72 sitemap URLs, 73 audited URLs, 0 failures, 0 missing or duplicate H1 records.
- No form was submitted, no CMS record was written and no deployment was attempted.

Key optimized-output SHA-256 values:

| Output | SHA-256 |
| --- | --- |
| `out/index.html` | `72109C35E26CB21C54FD1BE3FACC9A906238717855EDB6E242E06F833456209B` |
| `out/solutions/index.html` | `F3249840AFA8EFFC962ABAF25C05C6D8C84AFBA4BD0D99E18E26FFA6C7B2DBC1` |
| `out/products/basketball-uniforms/index.html` | `D2290E94E6BF9373BF8AF5A30F029A9A800DF2D759D2A0D604BAE8664261BFF2` |
| `out/projects/index.html` | `D1B753D7742D214BB8C348F2BD5E9D42858366C303A4AA8692D4EA00BA90A21D` |
| `out/factory/index.html` | `5832317FFDAF9D9A85280511DF09C1344402734A0B078254A27758FD10A1D0F0` |

## Browser acceptance

The following nine routes passed at 1440×900, 768×1024 and 390×844 (27 route/viewport checks):

- `/`
- `/solutions/`
- `/design-gallery/`
- `/factory/`
- `/quality-control-process/`
- `/projects/`
- `/products/basketball-uniforms/`
- `/products/soccer-jerseys/`
- `/custom-baseball-softball-uniforms/`

Across all checks: one H1, meaningful content, no horizontal overflow, no empty image source, no framework error overlay, no unfinished label, no unsupported proof frame, no console error or warning, and an available inquiry CTA. Mobile sticky CTAs remained fully visible after the entrance animation settled.

Interaction checks also passed:

- mobile navigation opened and exposed Products and Solutions, then closed normally;
- the homepage `Upload Your Design` CTA reached `/free-mockup/`;
- the destination displayed the `FREE MOCKUP` inquiry form without submitting it;
- the final rebuilt homepage loaded with no browser console issue and no detected NIKE, ADIDAS or PUMA text.

## Visual-fidelity ledger

| Approved direction | Final implementation | Result |
| --- | --- | --- |
| Black navigation and hero with vivid green primary CTA | Retained across desktop and mobile | PASS |
| Old-version product-led hero | Retained as a two-column POXIOL teamwear composition | PASS |
| POXIOL identity must remain | POXIOL wordmark remains on site and reviewed apparel illustration | PASS |
| No third-party brand or team mark | None observed in reviewed assets or browser output | PASS |
| Global channel customer, not one-country positioning | Hero addresses distributors, dealers, sportswear brands and custom resellers worldwide | PASS |
| Clear primary and secondary actions | `Upload Your Design`, `Build Your Range`, quote and WhatsApp paths remain visible | PASS |
| Light reading areas for evidence, process, FAQ and inquiry | Preserved outside the dark acquisition surfaces | PASS |
| Unsupported proof must not appear credible | Withheld; planning material carries an explicit limitation | PASS |

Intentional improvements from the internal concept are the stronger global-channel positioning, a more robust responsive navigation, and explicit evidence limitations. These do not change the approved black/green visual direction.

## Remaining gates

- Legal-policy records remain pending and production release stays executable-blocked.
- Sanity redirect retrieval was unavailable during the build; only the two base redirects were generated.
- Existing raw `<img>` LCP advisories and Node module-type warnings remain non-blocking construction debt.
- Infrastructure, analytics production validation and the real inquiry/privacy closeout remain later-stage work.

C2 acceptance authorizes work on C3 only. It does not authorize production publishing.
