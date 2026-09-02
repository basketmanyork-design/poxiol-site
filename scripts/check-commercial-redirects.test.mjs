import assert from 'node:assert/strict'
import {existsSync, readFileSync} from 'node:fs'
import {test} from 'node:test'

import {parseRedirects} from './generate-cms-redirects.mjs'

const expected = new Map([
  ['/custom-basketball-uniforms/', '/products/basketball-uniforms/'],
  ['/custom-soccer-kits/', '/products/soccer-jerseys/'],
  ['/custom-training-wear/', '/products/training-wear/'],
  ['/custom-american-football-uniforms/', '/products/'],
  ['/custom-esports-jerseys/', '/products/'],
  ['/custom-golf-wear/', '/products/'],
  ['/custom-ice-hockey-jerseys/', '/products/'],
  ['/custom-rugby-uniforms/', '/products/'],
  ['/custom-running-marathon-wear/', '/products/'],
  ['/custom-tennis-wear/', '/products/'],
  ['/custom-volleyball-uniforms/', '/products/'],
  ['/builder/', '/free-mockup/'],
])

test('every retired commercial route has exactly one approved HTTP 301 destination', () => {
  const rules = parseRedirects(readFileSync('public/_redirects', 'utf8'))
  const sources = rules.map((rule) => rule.sourcePath)
  assert.equal(new Set(sources).size, sources.length, 'Redirect sources must be unique.')

  for (const [source, destination] of expected) {
    const matches = rules.filter((rule) => rule.sourcePath === source)
    assert.equal(matches.length, 1, `${source} must have exactly one redirect.`)
    assert.deepEqual(matches[0], {sourcePath: source, destinationPath: destination, redirectType: 301, source: 'base'})
  }
})

test('retired routes cannot also render App Router 200 pages', () => {
  for (const source of expected.keys()) {
    const routeFile = `app/${source.slice(1)}page.tsx`
    assert.equal(existsSync(routeFile), false, `${source} still has a competing App Router page.`)
  }
  assert.equal(existsSync('components/CategoryRedirect.tsx'), false, 'The client redirect component must be removed.')
})

test('the Soccer Product Range link points to the maintained commercial owner', () => {
  const guides = readFileSync('lib/week3-guides.ts', 'utf8')
  assert.match(guides, /label:\s*'Soccer Product Range',\s*href:\s*'\/products\/soccer-jerseys\/'/)
  assert.doesNotMatch(guides, /\/products\/soccer-jerseys-1\//)
})
