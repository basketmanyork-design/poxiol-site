# POXIOL V9.1 Canonical URL Map

Updated: 2026-08-18
Canonical origin: `https://www.poxiol.com`

## Result

- Sitemap reduced from 100 URLs to 71 approved canonical URLs.
- Generated output check: zero missing canonicals, zero canonical/path mismatches, zero duplicate canonical tags, zero sitemap/noindex conflicts and zero missing or duplicate H1s. The truth gate also scans 140 non-redirect HTML outputs, including noindex pages, not only sitemap pages.
- Internal link graph reduced from 27 orphan pages to zero for the approved sitemap set.
- Redirect file contains 27 permanent redirects and one Google verification rewrite.
- Eight unconfirmed sports landing routes have Pages Function 404 handlers and are excluded from navigation and sitemap. Cloudflare Preview verified real 404 responses plus `X-Robots-Tag: noindex` for all eight. Files remain in place so an owner-approved offer can be restored without inventing content.

## Primary route decisions

| Topic | Canonical URL | Decision |
| --- | --- | --- |
| Products hub | `/products/` | Primary product discovery hub |
| Basketball | `/products/basketball-uniforms/` | Published category |
| Soccer | `/products/soccer-jerseys/` | Published category and sole soccer category canonical |
| Baseball / softball | `/custom-baseball-softball-uniforms/` | Published category |
| Training wear | `/products/training-wear/` | Published category |
| Hoodies / jackets | `/products/hoodies-jackets/` | Published category |
| Team Accessories | `/products/team-accessories/` | Route retained, excluded from nav/sitemap pending owner confirmation |
| Solutions | `/solutions/` | Custom Team Uniforms solution |
| OEM / ODM | `/oem-odm/` | OEM manufacturing solution |
| Private label | `/private-label-teamwear/` | Private-label solution |
| Guides | `/guides/` | Guide discovery hub |
| Resources | `/resources/` | Resource discovery hub |
| Projects | `/projects/` | Case/scenario discovery hub |

## Permanent redirects

| From | To | Status |
| --- | --- | --- |
| `/custom-basketball-uniforms/` | `/products/basketball-uniforms/` | 301 |
| `/custom-soccer-kits/` | `/products/soccer-jerseys/` | 301 |
| `/custom-training-wear/` | `/products/training-wear/` | 301 |
| `/sports/` | `/products/` | 301 |
| `/customization/private-label/` | `/private-label-teamwear/` | 301 |
| `/customization/fabric-options/` | `/fabric-guide/` | 301 |
| `/products/soccer-jerseys-1/` | `/products/soccer-jerseys/` | 301 |
| `/products/soccer-kits/` | `/products/soccer-jerseys/` | 301 |
| `/best-sportswear-fabrics/` | `/blog/best-sportswear-fabrics/` | 301 |
| `/custom-baseball-jerseys-for-clubs/` | `/blog/custom-baseball-jerseys-for-clubs/` | 301 |
| `/custom-basketball-jerseys-melbourne/` | `/blog/custom-basketball-jerseys-melbourne/` | 301 |
| `/custom-basketball-uniforms-for-schools/` | `/blog/custom-basketball-uniforms-for-schools/` | 301 |
| `/custom-soccer-kits-london/` | `/blog/custom-soccer-kits-london/` | 301 |
| `/custom-soccer-uniforms-for-academies/` | `/blog/custom-soccer-uniforms-for-academies/` | 301 |
| `/custom-sports-apparel-distributor/` | `/blog/custom-sports-apparel-distributor/` | 301 |
| `/custom-teamwear-new-york/` | `/blog/custom-teamwear-new-york/` | 301 |
| `/custom-volleyball-uniforms-for-schools/` | `/blog/custom-volleyball-uniforms-for-schools/` | 301 |
| `/how-sublimation-printing-works-for-teamwear/` | `/blog/how-sublimation-printing-works-for-teamwear/` | 301 |
| `/how-to-choose-a-teamwear-manufacturer/` | `/blog/how-to-choose-a-teamwear-manufacturer/` | 301 |
| `/oem-baseball-apparel-manufacturer/` | `/blog/oem-baseball-apparel-manufacturer/` | 301 |
| `/oem-basketball-apparel-manufacturer/` | `/blog/oem-basketball-apparel-manufacturer/` | 301 |
| `/oem-soccer-apparel-manufacturer/` | `/blog/oem-soccer-apparel-manufacturer/` | 301 |
| `/oem-volleyball-apparel-manufacturer/` | `/blog/oem-volleyball-apparel-manufacturer/` | 301 |
| `/oem-vs-odm-sportswear/` | `/blog/oem-vs-odm-sportswear/` | 301 |
| `/soccer-jersey-supplier-australia/` | `/blog/soccer-jersey-supplier-australia/` | 301 |
| `/soccer-teamwear-supplier-uk/` | `/blog/soccer-teamwear-supplier-uk/` | 301 |
| `/soccer-teamwear-supplier-usa/` | `/blog/soccer-teamwear-supplier-usa/` | 301 |

The 19 root-to-blog redirects consolidate duplicate pSEO ownership. Traffic and backlink review is still recommended before Production merge.

Their 19 canonical blog targets remain indexable but are deliberately deferred from the 71-URL sitemap until the CMS truth migration is applied and verified. This is an explicit ledger decision, not an accidental omission.

## Owner-review routes

| Route | Verified Preview behavior | Reason |
| --- | --- | --- |
| `/custom-american-football-uniforms/` | Pages Function 404 / omitted | Offer not confirmed |
| `/custom-esports-jerseys/` | Pages Function 404 / omitted | Offer not confirmed |
| `/custom-golf-wear/` | Pages Function 404 / omitted | Offer not confirmed |
| `/custom-ice-hockey-jerseys/` | Pages Function 404 / omitted | Offer not confirmed |
| `/custom-rugby-uniforms/` | Pages Function 404 / omitted | Offer not confirmed |
| `/custom-running-marathon-wear/` | Pages Function 404 / omitted | Offer not confirmed |
| `/custom-tennis-wear/` | Pages Function 404 / omitted | Offer not confirmed |
| `/custom-volleyball-uniforms/` | Pages Function 404 / omitted | Offer not confirmed |

## Verification note

Static export and output-level tests verify the route set, canonical tags, H1s, sitemap membership and redirect contract. OpenNext documents that Windows support is not guaranteed; the local OpenNext transform failed after the successful Next build, and Wrangler Pages on this host parsed rules but did not serve assets. Cloudflare Git Preview `https://d9497bf1.poxiol-site.pages.dev` supplied the accepted HTTP evidence: twelve required core/base routes returned 200, four representative redirect sources returned 301, all eight owner-review routes returned 404 plus `X-Robots-Tag: noindex`, and the sitemap returned 71 approved URLs.
