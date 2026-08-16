# POXIOL Core Sports Asset Gaps V1

Approved classifications remain separate:

- `PRODUCT_VISUALIZATION`: product presentation only; never described as real production, factory, QC or customer proof.
- `VERIFIED_POXIOL`: real product evidence only when `canPublishProductionAsset()` passes.

No new media is generated in this phase.

| Sport | Visual task | Current asset | Missing? | Required dimensions | Page | Placement | Classification required | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Basketball | Hero full set | `PV-BASK-001` | No | 1400×1400 existing | Basketball | Hero | PRODUCT_VISUALIZATION | P0 |
| Basketball | Front/back | `PV-BASK-002`, `PV-BASK-003`, `PV-BASK-008` | No | 1400×1400 existing | Basketball | Product review | PRODUCT_VISUALIZATION | P0 |
| Basketball | Shorts and construction details | `PV-BASK-004` through `PV-BASK-010` | No | 1200–1400 square existing | Basketball | Details | PRODUCT_VISUALIZATION | P1 |
| Basketball | Finished POXIOL sample evidence | nine `POXIOL-RP-001-*` records | No | existing reviewed dimensions | Home/Basketball/buyer pages | Evidence | VERIFIED_POXIOL | P0 |
| Basketball | Reversible pair visual | none | Yes | 1400×1400, front/back paired | Basketball | Reversible option | PRODUCT_VISUALIZATION or separately verified product evidence | P1 |
| Soccer | Full kit | `PV-SOCCER-001` | No | 1400×1400 existing | Home/Soccer/buyer pages | Hero/product overview | PRODUCT_VISUALIZATION | P0 |
| Soccer | Front/back jersey | none | Yes | 1400×1400 | Soccer | Product review | PRODUCT_VISUALIZATION | P0 |
| Soccer | Shorts and socks breakdown | none | Yes | 1400×1400 | Soccer | Full kit section | PRODUCT_VISUALIZATION | P1 |
| Soccer | Goalkeeper kit | none | Yes | 1400×1400 | Soccer | Goalkeeper option | PRODUCT_VISUALIZATION | P1 |
| Soccer | Fabric/crest/number detail | none | Yes | 1200×1200 | Soccer | Customization/detail | PRODUCT_VISUALIZATION | P1 |
| Soccer | Real finished sample evidence | none | Yes | portrait/full set plus detail crops | Soccer | Evidence | VERIFIED_POXIOL or other explicitly allowed verified status | P0 |
| Baseball | Full uniform | `PV-BASEBALL-001` | No | 1400×1400 existing | Home/Baseball/buyer pages | Hero/product overview | PRODUCT_VISUALIZATION | P0 |
| Baseball | Jersey front/back | none | Yes | 1400×1400 | Baseball | Jersey section | PRODUCT_VISUALIZATION | P0 |
| Baseball | Pants detail | none | Yes | 1400×1400 | Baseball | Pants section | PRODUCT_VISUALIZATION | P0 |
| Baseball | Button/placket/construction detail | none | Yes | 1200×1200 | Baseball | Construction | PRODUCT_VISUALIZATION | P1 |
| Baseball | Youth/school fit visualization | none | Yes | 1400×1400 | Baseball/buyer pages | Buyer fit | PRODUCT_VISUALIZATION | P2 |
| Baseball | Real finished sample evidence | none | Yes | portrait/full set plus detail crops | Baseball | Evidence | VERIFIED_POXIOL or other explicitly allowed verified status | P0 |

## Evidence behavior

- Zero verified assets: hide the public proof section completely.
- One verified asset: render one item.
- Two verified assets: render two items.
- Three or more: render a responsive grid.
- CMS/admin may continue to show missing-slot status.
- PRODUCT_VISUALIZATION never satisfies a real-proof slot.
