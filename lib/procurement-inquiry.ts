import {publicSourcePath} from './inquiry-context.ts'
import type {V8ConversionIntent} from './v8/leads.ts'

export const PRODUCT_OPTIONS = ['Soccer Uniforms','Basketball Uniforms','Baseball Uniforms','Training Sets','Running & Track Uniforms','Warm-Up Wear','Other'] as const
export type ProductLine = {product: string; quantity: string; unit: 'pieces' | 'sets'}
export type ProcurementFields = {
  fullName: string; buyerRole: string; company: string; email: string; whatsapp: string;
  products: ProductLine[]; requiredDeliveryDate: string; deliveryCountry: string;
  deliveryPostalCode: string; postalNotApplicable: boolean; additionalDetails: string;
}

const isoCountryCodes = 'AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW'.split(' ')
// Keep the option labels in source rather than calling a runtime locale lookup during
// SSR and hydration. Browser and Node ICU data can disagree about aliases.
const DELIVERY_COUNTRY_NAMES: Record<string,string> = {"AD":"Andorra","AE":"United Arab Emirates","AF":"Afghanistan","AG":"Antigua & Barbuda","AI":"Anguilla","AL":"Albania","AM":"Armenia","AO":"Angola","AQ":"Antarctica","AR":"Argentina","AS":"American Samoa","AT":"Austria","AU":"Australia","AW":"Aruba","AX":"Åland Islands","AZ":"Azerbaijan","BA":"Bosnia & Herzegovina","BB":"Barbados","BD":"Bangladesh","BE":"Belgium","BF":"Burkina Faso","BG":"Bulgaria","BH":"Bahrain","BI":"Burundi","BJ":"Benin","BL":"St. Barthélemy","BM":"Bermuda","BN":"Brunei","BO":"Bolivia","BQ":"Caribbean Netherlands","BR":"Brazil","BS":"Bahamas","BT":"Bhutan","BV":"Bouvet Island","BW":"Botswana","BY":"Belarus","BZ":"Belize","CA":"Canada","CC":"Cocos (Keeling) Islands","CD":"Congo - Kinshasa","CF":"Central African Republic","CG":"Congo - Brazzaville","CH":"Switzerland","CI":"Côte d’Ivoire","CK":"Cook Islands","CL":"Chile","CM":"Cameroon","CN":"China","CO":"Colombia","CR":"Costa Rica","CU":"Cuba","CV":"Cape Verde","CW":"Curaçao","CX":"Christmas Island","CY":"Cyprus","CZ":"Czechia","DE":"Germany","DJ":"Djibouti","DK":"Denmark","DM":"Dominica","DO":"Dominican Republic","DZ":"Algeria","EC":"Ecuador","EE":"Estonia","EG":"Egypt","EH":"Western Sahara","ER":"Eritrea","ES":"Spain","ET":"Ethiopia","FI":"Finland","FJ":"Fiji","FK":"Falkland Islands","FM":"Micronesia","FO":"Faroe Islands","FR":"France","GA":"Gabon","GB":"United Kingdom","GD":"Grenada","GE":"Georgia","GF":"French Guiana","GG":"Guernsey","GH":"Ghana","GI":"Gibraltar","GL":"Greenland","GM":"Gambia","GN":"Guinea","GP":"Guadeloupe","GQ":"Equatorial Guinea","GR":"Greece","GS":"South Georgia & South Sandwich Islands","GT":"Guatemala","GU":"Guam","GW":"Guinea-Bissau","GY":"Guyana","HK":"Hong Kong SAR China","HM":"Heard & McDonald Islands","HN":"Honduras","HR":"Croatia","HT":"Haiti","HU":"Hungary","ID":"Indonesia","IE":"Ireland","IL":"Israel","IM":"Isle of Man","IN":"India","IO":"British Indian Ocean Territory","IQ":"Iraq","IR":"Iran","IS":"Iceland","IT":"Italy","JE":"Jersey","JM":"Jamaica","JO":"Jordan","JP":"Japan","KE":"Kenya","KG":"Kyrgyzstan","KH":"Cambodia","KI":"Kiribati","KM":"Comoros","KN":"St. Kitts & Nevis","KP":"North Korea","KR":"South Korea","KW":"Kuwait","KY":"Cayman Islands","KZ":"Kazakhstan","LA":"Laos","LB":"Lebanon","LC":"St. Lucia","LI":"Liechtenstein","LK":"Sri Lanka","LR":"Liberia","LS":"Lesotho","LT":"Lithuania","LU":"Luxembourg","LV":"Latvia","LY":"Libya","MA":"Morocco","MC":"Monaco","MD":"Moldova","ME":"Montenegro","MF":"St. Martin","MG":"Madagascar","MH":"Marshall Islands","MK":"North Macedonia","ML":"Mali","MM":"Myanmar (Burma)","MN":"Mongolia","MO":"Macao SAR China","MP":"Northern Mariana Islands","MQ":"Martinique","MR":"Mauritania","MS":"Montserrat","MT":"Malta","MU":"Mauritius","MV":"Maldives","MW":"Malawi","MX":"Mexico","MY":"Malaysia","MZ":"Mozambique","NA":"Namibia","NC":"New Caledonia","NE":"Niger","NF":"Norfolk Island","NG":"Nigeria","NI":"Nicaragua","NL":"Netherlands","NO":"Norway","NP":"Nepal","NR":"Nauru","NU":"Niue","NZ":"New Zealand","OM":"Oman","PA":"Panama","PE":"Peru","PF":"French Polynesia","PG":"Papua New Guinea","PH":"Philippines","PK":"Pakistan","PL":"Poland","PM":"St. Pierre & Miquelon","PN":"Pitcairn Islands","PR":"Puerto Rico","PS":"Palestinian Territories","PT":"Portugal","PW":"Palau","PY":"Paraguay","QA":"Qatar","RE":"Réunion","RO":"Romania","RS":"Serbia","RU":"Russia","RW":"Rwanda","SA":"Saudi Arabia","SB":"Solomon Islands","SC":"Seychelles","SD":"Sudan","SE":"Sweden","SG":"Singapore","SH":"St. Helena","SI":"Slovenia","SJ":"Svalbard & Jan Mayen","SK":"Slovakia","SL":"Sierra Leone","SM":"San Marino","SN":"Senegal","SO":"Somalia","SR":"Suriname","SS":"South Sudan","ST":"São Tomé & Príncipe","SV":"El Salvador","SX":"Sint Maarten","SY":"Syria","SZ":"Eswatini","TC":"Turks & Caicos Islands","TD":"Chad","TF":"French Southern Territories","TG":"Togo","TH":"Thailand","TJ":"Tajikistan","TK":"Tokelau","TL":"Timor-Leste","TM":"Turkmenistan","TN":"Tunisia","TO":"Tonga","TR":"Türkiye","TT":"Trinidad & Tobago","TV":"Tuvalu","TW":"Taiwan","TZ":"Tanzania","UA":"Ukraine","UG":"Uganda","UM":"U.S. Outlying Islands","US":"United States","UY":"Uruguay","UZ":"Uzbekistan","VA":"Vatican City","VC":"St. Vincent & Grenadines","VE":"Venezuela","VG":"British Virgin Islands","VI":"U.S. Virgin Islands","VN":"Vietnam","VU":"Vanuatu","WF":"Wallis & Futuna","WS":"Samoa","YE":"Yemen","YT":"Mayotte","ZA":"South Africa","ZM":"Zambia","ZW":"Zimbabwe"}
export const DELIVERY_COUNTRIES = isoCountryCodes
  .map(code => ({code, name: DELIVERY_COUNTRY_NAMES[code] || code}))
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

export function createProcurementFormData(fields: ProcurementFields, context: {intent: V8ConversionIntent; sourcePage: string; originPage?: string; entryProduct?: string; formType: string; submissionKey: string; preferredContactMethod?: 'email'|'whatsapp'; attachments?: File[]}) {
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
  if (context.preferredContactMethod) data.set('preferred_contact_method',context.preferredContactMethod)
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
