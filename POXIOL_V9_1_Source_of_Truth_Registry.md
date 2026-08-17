# POXIOL V9.1 Source of Truth Registry

Updated: 2026-08-18
Branch: `feature/poxiol-v9-1-truth-foundation`
Release boundary: Draft PR and Preview only. No Production release.

## Status language

| Status | Public meaning |
| --- | --- |
| `VERIFIED` | May be shown only when an approved evidence record supports it. |
| `CONDITIONAL` | May be shown with its condition or range; never as a universal promise. |
| `OPERATIONAL_TARGET` | Internal operating target, not a public guarantee. |
| `UNVERIFIED` | Must not be published as fact. |
| `PLACEHOLDER` | Draft-only value; must not be published. |
| `OWNER_CONFIRMATION_REQUIRED` | Hidden until an owner confirms the fact and supporting evidence. |

The runtime rule is implemented in `lib/truth/claim-policy.ts`. A public value comes only from a `VERIFIED` or `CONDITIONAL` policy, or from a reviewed replacement. Legacy string cleanup remains active while the production Sanity dataset has not been migrated.

## Claim registry

| Claim family | Current public position | Status | Source of truth | Owner action |
| --- | --- | --- | --- | --- |
| Factory ownership / direct factory | POXIOL coordinates custom sportswear sourcing and production; no ownership claim | `OWNER_CONFIRMATION_REQUIRED` | Claim policy + future legal evidence | Confirm legal relationship and permitted wording |
| MOQ | Depends on product, customization, material and order setup | `CONDITIONAL` | Procurement policy | Approve a product-level range before publishing numbers |
| Mockup turnaround | Timing is confirmed after requirements and artwork review | `CONDITIONAL` | Procurement policy | Approve a measured service range if one exists |
| Sample lead time | Confirmed after design, material and specification review | `CONDITIONAL` | Procurement policy | Approve a measured range and scope |
| Bulk production lead time | Confirmed against the approved sample, quantity and current schedule | `CONDITIONAL` | Procurement policy | Approve a measured range and conditions |
| Shipping / delivery time | Depends on destination, method, customs and carrier conditions | `CONDITIONAL` | Procurement policy | Approve lane-specific evidence before adding numbers |
| Production capacity / scale | No public number | `OWNER_CONFIRMATION_REQUIRED` | Future operational evidence | Confirm definition, period and audited record |
| Equipment brands | No named brand claim | `OWNER_CONFIRMATION_REQUIRED` | Future asset/ownership evidence | Confirm equipment identity and right to publish |
| Material composition | Product-specific; no site-wide `100%` claim | `CONDITIONAL` | Product specification + evidence | Attach verified specs per product |
| Quality control | Process language only; no absolute defect-free promise | `CONDITIONAL` | Process documentation + evidence | Approve public SOP evidence |
| Certifications | No certification claim | `OWNER_CONFIRMATION_REQUIRED` | Certificate evidence record | Provide valid certificate, scope, issuer and expiry |
| Returns / after-sales | Evaluated against approved specifications and documented issue evidence | `CONDITIONAL` | Shipping and after-sales policy | Legal/owner review required |
| Project outcomes | Legacy items are labelled `Manufacturing Scenario`, not customer proof | `UNVERIFIED` | Case study registry | Confirm authenticity and buyer permission per case |
| Company history | No founding-year or longevity claim | `OWNER_CONFIRMATION_REQUIRED` | Legal/company records | Confirm legal entity and permitted public wording |
| Unlimited / guaranteed performance | Not used | `UNVERIFIED` | Claim scanner | None unless product-level test evidence exists |

## Content ownership

| Content type | Authoritative fields | Public gate |
| --- | --- | --- |
| Site Page | Sanity page content + `claimPolicies` + `evidenceReferences` | Runtime claim policy and approved evidence filter |
| Product Category | Canonical taxonomy key, canonical URL, navigation/sitemap flags | Published taxonomy entry only |
| Product | Product record, category reference, claim policies, evidence references | Published product and canonical route only |
| Case Study | Case metadata, scenario/authenticity status, evidence references | Real-project status plus buyer publication permission |
| Article | Article record, claim policies, evidence references | Canonical article route and claim policy |
| Procurement Standards | Structured policy objects | `VERIFIED` or `CONDITIONAL` public value only |
| Evidence Record | Caption, date, process stage, capability links, approval fields | `VERIFIED` + `PUBLIC` + `publicUseApproved` and required media metadata |

## CMS migration status

- Public read snapshot: 120 documents in `docs/v9-1/sanity-before.ndjson`.
- Safe plan: 84 revision-guarded patches, 537 field changes, zero deletes.
- Target dataset: `oqpv1xbc / production`.
- Apply status: **not applied**. The available Sanity account cannot see the target project and no approved write token is present.
- Therefore `sanity-after.ndjson` and the applied migration diff do not exist. This is intentional; the site must not claim the CMS is clean until an authorized run succeeds and verification passes.

## Required owner decisions

1. Sanity project access or a narrowly scoped write token for the migration owner.
2. Legal wording for POXIOL's relationship to factories and production partners.
3. Evidence-backed numerical policies for MOQ, samples, production, shipping and capacity.
4. Certification scope and current validity.
5. Authenticity and publication permission for each case study.
6. Whether planned sports and Team Accessories are real public offers.
