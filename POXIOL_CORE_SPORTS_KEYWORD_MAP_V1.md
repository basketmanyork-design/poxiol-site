# POXIOL Core Sports Keyword Map V1

## URL ownership

| Sport | Primary URL | Primary intent | Status |
| --- | --- | --- | --- |
| Basketball | `/products/basketball-uniforms/` | Generic custom basketball uniform manufacturing and supply | Existing / retained |
| Soccer | `/products/soccer-jerseys/` | Generic custom soccer kit and jersey manufacturing and supply | Existing / retained |
| Baseball | `/custom-baseball-softball-uniforms/` | Generic custom baseball uniform manufacturing and supply | Existing / upgraded |

## Basketball map

| Keyword | Intent | Funnel | Buyer | Target URL | Status | Role | Risk | Required content | Internal-link sources | CTA | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| custom basketball uniforms | Commercial | Decision | Clubs, schools, youth | `/products/basketball-uniforms/` | Existing | Primary | Low | Jersey+shorts, front/back, names/numbers, sizing | Home, buyer pages, guides | Mockup / Quote | P0 |
| basketball uniform manufacturer | Supplier evaluation | Decision | Clubs, brands, distributors | same | Existing | Secondary | Low | Manufacturing planning, QC, private label | Manufacturing, QC, private label | Quote / Sample | P0 |
| custom basketball jerseys | Product | Consideration | Teams, schools | same | Existing | Secondary | Medium if split | Jersey construction, fabric, collar/armhole | Basketball guides | Mockup | P0 |
| custom basketball team uniforms | Program | Decision | Club/school programs | same | Existing | Secondary | Low | mixed sizes, roster, reorders | Youth, school, club | Quote | P1 |
| sublimated basketball uniforms | Method/product | Consideration | Teams, brands | same | Existing | Secondary | Low | customization and print review | Printing guide | Sample | P1 |
| reversible basketball uniforms | Distinct product long-tail | Consideration | Teams | same for V1 | Existing support | Secondary | Medium | reversible option and comparison | existing reversible guide | Mockup | P1 |
| youth basketball uniforms | Buyer long-tail | Consideration | Youth managers | `/youth-team-uniforms/` contextualized to primary | Existing buyer page | Secondary | Low | youth sizing, roster | Youth page | Mockup | P1 |
| basketball uniform fabric guide | Informational | Research | Buyers | existing basketball fabric guide | Existing | Primary guide | Low | fabric choice and approval | Resources | Basketball page | P2 |

## Soccer map

| Keyword | Intent | Funnel | Buyer | Target URL | Status | Role | Risk | Required content | Internal-link sources | CTA | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| custom soccer kits | Commercial | Decision | Clubs, schools | `/products/soccer-jerseys/` | Existing | Primary | Low | jersey, shorts, socks, full kit, goalkeeper | Home, buyer pages | Mockup / Quote | P0 |
| soccer kit manufacturer | Supplier evaluation | Decision | Clubs, brands, distributors | same | Existing | Secondary | Low | sample, manufacturing, QC, packaging | Manufacturing, QC | Quote / Sample | P0 |
| custom soccer jerseys | Product | Consideration | Clubs, teams | same | Existing | Secondary | Medium if split | front/back, crest, sponsor, numbers | Soccer guides | Mockup | P0 |
| soccer jersey manufacturer | Supplier evaluation | Decision | Brands, clubs | same | Existing | Secondary | Low | customization, construction, planning | Private label | Quote | P0 |
| custom soccer uniforms | Generic commercial | Decision | Schools, clubs | same | Existing | Secondary | Medium | full kit scope and sizing | School, club | Quote | P1 |
| soccer jersey supplier | Procurement | Decision | Distributors | same | Existing | Secondary | Low | packaging, repeat requirements | Private label | Quote | P1 |
| custom youth soccer uniforms | Buyer long-tail | Consideration | Youth programs | `/youth-team-uniforms/` contextualized to primary | Existing buyer page | Secondary | Low | youth sizing and roster | Youth page | Mockup | P1 |
| custom goalkeeper kits | Product long-tail | Consideration | Clubs | soccer primary | Existing support | Secondary | Low | contrasting keeper option | Soccer page | Mockup | P1 |
| soccer kit sizing guide | Informational | Research | Managers | future guide gap | New later only | Guide | Low | size planning | Resources | Soccer page | P2 |

## Baseball map

| Keyword | Intent | Funnel | Buyer | Target URL | Status | Role | Risk | Required content | Internal-link sources | CTA | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| custom baseball uniforms | Commercial | Decision | Teams, schools, clubs | `/custom-baseball-softball-uniforms/` | Existing / upgrade | Primary | Medium until old shell is replaced | jersey+pants+full set, sizing, sample, QC | Home, buyer pages | Mockup / Quote | P0 |
| baseball uniform manufacturer | Supplier evaluation | Decision | Clubs, brands, distributors | same | Existing / upgrade | Secondary | Medium | manufacturing planning, QC, packaging | Manufacturing, QC | Quote / Sample | P0 |
| custom baseball jerseys | Product | Consideration | Teams, clubs | same | Existing / upgrade | Secondary | High with club long-tail | jersey formats plus link from club page | Club baseball page | Mockup | P0 |
| baseball jersey manufacturer | Supplier evaluation | Decision | Clubs, brands | same | Existing / upgrade | Secondary | Medium with OEM page | construction and customization | OEM baseball page | Quote | P0 |
| baseball uniform supplier | Procurement | Decision | Schools, distributors | same | Existing / upgrade | Secondary | Low | full uniform, packaging, reorders | School, private label | Quote | P1 |
| custom sublimated baseball jerseys | Method/product | Consideration | Clubs, brands | same | Existing / upgrade | Secondary | Low | print/customization review | Printing guide | Sample | P1 |
| custom baseball jerseys for clubs | Club buyer | Decision | Clubs | `/custom-baseball-jerseys-for-clubs/` | Existing | Primary long-tail | Medium | club-only needs; link to pillar | Club page | Quote | P1 |
| OEM baseball apparel manufacturer | Private label | Decision | Brands | `/oem-baseball-apparel-manufacturer/` | Existing | Primary long-tail | Medium | OEM/private label; link to pillar | Private-label page | Quote | P1 |
| youth baseball uniform sizing | Informational | Research | Youth managers | future guide gap | New later only | Guide | Low | sizing process | Youth/resources | Baseball page | P2 |

## Rejected URLs

- `/custom-basketball-uniform-manufacturer/`
- `/basketball-uniform-manufacturer/`
- `/products/baseball-uniforms/`
- `/custom-soccer-kit-manufacturer/`
- any near-duplicate city, buyer or sport page that repeats the same generic commercial intent

## Measurement map

| Sport | Session / page view | Category event | CTA dimensions | Funnel events |
| --- | --- | --- | --- | --- |
| Basketball | `page_path=/products/basketball-uniforms/` | `product_category_view`, `sport=basketball`, canonical category path | `cta_location`, intent destination | form_start → form_submit → generate_lead |
| Soccer | `page_path=/products/soccer-jerseys/` | `product_category_view`, `sport=soccer`, canonical category path | `cta_location`, intent destination | form_start → form_submit → generate_lead |
| Baseball | `page_path=/custom-baseball-softball-uniforms/` | `product_category_view`, `sport=baseball`, canonical category path | `cta_location`, intent destination | form_start → form_submit → generate_lead |

No PII is added to analytics. Existing GA4 event architecture is retained.
