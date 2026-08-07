import type {Metadata} from 'next'
import {CmsPageTemplate, metadataFromCmsPage} from '@/components/cms/PageTemplate'
import {getSiteChrome, getSitePage} from '@/lib/sanity/content'
import ContactForm from '@/components/forms/ContactForm'
import FormContactFallback from '@/components/forms/FormContactFallback'

const pageKey = 'free-mockup'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSitePage(pageKey)
  return metadataFromCmsPage(page)
}

export default async function Page() {
  const [page, chrome] = await Promise.all([getSitePage(pageKey), getSiteChrome()])
  return (
    <>
      <FormContactFallback context="free-mockup" />
      <CmsPageTemplate page={page} />
      <section id="free-mockup-form" className="bg-neutral-900 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-3xl">
          <ContactForm
            title="Request a Free Mockup"
            subtitle="Send your sport, logo and estimated quantity — POXIOL will prepare a free design mockup and pricing plan after the project requirements are reviewed."
            formType="Free Mockup Conversion"
            ctaText="Get Free Mockup & Quote"
            successUrl="/thank-you/"
            publicEmail={chrome.publicEmail}
            whatsappHref={chrome.whatsappHref}
          />
        </div>
      </section>
    </>
  )
}
