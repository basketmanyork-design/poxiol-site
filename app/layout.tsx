import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Custom Teamwear & Sports Uniforms Manufacturer | POXIOL",
  description:
    "POXIOL provides custom basketball uniforms, soccer kits, baseball uniforms, running apparel, training wear and multi-sport teamwear with MOQ 1, free mockup, fast sampling and OEM/ODM service.",
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
      <body>{children}</body>
    </html>
  );
}
