import type {Metadata} from 'next'
import {HomepageV8} from '@/components/v8/HomepageV8'
import {BreadcrumbSchema, FAQSchema, OrganizationSchema} from '@/components/seo/GEOStructuredData'
import {Footer, Header} from '@/components/ui'
import {getHomepageContent, getSiteChrome} from '@/lib/sanity/content'
import type {V8FaqItem} from '@/lib/v8/types.ts'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getHomepageContent()
  return {
    title: content.seo.title,
    description: content.seo.description,
    alternates: {canonical: content.seo.canonicalUrl || `${content.siteUrl}/`},
  }
}

export default async function HomePage() {
  const baseUrl = 'https://www.poxiol.com'
  const [content, chrome] = await Promise.all([getHomepageContent(), getSiteChrome()])
  const homepageFaqs: V8FaqItem[] = content.faqs.map((faq, index) => ({
    id: `homepage-faq-${index + 1}`,
    question: faq.question,
    answer: faq.answer,
    pageIds: ['home'],
  }))

  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <OrganizationSchema />
      <FAQSchema faqs={homepageFaqs.map(({question, answer}) => ({question, answer}))} />
      <BreadcrumbSchema items={[{name: 'Home', url: `${baseUrl}/`}]} />
      <Header />
      <HomepageV8 content={content} chrome={chrome} faqs={homepageFaqs} />
      <Footer />
    </main>
  )
}
