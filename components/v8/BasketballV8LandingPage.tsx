import {ContentViewTracker} from '@/components/analytics/ContentViewTracker'
import {QualifiedExplanationNotice} from '@/components/evidence/QualifiedExplanationNotice'
import {ProductGeoSections} from '@/components/sections/GeoV1Sections'
import {FAQSchema, ProductSchema, ServiceSchema} from '@/components/seo/GEOStructuredData'
import {Footer, Header} from '@/components/ui'
import {buildSportsProductGeoDetails} from '@/lib/geo-v1'
import type {SportsPageData} from '@/lib/sports-pages'
import {
  PHASE4_BASKETBALL,
  V8_PROCESSES,
  getPhase4BasketballFaqs,
} from '@/lib/v8'
import {BuyerProblems} from './BuyerProblems'
import {DesignJourney} from './DesignJourney'
import {FAQSection} from './FAQSection'
import {FinalCTA} from './FinalCTA'
import {ManufacturingTimeline} from './ManufacturingTimeline'
import {QualityControl} from './QualityControl'
import {SampleApproval} from './SampleApproval'
import {SolutionCards} from './SolutionCards'
import {V8Hero} from './V8Hero'
import {getV8ProductionAssetsForSample} from '@/lib/real-production/registry.ts'
import {RealProductGallery} from './RealProductGallery'
import {MockupToFinished} from './MockupToFinished'
import {SampleInspectionProof} from './SampleInspectionProof'
import {QCProofGallery} from './QCProofGallery'
import {PackingProof} from './PackingProof'
import {BASKETBALL_VISUALIZATION_SEQUENCE, getProductVisualization} from '@/lib/product-visualization/registry.ts'
import {ProductVisualizationSection} from './ProductVisualizationSection'
import {getCoreSport, resolveCoreSportGeoDetails} from '@/lib/core-sports'
import {publicSectionDecision} from '@/lib/release/publication-policy'

export function BasketballV8LandingPage({data}: {data: SportsPageData}) {
  const coreSport = getCoreSport('basketball')
  const fullUrl = 'https://www.poxiol.com' + coreSport.canonicalPath
  const faqs = getPhase4BasketballFaqs(data.faqs)
  const schemaFaqs = faqs.map(({question, answer}) => ({question, answer}))
  const geoDetails = resolveCoreSportGeoDetails('basketball', buildSportsProductGeoDetails(data))
  const realProofMedia = getV8ProductionAssetsForSample('POXIOL-RP-001')
  const planningDecision = publicSectionDecision('solutions-planning')

  return (
    <main className="bg-white text-neutral-950">
      <ContentViewTracker event="product_category_view" params={{product_category: coreSport.canonicalPath, sport: coreSport.id}} />
      <ProductSchema name={coreSport.hero.title} description={coreSport.seoDescription} url={fullUrl} image={data.heroImage} />
      <ServiceSchema name="Custom Basketball Uniform Manufacturing" description={coreSport.seoDescription} url={fullUrl} />
      <FAQSchema faqs={schemaFaqs} />
      <Header />
      <V8Hero config={coreSport.hero} visualization={getProductVisualization('PV-BASK-001')} visualizationPage="/products/basketball-uniforms/" primary={PHASE4_BASKETBALL.primaryCta} secondary={PHASE4_BASKETBALL.secondaryCta} />

      <ProductGeoSections details={geoDetails} />

      {planningDecision === 'QUALIFIED_EXPLANATION' ? (
        <section className="bg-white px-5 pb-6 md:px-10 xl:px-20" aria-label="Planning content limitation">
          <div className="mx-auto max-w-7xl"><QualifiedExplanationNotice /></div>
        </section>
      ) : null}

      <SolutionCards
        items={coreSport.productCards}
        headingId="basketball-core-product-system-title"
        eyebrow="Basketball Product System"
        title={coreSport.productSummaryTitle}
        description="Review the complete basketball product scope before design and sample approval."
      />

      <ProductVisualizationSection
        assets={BASKETBALL_VISUALIZATION_SEQUENCE}
        page="/products/basketball-uniforms/"
        eyebrow="Basketball Product Visualization"
        title="Review the Uniform from Full Set to Product Details"
        description="These approved product visualizations present the same POXIOL basketball concept from the full set through garment and material details."
        layout="walkthrough"
      />

      <RealProductGallery assets={realProofMedia} />

      <BuyerProblems
        items={PHASE4_BASKETBALL.problems}
        title="Common Basketball Uniform Ordering Challenges"
        description="Confirm roster, sizing, artwork and approval requirements before production begins."
      />

      <SolutionCards
        items={PHASE4_BASKETBALL.customization}
        headingId="basketball-customization-title"
        eyebrow="Customization"
        title="Basketball Uniform Customization"
        description="Plan the team identity, roster details, uniform format and buyer-specific branding requirements."
      />

      <DesignJourney
        steps={V8_PROCESSES.journey}
        title="From Basketball Design to Shipment"
        description="Follow the approved workflow from the first idea through mockup, sample, production, quality control and shipment."
      />

      <MockupToFinished assets={realProofMedia} />

      <SampleApproval
        steps={PHASE4_BASKETBALL.sampleSteps}
        title="Approve the Sample Before Bulk Production"
        description="Confirm the agreed basketball uniform specification before the bulk production plan proceeds."
      />

      <SampleInspectionProof assets={realProofMedia} />

      <ManufacturingTimeline
        steps={V8_PROCESSES.manufacturing}
        title="Basketball Uniform Production Process"
        description="Approved artwork, material, sizing and construction requirements guide the production workflow."
      />

      <QualityControl
        steps={V8_PROCESSES.qualityControl}
        title="Basketball Uniform Quality Checks"
        description="Checks are based on the roster, artwork, sizing and product details confirmed for the project."
      />

      <QCProofGallery assets={realProofMedia} />

      <PackingProof assets={realProofMedia} />

      <SolutionCards
        items={PHASE4_BASKETBALL.authorityLinks}
        headingId="basketball-authority-links-title"
        eyebrow="Production Confidence"
        title="Review Manufacturing, Quality Control and Sample Approval"
        description="Continue to the dedicated process pages before sending the final project requirements."
      />

      <FAQSection faqs={faqs} schema={false} title="Custom Basketball Uniform Questions" />

      <FinalCTA
        title="Ready to Build Your Basketball Uniforms?"
        description="Share the logo, colors, roster, size breakdown, quantity and target date for design and production review."
        primary={PHASE4_BASKETBALL.primaryCta}
        secondary={PHASE4_BASKETBALL.secondaryCta}
      />
      <Footer />
    </main>
  )
}
