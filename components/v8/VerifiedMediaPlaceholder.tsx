import Image from 'next/image'
import {resolveVerifiedMedia, V8_MEDIA_FALLBACK} from '@/lib/v8/media.ts'
import type {V8MediaAsset} from '@/lib/v8/types.ts'

export function VerifiedMediaPlaceholder({asset, className = ''}: {asset?: V8MediaAsset | null; className?: string}) {
  const media = resolveVerifiedMedia(asset)

  if (!media) {
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
        <video className="aspect-video h-full w-full object-cover" controls preload="metadata" aria-label={media.alt || media.caption || 'Verified POXIOL production video'}>
          <source src={media.url} />
        </video>
        {media.caption ? <figcaption className="px-5 py-4 text-sm text-neutral-300">{media.caption}</figcaption> : null}
      </figure>
    )
  }

  return (
    <figure className={`overflow-hidden rounded-3xl bg-neutral-100 ${className}`}>
      <Image src={media.url} alt={media.alt || ''} width={1200} height={800} className="aspect-[3/2] h-full w-full object-cover" />
      {media.caption ? <figcaption className="px-5 py-4 text-sm text-neutral-600">{media.caption}</figcaption> : null}
    </figure>
  )
}
