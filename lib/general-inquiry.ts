import {appendInquiryContext, type InquiryContext} from './inquiry-context.ts'
import {sendProjectInquiry} from './project-inquiry-request.ts'

export type GeneralInquiryFields = {
  message: string
  email: string
  fullName: string
  _gotcha: string
}

export async function submitGeneralInquiry(
  fields: GeneralInquiryFields,
  context: {endpoint: string | undefined; sourcePage: string; inquiryContext?: InquiryContext},
  request: typeof fetch = fetch,
) {
  const message = fields.message.trim()
  const email = fields.email.trim()
  const fullName = fields.fullName.trim()
  if (!message) throw new Error('Please enter your question.')
  if (message.length > 5000) throw new Error('Please keep your question within 5,000 characters.')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) throw new Error('Please enter a valid reply email.')
  if (fullName.length > 100) throw new Error('Please keep your name within 100 characters.')
  if (fields._gotcha) throw new Error('Please use email or WhatsApp to contact us.')
  if (!context.endpoint) throw new Error('The inquiry form is not configured. Please use email or WhatsApp below.')

  const body = new FormData()
  for (const [name, value] of Object.entries({
    message, email, fullName, _gotcha: '', intent: 'contact', formType: 'Contact Page CMS',
    inquiryType: 'general-question', sourcePage: context.sourcePage,
  })) body.append(name, value)
  if (context.inquiryContext) appendInquiryContext(body,context.inquiryContext)

  // No project priority is inferred from a question without production details.
  await sendProjectInquiry(context.endpoint, body, request)
}
