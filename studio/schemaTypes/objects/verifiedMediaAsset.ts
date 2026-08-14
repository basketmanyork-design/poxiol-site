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

const verificationStates = [
  {title: 'Verified POXIOL-owned media', value: 'VERIFIED_POXIOL'},
  {title: 'Verified buyer-authorized media', value: 'VERIFIED_BUYER_AUTHORIZED'},
  {title: 'Verified product only', value: 'PRODUCT_ONLY_VERIFIED'},
  {title: 'Requires human review', value: 'REQUIRES_HUMAN_REVIEW'},
  {title: 'Rejected', value: 'REJECTED'},
]

const authorizationStates = [
  {title: 'Approved', value: 'APPROVED'},
  {title: 'Not applicable', value: 'NOT_APPLICABLE'},
  {title: 'Unknown', value: 'UNKNOWN'},
  {title: 'Rejected', value: 'REJECTED'},
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
    defineField({name: 'posterImage', title: 'Verified video poster', type: 'imageWithAlt', description: 'Required before a verified video can render on the website.', hidden: ({parent}) => parent?.mediaType !== 'video'}),
    defineField({name: 'altText', title: 'Alt text', type: 'string', description: 'Required before a verified image can render on the website.'}),
    defineField({name: 'caption', title: 'Caption', type: 'string'}),
    defineField({name: 'verified', title: 'Approved as authentic POXIOL production media', type: 'boolean', initialValue: false}),
    defineField({name: 'verificationStatus', title: 'Verification status', type: 'string', options: {list: verificationStates}, initialValue: 'REQUIRES_HUMAN_REVIEW', validation: (Rule) => Rule.required()}),
    defineField({name: 'publicUseApproved', title: 'Public website use approved', type: 'boolean', initialValue: false, validation: (Rule) => Rule.required()}),
    defineField({name: 'source', title: 'Original source', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'photographerOrOwner', title: 'Photographer or owner', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'productRelationship', title: 'POXIOL product relationship', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'peopleVisible', title: 'People visible', type: 'boolean', initialValue: false}),
    defineField({name: 'peopleAuthorization', title: 'People authorization', type: 'string', options: {list: authorizationStates}, initialValue: 'NOT_APPLICABLE'}),
    defineField({name: 'thirdPartyLogoVisible', title: 'Third-party logo visible', type: 'boolean', initialValue: false}),
    defineField({name: 'thirdPartyLogoAuthorization', title: 'Third-party logo authorization', type: 'string', options: {list: authorizationStates}, initialValue: 'NOT_APPLICABLE'}),
    defineField({name: 'customerArtworkVisible', title: 'Customer artwork visible', type: 'boolean', initialValue: false}),
    defineField({name: 'customerArtworkAuthorization', title: 'Customer artwork authorization', type: 'string', options: {list: authorizationStates}, initialValue: 'NOT_APPLICABLE'}),
    defineField({name: 'buyerAuthorization', title: 'Buyer public-use authorization', type: 'string', options: {list: authorizationStates}, initialValue: 'NOT_APPLICABLE'}),
    defineField({name: 'privateInformationVisible', title: 'Private information visible', type: 'boolean', initialValue: false}),
    defineField({name: 'intendedCategory', title: 'Evidence category', type: 'string', description: 'Examples: front, fabric, measurement, packing, printing.'}),
    defineField({name: 'verificationNote', title: 'Verification note', type: 'text', rows: 2, description: 'Record the internal source and approval context. This is not published.', validation: (Rule) => Rule.required()}),
    defineField({name: 'verifiedAt', title: 'Verified at', type: 'datetime', validation: (Rule) => Rule.required()}),
    defineField({name: 'verifiedBy', title: 'Verified by', type: 'string', validation: (Rule) => Rule.required()}),
  ],
  preview: {
    select: {title: 'caption', stage: 'stage', verified: 'verified', media: 'image'},
    prepare({title, stage, verified, media}) {
      return {title: title || stage || 'Production media', subtitle: verified ? 'Verified' : 'Not verified', media}
    },
  },
})
