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
