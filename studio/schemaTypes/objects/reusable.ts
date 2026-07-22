import {defineField, defineType} from 'sanity'

export const publishStatus = defineType({
  name: 'publishStatus',
  title: 'Publish status',
  type: 'string',
  options: {
    list: [
      {title: 'Draft', value: 'draft'},
      {title: 'Published', value: 'published'},
      {title: 'Unpublished', value: 'unpublished'},
    ],
    layout: 'radio',
  },
  initialValue: 'draft',
})

export const callToAction = defineType({
  name: 'callToAction',
  title: 'Call to action',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Button label', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'url', title: 'URL or path', type: 'string', description: 'Use an internal path such as /contact/ or a full external URL.', validation: (Rule) => Rule.required()}),
    defineField({name: 'style', title: 'Style', type: 'string', options: {list: [{title: 'Primary', value: 'primary'}, {title: 'Secondary', value: 'secondary'}], layout: 'radio'}, initialValue: 'primary'}),
  ],
})

export const internalLink = defineType({
  name: 'internalLink',
  title: 'Internal link',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'page', title: 'Target page', type: 'reference', to: [{type: 'sitePage'}, {type: 'productCategory'}, {type: 'product'}, {type: 'article'}]}),
  ],
  preview: {select: {title: 'label'}},
})

export const faqReference = defineType({
  name: 'faqReference',
  title: 'FAQ reference',
  type: 'object',
  fields: [
    defineField({name: 'faq', title: 'FAQ item', type: 'reference', to: [{type: 'faqItem'}], validation: (Rule) => Rule.required()}),
    defineField({name: 'displayOrder', title: 'Display order', type: 'number', initialValue: 0}),
  ],
  preview: {select: {title: 'faq.question'}},
})

export const relatedContent = defineType({
  name: 'relatedContent',
  title: 'Related content',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Module title', type: 'string'}),
    defineField({name: 'guides', title: 'Related guides/articles', type: 'array', of: [{type: 'reference', to: [{type: 'article'}]}]}),
    defineField({name: 'products', title: 'Related products', type: 'array', of: [{type: 'reference', to: [{type: 'product'}]}]}),
    defineField({name: 'caseStudies', title: 'Related case studies', type: 'array', of: [{type: 'reference', to: [{type: 'caseStudy'}]}]}),
  ],
})

export const procurementOverride = defineType({
  name: 'procurementOverride',
  title: 'Procurement override',
  type: 'object',
  fields: [
    defineField({name: 'overrideMOQ', title: 'Override MOQ', type: 'boolean', initialValue: false}),
    defineField({name: 'overriddenMOQ', title: 'Custom MOQ', type: 'string', hidden: ({parent}) => !parent?.overrideMOQ}),
    defineField({name: 'overrideSampleTime', title: 'Override sample time', type: 'boolean', initialValue: false}),
    defineField({name: 'overriddenSampleTime', title: 'Custom sample time', type: 'string', hidden: ({parent}) => !parent?.overrideSampleTime}),
    defineField({name: 'overrideReason', title: 'Override reason', type: 'text', rows: 2, hidden: ({parent}) => !parent?.overrideMOQ && !parent?.overrideSampleTime}),
  ],
})
