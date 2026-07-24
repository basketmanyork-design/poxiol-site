import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const BASE_DIR = process.cwd();
const SUMMARY_PATH = path.join(BASE_DIR, 'docs/CMS_MIGRATION_DRY_RUN_SUMMARY.json');
const SCHEMA_PATH = path.join(BASE_DIR, 'studio/schemaTypes/index.ts');

const originalSummary = fs.readFileSync(SUMMARY_PATH, 'utf8');
const originalSchema = fs.readFileSync(SCHEMA_PATH, 'utf8');

function runPreflight() {
  try {
    execSync('node scripts/check-cms-final-preflight.mjs', { cwd: BASE_DIR, stdio: 'pipe' });
    return true;
  } catch (e) {
    return false;
  }
}

try {
  console.log("Starting CMS preflight self-tests...");

  // Test 1: articleConflictCount=1
  console.log("Testing articleConflictCount=1 failure detection...");
  const s1 = JSON.parse(originalSummary);
  s1.articleConflictCount = 1;
  fs.writeFileSync(SUMMARY_PATH, JSON.stringify(s1, null, 2));
  if (runPreflight()) {
    console.error("FAIL: Preflight should have failed with articleConflictCount=1");
    process.exit(1);
  }

  // Test 2: correctedCandidateCount=120
  console.log("Testing correctedCandidateCount=120 failure detection...");
  const s2 = JSON.parse(originalSummary);
  s2.correctedCandidateCount = 120;
  fs.writeFileSync(SUMMARY_PATH, JSON.stringify(s2, null, 2));
  if (runPreflight()) {
    console.error("FAIL: Preflight should have failed with correctedCandidateCount=120");
    process.exit(1);
  }

  // Test 3: no sitePage in schema
  console.log("Testing missing sitePage failure detection...");
  fs.writeFileSync(SUMMARY_PATH, originalSummary); // restore summary
  const schemaFail = originalSchema.replace('sitePage,', '/* sitePage */,');
  fs.writeFileSync(SCHEMA_PATH, schemaFail);
  if (runPreflight()) {
    console.error("FAIL: Preflight should have failed with missing sitePage");
    process.exit(1);
  }

  console.log("All self-tests passed");
} catch (error) {
  console.error("Self-test runner error:", error);
  process.exit(1);
} finally {
  fs.writeFileSync(SUMMARY_PATH, originalSummary);
  fs.writeFileSync(SCHEMA_PATH, originalSchema);
}
