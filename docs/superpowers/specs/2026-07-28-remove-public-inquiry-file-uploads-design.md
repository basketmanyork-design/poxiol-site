# Remove Public Inquiry File Uploads — Design

## Goal

Remove every public file-upload control and attachment submission path from
`ContactForm` and `StructuredRfqForm` while preserving their ordinary text RFQ
submission, validation, analytics, Human Review behavior, and configured contact
fallbacks.

## Scope

The implementation changes only the public inquiry forms and focused regression
tests. It does not alter Sanity Studio media fields, CMS assets, product or case
study images, or any other administrative upload capability.

## Form behavior

Both public forms will:

- contain no `type="file"` input;
- contain no `logoFile`, `referenceFile`, or `techPackFile` field;
- append no attachment to Formspree payloads;
- continue submitting all existing non-file fields through the current endpoint;
- preserve current validation, success/error handling, and Human Review logic;
- display this exact buyer-facing guidance:

  > Have logo, reference design or size-chart files? Submit your inquiry first. After we reply, send the files by email or WhatsApp with your team or brand name.

- render email and WhatsApp links from the existing CMS-derived `publicEmail` and
  `whatsappHref` props. No email address or phone number will be introduced in
  either form.

## StructuredRfqForm changes

- Remove the post-validation loop that copies uploaded `File` values into the
  Formspree payload.
- Remove the three public upload fields.
- Remove the form-local `FileField` component once it has no callers.
- Add the shared guidance beside links derived from `publicEmail` and
  `whatsappHref`.
- Preserve RFQ contract conversion and all ordinary structured fields.

## ContactForm changes

- Remove file state for logo, reference design, and size chart/tech pack.
- Remove attachment appends from the manually constructed Formspree payload.
- Remove the three file inputs and public-upload analytics calls.
- Replace the attachment UI with the shared guidance and links derived from the
  existing `publicEmail` and `whatsappHref` props.
- Preserve all ordinary form fields and the current submission result behavior.

## Testing

A focused source-level regression test will fail if either public form:

- contains `type="file"`;
- contains `logoFile`, `referenceFile`, or `techPackFile`;
- appends known attachment field names to Formspree;
- omits the exact guidance;
- loses use of the configured email or WhatsApp props.

Existing tests, TypeScript checks, the production frontend build, and the Studio
build will also run. The implementation will not submit a real inquiry.

## Delivery constraints

- Commit message: `fix: remove file uploads from public inquiry forms`
- Push normally to `feat/poxiol-geo-aao-foundation`
- No force push
- PR #39 remains Draft
- No merge, Ready for Review transition, or deployment
