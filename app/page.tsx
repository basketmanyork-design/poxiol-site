import type {Metadata} from 'next'
import {HomepageOptimization} from '@/components/home-optimization/HomepageOptimization'
import {BreadcrumbSchema, OrganizationSchema} from '@/components/seo/GEOStructuredData'
import {Footer, Header} from '@/components/ui'
import {hybridHome} from '@/lib/hybrid/home'
import {getSiteChrome} from '@/lib/sanity/content'
import {getHomepageOptimizationCopy} from '@/lib/sanity/home-optimization'
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
  const [chrome,copy] = await Promise.all([getSiteChrome(),getHomepageOptimizationCopy()])

  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <OrganizationSchema />
      <BreadcrumbSchema items={[{name: 'Home', url: `${baseUrl}/`}]} />
      <Header />
      <HomepageOptimization publicEmail={chrome.publicEmail} whatsappHref={chrome.whatsappHref} privacyPolicyApproved={legalPolicyApproved()} copy={copy} />
      <Footer />
    </main>
  )
}
