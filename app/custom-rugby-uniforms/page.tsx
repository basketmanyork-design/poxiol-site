import type { Metadata } from "next";
import SportsLandingPage from "@/components/sports/SportsLandingPage";
import { getSportsPageBySlug } from "@/lib/sports-pages";
import StructuredData from "@/components/seo/StructuredData";
import { rugbyPageSchema } from "@/lib/seo-data";

const pageData = getSportsPageBySlug("custom-rugby-uniforms");

export const metadata: Metadata = {
  title: pageData?.metaTitle,
  description: pageData?.metaDescription,
};

export default function Page() {
  if (!pageData) return null;
  return (
    <>
      <StructuredData data={rugbyPageSchema} />
      <SportsLandingPage data={pageData} />
    </>
  );
}
