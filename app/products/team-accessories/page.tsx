import type { Metadata } from "next";
import SportsLandingPage from "@/components/sports/SportsLandingPage";
import { getSportsPageBySlug } from "@/lib/sports-pages";
import { getCmsSportsPageBySlug } from "@/lib/sanity/content";

const slug = "products/team-accessories";
const legacyPageData = getSportsPageBySlug(slug);

async function resolvePageData() {
  if (!legacyPageData) return null;
  return getCmsSportsPageBySlug(legacyPageData);
}

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await resolvePageData();
  return {
    title: pageData?.metaTitle,
    description: pageData?.metaDescription,
    alternates: { canonical: pageData ? "https://www.poxiol.com/" + pageData.slug + "/" : undefined },
  };
}

export default async function Page() {
  const pageData = await resolvePageData();
  if (!pageData) return null;
  return <SportsLandingPage data={pageData} />;
}