/* eslint-disable @next/next/no-img-element -- Approved static assets retain their original bytes. */
import referenceManifest from '../../content/club-kit-reference/assets.json'

export function SoccerClubKitReferences() {
  return (
    <section className="bg-neutral-950 px-5 py-16 text-white md:px-10 md:py-24 xl:px-20" aria-labelledby="club-kit-reference-title">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-[#B7FF00]">Club Kit Planning</p>
        <h2 id="club-kit-reference-title" className="mt-4 text-3xl font-black uppercase tracking-tight md:text-5xl">Customisation Reference Library</h2>
        <p className="mt-5 max-w-3xl leading-8 text-neutral-300">Review kit components, construction, artwork and finishing options for your club. Product illustrations and original references are labelled separately; final specifications are confirmed with your sample.</p>
        <div className="mt-10 space-y-5">
          {referenceManifest.assets.map((asset, index) => (
            <details key={asset.id} open={index === 0} className="group overflow-hidden rounded-2xl border border-white/15 bg-white/[0.03]" data-club-kit-topic={asset.id}>
              <summary className="cursor-pointer px-5 py-5 text-lg font-black uppercase tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#B7FF00] md:px-7 md:text-xl">
                <span className="mr-3 text-[#B7FF00]">{asset.id}</span>{asset.title}
              </summary>
              <div className="px-3 pb-5 md:px-6 md:pb-7">
                <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#B7FF00]">{asset.kind === 'original-reference' ? 'Original reference' : 'Product illustration'}</p>
                {asset.kind === 'original-reference' ? (
                  <ol className={`grid gap-3 ${asset.id === '02' || asset.id === '03' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5' : 'grid-cols-1 sm:grid-cols-3'}`} aria-label={asset.title}>
                    {asset.crops.map((crop) => (
                      <li key={crop.label} className="min-w-0 overflow-hidden rounded-xl bg-[#F5F6F4] text-neutral-950">
                        <figure>
                          <svg className="block h-auto w-full" viewBox={crop.rect.join(' ')} role="img" aria-label={`${asset.title}: ${crop.label}`} preserveAspectRatio="xMidYMid meet">
                            <title>{`${asset.title}: ${crop.label}`}</title>
                            <image href={asset.src} width={asset.width} height={asset.height} />
                          </svg>
                          <figcaption className="px-3 py-3 text-sm font-bold">{crop.label}</figcaption>
                        </figure>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <img src={asset.src} alt={asset.alt} width={asset.width} height={asset.height} loading="lazy" decoding="async" className="block h-auto w-full rounded-xl" />
                )}
                <p className="mt-4 max-w-4xl text-sm leading-7 text-neutral-300">{asset.caption}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
