# CMS Phase 2 — Parameter Audit

## Commit: 3266569

### Unified Standards

| Parameter | Canonical Value |
|-----------|----------------|
| MOQ | 1 Set |
| Sample | 2–3 Days After Mockup Confirmation |
| Bulk | 15–25 Days Depending on Order Size |
| Mockup | Free 3D Mockup |
| Shipping | 3–7 Business Days Depending on Country |
| QC | Pre-Shipment Quality Inspection |

### Code Audit

| File | Line | Old Value | New Value | Status |
|------|------|-----------|-----------|--------|
| lib/cms/legacy.ts | 109 | 2–5 days | 2–3 days | ✅ |
| lib/cms/legacy.ts | 118 | 2–5 days | 2–3 days | ✅ |
| lib/seo-data.ts | 30 | 5-7 / 10-20 days | 2-3 / 15-25 days | ✅ |
| lib/seo-data.ts | 67 | 5-7 / 10-20 days | 2-3 / 15-25 days | ✅ |
| lib/guides.ts | 46 | 10-14 / 3-5 days | 15-25 / 3-7 days | ✅ |
| lib/sanity/content.ts | 704,743,769 | 2–5 Days | 2–3 Days | ✅ |

### Sanity Draft Scan
- No "2-5" or "2–5" in any Sanity draft document ✅
- procurementStandards draft: sampleTime "2-3 Days", bulkProductionTime "15-25 Days" ✅

### Conflicts Found: 0 ✅
