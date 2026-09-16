import {publicSourcePath} from './inquiry-context.ts'
import type {V8ConversionIntent} from './v8/leads.ts'

export const PRODUCT_OPTIONS = ['Soccer Uniforms','Basketball Uniforms','Baseball Uniforms','Training Sets','Running & Track Uniforms','Warm-Up Wear','Other'] as const
export type ProductLine = {product: string; quantity: string; unit: 'pieces' | 'sets'}
export type ProcurementFields = {
  fullName: string; buyerRole: string; company: string; email: string; whatsapp: string;
  products: ProductLine[]; requiredDeliveryDate: string; deliveryCountry: string;
  deliveryPostalCode: string; postalNotApplicable: boolean; additionalDetails: string;
}

const displayNames = new Intl.DisplayNames(['en'], {type: 'region'})
const isoCountryCodes = 'AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW'.split(' ')
export const DELIVERY_COUNTRIES = isoCountryCodes
  .map(code => ({code, name: displayNames.of(code) || code}))
  .filter(item => item.name !== item.code && !['EU','UN','ZZ'].includes(item.code))
  .sort((a,b) => a.name.localeCompare(b.name))

export function validateProcurementFields(fields: ProcurementFields, today: string) {
  const errors: Record<string,string> = {}
  if (!fields.fullName.trim() || fields.fullName.trim().length > 120) errors.fullName = 'Enter your name.'
  const email = fields.email.trim()
  const whatsapp = fields.whatsapp.trim()
  if (!email && !whatsapp) errors.contact = 'Enter an email address or WhatsApp number.'
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address.'
  if (whatsapp && !/^\+[1-9]\d{6,14}$/.test(whatsapp.replace(/[\s()-]/g,''))) errors.whatsapp = 'Use an international WhatsApp number beginning with + and country code.'
  if (!fields.products.length) errors.products = 'Choose at least one product.'
  fields.products.forEach((line,index) => {
    if (!line.product.trim() || line.product.length > 120) errors[`product-${index}`] = 'Choose or enter a product.'
    if (!/^\d+$/.test(line.quantity.trim()) || Number(line.quantity) < 1 || Number(line.quantity) > 1000000) errors[`quantity-${index}`] = 'Enter a positive quantity for this product.'
    if (!['pieces','sets'].includes(line.unit)) errors[`unit-${index}`] = 'Choose pieces or sets.'
  })
  const date = fields.requiredDeliveryDate
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T00:00:00Z`) : null
  if (!parsed || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0,10) !== date || date < today) errors.requiredDeliveryDate = 'Choose the date you need the order in hand (today or later).'
  if (!DELIVERY_COUNTRIES.some(item => item.code === fields.deliveryCountry)) errors.deliveryCountry = 'Choose a delivery country or region.'
  if (!fields.postalNotApplicable && (!fields.deliveryPostalCode.trim() || !/^[^\s<>][^<>]{0,19}$/.test(fields.deliveryPostalCode.trim()))) errors.deliveryPostalCode = 'Enter your delivery postal code, or select the no-postal-code option.'
  if (fields.additionalDetails.length > 4000) errors.additionalDetails = 'Keep additional details under 4,000 characters.'
  return errors
}

export function createProcurementFormData(fields: ProcurementFields, context: {intent: V8ConversionIntent; sourcePage: string; originPage?: string; entryProduct?: string; formType: string; submissionKey: string; attachments?: File[]}) {
  const date = new Date()
  const today = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
  const errors = validateProcurementFields(fields,today)
  if (Object.keys(errors).length) throw new Error(Object.values(errors)[0])
  const data = new FormData()
  data.set('formType',context.formType)
  data.set('intent',context.intent)
  data.set('submission_key',context.submissionKey)
  data.set('sourcePage',publicSourcePath(context.sourcePage))
  if (context.originPage) data.set('originPage',publicSourcePath(context.originPage))
  if (context.entryProduct) data.set('entry_product_reference',context.entryProduct.slice(0,120))
  data.set('fullName',fields.fullName.trim())
  data.set('buyerRole',fields.buyerRole)
  data.set('company',fields.company.trim())
  if (fields.email.trim()) data.set('email',fields.email.trim())
  if (fields.whatsapp.trim()) data.set('whatsapp',fields.whatsapp.trim())
  data.set('products',JSON.stringify(fields.products.map(line => ({product:line.product.trim(),quantity:Number(line.quantity),unit:line.unit}))))
  data.set('requested_product',fields.products.map(line=>line.product.trim()).join('; ').slice(0,500))
  data.set('required_delivery_date',fields.requiredDeliveryDate)
  data.set('delivery_country_code',fields.deliveryCountry)
  data.set('delivery_country',DELIVERY_COUNTRIES.find(item=>item.code===fields.deliveryCountry)!.name)
  data.set('postal_code_status',fields.postalNotApplicable ? 'not_applicable' : 'provided')
  data.set('delivery_postal_code',fields.postalNotApplicable ? '' : fields.deliveryPostalCode.trim())
  if (fields.additionalDetails.trim()) data.set('additional_details',fields.additionalDetails.trim())
  const attachments=context.attachments || []
  attachments.forEach((file,index)=>data.append(`project_file_${index+1}`,file))
  return data
}
