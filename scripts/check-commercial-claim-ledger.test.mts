import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {test} from 'node:test'

import {getApprovedClaimWording} from '../lib/governance/claims.ts'
import {normalizeBuyerFacingFaq} from '../lib/legacy-claim-normalizer.ts'

type LedgerEntry = {
  id?: string
  claim?: string
  source?: string
  sourceDate?: string
  evidenceType?: string
  approvedWording?: string
  publishScope?: string[]
  dynamicOrStatic?: string
  ownerApproval?: {status?: string; approvedBy?: string; approvedAt?: string}
}

const ledger = JSON.parse(readFileSync('content/governance/claim-ledger.json', 'utf8')) as {
  schemaVersion?: number
  claims?: LedgerEntry[]
}

test('the P0 Claim Ledger has one complete approved record per immutable ID', () => {
  assert.equal(ledger.schemaVersion, 1)
  assert.ok(Array.isArray(ledger.claims))
  assert.ok(ledger.claims.length >= 7)
  assert.equal(new Set(ledger.claims.map((entry) => entry.id)).size, ledger.claims.length)

  for (const entry of ledger.claims) {
    assert.match(entry.id || '', /^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    assert.ok(entry.claim?.trim())
    assert.ok(entry.source?.trim())
    assert.match(entry.sourceDate || '', /^\d{4}-\d{2}-\d{2}$/)
    assert.ok(entry.evidenceType?.trim())
    assert.ok(entry.approvedWording?.trim())
    assert.ok(entry.publishScope?.length)
    assert.ok(entry.publishScope?.every((scope) => scope.startsWith('/')))
    assert.ok(['STATIC', 'DYNAMIC_PLATFORM_METRIC'].includes(entry.dynamicOrStatic || ''))
    assert.equal(entry.ownerApproval?.status, 'APPROVED')
    assert.ok(entry.ownerApproval?.approvedBy?.trim())
    assert.match(entry.ownerApproval?.approvedAt || '', /^\d{4}-\d{2}-\d{2}$/)
  }
})

test('runtime claim access returns only the approved order-quantity wording', () => {
  assert.equal(
    getApprovedClaimWording('order-quantity-confirmation'),
    'Order quantity depends on the product format and project requirements. Share the sport, product, estimated quantity and customization needs so the order structure can be confirmed for the quotation.',
  )
  assert.throws(
    () => getApprovedClaimWording('not-a-real-claim' as never),
    /Approved claim not found: not-a-real-claim/,
  )
})

test('MOQ questions and their answers are normalized as one semantic pair', () => {
  assert.deepEqual(
    normalizeBuyerFacingFaq(
      'Does POXIOL support MOQ 1 set?',
      'Yes. POXIOL supports a one-set sample before bulk production.',
    ),
    {
      question: 'How is the order quantity confirmed?',
      answer: getApprovedClaimWording('order-quantity-confirmation'),
    },
  )
})

test('non-MOQ FAQ pairs keep their question while unsafe timing is neutralized', () => {
  assert.deepEqual(
    normalizeBuyerFacingFaq(
      'How fast can a sample be prepared?',
      'Sample production can usually be arranged in 2-3 days after mockup confirmation.',
    ),
    {
      question: 'How is sample timing confirmed?',
      answer: 'Sample timing is confirmed after project review.',
    },
  )
})
