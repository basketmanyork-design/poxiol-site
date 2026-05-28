import type { Metadata } from "next";
import SportsLandingPage from "@/components/sports/SportsLandingPage";
import { getSportsPageBySlug } from "@/lib/sports-pages";

const pageData = getSportsPageBySlug("custom-basketball-uniforms");

import StructuredData from "@/components/seo/StructuredData";
import { basketballPageSchema } from "@/lib/seo-data";

export const metadata: Metadata = {
  title: pageData?.metaTitle,
  description: pageData?.metaDescription,
};

export default function Page() {
  if (!pageData) return null;
  return (
    <>
      <StructuredData data={basketballPageSchema} />
      <SportsLandingPage data={pageData} />
    </>
  );
}
