import ProcurementContactForm from '@/components/forms/ProcurementContactForm'
import {getV8ConversionEntry, type V8ConversionIntent} from '@/lib/v8/leads'
import type {LeadFormId} from '@/lib/analytics/core'

export function ProjectQualificationForm({
  intent,
  formId,
  formType,
  publicEmail,
  whatsappHref,
  defaultSport,
  showTitle = true,
  privacyPolicyApproved,
}: {
  intent: V8ConversionIntent
  formId: LeadFormId
  formType: string
  publicEmail?: string
  whatsappHref?: string
  defaultSport?: string
  showTitle?: boolean
  privacyPolicyApproved: boolean
}) {
  const entry = getV8ConversionEntry(intent)
  return (
    <ProcurementContactForm
      intent={intent}
      formId={formId}
      title={entry.formTitle}
      subtitle={entry.subtitle}
      formType={formType}
      ctaText={entry.ctaLabel}
      showTitle={showTitle}
      publicEmail={publicEmail}
      whatsappHref={whatsappHref}
      privacyPolicyApproved={privacyPolicyApproved}
    />
  )
}
