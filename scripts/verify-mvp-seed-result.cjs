/**
 * Verify the sanitized MVP seed report without inspecting credentials.
 */
const fs = require('fs')

const REPORT = 'migration-output/mvp-seed-result.json'

if (!fs.existsSync(REPORT)) {
  console.error('Result file not found:', REPORT)
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

console.log('\nVerifying MVP Seed Result...\n')

check('requestTotal === 12', data.requestTotal === 12, `Got ${data.requestTotal}`)
check('created + unchanged === requestTotal', data.createdTotal + data.unchangedTotal === data.requestTotal,
  `Got ${data.createdTotal} + ${data.unchangedTotal}`)
check('updatedTotal === 0', data.updatedTotal === 0, `Got ${data.updatedTotal}`)
check('failedTotal === 0', data.failedTotal === 0, `Got ${data.failedTotal}`)
check('all drafts found', data.draftDocumentsFound === data.requestTotal,
  `Got ${data.draftDocumentsFound}`)
check('all draft content matches', data.contentMatches === data.requestTotal,
  `Got ${data.contentMatches}`)
check('publishedDocumentsFound === 0', data.publishedDocumentsFound === 0,
  `Got ${data.publishedDocumentsFound}`)
check('duplicateIds === 0', data.duplicateIds === 0, `Got ${data.duplicateIds}`)
check('invalidReferences === 0', data.invalidReferences === 0, `Got ${data.invalidReferences}`)
check('piiMatches === 0', data.piiMatches === 0, `Got ${data.piiMatches}`)
check('secretMatches === 0', data.secretMatches === 0, `Got ${data.secretMatches}`)
check('blockedRiskWords === 0', data.blockedRiskWords === 0, `Got ${data.blockedRiskWords}`)
check('authMode === repository-secret', data.authMode === 'repository-secret', `Got ${data.authMode}`)
check('failureCode is absent', !data.failureCode, `Got ${data.failureCode}`)
check('seedPassed === true', data.seedPassed === true, `Got ${data.seedPassed}`)

const raw = JSON.stringify(data)
const credentialPattern = /(?:gh[pousr]_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9_-]{20,}|Bearer\s+[A-Za-z0-9._-]{20,})/
check('report contains no credential-shaped value', !credentialPattern.test(raw), 'Credential-shaped value detected')

console.log(`\n${errors === 0 ? 'VERIFIED' : 'FAILED'}: ${errors} error(s)\n`)
process.exit(errors === 0 ? 0 : 1)
