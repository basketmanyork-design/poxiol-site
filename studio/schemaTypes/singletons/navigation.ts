import {defineField, defineType} from 'sanity'
import {MenuIcon} from '@sanity/icons'

const linkFields = [
  defineField({name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required()}),
  defineField({name: 'externalUrl', title: 'URL or path', type: 'string', description: 'Use an internal path such as /products/ or a full external URL.', validation: (Rule) => Rule.required()}),
  defineField({name: 'openInNewWindow', title: 'Open in new window', type: 'boolean', initialValue: false}),
]

export const navigationSettings = defineType({
  name: 'navigationSettings',
  title: 'Navigation',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'headerNavigation',
      title: 'Header navigation',
      type: 'array',
      of: [{type: 'object', fields: linkFields}],
    }),
  ],
})

export const footerSettings = defineType({
  name: 'footerSettings',
  title: 'Footer',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'footerColumns',
      title: 'Footer columns',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({name: 'title', title: 'Column title', type: 'string', validation: (Rule) => Rule.required()}),
          defineField({name: 'links', title: 'Links', type: 'array', of: [{type: 'object', fields: linkFields}]}),
        ],
      }],
    }),
    defineField({name: 'copyright', title: 'Copyright', type: 'string'}),
    defineField({name: 'policyLinks', title: 'Policy links', type: 'array', of: [{type: 'object', fields: linkFields}]}),
  ],
})
