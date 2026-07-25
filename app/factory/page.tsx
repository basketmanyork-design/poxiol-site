import type {Metadata} from 'next'
import {CmsPageTemplate, metadataFromCmsPage} from '@/components/cms/PageTemplate'
import {getSitePage} from '@/lib/sanity/content'

const pageKey = 'factory'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSitePage(pageKey)
  return metadataFromCmsPage(page)
}

export default async function Page() {
  const page = await getSitePage(pageKey)
  return <CmsPageTemplate page={page} />
}
