import type {Metadata} from 'next'
import ContactForm from '@/components/forms/ContactForm'
import {CmsPageTemplate, metadataFromCmsPage} from '@/components/cms/PageTemplate'
import {getSiteChrome, getSitePage} from '@/lib/sanity/content'

const pageKey = 'contact'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSitePage(pageKey)
  return metadataFromCmsPage(page)
}

export default async function ContactPage() {
  const [page, chrome] = await Promise.all([getSitePage(pageKey), getSiteChrome()])

  return (
    <CmsPageTemplate
      page={page}
      contactSlot={
        <ContactForm
          title="Send an Official Inquiry"
          subtitle="Please provide as much detail as possible so our specialists can give you a precise answer."
          formType="Official Contact Page CMS"
          ctaText="Send My Message"
          successUrl="/thank-you/"
          publicEmail={chrome.publicEmail}
          whatsappHref={chrome.whatsappHref}
        />
      }
    />
  )
}
