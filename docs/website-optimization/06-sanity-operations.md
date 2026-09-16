# Sanity content operations

The existing Studio and production dataset are preserved. V1.1 adds `sitePage.homepageOptimization` to the **homepage** document: hero copy, module headings and a complete nine-item FAQ array. The frontend reads published content through the existing Sanity request policy and falls back to code copy if the document, field or query is unavailable. It rejects overlong/malformed values and uses the FAQ array only when all nine pairs are complete. Product URLs, card images, module order, CTAs and inquiry validation are code-owned. Existing site chrome (email/WhatsApp) continues through `getSiteChrome`.

Operating sequence after the branch and Studio schema are reviewed and deployed:

1. Open the homepage `sitePage` in Studio. Save the current published values and date in the content change log before editing.
2. Replace a heading or FAQ pair, check the commercial claim register in `03-content-and-claims.md`, and save as draft. Do not upload the seven supplied assets to replace verified factory media.
3. Use a separate Sanity preview build or test dataset with the existing preview-token policy to compare the edited page. Current static Production build does not provide a live draft preview to anonymous users.
4. Obtain content approval, publish the approved document and verify that the authorized rebuild/deploy hook finished successfully. Do not run a Production hook while this code version is awaiting York's review.
5. Open the resulting preview/Production URL, verify H1, nine-module order, FAQ count, card links and query/form behavior. A failed rebuild leaves the old static build; investigate logs and retry through the authorized channel.

No Studio edit or webhook was executed during this task. `SANITY_EDIT_PREVIEW=NOT_TESTED`, `SANITY_PRODUCTION_UNCHANGED=PASS_BY_NO_WRITE`, `PUBLISH_WEBHOOK=NOT_TESTED`. To restore content, revert the homepage document to the saved prior Sanity revision or manually restore the prior fields, republish, then run the approved rebuild and verify visible output. Rolling back a code deployment alone does not restore Sanity content. Keep tokens and hooks in secret storage; no secret belongs in this branch or screenshots.
