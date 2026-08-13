import {defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons'

const mediaStages = [
  {title: 'Fabric inspection', value: 'fabric-inspection'},
  {title: 'Printing', value: 'printing'},
  {title: 'Cutting', value: 'cutting'},
  {title: 'Sewing', value: 'sewing'},
  {title: 'Quality control', value: 'qc'},
  {title: 'Packing', value: 'packing'},
  {title: 'Factory overview video', value: 'factory-overview-video'},
  {title: 'Production workflow video', value: 'production-workflow-video'},
  {title: 'Quality inspection video', value: 'quality-inspection-video'},
]

export const verifiedMediaAsset = defineType({
  name: 'verifiedMediaAsset',
  title: 'Verified Production Media',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'mediaType',
      title: 'Media type',
      type: 'string',
      options: {list: [{title: 'Image', value: 'image'}, {title: 'Video', value: 'video'}], layout: 'radio'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'stage', title: 'Production stage', type: 'string', options: {list: mediaStages}, validation: (Rule) => Rule.required()}),
    defineField({name: 'image', title: 'Verified image', type: 'imageWithAlt', hidden: ({parent}) => parent?.mediaType !== 'image'}),
    defineField({name: 'video', title: 'Verified video', type: 'file', options: {accept: 'video/*'}, hidden: ({parent}) => parent?.mediaType !== 'video'}),
    defineField({name: 'altText', title: 'Alt text', type: 'string', description: 'Required before a verified image can render on the website.'}),
    defineField({name: 'caption', title: 'Caption', type: 'string'}),
    defineField({name: 'verified', title: 'Approved as authentic POXIOL production media', type: 'boolean', initialValue: false}),
    defineField({name: 'verificationNote', title: 'Verification note', type: 'text', rows: 2, description: 'Record the internal source or approval context. This is not published.'}),
  ],
  preview: {
    select: {title: 'caption', stage: 'stage', verified: 'verified', media: 'image'},
    prepare({title, stage, verified, media}) {
      return {title: title || stage || 'Production media', subtitle: verified ? 'Verified' : 'Not verified', media}
    },
  },
})
