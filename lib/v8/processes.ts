import type {V8ProcessStep} from './types.ts'

export const V8_PROCESSES: {
  journey: readonly V8ProcessStep[]
  manufacturing: readonly V8ProcessStep[]
  qualityControl: readonly V8ProcessStep[]
} = {
  journey: [
    {id: 'idea', title: 'Idea', description: 'Share the project brief, reference, logo or starting idea.'},
    {id: 'design', title: 'Design', description: 'Confirm colors, artwork placement and customization requirements.'},
    {id: 'mockup', title: 'Mockup', description: 'Review a visual mockup prepared from the confirmed project details.'},
    {id: 'sample', title: 'Sample', description: 'Review the sample requirements before bulk production approval.'},
    {id: 'production', title: 'Production', description: 'Produce the approved teamwear specification.'},
    {id: 'qc', title: 'Quality Control', description: 'Inspect the confirmed product and packing requirements.'},
    {id: 'shipment', title: 'Shipment', description: 'Arrange shipping using the method confirmed for the order.'},
  ],
  manufacturing: [
    {id: 'design-preparation', title: 'Design Preparation', description: 'Prepare approved artwork and production details.'},
    {id: 'material-selection', title: 'Material Selection', description: 'Confirm material requirements for the project.'},
    {id: 'printing', title: 'Printing', description: 'Apply the approved artwork using the confirmed printing method.'},
    {id: 'cutting', title: 'Cutting', description: 'Cut material panels according to the confirmed size specification.'},
    {id: 'sewing', title: 'Sewing', description: 'Sew the prepared panels following the approved construction.'},
    {id: 'assembly', title: 'Assembly', description: 'Complete garment assembly and customization details.'},
    {id: 'inspection-preparation', title: 'Inspection Preparation', description: 'Prepare finished items for the required checks.'},
    {id: 'packing', title: 'Packing', description: 'Pack approved items according to the confirmed order details.'},
  ],
  qualityControl: [
    {id: 'incoming-material', title: 'Incoming Material Checks', description: 'Check received materials against confirmed project requirements.'},
    {id: 'printing-inspection', title: 'Printing Inspection', description: 'Review artwork placement and visible print details.'},
    {id: 'sewing-inspection', title: 'Sewing Inspection', description: 'Review stitching and garment construction.'},
    {id: 'size-checking', title: 'Size Checking', description: 'Check finished measurements against the confirmed size specification.'},
    {id: 'final-inspection', title: 'Final Inspection', description: 'Review finished customization and product details.'},
    {id: 'packing-verification', title: 'Packing Verification', description: 'Confirm packing details before shipment preparation.'},
  ],
}
