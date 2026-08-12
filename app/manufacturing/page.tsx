import type {Metadata} from 'next'
import {metadataFromCmsPage} from '@/components/cms/PageTemplate'
import {V8AuthorityPage} from '@/components/v8/V8AuthorityPage'
import {getSitePage} from '@/lib/sanity/content'
import {getV8AuthorityMetadata} from '@/lib/v8'

const pageKey = 'manufacturing'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSitePage(pageKey)
  return metadataFromCmsPage(page, getV8AuthorityMetadata('manufacturing'))
}

export default async function Page() {
  const page = await getSitePage(pageKey)
  return <V8AuthorityPage pageId="manufacturing" page={page} />
}
