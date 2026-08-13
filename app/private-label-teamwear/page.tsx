import type {Metadata} from 'next'
import {V8BuyerLandingPage} from '@/components/v8/V8BuyerLandingPage'
import {getV8BuyerPageMetadata} from '@/lib/v8'

export const metadata: Metadata = getV8BuyerPageMetadata('private-label-teamwear')

export default function Page() {
  return <V8BuyerLandingPage pageId="private-label-teamwear" />
}
