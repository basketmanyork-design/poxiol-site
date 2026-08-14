import type {Metadata} from 'next'
import {CmsPageTemplate, metadataFromCmsPage} from '@/components/cms/PageTemplate'
import {SolutionCards} from '@/components/v8/SolutionCards'
import {FAQSection} from '@/components/v8/FAQSection'
import {getSitePage} from '@/lib/sanity/content'
import {getV8Faqs} from '@/lib/v8/faqs'
import {cmsProductionMediaToV8Assets} from '@/lib/v8/media'
import {getV8ProductionAssetsForPage} from '@/lib/real-production/registry.ts'
import {MockupToFinished} from '@/components/v8/MockupToFinished'

const customizationNextSteps = [
  {id: 'customization-mockup', title: 'Confirm the Design Direction', audience: 'Early design stage', description: 'Share the logo, colors and reference available for a project mockup.', href: '/free-mockup/', ctaLabel: 'Get Free Mockup'},
  {id: 'customization-manufacturing', title: 'Review Manufacturing', audience: 'Before production planning', description: 'See how confirmed artwork and project specifications move through production.', href: '/manufacturing/', ctaLabel: 'See Manufacturing'},
  {id: 'customization-quote', title: 'Request a Project Quote', audience: 'Defined purchasing project', description: 'Share quantity, deadline and customization requirements for a qualified project review.', href: '/get-quote/', ctaLabel: 'Get a Project Quote'},
] as const

const pageKey = 'customization'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSitePage(pageKey)
  return metadataFromCmsPage(page)
}

export default async function Page() {
  const page = await getSitePage(pageKey)
  const faqs = getV8Faqs({pageId: 'customization'})
  const realProofMedia = [
    ...cmsProductionMediaToV8Assets(page.productionMedia),
    ...getV8ProductionAssetsForPage('customization'),
  ]
  return <CmsPageTemplate page={page} beforeFooterSlot={<><MockupToFinished assets={realProofMedia} /><SolutionCards items={customizationNextSteps} eyebrow="Next Step" title="Move from Design to Production" description="Choose the next step that matches the current project stage." /><FAQSection faqs={faqs} title="Customization Project Questions" /></>} />
}
