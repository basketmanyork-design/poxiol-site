import assert from 'node:assert/strict'
import {spawnSync} from 'node:child_process'
import {test} from 'node:test'

const keys = ['NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT', 'NEXT_PUBLIC_FORMSPREE_FREE_MOCKUP_ENDPOINT']
const approved = 'https://formspree.io/f/xnpqqnol'
const cleanEnv = () => Object.fromEntries(Object.entries(process.env).filter(([key]) => !keys.includes(key)))
const run = (env, fromFile = false) => spawnSync(process.execPath, [
  ...(fromFile ? ['--env-file=.env.prelaunch'] : []),
  'scripts/run-inquiry-prelaunch-build.mjs', '--check-only',
], {env, encoding:'utf8'})

test('the explicit prelaunch configuration enables both existing form consumers without building or sending', () => {
  const result = run(cleanEnv(), true)
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

test('an inherited old provider variable cannot silently override the selected prelaunch file', () => {
  const result = run({...cleanEnv(), NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT:'https://formspree.io/f/xqernqlv'}, true)
  assert.equal(result.status, 1)
  assert.match(result.stderr, /Prelaunch endpoint configuration rejected/)
})
