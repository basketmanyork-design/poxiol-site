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

async function loadLegalModule() {
  assert.equal(existsSync(legalModulePath), true, 'Missing governed legal-release module')
  return import(pathToFileURL(legalModulePath).href)
}

function isolatedEnvironment(overrides: Record<string, string> = {}) {
  const environment = {...process.env}
  for (const key of ['POXIOL_DEPLOYMENT_ENV', 'CF_PAGES_BRANCH', 'CF_PAGES', 'POXIOL_LEGAL_APPROVED']) delete environment[key]
  return {...environment, ...overrides}
}

test('a pending governed record cannot be promoted by production or a forged environment flag', async () => {
  assert.equal(existsSync(approvalPath), true, 'Missing governed legal approval record')
  const approval = JSON.parse(readFileSync(approvalPath, 'utf8'))
  assert.equal(approval.status, 'PENDING_OWNER_LEGAL_APPROVAL')
  assert.equal(approval.approvedAt, null)
  assert.equal(approval.approvedBy, null)

  const legal = await loadLegalModule()
  assert.equal(legal.legalPolicyApproved(), false)
  assert.equal(legal.legalPreviewAllowed({POXIOL_DEPLOYMENT_ENV: 'local'}), true)
  assert.equal(legal.legalPreviewAllowed({POXIOL_DEPLOYMENT_ENV: 'preview'}), true)
  assert.equal(legal.legalPreviewAllowed({}), false)
  assert.equal(legal.legalPreviewAllowed({POXIOL_DEPLOYMENT_ENV: 'production'}), false)
  assert.equal(legal.legalPreviewAllowed({POXIOL_DEPLOYMENT_ENV: 'preview', CF_PAGES_BRANCH: 'main'}), false)
  assert.equal(legal.legalPreviewAllowed({POXIOL_LEGAL_APPROVED: 'true'}), false)
  assert.throws(() => legal.assertLegalReleaseReady({POXIOL_LEGAL_APPROVED: 'true'}), /LEGAL_APPROVAL_REQUIRED:privacy,terms,ip/)
})

test('pending policies are excluded from public discovery and carry restrictive robots metadata', async () => {
  const legal = await loadLegalModule()
  assert.deepEqual(legal.publicLegalPolicyRoutes(), [])
  assert.deepEqual(legal.legalPolicyMetadata(), {robots: 'noindex, nofollow, noarchive'})
  assert.equal(legal.legalDraftNotice(), pendingNotice)
})

test('the executable release assertion blocks production and permits explicit local preview only', () => {
  assert.equal(existsSync(gateScriptPath), true, 'Missing executable legal release assertion')
  const production = spawnSync(process.execPath, ['--no-warnings', '--experimental-strip-types', gateScriptPath], {
    cwd: root,
    env: isolatedEnvironment({POXIOL_DEPLOYMENT_ENV: 'production'}),
    encoding: 'utf8',
  })
  assert.notEqual(production.status, 0)
  assert.match(production.stderr, /LEGAL_APPROVAL_REQUIRED:privacy,terms,ip/)

  const forged = spawnSync(process.execPath, ['--no-warnings', '--experimental-strip-types', gateScriptPath], {
    cwd: root,
    env: isolatedEnvironment({POXIOL_LEGAL_APPROVED: 'true'}),
    encoding: 'utf8',
  })
  assert.notEqual(forged.status, 0)

  const local = spawnSync(process.execPath, ['--no-warnings', '--experimental-strip-types', gateScriptPath], {
    cwd: root,
    env: isolatedEnvironment({POXIOL_DEPLOYMENT_ENV: 'local'}),
    encoding: 'utf8',
  })
  assert.equal(local.status, 0, local.stderr)
  assert.match(local.stdout, /Local legal-policy preview allowed/)
})

test('the build and source suites retain the legal release gates', () => {
  const packageJson = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'))
  assert.match(packageJson.scripts.prebuild, /^node --no-warnings --experimental-strip-types scripts\/assert-legal-release-ready\.mts/)
  assert.match(packageJson.scripts.prebuild, /scripts\/assert-analytics-release-ready\.mts$/)
  assert.match(packageJson.scripts.build, /check:legal-release:output/)
  assert.match(packageJson.scripts.test, /check:legal-release/)
})

if (outputMode) {
  test('generated pending policy pages remain reviewable but undiscoverable and clearly labelled', () => {
    const out = path.join(root, 'out')
    const sitemap = readFileSync(path.join(out, 'sitemap.xml'), 'utf8')
    for (const route of legalRoutes) {
      assert.equal(sitemap.includes(`https://www.poxiol.com${route}`), false, `${route} must stay out of the sitemap while pending`)
      const html = readFileSync(path.join(out, route, 'index.html'), 'utf8')
      const robots = html.match(/<meta[^>]+name="robots"[^>]+content="([^"]+)"/i)?.[1] || ''
      for (const directive of ['noindex', 'nofollow', 'noarchive']) assert.match(robots, new RegExp(`\\b${directive}\\b`, 'i'))
      assert.match(html, new RegExp(pendingNotice.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
    }

    const contact = readFileSync(path.join(out, 'contact', 'index.html'), 'utf8')
    assert.match(contact, /<a href="\/privacy-policy\/"[^>]*>Draft privacy notice<\/a>/)
    assert.match(contact, /pending owner and legal approval\./)
  })
}
