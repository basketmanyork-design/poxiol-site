import {defineField, defineType} from 'sanity'
import {ImagesIcon} from '@sanity/icons'

const capabilities = [
  'Design', 'Artwork', 'Sublimation', 'Printing', 'Cutting', 'Sewing', 'Collar', 'Binding',
  'Fabric', 'Label', 'Measurement', 'Logo Placement', 'Name & Number', 'Color Check', 'QC',
  'Packing', 'Shipment Preparation',
].map((value) => ({title: value, value}))

export const evidenceRecord = defineType({
  name: 'evidenceRecord',
  title: 'Truth Evidence Records',
  type: 'document',
  icon: ImagesIcon,
  groups: [{name: 'media', title: 'Media'}, {name: 'relations', title: 'Relations'}, {name: 'verification', title: 'Verification'}],
  fields: [
    defineField({name: 'evidenceType', title: 'Evidence type', type: 'string', group: 'media', options: {list: [{title: 'Image', value: 'IMAGE'}, {title: 'Video', value: 'VIDEO'}], layout: 'radio'}, validation: (Rule) => Rule.required()}),
    defineField({name: 'image', title: 'Real image', type: 'imageWithAlt', group: 'media', hidden: ({parent}) => parent?.evidenceType !== 'IMAGE'}),
    defineField({name: 'video', title: 'Real video', type: 'file', group: 'media', options: {accept: 'video/*'}, hidden: ({parent}) => parent?.evidenceType !== 'VIDEO'}),
    defineField({name: 'videoPoster', title: 'Video poster', type: 'imageWithAlt', group: 'media', hidden: ({parent}) => parent?.evidenceType !== 'VIDEO'}),
    defineField({name: 'caption', title: 'Public caption', type: 'string', group: 'media', validation: (Rule) => Rule.required()}),
    defineField({name: 'processStage', title: 'Process stage', type: 'string', group: 'relations', validation: (Rule) => Rule.required()}),
    defineField({name: 'relatedProducts', title: 'Related products', type: 'array', group: 'relations', of: [{type: 'reference', to: [{type: 'product'}]}]}),
    defineField({name: 'relatedSports', title: 'Related sports', type: 'array', group: 'relations', of: [{type: 'string'}]}),
    defineField({name: 'relatedProjects', title: 'Related projects', type: 'array', group: 'relations', of: [{type: 'reference', to: [{type: 'caseStudy'}]}]}),
    defineField({name: 'relatedCapabilities', title: 'Related capabilities', type: 'array', group: 'relations', of: [{type: 'string', options: {list: capabilities}}], validation: (Rule) => Rule.required().min(1)}),
    defineField({name: 'evidenceDate', title: 'Evidence date', type: 'date', group: 'verification', validation: (Rule) => Rule.required()}),
    defineField({name: 'verificationStatus', title: 'Verification status', type: 'string', group: 'verification', options: {list: [
      {title: 'Verified', value: 'VERIFIED'},
      {title: 'Pending', value: 'PENDING'},
      {title: 'Internal only', value: 'INTERNAL_ONLY'},
      {title: 'Rejected', value: 'REJECTED'},
    ]}, initialValue: 'PENDING', validation: (Rule) => Rule.required()}),
    defineField({name: 'visibility', title: 'Visibility', type: 'string', group: 'verification', options: {list: [{title: 'Private', value: 'PRIVATE'}, {title: 'Public', value: 'PUBLIC'}], layout: 'radio'}, initialValue: 'PRIVATE', validation: (Rule) => Rule.required()}),
    defineField({name: 'publicUseApproved', title: 'Public use approved', type: 'boolean', group: 'verification', initialValue: false, validation: (Rule) => Rule.required()}),
    defineField({name: 'internalNotes', title: 'Internal notes', type: 'text', rows: 4, group: 'verification', validation: (Rule) => Rule.required()}),
    defineField({name: 'verifiedAt', title: 'Verified at', type: 'datetime', group: 'verification'}),
    defineField({name: 'verifiedBy', title: 'Verified by', type: 'string', group: 'verification'}),
  ],
  preview: {select: {title: 'caption', subtitle: 'verificationStatus', media: 'image'}},
})
