import {defineField, defineType} from 'sanity'

export const seoFields = defineType({
  name: 'seoFields',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({name: 'seoTitle', title: 'SEO title', type: 'string', validation: (Rule) => Rule.max(70).warning('Long titles may be truncated in search results.')}),
    defineField({name: 'metaDescription', title: 'Meta description', type: 'text', rows: 3, validation: (Rule) => Rule.min(20).max(180)}),
    defineField({name: 'canonicalUrl', title: 'Canonical URL', type: 'url', validation: (Rule) => Rule.uri({scheme: ['https']})}),
    defineField({name: 'focusKeyword', title: 'Focus keyword', type: 'string'}),
    defineField({name: 'secondaryKeywords', title: 'Secondary keywords', type: 'array', of: [{type: 'string'}]}),
    defineField({name: 'ogTitle', title: 'Open Graph title', type: 'string'}),
    defineField({name: 'ogDescription', title: 'Open Graph description', type: 'text', rows: 2}),
    defineField({name: 'ogImage', title: 'Open Graph image', type: 'imageWithAlt'}),
    defineField({name: 'nofollow', title: 'No-follow', type: 'boolean', initialValue: false}),
    defineField({name: 'schemaType', title: 'Preferred schema type', type: 'string', options: {list: [
      {title: 'Organization', value: 'Organization'},
      {title: 'WebSite', value: 'WebSite'},
      {title: 'Product', value: 'Product'},
      {title: 'Service', value: 'Service'},
      {title: 'Article', value: 'Article'},
      {title: 'FAQPage', value: 'FAQPage'},
      {title: 'CreativeWork', value: 'CreativeWork'},
    ]}}),
    defineField({
      name: 'indexStatus',
      title: 'Index status',
      type: 'string',
      options: {list: [{title: 'Index', value: 'index'}, {title: 'No-index', value: 'noindex'}], layout: 'radio'},
      initialValue: 'index',
    }),
  ],
})

export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image with alt text',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({name: 'altText', title: 'Alt text', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'caption', title: 'Caption', type: 'string'}),
    defineField({name: 'usageNotes', title: 'Usage notes', type: 'text', rows: 2}),
    defineField({name: 'isRealFactoryEvidence', title: 'Real factory evidence', type: 'boolean', initialValue: false}),
  ],
})
