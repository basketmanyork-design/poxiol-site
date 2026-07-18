/**
 * Verifies mvp-seed-result.json data integrity.
 * Exit code 0 = all checks passed, 1 = failure.
 */
const fs = require('fs');

const REPORT = 'migration-output/mvp-seed-result.json';

if (!fs.existsSync(REPORT)) {
  console.error('Result file not found:', REPORT);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(REPORT, 'utf8'));
let errors = 0;

function check(name, cond, detail) {
  if (cond) {
    console.log(`  [PASS] ${name}`);
  } else {
    console.error(`  [FAIL] ${name}: ${detail}`);
    errors++;
  }
}

console.log(`\nVerifying MVP Seed Result...\n`);

check('requestTotal ~12', data.requestTotal >= 10 && data.requestTotal <= 15,
  `Got ${data.requestTotal}`);
check('failedTotal === 0', data.failedTotal === 0,
  `Got ${data.failedTotal}`);
check('publishedDocumentsCreated === 0', data.publishedDocumentsCreated === 0,
  `Got ${data.publishedDocumentsCreated}`);
check('duplicateIds === 0', data.duplicateIds === 0,
  `Got ${data.duplicateIds}`);
check('invalidReferences === 0', data.invalidReferences === 0,
  `Got ${data.invalidReferences}`);
check('piiMatches === 0', data.piiMatches === 0,
  `Got ${data.piiMatches}`);
check('secretMatches === 0', data.secretMatches === 0,
  `Got ${data.secretMatches}`);
check('blockedRiskWords === 0', data.blockedRiskWords === 0,
  `Got ${data.blockedRiskWords}`);
check('transactionCommitted === true', data.transactionCommitted === true,
  `Got ${data.transactionCommitted}`);
check('seedPassed === true', data.seedPassed === true,
  `Got ${data.seedPassed}`);
check('authMode === sanity-exec-with-user-token',
  data.authMode === 'sanity-exec-with-user-token',
  `Got ${data.authMode}`);

// Secret leak check
const raw = JSON.stringify(data);
if (raw.includes('token') || raw.includes('skBDA')) {
  check('No token in report', false, 'Token string detected in report');
}

console.log(`\n${errors === 0 ? 'VERIFIED' : 'FAILED'}: ${errors} error(s)\n`);
process.exit(errors === 0 ? 0 : 1);
