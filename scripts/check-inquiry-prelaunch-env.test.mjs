import assert from 'node:assert/strict'
import {spawnSync} from 'node:child_process'
import {test} from 'node:test'

const keys = ['NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT']
const legacyKey = 'NEXT_PUBLIC_FORMSPREE_FREE_MOCKUP_ENDPOINT'
const approved = 'https://formspree.io/f/xnpqqnol'
const cleanEnv = () => Object.fromEntries(Object.entries(process.env).filter(([key]) => !keys.includes(key) && key !== legacyKey))
const run = (env, fromFile = false) => spawnSync(process.execPath, [
  ...(fromFile ? ['--env-file=.env.prelaunch'] : []),
  'scripts/run-inquiry-prelaunch-build.mjs', '--check-only',
], {env, encoding:'utf8'})

test('the explicit prelaunch configuration enables the one governed Formspree endpoint without building or sending', () => {
  const result = run({...cleanEnv(), NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT: approved})
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /Prelaunch endpoint configuration verified/)
  assert.doesNotMatch(result.stdout, /next build/)
})

for (const key of keys) {
  for (const value of [undefined, '', 'https://formspree.io/f/xqernqlv']) {
    test(`${key} rejects ${value === undefined ? 'missing' : value === '' ? 'empty' : 'old-account'} configuration before building`, () => {
      const env = {...cleanEnv(), ...Object.fromEntries(keys.map(k => [k,approved]))}
      if (value === undefined) delete env[key]
      else env[key] = value
      const result = run(env)
      assert.equal(result.status, 1)
      assert.match(result.stderr, /Prelaunch endpoint configuration rejected/)
      assert.ok(result.stderr.includes(key))
    })
  }
}

test('the removed free-mockup endpoint variable is ignored by the governed build', () => {
  const result = run({...cleanEnv(), NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT:approved, [legacyKey]:'https://formspree.io/f/legacy'})
  assert.equal(result.status, 0, result.stderr)
})
