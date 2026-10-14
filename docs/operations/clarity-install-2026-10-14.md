# Microsoft Clarity installation candidate — 2026-10-14

## Verified account state

- Clarity project: `POXIOL Website`, URL `https://www.poxiol.com`, project ID `yxe6yo9s3s`.
- Project created in York's existing Google signed-in Clarity account on 2026-10-14.
- Clarity Settings → Setup: default cookies **off**. Settings → Masking: **Strict** (all text masked).
- Ads and GA integrations were left disconnected.

## Candidate site behavior

- The ID is held in the public analytics release record. The Clarity provider was approved by the Owner in this task and is set to `ENABLED` in the candidate release.
- Once its release state is approved and enabled, the script loads only in the production `main` deployment after a visitor chooses **Accept analytics**. The project ID and environment are validated server-side.
- The loader sends Clarity Consent V2 with analytics storage granted and ads storage denied. Rejecting analytics never loads the Clarity script. Changing an accepted choice sends denial and reloads the page to stop the already-loaded recorder.
- The report-only CSP recognizes Clarity script/collection endpoints. This does not weaken an enforcing CSP.

## Owner decision and production activation

The Owner approved the following addition to the **How information is used** section on 2026-10-14:

> If you choose to accept optional analytics, we use Microsoft Clarity to understand how visitors use our website through heatmaps and session recordings. Clarity may collect page interactions and device information. We mask page text and form content in Clarity. You can withdraw your analytics choice at any time using Privacy choices.

Include a link to the [Microsoft Privacy Statement](https://privacy.microsoft.com/en-us/privacystatement) immediately after this paragraph, as Microsoft recommends for Clarity disclosures.

The approved notice and Microsoft Privacy Statement link are in the candidate policy. The canonical local build (`NEXT_PUBLIC_CONTENT_SOURCE=sanity`, `CMS_LEGACY_LIST_MODE=strict`) passed on 2026-10-14, including the route manifest and final 16-read Sanity evidence check. One earlier run failed that final check because the published article-list response changed during the build (43 entries before and after); two subsequent reads matched and the clean rerun passed. The local review build has no production analytics or Formspree configuration and does not demonstrate live behavior.

Next, deploy via the existing Git `main` Cloudflare Pages integration, verify the production privacy notice and consent choices, and confirm no Clarity request before consent and a request for project `yxe6yo9s3s` after **Accept analytics**. Verify withdrawal stops subsequent recording and inspect the Clarity dashboard after processing. Confirm existing form flows without submitting real inquiries. Do not treat local checks or the new Clarity project as proof that production tracking is active.

## References

- Microsoft Clarity manual installation: https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-setup
- Consent V2: https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2
- Masking: https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-masking
