import {BreadcrumbSchema, FAQSchema, ServiceSchema} from '@/components/seo/GEOStructuredData'
import {QualifiedExplanationNotice} from '@/components/evidence/QualifiedExplanationNotice'
import {Footer, Header} from '@/components/ui'
import {
  V8_BRAND,
  V8_BUYERS,
  V8_PROCESSES,
  getV8BuyerPageContent,
  getV8PageConfig,
} from '@/lib/v8'
import type {V8BuyerPageContent} from '@/lib/v8/types.ts'
import {BuyerProblems} from './BuyerProblems'
import {DesignJourney} from './DesignJourney'
import {FAQSection} from './FAQSection'
import {FinalCTA} from './FinalCTA'
import {ManufacturingTimeline} from './ManufacturingTimeline'
import {QualityControl} from './QualityControl'
import {SolutionCards} from './SolutionCards'
import {V8Hero} from './V8Hero'
import {getV8ProductionAssetsForPage} from '@/lib/real-production/registry.ts'
import {RealProductGallery} from './RealProductGallery'
import {getProductVisualizationsForPage} from '@/lib/product-visualization/registry.ts'
import {ProductVisualizationSection} from './ProductVisualizationSection'
import {publicSectionDecision} from '@/lib/release/publication-policy'

export function V8BuyerLandingPage({pageId}: {pageId: V8BuyerPageContent['pageId']}) {
  const page = getV8BuyerPageContent(pageId)
  const config = getV8PageConfig(pageId)
  const buyerLabels = page.buyerIds
    .map((id) => V8_BUYERS.find((buyer) => buyer.id === id)?.title)
    .filter((label): label is string => Boolean(label))
  const fullUrl = `${V8_BRAND.canonicalBaseUrl}${page.canonicalPath}`
  const faqSchemaItems = page.faqs.map(({question, answer}) => ({question, answer}))
  const realProofMedia = getV8ProductionAssetsForPage(pageId)
  const supportingVisualizations = getProductVisualizationsForPage(page.canonicalPath)
  const planningDecision = publicSectionDecision('solutions-planning')

  return (
    <main className="bg-white text-neutral-950">
      <ServiceSchema name={page.label} description={page.seoDescription} url={fullUrl} />
      <FAQSchema faqs={faqSchemaItems} />
      <BreadcrumbSchema items={[
        {name: 'Home', url: `${V8_BRAND.canonicalBaseUrl}/`},
        {name: page.label, url: fullUrl},
      ]} />

      <Header />
      <V8Hero config={config.hero} primary={page.finalCta} />

      <section className="px-5 py-14 md:px-10 md:py-20 xl:px-20" aria-labelledby={`${pageId}-buyer-fit-title`}>
        <div className="mx-auto max-w-7xl rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm md:p-10">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-lime-700">Buyer Fit</p>
          <h2 id={`${pageId}-buyer-fit-title`} className="mt-4 text-3xl font-black uppercase text-neutral-950 md:text-4xl">{pageId === 'private-label-teamwear' ? 'Built for Channel Partners' : `Built for ${buyerLabels.join(' and ')}`}</h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-neutral-600">{page.purpose}</p>
          {planningDecision === 'QUALIFIED_EXPLANATION' ? (
            <div className="mt-8 max-w-4xl"><QualifiedExplanationNotice /></div>
          ) : null}
        </div>
      </section>

      <BuyerProblems
        items={page.problems}
        title={`Common Challenges for ${page.label}`}
        description="Confirm the project details that can create delays or uncertainty before production begins."
      />

      <SolutionCards
        items={page.solutions}
        headingId={`${pageId}-buyer-solutions-title`}
        eyebrow="Buyer Solutions"
        title={`A Clearer ${page.label} Workflow`}
        description="Use shared design, approval and production steps while keeping this buyer group's requirements clear."
      />

      <ProductVisualizationSection
        assets={supportingVisualizations}
        page={page.canonicalPath}
        eyebrow="Teamwear Categories"
        title="Soccer and Baseball Program Visualizations"
        description="Approved product visualizations support category planning for school and club teamwear programs."
      />

      <RealProductGallery assets={realProofMedia} />

      <DesignJourney
        steps={V8_PROCESSES.journey}
        title="From Idea to Approved Teamwear"
        description="Move from the first brief through mockup, sample, production, quality control and shipment."
      />

      <ManufacturingTimeline
        steps={V8_PROCESSES.manufacturing}
        title="How the Approved Project Moves Through Production"
        description="Production follows the confirmed design, material, construction and packing requirements."
      />

      <QualityControl
        steps={V8_PROCESSES.qualityControl}
        title="Quality Checks Before Shipment"
        description="Checks are based on the specifications approved for the project."
      />

      <SolutionCards
        items={page.authorityLinks}
        headingId={`${pageId}-next-steps-title`}
        eyebrow="Next Steps"
        title="Continue Through the POXIOL Project Path"
        description="Review customization, manufacturing and quality control, then send the buyer-specific inquiry."
      />

      <FAQSection faqs={page.faqs} schema={false} title={`${page.label} Questions`} />

      <FinalCTA
        eyebrow={page.heroEyebrow}
        title={page.finalCta.label}
        description={page.finalCta.description}
        primary={page.finalCta}
      />
      <Footer />
    </main>
  )
}
