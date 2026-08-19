# POXIOL V9.1 Proof and Evidence Matrix

Updated: 2026-08-18

## Evidence publication gate

V9.1 adds a reusable evidence record and a strict public filter. An evidence item is public only when all of these are true:

1. `verificationStatus` is `VERIFIED`.
2. `visibility` is `PUBLIC`.
3. `publicUseApproved` is true.
4. Caption, process stage and evidence date are present.
5. At least one related capability is linked.
6. Images include URL and alt text; videos include URL and poster URL.

Site Page, Category, Product, Case Study and Article queries now carry claim-policy and evidence-reference fields. No evidence was invented or converted from marketing copy.

## Baseline coverage

| Area | Current verified public evidence | Gap | Required asset |
| --- | ---: | --- | --- |
| Nine priority production proof slots | 0 / 9 | No approved evidence records | Dated media, caption, process stage, capability link and approval |
| Product records | 0 / 19 with approved proof | Product claims lack attached public evidence | Product specification, material/test record and approved production media |
| Capability areas | 0 / 11 with approved proof | Process claims lack approved proof | SOP extract, dated process media or independent test |
| Case studies | 0 verified customer cases | Five legacy records are scenarios, not proof | Buyer permission, order authenticity and non-sensitive outcome evidence |
| Certifications | 0 verified public certificates | Scope and validity unknown | Certificate file, issuer, holder, scope, issue/expiry dates |

## Priority evidence backlog

| Priority | Capability / claim | Minimum acceptable evidence | Publication rule |
| --- | --- | --- | --- |
| P0 | Factory / production relationship | Legal entity/partner confirmation and approved facility media | Owner and legal approval required |
| P0 | Real project authenticity | Buyer-authorized project record with date and scope | Never infer identity or outcome |
| P0 | Certification | Current certificate with verifiable scope | Hide when expired or out of scope |
| P1 | Material composition | Product-specific supplier/test specification | No site-wide composition claim |
| P1 | Quality control | Dated inspection record tied to process stage | Process description only without approval |
| P1 | Sampling | Dated sample workflow evidence | Do not turn observations into guaranteed lead time |
| P1 | Printing / sublimation | Dated process and output evidence | Describe capability, not unlimited durability |
| P1 | Cut and sew | Dated process media and caption | Avoid ownership/scale inference |
| P1 | Packaging | Approved packaging specification and media | Product/order-specific wording |
| P2 | MOQ | Approved product-level commercial policy | Publish condition/range, never universal minimum |
| P2 | Production capacity | Defined time period plus audited operational record | No number until owner-approved evidence exists |
| P2 | Shipping | Lane/method evidence or reviewed logistics policy | No universal arrival promise |

## Editorial rules

- A photograph proves only what is visible and documented; it does not prove ownership, capacity or customer identity.
- A supplier specification is product-specific unless its scope states otherwise.
- An internal target is not a buyer guarantee.
- Expired, private, draft or unapproved evidence cannot unlock a public claim.
- Removing a risky sentence does not create proof for a replacement claim.

## Owner handoff

The Sanity schema is ready to store evidence records, but no production evidence record was created in this release. The content owner should populate and approve records only after CMS write access is restored. The migration must be applied and independently verified before the legacy render-time claim mask can be retired.
