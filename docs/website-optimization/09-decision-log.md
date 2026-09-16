# Implementation decision log

| Decision | Evidence / effect |
|---|---|
| Use the deployed `poxiol-site` source, not `poxiol-site-build` | Cloudflare dashboard associates Production `b784069...` with `basketmanyork-design/poxiol-site`. The older build checkout is dirty and was untouched. |
| Create an isolated worktree and preserve seven originals | Protects existing edits and the `最新素材` directory. A repeatable Sharp script creates only derivative WebPs and a byte-identical MP4 copy. |
| Preserve nine modules and make the six cards independent links | Matches the user-approved plan while keeping catalog and older routes. New running/warm-up routes fill otherwise missing card targets. |
| Keep existing Formspree receiver instead of inventing a new backend | Source contains no owned lead service. Client can validate and await a provider response, but cannot prove storage, notifications or OKKI from local UI tests. |
| Preview uses an invalid receiver | Avoids accidental submission to the real POXIOL inbox. It also means a fully accepted browser form cannot be shown on this build; accepted paths are tested with an injected isolated response. |
| Change 2xx handling to require JSON acceptance | Prevents false success from an empty/error body. This may differ from actual Formspree response behavior; contract must be checked before Production. |
| Add bounded Sanity copy/FAQ slots with code fallback | Supports editorial maintenance without allowing content edits to change module order, links, assets or procurement rules. No Sanity write occurred. |
| Navigation now uses five specified groups | Products / Who We Help / Customization / Our Factory / Resources, with a project CTA. Existing OEM/ODM, private label, fabric, QC, shipping and About routes stay linked. |
| Mark release `PARTIAL_BLOCKED` until receiving evidence | Durable provider dedupe, inbox, notification owner and OKKI handoff have not been verified; ad traffic must remain off. |

Practical deviations: the plan envisages a provider-independent durable receipt/dedupe service. This source has only Formspree, so that service was not silently invented. The preview is local until a Git branch build can be created/verified; the authenticated Cloudflare dashboard is visible in Chrome but the local Wrangler CLI is not authenticated. The 390px Chrome screenshot required temporary DevTools emulation because the browser viewport override did not resize the active Chrome tab. One in-app video slider interaction crashed the in-app browser, so that single control interaction is not a site defect conclusion.
