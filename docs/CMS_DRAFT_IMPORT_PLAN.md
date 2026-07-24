# CMS Draft Import Plan

## Overview
This document outlines the 6-phase plan for importing content into the CMS. Note: No execution of this plan is performed at this stage.

## Import Phases

### Phase 1: Singletons & Base Documents
- Import `siteSettings`, `navigationSettings`, `footerSettings`, and `procurementStandards`.
- Establish global configuration context.

### Phase 2: Author, FAQ Category, Product Category
- Import foundational reference documents.
- These documents do not depend on other documents but are dependencies for later phases.

### Phase 3: Article, FAQ Item, Product, Case Study, Site Page
- Import main content documents.
- Map fields to existing categories and authors.

### Phase 4: Reference Backfill
- Resolve any circular references or cross-document links that were not available during initial import.

### Phase 5: Preview Acceptance
- Review imported content in the Sanity Studio.
- Verify field mapping and data integrity.

### Phase 6: MVP Draft Handling (After Approval)
- Finalize draft management strategy for existing MVP content.
- Clean up or archive legacy drafts.

## Key Rules & Safety
1. **Draft-Only**: All content must be imported as drafts. No auto-publishing.
2. **No Deletion**: Do not delete existing drafts during the import process.
3. **Backup First**: Perform a full dataset export/backup before each phase.
4. **Validation**: Run validation scripts after every phase to ensure data consistency.
5. **Approval**: Move to next phase only after verification of current phase.
