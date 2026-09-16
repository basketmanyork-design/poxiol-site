# Project form and lead contract

Four intents (`project`, `mockup`, `sample`, `quote`) share one `ProcurementContactForm`. Public entry points are the homepage, `/free-mockup/`, `/sample-order/` and `/get-quote/`. The client serializes one or more editable `products` as JSON plus `intent`, `formType`, `sourcePage`, `originPage`, `entry_product_reference`, a client `submission_key`, required in-hand date, delivery country code, postal status/value, `preferred_contact_method` and contact information. No buyer details are stored in localStorage. Additional Details and the artwork/reference file are optional. The file limit is 10 MB and the accepted extensions are PDF, AI, EPS or common images.

| Buyer input | Rule | Receiving key |
|---|---|---|
| Your Name | Required, bounded length | `fullName` |
| Buyer Type, company/team | Optional | `buyerRole`, `company` |
| Products Needed + quantity + sets/pieces | At least one; each quantity is a positive integer | `products` JSON plus `requested_product` summary |
| Required Delivery Date | Required local calendar date, not in the past | `required_delivery_date` |
| Delivery Country / Region | Required chosen ISO country/territory code | `delivery_country_code` |
| Postal code | Required unless buyer explicitly checks no postal codes | `delivery_postal_code`, `postal_code_status` (`provided` or `not_applicable`) |
| Email or WhatsApp | Buyer selects the preferred method; at least one syntactically valid address/number, with an optional second | `preferred_contact_method`, `email`, `whatsapp` |
| Additional Details, reference file | Optional | `additional_details`, `project_file_1` |

Actual existing receiver in Production configuration: Formspree `https://formspree.io/f/xnpqqnol`. Review build receiver: `https://example.invalid/never-sent`, which cannot store or notify; an unhydrated HTML form falls back to a local POST on this review build. `sendProjectInquiry` treats HTTP 4xx as rejection and 408/5xx/network/timeout as unconfirmed. A 2xx response counts as client acceptance only when the JSON body includes `ok: true` and no non-empty `errors`; opaque provider IDs are shown only if actually returned. Failed/uncertain UI retains the draft and never fires `generate_lead`. The pending button lock blocks same-render duplicate clicks, and an uncertain delivery locks blind resending. “Start another project” creates a fresh client submission key.

The client key is **not** proven provider-side idempotency. Formspree's service-side durable save, field validation, receipt ID, notification delivery, responsible inbox and OKKI mapping were not available for an authorized isolated test. Therefore `FORM_SUBMISSION=PENDING_RECEIVER_VALIDATION`, `LEAD_STORAGE=NOT_TESTED`, `NOTIFICATION=NOT_TESTED`, `OKKI=NOT_CONNECTED_OR_NOT_VERIFIED`, `PRODUCTION_LEAD_CHAIN=NOT_TESTED`. A real receiving contract must verify the Formspree response shape, retrieve a marked test submission, test notification failure without deleting a stored lead, and map duplicate and CRM states before claiming the core chain is complete. No real person was contacted by this review build.
