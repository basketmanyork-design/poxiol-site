import ContactForm from '@/components/forms/ContactForm'
import {getV8ConversionEntry, type V8ConversionIntent} from '@/lib/v8/leads'

export function ProjectQualificationForm({
  intent,
  formType,
  publicEmail,
  whatsappHref,
  defaultSport,
}: {
  intent: V8ConversionIntent
  formType: string
  publicEmail?: string
  whatsappHref?: string
  defaultSport?: string
}) {
  const entry = getV8ConversionEntry(intent)
  return (
    <ContactForm
      intent={intent}
      title={entry.formTitle}
      subtitle={entry.subtitle}
      formType={formType}
      ctaText={entry.ctaLabel}
      successUrl={entry.successUrl}
      publicEmail={publicEmail}
      whatsappHref={whatsappHref}
      defaultSport={defaultSport}
    />
  )
}
