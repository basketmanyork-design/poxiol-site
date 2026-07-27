import type {Metadata} from 'next'
import {CmsPageTemplate, metadataFromCmsPage} from '@/components/cms/PageTemplate'
import {getSitePage} from '@/lib/sanity/content'
import FormContactFallback from '@/components/forms/FormContactFallback'

const pageKey = 'free-mockup'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSitePage(pageKey)
  return metadataFromCmsPage(page)
}

export default async function Page() {
  const page = await getSitePage(pageKey)
  return (
    <>
      <FormContactFallback context="free-mockup" />
      <CmsPageTemplate page={page} />
    </>
  )
}
