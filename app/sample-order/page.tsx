import type {Metadata} from 'next'
import {CmsPageTemplate, metadataFromCmsPage} from '@/components/cms/PageTemplate'
import {ProjectQualificationForm} from '@/components/v8/ProjectQualificationForm'
import {ConversionEntryGuide} from '@/components/v8/ConversionEntryGuide'
import FormContactFallback from '@/components/forms/FormContactFallback'
import {getSiteChrome, getSitePage} from '@/lib/sanity/content'
import {SAMPLE_ORDER_FAQS, withSampleOrderFaqs} from '@/lib/v8/conversion-faqs'

const pageKey = 'sample-order'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSitePage(pageKey)
  return metadataFromCmsPage(page)
}

export default async function Page() {
  const [page, chrome] = await Promise.all([getSitePage(pageKey), getSiteChrome()])
  const pageWithFaqs = withSampleOrderFaqs(page, SAMPLE_ORDER_FAQS)
  return (
    <>
      <FormContactFallback context="sample" />
      <CmsPageTemplate page={pageWithFaqs} beforeFooterSlot={<><ConversionEntryGuide currentIntent="sample" /><section id="sample-request-form" className="bg-neutral-900 px-5 py-20 md:px-10 md:py-28 xl:px-20"><div className="mx-auto max-w-3xl"><ProjectQualificationForm intent="sample" formType="Sample Request Conversion" publicEmail={chrome.publicEmail} whatsappHref={chrome.whatsappHref} /></div></section></>} />
    </>
  )
}
