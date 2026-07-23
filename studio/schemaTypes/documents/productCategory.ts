import {defineField, defineType} from 'sanity'
import {TagIcon} from '@sanity/icons'
import {createRiskValidation} from '../validation'

export const productCategory = defineType({
  name: 'productCategory',
  title: 'Product Categories',
  type: 'document',
  icon: TagIcon,
  groups: [{name: 'basic', title: 'Basic'}, {name: 'content', title: 'Content'}, {name: 'display', title: 'Display'}, {name: 'seo', title: 'SEO'}],
  fields: [
    defineField({name: 'categoryName', title: 'Category name', type: 'string', group: 'basic', validation: (Rule) => Rule.required()}),
    defineField({name: 'shortName', title: 'Short name', type: 'string', group: 'basic'}),
    defineField({name: 'slug', title: 'URL slug', type: 'slug', group: 'basic', options: {source: 'categoryName', maxLength: 80}, validation: (Rule) => Rule.required()}),
    defineField({name: 'heroTitle', title: 'Hero title', type: 'string', group: 'content'}),
    defineField({name: 'heroDescription', title: 'Hero description', type: 'text', rows: 3, group: 'content'}),
    defineField({name: 'introduction', title: 'Introduction', type: 'text', rows: 4, group: 'content'}),
    defineField({name: 'heroImage', title: 'Hero image', type: 'imageWithAlt', group: 'content'}),
    defineField({name: 'buyerTypes', title: 'Buyer types', type: 'array', of: [{type: 'string'}], group: 'content'}),
    defineField({name: 'keyFeatures', title: 'Key features', type: 'array', of: [{type: 'string'}], group: 'content'}),
    defineField({name: 'showOnHomepage', title: 'Show on homepage', type: 'boolean', initialValue: false, group: 'display'}),
    defineField({name: 'featured', title: 'Featured', type: 'boolean', initialValue: false, group: 'display'}),
    defineField({name: 'displayOrder', title: 'Display order', type: 'number', initialValue: 0, group: 'display'}),
    defineField({name: 'publishStatus', title: 'Publish status', type: 'publishStatus', group: 'display'}),
    defineField({name: 'seo', title: 'SEO', type: 'seoFields', group: 'seo'}),
  ],
  orderings: [{name: 'order', title: 'Display order', by: [{field: 'displayOrder', direction: 'asc'}]}],
  preview: {select: {title: 'categoryName', subtitle: 'slug.current', media: 'heroImage'}},
  validation: createRiskValidation(['categoryName', 'heroTitle', 'heroDescription', 'introduction']),
})
