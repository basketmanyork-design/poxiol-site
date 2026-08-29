# Public image release rules

Files under `public/images` are not automatically approved for public use.
The final release authority is `content/release/asset-allowlist.json`, which pins
each reviewed path and SHA-256 digest together with its permitted use.

The POXIOL teamwear hero is an illustration, not customer, factory, quality,
delivery or production evidence. It may retain the POXIOL wordmark and must not
gain any third-party brand mark, club crest or logo-like decoration.

Legacy image directories remain present for repository history and local audit.
They must not be restored to a public page unless a new governed review adds the
exact binary hash and use scope to the release allowlist.

The nine files under `public/real-production/POXIOL-RP-001` are the only assets
classified as evidence. Their approved scope is limited to basketball product
detail; they are not factory, process, QC, customer-project, delivery, reorder or
sample-to-bulk evidence.
