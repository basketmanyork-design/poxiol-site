import manifest from "../../content/fabric-library/assets.json";

export function FabricReferenceLibrary() {
  return (
    <div className="mt-16 grid gap-6 text-left md:grid-cols-2 xl:grid-cols-3">
      {manifest.assets.map((fabric) => {
        const [x, y, width, height] = fabric.cropPixels;
        return (
          <article key={fabric.code} data-fabric-id={fabric.code} className="min-w-0 overflow-hidden rounded-[18px] border border-white/15 bg-[#151515]">
            <div className="relative aspect-[4/3] overflow-hidden bg-[#f5f6f4]">
              {/* Native image viewport preserves the approved original JPEG bytes and texture. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={fabric.src} width={fabric.width} height={fabric.height} loading="lazy" decoding="async" alt={fabric.alt}
                className="absolute block h-auto max-w-none"
                style={{width: `${fabric.width / width * 100}%`, left: `${-x / width * 100}%`, top: `${-y / height * 100}%`}} />
            </div>
            <div className="p-6">
              <p className="mb-3 text-xs font-extrabold tracking-[0.14em] text-[#B6FF00]">{fabric.code}</p>
              <h2 className="text-xl font-bold leading-tight">{fabric.title}</h2>
              <p className="mt-4 text-sm leading-6 text-neutral-400">Compare this texture with your teamwear project brief. Confirm the material specification and sample before bulk production.</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
