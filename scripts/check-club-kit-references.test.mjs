import assert from 'node:assert/strict'
import test from 'node:test'
import {readFileSync, existsSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {createRequire} from 'node:module'
import {resolve} from 'node:path'
import ts from 'typescript'
import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {auditBinaryAllowlist} from './check-cms-binary-allowlist.mts'

const root = resolve(import.meta.dirname, '..')
const manifestPath = resolve(root, 'content/club-kit-reference/assets.json')
function manifest() {
  assert.ok(existsSync(manifestPath), 'Approved nine-topic reference manifest must exist')
  return JSON.parse(readFileSync(manifestPath, 'utf8'))
}
function render() {
  const file = resolve(root, 'components/core-sports/SoccerClubKitReferences.tsx')
  assert.ok(existsSync(file), 'Soccer reference section must exist')
  const js = ts.transpileModule(readFileSync(file, 'utf8'), {compilerOptions: {
    module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
  }}).outputText
  const module = {exports: {}}
  new Function('require', 'module', 'exports', js)(createRequire(file), module, module.exports)
  const warnings = []
  const previous = console.error
  console.error = (...args) => warnings.push(args.join(' '))
  let html
  try { html = renderToStaticMarkup(React.createElement(module.exports.SoccerClubKitReferences)) }
  finally { console.error = previous }
  assert.equal(warnings.length, 0, 'Reference section must render without React hydration warnings')
  return html
}

test('the buyer can view all nine topics without treating illustrations as production evidence', () => {
  const html = render()
  assert.equal((html.match(/data-club-kit-topic=/g) || []).length, 9)
  assert.match(html, /Product illustration/)
  assert.match(html, /Original reference/)
  assert.match(html, /not a club delivery case study/)
  assert.doesNotMatch(html, /<form|<button|100% POLYESTER|verified factory/i)
})

test('technical and photographic references display original pixels in 26, 10, 9 and 9 bounded windows', () => {
  const assets = manifest().assets
  for (const [id, count, digest] of [
    ['02', 26, 'B392E7191BB9AA5F3B19F7BFE503EB464703A0CC6D8068AF68C701050543BFD4'],
    ['03', 10, '59182B24FDB94999AA97438187FB6853E93E6E0FB5F705F7904920B5115205ED'],
    ['05', 9, '4A097CDD9C34106E5DB2D03B44174985F4C1551405251B9EBF6BBA65B9AA965E'],
    ['09', 9, 'FBF35305B8426F1C1717A7BDF426A3632501EEE21C22DF2FEA9BF4E9575C9B7D'],
  ]) {
    const asset = assets.find(a => a.id === id)
    assert.equal(asset.kind, 'original-reference')
    assert.equal(asset.crops.length, count)
    assert.equal(asset.sha256.toUpperCase(), digest)
    assert.equal(new Set(asset.crops.map(c => c.label)).size, count)
    for (const {rect: [x,y,w,h]} of asset.crops) {
      assert.ok(w > 0 && h > 0 && x >= 0 && y >= 0)
      assert.ok(x+w <= asset.width && y+h <= asset.height)
    }
  }
  const html = render()
  assert.equal((html.match(/<image /g) || []).length, 54)
  assert.doesNotMatch(html, /<filter|<canvas|02-collar-options-poxiol|05-fabric-options-poxiol|09-production-process-poxiol/)
  const collars = assets.find(a => a.id === '02').crops
  assert.deepEqual(collars.find(c => c.label === 'V15').rect, [477,700,140,112], 'The complete bottom-row neckline must remain inside its reviewed window')
  assert.deepEqual(collars.find(c => c.label === 'Y02').rect, [1340,700,140,112])
  const patterns = assets.find(a => a.id === '03').crops
  assert.ok(patterns.slice(0,5).every(c => c.rect[1] === 201 && c.rect[3] === 81))
  assert.ok(patterns.slice(5).every(c => c.rect[1] === 310 && c.rect[3] === 82), 'The second row must show complete shirts, not first-row hems and labels')
})

test('published assets are exactly the approved files, without an unreviewed extra or altered byte', () => {
  const m = manifest()
  assert.equal(m.approvedBy, 'Owner')
  assert.equal(m.page, '/products/soccer-jerseys/')
  assert.deepEqual(m.assets.map(a => a.id), ['01','02','03','04','05','06','07','08','09'])
  for (const asset of m.assets) {
    assert.ok(asset.src.startsWith('/club-kit-reference/') && !asset.src.includes('..'))
    const bytes = readFileSync(resolve(root, 'public', '.'+asset.src))
    assert.equal(createHash('sha256').update(bytes).digest('hex'), asset.sha256)
    assert.ok(asset.caption && asset.alt)
  }
})

test('binary release guard admits the nine approved references but blocks an unregistered tenth', () => {
  const paths = manifest().assets.map(a => 'public'+a.src)
  const result = auditBinaryAllowlist(root, paths)
  assert.equal(result.passed, true, result.errors.join('\n'))
  assert.equal(result.approvedBinaryChangeCount, 9)
  assert.equal(auditBinaryAllowlist(root, [...paths, 'public/club-kit-reference/unapproved.png']).passed, false)
})
