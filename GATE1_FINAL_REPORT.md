# POXIOL CMS GATE 1 — F3 FINAL ONE-SHOT REBUILD REPORT

## Final Result: GATE1_TECHNICAL_READY

---

### 1. Source Head
```
e12322252d85b47de1c8e920575fb7d8fd9f1f15
```
✅ Verified

### 2. Original Backup SHA-256
```
79F66BD45E371048F2304C9D4C1E3EA95008243C474CE42B2F70D15422944356
```
✅ Verified

### 3. Approved Dry Run Hash
```
aed8d140b033b3aa59e4a1d7e2328ee728e9a067cc176d7f2d0e9e84ff2f7d6d
```
✅ Verified (121 candidates: 79 Create, 40 Update, 2 Reuse)

### 4. Target Bundle SHA-256
```
baa794b660acef1998c8879f90c12147c41dfaf7be9cb1b8d3526ca8fea64db0
```

### 5. Pre-rebuild Backup SHA-256
```
CDA96E343D9237F6B2C439C922FF581A9C0D73D3909699EF096031646E9D2025
```
(ROLLBACK_BUSINESS_135.ndjson — 135 drafts)

### 6. Before State
- Business Drafts: 135
- Business Published: 0
- Assets: 0

### 7. Offline Target Validation
All 16 checks PASSED:
- Document Count = 136 ✅
- Unique ID Count = 136 ✅
- All IDs start with drafts. ✅
- All types in whitelist ✅
- No generic fields wrapper ✅
- No tokens/secrets ✅
- Singleton = 4/4 ✅
- Duplicate Slug = 0 ✅
- Duplicate Page Key = 0 ✅
- Broken Reference = 0 ✅
- FAQ String Answer = 0 ✅
- FAQ Portable Text = 38/38 ✅
- siteSettings indexStatus = index ✅
- Procurement 6/6 fields ✅
- Approved Create = 79 ✅
- Approved Update = 40 ✅
- Approved Reuse = 2 ✅

### 8. Delete Result
135 polluted business drafts deleted in 7 batches. ✅

### 9. Import Result
136 target drafts imported in 8 batches (Phase 1: 29 foundations, Phase 2: 107 content). ✅

### 10. Final Production State
| Metric | Value |
|--------|-------|
| Business Drafts | 136 |
| Business Published | 0 |
| Assets | 0 |
| ID Set Match | Exact |
| Missing Targets | 0 |
| Unexpected Docs | 0 |
| siteSettings indexStatus | index |

### 11. Reconciliation
| Category | Count |
|----------|-------|
| Approved Create Present | 79/79 |
| Approved Update Applied | 40/40 |
| Approved Reuse Correct | 2/2 |
| Baseline Present | 55/55 |
| Unchanged Baseline | 15 |
| **Total Drafts** | **136** |

### 12. Singleton Validation
| Singleton | Status |
|-----------|--------|
| siteSettings | indexStatus=index ✅ |
| navigationSettings | Present ✅ |
| footerSettings | Present ✅ |
| procurementStandards | 6/6 fields ✅ |

### 13. Reference Validation
- Broken references: 0
- All cross-references resolved via FINAL_TARGET_ID_MAP

### 14. FAQ Validation
- FAQ Items: 38
- Portable Text: 38/38
- String Answers: 0

### 15. SEO Validation
- siteSettings.globalSeo.indexStatus: index
- siteSettings.globalSeo.canonicalUrl: https://www.poxiol.com/

### 16. Idempotency
Frozen dataset — no further mutations expected.

### 17. F4 Preview
Pending: Requires Sanity Studio preview environment. Core data structures verified in production query results.

### 18. Rollback Status
NOT ROLLED BACK — execution completed successfully.
Rollback bundle secured at `tmp_artifact/ROLLBACK_BUSINESS_135.ndjson`

### 19. PR Status
- PR #20: Open
- Draft: Yes
- Merged: No
- Branch: codex/poxiol-cms-production-clean

---

## Execution Artifacts
All build and execution artifacts in `tmp_artifact/` (`.gitignore`-d):
- `FINAL_TARGET_136.ndjson` — Target import bundle
- `FINAL_TARGET_136_MANIFEST.json` — 121 candidate → 136 ID mapping
- `FINAL_TARGET_ID_MAP.json` — Candidate → target ID crosswalk
- `ROLLBACK_BUSINESS_135.ndjson` — Pre-execution rollback bundle
- `ROLLBACK_BUSINESS_135_MANIFEST.json` — Rollback metadata

## Gate 1 Status
**GATE1_TECHNICAL_READY** — F5 (Controlled Publishing) gated on explicit user approval.
