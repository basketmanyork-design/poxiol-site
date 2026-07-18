============================================================
  POXIOL Stage C1 - External Pre-Import Gate
============================================================

HOW TO RUN
----------
  Double-click: RUN_STAGE_C1_EXTERNAL_GATE.cmd

WHAT HAPPENS
------------
  1. NDJSON integrity is verified (SHA-256 gate)
  2. Existing Sanity login session is checked
  3. If needed, a browser window opens for Sanity OAuth login
     - Complete the login in your browser
     - The script will continue automatically
  4. Pre-import dataset baseline is queried
  5. A full dataset backup is created
  6. Official Sanity Schema Validation runs against the NDJSON
  7. external-gate-result.json is generated

WHAT TO DO AFTER
----------------
  1. Wait for the script to finish
  2. Open: migration-output\run-2026-07-17-03-15-18\external-gate-result.json
  3. Share the following fields with ChatGPT:
     - currentNdjsonSha256
     - datasetBaselineDocuments
     - datasetBaselineDrafts
     - datasetBaselineAssets
     - datasetBackupCompleted
     - datasetBackupSizeBytes
     - datasetBackupSha256
     - sanityDocumentsValidated
     - sanityValidationErrors
     - sanityValidationWarnings
     - validationResultParsingStatus
     - externalGatePassed

IMPORTANT
---------
  - This script does NOT import any data into Sanity
  - This script does NOT create, modify, or delete documents
  - This script does NOT upload assets
  - This script does NOT enable webhooks or deploy hooks
  - Do NOT manually run any data import commands against the production dataset
