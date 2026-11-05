import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "POXIOL Teamwear",
    short_name: "POXIOL",
    description:
      "Custom teamwear and sports uniform manufacturing for clubs, schools, brands and distributors.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#132329",
    icons: [
      {
        src: "/favicon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/favicon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
