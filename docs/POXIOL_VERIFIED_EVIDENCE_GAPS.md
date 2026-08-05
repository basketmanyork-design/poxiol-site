# POXIOL Verified Evidence Gaps

This register defines what must be verified before a project record, buyer identity, image, testimonial, result, or operational claim is presented as public evidence.

## Current publication rule

- Records without buyer-authorized public evidence remain labeled **Manufacturing Scenario**.
- Unapproved or unavailable project imagery uses **Project imagery pending verification**.
- Buyer names, logos, testimonials, quantities, commercial outcomes, and performance results stay unpublished unless the evidence and public-use approval are recorded.
- Production, shipping, pricing, quality, and issue-resolution statements remain conditional on the buyer-approved project specification and written quotation.

## Evidence still required

| Evidence item | Required verification | Public status until verified |
| --- | --- | --- |
| Buyer identity or organization name | Written buyer approval naming the exact public identifier and permitted channels | Anonymous scenario only |
| Project photography | Source file, project association, ownership or license record, and written public-use approval | Neutral placeholder |
| Buyer testimonial | Original statement, author identity, date, context, and written public-use approval | Omitted |
| Order quantity or production volume | Order record and approval to publish the exact figure | Omitted |
| Delivery or schedule result | Approved order timeline, dispatch or delivery evidence, and approval to publish the exact statement | Omitted |
| Product or quality result | Approved specification plus dated inspection or acceptance record | Process description only |
| Certification or testing statement | Current certificate or report, issuer, scope, validity period, and permission to publish | Omitted |
| Factory capacity or operating history | Current auditable source and approval for the exact wording | Conditional planning language only |
| Country or market coverage | Dated shipment evidence and approval for the exact geographic statement | Global shipping support without counts |
| Refund, replacement, or compensation promise | Approved written commercial policy and applicable conditions | Project-specific resolution language only |

## Evidence record fields

The case-study schema records:

- `buyerAuthorizationStatus`
- `approvedImageStatus`
- `evidenceNote`
- `verifiedProcess`
- `verifiableResultStatement`

A public project is treated as verified only when the project evidence is verified and buyer authorization is explicitly approved for public use. Image approval is evaluated separately.

## Review ownership

Before changing a scenario to a verified public case, the content owner must attach or reference the evidence above, confirm the exact permitted wording, and re-run the buyer-decision, CMS-safety, JSON-LD, image-integrity, and full-output risk checks.