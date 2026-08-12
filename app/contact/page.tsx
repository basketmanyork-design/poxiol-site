import type {Metadata} from 'next'
import {ProjectQualificationForm} from '@/components/v8/ProjectQualificationForm'
import {ConversionEntryGuide} from '@/components/v8/ConversionEntryGuide'
import {CmsPageTemplate, metadataFromCmsPage} from '@/components/cms/PageTemplate'
import {EmailAddress, emailHref} from '@/components/ui'
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
        <>
          <ConversionEntryGuide currentIntent="contact" />
          <noscript>
            <div className="rounded-lg border border-yellow-400 bg-yellow-50 p-6 dark:bg-yellow-950/20">
              <p className="font-semibold">If the form does not load, please send your sport, product type, quantity, delivery country, target date and logo files by email or WhatsApp.</p>
              <p className="mt-2"><a href={emailHref(chrome.publicEmail)} className="underline"><EmailAddress email={chrome.publicEmail} /></a></p>
              <p><a href={chrome.whatsappHref} className="underline" target="_blank" rel="noopener">WhatsApp: {chrome.whatsappNumber}</a></p>
            </div>
          </noscript>
          <ProjectQualificationForm
            intent="contact"
            formType="Contact Page CMS"
            publicEmail={chrome.publicEmail}
            whatsappHref={chrome.whatsappHref}
          />
        </>
      }
    />
  )
}
