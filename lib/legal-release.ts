import type {Metadata} from 'next'
import approval from '../content/legal/approval.json' with {type: 'json'}

export const LEGAL_POLICY_ROUTES = ['/privacy-policy/', '/terms/', '/intellectual-property-policy/'] as const
export const LEGAL_DRAFT_NOTICE = 'Draft policy — pending owner and legal approval.'

type LegalEnvironment = Record<string, string | undefined>
type LegalApprovalRecord = {
  status: string
  approvedAt: string | null
  approvedBy: string | null
}

export function legalPolicyApproved(record: LegalApprovalRecord = approval) {
  return record.status === 'APPROVED'
    && Boolean(record.approvedAt?.trim())
    && Boolean(record.approvedBy?.trim())
}

export function legalPreviewAllowed(environment: LegalEnvironment, record: LegalApprovalRecord = approval) {
  if (legalPolicyApproved(record)) return true
  if (environment.CF_PAGES_BRANCH === 'main') return false
  if (environment.CF_PAGES === '1' && environment.CF_PAGES_BRANCH) return true
  return environment.POXIOL_DEPLOYMENT_ENV === 'local' || environment.POXIOL_DEPLOYMENT_ENV === 'preview'
}

export function assertLegalReleaseReady(environment: LegalEnvironment, record: LegalApprovalRecord = approval) {
  if (!legalPreviewAllowed(environment, record)) throw new Error('LEGAL_APPROVAL_REQUIRED:privacy,terms,ip')
}

export function publicLegalPolicyRoutes(record: LegalApprovalRecord = approval): readonly string[] {
  return legalPolicyApproved(record) ? LEGAL_POLICY_ROUTES : []
}

export function legalPolicyMetadata(record: LegalApprovalRecord = approval): Pick<Metadata, 'robots'> {
  return legalPolicyApproved(record) ? {} : {robots: 'noindex, nofollow, noarchive'}
}

export function legalDraftNotice(record: LegalApprovalRecord = approval) {
  return legalPolicyApproved(record) ? '' : LEGAL_DRAFT_NOTICE
}
