# Dual-Dimension Product System Acceptance

- Date: 2026-08-29
- Environment: local construction worktree (`codex/construction-completion`)
- Routes reviewed: `/`, `/products/`, `/get-quote/`
- Taxonomy: 12 sports / 3 wearing scenarios
- Public media: existing POXIOL-approved media or code-native presentation only
- Deployment: not performed
- Status: PREVIEW-READY / PRODUCTION NO-GO
- Remaining owner gates: `docs/operations/owner-gates.md` remains the source of truth

## Automated verification

| Check | Result |
| --- | --- |
| `check-product-taxonomy.test.mts` | PASS — 4/4 |
| `check-inquiry-context.test.mjs` | PASS — 14/14 |
| `check-inquiry-context-forms.test.mjs` | PASS — 6/6 |
| `check-mobile-inquiry-ctas.test.mjs` | PASS — 7/7 |
| `check-mobile-inquiry-visibility.test.mts` | PASS — 4/4 |
| Next 15.5.21 local integration-review build | PASS — 124 static pages generated |
| `check-product-taxonomy-output.mjs` | PASS |
| `check-v8-homepage-output.mjs` | PASS |
| `check-english-only-output.test.mjs` | PASS — 2/2 |
| `check-core-sports-v1.test.mts --output` | PASS |
| `check-product-visualization-output.mjs` | PASS |

The build reports existing `<img>` performance warnings in legacy files. The new product discovery component publishes no image and introduces no new warning.

## Browser acceptance

Browser: Codex in-app browser against the locked local review server on `127.0.0.1:4174`.

### Desktop — 1440 × 900

- One Products H1: `Custom Teamwear by Sport and Wearing Scenario`.
- Twelve sport cards and three scenario panels rendered.
- `#sports` and `#scenarios` land 96 CSS pixels below the fixed header.
- Products menu contains five children: All Products, both discovery dimensions, Basketball Uniforms and Soccer Kits.
- Document scroll width does not exceed viewport width.
- Browser console: zero warnings and zero errors.

### Mobile — 390 × 844

- Document scroll width does not exceed viewport width.
- All twelve sport labels remain untruncated.
- The three scenario panels share one left position and therefore stack in one column.
- Mobile Products submenu exposes the same five children as desktop.
- Visible page text contains no Chinese ideographs.

### Inquiry path

- Rugby → Warm-Up & Training produced editable product reference `Rugby - Warm-Up & Training`, sport `Rugby`, source `/products/`.
- American Football → Match Day produced editable product reference `American Football - Match Day`, sport `American Football`, source `/products/`.
- No form was submitted and no external transmission occurred.

## Visual fidelity ledger

| Comparison point | Accepted direction | Browser evidence | Result |
| --- | --- | --- | --- |
| Palette | Black first-view/product areas, white reading areas, POXIOL green CTA | Homepage and Products screenshots use `#0a0a0a`, white and green hierarchy | Matched |
| Homepage composition | Left offer and CTA, right POXIOL-only teamwear image | Two-column hero, retained POXIOL wordmarks, no third-party marks | Matched |
| Header | Compact navigation with one dominant quote CTA | Five main groups plus green Get Quote; product children stay compact | Matched |
| Typography | Heavy uppercase headings with restrained supporting copy | Hero, sport and scenario headings retain the established scale and weight | Matched |
| Product discovery | Dark product area followed by a light reading/selection area | Sport cards use the dark system; scenarios use a pure-white band | Matched |
| Media treatment | Preserve POXIOL branding; prohibit unapproved logos | Existing approved homepage asset retained; new taxonomy uses no new raster media | Matched |
| Responsive behavior | Clear single-column mobile continuation | No overflow, no truncated sport labels, three scenarios stack | Matched |

### Intentional deviation

The earlier category reference used product-image cards. The approved written specification requires evidence-limited categories to use code-native typographic/geometric presentation until public POXIOL-only media is approved. The twelve-sport grid therefore uses numbered typographic cards rather than copying or publishing catalog/third-party imagery.

## Screenshot evidence

- Accepted homepage reference: `C:/Users/Administrator/AppData/Local/Temp/codex-clipboard-6ebd334b-4c0d-4feb-a784-8d8d0f233f65.png`
- Accepted category reference: `C:/Users/Administrator/AppData/Local/Temp/codex-clipboard-646a18fc-8b81-427f-80cb-03ca51cd9862.png`
- Rendered homepage: `construction/visual-reviews/dual-dimension/home-desktop-1440x900-clean.png`
- Rendered sport cards: `construction/visual-reviews/dual-dimension/products-sports-desktop.png`
- Rendered scenarios: `construction/visual-reviews/dual-dimension/products-scenarios-desktop.png`
- Mobile verification: browser DOM/layout metrics at 390 × 844; no screenshot is retained because the in-app browser's device emulation screenshot used a non-native scaling factor.
