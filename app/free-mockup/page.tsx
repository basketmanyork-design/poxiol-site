import type {Metadata} from 'next'
import {CmsPageTemplate, metadataFromCmsPage} from '@/components/cms/PageTemplate'
import {getSiteChrome, getSitePage} from '@/lib/sanity/content'
import {ProjectQualificationForm} from '@/components/v8/ProjectQualificationForm'
import {ConversionEntryGuide} from '@/components/v8/ConversionEntryGuide'
import {FREE_MOCKUP_FAQS, withFreeMockupFaqs} from '@/lib/v8/conversion-faqs'
import FormContactFallback from '@/components/forms/FormContactFallback'
import {ProductVisualizationSection} from '@/components/v8/ProductVisualizationSection'
import {getProductVisualization} from '@/lib/product-visualization/registry'
import {getV8ConversionEntry} from '@/lib/v8/leads'

const pageKey = 'free-mockup'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSitePage(pageKey)
  return metadataFromCmsPage(page)
}

export default async function Page() {
  const [page, chrome] = await Promise.all([getSitePage(pageKey), getSiteChrome()])
  const pageWithFaqs = withFreeMockupFaqs(page, FREE_MOCKUP_FAQS)
  const mockupVisualization = getProductVisualization('PV-CUSTOM-001')
  return (
    <>
      <FormContactFallback context="free-mockup" />
      <CmsPageTemplate page={pageWithFaqs} conversionIntent="mockup" beforeFooterSlot={<><ProductVisualizationSection assets={[mockupVisualization]} page="/free-mockup/" eyebrow="Design Visualization" title="From Mockup to Finished Presentation" description="Review the approved POXIOL visualization of the mockup-to-finished design path." layout="single" /><ConversionEntryGuide currentIntent="mockup" /><section id={getV8ConversionEntry('mockup').formAnchorId} tabIndex={-1} className="scroll-mt-24 bg-neutral-900 px-5 py-20 md:px-10 md:py-28 xl:px-20"><div className="mx-auto max-w-3xl"><ProjectQualificationForm intent="mockup" formType="Free Mockup Conversion" publicEmail={chrome.publicEmail} whatsappHref={chrome.whatsappHref} /></div></section></>} />
    </>
  )
}
