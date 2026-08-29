"use client";

import {useEffect, useState, type ReactNode} from "react";
import {usePathname} from "next/navigation";
import {updateVisibleInquiryForms} from "@/lib/mobile-inquiry-visibility";

export default function MobileInquiryBar({children}: {children: ReactNode}) {
  const pathname = usePathname();
  const [formInView, setFormInView] = useState(false);

  useEffect(() => {
    setFormInView(false);
    if (typeof IntersectionObserver === "undefined") return;

    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-inquiry-form]'));
    if (!targets.length) return;

    let visibleTargets = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      visibleTargets = updateVisibleInquiryForms(visibleTargets, entries);
      setFormInView(visibleTargets.size > 0);
    });

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [pathname]);

  if (formInView) return null;

  return (
    <div className="poxiol-mobile-cta fixed inset-x-0 bottom-0 z-[60] grid grid-cols-2 gap-3 border-t border-white/10 bg-neutral-950/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden" role="navigation" aria-label="Quick inquiry actions">
      {children}
    </div>
  );
}
