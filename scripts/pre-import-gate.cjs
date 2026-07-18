'use strict';
const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');

// ── Arg guard (Task IV) ───────────────────────────────────────────────────────
const runDirArg = process.argv.find(a => a.startsWith('--run-dir='))?.split('=').slice(1).join('=');
if (!runDirArg) {
  console.error('Usage: node scripts/pre-import-gate.cjs --run-dir=migration-output/run-YYYY-MM-DD-HH-MM-SS');
  process.exit(1);
}

const ROOT    = path.resolve(__dirname, '..');
const BASE    = path.resolve(ROOT, runDirArg);
const RUN_ID  = path.basename(BASE);

if (!fs.existsSync(BASE)) { console.error(`Directory not found: ${BASE}`); process.exit(1); }

const PII_LIST = ['Delfina','Lucia Moniz','Henry Martin','Tahir Godett','David Francois'];

// 13 files tracked inside integrity manifest (Task V)
const INTEGRITY_TRACKED = [
  'content-drafts.ndjson','source-mapping-report.json','assets-manifest.json',
  'references-report.json','url-report.json','privacy-report.json',
  'validation-report.json','seo-review-report.json','risk-words-report.json',
  'skipped-records.json','deferred-records.json','migration-summary.json',
  'source-coverage-report.json',
];
// 14th: integrity manifest itself (hashed externally here)
const MANIFEST_FILE    = 'file-integrity-report.json';
// 15th: Sanity official validation (external, required for final approval)
const SANITY_VAL_FILE  = 'sanity-schema-validation.json';

function h(p) { return crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'); }

async function main() {
  const result = {
    runId: RUN_ID, timestamp: new Date().toISOString(),
    requiredFilesExpected: 14, requiredFilesFound: 0,
    integrityManifestSelfSha256: null,
    // balances
    sourceBalanceValid: null, seedBalanceValid: null,
    unassignedSourceRecords: null, multiStatusSourceRecords: null, duplicateSourceRecordKeys: null,
    // counts
    ndjsonRecords: 0, drafts: 0, published: 0,
    duplicateIds: 0, invalidReferences: 0, urlConflicts: 0, faqPublicRoutes: 0,
    piiRemaining: 0, secretRemaining: 0,
    blockedRiskWords: 0, warningRiskWords: 0,
    localValidationErrors: 0, localValidationWarnings: 0,
    seoNeedsReview: 0, altNeedsReview: 0,
    sanitySchemaValidationPresent: false, sanitySchemaValidationErrors: null, sanitySchemaValidationWarnings: null,
    exitCode: 0,
  };

  let errors = 0;
  const fail = msg => { console.error(`  [FAIL] ${msg}`); errors++; };
  const pass = msg => console.log(`  [PASS] ${msg}`);
  const warn = msg => console.warn(`  [WARN] ${msg}`);

  console.log(`\n┌─ POXIOL Pre-Import Gate  [${RUN_ID}] ─────────────────┐\n`);

  // ── 1. Integrity manifest (14th file, hashed externally) ─────────────────
  const mPath = path.join(BASE, MANIFEST_FILE);
  if (!fs.existsSync(mPath)) { fail(`${MANIFEST_FILE} missing`); process.exit(1); }

  result.integrityManifestSelfSha256 = h(mPath);
  pass(`${MANIFEST_FILE} exists  self-sha256: ${result.integrityManifestSelfSha256}`);

  const mData = JSON.parse(fs.readFileSync(mPath,'utf8'));
  const mFiles = mData.files || [];

  // ── 2. Check 13 tracked files ─────────────────────────────────────────────
  let found = 0;
  INTEGRITY_TRACKED.forEach(fname => {
    const p = path.join(BASE, fname);
    if (!fs.existsSync(p)) { fail(`Missing: ${fname}`); return; }
    found++;

    const actual = h(p);
    if (!/^[0-9a-f]{64}$/.test(actual)) { fail(`Bad hash format: ${fname}`); }

    const entry = mFiles.find(e => e.filename === fname);
    if (!entry)               { fail(`Not in manifest: ${fname}`); }
    else if (entry.sha256 !== actual) { fail(`Hash mismatch: ${fname}`); }
    else pass(`${fname}  ${entry.sizeBytes}B  sha256 OK`);

    const content = fs.readFileSync(p,'utf8');
    PII_LIST.forEach(n => { if(content.toLowerCase().includes(n.toLowerCase())){fail(`PII in ${fname}: "${n}"`); result.piiRemaining++;} });
    if(/bearer|api.?key|token|password|secret/i.test(content)){fail(`Secret in ${fname}`); result.secretRemaining++;}
  });
  result.requiredFilesFound = found + 1;  // +1 for manifest itself

  // ── 3. NDJSON audit ───────────────────────────────────────────────────────
  const ndjsonPath = path.join(BASE,'content-drafts.ndjson');
  const lines = fs.readFileSync(ndjsonPath,'utf8').split('\n').filter(l=>l.trim());
  result.ndjsonRecords = lines.length;

  const seen = new Set();
  lines.forEach((line,i) => {
    let doc; try { doc=JSON.parse(line); } catch { fail(`Bad JSON line ${i+1}`); return; }
    if(!doc._id) { fail(`Line ${i+1}: no _id`); return; }
    if(!doc._type){ fail(`Line ${i+1}: no _type`); return; }
    if(doc._id.startsWith('drafts.')) result.drafts++;
    else { fail(`Non-draft: ${doc._id}`); result.published++; }
    if(seen.has(doc._id)){ fail(`Dup _id: ${doc._id}`); result.duplicateIds++; } seen.add(doc._id);
    if(doc._type==='faqItem'&&doc.resolvedPath){ fail(`faqItem public route: ${doc._id}`); result.faqPublicRoutes++; }
  });

  // ── 4. Summary stats + balance assertions (Task VIII) ────────────────────
  const sum = JSON.parse(fs.readFileSync(path.join(BASE,'migration-summary.json'),'utf8'));

  // source balance
  const srcSum = sum.generatedSourceTotal + sum.deferredSourceTotal + sum.skippedSourceTotal + sum.mergedSourceTotal + sum.rejectedSourceTotal;
  result.sourceBalanceValid = (srcSum === sum.extractedSourceTotal);
  if (!result.sourceBalanceValid) fail(`Source balance broken: ${srcSum} ≠ ${sum.extractedSourceTotal}`);
  else pass(`Source balance OK: ${srcSum} = ${sum.extractedSourceTotal}`);

  // seed balance
  const seedSum = sum.generatedSeedTotal + sum.deferredSeedTotal;
  result.seedBalanceValid = (seedSum === sum.seedDocumentsTotal);
  if (!result.seedBalanceValid) fail(`Seed balance broken: ${seedSum} ≠ ${sum.seedDocumentsTotal}`);
  else pass(`Seed balance OK: ${seedSum} = ${sum.seedDocumentsTotal}`);

  Object.assign(result, {
    invalidReferences:  sum.invalidReferences,
    urlConflicts:       sum.urlConflicts,
    faqPublicRoutes:    Math.max(result.faqPublicRoutes, sum.faqPublicRoutes),
    blockedRiskWords:   sum.blockedRiskWords,
    warningRiskWords:   sum.warningRiskWords,
    seoNeedsReview:     sum.seoNeedsReview,
  });

  // ── 5. Source coverage check (Task III) ──────────────────────────────────
  const covPath = path.join(BASE,'source-coverage-report.json');
  if (fs.existsSync(covPath)) {
    const cov = JSON.parse(fs.readFileSync(covPath,'utf8'));
    const unassigned = cov.filter(r=>!r.finalStatus || r.finalStatus==='null');
    const keySet = new Set(); let dupKeys=0;
    cov.forEach(r=>{ if(keySet.has(r.sourceRecordKey))dupKeys++; else keySet.add(r.sourceRecordKey); });
    result.unassignedSourceRecords = unassigned.length;
    result.multiStatusSourceRecords = 0;  // not tracked per record currently
    result.duplicateSourceRecordKeys = dupKeys;
    if (unassigned.length) fail(`Unassigned source records: ${unassigned.length}`);
    else pass(`Coverage: all source records assigned`);
    if (dupKeys) fail(`Duplicate source record keys: ${dupKeys}`);
    else pass(`Coverage: no duplicate source keys`);
  }

  // ── 6. Sanity official validation (15th, optional) ───────────────────────
  const svPath = path.join(BASE, SANITY_VAL_FILE);
  if (fs.existsSync(svPath)) {
    const sv = JSON.parse(fs.readFileSync(svPath,'utf8'));
    result.sanitySchemaValidationPresent  = true;
    result.sanitySchemaValidationErrors   = sv.validationErrors ?? sv.errors ?? null;
    result.sanitySchemaValidationWarnings = sv.validationWarnings ?? sv.warnings ?? null;
    if (result.sanitySchemaValidationErrors > 0) fail(`Sanity Schema Errors: ${result.sanitySchemaValidationErrors}`);
    else pass(`Sanity official validation: PASSED`);
  } else {
    warn(`sanity-schema-validation.json absent — required before final approval`);
  }

  // ── 7. Hard gate checks ───────────────────────────────────────────────────
  console.log('\n── Hard Gate Results ──────────────────────────────────────────────');
  [
    ['requiredFilesFound === 14',    result.requiredFilesFound === 14],
    ['ndjsonRecords > 0',            result.ndjsonRecords > 0],
    ['published === 0',              result.published === 0],
    ['duplicateIds === 0',           result.duplicateIds === 0],
    ['invalidReferences === 0',      result.invalidReferences === 0],
    ['urlConflicts === 0',           result.urlConflicts === 0],
    ['faqPublicRoutes === 0',        result.faqPublicRoutes === 0],
    ['piiRemaining === 0',           result.piiRemaining === 0],
    ['secretRemaining === 0',        result.secretRemaining === 0],
    ['blockedRiskWords === 0',       result.blockedRiskWords === 0],
    ['sourceBalanceValid === true',  result.sourceBalanceValid === true],
    ['seedBalanceValid === true',    result.seedBalanceValid === true],
  ].forEach(([name,ok]) => { if(ok) pass(name); else fail(name); });

  // ── 8. Verdict ────────────────────────────────────────────────────────────
  result.localValidationErrors = errors;
  result.exitCode = errors > 0 ? 1 : 0;

  fs.writeFileSync(path.join(BASE,'pre-import-gate-result.json'), JSON.stringify(result,null,2));
  console.log(`\nResult saved: ${path.join(BASE,'pre-import-gate-result.json')}`);

  if (errors===0) {
    console.log('\n┌──────────────────────────────────────────────┐');
    console.log('│  [SUCCESS] ALL LOCAL GATES PASSED            │');
    console.log('│  Awaiting: Dataset backup + Sanity validation │');
    console.log('└──────────────────────────────────────────────┘\n');
    process.exit(0);
  } else {
    console.error(`\n[FAILED] ${errors} blocking issue(s)\n`);
    process.exit(1);
  }
}

main().catch(e=>{console.error(e);process.exit(1);});
