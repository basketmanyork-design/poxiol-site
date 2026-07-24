import {defineField, defineType} from 'sanity'

export const seoFields = defineType({
  name: 'seoFields',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({name: 'seoTitle', title: 'SEO title', type: 'string', validation: (Rule) => Rule.max(70).warning('Long titles may be truncated in search results.')}),
    defineField({name: 'metaDescription', title: 'Meta description', type: 'text', rows: 3, validation: (Rule) => Rule.min(20).max(180)}),
    defineField({name: 'canonicalUrl', title: 'Canonical URL', type: 'url', validation: (Rule) => Rule.uri({scheme: ['https']})}),
    defineField({name: 'ogImage', title: 'Open Graph image', type: 'imageWithAlt'}),
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
    defineField({name: 'isRealFactoryEvidence', title: 'Real factory evidence', type: 'boolean', initialValue: false}),
  ],
})
