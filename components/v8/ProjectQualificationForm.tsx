import ContactForm from '@/components/forms/ContactForm'
import {getV8ConversionEntry, type V8ConversionIntent} from '@/lib/v8/leads'
import type {LeadFormId} from '@/lib/analytics/core'

export function ProjectQualificationForm({
  intent,
  formId,
  formType,
  publicEmail,
  whatsappHref,
  defaultSport,
  privacyPolicyApproved,
}: {
  intent: V8ConversionIntent
  formId: LeadFormId
  formType: string
  publicEmail?: string
  whatsappHref?: string
  defaultSport?: string
  privacyPolicyApproved: boolean
}) {
  const entry = getV8ConversionEntry(intent)
  return (
    <ContactForm
      intent={intent}
      formId={formId}
      title={entry.formTitle}
      subtitle={entry.subtitle}
      formType={formType}
      ctaText={entry.ctaLabel}
      successUrl={entry.successUrl}
      publicEmail={publicEmail}
      whatsappHref={whatsappHref}
      defaultSport={defaultSport}
      privacyPolicyApproved={privacyPolicyApproved}
    />
  )
}
