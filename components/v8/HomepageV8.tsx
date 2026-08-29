import {HomepageGeoEntitySections} from '@/components/sections/GeoV1Sections'
import {EmailAddress, SectionHeading, emailHref} from '@/components/ui'
import type {CmsHomeContent, CmsSiteChrome} from '@/lib/cms/types'
import {
  V8_BUYERS,
  V8_HOMEPAGE_BUYER_IDS,
  V8_HOMEPAGE_DESIGN_JOURNEY,
  V8_HOMEPAGE_PROBLEMS,
  V8_HOMEPAGE_PRODUCTION_STEPS,
  V8_HOMEPAGE_SOLUTIONS,
  cmsProductionMediaToV8Assets,
  getV8Cta,
  getV8PageConfig,
} from '@/lib/v8'
import type {V8FaqItem} from '@/lib/v8/types.ts'
import {getV8ProductionAssetsForPage} from '@/lib/real-production/registry.ts'
import {getProductVisualization} from '@/lib/product-visualization/registry.ts'
import {BuyerProblems} from './BuyerProblems'
import {CustomerSegmentation} from './CustomerSegmentation'
import {DesignJourney} from './DesignJourney'
import {FAQSection} from './FAQSection'
import {FinalCTA} from './FinalCTA'
import {ProductionProof} from './ProductionProof'
import {ProjectQualificationForm} from './ProjectQualificationForm'
import {SolutionCards} from './SolutionCards'
import {V8Hero} from './V8Hero'
import {MockupToFinished} from './MockupToFinished'
import {SampleInspectionProof} from './SampleInspectionProof'
import {PackingProof} from './PackingProof'
import {RealProductGallery} from './RealProductGallery'
import {ProductVisualizationSection} from './ProductVisualizationSection'

export function HomepageV8({content, chrome, faqs, privacyPolicyApproved}: {content: CmsHomeContent; chrome: CmsSiteChrome; faqs: readonly V8FaqItem[]; privacyPolicyApproved: boolean}) {
  const page = getV8PageConfig('home')
  const buyers = V8_HOMEPAGE_BUYER_IDS.map((id) => V8_BUYERS.find((buyer) => buyer.id === id)).filter((buyer): buyer is (typeof V8_BUYERS)[number] => Boolean(buyer))
  const media = cmsProductionMediaToV8Assets(content.productionMedia)
  const realProofMedia = [...media, ...getV8ProductionAssetsForPage('home')]
  const heroVisualization = getProductVisualization('PV-HOME-001')
  const categoryVisualizations = [
    getProductVisualization('PV-SOCCER-001'),
    getProductVisualization('PV-BASEBALL-001'),
  ]
  const startDesign = getV8Cta('start-design')
  const freeMockup = getV8Cta('free-mockup')
  const requestSample = getV8Cta('request-sample')

  return (
    <>
      <V8Hero config={page.hero} visualization={heroVisualization} visualizationPage="/" />

      <HomepageGeoEntitySections showCustomerSegments={false} />

      <ProductVisualizationSection
        assets={categoryVisualizations}
        page="/"
        eyebrow="Sport Categories"
        title="Soccer and Baseball Teamwear Visualizations"
        description="Explore approved POXIOL product visualizations for additional teamwear categories."
      />

      <RealProductGallery
        assets={realProofMedia}
        eyebrow="Real Product Proof"
        title="A Finished POXIOL Basketball Sample"
        description="Review original product photographs of the same POXIOL jersey and shorts set, including front, back and construction details."
      />

      <CustomerSegmentation
        buyers={buyers}
        eyebrow="Customer Segments"
        title="Who We Help"
        description="Custom teamwear support for teams and B2B partners with different design, approval and production needs."
      />

      <BuyerProblems
        items={V8_HOMEPAGE_PROBLEMS}
        title="Remove Uncertainty Before Production"
        description="Use design review, sample approval and quality checks to make project decisions before shipment."
      />

      <DesignJourney
        steps={V8_HOMEPAGE_DESIGN_JOURNEY}
        cta={startDesign}
        title="From Your Idea to Finished Uniforms"
        description="A clear custom teamwear journey from the first reference through sample review, production, quality control and shipment."
      />

      <MockupToFinished assets={realProofMedia} />

      <SampleInspectionProof assets={realProofMedia} />

      <ProductionProof
        steps={V8_HOMEPAGE_PRODUCTION_STEPS}
        media={media}
        title="Production Proof, Only When Verified"
        description="CMS media appears here only after it is approved as authentic POXIOL production evidence."
      />

      <PackingProof assets={realProofMedia} />

      <SolutionCards
        items={V8_HOMEPAGE_SOLUTIONS}
        title="Choose the Right Teamwear Path"
        description="Start from the sport or buyer program that best matches your project."
      />

      <section id="contact" className="bg-neutral-900 px-5 py-16 text-white md:px-10 md:py-24 xl:px-20" aria-labelledby="v8-home-inquiry-title">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <div id="v8-home-inquiry-title"><SectionHeading eyebrow="Project Details" title={content.inquiryTitle} dark /></div>
            <p className="mt-6 text-lg leading-8 text-neutral-400">{content.inquiryDescription}</p>
            <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <h3 className="text-sm font-black uppercase tracking-widest text-[#B6FF00]">{content.inquirySupportTitle}</h3>
              <p className="mt-4 text-sm leading-7 text-neutral-400">{content.inquirySupportDescription}</p>
              <a href={chrome.whatsappHref} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center text-sm font-black uppercase tracking-wide text-white underline decoration-[#25D366] decoration-2 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25D366]">Open WhatsApp</a>
            </div>
          </div>
          <noscript>
            <div className="rounded-2xl border border-yellow-400 bg-yellow-50 p-6 text-neutral-950">
              <p className="font-semibold">If the form does not load, send your sport, product type, quantity, delivery country, target date and logo files by email or WhatsApp.</p>
              <p className="mt-2"><a href={emailHref(chrome.publicEmail)} className="underline"><EmailAddress email={chrome.publicEmail} /></a></p>
            </div>
          </noscript>
          <ProjectQualificationForm
            intent="mockup"
            formType="Homepage V8 Lead"
            publicEmail={chrome.publicEmail}
            whatsappHref={chrome.whatsappHref}
            privacyPolicyApproved={privacyPolicyApproved}
          />
        </div>
      </section>

      <FAQSection faqs={faqs} schema={false} title="Custom Teamwear Questions" />

      <FinalCTA
        title="Ready To Build Your Team Uniform?"
        description="Share your idea for a free mockup, or request a sample before planning bulk production."
        primary={freeMockup}
        secondary={requestSample}
      />
    </>
  )
}
