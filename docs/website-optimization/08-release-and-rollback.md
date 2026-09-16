# Release and rollback package

Review branch: `codex/poxiol-website-optimization-v1-1`, based on Production source `b7840691cd176f57ed591961be2ec4413acb6739`. The source architecture stays Next.js 15 static export, React, Sanity and Cloudflare Pages. The existing Cloudflare Pages project is `poxiol-site`, Git-connected to `basketmanyork-design/poxiol-site`, with `main` as its Production branch. The isolated review build deliberately uses `https://example.invalid/never-sent` and local integration origin. This receiver setting must never be promoted to Production.

Before a reviewed Production release:

1. York approves a **specific** commit/preview and confirms card artwork, free mockup/sample policy, FAQ claims and responsive screenshots.
2. Verify Production environment values, Formspree receiving JSON contract, notification owner/backup and OKKI handoff with an authorized isolated test. Preserve existing legal/analytics release records and canonical host.
3. Run the repository's full `npm test` and `npm run build` gates on Node 22 in CI; additionally run V1.1 inquiry tests, route-output and asset-hash checks. Test the preview `X-Robots-Tag: noindex`, and ensure Production does not inherit preview noindex or `.invalid` endpoint.
4. Publish only through the existing approved Cloudflare/Git workflow. Record the new Production deployment ID, commit, launch time and prior successful deployment ID. Conduct a separate authorized Production lead/inbox/CRM test after release; exclude it from real-lead analytics.

Code rollback: in Cloudflare Pages choose the prior successful Production deployment or revert the release commit on `main` and let the approved workflow rebuild. Check canonical, forms, legal/analytics gates, six routes and the old home on the restored deployment. The prior source commit is `b7840691...`, but the exact rollback deployment ID must be captured from the dashboard at release time. New pages may remain in search/caches temporarily; re-check sitemap and redirects. Content rollback: separately restore the prior `sitePage.homepageOptimization` values in Sanity, republish, rebuild and check the visible page. A deployment rollback does not undo Sanity changes or Formspree/CRM records.

Current decision: **no Production publication**. `PRODUCTION_LEAD_CHAIN=NOT_TESTED`, `AD_TRAFFIC_READY=NO`. A review preview with an isolated receiver is a UI/code artifact, not evidence of full production receiving readiness.
