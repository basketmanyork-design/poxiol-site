import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {mkdir, mkdtemp, rm} from 'node:fs/promises'
import {resolve} from 'node:path'
import test from 'node:test'

const candidateA = 'a'.repeat(40)
const candidateB = 'b'.repeat(40)
const buildId = `poxiol-${'c'.repeat(24)}`

function response(rawBody, {ok = true, status = 200} = {}) {
  return {
    ok,
    status,
    async text() {
      return rawBody
    },
  }
}

function sampleEvidence(candidateCommit = candidateA) {
  return {
    schemaVersion: 1,
    candidateCommit,
    projectId: 'oqpv1xbc',
    dataset: 'production',
    apiVersion: '2024-01-01',
    transport: 'GET_ONLY',
    perspective: 'published',
    authentication: 'none',
    cmsWrites: 0,
    reads: [{
      name: 'site-settings',
      method: 'GET',
      params: {},
      querySha256: '1'.repeat(64),
      responseSha256: '2'.repeat(64),
      resultKind: 'object',
      resultCount: 1,
    }],
    aggregateSha256: '46391a26e80cd3439dafb6b7855b2d79cc663d9fdd606d19aed4a00cfdb9b34e',
  }
}

test('candidate-neutral projection excludes only candidateCommit and changes for CMS evidence', async () => {
  const {toSanityBuildIdInput} = await import('../lib/release/sanity-build-evidence.mjs')
  const first = toSanityBuildIdInput(sampleEvidence(candidateA))
  const second = toSanityBuildIdInput(sampleEvidence(candidateB))

  assert.deepEqual(first, second)
  assert.equal(Object.hasOwn(first, 'candidateCommit'), false)

  const changed = sampleEvidence(candidateA)
  changed.reads[0].responseSha256 = '4'.repeat(64)
  changed.aggregateSha256 = '7bc7fd0527ba1ac1141af5abefa7cc4aef76881ad5a0cbf39418c0f9eb0d93ba'
  assert.notDeepEqual(first, toSanityBuildIdInput(changed))
})

test('build evidence hashes public GET results and resolves dependent slugs without storing bodies', async () => {
  const {buildSanityEvidence} = await import('../lib/release/sanity-build-evidence.mjs')
  const seen = []
  const bodies = [
    '{"result":[{"slug":"alpha"}]}',
    '{"result":{"slug":"alpha"}}',
  ]
  const evidence = await buildSanityEvidence({
    candidateCommit: candidateA,
    reads: [
      {name: 'products', query: 'query-one', params: {}},
      {name: 'product', query: 'query-two', params: {slug: '$firstPublishedProduct'}},
    ],
    fetchImpl: async (url, options) => {
      seen.push({url: String(url), options})
      return response(bodies[seen.length - 1])
    },
  })

  assert.equal(seen.length, 2)
  assert.equal(seen[0].options.method, 'GET')
  assert.equal(seen[0].options.headers.Accept, 'application/json')
  assert.match(seen[1].url, /%24slug=%22alpha%22/)
  assert.deepEqual(evidence.reads, [
    {
      name: 'products',
      method: 'GET',
      params: {},
      querySha256: 'b6aa29859a69781a7b61d23b3900c4c53ca2804562df437eb0fca8f2c9f89d7d',
      responseSha256: 'ddc84a2a5b4df70a282524f129cbec64db9fd2915915e10e3f9817c779400b15',
      resultKind: 'array',
      resultCount: 1,
    },
    {
      name: 'product',
      method: 'GET',
      params: {slug: 'alpha'},
      querySha256: 'b37301d6b79c5d29393e39342cec96e64d75e6bdf72756d46bf873366812f623',
      responseSha256: '22ce289ce4dca503c4e739803714db1214cad46c7bdb8f16b15f88c2f3fac3ff',
      resultKind: 'object',
      resultCount: 1,
    },
  ])
  assert.match(evidence.aggregateSha256, /^[a-f0-9]{64}$/)
  assert.equal(JSON.stringify(evidence).includes('"result"'), false)
})

test('response hash ignores Sanity timing and sync metadata when the published result is unchanged', async () => {
  const {buildSanityEvidence} = await import('../lib/release/sanity-build-evidence.mjs')
  const reads = [{name: 'site-settings', query: 'query-one', params: {}}]
  const first = await buildSanityEvidence({
    candidateCommit: candidateA,
    reads,
    fetchImpl: async () => response('{"ms":3,"result":{"slug":"alpha"},"syncTags":["s1"]}'),
  })
  const second = await buildSanityEvidence({
    candidateCommit: candidateA,
    reads,
    fetchImpl: async () => response('{"ms":4,"result":{"slug":"alpha"},"syncTags":["s2"]}'),
  })

  assert.equal(first.reads[0].responseSha256, second.reads[0].responseSha256)
  assert.equal(first.aggregateSha256, second.aggregateSha256)
})

test('artifact writer keeps full Candidate evidence separate from neutral build-ID input', async () => {
  const {
    SANITY_BUILD_EVIDENCE_PATH,
    SANITY_BUILD_ID_INPUT_PATH,
    writeSanityEvidenceArtifacts,
  } = await import('../lib/release/sanity-build-evidence.mjs')
  const tempBase = resolve('.analysis_tmp')
  await mkdir(tempBase, {recursive: true})
  const root = await mkdtemp(resolve(tempBase, 'sanity-evidence-'))
  try {
    writeSanityEvidenceArtifacts({root, evidence: sampleEvidence(candidateA)})
    const full = JSON.parse(readFileSync(resolve(root, SANITY_BUILD_EVIDENCE_PATH), 'utf8'))
    const neutral = JSON.parse(readFileSync(resolve(root, SANITY_BUILD_ID_INPUT_PATH), 'utf8'))
    assert.equal(full.candidateCommit, candidateA)
    assert.equal(Object.hasOwn(neutral, 'candidateCommit'), false)
    assert.equal(neutral.aggregateSha256, full.aggregateSha256)
  } finally {
    await rm(root, {recursive: true, force: true})
  }
})

test('commit, evidence and build-ID mismatches fail closed', async () => {
  const {assertBuildEvidenceStable, resolveCandidateCommit} = await import('../lib/release/sanity-build-evidence.mjs')
  const baseline = sampleEvidence(candidateA)

  assert.equal(resolveCandidateCommit({envCommit: candidateA, gitCommit: candidateA}), candidateA)
  assert.throws(
    () => resolveCandidateCommit({envCommit: candidateB, gitCommit: candidateA}),
    /SANITY_BUILD_EVIDENCE_COMMIT_MISMATCH/,
  )
  assert.throws(
    () => assertBuildEvidenceStable({baseline, current: baseline, candidateCommit: candidateB, buildId, expectedBuildId: buildId}),
    /SANITY_BUILD_EVIDENCE_COMMIT_MISMATCH/,
  )

  const changed = sampleEvidence(candidateA)
  changed.reads[0].responseSha256 = '4'.repeat(64)
  changed.aggregateSha256 = '7bc7fd0527ba1ac1141af5abefa7cc4aef76881ad5a0cbf39418c0f9eb0d93ba'
  assert.throws(
    () => assertBuildEvidenceStable({baseline, current: changed, candidateCommit: candidateA, buildId, expectedBuildId: buildId}),
    /SANITY_BUILD_EVIDENCE_DRIFT/,
  )
  assert.throws(
    () => assertBuildEvidenceStable({baseline, current: baseline, candidateCommit: candidateA, buildId: `poxiol-${'d'.repeat(24)}`, expectedBuildId: buildId}),
    /SANITY_BUILD_EVIDENCE_BUILD_ID_MISMATCH/,
  )
})

test('network, HTTP and malformed JSON failures never expose response bodies', async () => {
  const {buildSanityEvidence} = await import('../lib/release/sanity-build-evidence.mjs')
  const reads = [{name: 'site-settings', query: 'query-one', params: {}}]
  const secret = 'super-secret-response-body'

  for (const fetchImpl of [
    async () => response(secret, {ok: false, status: 503}),
    async () => response(secret),
    async () => { throw new Error(secret) },
  ]) {
    await assert.rejects(
      buildSanityEvidence({candidateCommit: candidateA, reads, fetchImpl}),
      (error) => {
        assert.equal(String(error).includes(secret), false)
        return true
      },
    )
  }
})

test('success log contains only the governed binding fields', async () => {
  const {formatSanityEvidenceLog} = await import('../lib/release/sanity-build-evidence.mjs')
  assert.equal(
    formatSanityEvidenceLog({evidence: sampleEvidence(candidateA), buildId}),
    `[sanity-build-evidence] candidate=${candidateA} buildId=${buildId} aggregateSha256=46391a26e80cd3439dafb6b7855b2d79cc663d9fdd606d19aed4a00cfdb9b34e reads=1 cmsWrites=0`,
  )
})

test('capture and verify orchestration binds one Candidate and fails on CMS drift', async () => {
  const {
    captureSanityBuildEvidence,
    verifySanityBuildEvidence,
  } = await import('../lib/release/sanity-build-evidence.mjs')
  const tempBase = resolve('.analysis_tmp')
  await mkdir(tempBase, {recursive: true})
  const root = await mkdtemp(resolve(tempBase, 'sanity-orchestration-'))
  const reads = [{name: 'site-settings', query: 'query-one', params: {}}]
  const stableFetch = async () => response('{"result":{"slug":"alpha"}}')
  try {
    const captured = await captureSanityBuildEvidence({
      root,
      candidateCommit: candidateA,
      reads,
      fetchImpl: stableFetch,
    })
    const verified = await verifySanityBuildEvidence({
      root,
      candidateCommit: candidateA,
      reads,
      fetchImpl: stableFetch,
      buildId,
      expectedBuildId: buildId,
    })
    assert.equal(verified.aggregateSha256, captured.aggregateSha256)

    await assert.rejects(
      verifySanityBuildEvidence({
        root,
        candidateCommit: candidateA,
        reads,
        fetchImpl: async () => response('{"result":{"slug":"changed"}}'),
        buildId,
        expectedBuildId: buildId,
      }),
      /SANITY_BUILD_EVIDENCE_DRIFT/,
    )
  } finally {
    await rm(root, {recursive: true, force: true})
  }
})

test('the actual Cloudflare Pages build command captures and verifies Sanity evidence', () => {
  const scripts = JSON.parse(readFileSync(resolve('package.json'), 'utf8')).scripts
  const command = scripts['build:cloudflare']

  assert.match(command, /^node --no-warnings --experimental-strip-types scripts\/audit-sanity-published-reads\.mts --capture && /)
  assert.match(command, / next build && node scripts\/generate-cms-redirects\.mjs /)
  assert.match(command, / && node --no-warnings --experimental-strip-types scripts\/audit-sanity-published-reads\.mts --verify$/)
})
