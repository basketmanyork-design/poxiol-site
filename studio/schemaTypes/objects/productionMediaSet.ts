import {defineField, defineType} from 'sanity'
import {ImagesIcon} from '@sanity/icons'

function mediaField(name: string, title: string, mediaType: 'image' | 'video', stage: string) {
  return defineField({
    name,
    title,
    type: 'verifiedMediaAsset',
    initialValue: {mediaType, stage, verified: false},
  })
}

export const productionMediaSet = defineType({
  name: 'productionMediaSet',
  title: 'V8 Production Media Set',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    mediaField('fabricInspection', 'Fabric inspection image', 'image', 'fabric-inspection'),
    mediaField('printing', 'Printing image', 'image', 'printing'),
    mediaField('cutting', 'Cutting image', 'image', 'cutting'),
    mediaField('sewing', 'Sewing image', 'image', 'sewing'),
    mediaField('qc', 'Quality control image', 'image', 'qc'),
    mediaField('packing', 'Packing image', 'image', 'packing'),
    mediaField('factoryOverviewVideo', 'Factory overview video', 'video', 'factory-overview-video'),
    mediaField('productionWorkflowVideo', 'Production workflow video', 'video', 'production-workflow-video'),
    mediaField('qualityInspectionVideo', 'Quality inspection video', 'video', 'quality-inspection-video'),
  ],
})
