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
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
        sizes: "16x16 32x32 48x48",
      },
      {
        url: "/favicon-48.png",
        type: "image/png",
        sizes: "48x48",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        type: "image/png",
        sizes: "180x180",
      },
    ],
  },
  manifest: "/manifest.webmanifest",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const analyticsConfig = await getAnalyticsRuntimeConfig();

  return (
    <html lang="en">
      <head>
        <link rel="preload" as="image" href="/images/poxiol-teamwear-range-banner-2x1.webp" fetchPriority="high" />
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
