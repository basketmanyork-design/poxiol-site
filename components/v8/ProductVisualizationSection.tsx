import type {ProductVisualizationAsset} from '@/lib/product-visualization/types.ts'
import {ProductVisualizationMedia} from './ProductVisualizationMedia'

type Layout = 'cards' | 'walkthrough' | 'single'

export function ProductVisualizationSection({assets, page, eyebrow = 'Product Visualization', title, description, layout = 'cards'}: {assets: readonly ProductVisualizationAsset[]; page: string; eyebrow?: string; title: string; description: string; layout?: Layout}) {
  if (!assets.length) return null

  if (layout === 'walkthrough') {
    return (
      <section className="bg-neutral-950 px-5 py-16 text-white md:px-10 md:py-24 xl:px-20" aria-labelledby="product-visualization-walkthrough-title">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#B6FF00]">{eyebrow}</p>
          <h2 id="product-visualization-walkthrough-title" className="mt-4 max-w-4xl text-3xl font-black uppercase tracking-tight md:text-5xl">{title}</h2>
          <p className="mt-5 max-w-3xl text-base leading-8 text-neutral-300">{description}</p>
          <ol className="mt-12 space-y-10" aria-label={title}>
            {assets.map((asset, index) => (
              <li key={asset.assetId} className="grid min-w-0 gap-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 md:p-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(16rem,0.35fr)] lg:items-center lg:gap-10">
                <ProductVisualizationMedia asset={asset} page={page} showCaption={false} />
                <div className="min-w-0 px-2 pb-3 lg:px-0 lg:pb-0">
                  <p className="text-sm font-black text-[#B6FF00]">{String(index + 1).padStart(2, '0')}</p>
                  <p className="mt-3 break-words text-lg font-black uppercase tracking-tight text-white">{asset.category.replaceAll('-', ' ')}</p>
                  <p className="mt-4 text-sm leading-7 text-neutral-300">{asset.caption}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    )
  }

  const gridClass = layout === 'single' ? 'mx-auto max-w-3xl' : 'grid gap-6 md:grid-cols-2'
  return (
    <section className="bg-white px-5 py-16 text-neutral-950 md:px-10 md:py-24 xl:px-20" aria-labelledby={`product-visualization-${layout}-title`}>
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-lime-700">{eyebrow}</p>
        <h2 id={`product-visualization-${layout}-title`} className="mt-4 max-w-4xl text-3xl font-black uppercase tracking-tight md:text-5xl">{title}</h2>
        <p className="mt-5 max-w-3xl text-base leading-8 text-neutral-600">{description}</p>
        <div className={`mt-10 ${gridClass}`}>
          {assets.map((asset) => <ProductVisualizationMedia key={asset.assetId} asset={asset} page={page} />)}
        </div>
      </div>
    </section>
  )
}
