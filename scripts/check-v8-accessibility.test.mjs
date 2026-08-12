import assert from 'node:assert/strict'
import {existsSync, readFileSync} from 'node:fs'

const componentFiles = [
  'V8Hero',
  'CustomerSegmentation',
  'BuyerProblems',
  'SolutionCards',
  'DesignJourney',
  'ManufacturingTimeline',
  'ProductionProof',
  'SampleApproval',
  'QualityControl',
  'FAQSection',
  'FinalCTA',
  'VerifiedMediaPlaceholder',
  'V8BuyerLandingPage',
]

for (const name of componentFiles) {
  assert.equal(existsSync(`components/v8/${name}.tsx`), true, `Missing reusable V8 component: ${name}`)
}

const source = componentFiles
  .map((name) => readFileSync(`components/v8/${name}.tsx`, 'utf8'))
  .concat(readFileSync('lib/v8/media.ts', 'utf8'))
  .join('\n')

assert.match(source, /focus-visible:/, 'V8 interactive controls need a visible keyboard focus state.')
assert.match(source, /<ol|role=["']list["']/, 'Ordered workflows need list semantics.')
assert.match(source, /aria-label|aria-labelledby/, 'V8 sections need accessible labels.')
assert.match(source, /Verified production visual pending/, 'The safe media fallback must remain visible.')
assert.doesNotMatch(source, /autoPlay|autoplay/, 'Verified videos must not autoplay.')

const verifiedMediaSource = readFileSync('components/v8/VerifiedMediaPlaceholder.tsx', 'utf8')
assert.match(verifiedMediaSource, /from ['\"]next\/image['\"]/, 'Verified production images must use the existing Next.js image pipeline.')
assert.doesNotMatch(verifiedMediaSource, /<img\b/, 'V8 media must not introduce a raw image performance warning.')

console.log('POXIOL V8 accessibility structure checks passed.')
