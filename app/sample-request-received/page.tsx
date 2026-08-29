import type { Metadata } from "next";
import { Header, Footer, PrimaryButton } from "@/components/ui";
import InquiryNextSteps from "@/components/forms/InquiryNextSteps";

export const metadata: Metadata = {
  title: "Sample Request Received | POXIOL",
  robots: { index: false, follow: false },
};

export default function SampleReceivedPage() {
  return (
    <main className="bg-[#0A0A0A] text-white">
      <Header />
      <section className="px-5 py-20 md:px-10 md:py-32 flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-lime-400 text-4xl font-black text-neutral-950">
          ✓
        </div>
        <h1 className="mt-10 text-4xl font-black uppercase tracking-tight md:text-6xl">
          Sample Request Submitted
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-neutral-400 leading-relaxed">
          Your sample request has been submitted for review. This is not a confirmed sample order. The design, fabric, size, printing, sample cost and delivery arrangements still need to be agreed before you decide whether to proceed.
        </p>
        <InquiryNextSteps />
        <div className="mt-12">
          <PrimaryButton href="/">Return to Home</PrimaryButton>
        </div>
      </section>
      <Footer />
    </main>
  );
}
