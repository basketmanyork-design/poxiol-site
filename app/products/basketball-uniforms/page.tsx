import type { Metadata } from "next";
import SportsLandingPage from "@/components/sports/SportsLandingPage";
import { getSportsPageBySlug } from "@/lib/sports-pages";

const slug = "products/basketball-uniforms";
const pageData = getSportsPageBySlug(slug);

export const metadata: Metadata = {
  title: pageData?.metaTitle,
  description: pageData?.metaDescription,
};

export default function Page() {
  if (!pageData) return null;
  return <SportsLandingPage data={pageData} />;
}
