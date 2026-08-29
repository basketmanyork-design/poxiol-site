import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { WhatsAppButton } from "@/components/ui";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { getAnalyticsRuntimeConfig } from "@/lib/analytics/server";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.poxiol.com"),
  title: "Custom Teamwear & Sports Uniforms Manufacturer | POXIOL",
  description:
    "POXIOL specializes in custom basketball uniforms, soccer kits and baseball uniforms with project-specific mockup, sample, quality-control and OEM/ODM support.",
  keywords: [
    "custom teamwear",
    "custom sports uniforms",
    "basketball uniforms manufacturer",
    "custom soccer kits",
    "baseball uniforms supplier",
    "sublimation team uniforms",
    "OEM sportswear manufacturer",
    "ODM teamwear supplier",
  ],
  openGraph: {
    title: "Custom Teamwear & Sports Uniforms Manufacturer | POXIOL",
    description:
      "Custom basketball, soccer and baseball uniforms for clubs, schools, youth programs, sports brands and distributors.",
    type: "website",
    siteName: "POXIOL Teamwear",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const analyticsConfig = await getAnalyticsRuntimeConfig();

  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%230A0A0A'/%3E%3Ctext x='32' y='43' text-anchor='middle' font-family='Arial,sans-serif' font-size='36' font-weight='900' fill='%23B6FF00'%3EP%3C/text%3E%3C/svg%3E" />
      </head>
      <body className="antialiased selection:bg-lime-400 selection:text-neutral-950">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999] focus:rounded-xl focus:bg-lime-400 focus:px-6 focus:py-3 focus:text-sm focus:font-black focus:text-black focus:uppercase">Skip to Content</a>
        <Suspense fallback={null}>
          <AnalyticsProvider config={analyticsConfig} initialPermission="unknown" />
        </Suspense>
        <div id="main-content" className="pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0">{children}</div>
        <WhatsAppButton />
      </body>
    </html>
  );
}
