/** Verify the sanitized, query-only MVP preflight report. */
const fs = require('fs')

const REPORT = 'migration-output/mvp-preflight-result.json'
if (!fs.existsSync(REPORT)) {
  console.error('Preflight report not found:', REPORT)
  process.exit(1)
}

const data = JSON.parse(fs.readFileSync(REPORT, 'utf8'))
let errors = 0

function check(name, condition, detail) {
  if (condition) console.log(`  [PASS] ${name}`)
  else {
    console.error(`  [FAIL] ${name}: ${detail}`)
    errors++
  }
}

console.log('\nVerifying MVP Preflight Result...\n')
check('mode === PREFLIGHT_ONLY', data.mode === 'PREFLIGHT_ONLY', `Got ${data.mode}`)
check('queryOnly === true', data.queryOnly === true, `Got ${data.queryOnly}`)
check('mutationAttempted === false', data.mutationAttempted === false, `Got ${data.mutationAttempted}`)
check('queryCompleted === true', data.queryCompleted === true, `Got ${data.queryCompleted}`)
check('requestTotal === 12', data.requestTotal === 12, `Got ${data.requestTotal}`)
check('existing + missing === requestTotal', data.existingDraftTotal + data.missingDraftTotal === data.requestTotal,
  `Got ${data.existingDraftTotal} + ${data.missingDraftTotal}`)
check('matching + conflicting === existing', data.matchingDraftTotal + data.conflictingDraftTotal === data.existingDraftTotal,
  `Got ${data.matchingDraftTotal} + ${data.conflictingDraftTotal}`)
check('conflictingDraftTotal === 0', data.conflictingDraftTotal === 0, `Got ${data.conflictingDraftTotal}`)
check('publishedRootCollisionTotal === 0', data.publishedRootCollisionTotal === 0, `Got ${data.publishedRootCollisionTotal}`)
check('duplicateIds === 0', data.duplicateIds === 0, `Got ${data.duplicateIds}`)
check('invalidReferences === 0', data.invalidReferences === 0, `Got ${data.invalidReferences}`)
check('piiMatches === 0', data.piiMatches === 0, `Got ${data.piiMatches}`)
check('secretMatches === 0', data.secretMatches === 0, `Got ${data.secretMatches}`)
check('blockedRiskWords === 0', data.blockedRiskWords === 0, `Got ${data.blockedRiskWords}`)
check('failureCode is absent', !data.failureCode, `Got ${data.failureCode}`)
check('preflightPassed === true', data.preflightPassed === true, `Got ${data.preflightPassed}`)

const raw = JSON.stringify(data)
const credentialPattern = /(?:gh[pousr]_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9_-]{20,}|Bearer\s+[A-Za-z0-9._-]{20,})/
check('report contains no credential-shaped value', !credentialPattern.test(raw), 'Credential-shaped value detected')

console.log(`\n${errors === 0 ? 'VERIFIED' : 'BLOCKED'}: ${errors} error(s)\n`)
process.exit(errors === 0 ? 0 : 1)
