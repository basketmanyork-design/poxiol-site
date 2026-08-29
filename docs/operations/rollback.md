# POXIOL Rollback Operations

## Verified stable production reference

The Cloudflare Pages deployment list was inspected read-only on 2026-08-29. The current production row identifies:

- project: `poxiol-site`;
- source branch: `main`;
- production commit: `ae452f70b4a027822fc4340db683746e90653fc1`;
- production deployment ID: `da1e8d5c-5db3-4522-9ee3-79cbbc0774a4`;
- immutable deployment URL: `https://da1e8d5c.poxiol-site.pages.dev`;
- active domains: `poxiol.com`, `www.poxiol.com` and `poxiol-site.pages.dev`.

`construction/rollback-manifest.json` is the machine-readable source. No credential, token or automatic rollback command is stored in it.

## Authorization boundary

Rollback execution is an external production mutation and requires separate, explicit owner authorization at the time of execution. Construction acceptance verifies the target and procedure only; it does not invoke a Cloudflare deployment, rollback, promotion, DNS change or domain reassignment.

After authorization, the operator must verify the exact target deployment ID in Cloudflare, record the currently active candidate deployment, promote or restore only the verified stable deployment, and then check the three active domains, critical inquiry pages, redirects, robots and sitemap. If the target shown in Cloudflare differs from the manifest, stop and regenerate the rollback record before any action.
