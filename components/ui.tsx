import Link from "next/link";

export const freeMockupHref = "/free-mockup/";

export function SectionHeading({ eyebrow, title, subtitle, dark = false }: { eyebrow: string; title: string; subtitle?: string; dark?: boolean }) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-left md:mb-14 md:text-center">
      <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.16em] text-lime-400">{eyebrow}</p>
      <h2 className={`text-4xl font-black leading-[1.05] md:text-5xl ${dark ? "text-white" : "text-neutral-950"}`}>{title}</h2>
      {subtitle ? <p className={`mt-5 text-base leading-7 md:text-lg ${dark ? "text-neutral-300" : "text-neutral-600"}`}>{subtitle}</p> : null}
    </div>
  );
}

export function PrimaryButton({ href = freeMockupHref, children }: { href?: string; children: React.ReactNode }) {
  return <Link href={href} className="inline-flex h-[52px] items-center justify-center rounded-full bg-lime-400 px-7 text-sm font-black uppercase tracking-wide text-neutral-950 transition hover:bg-white">{children}</Link>;
}

export function SecondaryButton({ href, children, darkText = false }: { href: string; children: React.ReactNode; darkText?: boolean }) {
  return <Link href={href} className={`inline-flex h-[52px] items-center justify-center rounded-full border px-7 text-sm font-black uppercase tracking-wide transition ${darkText ? "border-neutral-300 text-neutral-950 hover:border-neutral-950" : "border-white/25 text-white hover:border-lime-400 hover:text-lime-400"}`}>{children}</Link>;
}

export function Header() {
  const nav = [
    ["Home", "/"], ["Sports", "/#sports-categories"], ["Designs", "/#designs"], ["Gallery", "/#gallery"], ["Technology", "/#technology"], ["Contact", "/contact/"]
  ];
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-10 xl:px-20">
        <Link href="/" className="text-2xl font-black tracking-tight text-white">POXIOL<span className="text-lime-400">.</span></Link>
        <nav className="hidden items-center gap-8 lg:flex">{nav.map(([label, href]) => <Link key={label} href={href} className="text-sm font-bold text-white/80 transition hover:text-lime-400">{label}</Link>)}</nav>
        <Link href="/free-mockup/" className="hidden rounded-full bg-lime-400 px-6 py-3 text-sm font-black text-neutral-950 transition hover:bg-white md:inline-flex">GET FREE MOCKUP</Link>
        <Link href="/free-mockup/" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white lg:hidden">↗</Link>
      </div>
    </header>
  );
}

export function Footer() {
  const columns = [
    { title: "Core Sports", links: [["Basketball Uniforms", "/custom-basketball-uniforms/"], ["Soccer Kits", "/custom-soccer-kits/"], ["Baseball & Softball", "/custom-baseball-softball-uniforms/"], ["Running & Marathon Wear", "/custom-running-marathon-wear/"], ["Training Wear", "/custom-training-wear/"]] },
    { title: "More Sports", links: [["American Football", "/custom-american-football-uniforms/"], ["Volleyball", "/custom-volleyball-uniforms/"], ["Ice Hockey", "/custom-ice-hockey-jerseys/"], ["Tennis Wear", "/custom-tennis-wear/"], ["Golf Wear", "/custom-golf-wear/"]] },
    { title: "Company", links: [["Free Mockup", "/free-mockup/"], ["Contact", "/contact/"], ["Factory Strength", "/#factory"], ["Fabric & Technology", "/#technology"], ["Gallery", "/#gallery"]] },
  ];
  return (
    <footer className="border-t border-white/10 bg-neutral-950 px-5 py-16 text-white md:px-10 xl:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div><Link href="/" className="text-3xl font-black">POXIOL<span className="text-lime-400">.</span></Link><p className="mt-4 max-w-xs leading-7 text-neutral-400">Custom sports uniforms for clubs, schools, brands and teams worldwide.</p><div className="mt-6"><PrimaryButton>Get Free Mockup</PrimaryButton></div></div>
          {columns.map(col => <div key={col.title}><h3 className="font-black text-white">{col.title}</h3><ul className="mt-4 space-y-3">{col.links.map(([label, href]) => <li key={label}><Link href={href} className="text-sm text-neutral-400 transition hover:text-lime-400">{label}</Link></li>)}</ul></div>)}
        </div>
        <div className="mt-12 border-t border-white/10 pt-8 text-sm text-neutral-500">© 2026 POXIOL Teamwear. All rights reserved.</div>
      </div>
    </footer>
  );
}
