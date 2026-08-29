import {PROJECT_SPORT_OPTIONS, V8_CONVERSION_ENTRIES, type V8ConversionIntent} from './v8/leads.ts'

export type InquiryContext = {product: string; sport: string; style: string; source: string}
const empty: InquiryContext = {product: '', sport: '', style: '', source: ''}
const site = 'https://www.poxiol.com'

// Only public path/reference data crosses a CTA. Never forward arbitrary queries,
// names, email addresses, phone numbers, message text or external origin URLs.
export function publicSourcePath(value: string) {
  if (!value || value.length > 500 || /[%\\]/.test(value) || value.startsWith('//')) return ''
  try {
    const url = new URL(value, site)
    if (url.origin !== site || !/^\/(?:[a-z0-9][a-z0-9-]*\/)*[a-z0-9-]*\/?$/.test(url.pathname)) return ''
    return url.pathname === '/' ? '/' : `${url.pathname.replace(/\/+$/, '')}/`
  } catch { return '' }
}

function reference(value: string | null | undefined) {
  const text = (value || '').trim()
  return text.length <= 120 && /^[a-zA-Z0-9][a-zA-Z0-9 ._&/()'-]*$/.test(text) && !/\d{7,}/.test(text) ? text : ''
}
function clean(context: Partial<InquiryContext>): InquiryContext {
  return {
    product: reference(context.product), style: reference(context.style),
    sport: PROJECT_SPORT_OPTIONS.includes(context.sport as typeof PROJECT_SPORT_OPTIONS[number]) ? context.sport! : '',
    source: publicSourcePath(context.source || ''),
  }
}
function fromQuery(search: string) {
  const q = new URLSearchParams(search)
  return clean({product:q.get('product') || '',sport:q.get('sport') || '',style:q.get('style') || '',source:q.get('source') || ''})
}

export function contextFromPage(pathname: string, search = ''): InquiryContext {
  const path = publicSourcePath(pathname)
  if (V8_CONVERSION_ENTRIES.some(entry => entry.path === path)) return fromQuery(search)
  if (path === '/solutions/') return {...empty, product:'Teamwear Solutions',source:path}
  if (path === '/oem-odm/') return {...empty, product:'OEM / ODM Teamwear',source:path}
  if (path === '/private-label-teamwear/') return {...empty, product:'Private Label Teamwear',source:path}
  if (!path.startsWith('/products/') && !/^\/custom-[a-z0-9-]+\/$/.test(path)) return {...empty}
  const slug = path.split('/').filter(Boolean).at(-1) || ''
  if (slug === 'products') return {...empty}
  const sport = /basketball/.test(slug) ? 'Basketball'
    : /soccer/.test(slug) ? 'Soccer'
    : /baseball|softball/.test(slug) ? 'Baseball / Softball'
    : /volleyball/.test(slug) ? 'Volleyball'
    : /american-football/.test(slug) ? 'American Football'
    : /ice-hockey/.test(slug) ? 'Ice Hockey'
    : /running|training/.test(slug) ? 'Running / Training Wear' : ''
  return clean({product:slug.replace(/^custom-/, '').replace(/-/g,' ').replace(/\b\w/g,char=>char.toUpperCase()),sport,style:'',source:path})
}

export function contextualInquiryHref(href: string, context: Partial<InquiryContext>) {
  if (!href.startsWith('/') || href.startsWith('//')) return href
  const url = new URL(href, site)
  const entry = V8_CONVERSION_ENTRIES.find(item => item.path === url.pathname)
  if (!entry) return href
  const explicit = fromQuery(url.search)
  const base = clean(context)
  const merged = clean({
    product:explicit.product || base.product, sport:explicit.sport || base.sport,
    style:explicit.style || base.style, source:explicit.source || base.source,
  })
  if (!Object.values(merged).some(Boolean)) return href
  const query = new URLSearchParams()
  for (const [name,value] of Object.entries(merged)) if (value) query.set(name,value)
  return `${entry.path}?${query}#${entry.formAnchorId}`
}

export function contextualWhatsAppHref(href: string, context: Partial<InquiryContext>, intent?: V8ConversionIntent) {
  let url: URL
  try { url = new URL(href) } catch { return href }
  if (url.origin !== 'https://wa.me' || url.pathname !== '/8613055646888') return href
  const safe = clean(context)
  if (!Object.values(safe).some(Boolean) && !intent) return href
  const purpose = intent === 'quote' ? 'a quote' : intent === 'sample' ? 'a sample' : intent === 'mockup' ? 'a mockup' : 'a question'
  const text = [`Hello POXIOL, I would like to discuss ${purpose}.`, safe.product ? `Page reference: ${safe.product}.` : '', safe.sport ? `Page sport: ${safe.sport}.` : '', safe.style ? `Page style reference: ${safe.style}.` : '', safe.source ? `Page: ${site}${safe.source}` : ''].filter(Boolean).join(' ')
  url.search = new URLSearchParams({text}).toString()
  return url.toString()
}

export function appendInquiryContext(body: FormData, context: Partial<InquiryContext>) {
  const safe = clean(context)
  // Buyer edits belong only in the private submission, not in link query data.
  const product = (context.product || '').trim().slice(0,120)
  const style = (context.style || '').trim().slice(0,120)
  if (product) body.set('requested_product',product)
  if (style) body.set('selected_style',style)
  if (safe.source) body.set('originPage',safe.source)
  if (safe.sport) body.set('sourceSport',safe.sport)
}
