import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SportsLandingPage from "@/components/sports/SportsLandingPage";
import { getSportsPageBySlug } from "@/lib/sports-pages";
import { getCmsSportsPageBySlug } from "@/lib/sanity/content";
import { createPageMetadata, PRESERVED_ROOT_TWITTER_METADATA } from "@/lib/seo/page-metadata";

const slug = "products/training-wear";
const legacyPageData = getSportsPageBySlug(slug);

async function resolvePageData() {
  if (!legacyPageData) return null;
  return getCmsSportsPageBySlug(legacyPageData);
}

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await resolvePageData();
  if (!pageData) return {};
  return createPageMetadata({
    title: pageData.metaTitle,
    description: pageData.metaDescription,
    canonical: "https://www.poxiol.com/" + pageData.slug + "/",
    metadata: {
      robots: pageData.noIndex ? {index: false, follow: false} : undefined,
      twitter: PRESERVED_ROOT_TWITTER_METADATA,
    },
  });
}

export default async function Page() {
  const pageData = await resolvePageData();
  if (!pageData) notFound();
  return <SportsLandingPage data={pageData} />;
}
