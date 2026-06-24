import type { Metadata } from "next";
import { Header, Footer, PrimaryButton } from "@/components/ui";

export const metadata: Metadata = {
  title: "Request Received | POXIOL",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <main className="bg-[#0A0A0A] text-white">
      <Header />
      <section className="px-5 py-20 md:px-10 md:py-32 flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-lime-400 text-4xl font-black text-neutral-950">
          ✓
        </div>
        <h1 className="mt-10 text-4xl font-black uppercase tracking-tight md:text-6xl">
          Thank You!
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-neutral-400 leading-relaxed">
          Your request has been successfully received. Our design and production team will review your details and logo/files, and we will contact you via email or WhatsApp within 24 hours.
        </p>
        <div className="mt-12">
          <PrimaryButton href="/">Return to Home</PrimaryButton>
        </div>
      </section>
      <Footer />
    </main>
  );
}
