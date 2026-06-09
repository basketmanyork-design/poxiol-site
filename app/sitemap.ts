import { MetadataRoute } from "next";
import { sportsPages } from "@/lib/sports-pages";
import { caseStudies } from "@/lib/case-studies";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.poxiol.com";

  // 1. Static Pages
  const staticPages = [
    "",
    "/sports/",
    "/projects/",
    "/contact/",
    "/free-mockup/",
    "/oem-odm/",
    "/manufacturing/",
    "/about/",
    "/faq/",
    "/fabric-guide/",
    "/printing-guide/",
    "/resources/",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // 2. Sports Category Pages
  const sportsRoutes = sportsPages.map((sport) => ({
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
    priority: 0.6,
  }));

  return [...staticPages, ...sportsRoutes, ...projectRoutes];
}
