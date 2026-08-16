import {GEO_V1} from '../geo-v1.ts'
import type {V8Buyer} from './types.ts'

export const V8_BRAND = {
  name: GEO_V1.organization.name,
  organizationId: GEO_V1.organization.id,
  canonicalBaseUrl: GEO_V1.canonicalBaseUrl,
  positioning: 'Professional Custom Teamwear Manufacturer',
  valueProposition: GEO_V1.homepage.heroDescription,
  entityDescription: GEO_V1.organization.description,
} as const

export const V8_BUYERS: readonly V8Buyer[] = [
  {
    id: 'youth-teams',
    title: 'Youth Teams',
    description: 'Custom team uniforms planned around roster, sizing and approved design requirements.',
    href: '/youth-team-uniforms/',
  },
  {
    id: 'schools',
    title: 'Schools',
    description: 'Coordinated teamwear support for school programs and academies.',
    href: '/school-teamwear/',
  },
  {
    id: 'clubs',
    title: 'Sports Clubs',
    description: 'Custom basketball, soccer and baseball kits for club teams and programs.',
    href: '/club-teamwear-program/',
  },
  {
    id: 'sports-brands',
    title: 'Sports Brands',
    description: 'OEM and private label production based on confirmed brand specifications.',
    href: '/private-label-teamwear/',
  },
  {
    id: 'distributors',
    title: 'Distributors',
    description: 'Custom teamwear sourcing support for confirmed wholesale requirements.',
    href: '/get-quote/',
  },
] as const
