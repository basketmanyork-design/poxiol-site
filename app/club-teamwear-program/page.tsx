import type {Metadata} from 'next'
import {V8BuyerLandingPage} from '@/components/v8/V8BuyerLandingPage'
import {getV8BuyerPageMetadata} from '@/lib/v8'

export const metadata: Metadata = getV8BuyerPageMetadata('club-teamwear-program')

export default function Page() {
  return <V8BuyerLandingPage pageId="club-teamwear-program" />
}
