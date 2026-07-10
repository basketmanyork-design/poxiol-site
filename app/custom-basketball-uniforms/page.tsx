import type { Metadata } from "next";
import CategoryRedirect from "@/components/CategoryRedirect";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  alternates: { canonical: "https://www.poxiol.com/products/basketball-uniforms/" }
};

export default function Page() { return <CategoryRedirect />; }
