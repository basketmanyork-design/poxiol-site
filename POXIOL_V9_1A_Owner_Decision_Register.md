# POXIOL V9.1A Owner Decision Register

Updated: 2026-08-19

These decisions are effective V9 Source of Truth. Stable IDs are implemented in `lib/truth/owner-decisions.ts` and carried into Sanity claim policies and the V9.1A migration plan.

| Stable ID | Owner status | Public truth status | Approved public position | Public restriction |
| --- | --- | --- | --- | --- |
| `CLAIM_FACTORY_RELATIONSHIP` | `OWNER_CONFIRMED_RESTRICTION` | `CONDITIONAL` | `Custom Teamwear Manufacturer`; context alternative: `Teamwear Manufacturing Partner` | Do not publish `Factory Direct` until the legal, manufacturing and site-operator relationship is evidenced. Do not infer trading company, agent or factory owner. |
| `CLAIM_MOQ` | `OWNER_CONFIRMED_CONDITIONAL` | `CONDITIONAL` | `MOQ confirmed by product and project requirements.` | No universal one-set minimum. Product, material, process and project values may override only when confirmed. |
| `CLAIM_TIMELINE` | `OWNER_CONFIRMED_OPERATIONAL_TARGET` | `OPERATIONAL_TARGET` | `Timeline confirmed after artwork, quantity and production requirements are reviewed.` | Mockup, sample and bulk numbers remain internal targets unless separately verified; never present them as guarantees. |
| `CLAIM_SHIPPING` | `OWNER_CONFIRMED_CONDITIONAL` | `CONDITIONAL` | `Shipping options and transit time are confirmed based on destination, shipping method and order requirements.` | No global fixed transit time or guaranteed delivery. |
| `CLAIM_SIZE_TOLERANCE` | `OWNER_CONFIRMED_SEPARATION_REQUIRED` | `CONDITIONAL` | Manufacturing tolerance is checked against the approved product measurement specification. The approved basketball size-chart `±2 cm` may remain in that asset. | A tolerance never creates an automatic return exclusion. Return policy remains `POLICY_REVIEW_REQUIRED`. The approved basketball chart image was not changed. |
| `CLAIM_CERTIFICATION` | `OWNER_CONFIRMED_VERIFICATION_REQUIRED` | `UNVERIFIED` | No public certificate claim at present. | Publication requires holder, name, scope, number or verifiable document, issuer, issue/expiry validity, and relationship to the POXIOL offering. |
| `CLAIM_PROJECT_AUTHENTICITY` | `OWNER_CONFIRMED_CLASSIFICATION` | `UNVERIFIED` until classified | Use one of the six approved authenticity classes. | Do not infer a real customer case from an image, filename or existing marketing label. |

## Project authenticity classes

| Class | Public rule |
| --- | --- |
| `VERIFIED_REAL_PROJECT` | May describe a real project when verification evidence exists. |
| `BUYER_AUTHORIZED_PROJECT` | May publish only inside the buyer-approved scope. |
| `INTERNAL_SAMPLE` | Label as `Sample`, `Product Sample`, or `Development Sample`; never as a customer order. |
| `DEMO` | Label clearly as `Demo`. |
| `SCENARIO` | Label `Example Project Scenario`; no invented customer, order quantity, result or cooperation year. |
| `UNVERIFIED` | Not publishable as case evidence. |

The fresh Production snapshot contains five case-study documents with no approved authenticity or authorization fields. The V9.1A plan classifies all five as `UNVERIFIED` and changes their publish status to draft. Verified real projects: **0**.

## Product/category publication states

| State | Navigation / Products / Sitemap / Linking / SEO rule |
| --- | --- |
| `ACTIVE_VERIFIED` | Eligible for all public consumers. |
| `MANUFACTURABLE_NOT_PROVEN` | May remain in CMS; excluded from strong navigation. Indexing needs a separate quality approval and defaults to noindex. |
| `PLANNED` | Excluded from navigation, sitemap and SEO promotion; defaults to private/noindex. |
| `DISABLED` | Not public. |

Current registry decisions:

- `ACTIVE_VERIFIED`: Basketball, Soccer, Baseball, Training Wear, Hoodies/Jackets.
- `MANUFACTURABLE_NOT_PROVEN`: Team Accessories.
- `PLANNED`: American Football, Esports, Golf, Ice Hockey, Rugby, Running/Marathon, Tennis, Volleyball.
- `DISABLED`: duplicate `soccer-kits` CMS category.

## Evidence closure

Certificate evidence now has structured holder, issuer, number, scope, dates, file and offering-relationship fields. Project evidence can link a project, sample, sport, product and process stage and must carry authorization/public approval. The public evidence filter remains fail-closed.

The nine Production proof slots remain **0 / 9** and `CONTENT_ASSET_REQUIRED`: Design/Artwork; Sublimation/Printing; Cutting; Sewing; Collar/Binding; Measurement QC; Logo/Number QC; Packing; Shipment Preparation. Every future item needs real media, date, context, capability, verification source and public approval. No AI substitute was created.
