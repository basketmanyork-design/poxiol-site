# POXIOL Construction C4 Acceptance

Date: 2026-08-29

Stage: C4 — legacy Sanity, SEO and route closure

Result: ACCEPTED FOR C5 RELEASE AUDIT ONLY

CMS writes: 0

Deployment performed: false

Production authorized: false

## Accepted implementation

- `2019a6e` — validates every legacy Sanity result against a narrow public contract and fails closed for invalid required site/navigation content.
- `c1f2948` — locks the 100-route public sitemap baseline and refuses unexplained removals, duplicate routes, dead redirect targets or unapproved 410s.
- `6550af4` — closes governed sitemap, canonical, robots, redirect and withheld-proof output.

No schema was registered, imported or published. No Sanity token was used. No create, patch, delete, transaction, import or mutation endpoint was called.

## Route acceptance

The public baseline was captured from `https://www.poxiol.com/sitemap.xml` with a GET request only.

| Category | Count | Decision |
| --- | ---: | --- |
| Public baseline | 100 | Immutable comparison source |
| Candidate sitemap | 77 | Deterministic release output |
| Rendered routes | 121 | Static HTML routes detected |
| `PRESERVED` | 71 | Existing URL remains in sitemap |
| `ADDED` | 6 | Maintained guide/blog routes added |
| `REDIRECTED` | 26 | Exact, explicit 301 mappings only |
| `WITHHELD_LEGAL` | 3 | Rendered with restrictive robots metadata; excluded from sitemap |
| `OWNER_410_REQUIRED` | 0 | No deletion authorized or emitted |

There is no mass redirect to `/`. Every internal redirect destination is rendered. The 20 duplicate legacy blog URLs map to their same-slug root equivalents. Six retired guide URLs map to the maintained route serving the same buyer intent.

## SEO acceptance

- Sitemap consumes the Plan A publication policy and uses a fixed release modification date for deterministic output.
- Five dedicated guides received self-referencing canonical URLs before entering the sitemap.
- Canonical audit: 77 sitemap URLs, 78 audited URLs, 0 failures, 0 missing canonicals, 0 path mismatches, 0 sitemap/noindex conflicts and 0 duplicate canonical targets.
- Legal drafts remain crawlable so crawlers can observe `noindex, nofollow, noarchive`, but the drafts are absent from the sitemap.
- Withheld factory proof does not appear as a structured-data image.
- Redirect generation accepts only the public redirect contract, published GET results and 301/302 rules.

Final output SHA-256 values:

| Artifact | SHA-256 |
| --- | --- |
| `out/sitemap.xml` | `DCFF354146EE9684D995681B1C538268A153DE794471C367577ED4A823093C78` |
| `out/robots.txt` | `9A51EDDAEDBE49C4CDAD48B1D83A091CF801AC8B3B8ACEA19F56869C3E944B1A` |
| `out/_redirects` | `163B268FBCE5B9A081E054BE4F50E63E054880031FF2594C13F0A3EB56918957` |
| `construction/public-sitemap-baseline.txt` | `ED3F1CB48BD7924CA89B2C18D7D6A5E08F07FD727BD55F761ABFA6344609E67C` |
| `construction/route-release.json` | `952317A55A9E14DB7DF45A3A79B4E611F93EFF38012F9CC58A8135878038B850` |

## Read-only Sanity audit

`construction/sanity-read-audit.json` records 16 exact published GROQ query families used by the build. All requests used `GET`, `perspective=published`, `returnQuery=false`, no authentication and no saved response body. Only query hashes, response hashes, parameters, result kinds and counts were retained.

| Query | Count | Response SHA-256 |
| --- | ---: | --- |
| site-settings | 1 | `18ec75cab738eb5925acdbdb78f919fdb6a97874d0b67f4e562ee1b7a6b2873e` |
| navigation | 1 | `da5101cf2a6961165beb17edea1dcdf198f3aa2d4956e3a0dab16b04af856945` |
| footer | 1 | `ed691007919e40b0ceeaa06be746a38fd419ad9517bf4a5f9fac6f81ceaac5d2` |
| site-page | 1 | `5a4fc7bea9fe49e1435275c343e0b9bb6cb6c95664aa353c2874b9f73f0147b9` |
| product-categories | 6 | `b7bfffbbf111ad465ab70ce2a0017ef34f36fa1971a6d54612a329a78d8cd271` |
| product-category | 1 | `69008cea9b0f27c1491f34702cdcf4ae2f5a0a992caef5a47eeb90641efc5068` |
| products | 19 | `19b469747e578f6fd379388fcc42031278c6db54f526293d55f34650b7dd083a` |
| products-by-category | 4 | `70f121070b507ac148eeb580f591bb842d887aa1fd1d4b1576ff241385574440` |
| product | 1 | `4cdadb234f462aabe8fb13fcbffdb591a411fecf7f96deeae760ecb7b8819898` |
| case-studies | 5 | `074e17249df46dd087f3665259e857d96ce756f688dbb4c8062f5f4a141513ab` |
| case-study | 1 | `a77ab5883df95388534024614590ed4162b2ba3d47d71b89abfc4367330bcc68` |
| faqs | 38 | `af8c7770510873c2061ec914f91719208944ead64775706f9d18430650ec69b7` |
| articles | 40 | `cc865342a709dc5336cf8b0d6c5284a495d010391da9779407587df4395f8b69` |
| article | 1 | `abfdde09e17ad134ee97083d63e42f709286d697b7d3c6e4be5ca6e1a5c4214c` |
| procurement-standards | 1 | `a98bd552c3534f7bfd50d0506992391480a763f1b9ed92cee3df1f641332767a` |
| redirect-rules | 0 | `7b2829d2949203227f93c7fc4ed50ebfb183614064b1b23e22188354b9fa51e2` |

## Automated acceptance

- `npm test`: PASS.
- `npm run build:prelaunch`: PASS; 124 static pages generated.
- legacy Sanity contract: 4/4 PASS.
- route release unit contract: 3/3 PASS.
- final SEO output contract: 5/5 PASS.
- sitemap output: 77 URLs, PASS.
- canonical integrity: 0 failures.
- CMS redirect tests: PASS.
- CMS safety scan: PASS.
- deterministic route manifest check: PASS.

Existing raw `<img>` and module-type warnings remain non-blocking construction debt. C4 does not authorize Preview or production. Legal approval, analytics approval, paid attachment entitlement, deployment configuration, rollback and explicit owner release authorization remain C5 gates.
