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
      <CmsPageTemplate
        page={pageWithFaqs}
        conversionIntent="quote"
        afterHeroSlot={
          <section id={getV8ConversionEntry('quote').formAnchorId} tabIndex={-1} className="scroll-mt-24 bg-neutral-900 px-5 py-16 md:px-10 md:py-24 xl:px-20">
            <div className="mx-auto max-w-3xl">
              <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-white sm:p-8">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#B6FF00]">Prepare Your Request</p>
                <h2 className="mt-3 text-2xl font-black uppercase sm:text-3xl">Three details help us review your project</h2>
                <ul className="mt-5 grid gap-3 text-sm font-semibold text-neutral-200 sm:grid-cols-3">
                  <li>Product and quantity</li>
                  <li>Required in-hand date and delivery destination</li>
                  <li>Contact method; artwork or references are optional</li>
                </ul>
              </div>
              <ProjectQualificationForm intent="quote" formId="factory_quote_form" formType="Get Quote Conversion" publicEmail={chrome.publicEmail} whatsappHref={chrome.whatsappHref} privacyPolicyApproved={legalPolicyApproved()} />
            </div>
          </section>
        }
        beforeFooterSlot={<ConversionEntryGuide currentIntent="quote" />}
      />
    </>
  )
}
