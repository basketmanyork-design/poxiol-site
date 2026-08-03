import DynamicGuidePage, {generateMetadata as generateGuideMetadata} from '../[slug]/page'

const params = {slug: 'b2b-sourcing-faq'}

export function generateMetadata() {
  return generateGuideMetadata({params})
}

export default function B2BSourcingFAQPage() {
  return DynamicGuidePage({params})
}
