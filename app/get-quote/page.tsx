import type {Metadata} from 'next'
import {CmsPageTemplate, metadataFromCmsPage} from '@/components/cms/PageTemplate'
import {getSiteChrome, getSitePage} from '@/lib/sanity/content'
import ContactForm from '@/components/forms/ContactForm'
import FormContactFallback from '@/components/forms/FormContactFallback'

const pageKey = 'get-quote'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSitePage(pageKey)
  return metadataFromCmsPage(page)
}

export default async function Page() {
  const [page, chrome] = await Promise.all([getSitePage(pageKey), getSiteChrome()])
  return (
    <>
      <FormContactFallback context="quote" />
      <CmsPageTemplate page={page} />
      <section id="quote-form" className="bg-neutral-900 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-3xl">
          <ContactForm
            title="Request a Factory Quote"
            subtitle="Send your product, quantity and delivery country — POXIOL will review the requirements and confirm quotation assumptions in writing."
            formType="Get Quote Conversion"
            ctaText="Send Quote Request"
            successUrl="/quote-received/"
            publicEmail={chrome.publicEmail}
            whatsappHref={chrome.whatsappHref}
          />
        </div>
      </section>
    </>
  )
}
