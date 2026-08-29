import assert from 'node:assert/strict'
import test from 'node:test'

import { assertConstructionSourceContract } from '../lib/construction/source-contract.mjs'

const approvedInput = {
  repositoryUrl: 'https://github.com/basketmanyork-design/poxiol-site.git',
  expectedCommit: 'ae452f70b4a027822fc4340db683746e90653fc1',
  actualCommit: 'ae452f70b4a027822fc4340db683746e90653fc1',
  candidateRoot: 'E:/candidate',
}

test('rejects a production commit different from the approved baseline', () => {
  assert.throws(
    () =>
      assertConstructionSourceContract({
        repositoryUrl: 'https://github.com/basketmanyork-design/poxiol-site.git',
        expectedCommit: 'ae452f70b4a027822fc4340db683746e90653fc1',
        actualCommit: '0000000000000000000000000000000000000000',
        candidateRoot: 'E:/candidate',
      }),
    /PRODUCTION_BASELINE_CHANGED/,
  )
})

test('rejects a repository different from the established production repository', () => {
  assert.throws(
    () =>
      assertConstructionSourceContract({
        ...approvedInput,
        repositoryUrl: 'https://github.com/example/not-poxiol.git',
      }),
    /PRODUCTION_REPOSITORY_MISMATCH/,
  )
})

test('rejects a relative candidate root', () => {
  assert.throws(
    () =>
      assertConstructionSourceContract({
        ...approvedInput,
        candidateRoot: 'candidate',
      }),
    /CANDIDATE_ROOT_MUST_BE_ABSOLUTE/,
  )
})

test('accepts the approved repository, commit, and absolute candidate root', () => {
  assert.equal(assertConstructionSourceContract(approvedInput), true)
})
