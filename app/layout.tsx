import type { Metadata } from "next";
import "./globals.css";
import { WhatsAppButton } from "@/components/ui";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.poxiol.com"),
  alternates: {
    canonical: "/",
  },
  title: "Custom Teamwear & Sports Uniforms Manufacturer | POXIOL",
  description:
    "POXIOL provides custom basketball uniforms, soccer kits, baseball uniforms, running apparel, training wear and multi-sport teamwear with MOQ 1, free mockup, sample production in 2-3 days and OEM/ODM service.",
  keywords: [
    "custom teamwear",
    "custom sports uniforms",
    "basketball uniforms manufacturer",
    "custom soccer kits",
    "baseball uniforms supplier",
    "custom running apparel",
    "sublimation team uniforms",
    "OEM sportswear manufacturer",
    "ODM teamwear supplier",
    "custom training wear",
  ],
  openGraph: {
    title: "Custom Teamwear & Sports Uniforms Manufacturer | POXIOL",
    description:
      "Custom sports uniforms for clubs, schools, events, brands and teams worldwide.",
    type: "website",
    siteName: "POXIOL Teamwear",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-lime-400 selection:text-neutral-950">
        <Script id="okki-analytics-config" strategy="afterInteractive">
          {`
            window.okkiConfigs = window.okkiConfigs || [];
            function okkiAdd() { okkiConfigs.push(arguments); };
            okkiAdd("analytics", { siteId: "395585-32576", gId: "" });
          `}
        </Script>
        <Script 
          src="//tfile.xiaoman.cn/okki/analyze.js?id=395585-32576-" 
          strategy="afterInteractive" 
        />
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
