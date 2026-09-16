# URL and asset map

Source directory: `E:\Poxiol团队\POXIOL独立站\最新素材`. Originals were read only. `asset-manifest.json` records their SHA-256 hashes, size and each 480/800 WebP derivative. All six PNG sources are 1122×1402, portrait 4:5-like illustrations; CSS displays at 4:5 with centered `object-fit: contain`, so the garment remains visible at desktop and mobile widths. `alt` text describes the pictured garment and explicitly says “design illustration”. The video is the supplied 22-second 720p MP4, copied byte-for-byte to `public/website-optimization/poxiol-hero-22s-720p.mp4`; it has visible HTML copy, native controls, metadata preload and a pre-existing poster fallback.

| Source | Category and garment | Derived public path prefix | Card target and inquiry path |
|---|---|---|---|
| PNG `(1)` | Soccer jersey and shorts | `soccer-{480,800}.webp` | `/products/soccer-jerseys/` → project inquiry |
| PNG `(2)` | Basketball jersey and shorts | `basketball-{480,800}.webp` | `/products/basketball-uniforms/` → project inquiry |
| PNG `(3)` | Baseball jersey and trousers | `baseball-{480,800}.webp` | `/custom-baseball-softball-uniforms/` → project inquiry |
| PNG `(4)` | Training top and shorts | `training-{480,800}.webp` | `/products/training-wear/` → project inquiry |
| PNG `(5)` | Running singlet and shorts | `running-track-{480,800}.webp` | `/products/running-track-uniforms/` → project inquiry |
| PNG `(6)` | Warm-up jacket and trousers | `warm-up-{480,800}.webp` | `/products/warm-up-wear/` → project inquiry |

The two new category routes use the same illustrations and a direct `Discuss This Product` action. The four existing card routes retain their previous route content and have a visible direct inquiry entrance. The shared product detail route also sends its displayed product title and source path as editable buyer context, without manufacturing a SKU. `/products/` remains the broad catalog entry. The six category routes are included in the sitemap, with existing SEO conventions. Current canonical Production host remains `https://www.poxiol.com/`; preview response indexing is controlled by Cloudflare's preview headers after a remote preview is created and verified.

Factory and proof media were not replaced with the seven supplied design assets. Their existing verified-media rules and pages remain under the original repository's content governance. A final review should inspect both the six card-to-route matches and any production-related media claims before release.
