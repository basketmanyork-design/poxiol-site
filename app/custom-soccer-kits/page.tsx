import type { Metadata } from "next";
import SportsLandingPage from "@/components/sports/SportsLandingPage";
import { getSportsPageBySlug } from "@/lib/sports-pages";
import StructuredData from "@/components/seo/StructuredData";
import { soccerPageSchema } from "@/lib/seo-data";

const pageData = getSportsPageBySlug("custom-soccer-kits");

export const metadata: Metadata = {
  title: pageData?.metaTitle,
  description: pageData?.metaDescription,
};

export default function Page() {
  if (!pageData) return null;
  return (
    <>
      <StructuredData data={soccerPageSchema} />
      <SportsLandingPage data={pageData} />
    </>
  );
}
