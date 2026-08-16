import {CoreSportLandingPage} from '@/components/core-sports/CoreSportLandingPage'
import {getCoreSportMetadata} from '@/lib/core-sports'

export const metadata = getCoreSportMetadata('soccer')

export default function Page() {
  return <CoreSportLandingPage sportId="soccer" />
}
