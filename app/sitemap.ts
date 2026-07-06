import { MetadataRoute } from "next";
import { sportsPages } from "@/lib/sports-pages";
import { caseStudies } from "@/lib/case-studies";
import { resourcePages } from "@/lib/resources-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.poxiol.com";

  // 1. Static Core Pages
  const staticPages = [
    "",
    "/solutions/",
    "/products/",
    "/design-gallery/",
    "/factory/",
    "/customization/",
    "/about/",
    "/contact/",
    "/free-mockup/",
    "/get-quote/",
    "/sample-order/",
    "/oem-odm/",
    "/resources/",
    "/faq/",
    "/fabric-guide/",
    "/printing-guide/",
    "/certificates-testing/",
    "/quality-control-process/",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // 2. Product Category Pages
  const productRoutes = sportsPages.map((sport) => ({
    url: `${baseUrl}/${sport.slug}/`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // 3. Project Detail Pages
  const projectRoutes = caseStudies.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}/`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 4. Resource Pages (GEO Articles)
  const resourceRoutes = resourcePages.map((page) => ({
    url: `${baseUrl}/resources/${page.slug}/`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productRoutes, ...projectRoutes, ...resourceRoutes];
}
