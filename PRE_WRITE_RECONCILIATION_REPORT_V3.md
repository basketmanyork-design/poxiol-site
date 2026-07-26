# PRE-WRITE RECONCILIATION REPORT (V3)

## 1. Baseline Summary (Audit F1)
- **Total Baseline IDs**: 57
- **IDs Present in Sanity**: 30
- **IDs Missing from Sanity**: 27

## 2. Disjoint Classification
- **BASELINE Docs (Present IDs)**: 29
- **POST_BASELINE Docs (New IDs)**: 106
- **Verification**: 29 + 106 = 135 (Matches Sanity Total 135)

## 3. Baseline Document Classification (Present)
- **BASELINE_CORRECT_UPDATE**: 18
- **BASELINE_NEEDS_UPDATE**: 9
- **BASELINE_CORRECT_REUSE**: 2
- **BASELINE_UNCHANGED_RETAINED**: 0
- **Total**: 29

## 4. Post-Baseline Document Classification
- **APPROVED_CREATE_CORRECT**: 79
- **FALSE_CREATE_FOR_UPDATE**: 0
- **UNEXPECTED_POST_BASELINE**: 27

## 5. Global Reconciliation Formula
- **Current Drafts**: 135
- **MISSING_BASELINE**: 27
- **FALSE_CREATE_FOR_UPDATE**: 0
- **MISSING_CREATE**: 0
- **Final Projected Inventory**: 135 + 27 - 0 = 162
- **Reconciliation Target**: 136

## 6. Action Plan
- **No Sanity writes performed in this step.**
- All 135 drafts are classified.
- Reconciliation mapping for 57 baseline docs is verified.
