import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/_next/static/", "/assets/", "/images/"],
        disallow: [
          "/api/", 
          "/_next/", 
          "/static/",
          "/thank-you/",
          "/quote-received/",
          "/sample-request-received/",
          "/admin/",
          "/cart/",
          "/checkout/",
          "/?s="
        ],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
      }
    ],
    sitemap: "https://www.poxiol.com/sitemap.xml",
  };
}
