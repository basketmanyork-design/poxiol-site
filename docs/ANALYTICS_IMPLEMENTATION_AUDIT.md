# POXIOL Analytics Implementation Audit

## Audit result

The production source previously loaded a single Okki analytics script from the root layout. No Google Analytics 4 Measurement ID, Google Tag Manager container, Search Console API credentials, Google Analytics Data API credentials, or authenticated Cloudflare Analytics API access were available in the execution environment. The Okki script has been removed to prevent duplicate analytics systems.

The selected primary implementation is the Google tag (GA4), loaded directly and centrally. It remains fail-closed until a real GA4 Measurement ID is saved in the published `analyticsSettings` singleton and all production environment gates pass.

## Production gates

Analytics loads only when all conditions are true:

- `analyticsSettings.analyticsEnabled` is true.
- `analyticsSettings.ga4Enabled` is true.
- `analyticsSettings.ga4MeasurementId` is a valid `G-...` public identifier.
- `NODE_ENV` is `production`.
- the content source is not `sanity-preview`.
- `CF_PAGES` is `1`.
- `CF_PAGES_BRANCH` is `main`.

Local development, Preview builds, missing configuration, invalid IDs and Sanity request failures all disable analytics. No private token is used in the browser.

## Event model

Implemented events:

- `page_view`
- `form_start`
- `form_submit`
- `generate_lead`
- `whatsapp_click`
- `email_click`
- `free_mockup_click`
- `get_quote_click`
- `file_upload`
- `alibaba_click`
- `product_view`
- `product_category_view`
- `case_study_view`
- `guide_view`

`form_submit` and `generate_lead` fire only after the form endpoint returns success. Duplicate page views and duplicate submission events are suppressed. Event payloads use a strict allowlist and reject values that resemble email addresses or phone numbers. Names, emails, phone numbers, companies, messages, uploaded file names and file contents are never sent to analytics.

## Attribution

First-touch UTM attribution is stored in local storage and session-touch attribution in session storage. The Studio Analytics Operations tool provides deterministic UTM URL generation with presets for Reddit, LinkedIn, Facebook, Instagram, YouTube, TikTok, Alibaba, outreach email and WhatsApp outreach.

## Operations status

| Capability | Status |
| --- | --- |
| Analytics Settings schema | Deployed to the Sanity Schema Registry |
| Centralized GA4 loader | Implemented, disabled until configured |
| Form and CTA tracking | Implemented |
| Content-view tracking | Implemented |
| UTM builder | Implemented in authenticated Studio |
| GA4 live data | Not configured; real Measurement ID is unavailable |
| GA4 Data API dashboard | Not configured; server-side Google credentials are unavailable |
| Search Console verification | Not verified; authenticated property access is unavailable |
| Cloudflare Web Analytics | Not verified through API; Cloudflare API credentials are unavailable |

## Required manual inputs

1. Create or select the real GA4 web data stream for `https://www.poxiol.com/` and publish its `G-...` Measurement ID in `analyticsSettings`.
2. If an aggregated Studio dashboard is required, configure server-only `GA4_PROPERTY_ID`, `GOOGLE_CLIENT_EMAIL` and `GOOGLE_PRIVATE_KEY` in an approved server environment. Never place them in Sanity documents or browser variables.
3. Verify the Search Console property and provide approved read-only API access if automated reporting is required.
4. Verify Cloudflare Web Analytics in the Cloudflare dashboard or provide a read-only API token for automated status checks.

No synthetic analytics data, placeholder Measurement ID, fabricated Search Console result or fabricated traffic metric has been created.