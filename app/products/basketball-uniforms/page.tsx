import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BasketballV8LandingPage } from "@/components/v8/BasketballV8LandingPage";
import { getSportsPageBySlug } from "@/lib/sports-pages";
import { getBasketballDecisionPage } from "@/lib/sanity/content";
import { getCoreSportMetadata } from "@/lib/core-sports";

const slug = "products/basketball-uniforms";
const legacyPageData = getSportsPageBySlug(slug);

async function resolvePageData() {
  if (!legacyPageData) return null;
  return getBasketballDecisionPage(legacyPageData);
}

export const metadata: Metadata = getCoreSportMetadata("basketball");

export default async function Page() {
  const pageData = await resolvePageData();
  if (!pageData) notFound();
  return <BasketballV8LandingPage data={pageData} />;
}
