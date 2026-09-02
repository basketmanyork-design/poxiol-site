# POXIOL Commercial Seal P0 — Claim Change Report

- Date: 2026-09-02
- Scope: approved Source Gate and P0 only
- Source of truth: `content/governance/claim-ledger.json`

The claim ledger contains seven immutable, owner-approved static records with Claim, Source, Source Date, Evidence Type, Approved Wording, Publish Scope, Dynamic/Static, and Owner Approval.

| Claim ID | Old public risk | New governed behavior | Reason / evidence |
|---|---|---|---|
| `inquiry-information-purpose` | “No external CRM is connected” and profiling status | Buyer information is limited to inquiry review, quotation, sampling and order communication. | Owner-approved P0 wording; internal system state does not belong on the buyer surface. |
| `order-quantity-confirmation` | Order-quantity question could retain a sample answer; “draft procurement standard” leaked | Question and answer are normalized together to project-specific quantity confirmation. | Owner-approved P0 wording; prevents semantic mismatch. |
| `sublimation-comparison` | “Zero Fading”; “never crack, peel, or fade”; “hundreds of washes” | Non-absolute comparison for compatible polyester fabric. | Owner-supplied safe wording; no test evidence supports absolutes. |
| `fabric-review` | Highest-grade/performance guarantees and invented fabric names | Fabric is reviewed by product, construction, intended use, availability and sample. | No approved evidence for the former performance assertions. |
| `decoration-placement-review` | Perfect color/placement implications | Artwork, colors, names, numbers and placement are reviewed before method confirmation. | Project-specific feasibility boundary. |
| `packaging-review` | Perfect arrival, time saving, eco/export-grade and fully-custom availability claims | Packing, grouping, labeling and branding requirements are confirmed during quotation/sample review. | No approved packaging evidence or universal availability record. |
| `private-label-review` | Launch/scale, high-quality, retail-ready, plus empty visual proof slots | Options are confirmed before production; empty proof placeholders removed. | No approved proof for blanket private-label capability claims. |

No factory size, employee, equipment, QC count, certification, sales, rating, delivery, response-time, reorder-rate, or Alibaba dynamic metric was invented or added.
