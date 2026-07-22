import {defineField, defineType} from 'sanity'
import {CaseIcon} from '@sanity/icons'
import {createRiskValidation} from '../validation'

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case Studies',
  type: 'document',
  icon: CaseIcon,
  groups: [{name: 'basic', title: 'Basic'}, {name: 'buyer', title: 'Buyer'}, {name: 'content', title: 'Content'}, {name: 'result', title: 'Result'}, {name: 'seo', title: 'SEO'}],
  fields: [
    defineField({name: 'projectTitle', title: 'Project title', type: 'string', group: 'basic', validation: (Rule) => Rule.required()}),
    defineField({name: 'title', title: 'Legacy title fallback', type: 'string', group: 'basic'}),
    defineField({name: 'slug', title: 'URL slug', type: 'slug', group: 'basic', options: {source: 'projectTitle', maxLength: 80}, validation: (Rule) => Rule.required()}),
    defineField({name: 'country', title: 'Country', type: 'string', group: 'buyer'}),
    defineField({name: 'countryOrRegion', title: 'Country or region', type: 'string', group: 'buyer'}),
    defineField({name: 'buyerName', title: 'Buyer name', type: 'string', group: 'buyer', description: 'Use only when the customer has approved public naming.'}),
    defineField({name: 'product', title: 'Product', type: 'string', group: 'basic'}),
    defineField({name: 'productType', title: 'Product type', type: 'string', group: 'basic'}),
    defineField({name: 'heroImage', title: 'Hero image', type: 'imageWithAlt', group: 'content'}),
    defineField({name: 'projectBackground', title: 'Project background', type: 'text', rows: 4, group: 'content'}),
    defineField({name: 'overview', title: 'Overview', type: 'text', rows: 4, group: 'content'}),
    defineField({name: 'solution', title: 'Solution', type: 'text', rows: 4, group: 'content'}),
    defineField({name: 'qualityControl', title: 'Quality control', type: 'text', rows: 3, group: 'content'}),
    defineField({name: 'qcProcess', title: 'QC process', type: 'text', rows: 3, group: 'content'}),
    defineField({name: 'packingDelivery', title: 'Packing and delivery', type: 'text', rows: 3, group: 'content'}),
    defineField({name: 'packaging', title: 'Packaging', type: 'text', rows: 3, group: 'content'}),
    defineField({name: 'buyerFeedback', title: 'Buyer feedback', type: 'text', rows: 3, group: 'result', description: 'Use only with buyer approval.'}),
    defineField({name: 'displayOrder', title: 'Display order', type: 'number', initialValue: 0, group: 'seo'}),
    defineField({name: 'publishStatus', title: 'Publish status', type: 'publishStatus', group: 'seo'}),
    defineField({name: 'seo', title: 'SEO', type: 'seoFields', group: 'seo'}),
  ],
  preview: {select: {title: 'projectTitle', subtitle: 'country', media: 'heroImage'}},
  validation: createRiskValidation(['projectTitle', 'projectBackground', 'overview', 'solution', 'buyerFeedback']),
})
