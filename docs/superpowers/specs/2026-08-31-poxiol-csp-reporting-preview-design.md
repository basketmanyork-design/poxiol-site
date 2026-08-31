# POXIOL CSP Reporting Preview Design

Date: 2026-08-31

Status: Owner-approved architecture and three-month sanitized retention; written-spec review required before implementation planning

Environment: design branch only; no Analytics Engine enablement, Cloudflare binding, Preview deployment, production deployment, DNS, Sanity, form-endpoint, credential or account-setting change

## 1. Objective

Turn POXIOL's existing `Content-Security-Policy-Report-Only` header into a measurable security-improvement loop without identifying visitors or risking the live inquiry path.

The first implementation phase must:

1. Receive CSP violation reports at a same-origin Cloudflare Pages Function.
2. discard raw payloads after validation and normalization;
3. write only sanitized technical dimensions to a Preview-only Workers Analytics Engine dataset;
4. prove the full flow in Cloudflare Preview;
5. leave production unchanged until a separate owner approval.

The observation window is 7–14 days after a later production approval. Sanitized Analytics Engine data may remain in Cloudflare for its platform-default three-month retention period, as approved by the owner.

## 2. Verified current state

- The production website is a Next.js static export deployed by Cloudflare Pages from `out/`.
- `public/_headers` is the active source of security headers for Pages static responses.
- `cloudflare-worker.mjs` is used by the separate OpenNext/Worker build path and is not the active request boundary for the Pages production custom domains.
- The current report-only policy has no `report-to` or `report-uri` directive.
- The repository has no Pages Function, CSP report receiver, Analytics Engine binding, D1 database, KV namespace or R2 store for CSP reporting.
- Cloudflare Pages `poxiol-site` has no resource bindings in either Preview or Production.
- Workers Analytics Engine is not currently enabled on the Cloudflare account.
- Cloudflare Pages automatically deploys non-main branches to Preview and automatically deploys `main` to Production.

This design therefore uses a Pages Function, not the currently unbound OpenNext Worker, for the report receiver.

## 3. Approved architecture

Use a same-origin Pages Function at:

```text
POST /__csp-report
```

The Preview environment receives a binding named:

```text
POXIOL_CSP_REPORTS
```

That binding targets a Workers Analytics Engine dataset named:

```text
poxiol_csp_preview
```

The implementation adds `report-to poxiol-csp` and `report-uri /__csp-report` to the report-only policy in `public/_headers`. The same response also declares:

```text
Reporting-Endpoints: poxiol-csp="/__csp-report"
```

The endpoint URI is intentionally relative. The Reporting API resolves it against the response URL, so every Preview deployment reports to its own same-origin endpoint without a new hostname or DNS record.

`report-to` is the standards-aligned mechanism. `report-uri` remains only for compatibility with user agents that have not fully adopted the Reporting API.

## 4. Why Pages Functions is the correct request surface

A root-level `functions/__csp-report.js` file maps only the report receiver route. Static pages continue to be served from `out/`.

Add `public/_routes.json`, copied into `out/`, with only these Function invocation routes:

```json
{
  "version": 1,
  "include": ["/__csp-report", "/__csp-report/"],
  "exclude": []
}
```

This prevents ordinary HTML, image, CSS, JavaScript, sitemap and inquiry-page requests from consuming Pages Functions quota. Only the CSP receiver invokes a Function.

Custom headers in `_headers` apply to static pages but not to Function responses. The receiver therefore sets its own response headers.

## 5. Components and responsibilities

### 5.1 `lib/security/csp-reporting.mjs`

A runtime-neutral module containing pure functions only:

- `parseCspReportPayload({contentType, text})`
- `sanitizeCspReport({report, requestUrl})`
- `buildAnalyticsDataPoint({sanitizedReport, requestUrl})`
- `isSupportedCspReportContentType(contentType)`

This module does not access Cloudflare bindings, environment variables, cookies or network APIs. Unit tests can therefore exercise parsing and privacy behavior without Cloudflare.

### 5.2 `functions/__csp-report.js`

The Pages Function owns the HTTP contract:

- accept approved `POST` requests;
- reject unsupported methods and oversized or malformed payloads;
- pass raw text to the pure sanitizer;
- write sanitized data points through `context.env.POXIOL_CSP_REPORTS`;
- return an empty response without echoing input;
- never log or persist the raw request body.

### 5.3 `public/_headers`

The static header file owns only report delivery configuration. It must keep the current policy non-enforcing and append the two reporting directives without removing existing sources.

### 5.4 `public/_routes.json`

The route manifest limits Function invocation to the receiver route.

### 5.5 Tests and runbook

- `scripts/check-csp-reporting.test.mjs` covers parsing, sanitization and Analytics Engine field construction.
- `scripts/check-csp-pages-function.test.mjs` covers the Function HTTP contract with an in-memory binding stub.
- `scripts/check-security-headers-integration.test.mjs` verifies the report-only header still does not enforce CSP and contains the approved reporting directives.
- `docs/operations/CSP_REPORTING_PREVIEW_RUNBOOK.md` records Cloudflare Preview setup, synthetic verification, query fields, rollback and the production no-go boundary.

## 6. Accepted request formats

The receiver supports the two browser formats needed for compatibility:

1. Reporting API batches:
   - `Content-Type: application/reports+json`
   - top-level JSON array
   - only entries with `type: "csp-violation"` are considered
2. Legacy CSP reports:
   - `Content-Type: application/csp-report`
   - top-level object containing `csp-report`

`application/json` is not accepted. Automated Preview verification must send one of the two browser-compatible content types and shapes above. Unknown shapes produce no data points.

## 7. HTTP safety contract

The endpoint behavior is fixed:

- `POST` with a valid supported payload: `204 No Content`.
- `POST` with valid JSON but no usable CSP entries: `204 No Content` and zero writes.
- malformed JSON: `400 Bad Request`.
- unsupported media type: `415 Unsupported Media Type`.
- payload larger than 16 KiB, measured after reading no more than the allowed limit: `413 Payload Too Large`.
- more than 10 reports in one batch: inspect only the first 10 array entries and ignore the remainder.
- any method other than `POST`: `405 Method Not Allowed` with `Allow: POST`.
- missing Analytics Engine binding: `503 Service Unavailable`, zero raw logging and zero fallback storage.

Every response includes:

```text
Cache-Control: no-store
X-Content-Type-Options: nosniff
```

No CORS header is added. The declared endpoint is same-origin, and the receiver is not a public cross-origin API.

## 8. Data minimization

Raw reports are parsed in memory and discarded. POXIOL application code must not store, log or echo:

- IP addresses;
- `CF-Connecting-IP` or other network identifiers;
- User-Agent;
- cookies or authorization headers;
- referrer;
- query strings or URL fragments;
- `original-policy` / `originalPolicy`;
- script samples;
- source-code excerpts;
- raw `source-file` paths;
- line or column numbers;
- request body text;
- names, email addresses, telephone numbers, form fields or inquiry content.

Only the following normalized fields may be written:

| Field | Rule |
|---|---|
| schema version | fixed value `v1` |
| disposition | `report`, `enforce` or `unknown` |
| effective directive | lowercase `a-z`/hyphen value, maximum 64 characters; otherwise `unknown` |
| document path | pathname only, same-host reports only, maximum 256 characters; query and fragment removed |
| blocked resource class | one of `self`, `inline`, `eval`, `data`, `blob`, `external`, `other` |
| blocked host | lowercase hostname only for `external`; maximum 128 characters; no path/query/fragment |
| status bucket | `0`, `2xx`, `3xx`, `4xx`, `5xx` or `unknown` |
| receiver host | lowercase request hostname, maximum 128 characters |
| count | fixed numeric value `1` |

If `documentURL` / `document-uri` is absent, invalid or not on the receiver host, the report is discarded. This prevents arbitrary third-party document URLs from becoming stored dimensions.

Cloudflare necessarily processes ordinary request metadata, including network addressing, to deliver the Pages Function under the account's existing service and logging settings. This feature adds no application-level capture of that metadata and writes none of it to the CSP Analytics Engine dataset.

## 9. Analytics Engine schema

Each accepted violation produces one data point:

```js
{
  indexes: [`${receiverHost}|${effectiveDirective}`],
  blobs: [
    'v1',
    disposition,
    effectiveDirective,
    documentPath,
    blockedResourceClass,
    blockedHost,
    statusBucket,
    receiverHost,
  ],
  doubles: [1],
}
```

The ordered field contract is documented in the module and runbook. Queries must use `SUM(_sample_interval)` rather than `COUNT()` so Analytics Engine sampling is handled correctly.

The receiver does not promise delivery or exact event reconstruction. CSP Reporting and Analytics Engine sampling make the dataset suitable for trends, top violating directives and regression diagnosis—not billing, security incident proof or individual-user tracing.

## 10. Preview and production isolation

The first Cloudflare change, after the written spec and implementation plan are approved, is limited to Preview:

1. Enable Workers Analytics Engine for the account.
2. Add a Preview-only Analytics Engine binding named `POXIOL_CSP_REPORTS` targeting `poxiol_csp_preview`.
3. Do not add a Production binding.
4. Deploy only a non-main branch through the existing Pages Preview flow.
5. Keep the branch unmerged while Preview validation runs.

The implementation PR must not be merged to `main` as part of Preview preparation. Production requires a separate dataset `poxiol_csp_production`, a separate Production binding, a confirmed rollback point and explicit owner approval.

The source cannot conditionally change `_headers` based on a Cloudflare binding. The Git merge gate is therefore the production safety boundary: the reporting directives remain confined to Preview until the owner approves the production rollout and merge.

## 11. Cloudflare account and credential boundary

Enabling Analytics Engine and creating a binding are account-level external changes. They are not authorized by approval of this written design alone.

No API token, OAuth credential or secret is created, copied into the repository or stored in an environment variable by the implementation.

Preview data should be inspected through the Cloudflare dashboard when the enabled Analytics Engine UI supports the required query. If exact SQL access requires the Analytics Engine SQL API, the owner must separately authorize creation of a time-bounded token limited to `Account Analytics: Read`. The token must never be committed or pasted into the workbook or runbook.

## 12. Abuse and cost controls

The receiver is publicly reachable because browsers must post to it without authentication. The design limits abuse by:

- accepting only one exact route;
- accepting only `POST`;
- limiting the body to 16 KiB;
- limiting processing to 10 usable reports per request;
- rejecting cross-host document URLs;
- normalizing all dimensions to bounded values;
- storing no raw body;
- using Analytics Engine's sampling-aware model;
- excluding all static site routes from Function invocation.

The Preview runbook records total receiver requests and written report counts. If traffic is unexpectedly high, rollback removes the reporting directives and Preview binding. WAF or account-level rate-limiting rules are explicitly out of scope and require separate authorization.

## 13. Header behavior

The implementation must preserve:

- `Content-Security-Policy-Report-Only`, not `Content-Security-Policy`;
- all current source allowances, including the temporary `unsafe-inline` compatibility allowances;
- Formspree form actions;
- Sanity, GA/GTM and Cloudflare Insights connectivity already approved in the current policy;
- the absence of CSP enforcement during the observation phase.

The first phase does not tighten any source list. Reporting observes the current candidate policy only.

## 14. Test-first implementation boundary

Implementation begins with failing tests that prove the current repository lacks:

- a Pages Function at `/__csp-report`;
- both Reporting API and legacy payload parsing;
- privacy-preserving normalization;
- strict size, count, method and content-type handling;
- an Analytics Engine data-point contract;
- Preview reporting headers;
- a route manifest that limits Function invocation.

After the RED result, implement the smallest modules required to pass. Verification must include:

1. focused parser/sanitizer unit tests;
2. Function HTTP tests using a stub binding;
3. existing security-header integration tests;
4. existing Cloudflare/Pages compatibility tests;
5. full static build and route-release checks;
6. inspection of generated `out/_headers` and `out/_routes.json`;
7. Cloudflare Preview deployment only after account/binding authorization;
8. synthetic legacy and Reporting API POSTs containing deliberately removable query/referrer/sample fields;
9. confirmation that stored dimensions contain none of those removed values;
10. a browser-triggered Preview report-only violation;
11. confirmation that normal pages remain static, responsive and free of console errors;
12. confirmation that production headers and deployment remain unchanged.

Cloudflare documents that Analytics Engine bindings cannot be used locally. Local verification therefore uses a deterministic in-memory binding stub; only the authorized Preview deployment proves the real binding.

## 15. Preview acceptance criteria

The Preview implementation is ready for owner review only when:

1. `/__csp-report` accepts both supported browser formats and returns the documented status codes.
2. A synthetic report produces only the approved Analytics Engine fields.
3. Query strings, fragments, referrers, User-Agent, samples, original policy and raw bodies are absent from stored dimensions and logs.
4. More than 10 reports, bodies over 16 KiB, cross-host document URLs and unsupported media types fail safely.
5. `_routes.json` invokes Functions only for the receiver route.
6. The report-only policy includes `Reporting-Endpoints`, `report-to` and compatibility `report-uri` in Preview.
7. No enforced `Content-Security-Policy` header appears.
8. Existing key pages, Formspree actions, sitemap, robots, canonical tags and mobile layouts remain unchanged.
9. A controlled browser violation reaches the Preview dataset.
10. Production has no new binding, no new report endpoint declaration and no deployment from this branch.

## 16. Expected files

Create:

- `functions/__csp-report.js`
- `lib/security/csp-reporting.mjs`
- `public/_routes.json`
- `scripts/check-csp-reporting.test.mjs`
- `scripts/check-csp-pages-function.test.mjs`
- `docs/operations/CSP_REPORTING_PREVIEW_RUNBOOK.md`

Modify:

- `public/_headers`
- `scripts/check-security-headers-integration.test.mjs`
- `package.json`

Other files may be changed only when a focused failing test proves they are required. The unrelated untracked `construction/visual-reviews/category-scenes/` directory must remain untouched and uncommitted.

## 17. Out of scope

- Enforcing CSP.
- Removing `unsafe-inline`.
- Changing allowed Formspree, Sanity, GA/GTM or Cloudflare sources.
- Capturing raw reports or visitor identifiers.
- Creating a dashboard, customer-facing UI or Sanity document type.
- Creating DNS records or a reporting subdomain.
- Creating D1, KV or R2 storage.
- Adding WAF/rate-limiting account rules.
- Creating API tokens or secrets.
- Production Analytics Engine binding or deployment.
- Merging the implementation branch into `main`.

## 18. Rollback

### Preview rollback

1. Remove `Reporting-Endpoints`, `report-to` and `report-uri` from the Preview branch.
2. remove the Preview Analytics Engine binding;
3. redeploy the prior known-good Preview commit;
4. leave the dataset to expire under Cloudflare's default retention unless the account offers an approved earlier deletion control.

### Production rollback, if later approved

Production rollout is a separate phase. Its rollback restores the last known-good Pages production deployment and removes the Production binding. CSP remains Report-Only throughout the observation phase, so reporting failure must never block page rendering or form submission.

## 19. Owner gates after this specification

1. Approve or amend this written specification.
2. approve the implementation plan.
3. authorize enabling Workers Analytics Engine and adding the Preview-only binding.
4. authorize the non-main Preview deployment and controlled synthetic test.
5. after Preview acceptance, separately authorize Production binding, merge and deployment.
6. after 7–14 days of production observation, separately decide whether any CSP source tightening or enforcement work should begin.

## 20. Authoritative references

- Cloudflare Pages Functions routing: https://developers.cloudflare.com/pages/functions/routing/
- Cloudflare Pages custom headers: https://developers.cloudflare.com/pages/configuration/headers/
- Cloudflare Pages Functions bindings: https://developers.cloudflare.com/pages/functions/bindings/
- Cloudflare Analytics Engine limits and retention: https://developers.cloudflare.com/analytics/analytics-engine/limits/
- Cloudflare Analytics Engine pricing: https://developers.cloudflare.com/analytics/analytics-engine/pricing/
- Cloudflare Analytics Engine SQL API: https://developers.cloudflare.com/analytics/analytics-engine/sql-api/
- W3C Content Security Policy Level 3: https://www.w3.org/TR/CSP/
- W3C Reporting API: https://www.w3.org/TR/reporting-1/
