# POXIOL Core Sports V1 Audit

Date: 2026-08-15
Baseline: `main` at `42e2e8bc245731093550316eb1837c4eda07d7f6`

## URL ownership decision

| Sport | Primary commercial URL | Decision | Reason |
| --- | --- | --- | --- |
| Basketball | `/products/basketball-uniforms/` | Retain | Existing indexable 200 page, canonical and sitemap entry; approved legacy URL returns a real 301 here. |
| Soccer | `/products/soccer-jerseys/` | Retain | Existing indexable 200 page, self-canonical and sitemap entry. It needs a full topical and conversion upgrade. |
| Baseball | `/custom-baseball-softball-uniforms/` | Upgrade existing | Existing historical route is the safest owner. It currently returns 200 but is only a client redirect with no page canonical or sitemap entry; upgrading it avoids a new competing URL. |

No new primary commercial URL will be created. In particular, `/products/baseball-uniforms/`, `/custom-basketball-uniform-manufacturer/`, and equivalent variants are rejected.

## Current route audit

| URL | HTTP / index state | Current Title / H1 | Canonical / Sitemap | Schema / FAQ | Visuals / proof | CTA / links | Intent and risk |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/products/basketball-uniforms/` | 200, indexable | Title: Custom Basketball Uniform Manufacturer; one H1 | Self-canonical; in sitemap | Product, Service, Breadcrumb, FAQPage | 10 approved PRODUCT_VISUALIZATION records and 9 VERIFIED_POXIOL basketball records are available | Mockup, sample, quote, customization, manufacturing and QC paths | Correct owner, but CMS content may override code facts; preserve safety normalization and remove any remaining fixed claims from generated output. |
| `/custom-basketball-uniforms/` | real HTTP 301 | none | 301 to basketball primary | none | none | redirect only | Approved consolidation; unchanged. |
| `/products/soccer-jerseys/` | 200, indexable | Title targets custom soccer kits; current H1 is only `Soccer Jerseys` | Self-canonical; in sitemap | Product, Service, Breadcrumb, FAQPage | one approved soccer PRODUCT_VISUALIZATION; no VERIFIED_POXIOL soccer asset | Mockup and quote present | High risk: current CMS output contains basketball headings/buyer residue and repeated generic cards; page must become soccer-only. |
| `/custom-soccer-kits/` | 200 noindex client-forwarding page | generic site title; one redirect H1 | canonical points to soccer primary; not in sitemap | none | none | browser replace to soccer primary | Not a competing commercial page because it is noindex and contains no commercial content. Keep stable in this phase. |
| `/custom-baseball-softball-uniforms/` | 200 client-forwarding shell | generic site title; redirect H1 | no canonical; not in sitemap | none | no page content; one approved baseball PRODUCT_VISUALIZATION exists for other pages | browser replace to `/products/` | Strongest existing generic baseball route by historical URL mapping, but currently fails commercial, SEO and conversion needs. Upgrade in place. |
| `/custom-baseball-jerseys-for-clubs/` | 200, indexable | club-specific baseball title/H1 | self-canonical; in sitemap | FAQPage | legacy generic visual treatment | generic CTA | Retain as a club-only long tail. Link to the new baseball pillar and do not expand its generic manufacturer intent. |
| `/oem-baseball-apparel-manufacturer/` | 200, indexable | OEM/private-label baseball title/H1 | self-canonical; in sitemap | FAQPage | legacy generic visual treatment | generic CTA | Retain as OEM/private-label buyer intent. Link to the baseball pillar and private-label page; do not broaden it. |

## Current content findings

### Basketball

- Commercial coverage is strongest and already includes jersey/shorts, front/back, collar, armhole, fabric, number, waistband, sample, QC and buyer FAQs.
- The code-owned page uses the V8 component system and shared FAQ schema source.
- Nine real-production records are basketball-only and pass the existing VERIFIED_POXIOL policy; their classification must remain separate from product visualizations.
- The current production crawl showed stale fixed MOQ and timing language from CMS/cache. The latest `main` contains normalization for those fields, so output guards must verify the new build rather than trusting source text alone.
- Reversible, youth, school, club and private-label topics should remain contextual links, not new generic basketball commercial pages.

### Soccer

- The current page is rendered through the generic sports template.
- The public output contains the headings `Basketball Solutions`, `Choose the Right Basketball Uniform Format`, and `Youth Basketball Teams`; this is direct basketball residue.
- Soccer data covers jerseys, shorts, socks and goalkeeper kits, but product descriptions are repeated and lack a deliberate sample/manufacturing/QC path.
- Several FAQ answers use absolute language such as “best” and unverified process assertions. They need consultation-safe wording.
- Only `PV-SOCCER-001` is approved, and it is PRODUCT_VISUALIZATION. It is currently not mapped to the soccer commercial URL.

### Baseball

- No complete baseball pillar exists.
- The historical generic route is an empty client redirect and lacks canonical, schema, FAQ, sitemap presence and usable CTA paths.
- Existing long-tail pages are narrower club and OEM intents. They do not replace a generic jersey+pants+full-uniform pillar.
- Only `PV-BASEBALL-001` is approved, and it is PRODUCT_VISUALIZATION. There is no VERIFIED_POXIOL baseball evidence.

## Homepage, navigation and buyer layer

- Homepage already uses approved basketball, soccer and baseball product visualizations, but solution-card priority currently places school/private-label/club alongside sports and omits baseball as a direct category card.
- Header currently shows Basketball, Soccer, Training Wear and OEM Sportswear. Baseball is absent from the primary category menu.
- Buyer pages are shared as required, but examples and solution links do not consistently expose all three core sports.
- GA4 already records page views, product category views, CTA location, form start, submit and lead events. It needs stable sport/category values from all three core pillars, not a new analytics stack.

## Evidence and placeholder findings

- The Verified Media Gate correctly publishes only records that pass `canPublishProductionAsset()`.
- Basketball has nine publishable real-production assets.
- Soccer and Baseball have zero publishable real-production assets.
- Public production/trust modules can still render empty verification placeholders. Core Sports V1 will change public behavior to hide a proof section at zero assets, while preserving CMS missing-slot status and the verification gate.

## Guide and resource gap audit

Existing basketball guides already cover buying, fabric/GSM, reversible versus standard, sample-first, cost factors and sample approval. They should be linked back to the basketball pillar; no mass creation is needed.

Soccer has broader teamwear/private-label guides but lacks a focused set for ordering, fabric, sizing, sublimation and reorder planning. These are recorded as future gaps only.

Baseball has club and OEM landing pages, but lacks buyer-useful guides for ordering, jersey+pants selection, fabrics, sublimation, youth sizing and manufacturer selection. These are recorded as future gaps only.

## SEO risk controls

- One intent, one owner URL.
- One visible H1 per affected page.
- Visible FAQ and FAQPage JSON-LD use the same array.
- Unique title and description for all three pillars.
- Basketball 301 unchanged.
- No new redirects for non-core pages.
- Non-core pages remain `SECONDARY / FUTURE EXPANSION`; no deletion, redirect or mass noindex.
- No fixed MOQ, sample-time, production-time, guarantee or unsupported certification statements.
