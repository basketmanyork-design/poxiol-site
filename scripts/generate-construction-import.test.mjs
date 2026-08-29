import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'

import { buildCandidateImport } from '../lib/construction/import-manifest.mjs'

const latestDigest =
  '715760eedeabb0ca7b5758d4536e78c4c06cad699caa912bf1ef0f483b103efc'

function withCandidateFile(run) {
  const root = mkdtempSync(path.join(tmpdir(), 'poxiol-import-manifest-'))
  mkdirSync(path.join(root, 'app'))
  writeFileSync(path.join(root, 'app', 'page.tsx'), 'latest\n')

  try {
    return run(root)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

test('uses the latest approved hash when batches repeat a candidate path', () => {
  withCandidateFile((candidateRoot) => {
    const entries = buildCandidateImport({
      candidateRoot,
      batches: [
        {
          batch: 'CF-HYBRID-02',
          manifest: {
            changed: [
              {
                file: 'app/page.tsx',
                after: '0'.repeat(64),
              },
            ],
          },
        },
        {
          batch: 'CF-HYBRID-07',
          manifest: {
            mutations: {
              applicationCode: 0,
              binaryAssets: 0,
              legalText: 0,
              cmsWrites: 0,
              formSubmissions: 0,
              deployments: 0,
            },
            files: [
              {
                path: 'acceptance-summary.md',
                sha256: 'f'.repeat(64),
                bytes: 10,
              },
            ],
          },
        },
        {
          batch: 'CF-HYBRID-08',
          manifest: {
            candidateFiles: [
              {
                path: 'app/page.tsx',
                sha256: latestDigest,
                bytes: 7,
              },
            ],
          },
        },
      ],
    })

    assert.deepEqual(entries, [
      {
        path: 'app/page.tsx',
        sha256: latestDigest,
        bytes: 7,
        approvedBy: 'CF-HYBRID-08',
      },
    ])
  })
})

test('rejects a non-zero CF-HYBRID-07 application mutation', () => {
  withCandidateFile((candidateRoot) => {
    assert.throws(
      () =>
        buildCandidateImport({
          candidateRoot,
          batches: [
            {
              batch: 'CF-HYBRID-07',
              manifest: { mutations: { applicationCode: 1 } },
            },
          ],
        }),
      /UNDECLARED_CF_HYBRID_07_MUTATION/,
    )
  })
})

test('rejects a current candidate file whose hash differs from the approved hash', () => {
  withCandidateFile((candidateRoot) => {
    assert.throws(
      () =>
        buildCandidateImport({
          candidateRoot,
          batches: [
            {
              batch: 'CF-HYBRID-09',
              manifest: {
                sourceEvidence: [
                  {
                    path: 'app/page.tsx',
                    sha256: '0'.repeat(64),
                    bytes: 7,
                  },
                ],
              },
            },
          ],
        }),
      /CANDIDATE_HASH_MISMATCH:app\/page\.tsx/,
    )
  })
})
