import {V8_PROCESSES} from './processes.ts'
import type {V8ContentCard, V8ProcessStep} from './types.ts'

export const V8_HOMEPAGE_BUYER_IDS = ['youth-teams', 'schools', 'clubs', 'sports-brands', 'distributors'] as const

export const V8_HOMEPAGE_PROBLEMS: readonly V8ContentCard[] = [
  {id: 'design-confidence', title: 'Will my design look correct?', description: 'Free Mockup Before Production'},
  {id: 'quality-confidence', title: 'Will quality match expectations?', description: 'Sample Approval Before Bulk Order'},
  {id: 'production-confidence', title: 'Will production be reliable?', description: 'Quality Check Before Shipment'},
] as const

const homepageJourneyIds = new Set(['idea', 'mockup', 'sample', 'production', 'qc', 'shipment'])
export const V8_HOMEPAGE_DESIGN_JOURNEY = V8_PROCESSES.journey.filter((step) => homepageJourneyIds.has(step.id))

export const V8_HOMEPAGE_PRODUCTION_STEPS: readonly V8ProcessStep[] = [
  {id: 'fabric-inspection', title: 'Fabric Inspection', description: 'Verified media can document material review for a confirmed project.'},
  {id: 'printing', title: 'Printing', description: 'Verified media can document the approved printing workflow.'},
  {id: 'cutting', title: 'Cutting', description: 'Verified media can document material cutting for confirmed specifications.'},
  {id: 'sewing', title: 'Sewing', description: 'Verified media can document garment construction.'},
  {id: 'qc', title: 'Quality Control', description: 'Verified media can document checks against confirmed requirements.'},
  {id: 'packing', title: 'Packing', description: 'Verified media can document packing preparation before shipment.'},
] as const

export const V8_HOMEPAGE_SOLUTIONS: readonly V8ContentCard[] = [
  {
    id: 'basketball-uniforms',
    title: 'Custom Basketball Uniforms',
    audience: 'For youth teams, schools, clubs and basketball brands',
    description: 'Develop jerseys, shorts and team sets with confirmed artwork, names, numbers and sizing requirements.',
    href: '/products/basketball-uniforms/',
    ctaLabel: 'Explore Basketball Uniforms',
  },
  {
    id: 'soccer-kits',
    title: 'Custom Soccer Kits',
    audience: 'For clubs, schools and academies',
    description: 'Coordinate match kits and team identity through a clear design and approval workflow.',
    href: '/products/soccer-jerseys/',
    ctaLabel: 'Explore Soccer Kits',
  },
  {
    id: 'baseball-uniforms',
    title: 'Custom Baseball Uniforms',
    audience: 'For youth programs, schools, clubs and baseball brands',
    description: 'Plan jerseys, pants and full uniform programs with confirmed artwork, roster, sizing and sample requirements.',
    href: '/custom-baseball-softball-uniforms/',
    ctaLabel: 'Explore Baseball Uniforms',
  },
] as const
