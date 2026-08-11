import type {Metadata} from 'next'
import {CmsPageTemplate, metadataFromCmsPage} from '@/components/cms/PageTemplate'
import {getSitePage} from '@/lib/sanity/content'
import {applyAboutGeoV1} from '@/lib/geo-v1'

const pageKey = 'about'

export async function generateMetadata(): Promise<Metadata> {
  const page = applyAboutGeoV1(await getSitePage(pageKey))
  return metadataFromCmsPage(page)
}

export default async function Page() {
  const page = applyAboutGeoV1(await getSitePage(pageKey))
  return <CmsPageTemplate page={page} />
}
