import type {V8Cta, V8CtaId} from './types.ts'

export const V8_CTAS: readonly V8Cta[] = [
  {
    id: 'free-mockup',
    label: 'Get Free Mockup',
    href: '/free-mockup/',
    description: 'Share your idea, logo or reference for a teamwear mockup based on the confirmed project requirements.',
  },
  {
    id: 'start-project',
    label: 'Start Your Team Project',
    href: '/free-mockup/',
    description: 'Share your project requirements for design and production review.',
  },
  {
    id: 'start-design',
    label: 'Start Your Team Design',
    href: '/free-mockup/',
    description: 'Start with your idea, logo or reference and confirm the design before production.',
  },
  {
    id: 'get-quote',
    label: 'Get a Project Quote',
    href: '/get-quote/',
    description: 'Provide quantity, timing and customization details for a project quote.',
  },
  {
    id: 'request-sample',
    label: 'Request Sample',
    href: '/sample-order/',
    description: 'Confirm sample requirements before bulk production.',
  },
] as const

export function getV8Cta(id: V8CtaId): V8Cta {
  const cta = V8_CTAS.find((item) => item.id === id)
  if (!cta) throw new Error(`Unknown V8 CTA: ${id}`)
  return cta
}
