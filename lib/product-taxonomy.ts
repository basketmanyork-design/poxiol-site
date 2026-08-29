import {contextualInquiryHref, publicSourcePath} from './inquiry-context.ts'

export type SportContentStage = 'deep-page' | 'project-review'

export type SportId =
  | 'soccer'
  | 'basketball'
  | 'track-field'
  | 'badminton'
  | 'volleyball'
  | 'baseball-softball'
  | 'ice-hockey'
  | 'american-football'
  | 'rugby'
  | 'tennis'
  | 'cricket'
  | 'golf'

export type ScenarioId = 'match-day' | 'warm-up-training' | 'off-field-travel'

export type SportCategory = {
  id: SportId
  label: string
  shortLabel: string
  description: string
  contentStage: SportContentStage
  href: string
  inquiryProduct: string
}

export type WearingScenario = {
  id: ScenarioId
  label: string
  description: string
  productGroups: readonly string[]
  inquiryProduct: string
}

export const SPORT_CATEGORIES = [
  {
    id: 'soccer',
    label: 'Soccer',
    shortLabel: 'Soccer Kits',
    description: 'Review match, training and travel needs for a soccer program; final construction is confirmed during project review.',
    contentStage: 'deep-page',
    href: '/products/soccer-jerseys/',
    inquiryProduct: 'Soccer Teamwear Program',
  },
  {
    id: 'basketball',
    label: 'Basketball',
    shortLabel: 'Basketball Uniforms',
    description: 'Review uniforms and supporting teamwear for a basketball program; final construction is confirmed during project review.',
    contentStage: 'deep-page',
    href: '/products/basketball-uniforms/',
    inquiryProduct: 'Basketball Teamwear Program',
  },
  {
    id: 'track-field',
    label: 'Track & Field',
    shortLabel: 'Track & Field',
    description: 'Discuss competition, warm-up and travel apparel for a track and field program through project review.',
    contentStage: 'project-review',
    href: '/products/',
    inquiryProduct: 'Track & Field Teamwear Program',
  },
  {
    id: 'badminton',
    label: 'Badminton',
    shortLabel: 'Badminton Teamwear',
    description: 'Discuss competition, training and off-court apparel for a badminton program through project review.',
    contentStage: 'project-review',
    href: '/products/',
    inquiryProduct: 'Badminton Teamwear Program',
  },
  {
    id: 'volleyball',
    label: 'Volleyball',
    shortLabel: 'Volleyball Uniforms',
    description: 'Discuss match, training and travel apparel for a volleyball program through project review.',
    contentStage: 'project-review',
    href: '/products/',
    inquiryProduct: 'Volleyball Teamwear Program',
  },
  {
    id: 'baseball-softball',
    label: 'Baseball & Softball',
    shortLabel: 'Baseball & Softball',
    description: 'Review uniforms and supporting teamwear for a baseball or softball program; final construction is confirmed during project review.',
    contentStage: 'deep-page',
    href: '/custom-baseball-softball-uniforms/',
    inquiryProduct: 'Baseball & Softball Teamwear Program',
  },
  {
    id: 'ice-hockey',
    label: 'Ice Hockey',
    shortLabel: 'Ice Hockey Teamwear',
    description: 'Discuss match, warm-up and travel apparel for an ice hockey program through project review.',
    contentStage: 'project-review',
    href: '/products/',
    inquiryProduct: 'Ice Hockey Teamwear Program',
  },
  {
    id: 'american-football',
    label: 'American Football',
    shortLabel: 'American Football',
    description: 'Discuss game, training and travel apparel for an American football program through project review.',
    contentStage: 'project-review',
    href: '/products/',
    inquiryProduct: 'American Football Teamwear Program',
  },
  {
    id: 'rugby',
    label: 'Rugby',
    shortLabel: 'Rugby Teamwear',
    description: 'Discuss match, training and travel apparel for a rugby program through project review.',
    contentStage: 'project-review',
    href: '/products/',
    inquiryProduct: 'Rugby Teamwear Program',
  },
  {
    id: 'tennis',
    label: 'Tennis',
    shortLabel: 'Tennis Teamwear',
    description: 'Discuss competition, warm-up and off-court apparel for a tennis program through project review.',
    contentStage: 'project-review',
    href: '/products/',
    inquiryProduct: 'Tennis Teamwear Program',
  },
  {
    id: 'cricket',
    label: 'Cricket',
    shortLabel: 'Cricket Teamwear',
    description: 'Discuss match, training and travel apparel for a cricket program through project review.',
    contentStage: 'project-review',
    href: '/products/',
    inquiryProduct: 'Cricket Teamwear Program',
  },
  {
    id: 'golf',
    label: 'Golf',
    shortLabel: 'Golf Teamwear',
    description: 'Discuss competition, training and off-course apparel for a golf program through project review.',
    contentStage: 'project-review',
    href: '/products/',
    inquiryProduct: 'Golf Teamwear Program',
  },
] as const satisfies readonly SportCategory[]

export const WEARING_SCENARIOS = [
  {
    id: 'match-day',
    label: 'Match Day',
    description: 'Competition uniforms and coordinated match components, confirmed for the selected sport and project.',
    productGroups: ['Competition uniforms', 'Coordinated match components'],
    inquiryProduct: 'Match Day Teamwear',
  },
  {
    id: 'warm-up-training',
    label: 'Warm-Up & Training',
    description: 'Training tops, warm-up layers, tracksuits and practice apparel, confirmed during project review.',
    productGroups: ['Training tops', 'Warm-up layers', 'Tracksuits', 'Practice apparel'],
    inquiryProduct: 'Warm-Up & Training Teamwear',
  },
  {
    id: 'off-field-travel',
    label: 'Off-Field & Travel',
    description: 'Hoodies, jackets, polos, travel sets and team accessories, confirmed during project review.',
    productGroups: ['Hoodies', 'Jackets', 'Polos', 'Travel sets', 'Team accessories'],
    inquiryProduct: 'Off-Field & Travel Teamwear',
  },
] as const satisfies readonly WearingScenario[]

export function getSportCategory(id: string) {
  return SPORT_CATEGORIES.find((item) => item.id === id)
}

export function getScenario(id: string) {
  return WEARING_SCENARIOS.find((item) => item.id === id)
}

export function productDiscoveryInquiryHref({
  sport: sportId,
  scenario: scenarioId,
  source = '/products/',
}: {
  sport: string
  scenario?: string
  source?: string
}) {
  const sport = getSportCategory(sportId)
  if (!sport) return '/products/'
  const scenario = scenarioId ? getScenario(scenarioId) : undefined
  if (scenarioId && !scenario) return '/products/'

  return contextualInquiryHref('/get-quote/', {
    product: scenario ? `${sport.label} - ${scenario.label}` : sport.inquiryProduct,
    sport: sport.label,
    style: '',
    source: publicSourcePath(source) || '/products/',
  })
}
