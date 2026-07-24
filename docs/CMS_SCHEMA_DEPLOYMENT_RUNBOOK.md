# CMS Schema Deployment Runbook

## Overview
This runbook describes the procedure for deploying Sanity schema changes to the production environment.

## Preconditions Checklist
- [ ] Schema validation passed (`npx sanity@latest schema validate`)
- [ ] TypeScript check passed (`npx tsc --noEmit`)
- [ ] Field alignment audit completed
- [ ] Production dataset backup completed

## Deployment Procedure

### Step 1: Navigate to Studio Directory
```powershell
cd studio
```

### Step 2: Execute Schema Deployment
```powershell
npx sanity@latest schema deploy
```

### Step 3: Verify Deployment
- Log into Sanity Studio (Production).
- Confirm all new/modified types are visible in the sidebar.
- Create a test document (Draft only) to verify field validation.

## Post-Deploy Verification
- Run `scripts/check-cms-schema-coverage.mjs`.
- Check frontend logs for any GROQ query errors related to schema changes.

## Rollback Plan
If critical issues are detected:
1. Revert the schema code changes in the Git repository.
2. Re-deploy the previous known-good schema.
3. Restore dataset from backup if data corruption occurred.
