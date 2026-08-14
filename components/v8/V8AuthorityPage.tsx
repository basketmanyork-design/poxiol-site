import {PageJsonLd} from '@/components/cms/PageTemplate'
import {FAQSchema, ServiceSchema} from '@/components/seo/GEOStructuredData'
import {Footer, Header, SectionHeading} from '@/components/ui'
import type {CmsPage} from '@/lib/cms/types'
import {
  cmsProductionMediaToV8Assets,
  getPhase4AuthorityPage,
  getV8PageConfig,
} from '@/lib/v8'
import type {V8PageId} from '@/lib/v8/types.ts'
import {FAQSection} from './FAQSection'
import {FinalCTA} from './FinalCTA'
import {ManufacturingTimeline} from './ManufacturingTimeline'
import {ProductionProof} from './ProductionProof'
import {QualityControl} from './QualityControl'
import {SolutionCards} from './SolutionCards'
import {V8Hero} from './V8Hero'
import {getV8ProductionAssetsForPage} from '@/lib/real-production/registry.ts'
import {ManufacturingProof} from './ManufacturingProof'
import {QCProofGallery} from './QCProofGallery'
import {RealProductGallery} from './RealProductGallery'

type AuthorityPageId = Extract<V8PageId, 'factory' | 'manufacturing' | 'quality-control'>

export function V8AuthorityPage({pageId, page}: {pageId: AuthorityPageId; page: CmsPage}) {
  const config = getV8PageConfig(pageId)
  const content = getPhase4AuthorityPage(pageId)
  const media = cmsProductionMediaToV8Assets(page.productionMedia)
  const realProofMedia = [...media, ...getV8ProductionAssetsForPage(pageId)]
  const heroMedia = media.find((asset) => asset.stage === 'factory-overview-video')
  const schemaPage = {...page, heading: config.hero.title, description: config.hero.description}
  const fullUrl = `https://www.poxiol.com${config.canonicalPath}`
  const faqSchemaItems = content.faqs.map(({question, answer}) => ({question, answer}))

  return (
    <main className="bg-white text-neutral-950">
      <PageJsonLd page={schemaPage} />
      <ServiceSchema name={config.label} description={config.hero.description} url={fullUrl} />
      <FAQSchema faqs={faqSchemaItems} />

      <Header />
      <V8Hero config={config.hero} media={heroMedia} primary={content.primaryCta} secondary={content.secondaryCta} />

      <section className="px-5 py-16 md:px-10 md:py-24 xl:px-20" aria-labelledby={`${pageId}-authority-intro-title`}>
        <div className="mx-auto max-w-7xl">
          <div id={`${pageId}-authority-intro-title`}><SectionHeading eyebrow={config.label} title={content.introTitle} subtitle={content.introDescription} /></div>
        </div>
      </section>

      {content.capabilityCards.length ? (
        <SolutionCards
          items={content.capabilityCards}
          headingId={`${pageId}-capability-title`}
          eyebrow="POXIOL Capability"
          title="Manufacturing Capability, Sportswear Categories and Buyer Fit"
          description="A focused company overview without duplicating the detailed production workflow."
        />
      ) : null}

      {pageId === 'manufacturing' ? (
        <ManufacturingTimeline
          steps={content.processSteps}
          title="Custom Teamwear Manufacturing Workflow"
          description="How POXIOL manufactures custom teamwear after the project specification is approved."
        />
      ) : null}

      {pageId === 'manufacturing' && content.proofSteps.length ? (
        <ProductionProof
          steps={content.proofSteps}
          media={media}
          title="Verified Production Visuals"
          description="Production media appears only after it is verified as authentic POXIOL evidence."
        />
      ) : null}

      {pageId === 'manufacturing' ? <ManufacturingProof assets={realProofMedia} /> : null}

      {pageId === 'quality-control' ? (
        <QualityControl
          steps={content.processSteps}
          title="Custom Uniform Quality Control Workflow"
          description="How POXIOL reviews confirmed material, printing, sewing, size, final product and packing requirements."
        />
      ) : null}

      {pageId === 'quality-control' ? <QCProofGallery assets={realProofMedia} /> : null}

      {pageId === 'factory' ? <RealProductGallery assets={realProofMedia} /> : null}

      <SolutionCards
        items={content.authorityLinks}
        headingId={`${pageId}-authority-links-title`}
        eyebrow="Continue the Project Path"
        title="Next Step"
        description="Continue through the relevant production, quality or inquiry page."
      />

      <FAQSection faqs={content.faqs} schema={false} title={`${config.label} Questions`} />

      <FinalCTA
        title={content.primaryCta.label}
        description={content.primaryCta.description}
        primary={content.primaryCta}
        secondary={content.secondaryCta}
      />
      <Footer />
    </main>
  )
}
