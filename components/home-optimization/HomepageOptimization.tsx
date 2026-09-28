import Link from 'next/link'
import {ProjectQualificationForm} from '@/components/v8/ProjectQualificationForm'
import styles from './HomepageOptimization.module.css'
import {HeroBackgroundVideo} from './HeroBackgroundVideo'
import type {HomepageOptimizationCopy} from '@/lib/sanity/home-optimization'

const cards = [
  {name: 'Soccer Uniforms', action: 'View Options', slug: 'soccer', href: '/products/soccer-jerseys/', alt: 'POXIOL soccer jersey and shorts set design illustration'},
  {name: 'Basketball Uniforms', action: 'View Options', slug: 'basketball', href: '/products/basketball-uniforms/', alt: 'POXIOL basketball jersey and shorts set design illustration'},
  {name: 'Baseball Uniforms', action: 'View Options', slug: 'baseball', href: '/custom-baseball-softball-uniforms/', alt: 'POXIOL baseball jersey and trousers design illustration'},
  {name: 'Training Sets', action: 'View Options', slug: 'training', href: '/products/training-wear/', alt: 'POXIOL short-sleeve training top and shorts design illustration'},
  {name: 'Running & Track Uniforms', action: 'View Options', slug: 'running-track', href: '/products/running-track-uniforms/', alt: 'POXIOL running singlet and shorts design illustration'},
  {name: 'Warm-Up Wear', action: 'View Options', slug: 'warm-up', href: '/products/warm-up-wear/', alt: 'POXIOL zip-up warm-up jacket and trousers design illustration'},
] as const

const faqs = [
  ['Who can work with POXIOL?', 'We welcome teams, schools, clubs, sportswear brands, resellers and other business buyers looking for custom teamwear. Share your project so we can discuss the right starting point.'],
  ['Can I start without a finished design?', 'Yes. Tell us your sport, preferred colors and ideas. A logo or reference image is helpful, but you can start without a design file and request a free mockup.'],
  ['What is the minimum order quantity?', 'Minimum quantities depend on the product format and project requirements. Share your estimated quantity so our team can confirm the order structure for a quotation.'],
  ['Can I apply for a free sample?', 'Eligible team and business buyers can apply. Our team reviews the project and confirms eligibility, sample type, what is included at no charge and shipping arrangements before dispatch.'],
  ['How are sizes and fit confirmed?', 'Share your players’ or customers’ size needs. Our team will review relevant size references with you and discuss sample confirmation where needed.'],
  ['How do you review logos, names and numbers?', 'Artwork, colors, names, numbers and placement requirements are reviewed before the applicable decoration method is confirmed for your project.'],
  ['Can you meet my required delivery date?', 'Enter the date you need the order in hand, quantity and delivery destination. We will review production and shipping feasibility separately before confirming a timeline.'],
  ['Can I reorder a previous design?', 'Send your earlier order or design reference, then our team can check the current specifications, materials, quantity and availability.'],
  ['What should I do if I have a concern about my order?', 'Contact our team with your order reference and clear photos of the issue so we can review it with you. Any next steps will follow the terms confirmed for your order.'],
] as const

const step = (number: string, title: string, body: string) => <li><span>{number}</span><strong>{title}</strong><p>{body}</p></li>

export function HomepageOptimization({publicEmail, whatsappHref, privacyPolicyApproved,copy={}}: {publicEmail: string; whatsappHref: string; privacyPolicyApproved: boolean;copy?:HomepageOptimizationCopy}) {
  return <>
    <section className={`${styles.section} ${styles.hero}`} data-mobile-inquiry-hero aria-labelledby="home-hero-title">
      <HeroBackgroundVideo />
      <div className={styles.heroShade} aria-hidden="true" />
      <div className={`${styles.container} ${styles.heroContent}`}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{copy.heroEyebrow || 'Custom Teamwear Manufacturer'}</p>
          <h1 id="home-hero-title">{copy.heroHeading || 'Custom Teamwear for Teams, Clubs & Brands'}</h1>
          <p className={styles.lead}>{copy.heroDescription || 'Custom uniforms for your team or brand. Share your sport, quantity and required delivery date. We’ll help you review product options, develop your design and check your order timeline.'}</p>
          <p>{copy.heroWelcome || 'Teams, schools, clubs, brands and resellers welcome.'}</p>
          <div className={styles.actions}>
            <Link className={styles.primary} href="/#contact">Tell Us About Your Project</Link>
            <Link className={styles.secondary} href="/free-mockup/#free-mockup-form">Get a Free Mockup</Link>
          </div>
          <p className={styles.microcopy}>{copy.heroMicrocopy || 'Start with your requirements. No finished design needed.'}</p>
        </div>
      </div>
    </section>

    <section id="product-discovery" className={`${styles.section} ${styles.light}`} aria-labelledby="sports-title">
      <div className={styles.container}>
        <p className={styles.eyebrow}>Explore by Sport &amp; Teamwear Type</p><h2 id="sports-title">{copy.sportsHeading || 'Find Your Sport. Build Your Teamwear.'}</h2>
        <p className={styles.lead}>Explore a starting point for your team or business. Colors, branding and product details can be discussed with our team.</p>
        <div className={styles.productGrid}>
          {cards.map(card => <article className={styles.productCard} key={card.slug}>
            <Link href={card.href} aria-label={card.action}>
              <picture><source media="(max-width: 640px)" srcSet={`/website-optimization/${card.slug}-480.webp`} /><img src={`/website-optimization/${card.slug}-800.webp`} width="800" height="999" loading="lazy" alt={card.alt} /></picture>
              <div className={styles.cardCopy}><h3>{card.name}</h3><span>{card.action} →</span></div>
            </Link>
          </article>)}
        </div>
        <p className={styles.disclosure}>Product design illustrations — specifications are confirmed for each project.</p>
        <Link className={styles.textLink} href="/products/">View All Teamwear →</Link>
      </div>
    </section>

    <section id="who-we-help" className={`${styles.section} ${styles.muted}`} aria-labelledby="buyers-title">
      <div className={styles.container}><p className={styles.eyebrow}>Who we help</p><h2 id="buyers-title">{copy.buyersHeading || 'Team Orders or Brand Collections — Start Here'}</h2>
        <div className={styles.twoGrid}>
          <article className={styles.buyerCard}><h3>For Teams, Schools &amp; Clubs</h3><p>Bring your team identity to life with coordinated uniforms, names, numbers and a size plan for your players.</p><ul><li>Team colors &amp; identity</li><li>Names &amp; numbers</li><li>Player sizing &amp; delivery planning</li></ul><Link className={styles.primary} href="/?buyerRole=Team%20%2F%20School%20%2F%20Club#contact">Discuss Your Team Order</Link></article>
          <article className={styles.buyerCard}><h3>For Brands &amp; Resellers</h3><p>Explore custom teamwear for your customers, with support for private-label requirements, product development and repeat orders.</p><ul><li>Private-label requirements</li><li>Product &amp; sample review</li><li>Repeat-order planning</li></ul><Link className={styles.primary} href="/?buyerRole=Brand%20%2F%20Reseller#contact">Discuss Your Business Project</Link></article>
        </div>
      </div>
    </section>

    <section id="customization-details" className={`${styles.section} ${styles.light}`} aria-labelledby="details-title">
      <div className={styles.container}><p className={styles.eyebrow}>Customization</p><h2 id="details-title">{copy.detailsHeading || 'See the Details Behind Your Teamwear'}</h2><p className={styles.lead}>Review fabric, construction and branding options with our team before confirming your order.</p>
        <div className={styles.fourGrid}>
          <article><h3>Fabric &amp; Feel</h3><p>Compare original fabric references for the product and intended sport. Final material follows availability and sample review.</p></article>
          <article><h3>Fit &amp; Construction</h3><p>Review size needs and relevant measurements before confirming a team order.</p></article>
          <article><h3>Names, Numbers &amp; Graphics</h3><p>Review artwork, color references and placements before confirming the applicable decoration method.</p></article>
          <article><h3>Labels &amp; Branding</h3><p>Discuss available labels, hangtags and packaging for your product and project.</p></article>
        </div>
        <div className={styles.actions}><Link className={styles.textLink} href="/customization/">Explore Customization Options →</Link><Link className={styles.textLink} href="/customization/fabric-options/">View Fabric References →</Link></div>
      </div>
    </section>

    <section id="free-mockup" className={`${styles.section} ${styles.dark}`} aria-labelledby="mockup-title">
      <div className={styles.container}><p className={styles.eyebrow}>Design support</p><h2 id="mockup-title">{copy.mockupHeading || 'See Your Idea as a Free Mockup'}</h2><p className={styles.lead}>Share your preferred sport, colors or a reference image. Our team will review your brief and help turn it into a teamwear design direction. A finished design file is optional.</p>
        <ol className={styles.stepGrid}>{step('01','Share Your Idea','Tell us your sport, colors and quantity.')}{step('02','Review Your Mockup','We discuss the design direction with you.')}{step('03','Refine the Details','Review the product and delivery needs together.')}</ol>
        <Link className={styles.secondary} href="/free-mockup/#free-mockup-form">Get a Free Mockup</Link>
      </div>
    </section>

    <section id="sample" className={`${styles.section} ${styles.muted}`} aria-labelledby="sample-title"><div className={`${styles.container} ${styles.sampleBand}`}>
      <p className={styles.eyebrow}>Sample review</p><h2 id="sample-title">{copy.sampleHeading || 'Evaluate a Sample Before You Commit'}</h2><p className={styles.lead}>Eligible team and business buyers can apply for a free sample. Share your project details so our team can review your requirements and confirm the available sample options.</p>
      <ul className={styles.sampleSteps}><li><strong>Eligibility</strong> is reviewed for your project.</li><li><strong>Sample scope</strong> is confirmed before dispatch.</li><li><strong>Shipping arrangements</strong> are reviewed for your destination.</li></ul><Link className={styles.secondary} href="/sample-order/#sample-request-form">Apply for a Free Sample</Link>
    </div></section>

    <section id="production-delivery" className={`${styles.section} ${styles.light}`} aria-labelledby="production-title"><div className={styles.container}>
      <p className={styles.eyebrow}>Production and delivery</p><h2 id="production-title">{copy.productionHeading || 'From Approved Details to Ready-to-Ship Teamwear'}</h2><p className={styles.lead}>Explore the production, inspection and packing stages behind a custom teamwear order.</p>
      <div className={styles.threeGrid}><article><h3>Production</h3><p>Construction starts from the product and details confirmed for the order.</p></article><article><h3>Quality Checks</h3><p>Review the applicable inspection steps before dispatch.</p></article><article><h3>Packing &amp; Dispatch</h3><p>Confirm packing requirements and shipping feasibility for the destination.</p></article></div>
      <Link className={styles.textLink} href="/factory/">See Our Production &amp; Quality Process →</Link>
    </div></section>

    <section id="faq" className={`${styles.section} ${styles.muted}`} aria-labelledby="faq-title"><div className={styles.container}>
      <p className={styles.eyebrow}>Buyer questions</p><h2 id="faq-title">{copy.faqHeading || 'Questions Before You Start?'}</h2><div className={styles.faqList}>{(copy.faqs || faqs.map(([question,answer])=>({question,answer}))).map(({question, answer}) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
    </div></section>

    <section id="contact" className={`${styles.section} ${styles.dark}`} aria-labelledby="contact-title"><div className={`${styles.container} ${styles.formContainer}`}>
      <p className={styles.eyebrow}>Project inquiry</p><h2 id="contact-title">{copy.contactHeading || 'Tell Us About Your Project'}</h2><p className={styles.lead}>Share your product, estimated quantity, required in-hand date and delivery area. We’ll help you review the options and next steps.</p>
      <ProjectQualificationForm intent="project" formId="homepage_project_inquiry" formType="Homepage Project Inquiry" showTitle={false} publicEmail={publicEmail} whatsappHref={whatsappHref} privacyPolicyApproved={privacyPolicyApproved} />
    </div></section>
  </>
}
