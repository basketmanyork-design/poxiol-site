# POXIOL CMS Visual Regression Report

Scope: CMS production integration clean branch, legacy rendering parity checkpoint.

This checkpoint keeps screenshots out of git. The automated checks below verify that legacy mode still exports the expected public URLs and that the CMS integration does not remove the main page route structure. Pixel screenshots should be captured before PR review in the browser using the same viewports: desktop 1440 x 1000 and mobile 390 x 844.

| Page | Desktop result | Mobile result | Difference vs main | Allowed | Fix status |
| --- | --- | --- | --- | --- | --- |
| `/` | Static export present; legacy layout preserved with CMS-backed resolver fields | Static export present | Homepage structure preserved; content now resolved through `getHomepageContent` | Yes | Fixed |
| `/about/` | Static export present | Static export present | Uses CMS page template with legacy fallback sections; no internal CMS placeholder copy | Temporarily yes | Needs browser screenshot pass |
| `/factory/` | Static export present | Static export present | Factory fallback keeps production sections, stats and image modules | Temporarily yes | Needs browser screenshot pass |
| `/manufacturing/` | Static export present | Static export present | Manufacturing fallback keeps process and gallery modules | Temporarily yes | Needs browser screenshot pass |
| `/quality-control-process/` | Static export present | Static export present | QC fallback keeps process and specifications table | Temporarily yes | Needs browser screenshot pass |
| `/customization/` | Static export present | Static export present | Customization fallback keeps option grid and mockup CTA | Temporarily yes | Needs browser screenshot pass |
| `/oem-odm/` | Static export present | Static export present | OEM/ODM fallback keeps process and CTA sections | Temporarily yes | Needs browser screenshot pass |
| `/free-mockup/` | Static export present | Static export present | CMS route exports with legacy fallback and form route intact | Temporarily yes | Needs browser screenshot pass |
| `/sample-order/` | Static export present | Static export present | CMS route exports with legacy fallback | Temporarily yes | Needs browser screenshot pass |
| `/get-quote/` | Static export present | Static export present | CMS route exports with legacy fallback | Temporarily yes | Needs browser screenshot pass |
| `/products/` | Static export present | Static export present | Product hub route preserved | Yes | Fixed |
| `/products/basketball-uniforms/` | Static export present | Static export present | Static category page now resolves CMS category/products/FAQ with sports-page fallback | Yes | Fixed |
| `/projects/` | Static export present | Static export present | Project hub route preserved | Yes | Fixed |
| `/faq/` | Static export present | Static export present | FAQ route resolves CMS with legacy fallback | Yes | Fixed |

Checks performed in this checkpoint:

- Next.js static export generated all listed URLs.
- `NEXT_PUBLIC_CONTENT_SOURCE=legacy` build is part of the validation plan for this checkpoint.
- No image or SVG binaries are changed by this branch.
- No internal PageTemplate development copy is rendered.
- Header and Footer support CMS logo with fixed dimensions and fallback to the POXIOL text mark.

Known follow-up:

- Capture actual browser screenshots for the listed desktop/mobile viewports before opening a Draft PR.
- Compare visual density of About, Factory, Manufacturing, QC, Customization and OEM/ODM against `origin/main` in a browser review pass.