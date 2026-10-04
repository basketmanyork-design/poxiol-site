# POXIOL Analytics Operations

## Current governed state

- GA4: `DISABLED_PENDING_APPROVAL`.
- Cloudflare Web Analytics: `DISABLED_PENDING_APPROVAL`.
- Owner/legal approval: pending.
- Production activation: not authorized.

The authoritative local record is `content/privacy/analytics-release.json`. Environment variables and legacy CMS settings cannot override it.

## Visitor flow

1. Static HTML starts with permission `unknown` and loads no optional GA script.
2. `Accept analytics` stores `accepted`; GA may load only if every governed production/runtime gate also passes.
3. `Reject analytics` stores `rejected`, disables event dispatch and removes the POXIOL first-touch and session-touch attribution records.
4. `Change analytics preference` removes the stored choice, disables event dispatch and returns the two choices.
5. If browser storage is denied, the safe in-memory state is `rejected`; navigation, forms, email and WhatsApp continue.

The only permission key is `poxiol.analytics.permission.v1`. The only POXIOL attribution keys cleared on rejection are `poxiol.analytics.first-touch` and `poxiol.analytics.session-touch`.

## Release controls

`prebuild` runs both legal and analytics assertions. The runtime loader additionally requires:

- a completed governed legal record;
- a completed governed analytics release record;
- GA4 enabled in the approved configuration;
- a valid `G-...` measurement ID;
- production mode on Cloudflare Pages `main`;
- non-preview content;
- explicit visitor acceptance.

Cloudflare Web Analytics is controlled in the Cloudflare dashboard rather than by the React preference component. Keep it disabled while either legal or analytics approval is pending. Before activation, record the owner/legal decision, validate dashboard state, update the governed record through review, rebuild the exact release commit, and rerun C3/C5 acceptance.

Never place personal form fields, email addresses, phone numbers, message content, filenames or attachment data in analytics events.

## Google Ads pilot provenance and sample funnel

The public sample form accepts only these bounded campaign values from a POXIOL URL: `gclid`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, and `utm_content`. Values containing email-like or phone-like content, unsupported characters, or more than 100 characters are discarded. Landing and source references must be canonical same-origin paths. Unknown query fields and raw URLs are never copied.

Operational provenance is attached only to a voluntarily submitted inquiry as `ads_*` form fields. It is separate from analytics event parameters and must never include buyer fields, free text, filenames, credentials, payment data, account/customer IDs, or an unredacted external URL. Browser storage is not required for this form path, so unavailable storage and an analytics permission of `unknown` or `rejected` cannot prevent submission.

The browser may emit `sample_form_start` once on the first sample-form edit and `sample_application_submitted` once after the form provider confirms acceptance. Validation failures, HTTP errors, timeouts, network uncertainty, duplicate clicks, and reloads do not create a submission-success event. `qualified_sample_lead` is an offline/manual review outcome and has no browser dispatch helper.

The owner/legal decision for treating GCLID/UTM as consent-independent operational provenance or consent-gated marketing data is still pending. Until the purpose, retention period, access, deletion handling, and cross-border/vendor terms are approved and recorded, Google Ads launch remains blocked. This implementation does not enable GA4, Google Ads tags, or conversion actions.
