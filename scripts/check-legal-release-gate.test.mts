import assert from 'node:assert/strict'
import {existsSync, readFileSync} from 'node:fs'
import path from 'node:path'
import {spawnSync} from 'node:child_process'
import test from 'node:test'
import {pathToFileURL} from 'node:url'

const root = process.cwd()
const legalModulePath = path.join(root, 'lib/legal-release.ts')
const approvalPath = path.join(root, 'content/legal/approval.json')
const gateScriptPath = path.join(root, 'scripts/assert-legal-release-ready.mts')
const outputMode = process.argv.includes('--output')
const pendingNotice = 'Draft policy — pending owner and legal approval.'
const legalRoutes = ['/privacy-policy/', '/terms/', '/intellectual-property-policy/']
const pendingApproval = {
  schemaVersion: 1,
  status: 'PENDING_OWNER_LEGAL_APPROVAL',
  approvedAt: null,
  approvedBy: null,
  approvalBasis: 'Pending fixture',
}
const approvedApproval = {
  schemaVersion: 1,
  status: 'APPROVED',
  approvedAt: '2026-08-30',
  approvedBy: 'POXIOL legal representative',
  approvalBasis: 'Approved fixture',
}

async function loadLegalModule() {
  assert.equal(existsSync(legalModulePath), true, 'Missing governed legal-release module')
  return import(pathToFileURL(legalModulePath).href)
}

function isolatedEnvironment(overrides: Record<string, string> = {}) {
  const environment = {...process.env}
  for (const key of ['POXIOL_DEPLOYMENT_ENV', 'CF_PAGES_BRANCH', 'CF_PAGES', 'POXIOL_LEGAL_APPROVED']) delete environment[key]
  return {...environment, ...overrides}
}

test('the governed record contains a complete owner approval', async () => {
  assert.equal(existsSync(approvalPath), true, 'Missing governed legal approval record')
  const approval = JSON.parse(readFileSync(approvalPath, 'utf8'))
  assert.equal(approval.status, 'APPROVED')
  assert.equal(approval.approvedAt, '2026-08-30')
  assert.equal(approval.approvedBy, 'POXIOL legal representative')
  assert.match(approval.approvalBasis, /approved the existing English Privacy Policy, Terms of Service, and Intellectual Property Policy/i)
})

test('a pending or incomplete record cannot be promoted by production or a forged environment flag', async () => {
  const legal = await loadLegalModule()
  assert.equal(legal.legalPolicyApproved(pendingApproval), false)
  assert.equal(legal.legalPolicyApproved({...approvedApproval, approvedBy: null}), false)
  assert.equal(legal.legalPolicyApproved({...approvedApproval, approvedAt: null}), false)
  assert.equal(legal.legalPreviewAllowed({POXIOL_DEPLOYMENT_ENV: 'local'}, pendingApproval), true)
  assert.equal(legal.legalPreviewAllowed({CF_PAGES: '1', CF_PAGES_BRANCH: 'codex/construction-completion'}, pendingApproval), true)
  assert.equal(legal.legalPreviewAllowed({POXIOL_LEGAL_APPROVED: 'true'}, pendingApproval), false)
  assert.throws(() => legal.assertLegalReleaseReady({POXIOL_LEGAL_APPROVED: 'true'}, pendingApproval), /LEGAL_APPROVAL_REQUIRED:privacy,terms,ip/)
})

test('pending policies stay private while a complete approval publishes final policies', async () => {
  const legal = await loadLegalModule()
  assert.deepEqual(legal.publicLegalPolicyRoutes(pendingApproval), [])
  assert.deepEqual(legal.legalPolicyMetadata(pendingApproval), {robots: 'noindex, nofollow, noarchive'})
  assert.equal(legal.legalDraftNotice(pendingApproval), pendingNotice)
  assert.deepEqual(legal.publicLegalPolicyRoutes(approvedApproval), legalRoutes)
  assert.deepEqual(legal.legalPolicyMetadata(approvedApproval), {})
  assert.equal(legal.legalDraftNotice(approvedApproval), '')
})

test('the executable release assertion permits production only with the governed approval', () => {
  assert.equal(existsSync(gateScriptPath), true, 'Missing executable legal release assertion')
  const production = spawnSync(process.execPath, ['--no-warnings', '--experimental-strip-types', gateScriptPath], {
    cwd: root,
    env: isolatedEnvironment({POXIOL_DEPLOYMENT_ENV: 'production'}),
    encoding: 'utf8',
  })
  assert.equal(production.status, 0, production.stderr)
  assert.match(production.stdout, /Approved legal-policy release record verified/)

  const forged = spawnSync(process.execPath, ['--no-warnings', '--experimental-strip-types', gateScriptPath], {
    cwd: root,
    env: isolatedEnvironment({POXIOL_LEGAL_APPROVED: 'true'}),
    encoding: 'utf8',
  })
  assert.equal(forged.status, 0, forged.stderr)
  assert.match(forged.stdout, /Approved legal-policy release record verified/)

  const local = spawnSync(process.execPath, ['--no-warnings', '--experimental-strip-types', gateScriptPath], {
    cwd: root,
    env: isolatedEnvironment({POXIOL_DEPLOYMENT_ENV: 'local'}),
    encoding: 'utf8',
  })
  assert.equal(local.status, 0, local.stderr)
  assert.match(local.stdout, /Approved legal-policy release record verified/)

  const cloudflarePreview = spawnSync(process.execPath, ['--no-warnings', '--experimental-strip-types', gateScriptPath], {
    cwd: root,
    env: isolatedEnvironment({CF_PAGES: '1', CF_PAGES_BRANCH: 'codex/construction-completion'}),
    encoding: 'utf8',
  })
  assert.equal(cloudflarePreview.status, 0, cloudflarePreview.stderr)
  assert.match(cloudflarePreview.stdout, /Approved legal-policy release record verified/)
})

test('the build and source suites retain the legal release gates', () => {
  const packageJson = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'))
  assert.match(packageJson.scripts.prebuild, /^node --no-warnings --experimental-strip-types scripts\/assert-legal-release-ready\.mts/)
  assert.match(packageJson.scripts.prebuild, /scripts\/assert-analytics-release-ready\.mts$/)
  assert.match(packageJson.scripts.build, /check:legal-release:output/)
  assert.match(packageJson.scripts.test, /check:legal-release/)
})

if (outputMode) {
  test('approved policy pages are published, indexable, and carry final labels', () => {
    const out = path.join(root, 'out')
    const sitemap = readFileSync(path.join(out, 'sitemap.xml'), 'utf8')
    for (const route of legalRoutes) {
      assert.equal(sitemap.includes(`https://www.poxiol.com${route}`), true, `${route} must be present after approval`)
      const html = readFileSync(path.join(out, route, 'index.html'), 'utf8')
      const robots = html.match(/<meta[^>]+name="robots"[^>]+content="([^"]+)"/i)?.[1] || ''
      assert.doesNotMatch(robots, /\bnoindex\b/i)
      assert.doesNotMatch(html, new RegExp(pendingNotice.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
    }

    const contact = readFileSync(path.join(out, 'contact', 'index.html'), 'utf8')
    assert.match(contact, /<a href="\/privacy-policy\/"[^>]*>Privacy Policy<\/a>/)
    assert.doesNotMatch(contact, /pending owner and legal approval\./)
  })
}
