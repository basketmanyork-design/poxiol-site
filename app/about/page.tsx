import type {Metadata} from 'next'
import {CmsPageTemplate, metadataFromCmsPage} from '@/components/cms/PageTemplate'
import {getSitePage} from '@/lib/sanity/content'
import {applyAboutGeoV1} from '@/lib/geo-v1'
import {CodeOwnedFaq} from '@/components/seo/CodeOwnedFaq'
import {ABOUT_FAQS} from '@/lib/static-faqs'

const pageKey = 'about'

export async function generateMetadata(): Promise<Metadata> {
  const page = applyAboutGeoV1(await getSitePage(pageKey))
  return metadataFromCmsPage(page)
}

export default async function Page() {
  const page = applyAboutGeoV1(await getSitePage(pageKey))
  return (
    <CmsPageTemplate
      page={page}
      beforeFooterSlot={
        <CodeOwnedFaq title="About POXIOL" faqs={ABOUT_FAQS} canonical="https://www.poxiol.com/about/" />
      }
    />
  )
}
