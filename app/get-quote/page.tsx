import type {Metadata} from 'next'
import {CmsPageTemplate, metadataFromCmsPage} from '@/components/cms/PageTemplate'
import {getSiteChrome, getSitePage} from '@/lib/sanity/content'
import {ProjectQualificationForm} from '@/components/v8/ProjectQualificationForm'
import {ConversionEntryGuide} from '@/components/v8/ConversionEntryGuide'
import {GET_QUOTE_FAQS, withGetQuoteFaqs} from '@/lib/v8/conversion-faqs'
import FormContactFallback from '@/components/forms/FormContactFallback'
import {getV8ConversionEntry} from '@/lib/v8/leads'
import {legalPolicyApproved} from '@/lib/legal-release'

const pageKey = 'get-quote'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSitePage(pageKey)
  return metadataFromCmsPage(page)
}

export default async function Page() {
  const [page, chrome] = await Promise.all([getSitePage(pageKey), getSiteChrome()])
  const pageWithFaqs = withGetQuoteFaqs(page, GET_QUOTE_FAQS)
  return (
    <>
      <FormContactFallback context="quote" />
      <CmsPageTemplate page={pageWithFaqs} conversionIntent="quote" beforeFooterSlot={<><ConversionEntryGuide currentIntent="quote" /><section id={getV8ConversionEntry('quote').formAnchorId} tabIndex={-1} className="scroll-mt-24 bg-neutral-900 px-5 py-20 md:px-10 md:py-28 xl:px-20"><div className="mx-auto max-w-3xl"><ProjectQualificationForm intent="quote" formType="Get Quote Conversion" publicEmail={chrome.publicEmail} whatsappHref={chrome.whatsappHref} privacyPolicyApproved={legalPolicyApproved()} /></div></section></>} />
    </>
  )
}
