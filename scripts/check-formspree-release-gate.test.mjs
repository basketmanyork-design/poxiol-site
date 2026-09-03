import assert from 'node:assert/strict'
import {spawnSync} from 'node:child_process'
import {readFileSync} from 'node:fs'
import {delimiter, dirname} from 'node:path'
import {test} from 'node:test'

const approved = 'https://formspree.io/f/xnpqqnol'
const retired = 'https://formspree.io/f/xqernqlv'
const cleanEnvironment = () => Object.fromEntries(Object.entries(process.env).filter(([key]) => ![
  'CF_PAGES',
  'CF_PAGES_BRANCH',
  'NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT',
  'POXIOL_DEPLOYMENT_ENV',
].includes(key)))

const runGate = (environment) => spawnSync(process.execPath, [
  'scripts/assert-formspree-release-ready.mjs',
], {
  cwd: process.cwd(),
  env: environment,
  encoding: 'utf8',
})

test('Production accepts only the approved Formspree endpoint', () => {
  const result = runGate({
    ...cleanEnvironment(),
    CF_PAGES: '1',
    CF_PAGES_BRANCH: 'main',
    NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT: approved,
  })
  assert.equal(result.status, 0, result.stderr)
})

for (const [label, endpoint] of [
  ['missing', undefined],
  ['retired', retired],
  ['unapproved', 'https://formspree.io/f/not-approved'],
]) {
  test(`Production fails closed for a ${label} Formspree endpoint`, () => {
    const environment = {
      ...cleanEnvironment(),
      CF_PAGES: '1',
      CF_PAGES_BRANCH: 'main',
    }
    if (endpoint) environment.NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT = endpoint
    const result = runGate(environment)
    assert.equal(result.status, 1)
    assert.match(result.stderr, /Production Formspree endpoint rejected/)
  })
}

for (const endpoint of [approved, retired]) {
  test(`Preview rejects ${endpoint === approved ? 'the Production' : 'the retired'} Formspree endpoint`, () => {
    const result = runGate({
      ...cleanEnvironment(),
      CF_PAGES: '1',
      CF_PAGES_BRANCH: 'codex/formspree-preview',
      NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT: endpoint,
    })
    assert.equal(result.status, 1)
    assert.match(result.stderr, /Preview Formspree endpoint rejected/)
  })
}

test('Preview without an endpoint builds with the inquiry form failed closed', () => {
  const result = runGate({
    ...cleanEnvironment(),
    CF_PAGES: '1',
    CF_PAGES_BRANCH: 'codex/formspree-preview',
  })
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /fail closed/)
})

test('Preview permits a dedicated non-Production Formspree endpoint', () => {
  const result = runGate({
    ...cleanEnvironment(),
    POXIOL_DEPLOYMENT_ENV: 'preview',
    NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT: 'https://formspree.io/f/preview-only',
  })
  assert.equal(result.status, 0, result.stderr)
})

test('the real prebuild lifecycle rejects the retired Production endpoint', () => {
  const packageConfiguration = JSON.parse(readFileSync('package.json', 'utf8'))
  const shell = process.platform === 'win32' ? 'cmd.exe' : '/bin/sh'
  const shellArguments = process.platform === 'win32'
    ? ['/d', '/s', '/c', packageConfiguration.scripts.prebuild]
    : ['-c', packageConfiguration.scripts.prebuild]
  const environment = {
    ...cleanEnvironment(),
    CF_PAGES: '1',
    CF_PAGES_BRANCH: 'main',
    NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT: retired,
  }
  const pathKey = Object.keys(environment).find((key) => key.toLowerCase() === 'path') || 'PATH'
  environment[pathKey] = `${dirname(process.execPath)}${delimiter}${environment[pathKey] || ''}`
  const result = spawnSync(shell, shellArguments, {
    cwd: process.cwd(),
    env: environment,
    encoding: 'utf8',
  })
  assert.equal(result.status, 1)
  assert.match(`${result.stdout}\n${result.stderr}`, /Production Formspree endpoint rejected/)
})
