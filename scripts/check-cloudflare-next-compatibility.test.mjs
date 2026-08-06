import assert from 'node:assert/strict'
import {existsSync, readFileSync} from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const packageJson = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'))
const nextRange = packageJson.dependencies?.next
assert.equal(nextRange, '15.5.21', 'Cloudflare OpenNext compatibility requires pinned Next.js 15.5.21')
assert.ok(packageJson.dependencies?.['@opennextjs/cloudflare'], 'OpenNext Cloudflare adapter must be a pinned direct dependency')
assert.ok(packageJson.devDependencies?.wrangler, 'Wrangler must be a pinned direct dev dependency')
assert.ok(existsSync(path.join(root, 'open-next.config.ts')), 'OpenNext configuration must be committed')
assert.ok(existsSync(path.join(root, 'wrangler.jsonc')) || existsSync(path.join(root, 'wrangler.toml')), 'Wrangler configuration must be committed')
const scripts = packageJson.scripts || {}
assert.match(`${scripts.build || ''} ${scripts.deploy || ''} ${scripts['cf:build'] || ''} ${scripts['cf:preview'] || ''}`, /opennextjs-cloudflare/, 'Cloudflare build/deploy scripts must use OpenNext explicitly')
assert.doesNotMatch(JSON.stringify(packageJson), /dangerouslyUseUnsupportedNextVersion/, 'unsupported Next.js bypass must never be configured')
console.log('Cloudflare Next.js compatibility contract passed')
