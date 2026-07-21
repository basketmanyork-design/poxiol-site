import type {Metadata} from 'next'
import SportsLandingPage from '@/components/sports/SportsLandingPage'
import {getBasketballPreviewPage} from '@/lib/sanity/content'
import {getSportsPageBySlug} from '@/lib/sports-pages'

const slug = 'products/basketball-uniforms'
const legacyPageData = getSportsPageBySlug(slug)

async function loadPageData() {
  if (!legacyPageData) return null
  return getBasketballPreviewPage(legacyPageData)
}

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await loadPageData()
  return {
    title: pageData?.metaTitle,
    description: pageData?.metaDescription,
  }
}

export default async function Page() {
  const pageData = await loadPageData()
  if (!pageData) return null
  return <SportsLandingPage data={pageData} />
}
