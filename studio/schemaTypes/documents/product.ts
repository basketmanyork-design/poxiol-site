import {defineField, defineType} from 'sanity'
import {PackageIcon} from '@sanity/icons'
import {createRiskValidation} from '../validation'

export const product = defineType({
  name: 'product',
  title: 'Products',
  type: 'document',
  icon: PackageIcon,
  groups: [{name: 'basic', title: 'Basic'}, {name: 'media', title: 'Media'}, {name: 'content', title: 'Content'}, {name: 'display', title: 'Display'}, {name: 'seo', title: 'SEO'}],
  fields: [
    defineField({name: 'productName', title: 'Product name', type: 'string', group: 'basic', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', title: 'URL slug', type: 'slug', group: 'basic', options: {source: 'productName', maxLength: 80}, validation: (Rule) => Rule.required()}),
    defineField({name: 'category', title: 'Category', type: 'reference', to: [{type: 'productCategory'}], group: 'basic'}),
    defineField({name: 'shortDescription', title: 'Short description', type: 'text', rows: 2, group: 'basic'}),
    defineField({name: 'fullDescription', title: 'Full description', type: 'text', rows: 5, group: 'content'}),
    defineField({name: 'primaryImage', title: 'Primary image', type: 'imageWithAlt', group: 'media'}),
    defineField({name: 'detailImages', title: 'Detail images', type: 'array', of: [{type: 'imageWithAlt'}], group: 'media'}),
    defineField({name: 'productionImages', title: 'Production images', type: 'array', of: [{type: 'imageWithAlt'}], group: 'media'}),
    defineField({name: 'qcImages', title: 'QC images', type: 'array', of: [{type: 'imageWithAlt'}], group: 'media'}),
    defineField({name: 'packagingImages', title: 'Packaging images', type: 'array', of: [{type: 'imageWithAlt'}], group: 'media'}),
    defineField({name: 'fabricOptions', title: 'Fabric options', type: 'array', of: [{type: 'string'}], group: 'content'}),
    defineField({name: 'customizationOptions', title: 'Customization options', type: 'array', of: [{type: 'string'}], group: 'content'}),
    defineField({name: 'procurementOverride', title: 'Procurement override', type: 'procurementOverride', group: 'content'}),
    defineField({name: 'relatedFaqs', title: 'Related FAQ', type: 'array', of: [{type: 'faqReference'}], group: 'content'}),
    defineField({name: 'featured', title: 'Featured', type: 'boolean', initialValue: false, group: 'display'}),
    defineField({name: 'displayOrder', title: 'Display order', type: 'number', initialValue: 0, group: 'display'}),
    defineField({name: 'publishStatus', title: 'Publish status', type: 'publishStatus', group: 'display'}),
    defineField({name: 'seo', title: 'SEO', type: 'seoFields', group: 'seo'}),
  ],
  orderings: [{name: 'order', title: 'Display order', by: [{field: 'displayOrder', direction: 'asc'}]}, {name: 'name', title: 'Name', by: [{field: 'productName', direction: 'asc'}]}],
  preview: {select: {title: 'productName', subtitle: 'category.categoryName', media: 'primaryImage'}},
  validation: createRiskValidation(['productName', 'shortDescription', 'fullDescription']),
})
