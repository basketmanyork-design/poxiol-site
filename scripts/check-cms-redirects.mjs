#!/usr/bin/env node
import assert from 'node:assert/strict'
import {formatRedirect, parseRedirects, validateRedirectRules} from './generate-cms-redirects.mjs'

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
console.log('cms redirect tests passed')