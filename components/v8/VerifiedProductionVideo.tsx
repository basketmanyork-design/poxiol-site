import type {V8MediaAsset} from '@/lib/v8/types.ts'
import {resolveVerifiedMedia} from '@/lib/v8/media.ts'
import {VerifiedMediaPlaceholder} from './VerifiedMediaPlaceholder'

export function VerifiedProductionVideo({asset}: {asset?: V8MediaAsset | null}) {
  const media = resolveVerifiedMedia(asset)
  if (!media || media.kind !== 'video' || !media.poster) {
    return <VerifiedMediaPlaceholder />
  }
  return <figure className="overflow-hidden rounded-3xl bg-neutral-950"><video className="aspect-video h-auto w-full" controls preload="none" poster={media.poster} aria-label={media.alt || media.caption || 'Verified POXIOL production video'}><source src={media.url} /></video>{media.caption?<figcaption className="px-5 py-4 text-sm leading-6 text-neutral-300">{media.caption}</figcaption>:null}</figure>
}
