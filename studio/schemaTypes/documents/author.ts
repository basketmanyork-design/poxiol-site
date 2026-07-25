import {defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons'

export const author = defineType({
  name: 'author',
  title: 'Authors',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'role', title: 'Role', type: 'string'}),
    defineField({name: 'brand', title: 'Brand', type: 'string', initialValue: 'POXIOL'}),
    defineField({name: 'avatar', title: 'Avatar', type: 'imageWithAlt'}),
    defineField({name: 'shortBio', title: 'Short bio', type: 'text', rows: 3}),
    defineField({name: 'credentials', title: 'Credentials', type: 'array', of: [{type: 'string'}]}),
    defineField({name: 'active', title: 'Active', type: 'boolean', initialValue: true}),
  ],
  preview: {select: {title: 'name', subtitle: 'role', media: 'avatar'}},
})
