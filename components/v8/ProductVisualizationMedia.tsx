import Image from 'next/image'
import {canDisplayProductVisualization} from '@/lib/product-visualization/policy.ts'
import type {ProductVisualizationAsset} from '@/lib/product-visualization/types.ts'

export function ProductVisualizationMedia({asset, page, priority = false, showCaption = true, className = ''}: {asset: ProductVisualizationAsset; page?: string; priority?: boolean; showCaption?: boolean; className?: string}) {
  if (!canDisplayProductVisualization(asset, page)) return null

  return (
    <figure className={`overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm ${className}`}>
      <div className="relative bg-neutral-50">
        <Image
          src={asset.publicPath}
          alt={asset.alt}
          width={asset.width}
          height={asset.height}
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 42vw"
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          className="h-auto w-full object-contain"
        />
        <span className="absolute bottom-3 left-3 rounded-full bg-neutral-950/90 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.14em] text-white">
          Product visualization
        </span>
      </div>
      {showCaption ? <figcaption className="px-5 py-4 text-sm leading-6 text-neutral-600">{asset.caption}</figcaption> : null}
    </figure>
  )
}
