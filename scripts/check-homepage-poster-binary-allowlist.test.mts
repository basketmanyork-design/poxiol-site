import assert from 'node:assert/strict'
import {createHash} from 'node:crypto'
import {mkdirSync, mkdtempSync, rmSync, writeFileSync} from 'node:fs'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {auditBinaryAllowlist} from './check-cms-binary-allowlist.mts'

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const POSTER = 'public/images/poxiol-teamwear-range-banner-2x1.webp'
const root = mkdtempSync(join(ROOT, '.cms-poster-test-'))
const put = (path: string, content: string | Buffer) => {
  const target = join(root, path)
  mkdirSync(dirname(target), {recursive: true})
  writeFileSync(target, content)
}

try {
  const approved = Buffer.from('approved homepage poster')
  const record = {
    assetId: 'ILL-TEAMWEAR-003-MOBILE',
    path: '/images/poxiol-teamwear-range-banner-2x1.webp',
    sha256: createHash('sha256').update(approved).digest('hex'),
    classification: 'ILLUSTRATION_NON_PROOF',
    allowedUse: 'teamwear-illustration',
    thirdPartyMarkReview: 'PASS',
    poxiolMarkReview: 'PASS_RETAINED',
    reviewSource: 'OWNER-APPROVED-2026-10-21-PAGESPEED-REENCODE',
  }
  const saveRecord = (value: object) => put('content/release/asset-allowlist.json', JSON.stringify([value]))
  put(POSTER, approved)
  saveRecord(record)
  assert.equal(auditBinaryAllowlist(root, [POSTER]).passed, true)
  assert.equal(auditBinaryAllowlist(root, ['public/images/other.webp']).passed, false)
  put(POSTER, 'different bytes')
  assert.match(auditBinaryAllowlist(root, [POSTER]).errors.join(' '), /digest mismatch/)
  put(POSTER, approved)
  saveRecord({...record, reviewSource: 'UNAPPROVED'})
  assert.equal(auditBinaryAllowlist(root, [POSTER]).passed, false)
  console.log('Homepage poster binary allowlist checks passed')
} finally {
  rmSync(root, {recursive: true, force: true})
}
