import type {Metadata} from 'next'
import {CmsPageTemplate, metadataFromCmsPage} from '@/components/cms/PageTemplate'
import {getSiteChrome, getSitePage} from '@/lib/sanity/content'
import {ProjectQualificationForm} from '@/components/v8/ProjectQualificationForm'
import {ConversionEntryGuide} from '@/components/v8/ConversionEntryGuide'
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
      <CmsPageTemplate page={page} beforeFooterSlot={<><ConversionEntryGuide currentIntent="mockup" /><section id="free-mockup-form" className="bg-neutral-900 px-5 py-20 md:px-10 md:py-28 xl:px-20"><div className="mx-auto max-w-3xl"><ProjectQualificationForm intent="mockup" formType="Free Mockup Conversion" publicEmail={chrome.publicEmail} whatsappHref={chrome.whatsappHref} /></div></section></>} />
    </>
  )
}
