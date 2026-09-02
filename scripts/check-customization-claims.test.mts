import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {test} from 'node:test'

const pages = {
  fabric: readFileSync('app/customization/fabric-options/page.tsx', 'utf8'),
  decoration: readFileSync('app/customization/logo-name-number/page.tsx', 'utf8'),
  packaging: readFileSync('app/customization/custom-packaging/page.tsx', 'utf8'),
  privateLabel: readFileSync('app/customization/private-label/page.tsx', 'utf8'),
}

test('customization pages render only approved project-specific claims', () => {
  assert.match(pages.fabric, /getApprovedClaimWording\("fabric-review"\)/)
  assert.match(pages.decoration, /getApprovedClaimWording\("sublimation-comparison"\)/)
  assert.match(pages.decoration, /getApprovedClaimWording\("decoration-placement-review"\)/)
  assert.match(pages.packaging, /getApprovedClaimWording\("packaging-review"\)/)
  assert.match(pages.privateLabel, /getApprovedClaimWording\("private-label-review"\)/)
})

test('customization source rejects unsupported absolute or capability wording', () => {
  const source = Object.values(pages).join('\n')
  for (const blocked of [
    /highest grade/i,
    /engineered for athletes/i,
    /perfect color/i,
    /zero fad(?:e|ing)/i,
    /never crack, peel, or fade/i,
    /hundreds of washes/i,
    /perfect condition/i,
    /saving you hours/i,
    /eco-friendly polybags/i,
    /export-grade cartons/i,
    /fully custom-printed/i,
    /retail-ready/i,
    /launch and scale/i,
  ]) {
    assert.doesNotMatch(source, blocked)
  }
})

test('private-label page does not expose empty proof placeholders', () => {
  assert.doesNotMatch(pages.privateLabel, /Label Visual|Tag Visual|Hangtag Visual/i)
})
