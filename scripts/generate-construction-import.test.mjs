import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'

import {
  buildCandidateImport,
  expandRelativeSourceDependencies,
  extractScriptFileReferences,
} from '../lib/construction/import-manifest.mjs'

const latestDigest =
  '715760eedeabb0ca7b5758d4536e78c4c06cad699caa912bf1ef0f483b103efc'

function withCandidateFile(run) {
  const root = mkdtempSync(path.join(tmpdir(), 'poxiol-import-manifest-'))
  mkdirSync(path.join(root, 'app'))
  mkdirSync(path.join(root, 'scripts'))
  mkdirSync(path.join(root, 'scripts', 'helpers'))
  mkdirSync(path.join(root, 'components'))
  writeFileSync(path.join(root, 'app', 'page.tsx'), 'latest\n')
  writeFileSync(path.join(root, 'scripts', 'required.test.mjs'), 'latest\n')
  writeFileSync(
    path.join(root, 'scripts', 'main.test.mjs'),
    "import './helpers/page-content-html.mjs'\n",
  )
  writeFileSync(
    path.join(root, 'scripts', 'helpers', 'page-content-html.mjs'),
    'export const helper = true\n',
  )
  writeFileSync(
    path.join(root, 'components', 'AliasConsumer.tsx'),
    "import '@/components/useInquiryContext'\n",
  )
  writeFileSync(
    path.join(root, 'components', 'useInquiryContext.ts'),
    'export const useInquiryContext = true\n',
  )

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

test('expands project-root alias imports from manifest-listed source files', () => {
  withCandidateFile((candidateRoot) => {
    assert.deepEqual(
      expandRelativeSourceDependencies({
        candidateRoot,
        entryPaths: ['components/AliasConsumer.tsx'],
      }),
      [
        'components/AliasConsumer.tsx',
        'components/useInquiryContext.ts',
      ],
    )
  })
})

test('expands relative source imports without adding unrelated candidate files', () => {
  withCandidateFile((candidateRoot) => {
    assert.deepEqual(
      expandRelativeSourceDependencies({
        candidateRoot,
        entryPaths: ['scripts/main.test.mjs'],
      }),
      [
        'scripts/helpers/page-content-html.mjs',
        'scripts/main.test.mjs',
      ],
    )
  })
})

test('extracts only explicit script file references from package commands', () => {
  assert.deepEqual(
    extractScriptFileReferences({
      scripts: {
        test: 'node scripts/a.test.mjs && npm run nested',
        nested:
          'node --experimental-strip-types scripts/b.test.mts --output',
        build: 'next build',
      },
    }),
    ['scripts/a.test.mjs', 'scripts/b.test.mts'],
  )
})

test('adds a required package script only when a baseline inventory proves its hash', () => {
  withCandidateFile((candidateRoot) => {
    const entries = buildCandidateImport({
      candidateRoot,
      batches: [],
      requiredPaths: ['scripts/required.test.mjs'],
      baselineInventory: {
        'scripts/required.test.mjs': latestDigest,
        'scripts/unreferenced.test.mjs': 'f'.repeat(64),
      },
      baselineApprovedBy: 'CF-HYBRID-06:before-hashes',
    })

    assert.deepEqual(entries, [
      {
        path: 'scripts/required.test.mjs',
        sha256: latestDigest,
        bytes: 7,
        approvedBy: 'CF-HYBRID-06:before-hashes',
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
