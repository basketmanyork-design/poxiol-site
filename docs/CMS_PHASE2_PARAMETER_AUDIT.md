# CMS Phase 2 — Parameter Audit

## Runtime Code Head: 11eba9266a7327582da2df33dfa8bde9e9d5aed5
## Preview: https://5ccd9590.poxiol-site.pages.dev (deploy successful)

## Unified Standards

| Parameter | Canonical Value |
|-----------|-----------------|
| MOQ | 1 Set |
| Sample | 2–3 Days After Mockup Confirmation |
| Bulk | 15–25 Days Depending on Order Size |
| Mockup | Free 3D Mockup |
| Shipping | 3–7 Business Days Depending on Country |
| QC | Pre-Shipment Quality Inspection |

## Code Audit (11eba92)

| File | Old Value | New Value | Status |
|------|-----------|-----------|--------|
| lib/cms/legacy.ts:109 | 2–5 days | 2–3 days | ✅ |
| lib/cms/legacy.ts:118 | 2–5 days | 2–3 days | ✅ |
| lib/seo-data.ts:30 | 5-7/10-20 days | 2-3/15-25 days | ✅ |
| lib/seo-data.ts:67 | 5-7/10-20 days | 2-3/15-25 days | ✅ |
| lib/guides.ts:46 | 10-14/3-5 days | 15-25/3-7 days | ✅ |
| lib/sanity/content.ts:704 | 2–5 Days | 2–3 Days | ✅ |
| lib/sanity/content.ts:743 | 2–5 Days | 2–3 Days | ✅ |
| lib/sanity/content.ts:769 | 2–5 Days | 2–3 Days | ✅ |

## Preview Verification

Searching for all conflict values in preview HTML:
- "2–5 days" → 0 occurrences ✅
- "2-5 days" → 0 ✅
- "3–5 days" → 0 ✅
- "5–7 days" → 0 ✅
- "7–12 days" → 0 ✅
- "10–14 days" → 0 ✅
- "10–20 days" → 0 ✅

## Key Pages Verified

| Page | Parameter | Value |
|------|-----------|-------|
| / | Sample | 2–3 Days After Mockup Confirmation |
| / | MOQ | 1 Set |
| /factory/ | Sample | 2–3 days |
| /products/basketball-uniforms/ | Sample | 2–3 Days After Mockup Confirmation |
| /products/soccer-jerseys/ | Sample | 2–3 Days After Mockup Confirmation |
| /faq/ | Sample | 2–3 days |
| /faq/ | Shipping | 3–7 business days |
| /llms.txt | Sample | 2–3 Days After Mockup Confirmation |

## Result: 0 conflicts ✅
