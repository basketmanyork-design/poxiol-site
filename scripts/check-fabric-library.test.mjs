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
function manifest() {
  const file = resolve(root, 'content/fabric-library/assets.json')
  assert.ok(existsSync(file), 'Approved fabric manifest must exist')
  return JSON.parse(readFileSync(file, 'utf8'))
}
function render() {
  const file = resolve(root, 'components/fabrics/FabricReferenceLibrary.tsx')
  assert.ok(existsSync(file), 'Fabric library must exist')
  const js = ts.transpileModule(readFileSync(file, 'utf8'), {compilerOptions: {
    module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
  }}).outputText
  const module = {exports: {}}
  new Function('require', 'module', 'exports', js)(createRequire(file), module, module.exports)
  return renderToStaticMarkup(React.createElement(module.exports.FabricReferenceLibrary))
}

test('buyers see 29 sequential fabric references without categories, forms or internal review notes', () => {
  const html = render()
  const codes = Array.from({length: 29}, (_, i) => `PX-F${String(i + 1).padStart(3, '0')}`)
  assert.deepEqual([...html.matchAll(/data-fabric-id="([^"]+)"/g)].map(m => m[1]), codes)
  assert.equal((html.match(/<img /g) || []).length, 29)
  assert.equal((html.match(/loading="lazy"/g) || []).length, 29)
  assert.doesNotMatch(html, /<button|<form|data-filter|data-group|data-featured|placement|OWNER_CONFIRMATION|sourcePath|[\u4e00-\u9fff]|NBA|certified|quick.dry/i)
})

test('fabric originals are byte-identical and all reviewed windows stay inside the photograph', () => {
  const m = manifest()
  assert.equal(m.approvedBy, 'Owner')
  assert.equal(m.page, '/customization/fabric-options/')
  assert.equal(m.assets.length, 29)
  for (const [i, a] of m.assets.entries()) {
    assert.equal(a.id, i + 1)
    assert.equal(a.src, `/fabric-library/px-f${String(i + 1).padStart(3, '0')}-original.jpg`)
    assert.equal(createHash('sha256').update(readFileSync(resolve(root, 'public', '.' + a.src))).digest('hex'), a.sha256)
    const [x,y,w,h] = a.cropPixels
    assert.ok(x >= 0 && y >= 0 && w > 0 && h > 0 && x+w <= a.width && y+h <= a.height)
    assert.ok(Math.abs(w/h - 4/3) < 0.004)
    assert.equal(a.kind, 'original-fabric-photograph')
  }
})

test('binary guard admits exactly the 29 approved originals but blocks unregistered additions', () => {
  const paths = manifest().assets.map(a => 'public' + a.src)
  const result = auditBinaryAllowlist(root, paths)
  assert.equal(result.passed, true, result.errors.join('\n'))
  assert.equal(result.approvedBinaryChangeCount, 29)
  assert.equal(auditBinaryAllowlist(root, [...paths, 'public/fabric-library/px-f030-original.jpg']).passed, false)
})
