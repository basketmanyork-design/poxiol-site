import type {CmsSeo} from '@/lib/cms/types'

type PlanningSeoCopy = Pick<CmsSeo, 'title' | 'description'>

const planningSeoBySlug: Record<string, PlanningSeoCopy> = {
  'usa-basketball-academy-uniform-program': {
    title: 'Basketball Academy Planning Scenario | POXIOL',
    description: 'Plan a basketball academy uniform program, including reversible sets, player numbers, size grouping, sample review and tournament scheduling.',
  },
  'australia-soccer-club-kit-project': {
    title: 'Soccer Club Kit Planning Scenario | POXIOL',
    description: 'Plan a soccer club home-and-away kit program, including color matching, mockup confirmation, player details and bulk-order checkpoints.',
  },
  'school-athletics-multi-sport-program': {
    title: 'School Multi-Sport Planning Scenario | POXIOL',
    description: 'Plan a school multi-sport uniform program across basketball, volleyball and training wear with coordinated branding, sizing and review steps.',
  },
  'middle-east-sports-event-program': {
    title: 'Sports Event Uniform Planning Scenario | POXIOL',
    description: 'Plan a sports-event uniform program for staff and participants, including quantity planning, packing organization and delivery checkpoints.',
  },
  'distributor-bulk-teamwear-program': {
    title: 'Teamwear Distributor Planning Scenario | POXIOL',
    description: 'Plan a distributor teamwear program across multiple product categories with repeat-order structure, quality checkpoints and packing requirements.',
  },
}

const genericPlanningSeo: PlanningSeoCopy = {
  title: 'Teamwear Planning Scenario | POXIOL',
  description: 'Plan a custom teamwear program using an evidence-neutral scenario for briefing, sample review, quality checkpoints, packing requirements and target delivery timing.',
}

export function projectPlanningSeo(slug: string): CmsSeo {
  const copy = Object.hasOwn(planningSeoBySlug, slug) ? planningSeoBySlug[slug] : genericPlanningSeo
  return {
    ...copy,
    canonicalUrl: `https://www.poxiol.com/projects/${slug}/`,
  }
}

export function resolveProjectSeoForEvidence({
  slug,
  evidenceVerified,
  resolvedSeo,
}: {
  slug: string
  evidenceVerified: boolean
  resolvedSeo: CmsSeo
}): CmsSeo {
  if (evidenceVerified) return resolvedSeo
  const planningSeo = projectPlanningSeo(slug)
  return {
    ...resolvedSeo,
    title: planningSeo.title,
    description: planningSeo.description,
  }
}
