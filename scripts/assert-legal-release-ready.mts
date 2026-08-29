import {assertLegalReleaseReady, legalPolicyApproved} from '../lib/legal-release.ts'

try {
  assertLegalReleaseReady(process.env)
  console.log(legalPolicyApproved() ? 'Approved legal-policy release record verified.' : 'Local legal-policy preview allowed; production remains blocked.')
} catch (cause) {
  console.error(cause instanceof Error ? cause.message : 'LEGAL_APPROVAL_REQUIRED:privacy,terms,ip')
  process.exit(1)
}
