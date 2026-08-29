"use client";

import { usePathname } from "next/navigation";
import { V8_CONVERSION_ENTRIES, getV8ConversionEntry, type V8ConversionIntent } from "@/lib/v8/leads";
import {contextFromPage, contextualInquiryHref} from '@/lib/inquiry-context';

const labels: Record<V8ConversionIntent, string> = {
  quote: "Get Quote",
  mockup: "Free Mockup",
  sample: "Request Sample",
  contact: "Inquiry Form",
};

export default function MobileInquiryLink() {
  const pathname = usePathname();
  const normalizedPath = pathname ? `${pathname.replace(/\/+$/, "")}/` : "/";
  const currentEntry = V8_CONVERSION_ENTRIES.find((entry) => entry.path === normalizedPath);
  const entry = currentEntry || getV8ConversionEntry("quote");
  const href = currentEntry ? `#${entry.formAnchorId}` : contextualInquiryHref(`${entry.path}#${entry.formAnchorId}`, contextFromPage(normalizedPath));

  // Native fragment navigation preserves typed fields and avoids router-driven
  // re-centering of the tall form container. No submit or extra tracking handler.
  return (
    <a
      href={href}
      className="inline-flex min-h-14 min-w-0 items-center justify-center rounded-full bg-[#B6FF00] px-2 text-center text-sm font-black uppercase leading-tight tracking-wide text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      {labels[entry.intent]}
    </a>
  );
}
