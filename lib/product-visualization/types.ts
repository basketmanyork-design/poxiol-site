export type ProductVisualizationRecord = {
  assetId: string
  publicFile: string
  packagePath: string
  classification: 'PRODUCT_VISUALIZATION'
  generatedByAI: true
  thirdPartyLogoAudit: 'PASS_MANUAL_VISUAL_REVIEW'
  allowedUse: string[]
  prohibitedUse: string[]
  category: string
  recommendedPages: string[]
  alt: string
  caption: string
}

export type ProductVisualizationAsset = ProductVisualizationRecord & {
  publicPath: string
  width: number
  height: number
}
