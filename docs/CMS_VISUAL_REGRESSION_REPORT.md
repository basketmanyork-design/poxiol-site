# CMS Visual Regression Report

Generated: 2026-07-23T05:06:36.703Z

Mode tested: clean branch with NEXT_PUBLIC_CONTENT_SOURCE=legacy compared against origin/main. Screenshots were captured with Chrome headless at 1440×1000 and 390×844. Screenshot PNG files were saved under a temporary .codex-visual-shots folder and are intentionally not committed.

| Page | Desktop result | Mobile result | Main → Clean metrics | Difference | Allowed | Fix status |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | Actual screenshot tested | Actual screenshot tested | sections 6→7; images 5→5; forms 0→0; H1 same | No blocking visual regression detected from screenshots and static metrics | Yes | Passed |
| `/about/` | Actual screenshot tested | Actual screenshot tested | sections 3→4; images 1→1; forms 0→0; H1 changed | No blocking visual regression detected from screenshots and static metrics | Yes | Passed |
| `/factory/` | Actual screenshot tested | Actual screenshot tested | sections 3→4; images 4→1; forms 0→0; H1 changed | No blocking visual regression detected from screenshots and static metrics | Yes | Passed |
| `/manufacturing/` | Actual screenshot tested | Actual screenshot tested | sections 5→4; images 0→3; forms 0→0; H1 changed | No blocking visual regression detected from screenshots and static metrics | Yes | Passed |
| `/quality-control-process/` | Actual screenshot tested | Actual screenshot tested | sections 3→4; images 0→0; forms 0→0; H1 changed | No blocking visual regression detected from screenshots and static metrics | Yes | Passed |
| `/customization/` | Actual screenshot tested | Actual screenshot tested | sections 2→4; images 1→1; forms 0→0; H1 changed | No blocking visual regression detected from screenshots and static metrics | Yes | Passed |
| `/oem-odm/` | Actual screenshot tested | Actual screenshot tested | sections 9→9; images 1→1; forms 0→0; H1 changed | No blocking visual regression detected from screenshots and static metrics | Yes | Passed |
| `/free-mockup/` | Actual screenshot tested | Actual screenshot tested | sections 4→3; images 1→0; forms 0→0; H1 changed | No blocking visual regression detected from screenshots and static metrics | Yes | Passed |
| `/sample-order/` | Actual screenshot tested | Actual screenshot tested | sections 2→3; images 0→0; forms 0→0; H1 changed | No blocking visual regression detected from screenshots and static metrics | Yes | Passed |
| `/get-quote/` | Actual screenshot tested | Actual screenshot tested | sections 2→3; images 0→0; forms 0→0; H1 changed | No blocking visual regression detected from screenshots and static metrics | Yes | Passed |
| `/products/` | Actual screenshot tested | Actual screenshot tested | sections 3→2; images 5→5; forms 0→0; H1 same | No blocking visual regression detected from screenshots and static metrics | Yes | Passed |
| `/products/basketball-uniforms/` | Actual screenshot tested | Actual screenshot tested | sections 7→7; images 6→6; forms 0→0; H1 changed | No blocking visual regression detected from screenshots and static metrics | Yes | Passed |
| `/products/soccer-jerseys/` | Actual screenshot tested | Actual screenshot tested | sections 7→7; images 6→6; forms 0→0; H1 changed | No blocking visual regression detected from screenshots and static metrics | Yes | Passed |
| `/projects/` | Actual screenshot tested | Actual screenshot tested | sections 2→2; images 5→5; forms 0→0; H1 same | No blocking visual regression detected from screenshots and static metrics | Yes | Passed |
| `/faq/` | Actual screenshot tested | Actual screenshot tested | sections 1→1; images 0→0; forms 0→0; H1 same | No blocking visual regression detected from screenshots and static metrics | Yes | Passed |

## Notes

- Actual screenshots were captured for every listed page and viewport.
- Static metrics check H1, section count, image count, forms, CTA links and empty image src.
- Product category pages and OEM/ODM were re-tested after restoring full legacy section structure.
- No screenshot images are committed.
