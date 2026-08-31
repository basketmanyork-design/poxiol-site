# POXIOL CSP Reporting Preview Runbook

## Governed state

- Written specification: APPROVED on 2026-08-31.
- Local implementation: VERIFIED; Cloudflare account and deployments remain unchanged.
- Workers Analytics Engine account feature: NOT AUTHORIZED TO ENABLE.
- Preview binding `POXIOL_CSP_REPORTS`: NOT AUTHORIZED TO CREATE.
- Preview dataset `poxiol_csp_preview`: NOT AUTHORIZED TO CREATE.
- Preview branch deployment and synthetic POSTs: NOT AUTHORIZED.
- Production binding, merge, deployment, CSP enforcement and source tightening: OUT OF SCOPE.

## Fixed data contract

| Position | Analytics Engine field | Meaning |
|---|---|---|
| index1 | `${receiverHost}|${effectiveDirective}` | bounded aggregation key |
| blob1 | `v1` | schema version |
| blob2 | `report`, `enforce`, or `unknown` | disposition |
| blob3 | normalized directive | maximum 64 characters |
| blob4 | same-host pathname | maximum 256 characters, no query or fragment |
| blob5 | resource class | `self`, `inline`, `eval`, `data`, `blob`, `external`, or `other` |
| blob6 | external hostname or empty string | maximum 128 characters, no path |
| blob7 | status bucket | `0`, `2xx`, `3xx`, `4xx`, `5xx`, or `unknown` |
| blob8 | receiver hostname | maximum 128 characters |
| double1 | `1` | event count |

Never store or log IP addresses, User-Agent, referrer, cookies, authorization, query strings, fragments, original policy, samples, source paths, line or column numbers, raw bodies, names, email addresses, telephone numbers, form fields, or inquiry content.

## Owner Gate A — account feature and Preview binding

Stop until the owner explicitly authorizes enabling Workers Analytics Engine and creating the Preview-only binding.

After authorization:

1. Open Cloudflare → Workers & Pages → `poxiol-site` → Settings → Bindings.
2. Confirm the selected environment is Preview, not Production.
3. Enable Workers Analytics Engine at account level.
4. Add Analytics Engine binding `POXIOL_CSP_REPORTS` targeting dataset `poxiol_csp_preview` in Preview only.
5. Re-open Production bindings and confirm `POXIOL_CSP_REPORTS` is absent.
6. Do not create an API token or secret.
7. Record the operator, timestamp, Preview binding name, dataset name, and Production absence in the evidence section.

## Owner Gate B — branch Preview deployment and controlled tests

Stop until the owner explicitly authorizes a non-main Preview deployment and controlled synthetic reports. Do not merge to `main`.

After authorization, use the immutable `poxiol-site.pages.dev` branch Preview URL shown by the Cloudflare Pages check. Store it only in the current shell as `POXIOL_PREVIEW_URL`; do not write it into source configuration. Derive and validate the exact receiver hostname before querying:

```powershell
if ([string]::IsNullOrWhiteSpace($env:POXIOL_PREVIEW_URL)) { throw 'POXIOL_PREVIEW_URL is required' }
try {
  $previewUrl = [Uri]$env:POXIOL_PREVIEW_URL
} catch {
  throw 'POXIOL_PREVIEW_URL must be an absolute HTTPS URL'
}
if (-not $previewUrl.IsAbsoluteUri -or $previewUrl.Scheme -ne 'https' -or $previewUrl.UserInfo -or $previewUrl.Port -ne 443) {
  throw 'POXIOL_PREVIEW_URL must be a credential-free HTTPS URL on port 443'
}
$previewHost = $previewUrl.IdnHost.ToLowerInvariant()
if ($previewHost -notmatch '^[a-z0-9](?:[a-z0-9-]{0,62})?\.poxiol-site\.pages\.dev$') {
  throw 'POXIOL_PREVIEW_URL must use the immutable branch Preview hostname'
}
```

Use the resulting `$previewHost` only as the quoted `__VALIDATED_PREVIEW_HOST__` literal below. Do not replace it with a generic `pages.dev` suffix match or an unvalidated URL value.

## Sampling-aware query

Use the Analytics Engine dashboard query surface for dataset `poxiol_csp_preview`:

```sql
SELECT
  blob8 AS receiver_host,
  blob3 AS effective_directive,
  blob4 AS document_path,
  blob5 AS blocked_resource_class,
  blob6 AS blocked_host,
  blob7 AS status_bucket,
  SUM(_sample_interval) AS estimated_reports
FROM poxiol_csp_preview
WHERE timestamp >= NOW() - INTERVAL '1' HOUR
  AND blob8 = '__VALIDATED_PREVIEW_HOST__'
GROUP BY blob8, blob3, blob4, blob5, blob6, blob7
ORDER BY estimated_reports DESC
LIMIT 100
```

If the dashboard cannot perform the query and SQL API access would require a token, stop and request separate approval for a time-bounded `Account Analytics: Read` token. Never paste a token into this file, a workbook, Git, shell history, or chat.

## Synthetic sentinels

Controlled payloads use only these non-personal markers:

- `REMOVE_ME_QUERY`
- `REMOVE_ME_FRAGMENT`
- `REMOVE_ME_REFERRER`
- `REMOVE_ME_SAMPLE`
- `REMOVE_ME_POLICY`
- `REMOVE_ME_AGENT`

The dataset may contain the approved directive, document pathname, resource class, and blocked hostname. It must contain none of the six markers above.

## Preview rollback

1. Remove `Reporting-Endpoints`, `report-to`, and `report-uri` from the branch.
2. Remove Preview binding `POXIOL_CSP_REPORTS`.
3. Redeploy the immediately preceding known-good Preview commit.
4. Sanitized rows age out under Cloudflare's rolling platform-default three-month retention. Removing the binding stops new writes, but does not itself delete `poxiol_csp_preview`; the dataset may remain after the binding is removed unless an approved deletion control is available.
5. Recheck the Preview homepage, `/contact/`, `/get-quote/`, `/free-mockup/`, sitemap, robots, form action, and mobile layout.

## Production no-go boundary

This runbook does not authorize a Production binding, Production dataset, `main` merge, Production deployment, enforcing CSP, source tightening, DNS change, WAF rule, credential, or data deletion. Production requires a new owner decision after every Preview acceptance criterion passes.

## Evidence register

- Local focused tests: PASS; pure module, Function HTTP contract, static header source, and OpenNext regression checks completed.
- Local static build and generated-file inspection: PASS; out/_headers and out/_routes.json match the approved Pages contract.
- Preview binding verification: NOT AUTHORIZED.
- Preview deployment URL and commit: NOT AUTHORIZED.
- Synthetic legacy report: NOT AUTHORIZED.
- Synthetic Reporting API batch: NOT AUTHORIZED.
- Browser-generated report-only violation: NOT AUTHORIZED.
- Sanitized dataset inspection: NOT AUTHORIZED.
- Production unchanged check: NOT RUN.
