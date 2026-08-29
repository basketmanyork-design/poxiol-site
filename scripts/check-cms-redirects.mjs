#!/usr/bin/env node
import assert from 'node:assert/strict'
import {mkdtemp, mkdir, readFile, rm, writeFile} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {formatRedirect, generateCmsRedirects, parseRedirects, validateRedirectRules} from './generate-cms-redirects.mjs'

const base = parseRedirects(`/old /new 301
`)
const valid = validateRedirectRules(base, [
  {sourcePath: '/legacy-product', destinationPath: '/products/basketball-uniforms/', redirectType: 301},
  {sourcePath: '/external', destinationPath: 'https://example.com/path', redirectType: 302},
])
assert.equal(valid.length, 2)
assert.equal(formatRedirect(valid[0]), '/external https://example.com/path 302')

const badCases = [
  [{sourcePath: 'missing-slash', destinationPath: '/x', redirectType: 301}],
  [{sourcePath: '/old', destinationPath: '/x', redirectType: 301}],
  [{sourcePath: '/same', destinationPath: '/same', redirectType: 301}],
  [{sourcePath: '/bad-code', destinationPath: '/x', redirectType: 307}],
  [{sourcePath: '/external-http', destinationPath: 'http://example.com', redirectType: 301}],
  [{sourcePath: '/robots.txt', destinationPath: '/x', redirectType: 301}],
  [{sourcePath: '/bad/*/wild', destinationPath: '/x', redirectType: 301}],
  [{sourcePath: '/a', destinationPath: '/b', redirectType: 301}, {sourcePath: '/b', destinationPath: '/a', redirectType: 301}],
]

for (const rules of badCases) {
  assert.throws(() => validateRedirectRules(base, rules))
}

const rootDir = await mkdtemp(join(tmpdir(), 'poxiol-cms-redirects-'))
try {
  await mkdir(join(rootDir, 'public'), {recursive: true})
  await writeFile(join(rootDir, 'public', '_redirects'), '/old /new 301\n', 'utf8')
  const fetchImpl = async () => new Response(JSON.stringify({
    result: [{sourcePath: '/retired', destinationPath: '/products/', redirectType: 301}],
  }), {status: 200, headers: {'content-type': 'application/json'}})

  await generateCmsRedirects({rootDir, fetchImpl})
  const first = await readFile(join(rootDir, 'out', '_redirects'), 'utf8')
  await generateCmsRedirects({rootDir, fetchImpl})
  const second = await readFile(join(rootDir, 'out', '_redirects'), 'utf8')

  assert.equal(second, first, 'Repeated generation must be byte-identical')
  assert.equal((second.match(/^# Base redirects$/gm) || []).length, 1)
  assert.equal((second.match(/^# CMS redirects - generated at build time$/gm) || []).length, 1)
  assert.equal((second.match(/^\/retired \/products\/ 301$/gm) || []).length, 1)
} finally {
  await rm(rootDir, {recursive: true, force: true})
}

console.log('cms redirect tests passed')
