# POXIOL Real Production Upload Guide

## Exact drop location

Place new original files in:

`content/real-production/inbox/`

Do not place originals directly in `public/`. Files in `inbox/` are never rendered by the website.

After human approval, create an optimized derivative in:

`public/real-production/`

Archive the approved original in:

`content/real-production/approved/`

The approved-original folder is evidence storage, not a public website path.

and add one record to:

`content/real-production/manifest/assets.json`

The website renders a record only when the strict publication gate passes. Moving a file or setting one boolean is not enough.

## Required submission metadata

Copy this template for every file:

```text
Asset ID:
Original filename:
Photographer / owner:
Date photographed:
Location:
POXIOL product:
Public website use approved: Yes / No
People visible: Yes / No
People commercial authorization: Yes / No / N/A
Third-party logo visible: Yes / No
Third-party logo authorization: Yes / No / N/A
Customer artwork visible: Yes / No
Customer public-use authorization: Yes / No / N/A
Private label/address/order data visible: Yes / No
Sport:
Category:
Notes:
```

Also attach the original source/ownership record and the name/date of the person approving public use.

## Approval workflow

1. Drop originals and metadata into `content/real-production/inbox/`.
2. Review every face, logo, design, label, document and background detail.
3. Classify as `VERIFIED_POXIOL`, `VERIFIED_BUYER_AUTHORIZED`, `PRODUCT_ONLY_VERIFIED`, `REQUIRES_HUMAN_REVIEW`, or `REJECTED`.
4. Move the approved original to `content/real-production/approved/`; move rejected or unresolved originals to `content/real-production/rejected/`. Keep both outside public paths. Never edit originals destructively to hide a problem.
5. Create a web derivative only after approval and record its width, height, factual Alt, factual caption, intended pages and verification record in `content/real-production/manifest/assets.json`.
6. Run `npm run check:real-production`.
7. Run `node --no-warnings --experimental-strip-types scripts/generate-real-production-approval-summary.mts` and review `content/real-production/manifest/approval-summary.md`.
8. Integrate only records reported as `PUBLISHABLE`; page code does not need redesign.

## Publication rules

- `VERIFIED_POXIOL`: needs a known source/owner, public approval, POXIOL product relationship, complete reviewer record and no unresolved privacy/IP issue.
- `VERIFIED_BUYER_AUTHORIZED`: additionally needs buyer authorization and authorization for every visible person, logo or customer artwork.
- `PRODUCT_ONLY_VERIFIED`: may prove the garment/detail only. Do not describe it as a factory, customer case, buyer project or manufacturing-location image.
- Private information always blocks publication.
- Unknown authorization always blocks the affected media.
- A real image never authorizes an unrelated claim about MOQ, speed, capacity, certification, freight, DDP, ratings or customer counts.

## P0 photo package

### P0-A Finished basketball sample

1. Front.
2. Back.
3. Full jersey-and-shorts set.
4. Alternate/reversible side where genuinely relevant.

Use a clean neutral background. Let the garment fill the frame while preserving all edges. Avoid third-party shoes, logos, buyer data and artificial fabric shaping.

### P0-B Product details

5. Fabric texture.
6. Collar.
7. Stitching/side seam.
8. Print/sublimation detail.
9. Generic or authorized number detail.
10. Waistband.

Capture sharp close-ups with natural light. Do not add labels such as high quality, breathable, best or premium unless separately verified.

### P0-C Sample approval

11. Front/back sample inspection.
12. Measurement check.
13. Design-placement check using sanitized or approved artwork.

Show the check itself. Remove order sheets, messages, names and private specifications.

### P0-D Quality control

14. Measurement action.
15. Stitching/construction inspection.
16. Printed number/name inspection using generic or authorized content.

### P0-E Packing

17. Individual garment packaging.
18. Grouped team-order preparation.

Remove addresses, shipping labels, buyer names, phone numbers, barcodes and order references.

For each shot, provide one horizontal `3:2`/`4:3` original and one vertical `4:5` original where practical. Do not watermark or add promotional overlays.

## P0 smartphone video package

### Video 1 — Basketball Sample Detail

10–20 seconds. Use a steady, slow sequence: front → fabric → collar → print → back. No autoplay, marketing overlay or licensed music is required.

### Video 2 — Random QC Check

15–20 seconds. Show one genuine sequence: measurement → print placement → seam → front/back. Keep private documents out of frame.

### Video 3 — Packing Preparation

10–20 seconds. Show finished garments → individual packing → grouped order. Do not show shipping labels or customer data.

For every approved video, supply a separate verified poster image. The website requires user controls, no autoplay and `preload="none"`.

## Factual writing examples

Good Alt: `Close-up of mesh basketball jersey fabric and finished collar`

Good caption: `Name and number placement checked against the approved layout.`

Reject: `High Quality`, `Premium Factory`, `Best Manufacturer`, `Professional Production`, keyword-stuffed Alt text or guarantees.
