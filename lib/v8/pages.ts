import {GEO_V1} from '../geo-v1.ts'
import type {V8PageConfig, V8PageId} from './types.ts'
import {V8_BUYER_PAGE_CONTENT} from './buyer-pages.ts'

export const V8_PAGE_CONFIGS: readonly V8PageConfig[] = [
  {
    id: 'home',
    label: 'Homepage',
    canonicalPath: '/',
    purpose: 'Main POXIOL sales funnel and brand entity page.',
    hero: {
      eyebrow: 'Professional Custom Teamwear Manufacturer',
      title: 'Custom Teamwear Manufacturer For Clubs, Schools & Sports Brands',
      description: 'From your first idea to finished uniforms, POXIOL helps teams create reliable custom sportswear with professional design support and quality control.',
      primaryCtaId: 'free-mockup',
      secondaryCtaId: 'request-sample',
    },
    buyerIds: ['youth-teams', 'schools', 'clubs', 'sports-brands', 'distributors'],
    problemIds: ['unclear-design', 'order-planning', 'production-visibility'],
    solutionIds: ['design-support', 'sample-approval', 'quality-control'],
  },
  {
    id: 'basketball',
    label: 'Custom Basketball Uniforms',
    canonicalPath: '/products/basketball-uniforms/',
    purpose: 'Only primary basketball commercial landing page.',
    primaryKeyword: 'Custom Basketball Uniform Manufacturer',
    hero: {
      eyebrow: 'Custom Basketball Uniform Manufacturer',
      title: 'Custom Basketball Uniform Manufacturer for Clubs, Schools and Sportswear Brands',
      description: 'Develop basketball jerseys, shorts and team sets with confirmed artwork, sizing, sample and production requirements.',
      primaryCtaId: 'free-mockup',
      secondaryCtaId: 'request-sample',
    },
    buyerIds: ['youth-teams', 'schools', 'clubs', 'sports-brands', 'distributors'],
    problemIds: ['roster-details', 'size-planning', 'design-approval'],
    solutionIds: ['customization', 'sample-approval', 'quality-control'],
  },
  {
    id: 'customization',
    label: 'Customization',
    canonicalPath: '/customization/',
    purpose: 'Design conversion page from idea or reference to mockup and sample.',
    hero: {eyebrow: 'Customization Workflow', title: 'Turn Your Teamwear Idea Into an Approved Design', description: 'Share a logo, reference or brief, then confirm the mockup and sample requirements.', primaryCtaId: 'start-project', secondaryCtaId: 'request-sample'},
    buyerIds: ['youth-teams', 'schools', 'clubs', 'sports-brands', 'distributors'],
    problemIds: ['unclear-design', 'artwork-preparation', 'approval-alignment'],
    solutionIds: ['design-support', 'mockup-review', 'sample-approval'],
  },
  {
    id: 'factory',
    label: 'Factory',
    canonicalPath: '/factory/',
    purpose: 'POXIOL company identity and manufacturing capability page.',
    hero: {eyebrow: 'About POXIOL', title: 'POXIOL Teamwear Manufacturing Capability', description: 'Learn who POXIOL is, the sportswear categories supported and how projects connect to manufacturing and quality control.', primaryCtaId: 'start-project', secondaryCtaId: 'get-quote'},
    buyerIds: ['youth-teams', 'schools', 'clubs', 'sports-brands', 'distributors'],
    problemIds: ['supplier-fit', 'capability-clarity'],
    solutionIds: ['company-identity', 'category-capability', 'transparent-workflow'],
  },
  {
    id: 'manufacturing',
    label: 'Manufacturing',
    canonicalPath: '/manufacturing/',
    purpose: 'Production process authority page explaining how custom teamwear is made.',
    hero: {eyebrow: 'Production Process', title: 'How POXIOL Manufactures Custom Teamwear', description: 'Follow the confirmed workflow from design preparation and material selection through packing.', primaryCtaId: 'start-project', secondaryCtaId: 'request-sample'},
    buyerIds: ['youth-teams', 'schools', 'clubs', 'sports-brands', 'distributors'],
    problemIds: ['production-visibility', 'sample-to-bulk'],
    solutionIds: ['manufacturing-workflow', 'sample-approval', 'quality-control'],
  },
  {
    id: 'quality-control',
    label: 'Quality Control',
    canonicalPath: '/quality-control-process/',
    purpose: 'Quality authority page explaining how uniform quality is verified.',
    hero: {eyebrow: 'Quality Control Process', title: 'How POXIOL Verifies Custom Uniform Quality', description: 'Review the checks applied to materials, printing, sewing, sizing, finished items and packing.', primaryCtaId: 'request-sample', secondaryCtaId: 'get-quote'},
    buyerIds: ['youth-teams', 'schools', 'clubs', 'sports-brands', 'distributors'],
    problemIds: ['quality-consistency', 'specification-control'],
    solutionIds: ['stage-checks', 'final-inspection', 'packing-verification'],
  },
  ...V8_BUYER_PAGE_CONTENT.map((page) => ({
    id: page.pageId,
    label: page.label,
    canonicalPath: page.canonicalPath,
    purpose: page.purpose,
    hero: {
      eyebrow: page.heroEyebrow,
      title: page.heroTitle,
      description: page.heroDescription,
      primaryCtaId: page.heroPrimaryCtaId,
      secondaryCtaId: page.heroSecondaryCtaId,
    },
    buyerIds: page.buyerIds,
    problemIds: page.problems.map((item) => item.id),
    solutionIds: page.solutions.map((item) => item.id),
  })),
] as const

export function getV8PageConfig(pageId: V8PageId): V8PageConfig {
  const page = V8_PAGE_CONFIGS.find((item) => item.id === pageId)
  if (!page) throw new Error(`Unknown V8 page: ${pageId}`)
  return page
}
