export type CatalogOption = {id: string; label: string}

export type PoxiolCatalog = {
  contractVersion: string
  lastReviewed: string
  organization: {
    id: string
    name: string
    legalName: string
    url: string
    category: string
    description: string
  }
  buyerTypes: CatalogOption[]
  sports: CatalogOption[]
  products: CatalogOption[]
  customization: CatalogOption[]
  serviceRegions: Array<CatalogOption & {qualification: string}>
  procurement: {
    sampleMinimumOrder: {
      value: number
      unit: 'set' | 'piece'
      purpose: string
      qualification: string
    }
    bulkMinimumOrder: {fixedValueAvailable: false; qualification: string}
    mockupLeadTime: {min: number; max: number; unit: string; qualification: string}
    sampleLeadTime: {min: number; max: number; unit: string; qualification: string}
    bulkLeadTime: {min: number; max: number; unit: string; qualification: string}
  }
  qualityControl: {
    inspectionBeforeShipment: boolean
    sizeTolerance: {min: number; max: number; unit: string}
    evidenceUrls: string[]
  }
  actions: {
    requestForQuote: {
      formUrl: string
      schemaUrl: string
      humanReviewRequired: boolean
      automaticQuote: boolean
      automaticOrderAcceptance: boolean
    }
  }
}

export const catalog: PoxiolCatalog
export function validateCatalog(value: PoxiolCatalog): string[]
export function createCapabilityDocument(value?: PoxiolCatalog): Record<string, unknown>
export function createRfqSchema(value?: PoxiolCatalog): Record<string, unknown>
export function createAgentManifest(value?: PoxiolCatalog): Record<string, unknown>
