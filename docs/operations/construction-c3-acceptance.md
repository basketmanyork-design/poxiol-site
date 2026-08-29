# POXIOL Construction C3 Acceptance

Date: 2026-08-29  
Stage: C3 — inquiry, privacy and analytics closure  
Result: ACCEPTED FOR C4 CONSTRUCTION ONLY  
Deployment performed: false  
Production authorized: false  
Real form submission performed: false

## Accepted implementation

- `4c51f56` — unified the server-owned privacy status on all inquiry forms.
- `19f8714` — added visitor analytics choices with default denial.
- `01258b9` — added governed GA4 and Cloudflare Web Analytics release gates.
- `a6a174e` — reduced the mobile analytics panel so it does not cover acquisition CTAs.
- `ae82638` — made storage read/write denial return the safe `rejected` state without throwing.

The governed legal record remains `PENDING_OWNER_LEGAL_APPROVAL`. The governed analytics record keeps both GA4 and Cloudflare Web Analytics at `DISABLED_PENDING_APPROVAL`; no environment flag can convert those records into approval.

## Inquiry acceptance

The general-question, free-mockup, quote and sample intents all render the same `Draft privacy notice — pending owner and legal approval` status. Existing Formspree protections remain intact:

- endpoint allowlisting and prelaunch environment checks;
- optional attachments with 10 MB per-file validation;
- buyer-entered values and selected files retained after a recoverable failure;
- uncertain receipt locks resubmission and directs the buyer to confirm by email or WhatsApp;
- no automatic retry;
- email and WhatsApp alternatives do not send automatically;
- no external CRM connection is claimed or introduced.

No submit button was activated during browser acceptance and no request was sent to Formspree.

## Analytics acceptance

- Initial static HTML contains `Accept analytics` and `Reject analytics` with no preselected decision.
- Initial static HTML contains no `googletagmanager.com/gtag/js` source.
- Reject keeps the GA script count at zero and exposes `Change analytics preference`.
- Change returns the accept/reject controls and disables the in-memory analytics flag.
- Rejection clears `poxiol.analytics.first-touch` and `poxiol.analytics.session-touch`.
- Storage read/write denial resolves to `rejected` in the executed unit contract and does not throw.
- A temporary local-only enabled fixture started with zero GA scripts, created exactly one `G-POXIOLQA1` script after explicit acceptance, and returned to choice controls after Change.
- The fixture route and dev service were removed before the final build; `out/qa-analytics-fixture` does not exist.
- The final clean static tab contains zero GA scripts and zero console errors/warnings.

Cloudflare dashboard Web Analytics cannot be disabled by this client code. It must remain disabled in the Cloudflare dashboard while the governed analytics record or legal record is pending.

## Automated acceptance

- conversion CTA and form regression suite: PASS;
- project inquiry recovery: 23/23 PASS;
- general inquiry recovery: 11/11 PASS;
- inquiry prelaunch environment suite: 8/8 PASS;
- analytics permission suite: 4/4 PASS;
- analytics optimized-output suite: 2/2 PASS;
- analytics release gate: 5/5 PASS;
- analytics core and integration contracts: PASS;
- `npm run build:prelaunch`: PASS; 124 static pages generated;
- final fixture-route absence check: PASS.

Key optimized-output SHA-256 values:

| Output | SHA-256 |
| --- | --- |
| `out/index.html` | `F92AA4D313910F7950E78564AE2437E10EF107DA7DE0F7F8D117CB24F837A141` |
| `out/contact/index.html` | `CA1105704F5717AD68F562E5E953243EB87C6FFD676266C479217E5DF1C0EE6F` |
| `out/get-quote/index.html` | `40C8BF0A656B07E34F9671AEA6854CB7013B78BF04477AFF362C5A9E3CE634FD` |
| `out/free-mockup/index.html` | `28434D4386CA3BD708522CF1D898C6235B2762E8D9FF9B23435219DF9836DC2F` |
| `out/sample-order/index.html` | `48F92F6B72A702A95194ED3C2BC32BC1E071F3A9706F3DF53747DC171449BF26` |

## Browser acceptance

Desktop checks covered the homepage, `/contact/` and `/get-quote/`. Mobile checks used the 390×844 target on the homepage, `/free-mockup/` and `/sample-order/`.

- General, quote, mockup and sample draft values survived Reject and Change interactions.
- Each form displayed one governed Draft privacy link.
- Project forms retained all three optional file inputs.
- Email and WhatsApp paths remained present.
- No horizontal overflow or clipped preference panel occurred.
- On the effective 375px content width, the final preference panel was about 105px high, used one row for its two buttons and did not overlap `Upload Your Design` or `Build Your Range`.
- The sticky WhatsApp and Get Quote actions remained fully visible.

## Remaining gates

- Owner/legal approval and approved policy wording are still absent.
- Formspree final account ownership and paid attachment entitlement remain an external production gate.
- Cloudflare Web Analytics must be confirmed disabled in the dashboard before Preview or production.
- Production analytics identifiers/events may be validated only after governed approval and separate release authorization.
- Existing raw `<img>` and module-type warnings remain non-blocking construction debt.

C3 acceptance authorizes C4 construction only. It does not authorize Preview, production deployment, analytics activation, a real inquiry test or publication.
