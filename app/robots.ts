import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/", 
        "/_next/", 
        "/static/",
        "/thank-you/",
        "/quote-received/",
        "/sample-request-received/"
      ],
    },
    sitemap: "https://www.poxiol.com/sitemap.xml",
  };
}
