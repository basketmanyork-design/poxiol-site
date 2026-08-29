import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import test from 'node:test'

const read = (route) => readFileSync(`out${route}index.html`, 'utf8')
const limitation =
  'This is a planning explanation, not a customer project, factory record, quality result, delivery result or production guarantee.'

const auditedRoutes = [
  '/solutions/',
  '/design-gallery/',
  '/factory/',
  '/quality-control-process/',
  '/projects/',
  '/products/basketball-uniforms/',
  '/products/soccer-jerseys/',
  '/custom-baseball-softball-uniforms/',
]

test('does not render unfinished or unsupported evidence labels', () => {
  const html = auditedRoutes.map(read).join('\n')
  for (const text of [
    'Solution Visual',
    'Gallery Placeholder',
    'Manufacturing evidence pending verification',
    'Design imagery pending brand review',
    'Project imagery pending verification',
    'Verified Project',
    'Manufacturing Proof',
    'Verified Production Visuals',
  ]) {
    assert.equal(html.includes(text), false, `public output still contains: ${text}`)
  }
})

test('qualifies retained planning content on every planning surface', () => {
  for (const route of [
    '/solutions/',
    '/design-gallery/',
    '/factory/',
    '/quality-control-process/',
    '/projects/',
    '/products/basketball-uniforms/',
    '/products/soccer-jerseys/',
    '/custom-baseball-softball-uniforms/',
  ]) {
    assert.equal(read(route).includes(limitation), true, `${route} is missing the public limitation`)
  }
})

test('governed evidence components consume the publication policy', () => {
  for (const file of [
    'components/v8/ManufacturingProof.tsx',
    'components/v8/ProductionProof.tsx',
    'components/v8/QCProofGallery.tsx',
    'components/v8/PackingProof.tsx',
    'components/v8/SampleInspectionProof.tsx',
  ]) {
    const source = readFileSync(file, 'utf8')
    assert.match(source, /publicSectionDecision/)
  }
})
