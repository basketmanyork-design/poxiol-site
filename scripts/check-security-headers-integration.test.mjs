import assert from 'node:assert/strict'
import {spawn} from 'node:child_process'
import {existsSync} from 'node:fs'
import net from 'node:net'
import os from 'node:os'
import path from 'node:path'
import {after, before, test} from 'node:test'
import {fileURLToPath} from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const wrangler = path.join(root, 'node_modules', 'wrangler', 'bin', 'wrangler.js')
const worker = path.join(root, '.open-next', 'worker.js')

let baseUrl
let server
let serverOutput = ''

async function reservePort() {
  return await new Promise((resolve, reject) => {
    const listener = net.createServer()
    listener.once('error', reject)
    listener.listen(0, '127.0.0.1', () => {
      const address = listener.address()
      listener.close(error => error ? reject(error) : resolve(address.port))
    })
  })
}

async function waitForServer(url, timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    if (server?.exitCode !== null) {
      throw new Error(`Wrangler exited before becoming ready.\n${serverOutput}`)
    }
    try {
      const response = await fetch(url)
      if (response.ok) return
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 250))
  }
  throw new Error(`Timed out waiting for Wrangler at ${url}.\n${serverOutput}`)
}

before(async () => {
  assert.equal(existsSync(worker), true, 'Run the OpenNext build before the security-header integration test')
  const port = await reservePort()
  baseUrl = `http://127.0.0.1:${port}`
  server = spawn(process.execPath, [
    wrangler,
    'dev',
    '--local',
    '--ip', '127.0.0.1',
    '--port', String(port),
    '--persist-to', path.join(os.tmpdir(), `poxiol-wrangler-state-${process.pid}`),
    '--log-level', 'error',
    '--show-interactive-dev-session=false',
  ], {
    cwd: root,
    env: {
      ...process.env,
      NO_COLOR: '1',
      WRANGLER_SEND_METRICS: 'false',
      XDG_CONFIG_HOME: path.join(os.tmpdir(), 'poxiol-wrangler-config'),
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  server.stdout.on('data', chunk => { serverOutput += chunk })
  server.stderr.on('data', chunk => { serverOutput += chunk })
  await waitForServer(`${baseUrl}/`)
})

after(() => {
  server?.kill()
})

test('public HTML responses expose the approved report-only CSP without enforcing it', async () => {
  const routes = ['/', '/products/basketball-uniforms/', '/contact/', '/free-mockup/']
  const requiredSources = {
    'default-src': ["'self'"],
    'base-uri': ["'self'"],
    'object-src': ["'none'"],
    'frame-ancestors': ["'self'"],
    'form-action': ["'self'", 'https://formspree.io'],
    'img-src': [
      'https://cdn.sanity.io',
      'https://*.google-analytics.com',
      'https://www.googletagmanager.com',
    ],
    'script-src': [
      'https://www.googletagmanager.com',
      'https://static.cloudflareinsights.com',
    ],
    'connect-src': [
      'https://formspree.io',
      'https://*.google-analytics.com',
      'https://*.analytics.google.com',
      'https://www.googletagmanager.com',
      'https://cloudflareinsights.com',
    ],
  }

  for (const route of routes) {
    const response = await fetch(new URL(route, baseUrl))
    assert.equal(response.status, 200, `${route} must remain available during CSP validation`)
    assert.equal(
      response.headers.has('content-security-policy'),
      false,
      `${route} must not enforce CSP during the report-only observation phase`,
    )
    const policy = response.headers.get('content-security-policy-report-only')
    assert.ok(policy, `${route} must expose Content-Security-Policy-Report-Only`)
    const directives = new Map(policy.split(';').map((part) => {
      const [name, ...sources] = part.trim().split(/\s+/)
      return [name, new Set(sources)]
    }))
    for (const [directive, sources] of Object.entries(requiredSources)) {
      assert.ok(directives.has(directive), `${route} CSP must include ${directive}`)
      for (const source of sources) {
        assert.ok(
          directives.get(directive).has(source),
          `${route} ${directive} must allow ${source}`,
        )
      }
    }
  }
})
