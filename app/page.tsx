import type {Metadata} from 'next'
import {HomepageHybrid} from '@/components/hybrid/HomepageHybrid'
import {BreadcrumbSchema, OrganizationSchema} from '@/components/seo/GEOStructuredData'
import {Footer, Header} from '@/components/ui'
import {hybridHome} from '@/lib/hybrid/home'
import {getSiteChrome} from '@/lib/sanity/content'
import {legalPolicyApproved} from '@/lib/legal-release'

export function generateMetadata(): Metadata {
  return {
    title: hybridHome.seo.title,
    description: hybridHome.seo.description,
    alternates: {canonical: 'https://www.poxiol.com/'},
  }
}

export default async function HomePage() {
  const baseUrl = 'https://www.poxiol.com'
  const chrome = await getSiteChrome()

  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <OrganizationSchema />
      <BreadcrumbSchema items={[{name: 'Home', url: `${baseUrl}/`}]} />
      <Header />
      <HomepageHybrid publicEmail={chrome.publicEmail} whatsappHref={chrome.whatsappHref} privacyPolicyApproved={legalPolicyApproved()} />
      <Footer />
    </main>
  )
}
