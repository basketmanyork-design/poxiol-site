import type {Metadata} from 'next'
import {CmsPageTemplate, metadataFromCmsPage} from '@/components/cms/PageTemplate'
import FormContactFallback from '@/components/forms/FormContactFallback'
import StructuredRfqForm from '@/components/forms/StructuredRfqForm'
import {getSiteChrome, getSitePage} from '@/lib/sanity/content'

const pageKey = 'get-quote'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSitePage(pageKey)
  return metadataFromCmsPage(page)
}

export default async function Page() {
  const [page, chrome] = await Promise.all([
    getSitePage(pageKey),
    getSiteChrome(),
  ])

  return (
    <>
      <FormContactFallback context="quote" />
      <CmsPageTemplate
        page={page}
        contactSlot={
          <StructuredRfqForm
            publicEmail={chrome.publicEmail}
            whatsappHref={chrome.whatsappHref}
          />
        }
      />
    </>
  )
}
