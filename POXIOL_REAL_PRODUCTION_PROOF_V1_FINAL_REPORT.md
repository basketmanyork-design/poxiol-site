# POXIOL Real Production Proof V1 Final Report

Report date: 2026-08-14

Branch: `feature/real-production-proof-v1`

Baseline commit: `5f775d8140944fcf29bd34fc42fe25431fe657bb`

## 1. Source scan

The read-only local source archive was scanned recursively without modifying, deleting, renaming or moving any original file. Its machine path is intentionally excluded from Git.

| Metric | Result |
| --- | ---: |
| Total files | 1,937 |
| Total size | 17,211,037,527 bytes |
| Images | 1,712 |
| Videos | 225 |
| Basketball | 747 |
| Soccer | 1,136 |
| Baseball | 29 |
| Packaging | 11 |
| Fabric/video | 14 |

The complete machine-readable inventory remains local-only and is intentionally excluded from Git. The public repository keeps only the nine approved asset records and their verification metadata.

## 2. Filename pairing result

The scanner applies the approved strict rule: `-A.jpg` is Front, `-B.jpg` is Back, and an unsuffixed same-base `.mp4` is Video. A suffixed video such as `-A.mp4` is not automatically paired. The scan produced 1,386 sample groups.

The selected source files do not use the strict A/B naming convention, so they remain separate scanner groups. They were manually associated as `POXIOL-RP-001` only after matching the same black/neon-green design, POXIOL branding, number 23 and garment set described in the user instruction. This exception is recorded in every manifest item.

## 3. Complete sample groups

| Grade | Groups |
| --- | ---: |
| S: Front + Back + Video | 141 |
| A: Front + Back | 64 |
| B: Front/Back + Video | 0 |
| C: Front or Back only | 0 |
| D: Video only | 17 |
| Unpaired | 1,164 |

Grades describe filename completeness only. They do not authorize public use.

## 4. Verification results

Every source file has a current safety state:

| Source state | Files |
| --- | ---: |
| `VERIFIED_POXIOL` | 5 |
| `PRODUCT_ONLY_VERIFIED` | 0 |
| `VERIFIED_BUYER_AUTHORIZED` | 0 |
| `REQUIRES_HUMAN_REVIEW` | 1,930 |
| `REJECTED` | 2 |

Two rejected images visibly contain Champion, Serbia/Yugoslavia, BODIROGA and national/team elements. One related source video remains `REQUIRES_HUMAN_REVIEW` because it could not be safely inspected in the available review environment and is not published. Local source filenames are intentionally excluded from Git.

The complete manual-decision register remains local-only and is intentionally excluded from Git.

## 5. Basketball accepted assets

Five original POXIOL sample photographs were accepted and archived as local, Git-ignored evidence copies. Nine WebP derivatives were created without AI generation, repainting, color replacement or upscaling:

- Complete uniform set.
- Jersey front.
- Jersey back.
- Shorts front.
- Shorts back.
- Fabric crop.
- Collar crop.
- Number crop.
- Waistband crop.

All nine records are `VERIFIED_POXIOL`, pass `canPublishProductionAsset()`, and total 1,133,050 bytes in `public/real-production/POXIOL-RP-001/`.

## 6. Soccer accepted assets

Zero. The archive contains many complete filename groups, but visible team, sponsor, player or third-party marks could not be cleared for public use in this run. They remain `REQUIRES_HUMAN_REVIEW`.

## 7. Baseball accepted assets

Zero. Available files did not have enough ownership/IP evidence for public use.

## 8. Packaging accepted assets

Zero. Available packaging materials could not be verified as safe public proof without buyer, label and source review.

## 9. Fabric/video accepted assets

No standalone fabric video or production video was accepted. The public fabric image is a true crop from the verified jersey-front photograph. No video is copied to `public/` or referenced by the manifest.

## 10. Homepage integration

- The V8 hero now uses the verified full-set photo as its production-proof visual.
- A shared `RealProductGallery` appears after the GEO entity section.
- The gallery shows the verified complete set, front, back, fabric and collar views available for the homepage.
- Sample, manufacturing and packing proof modules keep the neutral placeholder wherever evidence is missing.
- Existing H1, CTA labels, canonical, Schema and URL structure remain unchanged.

## 11. Basketball integration

`/products/basketball-uniforms/` uses the shared registry for `POXIOL-RP-001` and renders all nine approved assets in the requested order. Product photos are not reused as QC, factory or packing proof. Those sections continue to show the verified-evidence placeholder.

## 12. Other page integrations

- `/customization/`: keeps the mockup placeholder and uses the verified full-set/front asset as the factual Finished Sample.
- Buyer pages: reuse page-filtered `RealProductGallery`; only explicitly intended assets are eligible.
- `/factory/`: keeps product/factory proof empty because no verified factory scene was accepted.
- `/manufacturing/`: all detailed process slots remain placeholders.
- `/quality-control-process/`: all QC proof slots remain placeholders.
- `/private-label-teamwear/`: no packaging proof was added.

No new page or SEO landing URL was created.

## 13. AI visualization separation

`PRODUCT_VISUALIZATION` is a non-public state and cannot pass the production publication gate. The nine public files are direct resize/crop derivatives of verified originals. Existing unverified marketing/factory imagery is not used by the new proof modules.

## 14. Privacy/IP checks

The accepted sample has no visible person, private contact/order/shipping information, customer identity, customer artwork or unresolved third-party mark. Alt text and captions describe only visible facts. The rejected third-party sample is recorded but never copied into `public/`.

## 15. Performance

- WebP quality: 85.
- No enlargement; original aspect ratio is retained for full views.
- True crops are used for details.
- `next/image` renders explicit width, height and responsive `sizes`.
- Only the homepage hero may load with priority; gallery images load lazily.
- Video behavior remains `controls`, `preload="none"`, no autoplay and verified poster required.

## 16. Desktop validation

Local production output was reviewed at 1440px and 1280px.

- Homepage identity, value statement and both CTAs are visible.
- The real full-set hero is clear and proportionally contained.
- Real Product Gallery uses a readable three-column desktop layout.
- Basketball full-set, front, back, shorts and detail images load successfully.
- No horizontal overflow was found.
- Current Production was also checked and still shows a placeholder with zero real-production images, confirming the visual change is isolated to this branch.

## 17. Mobile validation

Local output was checked at 390×844, 375×812 and 360×800.

| Viewport | Horizontal overflow | Primary CTA | Secondary CTA | Gallery |
| --- | --- | --- | --- | --- |
| 390×844 | None | Visible | Visible | Single column |
| 375×812 | None | Visible | Visible | Single column |
| 360×800 | None | Visible | Visible; close to the existing fixed bottom bar | Single column |

The homepage real sample remains large enough to judge on mobile. The pre-existing fixed mobile conversion bar remains in place. On the basketball hero at 390px, the secondary CTA touches/partly meets that fixed bar; the primary CTA remains fully visible. This V8 layout behavior was not introduced by the real-proof layer and was not changed in this scope.

## 18. Build/test

Local results:

- `npm run check:real-production`: PASS — 9 total, 9 publishable, 0 blocked.
- `npm run check:v8`: PASS.
- `npx tsc --noEmit`: PASS.
- `npm test`: PASS.
- `npm run build`: PASS — 124 static pages generated.
- Sanity Studio TypeScript: PASS.
- Sanity Studio build: PASS.
- Canonical audit: 75 URLs, 0 failures.
- Canonical missing/duplicates/path mismatches: 0.
- H1 missing: 0.
- H1 duplicate: 0.
- Sitemap/noindex conflicts: 0.
- V8 generated-output checks: PASS.

Existing non-blocking build warnings remain: legacy raw `<img>` lint warnings, workspace-root inference caused by multiple lockfiles, and a Sanity redirect query fallback to the two base redirects.

## 19. Preview

Cloudflare Preview: pending branch push and deployment.

Local preview validation: PASS for homepage, basketball and customization; required assets return successfully from the static output.

## 20. Buyer scores

Subjective B2B buyer review based on the visible homepage/basketball experience:

| Measure | Current Production | Real Proof Preview | Change |
| --- | ---: | ---: | ---: |
| Visual Credibility | 5.5/10 | 8.5/10 | +3.0 |
| Physical Product Confidence | 4.5/10 | 8.5/10 | +4.0 |
| Sample Request Intent | 6.5/10 | 8.5/10 | +2.0 |
| Inquiry Intent | 6.5/10 | 8.0/10 | +1.5 |

The largest improvement comes from seeing the same real set as a complete product, front/back views and construction details. Scores are not customer research results; they are a structured review of the implemented preview.

## 21. PR

Pending final commit, feature-branch push, Cloudflare Preview validation and PR creation. The PR will target `main` and will not be merged automatically.

## 22. Missing evidence

- Verified POXIOL production/process photos for printing, cutting, sewing, inspection and packing.
- Verified QC actions: measurement, stitching check and print-placement check.
- Verified factory overview.
- Verified standalone fabric media.
- Verified packing/label media for private-label use.
- Safe soccer and baseball product sets with cleared team/IP rights.
- A safely reviewed product video with a separately verified poster.
- A real matching mockup for `POXIOL-RP-001` if a mockup-to-finished comparison is desired.

The detailed future capture list remains in `POXIOL_REAL_CONTENT_SHOT_LIST.md`.

## 23. Recommendation

**READY WITH MISSING EVIDENCE**

The verified basketball product proof is ready for Preview and code review. Missing QC, manufacturing, factory, packaging, multi-sport and video evidence must continue to use placeholders and should be supplied in later, separately verified batches.
