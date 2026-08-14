import assert from 'node:assert/strict'
import {existsSync, readFileSync} from 'node:fs'

const names = ['RealProductGallery', 'MockupToFinished', 'SampleInspectionProof', 'QCProofGallery', 'PackingProof', 'ManufacturingProof', 'VerifiedProductionVideo']
for (const name of names) assert.equal(existsSync(`components/v8/${name}.tsx`), true, `Missing ${name}`)

const sources = [...names, 'RealProofSection'].map((name) => readFileSync(`components/v8/${name}.tsx`, 'utf8')).join('\n')
assert.match(sources, /VerifiedMediaPlaceholder/, 'Proof components must keep the shared media gate')
assert.match(sources, /grid-cols-1/, 'Proof galleries must use a single mobile column')
assert.match(sources, /visibleSlots/, 'Zero-asset galleries must collapse to one safe placeholder')

const mockupToFinished = readFileSync('components/v8/MockupToFinished.tsx', 'utf8')
assert.match(mockupToFinished, /full-set/, 'A verified full-set photo must be eligible for the finished-sample slot')
assert.match(mockupToFinished, /front/, 'A verified front photo must be the finished-sample fallback')
assert.match(mockupToFinished, /finished-garment/, 'The fallback must be normalized to the existing finished-sample slot')

const placeholder = readFileSync('components/v8/VerifiedMediaPlaceholder.tsx', 'utf8')
assert.match(placeholder, /sizes=/, 'Images need responsive sizes')
assert.match(placeholder, /loading=/, 'Below-fold images need explicit lazy loading')
assert.match(placeholder, /media\.kind === 'video' && !media\.poster/, 'Verified videos without posters must fall back safely')
assert.match(placeholder, /preload="none"/, 'Videos must not preload large media')
assert.match(placeholder, /poster=\{media\.poster\}/, 'Videos must render their verified poster')
assert.doesNotMatch(placeholder, /<img\b/, 'Raw images are forbidden')
assert.doesNotMatch(placeholder, /autoPlay/, 'Production videos must never autoplay')

const video = readFileSync('components/v8/VerifiedProductionVideo.tsx', 'utf8')
assert.match(video, /controls/)
assert.match(video, /preload="none"/)
assert.match(video, /poster=/)
assert.doesNotMatch(video, /autoPlay/)

console.log('Real Production component checks passed')
