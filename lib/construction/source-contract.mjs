import path from 'node:path'

const PRODUCTION_REPOSITORY_URL =
  'https://github.com/basketmanyork-design/poxiol-site.git'

export function assertConstructionSourceContract(input) {
  if (input.repositoryUrl !== PRODUCTION_REPOSITORY_URL) {
    throw new Error('PRODUCTION_REPOSITORY_MISMATCH')
  }

  if (input.actualCommit !== input.expectedCommit) {
    throw new Error(`PRODUCTION_BASELINE_CHANGED:${input.actualCommit}`)
  }

  if (!path.isAbsolute(input.candidateRoot)) {
    throw new Error('CANDIDATE_ROOT_MUST_BE_ABSOLUTE')
  }

  return true
}
