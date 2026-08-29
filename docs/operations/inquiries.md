# POXIOL Inquiry Operations

## Public paths

| Intent | Route | Form behavior |
| --- | --- | --- |
| General question | `/contact/` | Requires only a question and reply email; name is optional. |
| Free mockup | `/free-mockup/` | Project qualification form with optional attachments. |
| Quote | `/get-quote/` | Project qualification form with optional attachments. |
| Sample | `/sample-order/` | Project qualification form with optional attachments. |

All forms use the environment-configured, allowlisted Formspree endpoint and show the server-owned legal state. While approval is pending, the visible link must remain `Draft privacy notice — pending owner and legal approval`.

## Non-negotiable recovery behavior

- Never retry a submission automatically.
- A confirmed provider rejection retains the draft and permits one deliberate retry.
- A timeout, network ambiguity or server uncertainty locks resubmission and tells the buyer to verify receipt by email or WhatsApp.
- Buyer-entered values and selected files remain on the current page after failure, but are not promised after navigation or refresh.
- Attachments remain optional and are sent only on explicit submission.
- Enforce 10 MB per file before POST.
- Email and WhatsApp links open the buyer's chosen application and do not send automatically.
- Optional analytics failure must never change inquiry success, failure or field state.

## Production prerequisites

- Confirm the final Formspree form belongs to the approved `sales@poxiol.com` account.
- Confirm the deployed environment uses the allowlisted endpoint and contains no retired account endpoint.
- Complete the required paid attachment entitlement before relying on production file delivery.
- Run one separately authorized synthetic end-to-end receipt test on the exact release artifact.
- Confirm the message and every attachment arrive and open, then retain the test reference in the release record.

C3 browser acceptance did not submit a form.
