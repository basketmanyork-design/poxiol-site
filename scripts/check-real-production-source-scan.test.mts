import assert from 'node:assert/strict'
import {
  applyManualDecision,
  classifySourceFolder,
  gradeSampleGroup,
  parseSourceFilename,
} from './scan-real-production-source.mts'

const sourceRecord = {
  absolutePath: 'local-source/sample.jpg',
  visibleText: null,
  visibleLogo: null,
  peopleVisible: null,
  privateInformation: null,
  customerArtwork: null,
  likelyUsage: 'product-sample',
  verificationCandidate: 'REQUIRES_HUMAN_REVIEW' as const,
  reviewNote: 'Not reviewed.',
}

assert.equal(applyManualDecision(sourceRecord, {}).verificationCandidate, 'REQUIRES_HUMAN_REVIEW')
assert.deepEqual(applyManualDecision(sourceRecord, {
  'local-source/sample.jpg': {
    verificationStatus: 'VERIFIED_POXIOL',
    visibleText: 'POXIOL; 23',
    visibleLogo: 'POXIOL',
    peopleVisible: false,
    privateInformation: false,
    customerArtwork: false,
    likelyUsage: 'verified sample',
    reviewNote: 'Reviewed.',
  },
}), {
  ...sourceRecord,
  visibleText: 'POXIOL; 23',
  visibleLogo: 'POXIOL',
  peopleVisible: false,
  privateInformation: false,
  customerArtwork: false,
  likelyUsage: 'verified sample',
  verificationCandidate: 'VERIFIED_POXIOL',
  reviewNote: 'Reviewed.',
})

assert.deepEqual(parseSourceFilename('SAMPLE001-A.jpg'), {
  sampleId: 'SAMPLE001',
  mediaType: 'image',
  view: 'FRONT',
  pairingEligible: true,
})

assert.deepEqual(parseSourceFilename('SAMPLE001-B.jpg'), {
  sampleId: 'SAMPLE001',
  mediaType: 'image',
  view: 'BACK',
  pairingEligible: true,
})

assert.deepEqual(parseSourceFilename('SAMPLE001.mp4'), {
  sampleId: 'SAMPLE001',
  mediaType: 'video',
  view: 'VIDEO',
  pairingEligible: true,
})

assert.deepEqual(parseSourceFilename('SAMPLE002-C.jpg'), {
  sampleId: 'SAMPLE002',
  mediaType: 'image',
  view: 'DETAIL_C',
  pairingEligible: true,
})

assert.deepEqual(parseSourceFilename('SAMPLE003.jpg'), {
  sampleId: 'SAMPLE003',
  mediaType: 'image',
  view: 'UNSPECIFIED',
  pairingEligible: false,
})

assert.deepEqual(parseSourceFilename('.jpg'), {
  sampleId: '(unnamed)',
  mediaType: 'image',
  view: 'UNSPECIFIED',
  pairingEligible: false,
})

assert.equal(gradeSampleGroup(['FRONT', 'BACK', 'VIDEO']), 'S')
assert.equal(gradeSampleGroup(['FRONT', 'BACK']), 'A')
assert.equal(gradeSampleGroup(['FRONT', 'VIDEO']), 'B')
assert.equal(gradeSampleGroup(['BACK', 'VIDEO']), 'B')
assert.equal(gradeSampleGroup(['FRONT']), 'C')
assert.equal(gradeSampleGroup(['VIDEO']), 'D')
assert.equal(gradeSampleGroup(['UNSPECIFIED']), 'UNPAIRED')

assert.equal(classifySourceFolder('local-source/篮球服真实样品'), 'basketball')
assert.equal(classifySourceFolder('local-source/足球服真实样品'), 'soccer')
assert.equal(classifySourceFolder('local-source/棒球服真实样品'), 'baseball')
assert.equal(classifySourceFolder('local-source/吊牌包装袋'), 'packaging')
assert.equal(classifySourceFolder('local-source/面料 - 视频素材'), 'fabric')

console.log('Real Production source scan checks passed')
