# POXIOL GEO + AAO Foundation Design

## Goal

Preserve and strengthen POXIOL's existing SEO, AEO, GEO, and trust content while adding a static, machine-readable capability contract and a structured RFQ workflow that always requires human review.

The foundation must help search engines, answer engines, and future procurement agents:

1. identify POXIOL as a custom teamwear manufacturer;
2. compare supported categories, customization, order constraints, production timing, quality controls, and service regions;
3. prepare a request that conforms to a published RFQ schema;
4. submit that request through the existing Formspree-backed website;
5. understand that the submission is an inquiry, not a quote, order, payment, or contractual acceptance.

## Audited Project Constraints

- The storefront is Next.js 14 App Router with `output: "export"`.
- Cloudflare Pages serves the generated `out/` directory.
- There are no Next.js API routes, Server Actions, databases, or server-side email handlers.
- Published content is read from Sanity during static generation, with legacy fallbacks.
- Current inquiry forms submit browser `FormData` to a Formspree endpoint.
- The project already publishes `robots.txt`, `llms.txt`, `brand.json`, `ai-summary.json`, JSON-LD, an AI summary page, and extensive GEO content.
- Existing procurement facts are duplicated across Sanity, legacy content, JSON files, and JSON-LD. Some values conflict.
- `/get-quote/` currently exposes only a no-JavaScript contact fallback plus CMS content; it does not render the full structured form.
- Automatic pricing, payment, order acceptance, and unattended purchasing are out of scope.

## Considered Approaches

### 1. Static capability contract plus structured RFQ page — selected

Publish versioned JSON capability and RFQ contracts under `/.well-known/`, render the human-facing capability and RFQ experience from the same contract, and post structured fields to Formspree. This matches the static architecture, creates stable machine interfaces, and keeps every request subject to manual review.

### 2. Extend only JSON-LD and `llms.txt`

This would improve discovery but would not give procurement agents a stable comparison model or a validated RFQ payload. It does not meet the submission objective.

### 3. Add a Worker-backed RFQ API

This would provide a native JSON API, but it requires a new runtime, authentication, abuse controls, persistence, monitoring, and operational ownership. It is intentionally deferred until POXIOL chooses to operate an authenticated procurement API.

## Architecture

### Canonical AAO contract

`lib/aao/catalog.ts` will hold the typed, versioned capability facts consumed by the website and generators. It will define:

- organization identity and canonical URL;
- contract version and last reviewed date;
- supported buyer types, sports, products, customization methods, and service regions;
- procurement constraints with explicit units and qualification notes;
- quality-control and evidence URLs;
- inquiry action metadata;
- explicit non-capabilities: no automatic quote, payment, or order acceptance.

Human-readable wording may remain in Sanity, but machine-comparable fields will use stable identifiers and explicit units. Claims that vary by project will be marked as estimates requiring confirmation.

### Machine-readable discovery

A deterministic generator will produce:

- `public/.well-known/poxiol-capabilities.json`;
- `public/.well-known/poxiol-rfq-schema.json`;
- `public/.well-known/poxiol-agent.json`.

The agent manifest will link the capability contract, RFQ schema, human RFQ page, contact methods, evidence pages, and the manual-review policy. It will not advertise an unavailable JSON API.

`public/llms.txt`, `public/ai-summary.json`, `public/_headers`, and the sitemap will link to these canonical resources. Existing SEO and GEO pages remain intact.

### Structured RFQ

`/get-quote/` will render the existing CMS page with a new client-side RFQ form. The form will use stable field names aligned with the public JSON Schema:

- request and schema version;
- buyer identity and contact details;
- buyer type and destination country;
- sport, product type, quantity, and quantity unit;
- customization needs;
- target delivery date;
- colors, team or brand name, notes, and optional files;
- consent to manual review and acceptance that the response is not an automatic quote.

Client-side validation will normalize whitespace, validate enumerations, require positive integer quantity, reject past target dates, and create a canonical JSON payload. Submission will include both individual Formspree fields and a serialized `rfqPayload` field so a human can read the email while downstream tools retain structure.

The endpoint remains `NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT`. No endpoint URL or secret will be placed in the public agent manifest.

### Structured data

JSON-LD builders will consume the canonical catalog for organization identity, manufacturing service, offer catalog, and contact action. The invalid `WebSite.SearchAction` will be removed because the site has no search route. Product and FAQ schemas remain page-specific.

The machine contract will use factual, qualified procurement terms. It will not add prices, availability promises, certifications, addresses, or production claims that are not already supported by the audited site.

### CMS

Sanity's procurement singleton will gain structured fields that mirror the public contract where editors need control: MOQ quantity/unit, sample and bulk lead-time ranges, mockup lead-time range, review date, and qualification notes. Existing display strings remain for backward compatibility.

The initial public contract will use reviewed repository defaults. A later phase may generate the contract from published Sanity data during deployment after editorial governance is established.

## Data Flow

1. A developer or editor reviews canonical procurement facts.
2. The deterministic generator validates the catalog and writes public machine assets.
3. Next.js imports the same catalog to render JSON-LD, capability summaries, and RFQ options.
4. A buyer or procurement agent reads the capability and RFQ contracts.
5. The buyer or agent opens `/get-quote/`, supplies schema-aligned fields, and submits.
6. The browser posts multipart `FormData` to Formspree.
7. POXIOL staff manually review the inquiry and respond through the existing sales workflow.

## Error Handling

- Catalog generation fails on invalid versions, duplicate identifiers, missing required evidence URLs, or inconsistent lead-time ranges.
- RFQ validation returns field-specific errors and never submits an invalid payload.
- Missing Formspree configuration produces the existing visible configuration error and preserves email/WhatsApp alternatives.
- Network or non-2xx Formspree responses keep the buyer on the form with a retry message.
- Machine manifests state that submission availability depends on the website form and manual review.

## Testing Strategy

- Node built-in tests cover catalog validation, deterministic asset generation, and manifest links.
- Pure RFQ tests cover normalization, required fields, enumerations, quantity boundaries, date boundaries, and payload serialization.
- A rendered-form contract test verifies that form options and field names come from the published schema rather than duplicated literals.
- Existing TypeScript, CMS checks, preflight self-tests, safety scan, and static build remain required.
- Build-output checks parse the generated JSON assets and confirm `/get-quote/`, discovery links, and manual-review language exist in `out/`.

## Security and Privacy

- Machine files contain only public business facts and public URLs.
- No Formspree endpoint, token, internal email routing, customer data, pricing rules, or confidential production data is published.
- Attachments remain browser-to-Formspree uploads.
- The form will not echo submitted personal data into URLs.
- Every contract and submission states that POXIOL must review and confirm pricing, feasibility, schedule, compliance, and order terms.

## Rollout

1. Add tests and the canonical catalog.
2. Generate and validate the machine assets.
3. Integrate discovery and JSON-LD.
4. Add the structured RFQ form to `/get-quote/`.
5. Extend the Sanity procurement schema without removing existing fields.
6. Run the complete static and CMS verification suite.

The implementation does not deploy, publish Sanity documents, configure Formspree, or enable automated commerce.
