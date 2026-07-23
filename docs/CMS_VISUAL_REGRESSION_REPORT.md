# CMS Visual Regression Report

Generated: 2026-07-23 Checkpoint D

Mode tested: current branch with `NEXT_PUBLIC_CONTENT_SOURCE=legacy` compared against `origin/main`. Screenshots were captured at Desktop 1440x1000 and Mobile 390x844 into a temporary local folder and are intentionally not committed. Static validation also checked H1 exact match, section count, image count, form count, CTA count, horizontal overflow, missing images, empty modules, and buyer-facing technical wording.

visualBlockingCount: 0

| Page | Desktop result | Mobile result | H1 exact match | Section / image / form / CTA result | Page height difference | Horizontal overflow | Missing image | Empty module | Buyer-facing technical wording | Fix status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Actual screenshot tested | Actual screenshot tested | Yes | Main section/image/form/CTA counts preserved or restored for Checkpoint D | < 5% or content-increase only | No | No | No | No | Passed |
| `/about/` | Actual screenshot tested | Actual screenshot tested | Yes | Main section/image/form/CTA counts preserved or restored for Checkpoint D | < 5% or content-increase only | No | No | No | No | Passed |
| `/factory/` | Actual screenshot tested | Actual screenshot tested | Yes | Main section/image/form/CTA counts preserved or restored for Checkpoint D | < 5% or content-increase only | No | No | No | No | Passed |
| `/manufacturing/` | Actual screenshot tested | Actual screenshot tested | Yes | Main section/image/form/CTA counts preserved or restored for Checkpoint D | < 5% or content-increase only | No | No | No | No | Passed |
| `/quality-control-process/` | Actual screenshot tested | Actual screenshot tested | Yes | Main section/image/form/CTA counts preserved or restored for Checkpoint D | < 5% or content-increase only | No | No | No | No | Passed |
| `/customization/` | Actual screenshot tested | Actual screenshot tested | Yes | Main section/image/form/CTA counts preserved or restored for Checkpoint D | < 5% or content-increase only | No | No | No | No | Passed |
| `/oem-odm/` | Actual screenshot tested | Actual screenshot tested | Yes | Main section/image/form/CTA counts preserved or restored for Checkpoint D | < 5% or content-increase only | No | No | No | No | Passed |
| `/free-mockup/` | Actual screenshot tested | Actual screenshot tested | Yes | Main section/image/form/CTA counts preserved or restored for Checkpoint D | < 5% or content-increase only | No | No | No | No | Passed |
| `/sample-order/` | Actual screenshot tested | Actual screenshot tested | Yes | Main section/image/form/CTA counts preserved or restored for Checkpoint D | < 5% or content-increase only | No | No | No | No | Passed |
| `/get-quote/` | Actual screenshot tested | Actual screenshot tested | Yes | Main section/image/form/CTA counts preserved or restored for Checkpoint D | < 5% or content-increase only | No | No | No | No | Passed |
| `/products/` | Actual screenshot tested | Actual screenshot tested | Yes | Main section/image/form/CTA counts preserved or restored for Checkpoint D | < 5% or content-increase only | No | No | No | No | Passed |
| `/products/basketball-uniforms/` | Actual screenshot tested | Actual screenshot tested | Yes | Main section/image/form/CTA counts preserved or restored for Checkpoint D | < 5% or content-increase only | No | No | No | No | Passed |
| `/products/soccer-jerseys/` | Actual screenshot tested | Actual screenshot tested | Yes | Main section/image/form/CTA counts preserved or restored for Checkpoint D | < 5% or content-increase only | No | No | No | No | Passed |
| `/projects/` | Actual screenshot tested | Actual screenshot tested | Yes | Main section/image/form/CTA counts preserved or restored for Checkpoint D | < 5% or content-increase only | No | No | No | No | Passed |
| `/faq/` | Actual screenshot tested | Actual screenshot tested | Yes | Main section/image/form/CTA counts preserved or restored for Checkpoint D | < 5% or content-increase only | No | No | No | No | Passed |

## Checkpoint D fixes verified

- Article route conflicts are resolved in migration candidates; Guide URLs remain authoritative.
- Resource candidates use independent checklist slugs instead of colliding with Guide slugs.
- The duplicate basketball ordering Blog candidate is merged into the authoritative Guide candidate.
- The sublimation Blog candidate uses `how-sublimation-printing-works-for-teamwear`.
- Core page SEO title and meta descriptions use the existing `origin/main` metadata.
- The five missing alt candidates are approved and written into migration candidate generation.
- The two broken project image paths now point to existing local assets.
- Factory fallback contains at least four production/QC/OEM/packing images.
- Free Mockup fallback contains hero/process/preparation/FAQ sections and an image module.
- Products Hub copy no longer exposes implementation wording.

## Notes

- Screenshot PNG files are not committed.
- No image or SVG binary file was added or modified.
- No Sanity document, asset, dataset, schema, Studio deployment, or Cloudflare setting was changed.
