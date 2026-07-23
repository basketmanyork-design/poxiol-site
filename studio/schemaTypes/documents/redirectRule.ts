import {defineField, defineType} from 'sanity'
import {DocumentsIcon} from '@sanity/icons'

export const redirectRule = defineType({
  name: 'redirectRule',
  title: '301 Redirect Rules',
  type: 'document',
  icon: DocumentsIcon,
  fields: [
    defineField({name: 'sourcePath', title: 'Source path', type: 'string', description: 'Example: /old-url/', validation: (Rule) => Rule.required()}),
    defineField({name: 'destinationPath', title: 'Destination path', type: 'string', description: 'Example: /new-url/', validation: (Rule) => Rule.required()}),
    defineField({name: 'redirectType', title: 'Redirect type', type: 'number', options: {list: [{title: '301 permanent', value: 301}, {title: '302 temporary', value: 302}]}, initialValue: 301}),
    defineField({name: 'reason', title: 'Reason', type: 'text', rows: 2}),
    defineField({name: 'active', title: 'Active', type: 'boolean', initialValue: true}),
  ],
  preview: {select: {title: 'sourcePath', subtitle: 'destinationPath'}},
})
