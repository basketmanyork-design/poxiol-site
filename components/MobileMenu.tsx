"use client";

import { useState } from "react";
import Link from "next/link";
import InquiryLink from '@/components/InquiryLink';
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
        <div className="absolute inset-x-0 top-20 z-50 max-h-[calc(100dvh-5rem)] overflow-y-auto border-b border-white/10 bg-neutral-950 px-5 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-4 shadow-2xl">
          <nav aria-label="Mobile navigation" className="flex flex-col">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="border-b border-white/10 py-4 text-base font-bold text-white"
            >
              Home
            </Link>
            {HEADER_NAV.map((item: NavItem) => {
              const hasSubmenu = Boolean(item.children?.length || item.groups?.length);

              return <div key={item.label} className="border-b border-white/10">
                <div className="flex items-center justify-between py-4">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="text-base font-bold text-white"
                  >
                    {item.label}
                  </Link>
                  {hasSubmenu ? (
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
                {item.groups?.length && expanded === item.label ? (
                  <div className="space-y-5 pb-5 pl-3">
                    {item.groups.map((navGroup) => {
                      const groupId = `mobile-${item.label}-${navGroup.label}`.replaceAll(' ', '-').toLowerCase();
                      return <div key={navGroup.label} role="group" aria-labelledby={groupId}>
                        <InquiryLink
                          id={groupId}
                          href={navGroup.href}
                          onClick={() => setOpen(false)}
                          className="inline-flex min-h-11 items-center text-xs font-black uppercase tracking-[0.14em] text-[#B6FF00]"
                        >
                          {navGroup.label}
                        </InquiryLink>
                        <ul className={`grid gap-x-2 ${navGroup.columns === 2 ? 'min-[390px]:grid-cols-2' : 'grid-cols-1'}`}>
                          {navGroup.items.map((child) => (
                            <li key={`${navGroup.label}-${child.label}`}>
                              <InquiryLink
                                href={child.href}
                                onClick={() => setOpen(false)}
                                className="flex min-h-11 items-center py-2 text-sm font-semibold leading-5 text-neutral-300 hover:text-[#B6FF00]"
                              >
                                {child.label}
                              </InquiryLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    })}
                  </div>
                ) : item.children?.length && expanded === item.label ? (
                  <ul className="pb-4 pl-4">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <InquiryLink
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="block py-2.5 text-sm font-semibold text-neutral-300 hover:text-[#B6FF00]"
                        >
                          {child.label}
                        </InquiryLink>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            })}
            <InquiryLink
              href={HEADER_CTA.href}
              onClick={() => setOpen(false)}
              className="mt-6 inline-flex h-14 items-center justify-center rounded-full bg-[#B6FF00] px-8 text-base font-black uppercase tracking-wide text-black"
            >
              {HEADER_CTA.label}
            </InquiryLink>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
