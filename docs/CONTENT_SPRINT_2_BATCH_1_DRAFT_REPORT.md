# Content Sprint 2 — Buyer Knowledge Base Batch 1 Draft Report

Date: 2026-07-30
Sanity project: `oqpv1xbc`
Dataset: `production`

## Safety boundary

- Dataset backup: `C:\Users\baske\poxiol-private-backups\poxiol-production-documents-before-knowledge-batch-1-20260730-003427.ndjson`
- Backup size: `576526` bytes
- Backup SHA-256: `253d07c9bb3303cdce0c0022c0adb30362365130d3b3d45ff4e713b9dcaa68a2`
- Backup verification: PASS (the computed and independently re-read SHA-256 values match)
- Revision Guard preflight: PASS
- Mutation dry-run: PASS for every document before its Draft write
- Publish executed: **NO**
- Seed executed: **NO**
- Dataset Import executed: **NO**
- Asset upload executed: **NO**
- Published document changes: **0**

The native dataset archive export reached the asset-download phase but did not complete. It was stopped without deleting the partial archives. The verified safety baseline above is a raw-perspective, deterministic NDJSON snapshot of all 308 documents, stored outside Git.

## Existing URLs upgraded

| Content | Draft ID | Preserved URL and Canonical | Result |
| --- | --- | --- | --- |
| Custom Basketball Uniform Buying Guide | `drafts.ac118ecd57c74a80` | `https://www.poxiol.com/guides/how-to-order-custom-basketball-uniforms/` | Draft upgraded; Published `_rev` unchanged |
| Custom Soccer Jersey Buying Guide | `drafts.96636fb2fea64bad` | `https://www.poxiol.com/blog/soccer-jersey-buying-guide/` | Draft upgraded; Published `_rev` unchanged |
| Custom Teamwear MOQ and Production Time Guide | `drafts.9f01531eac5844f8` | `https://www.poxiol.com/resources/custom-teamwear-moq-production-time/` | Draft upgraded; Published `_rev` unchanged |

## New Draft documents

| Content | Draft ID | Planned URL |
| --- | --- | --- |
| Custom Teamwear Manufacturer Buying Guide | `drafts.article.custom-teamwear-manufacturer-buying-guide` | `https://www.poxiol.com/guides/custom-teamwear-manufacturer-buying-guide/` |
| Teamwear Quality Control Checklist | `drafts.article.teamwear-quality-control-checklist` | `https://www.poxiol.com/guides/teamwear-quality-control-checklist/` |

No Published base document exists for either new guide.

## Supporting author Drafts

- `drafts.author.poxiol-production-team` — POXIOL Production Team
- `drafts.author.poxiol-quality-control-team` — POXIOL Quality Control Team

These are organization-team identities, not fictional people. No biography, personal credential or avatar claim was added. Article references are weak while the authors remain Draft-only; they must be strengthened only after the author documents are approved for controlled publish.

## Keyword and intent mapping

| Content | Focus keyword | Intent |
| --- | --- | --- |
| Manufacturer Guide | `custom teamwear manufacturer buying guide` | Broad supplier evaluation |
| Basketball Guide | `custom basketball uniform buying guide` | Basketball-specific sourcing |
| Soccer Guide | `custom soccer jersey buying guide` | Soccer-specific sourcing |
| MOQ Guide | `custom teamwear MOQ` | MOQ and approval-dependent production planning |
| QC Checklist | `teamwear quality control checklist` | Quality assurance and pre-shipment review |

Unique title, Meta Description, Canonical, Open Graph title/description and focus keyword checks: PASS.

## Structured content coverage

Each article Draft contains:

- Direct Answer
- Buyer Type
- Key Specifications table
- Procurement Checklist
- Common Mistakes
- Sample Process
- Production Timeline
- Quality Control Process
- Procurement Risk Notes
- Five existing FAQ references
- At least three existing product references
- At least two existing case-study references
- CTA to `/get-quote/` or `/free-mockup/`
- Article schema selection, Breadcrumb-compatible route metadata and FAQPage eligibility
- Last reviewed timestamp and POXIOL team reviewer

Approved procurement values are used consistently:

- Sample MOQ: 1 set
- Sample production: 2–3 working days after mockup approval
- Bulk production: 7–12 working days after sample or artwork approval
- Quality control: inspection before shipment
- Size tolerance: ±2 cm

## Related product references

- `a116b52b29234e52` — Basketball Uniforms Basketball Jerseys
- `6b8199fa3c644add` — Basketball Uniforms Basketball Shorts
- `34811e3aade14fff` — Basketball Uniforms Reversible Jerseys
- `061bfa7135304966` — Basketball Uniforms Full Team Sets
- `2a600b0ffeaf4b10` — Soccer Jerseys Soccer Jerseys
- `ee1aaca7cc114b7d` — Soccer Jerseys Soccer Shorts
- `db33ee8eec054d35` — Team Accessories Team Socks
- `a1631f3f7c894178` — Soccer Jerseys Goalkeeper Kits
- `64a9b79c76a04895` — Training Wear Training Tops

## Related case-study references

- `case-study-case-001`
- `case-study-case-002`
- `case-study-case-003`
- `case-study-case-004`

The guides link to these existing documents but do not repeat customer, result, quantity, schedule or testimonial claims. Their evidence metadata and several existing titles require separate review before the guides can be approved for publication.

## FAQ and internal-link status

- FAQ references: 25 placements across five articles; five per article
- Unique referenced FAQ documents: 17
- FAQ answer risk scan: PASS
- Missing FAQ answers: 0
- Unresolved product/case/FAQ references: 0
- CTA route existence: PASS
- Duplicate target slug: 0
- Duplicate target Canonical: 0

## Validation

| Check | Result |
| --- | --- |
| Manifest tests | PASS (5 tests) |
| Revision-order tests | PASS (3 tests) |
| Sanity read-back validation | PASS |
| Forbidden term scan | PASS |
| Published revision comparison | PASS; all three upgraded Published `_rev` values unchanged |
| Studio TypeScript | PASS |
| Sanity Schema validation | PASS (0 errors) |
| Sanity Studio build | PASS |

## Blocking items before controlled publish

1. The static-export Preview path must read Draft content without making Production dynamic.
2. The frontend Portable Text renderer must visibly render `tableBlock` and warning `callout` content.
3. Preview must verify page content, SEO, Canonical, Breadcrumb, Article JSON-LD and visible-FAQ/FAQPage parity.
4. Case-study evidence metadata and corrupted existing titles need review; the Draft articles intentionally make no claims based on them.
5. Author references must be strengthened after the two author documents are approved and published first.

Ready for editorial and Preview review: **YES**
Ready for controlled publish: **NO — blocked by the items above**
