export const PRODUCTION_PROOF_SLOTS = [
  {id: 'PROOF_DESIGN_ARTWORK', label: 'Design / Artwork', capabilities: ['Design', 'Artwork']},
  {id: 'PROOF_SUBLIMATION_PRINTING', label: 'Sublimation / Printing', capabilities: ['Sublimation', 'Printing']},
  {id: 'PROOF_CUTTING', label: 'Cutting', capabilities: ['Cutting']},
  {id: 'PROOF_SEWING', label: 'Sewing', capabilities: ['Sewing']},
  {id: 'PROOF_COLLAR_BINDING', label: 'Collar / Binding', capabilities: ['Collar', 'Binding']},
  {id: 'PROOF_MEASUREMENT_QC', label: 'Measurement QC', capabilities: ['Measurement', 'QC']},
  {id: 'PROOF_LOGO_NUMBER_QC', label: 'Logo / Number QC', capabilities: ['Logo Placement', 'Name & Number', 'QC']},
  {id: 'PROOF_PACKING', label: 'Packing', capabilities: ['Packing']},
  {id: 'PROOF_SHIPMENT_PREPARATION', label: 'Shipment Preparation', capabilities: ['Shipment Preparation']},
].map((slot) => ({
  ...slot,
  status: 'CONTENT_ASSET_REQUIRED' as const,
  minimumRequirements: ['real media', 'date', 'location/context', 'capability', 'verification source', 'public approval'] as const,
}))
