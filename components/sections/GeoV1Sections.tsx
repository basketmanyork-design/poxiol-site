import {SectionHeading} from '@/components/ui'
import {GEO_V1, type GeoProductDetails} from '@/lib/geo-v1'

export function HomepageGeoEntitySections({showCustomerSegments = true}: {showCustomerSegments?: boolean} = {}) {
  return (
    <>
      <section className="border-b border-white/5 bg-neutral-950 px-5 py-16 text-white md:px-10 md:py-24 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Entity Definition" title={GEO_V1.homepage.entityTitle} dark />
          <div className="grid gap-6 text-base leading-8 text-neutral-300 md:grid-cols-2 md:text-lg">
            {GEO_V1.homepage.entityParagraphs.map((paragraph) => (
              <p key={paragraph} className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 md:p-9">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {showCustomerSegments ? <section className="border-b border-neutral-200 bg-white px-5 py-16 text-neutral-950 md:px-10 md:py-24 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Customer Segments"
            title={GEO_V1.homepage.customerTitle}
            subtitle="Custom teamwear support for programs and B2B partners with different production needs."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {GEO_V1.homepage.customerSegments.map((segment) => (
              <article key={segment.title} className="rounded-[2rem] border border-neutral-200 bg-neutral-50 p-7">
                <h3 className="text-xl font-black uppercase tracking-tight">{segment.title}</h3>
                <p className="mt-4 text-sm leading-7 text-neutral-600">{segment.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section> : null}
    </>
  )
}

export function ProductGeoSections({details}: {details: GeoProductDetails}) {
  return (
    <>
      <section className="border-b border-neutral-200 bg-white px-5 py-16 text-neutral-950 md:px-10 md:py-24 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="GEO Product Summary"
            title="Product Overview"
            subtitle="Confirmed product and sourcing information for custom teamwear buyers."
          />
          <dl className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {details.overview.map(({label, value}) => (
              <div key={label} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
                <dt className="text-xs font-black uppercase tracking-widest text-lime-700">{label}</dt>
                <dd className="mt-3 text-sm font-bold leading-6 text-neutral-700">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-b border-neutral-200 bg-neutral-100 px-5 py-16 text-neutral-950 md:px-10 md:py-24 xl:px-20">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            eyebrow="Confirmed Fields"
            title="Technical Specifications"
            subtitle="Project-specific values remain clearly marked until they are confirmed during consultation."
          />
          <div className="overflow-x-auto rounded-[2rem] border border-neutral-200 bg-white">
            <table className="w-full min-w-[620px] border-collapse text-left">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-neutral-500">Specification</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-neutral-500">Confirmed Detail</th>
                </tr>
              </thead>
              <tbody>
                {details.specifications.map(({label, value}) => (
                  <tr key={label} className="border-b border-neutral-200 last:border-b-0">
                    <th scope="row" className="px-6 py-5 text-sm font-black text-neutral-950">{label}</th>
                    <td className="px-6 py-5 text-sm leading-6 text-neutral-600">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 text-neutral-950 md:px-10 md:py-24 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Buyer Fit" title="Recommended For" />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {details.recommendedFor.map((item) => (
              <li key={item} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-sm font-black uppercase tracking-tight">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
