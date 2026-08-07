"use client";

import { useState } from "react";
import Link from "next/link";
import { HEADER_NAV, HEADER_CTA, type NavItem } from "@/lib/navigation";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white"
      >
        {open ? (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        )}
      </button>

      {open ? (
        <div className="absolute inset-x-0 top-20 z-50 border-b border-white/10 bg-neutral-950/95 px-5 pb-8 pt-4 shadow-2xl backdrop-blur-xl">
          <nav aria-label="Mobile navigation" className="flex flex-col">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="border-b border-white/10 py-4 text-base font-bold text-white"
            >
              Home
            </Link>
            {HEADER_NAV.map((item: NavItem) => (
              <div key={item.label} className="border-b border-white/10">
                <div className="flex items-center justify-between py-4">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="text-base font-bold text-white"
                  >
                    {item.label}
                  </Link>
                  {item.children?.length ? (
                    <button
                      type="button"
                      onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                      aria-expanded={expanded === item.label}
                      aria-label={`Toggle ${item.label} submenu`}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white"
                    >
                      <span className={`text-lg transition-transform ${expanded === item.label ? "rotate-45" : ""}`}>+</span>
                    </button>
                  ) : null}
                </div>
                {item.children?.length && expanded === item.label ? (
                  <ul className="pb-4 pl-4">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="block py-2.5 text-sm font-semibold text-neutral-300 hover:text-[#B6FF00]"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
            <Link
              href={HEADER_CTA.href}
              onClick={() => setOpen(false)}
              className="mt-6 inline-flex h-14 items-center justify-center rounded-full bg-[#B6FF00] px-8 text-base font-black uppercase tracking-wide text-black"
            >
              {HEADER_CTA.label}
            </Link>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
