import {ContentViewTracker} from '@/components/analytics/ContentViewTracker'
import {QualifiedExplanationNotice} from '@/components/evidence/QualifiedExplanationNotice'
import {ProductGeoSections} from '@/components/sections/GeoV1Sections'
import {FAQSchema, ProductSchema, ServiceSchema} from '@/components/seo/GEOStructuredData'
import {Footer, Header} from '@/components/ui'
import {
  CORE_SPORT_JOURNEY,
  CORE_SPORT_MANUFACTURING,
  CORE_SPORT_QUALITY_CONTROL,
  getCoreSport,
  type CoreSportId,
} from '@/lib/core-sports'
import {getProductVisualization} from '@/lib/product-visualization/registry.ts'
import {getV8ProductionAssetsForPage} from '@/lib/real-production/registry.ts'
import {BuyerProblems} from '@/components/v8/BuyerProblems'
import {DesignJourney} from '@/components/v8/DesignJourney'
import {FAQSection} from '@/components/v8/FAQSection'
import {FinalCTA} from '@/components/v8/FinalCTA'
import {ManufacturingTimeline} from '@/components/v8/ManufacturingTimeline'
import {ProductVisualizationSection} from '@/components/v8/ProductVisualizationSection'
import {QualityControl} from '@/components/v8/QualityControl'
import {RealProductGallery} from '@/components/v8/RealProductGallery'
import {SampleApproval} from '@/components/v8/SampleApproval'
import {SolutionCards} from '@/components/v8/SolutionCards'
import {V8Hero} from '@/components/v8/V8Hero'
import {publicSectionDecision} from '@/lib/release/publication-policy'

export function CoreSportLandingPage({sportId}: {sportId: Exclude<CoreSportId, 'basketball'>}) {
  const sport = getCoreSport(sportId)
  const fullUrl = 'https://www.poxiol.com' + sport.canonicalPath
  const visualization = getProductVisualization(sport.visualizationId)
  const verifiedEvidence = getV8ProductionAssetsForPage(sport.pageId)
  const schemaFaqs = sport.faqs.map(({question, answer}) => ({question, answer}))
  const planningDecision = publicSectionDecision('solutions-planning')

  return (
    <main className="bg-white text-neutral-950">
      <ContentViewTracker event="product_category_view" params={{product_category: sport.canonicalPath, sport: sport.id}} />
      <ProductSchema name={sport.hero.title} description={sport.seoDescription} url={fullUrl} image={visualization.publicPath} />
      <ServiceSchema name={'Custom ' + sport.label + ' Uniform Manufacturing'} description={sport.seoDescription} url={fullUrl} />
      <FAQSchema faqs={schemaFaqs} />

      <Header />
      <V8Hero
        config={sport.hero}
        visualization={visualization}
        visualizationPage={sport.canonicalPath}
        primary={sport.primaryCta}
        secondary={sport.secondaryCta}
      />

      <ProductGeoSections details={sport.geoDetails} />

      {planningDecision === 'QUALIFIED_EXPLANATION' ? (
        <section className="bg-white px-5 pb-6 md:px-10 xl:px-20" aria-label="Planning content limitation">
          <div className="mx-auto max-w-7xl"><QualifiedExplanationNotice /></div>
        </section>
      ) : null}

      <SolutionCards
        items={sport.productCards}
        eyebrow={sport.label + ' Product System'}
        title={sport.productSummaryTitle}
        description={'Review the complete ' + sport.label.toLowerCase() + ' product scope before design and sample approval.'}
        headingId={sport.id + '-product-system-title'}
      />

      <ProductVisualizationSection
        assets={[visualization]}
        page={sport.canonicalPath}
        eyebrow={sport.label + ' Product Visualization'}
        title={'Approved ' + sport.label + ' Uniform Presentation'}
        description={'This approved PRODUCT_VISUALIZATION supports product understanding only. It is not presented as real production, factory, QC or customer proof.'}
        layout="single"
      />

      <RealProductGallery
        assets={verifiedEvidence}
        eyebrow={sport.label + ' Verified Evidence'}
        title={'Verified ' + sport.label + ' Product Details'}
        description="This section appears only when publishable evidence passes the existing Verified Media Gate."
      />

      <BuyerProblems
        items={sport.problems}
        title={'Common ' + sport.label + ' Uniform Ordering Challenges'}
        description="Resolve product scope, artwork, roster and repeat-order requirements before production planning."
      />

      <SolutionCards
        items={sport.customization}
        eyebrow="Customization"
        title={sport.label + ' Uniform Customization and Program Planning'}
        description="Confirm project-specific product, artwork, sizing, buyer and repeat-order requirements."
        headingId={sport.id + '-customization-title'}
      />

      <DesignJourney
        steps={CORE_SPORT_JOURNEY}
        title={'From ' + sport.label + ' Idea to Shipment'}
        description="Follow the shared approval workflow from the first brief through mockup, sample, production, quality control and shipment."
      />

      <SampleApproval
        steps={sport.sampleSteps}
        title={sport.label + ' Sample Approval Before Bulk Production'}
        description="Use the agreed product and artwork requirements to review the sample before production planning continues."
      />

      <ManufacturingTimeline
        steps={CORE_SPORT_MANUFACTURING}
        title={sport.label + ' Uniform Manufacturing'}
        description="Production follows the artwork, material, construction, size and packing requirements confirmed for the project."
      />

      <QualityControl
        steps={CORE_SPORT_QUALITY_CONTROL}
        title={sport.label + ' Uniform Quality Control'}
        description="Checks are based on the project specification approved by the buyer."
      />

      <SolutionCards
        items={sport.authorityLinks}
        eyebrow="Project Path"
        title={'Continue Your ' + sport.label + ' Project'}
        description="Choose the next action based on whether the project is at design, sample, production review or quote stage."
        headingId={sport.id + '-project-path-title'}
      />

      <FAQSection faqs={sport.faqs} schema={false} title={'Custom ' + sport.label + ' Uniform Questions'} />

      <FinalCTA
        title={'Ready to Start Your ' + sport.label + ' Uniform Project?'}
        description="Share the product scope, quantity, size breakdown, authorized artwork, destination and target date for review."
        primary={sport.primaryCta}
        secondary={sport.secondaryCta}
      />
      <Footer />
    </main>
  )
}
