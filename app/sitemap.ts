import { MetadataRoute } from "next";
import {sitemapEntries} from "@/lib/canonical-architecture";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.poxiol.com";
  return sitemapEntries().map((entry) => ({
    url: `${baseUrl}${entry.path === "/" ? "" : entry.path}`,
    changeFrequency: "weekly" as const,
    priority: entry.path === "/" ? 1.0 : entry.path.split('/').filter(Boolean).length === 1 ? 0.8 : 0.7,
  }));
}
