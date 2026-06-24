import Link from "next/link";
import React from "react";

export const freeMockupHref = "/free-mockup/";
export const getQuoteHref = "/get-quote/";
export const sampleOrderHref = "/sample-order/";
export const whatsAppHref = "https://wa.me/8613055646888";

export function SectionHeading({ eyebrow, title, subtitle, dark = false, center = false }: { eyebrow: string; title: string; subtitle?: string; dark?: boolean; center?: boolean }) {
  return (
    <div className={`mx-auto mb-12 max-w-3xl ${center ? "text-center" : "text-left md:text-center"} md:mb-14`}>
      <p className={`mb-4 text-sm font-extrabold uppercase tracking-[0.16em] ${dark ? "text-[#B6FF00]" : "text-lime-600"}`}>{eyebrow}</p>
      <h2 className={`text-4xl font-black leading-[1.05] md:text-5xl ${dark ? "text-white" : "text-neutral-950"}`}>{title}</h2>
      {subtitle ? <p className={`mt-5 text-base leading-7 md:text-lg ${dark ? "text-neutral-300" : "text-neutral-600"}`}>{subtitle}</p> : null}
    </div>
  );
}

export function PrimaryButton({ href = freeMockupHref, children, className = "" }: { href?: string; children: React.ReactNode; className?: string }) {
  return (
    <Link 
      href={href} 
      className={`inline-flex items-center justify-center rounded-full bg-[#B6FF00] text-black font-black uppercase tracking-wide transition hover:bg-white px-8 py-4 ${className}`}
    >
      {children}
    </Link>
  );
}

export function SecondaryButton({ href, children, darkText = false, className = "" }: { href: string; children: React.ReactNode; darkText?: boolean; className?: string }) {
  return (
    <Link 
      href={href} 
      className={`inline-flex items-center justify-center rounded-full border transition px-8 py-4 ${darkText ? "border-neutral-300 text-neutral-950 hover:border-neutral-950" : "border-white/25 text-white hover:border-[#B6FF00] hover:text-[#B6FF00]"} ${className}`}
    >
      {children}
    </Link>
  );
}

export function WhatsAppButton() {
  return (
    <a 
      href={whatsAppHref} 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition hover:scale-110 active:scale-95"
      aria-label="Chat on WhatsApp"
    >
      <svg className="h-7 w-7 fill-current" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  );
}

export function Header() {
  const nav = [
    ["Solutions", "/solutions/"], ["Products", "/sports/"], ["Gallery", "/design-gallery/"], ["Factory", "/factory/"], ["Customization", "/customization/"], ["About", "/about/"], ["Contact", "/contact/"]
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-10 xl:px-20">
        <Link href="/" className="text-2xl font-black tracking-tight text-white uppercase">POXIOL<span className="text-[#B6FF00]">.</span></Link>
        <nav className="hidden items-center gap-7 lg:flex">{nav.map(([label, href]) => <Link key={label} href={href} className="text-sm font-bold text-white/80 transition hover:text-[#B6FF00]">{label}</Link>)}</nav>
        <Link href={freeMockupHref} className="hidden rounded-full bg-[#B6FF00] px-6 py-3 text-sm font-black text-neutral-950 transition hover:bg-white md:inline-flex">FREE MOCKUP</Link>
        <Link href={freeMockupHref} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white lg:hidden">↗</Link>
      </div>
    </header>
  );
}

export function Footer() {
  const columns = [
    { title: "B2B Solutions", links: [["Basketball Program", "/solutions/"], ["Soccer Program", "/solutions/"], ["Private Label OEM", "/solutions/"], ["Teamwear Package", "/solutions/"]] },
    { title: "Product Categories", links: [["Basketball Uniforms", "/sports/"], ["Soccer Jerseys", "/sports/"], ["Training Wear", "/sports/"], ["Design Gallery", "/design-gallery/"]] },
    { title: "Manufacturing", links: [["Factory Overview", "/factory/"], ["Quality Control", "/factory/"], ["Customization Options", "/customization/"], ["OEM/ODM Process", "/oem-odm/"]] },
    { title: "Company", links: [["About POXIOL", "/about/"], ["Resources", "/resources/"], ["FAQ Center", "/faq/"], ["Contact Us", "/contact/"]] },
  ];

  return (
    <footer className="border-t border-white/10 bg-neutral-950 px-5 py-20 text-white md:px-10 xl:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div>
            <Link href="/" className="text-3xl font-black uppercase tracking-tight">POXIOL<span className="text-[#B6FF00]">.</span></Link>
            <p className="mt-6 max-w-xs leading-8 text-neutral-400">Elite custom teamwear manufacturer specializing in high-performance uniforms for clubs, schools, brands and events worldwide.</p>
            <div className="mt-8 flex flex-col gap-3">
              <Link href={freeMockupHref} className="text-[#B6FF00] font-black uppercase text-sm tracking-wider hover:underline">Get Free Mockup →</Link>
              <Link href={getQuoteHref} className="text-[#B6FF00] font-black uppercase text-sm tracking-wider hover:underline">Get Factory Quote →</Link>
              <Link href={sampleOrderHref} className="text-[#B6FF00] font-black uppercase text-sm tracking-wider hover:underline">Start Sample Order →</Link>
            </div>
          </div>
          {columns.map(col => (
            <div key={col.title}>
              <h3 className="font-black text-white text-sm uppercase tracking-widest">{col.title}</h3>
              <ul className="mt-6 space-y-4">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-sm text-neutral-400 transition hover:text-[#B6FF00]">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-20 flex flex-col gap-6 border-t border-white/10 pt-10 text-xs font-bold uppercase tracking-widest text-neutral-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 POXIOL TEAMWEAR. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <span>MOQ 1 Set</span>
            <span>Fast Sample</span>
            <span>Global Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
