# POXIOL Content Publishing Operations

## Legacy Sanity source

The website reads Sanity project `oqpv1xbc`, dataset `production`, through published GET queries only. Construction does not register new schemas or import the reference application's schema set.

Every response used by public adaptation passes through `content/cms/legacy-public-contract.json`. Recursive fields matching token, secret, password, apiKey, customer, buyerEmail or recipient are rejected. Unrecognized top-level fields are rejected. Invalid optional documents fall back with issue codes only; invalid required site settings or navigation fail with `SANITY_PUBLIC_CONTRACT_REQUIRED`.

## Publishing rules

- Use only approved public fields already consumed by the website.
- Keep draft/preview content out of production builds.
- Never add credentials or private buyer/customer fields to a public projection.
- Do not rely on CMS media as public evidence unless the separate asset and publication policy gates approve it.
- Treat redirects as public content: only published GET results, 301/302 status, unique sources and safe destinations are accepted.
- Re-run `npm run check:legacy-sanity-contract`, `npm run check:cms-redirects`, `npm test` and the prelaunch build after any query or adapter change.

The read-only audit script saves hashes and counts, not Sanity response bodies. It must never be changed to use a token or mutation endpoint during construction.
