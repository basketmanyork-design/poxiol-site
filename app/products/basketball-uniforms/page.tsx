import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BasketballV8LandingPage } from "@/components/v8/BasketballV8LandingPage";
import { getSportsPageBySlug } from "@/lib/sports-pages";
import { getBasketballDecisionPage } from "@/lib/sanity/content";

const slug = "products/basketball-uniforms";
const legacyPageData = getSportsPageBySlug(slug);

async function resolvePageData() {
  if (!legacyPageData) return null;
  return getBasketballDecisionPage(legacyPageData);
}

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await resolvePageData();
  return {
    title: pageData?.metaTitle,
    robots: pageData?.noIndex ? {index: false, follow: false} : undefined,
    description: pageData?.metaDescription,
    alternates: { canonical: pageData ? "https://www.poxiol.com/" + pageData.slug + "/" : undefined },
  };
}

export default async function Page() {
  const pageData = await resolvePageData();
  if (!pageData) notFound();
  return <BasketballV8LandingPage data={pageData} />;
}
