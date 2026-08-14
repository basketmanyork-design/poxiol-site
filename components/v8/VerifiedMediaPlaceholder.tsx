import Image from 'next/image'
import {resolveVerifiedMedia, V8_MEDIA_FALLBACK} from '@/lib/v8/media.ts'
import type {V8MediaAsset} from '@/lib/v8/types.ts'

const COMPLETE_PRODUCT_STAGES = new Set(['full-set','front','back','shorts','shorts-front','shorts-back'])

export function VerifiedMediaPlaceholder({asset, className = '', priority = false}: {asset?: V8MediaAsset | null; className?: string; priority?: boolean}) {
  const media = resolveVerifiedMedia(asset)

  if (!media || (media.kind === 'video' && !media.poster)) {
    return (
      <figure
        className={`flex min-h-64 items-center justify-center rounded-3xl border border-dashed border-neutral-300 bg-neutral-100 p-8 text-center ${className}`}
        role="img"
        aria-label={V8_MEDIA_FALLBACK}
      >
        <figcaption className="max-w-xs text-sm font-bold uppercase tracking-[0.14em] text-neutral-500">
          {V8_MEDIA_FALLBACK}
        </figcaption>
      </figure>
    )
  }

  if (media.kind === 'video') {
    return (
      <figure className={`overflow-hidden rounded-3xl bg-neutral-950 ${className}`}>
        <video className="aspect-video h-full w-full object-cover" controls preload="none" poster={media.poster} aria-label={media.alt || media.caption || 'Verified POXIOL production video'}>
          <source src={media.url} />
        </video>
        {media.caption ? <figcaption className="px-5 py-4 text-sm text-neutral-300">{media.caption}</figcaption> : null}
      </figure>
    )
  }

  const showCompleteProduct = COMPLETE_PRODUCT_STAGES.has(media.stage)

  return (
    <figure className={`overflow-hidden rounded-3xl ${showCompleteProduct ? 'bg-white' : 'bg-neutral-100'} ${className}`}>
      <Image src={media.url} alt={media.alt || ''} width={media.width || 1200} height={media.height || 800} sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw" priority={priority} loading={priority ? 'eager' : 'lazy'} className={`${showCompleteProduct ? 'aspect-[4/5] object-contain' : 'aspect-[3/2] object-cover'} h-full w-full`} />
      {media.caption ? <figcaption className="px-5 py-4 text-sm text-neutral-600">{media.caption}</figcaption> : null}
    </figure>
  )
}
