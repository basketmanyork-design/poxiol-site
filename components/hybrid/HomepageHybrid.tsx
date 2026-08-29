import Image from 'next/image'
import Link from 'next/link'
import InquiryLink from '@/components/InquiryLink'
import {ProjectQualificationForm} from '@/components/v8/ProjectQualificationForm'
import {hybridHome} from '@/lib/hybrid/home'
import styles from './HomepageHybrid.module.css'

function Limitation({children}: {children: string}) {
  return <p className={styles.limitation}>{children}</p>
}

export function HomepageHybrid({publicEmail, whatsappHref, privacyPolicyApproved}: {publicEmail: string; whatsappHref: string; privacyPolicyApproved: boolean}) {
  const home = hybridHome

  return (
    <>
      <section className={`${styles.section} ${styles.hero}`} aria-labelledby="hybrid-home-title">
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div>
              <h1 id="hybrid-home-title">{home.hero.title}</h1>
              <p className={styles.lead}>{home.hero.body}</p>
              <div className={styles.actions}>
                <InquiryLink href={home.intents.design.href} className={styles.primary}>{home.intents.design.label}</InquiryLink>
                <InquiryLink href={home.intents.range.href} className={styles.secondary}>{home.intents.range.label}</InquiryLink>
              </div>
              <Limitation>{home.hero.projectReviewNote}</Limitation>
            </div>
            <figure className={styles.figure}>
              <Image
                src="/images/poxiol-teamwear-hero-poxiol-only-v2.webp"
                width={1254}
                height={1254}
                priority
                sizes="(max-width: 767px) calc(100vw - 2rem), 50vw"
                alt="Illustrative POXIOL-branded basketball, football, and warm-up teamwear configurations"
              />
              <figcaption>Illustrative teamwear configuration</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.light}`} aria-labelledby="hybrid-audience-title">
        <div className={styles.container}>
          <h2 id="hybrid-audience-title">{home.audience.title}</h2>
          <p className={styles.lead}>{home.audience.body}</p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.muted}`} aria-labelledby="hybrid-risks-title">
        <div className={styles.container}>
          <p className={styles.eyebrow}>Buyer risk controls</p>
          <h2 id="hybrid-risks-title">Six risks to make visible before production planning</h2>
          <div className={styles.gridSix}>
            {home.risks.map((risk, index) => <article key={risk.title} className={styles.card}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{risk.title}</h3>
              <p>{risk.body}</p>
              <Link href={risk.href}>{risk.cta}</Link>
            </article>)}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.light}`} aria-labelledby="hybrid-capabilities-title">
        <div className={styles.container}>
          <p className={styles.eyebrow}>Capabilities</p>
          <h2 id="hybrid-capabilities-title">Capabilities aligned to repeat-order risk</h2>
          <div className={styles.gridSix}>
            {home.capabilities.map((item, index) => <article key={item.title} className={styles.plainCard}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.muted}`} aria-labelledby="hybrid-explanations-title">
        <div className={styles.container}>
          <p className={styles.eyebrow}>Approval planning</p>
          <h2 id="hybrid-explanations-title">Plan the approval path before production</h2>
          <div className={styles.gridFour}>
            {home.explanations.map(item => <article key={item.title} className={styles.card}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <Limitation>{item.limitation}</Limitation>
            </article>)}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.light}`} aria-labelledby="hybrid-process-title">
        <div className={styles.container}>
          <p className={styles.eyebrow}>Project process</p>
          <h2 id="hybrid-process-title">Make the approval path visible</h2>
          <ol className={styles.process}>
            {home.process.map((step, index) => <li key={step.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>)}
          </ol>
        </div>
      </section>

      <section id="contact" className={`${styles.section} ${styles.light}`} aria-labelledby="hybrid-inquiry-title">
        <div className={styles.container}>
          <p className={styles.eyebrow}>Project inquiry</p>
          <h2 id="hybrid-inquiry-title">Share the project context</h2>
          <p className={styles.lead}>Share the product, quantity, design status, size mix, destination and target date available now. POXIOL will use the brief to identify the next review step.</p>
          <ProjectQualificationForm intent="mockup" formType="Homepage V8 Lead" publicEmail={publicEmail} whatsappHref={whatsappHref} privacyPolicyApproved={privacyPolicyApproved} />
        </div>
      </section>

      <section className={`${styles.section} ${styles.dark}`} aria-labelledby="hybrid-range-title">
        <div className={styles.container}>
          <p className={styles.eyebrow}>Product range</p>
          <h2 id="hybrid-range-title">Build the product range around the account</h2>
          <div className={styles.gridThree}>
            {home.range.map(link => <Link key={link.href} href={link.href} className={styles.rangeLink}>
              <span>{link.title}</span>
              <span>{link.label}</span>
            </Link>)}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.closing}`} aria-labelledby="hybrid-closing-title">
        <div className={styles.container}>
          <h2 id="hybrid-closing-title">{home.closing.title}</h2>
          <p className={styles.lead}>{home.closing.body}</p>
          <div className={styles.actions}>
            <InquiryLink href={home.intents.range.href} className={styles.primary}>{home.intents.range.label}</InquiryLink>
            <InquiryLink href={home.intents.sample.href} className={styles.secondary}>{home.intents.sample.label}</InquiryLink>
          </div>
        </div>
      </section>
    </>
  )
}
