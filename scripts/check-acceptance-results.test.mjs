import assert from 'node:assert/strict'
import test from 'node:test'

import {buildCommandRecord, mergeCommandRecords} from '../lib/release/acceptance-results.mjs'

test('records only command evidence and parses TAP/static-page counts', () => {
  const record = buildCommandRecord({
    command: 'npm test',
    durationMs: 1250,
    exitCode: 0,
    output: '# pass 3\n# fail 0\nGenerating static pages (124/124)\nSECRET=must-not-survive',
  })

  assert.equal(record.command, 'npm test')
  assert.equal(record.exitCode, 0)
  assert.equal(record.durationMs, 1250)
  assert.equal(record.passCount, 3)
  assert.equal(record.failCount, 0)
  assert.equal(record.staticPageCount, 124)
  assert.match(record.outputSha256, /^[0-9a-f]{64}$/)
  assert.equal('output' in record, false)
  assert.equal(JSON.stringify(record).includes('must-not-survive'), false)
})

test('replaces a repeated command and keeps records in command order', () => {
  const first = buildCommandRecord({command: 'b', durationMs: 1, exitCode: 1, output: 'old'})
  const second = buildCommandRecord({command: 'a', durationMs: 2, exitCode: 0, output: 'new'})
  const replacement = buildCommandRecord({command: 'b', durationMs: 3, exitCode: 0, output: 'fixed'})
  const records = mergeCommandRecords([first, second], [replacement])

  assert.deepEqual(records.map(({command}) => command), ['a', 'b'])
  assert.equal(records[1].exitCode, 0)
  assert.equal(records[1].durationMs, 3)
})
