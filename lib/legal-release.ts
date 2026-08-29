import type {Metadata} from 'next'
import approval from '../content/legal/approval.json' with {type: 'json'}

export const LEGAL_POLICY_ROUTES = ['/privacy-policy/', '/terms/', '/intellectual-property-policy/'] as const
export const LEGAL_DRAFT_NOTICE = 'Draft policy — pending owner and legal approval.'

type LegalEnvironment = Record<string, string | undefined>

export function legalPolicyApproved() {
  return approval.status === 'APPROVED'
}

export function legalPreviewAllowed(environment: LegalEnvironment) {
  if (legalPolicyApproved()) return true
  if (environment.CF_PAGES_BRANCH === 'main') return false
  if (environment.CF_PAGES === '1' && environment.CF_PAGES_BRANCH) return true
  return environment.POXIOL_DEPLOYMENT_ENV === 'local' || environment.POXIOL_DEPLOYMENT_ENV === 'preview'
}

export function assertLegalReleaseReady(environment: LegalEnvironment) {
  if (!legalPreviewAllowed(environment)) throw new Error('LEGAL_APPROVAL_REQUIRED:privacy,terms,ip')
}

export function publicLegalPolicyRoutes(): readonly string[] {
  return legalPolicyApproved() ? LEGAL_POLICY_ROUTES : []
}

export function legalPolicyMetadata(): Pick<Metadata, 'robots'> {
  return legalPolicyApproved() ? {} : {robots: 'noindex, nofollow, noarchive'}
}

export function legalDraftNotice() {
  return legalPolicyApproved() ? '' : LEGAL_DRAFT_NOTICE
}
