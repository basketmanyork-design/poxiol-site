import Link from "next/link";
import { Header, Footer, SectionHeading, PrimaryButton, SecondaryButton } from "@/components/ui";

export default function HomePage() {
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <Header />

      {/* 1. HERO — Elite Positioning */}
      <section className="relative overflow-hidden pt-20 pb-32 md:pt-32 md:pb-48 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(182,255,0,0.15),transparent_40%),radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.05),transparent_30%)]" />
        <div className="container mx-auto max-w-7xl relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 bg-[#B6FF00]/10 border border-[#B6FF00]/20 px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#B6FF00] animate-pulse" />
              <span className="text-[#B6FF00] text-xs font-black uppercase tracking-[0.2em]">The 15-Day Delivery Promise</span>
            </div>
            <h1 className="text-6xl md:text-8xl xl:text-9xl font-black leading-[0.85] uppercase tracking-tighter italic">
              Elite Gear<br />For <span className="text-[#B6FF00]">Elite</span> Teams
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 max-w-xl leading-relaxed">
              Stop settling for template designs. We build professional-grade, 100% custom teamwear engineered for the world's most competitive leagues.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <PrimaryButton className="px-10 py-5 text-xl">START YOUR DESIGN</PrimaryButton>
              <div className="px-10 py-5 rounded-2xl border border-zinc-800 font-bold text-xl bg-zinc-900/50 backdrop-blur flex items-center gap-3">
                MOQ 1 PIECE
              </div>
            </div>
            <div className="flex items-center gap-6 pt-10 border-t border-white/5">
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center text-[10px] font-black">TEAM</div>
                  ))}
               </div>
               <div>
                  <div className="flex gap-1 text-[#B6FF00]">
                    {[1,2,3,4,5].map(i => <span key={i} className="text-lg">★</span>)}
                  </div>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Trusted by 1,200+ Teams Worldwide</p>
               </div>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-10 bg-[#B6FF00]/10 rounded-full blur-[120px]" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[48px] border border-white/10 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
              <img src="/images/hero/hero-multisport-teamwear.svg" className="w-full h-full object-cover" alt="Elite Teamwear" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-10 left-10 p-6 bg-white text-black rounded-3xl shadow-2xl flex items-center gap-4 animate-bounce">
                <span className="text-4xl">⏱</span>
                <div>
                  <p className="text-[10px] font-black uppercase text-zinc-500">Record Speed</p>
                  <p className="text-2xl font-black italic uppercase">15 DAYS</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST BAR — Authority */}
      <section className="py-12 bg-black border-y border-white/5">
        <div className="container mx-auto px-6">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600 mb-8">Official Gear Provider For</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700 font-black italic text-2xl">
             <span>AAU LEAGUES</span>
             <span>METRO UNITED</span>
             <span>ELITE ACADEMY</span>
             <span>VARSITY PREP</span>
             <span>STATE WARRIORS</span>
          </div>
        </div>
      </section>

      {/* 3. SPORTS GRID — Category Expansion */}
      <section id="sports-categories" className="py-32 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
            <div className="space-y-4">
              <span className="text-[#B6FF00] font-black uppercase tracking-[0.3em] text-xs">The 2026 Collection</span>
              <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">SHOP BY SPORT</h2>
            </div>
            <div className="flex gap-3">
               <span className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg text-[10px] font-black">CE CERTIFIED</span>
               <span className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg text-[10px] font-black">REACH COMPLIANT</span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Basketball", img: "/images/sports/basketball-uniforms.svg", desc: "180-230 GSM MESH", price: "39" },
              { name: "Soccer", img: "/images/sports/soccer-kits.svg", desc: "160 GSM INTERLOCK", price: "35" },
              { name: "Baseball", img: "/images/sports/baseball-softball.svg", desc: "HEAVY TECH KNIT", price: "45" },
              { name: "Football", img: "/images/sports/american-football.svg", desc: "DUAL-LAYER MESH", price: "55" },
              { name: "Hockey", img: "/images/sports/ice-hockey-jerseys.svg", desc: "240 GSM PRO-WEIGHT", price: "59" },
              { name: "Volleyball", img: "/images/sports/volleyball-uniforms.svg", desc: "ELITE STRETCH", price: "32" }
            ].map((sport) => (
              <div key={sport.name} className="group relative h-[600px] overflow-hidden rounded-[40px] border border-white/5 bg-zinc-900">
                <img src={sport.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={sport.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-10 space-y-2">
                  <div className="text-xs font-black text-[#B6FF00] tracking-[0.2em] uppercase">{sport.desc}</div>
                  <h3 className="text-5xl font-black uppercase italic tracking-tighter">{sport.name}</h3>
                  <div className="flex items-center gap-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="text-zinc-400 font-bold uppercase italic text-sm">Full sets from ${sport.price}</span>
                    <button className="bg-[#B6FF00] text-black px-6 py-2 rounded-xl font-black uppercase italic text-xs">CUSTOMIZE</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FABRIC & TECH — Differentiation */}
      <section id="technology" className="py-32 bg-black border-y border-white/5 px-6">
        <div className="container mx-auto max-w-7xl grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <div>
              <span className="text-[#B6FF00] font-black uppercase tracking-[0.3em] text-xs">Fabric Mastery</span>
              <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none mt-4">ELITE TECH<br />ENGINEERING</h2>
              <p className="text-zinc-400 text-lg leading-relaxed mt-6">
                We use proprietary 100% Polyester Mesh (160-230 GSM) engineered for the rigorous demands of professional athletics. Our fabrics are lab-tested for moisture-wicking, durability, and skin safety.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-8">
               {[
                 { title: "PERMANENT COLOR", desc: "Inks bond to fibers. Zero cracking or peeling." },
                 { title: "PRO BREATHABILITY", desc: "Open-weave mesh supports extreme airflow." },
                 { title: "4-WAY STRETCH", desc: "Fabric moves with the athlete. High mobility." },
                 { title: "ANTI-MICROBIAL", desc: "Treated for odor control and skin comfort." }
               ].map((item, i) => (
                 <div key={i} className="space-y-2 border-l-2 border-[#B6FF00]/30 pl-6">
                    <h4 className="font-black uppercase italic text-[#B6FF00] tracking-widest text-sm">{item.title}</h4>
                    <p className="text-zinc-500 text-xs leading-relaxed">{item.desc}</p>
                 </div>
               ))}
            </div>
            <div className="pt-8">
               <Link href="/contact/" className="text-sm font-black uppercase italic tracking-widest text-white hover:text-[#B6FF00] underline decoration-[#B6FF00] underline-offset-8 transition-all">
                  VIEW COMPLETE SIZING & FABRIC GUIDE →
               </Link>
            </div>
          </div>
          <div className="relative">
             <div className="absolute -inset-10 bg-[#B6FF00]/5 rounded-full blur-[100px]" />
             <div className="aspect-square bg-zinc-900 rounded-[48px] border border-white/10 overflow-hidden relative">
                <img src="/images/technology/fabric-main.svg" className="w-full h-full object-cover" alt="Fabric Detail" />
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] hover:backdrop-blur-0 transition-all duration-700" />
                <div className="absolute top-10 right-10 bg-black/60 border border-white/10 backdrop-blur px-6 py-4 rounded-2xl">
                   <p className="text-[#B6FF00] font-black italic uppercase text-2xl">SUBLIMATION</p>
                   <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Vs. Screen Printing</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 5. TEAM STORES — B2B Perfection */}
      <section className="py-32 bg-[#0A0A0A] px-6">
        <div className="container mx-auto max-w-7xl grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 relative">
             <div className="aspect-video bg-zinc-900 rounded-[32px] border border-white/10 overflow-hidden shadow-2xl relative">
                <img src="/images/solutions/brand-oem.svg" className="w-full h-full object-cover opacity-50" alt="Team Portal" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center bg-black/40 backdrop-blur-sm">
                   <p className="text-4xl font-black italic uppercase tracking-tighter">ELITE ACADEMY STORES</p>
                   <p className="text-zinc-400 mt-4 max-w-xs">A custom portal for your players to pay and order individually.</p>
                </div>
             </div>
             <div className="absolute -top-10 -right-10 bg-[#B6FF00] text-black p-8 rounded-3xl shadow-2xl max-w-xs rotate-3 hidden md:block">
                <p className="text-3xl font-black italic uppercase leading-none">ZERO RISK.<br />NO HASSLE.</p>
                <p className="mt-4 text-sm font-bold opacity-80">We handle the money. We handle the shipping. You handle the coaching.</p>
             </div>
          </div>
          <div className="order-1 lg:order-2 space-y-8">
            <span className="text-[#B6FF00] font-black uppercase tracking-widest text-xs italic">Platform Service</span>
            <h2 className="text-5xl lg:text-8xl font-black uppercase italic tracking-tighter leading-none">YOUR OWN<br />TEAM STORE</h2>
            <p className="text-xl text-zinc-400 leading-relaxed">
              We build a custom e-commerce portal for your club in minutes. Let players, parents, and fans buy their own gear—no more bulk-buying risk for the coach.
            </p>
            <div className="space-y-4 pt-4">
              {[
                "Player-Direct Purchasing (Save hours of admin)",
                "No Minimum Order on Re-orders",
                "Worldwide Individual Shipping",
                "Fundraising Kickbacks Integrated"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-sm font-bold uppercase italic text-zinc-300">
                  <span className="w-5 h-5 rounded-full bg-[#B6FF00] flex items-center justify-center text-black text-[10px]">✓</span>
                  {item}
                </div>
              ))}
            </div>
            <div className="pt-6">
               <PrimaryButton className="px-10">LAUNCH TEAM STORE</PrimaryButton>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CALL — Conversion */}
      <section className="py-40 relative overflow-hidden bg-black text-center px-6">
         <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-[#B6FF00]/10 rounded-full blur-[200px] -mr-[500px] -mt-[500px]" />
         <div className="relative z-10 max-w-5xl mx-auto space-y-12">
            <h2 className="text-7xl md:text-9xl font-black uppercase italic tracking-tighter leading-none">READY TO<br /><span className="text-[#B6FF00]">TRANSFORM</span><br />YOUR TEAM?</h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
               <PrimaryButton className="px-16 py-8 text-2xl">GET FREE 3D MOCKUP</PrimaryButton>
               <div className="text-left">
                  <p className="text-zinc-500 font-black uppercase italic tracking-widest text-sm leading-none">Proposal ready in</p>
                  <p className="text-[#B6FF00] text-3xl font-black italic uppercase leading-none mt-2">24 HOURS</p>
               </div>
            </div>
         </div>
      </section>

      <Footer />
    </main>
  );
}
