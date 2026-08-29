import Link from "next/link";
import React from "react";
import { getSiteChrome } from "@/lib/sanity/content";
import { HEADER_NAV, HEADER_CTA } from "@/lib/navigation";
import MobileMenu from "@/components/MobileMenu";
import MobileInquiryLink from "@/components/MobileInquiryLink";
import MobileInquiryBar from "@/components/MobileInquiryBar";
import InquiryLink from "@/components/InquiryLink";
import DesktopMenuLink from "@/components/DesktopMenuLink";

export const freeMockupHref = "/free-mockup/";
export const getQuoteHref = "/get-quote/";
export const sampleOrderHref = "/sample-order/";

export function emailHref(email: string) {
  const encoded = Array.from(email)
    .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
    .join("");
  return `mailto:${encoded}`;
}

export function EmailAddress({ email }: { email: string }) {
  const [name, domain] = email.split("@");
  if (!name || !domain) return <>{email}</>;
  return (
    <>
      <span>{name}</span>
      <span>@</span>
      <span>{domain}</span>
    </>
  );
}

export function SectionHeading({ eyebrow, title, subtitle, dark = false, center = false, level = "h2" }: { eyebrow: string; title: string; subtitle?: string; dark?: boolean; center?: boolean; level?: "h1" | "h2" }) {
  const TitleTag = level;
  return (
    <div className={`mx-auto mb-12 max-w-3xl ${center ? "text-center" : "text-left md:text-center"} md:mb-14`}>
      <p className={`mb-4 text-sm font-extrabold uppercase tracking-[0.16em] ${dark ? "text-[#B6FF00]" : "text-lime-600"}`}>{eyebrow}</p>
      <TitleTag className={`break-words text-3xl font-black leading-[1.05] min-[390px]:text-4xl md:text-5xl ${dark ? "text-white" : "text-neutral-950"} uppercase`}>{title}</TitleTag>
      {subtitle ? <p className={`mt-5 text-base leading-7 md:text-lg ${dark ? "text-neutral-300" : "text-neutral-600"}`}>{subtitle}</p> : null}
    </div>
  );
}

export function PrimaryButton({ href = freeMockupHref, children, className = "" }: { href?: string; children: React.ReactNode; className?: string }) {
  const classes = `inline-flex max-w-full items-center justify-center whitespace-normal break-words rounded-full bg-[#B6FF00] px-8 py-4 text-center font-black uppercase tracking-wide text-black transition hover:bg-white ${className}`;
  // Native fragment navigation preserves the form's top-aligned scroll position.
  // Next's router focuses the entire tall target after scrolling, recentering it.
  if (href.startsWith("#")) return <a href={href} className={classes}>{children}</a>;
  return (
    <InquiryLink href={href} className={classes}>
      {children}
    </InquiryLink>
  );
}

export function SecondaryButton({ href, children, darkText = false, className = "" }: { href: string; children: React.ReactNode; darkText?: boolean; className?: string }) {
  return (
    <InquiryLink href={href} className={`inline-flex max-w-full items-center justify-center whitespace-normal break-words rounded-full border px-8 py-4 text-center transition ${darkText ? "border-neutral-300 text-neutral-950 hover:border-neutral-950" : "border-white/25 text-white hover:border-[#B6FF00] hover:text-[#B6FF00]"} ${className}`}>
      {children}
    </InquiryLink>
  );
}

export async function WhatsAppButton() {
  const chrome = await getSiteChrome();
  const icon = (
    <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
  return (
    <>
      {/* Desktop: floating pill with text, bottom right */}
      <InquiryLink
        href={chrome.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-[60] hidden items-center gap-3 rounded-full bg-[#25D366] px-6 py-4 text-sm font-black uppercase tracking-wide text-white shadow-2xl transition hover:scale-105 active:scale-95 md:inline-flex"
        aria-label="Chat with our team on WhatsApp"
      >
        {icon}
        Chat With Our Team
      </InquiryLink>

      {/* Mobile: fixed bottom CTA bar */}
      <MobileInquiryBar>
        <InquiryLink
          href={chrome.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#25D366] text-sm font-black uppercase tracking-wide text-white"
        >
          {icon}
          WhatsApp
        </InquiryLink>
        <MobileInquiryLink />
      </MobileInquiryBar>
    </>
  );
}

export async function Header() {
  const chrome = await getSiteChrome();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-10 xl:px-20">
        <Link href="/" aria-label="POXIOL home" className="inline-flex min-w-[112px] items-center gap-3 text-2xl font-black tracking-tight text-white uppercase">{chrome.logo ? <><img src={chrome.logo.url} alt={chrome.logo.alt} width="128" height="36" className="h-9 w-auto object-contain" /><span className="sr-only">{chrome.brandName}</span></> : <span>{chrome.brandName}<span className="text-[#B6FF00]">.</span></span>}</Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {HEADER_NAV.map((item) => (
            item.children?.length || item.groups?.length ? <details key={item.label} className="group relative">
              <summary className="inline-flex cursor-pointer list-none items-center gap-1 rounded-md text-sm font-bold text-white/80 outline-none transition hover:text-[#B6FF00] focus-visible:ring-2 focus-visible:ring-[#B6FF00] focus-visible:ring-offset-4 focus-visible:ring-offset-neutral-950">
                {item.label}<span className="text-[10px] text-white/50 transition group-open:rotate-180 group-open:text-[#B6FF00]">▾</span>
              </summary>
              {item.groups?.length ? (
                <div className="fixed left-1/2 top-20 z-50 w-[min(920px,calc(100vw-2.5rem))] -translate-x-1/2 pt-4">
                  <div aria-label={`${item.label} menu`} className="grid grid-cols-[0.7fr_2fr_1.15fr] gap-4 rounded-3xl border border-white/10 bg-neutral-950 p-5 shadow-2xl">
                    {item.groups.map((navGroup) => {
                      const groupId = `desktop-${item.label}-${navGroup.label}`.replaceAll(' ', '-').toLowerCase();
                      return <div key={navGroup.label} role="group" aria-labelledby={groupId} className="min-w-0">
                        <DesktopMenuLink
                          id={groupId}
                          href={navGroup.href}
                          className="inline-flex min-h-11 items-center text-xs font-black uppercase tracking-[0.16em] text-[#B6FF00] hover:text-white"
                        >
                          {navGroup.label}
                        </DesktopMenuLink>
                        <ul className={`mt-1 grid gap-1 ${navGroup.columns === 2 ? 'grid-cols-2 gap-x-2' : 'grid-cols-1'}`}>
                          {navGroup.items.map((child) => (
                            <li key={`${navGroup.label}-${child.label}`}>
                              <DesktopMenuLink href={child.href} className="flex min-h-11 items-center rounded-xl px-3 py-2 text-sm font-bold leading-5 text-white/80 transition hover:bg-white/5 hover:text-[#B6FF00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B6FF00]">
                                {child.label}
                              </DesktopMenuLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    })}
                  </div>
                </div>
              ) : (
                <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-4">
                  <div className="w-64 rounded-2xl border border-white/10 bg-neutral-950 p-3 shadow-2xl">
                    {item.children?.map((child) => (
                      <DesktopMenuLink key={child.href} href={child.href} className="block rounded-xl px-4 py-3 text-sm font-bold text-white/80 transition hover:bg-white/5 hover:text-[#B6FF00]">
                        {child.label}
                      </DesktopMenuLink>
                    ))}
                  </div>
                </div>
              )}
            </details> : <Link key={item.label} href={item.href} className="text-sm font-bold text-white/80 transition hover:text-[#B6FF00]">{item.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <InquiryLink href={HEADER_CTA.href} className="hidden rounded-full bg-[#B6FF00] px-6 py-3 text-sm font-black text-neutral-950 transition hover:bg-white md:inline-flex">{HEADER_CTA.label}</InquiryLink>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

export async function Footer() {
  const chrome = await getSiteChrome();

  return (
    <footer className="border-t border-white/10 bg-neutral-950 px-5 py-20 text-white md:px-10 xl:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div>
            <Link href="/" className="inline-flex min-h-10 items-center text-3xl font-black uppercase tracking-tight">{chrome.logo ? <><img src={chrome.logo.url} alt={chrome.logo.alt} width="150" height="42" className="h-10 w-auto object-contain" /><span className="sr-only">{chrome.brandName}</span></> : <span>{chrome.brandName}<span className="text-[#B6FF00]">.</span></span>}</Link>
            <p className="mt-6 max-w-xs leading-8 text-neutral-400">Custom teamwear for teamwear distributors, dealers, sportswear brands and custom resellers worldwide, supporting ongoing team orders for your clients.</p>
            <div className="mt-8 flex flex-col gap-3">
              <InquiryLink href={freeMockupHref} className="text-[#B6FF00] font-black uppercase text-sm tracking-wider hover:underline">Get Free Mockup →</InquiryLink>
              <InquiryLink href={getQuoteHref} className="text-[#B6FF00] font-black uppercase text-sm tracking-wider hover:underline">Get Factory Quote →</InquiryLink>
              <InquiryLink href={chrome.whatsappHref} target="_blank" rel="noreferrer" className="text-[#B6FF00] font-black uppercase text-sm tracking-wider hover:underline">WhatsApp: {chrome.whatsappNumber}</InquiryLink>
              <a href={emailHref(chrome.publicEmail)} className="text-neutral-400 text-sm hover:text-white"><EmailAddress email={chrome.publicEmail} /></a>
            </div>
          </div>
          {chrome.footerColumns.map((col) => (
            <div key={col.title}>
              <h3 className="font-black text-white text-sm uppercase tracking-widest">{col.title}</h3>
              <ul className="mt-6 space-y-4">
                {col.links.map((link) => (
                  <li key={`${col.title}-${link.label}-${link.href}`}>
                    <InquiryLink href={link.href} className="text-sm text-neutral-400 transition hover:text-[#B6FF00]">{link.label}</InquiryLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-20 flex flex-col gap-6 border-t border-white/10 pt-10 text-xs font-bold uppercase tracking-widest text-neutral-500 md:flex-row md:items-center md:justify-between">
          <p>{chrome.copyright}</p>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            <span>Project MOQ Confirmed by Consultation</span>
            <span>Sample Plan Confirmed by Project</span>
            <span>International Shipping Support</span>
            {chrome.alibabaStoreUrl ? <a href={chrome.alibabaStoreUrl} target="_blank" rel="noreferrer" className="text-white hover:text-[#B6FF00]">Alibaba Store</a> : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
