# POXIOL Full-Site Image and Content Semantic Audit

## Production: https://www.poxiol.com | 135 routes | 132 images | 19 Sanity assets | 4 unused

## Confirmed Critical Mismatches

### A. /guides/school-basketball-uniform-order-checklist/ — CRITICAL
- **Page**: School Basketball Uniform Order Checklist
- **Expected visual**: Basketball uniforms
- **Actual image**: Soccer kits (CUSTOM SOCCER KITS, soccer players)
- **Asset**: image-22b3138b93bebaf819ffc7cb7d07d60b14060d07-1672x941-webp
- **Action**: Replace with basketball-specific asset (image-500a7fd38a47376d3b15d737d4b0ffb76f1f0ffb-1672x941-webp)

### B. /products/ — CRITICAL
- **Card**: Soccer Kits
- **Expected visual**: Soccer jersey, shorts, socks
- **Actual image**: Basketball player (image-500a7fd3...)
- **Action**: Replace with image-22b3138b93bebaf819ffc7cb7d07d60b14060d07-1672x941-webp

### C. /products/ — CRITICAL
- **Card**: Training Wear
- **Expected visual**: Training apparel
- **Actual image**: Baseball players/apparel
- **Asset**: image-30a56e521bc0b8b7d496804c179c2d4c363b13ba-1672x941-webp (baseball)
- **Action**: Replace with training-specific or general multi-sport asset

### D. /products/ — HIGH
- **Card**: Team Accessories
- **Expected visual**: Bags, socks, accessories
- **Actual image**: Basketball team group (no visible accessories)
- **Action**: Replace with accessory-appropriate or general asset

### E. /products/ — MEDIUM/HIGH
- **Card**: Hoodies & Jackets
- **Expected visual**: Hoodie or jacket product
- **Actual image**: Design workstation/jersey scene
- **Action**: Replace with apparel/outerwear asset

## Product Category Data Error

| Product | Slug | Current Category | Correct Category |
|---------|------|-----------------|-----------------|
| Custom Soccer Match Kit | custom-soccer-match-kit | Basketball Uniforms | Soccer Jerseys (product-category-soccer-mvp) |

## Cross-Sport Asset Misuse

| Asset | Filename | Sport | Used On |
|-------|----------|-------|---------|
| 22b3138b... | united-field-soccer-kit.webp | soccer | Basketball Uniforms, Basketball guides, Training Wear, Hoodies |
| 500a7fd3... | storm-court-basketball.webp | basketball | Soccer Kits, Volleyball, Hoodies, Training |
| 30a56e52... | falcons-baseball-uniform.webp | baseball | Training Wear, School Multisport |

## Product Media Completeness (19 products)

All 19 products have **primaryImage** set. All 19 products are missing:
- **detailImages**: 0/19
- **productionImages**: 0/19
- **qcImages**: 0/19
- **packagingImages**: 0/19
- **SEO ogImage**: 0/19

## Unused Sanity Assets (4)

Available for reassignment:
- image-6c328b5b... (manufacturing_quality_control.png)
- image-66331267... (manufacturing_quality_control.png — duplicate SHA)
- image-4c177e4e... (qc image)
- image-9c22f0c3... (tournament apparel)

## Summary

| Metric | Count |
|--------|-------|
| Routes checked | 135 |
| Images audited | 132 |
| Confirmed cross-sport mismatches | 5 |
| Product category errors | 1 |
| Products missing gallery media | 19/19 |
| Unused assets | 4 |
| Critical routes requiring fix | 3 |
| High-priority routes | 2 |

**FULL_SITE_IMAGE_CONTENT_AUDIT_COMPLETE**
