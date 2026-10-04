'use client'

import {useEffect,useRef,useState} from 'react'
import {useInquiryContext} from '@/components/useInquiryContext'
import {createLeadEventContext,type FormEventDetails,type LeadFormId} from '@/lib/analytics/core'
import {trackFileSelect,trackFileUpload,trackFormStart,trackFormStepComplete,trackFormStepView,trackFormSubmit,trackFormValidationError,trackLead,trackSampleApplicationSubmitted,trackSampleFormStart} from '@/lib/analytics/client'
import {DELIVERY_COUNTRIES,PRODUCT_OPTIONS,createProcurementFormData,sampleQualificationFieldsFromProcurement,validateProcurementFields,type ProcurementFields,type ProductLine} from '@/lib/procurement-inquiry'
import {PROCUREMENT_FORM_STEPS,errorsForProcurementStep,firstValidationSection,type ProcurementFormStep} from '@/lib/procurement-form-steps'
import {ProjectInquiryRequestError,sendProjectInquiry} from '@/lib/project-inquiry-request'
import {requireContactFormEndpoint,type V8ConversionIntent} from '@/lib/v8/leads'
import {SAMPLE_ORGANIZATION_TYPES,validateSampleQualification} from '@/lib/v8/sample-qualification'
import {PrivacyStatusLink} from '../legal/PrivacyStatusLink'

const blank: ProcurementFields = {fullName:'',buyerRole:'',company:'',email:'',whatsapp:'',products:[{product:'',quantity:'',unit:'sets'}],requiredDeliveryDate:'',deliveryCountry:'',deliveryPostalCode:'',postalNotApplicable:false,additionalDetails:'',organizationType:'',organizationUrl:'',deliveryState:'',deliveryCity:'',internationalShippingConsent:false,businessUseConfirmation:false}
const input = 'min-h-12 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-base text-neutral-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime-500'
const label = 'mb-1 block text-sm font-bold text-neutral-950'
const errorStyle = 'mt-1 text-sm font-semibold text-red-700'

export type ProcurementContactFormProps = {intent: V8ConversionIntent;formId: LeadFormId;title: string;subtitle: string;formType: string;ctaText: string;showTitle?: boolean;publicEmail?: string;whatsappHref?: string;privacyPolicyApproved: boolean}

export default function ProcurementContactForm({intent,formId,title,subtitle,formType,ctaText,showTitle=true,publicEmail='sales@poxiol.com',whatsappHref='https://wa.me/8613055646888',privacyPolicyApproved}: ProcurementContactFormProps) {
  const [fields,setFields] = useState<ProcurementFields>(blank)
  const [contactMode,setContactMode] = useState<''|'email'|'whatsapp'>('')
  const [addOtherContact,setAddOtherContact] = useState(false)
  const [file,setFile] = useState<File|null>(null)
  const [errors,setErrors] = useState<Record<string,string>>({})
  const [message,setMessage] = useState('')
  const [state,setState] = useState<'idle'|'sending'|'accepted'|'unconfirmed'>('idle')
  const [reference,setReference] = useState('')
  const [step,setStep] = useState<ProcurementFormStep>('products')
  const submitLock = useRef(false)
  const submissionKey = useRef('')
  const entryProduct = useRef('')
  const lastSuggestedBuyerRole = useRef('')
  const errorRef = useRef<HTMLDivElement>(null)
  const context = useInquiryContext()
  const analytics = createLeadEventContext(formId,formType)
  const progressive = intent === 'quote'
  const stepIndex = PROCUREMENT_FORM_STEPS.findIndex(item=>item.id===step)
  const analyticsDetails = (): FormEventDetails => ({origin_page:context.source,entry_product:entryProduct.current})

  useEffect(() => {
    if (!context.product || entryProduct.current) return
    entryProduct.current = context.product
    setFields(current => ({...current,products:current.products[0].product ? current.products : [{product:context.product,quantity:'',unit:'sets'}]}))
  },[context.product])

  useEffect(() => {
    const suggestedBuyerRole = context.buyerRole || ''
    setFields(current => {
      if (current.buyerRole && current.buyerRole !== lastSuggestedBuyerRole.current) return current
      lastSuggestedBuyerRole.current = suggestedBuyerRole
      return current.buyerRole === suggestedBuyerRole ? current : {...current,buyerRole:suggestedBuyerRole}
    })
  },[context.buyerRole])

  useEffect(() => {
    if (!progressive) return
    try {trackFormStepView(createLeadEventContext(formId,formType),step,{origin_page:context.source,entry_product:entryProduct.current})} catch {}
  },[progressive,step,formId,formType,context.source])

  function edit<K extends keyof ProcurementFields>(key: K, value: ProcurementFields[K]) {
    if (state === 'accepted' || state === 'sending') return
    setFields(current => ({...current,[key]:value}))
    setErrors(current => {const next={...current};delete next[String(key)];return next})
    try {trackFormStart(analytics,progressive?analyticsDetails():undefined);if(intent==='sample')trackSampleFormStart(analytics,analyticsDetails())} catch {}
  }
  function editLine(index:number,key:keyof ProductLine,value:string) {
    edit('products',fields.products.map((line,i) => i===index ? {...line,[key]:value} as ProductLine : line))
    setErrors(current => {const next={...current};delete next[`${key}-${index}`];return next})
  }
  function startAnother() {
    setFields(blank);setContactMode('');setAddOtherContact(false);setFile(null);setErrors({});setMessage('');setReference('');setState('idle');setStep('products');submissionKey.current='';entryProduct.current='';submitLock.current=false
  }
  function validateAll() {
    const now=new Date()
    const today=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`
    const nextErrors=validateProcurementFields(fields,today)
    if (intent === 'sample') Object.assign(nextErrors, validateSampleQualification(sampleQualificationFieldsFromProcurement(fields)))
    if (!contactMode) nextErrors.contact='Choose Email or WhatsApp as your preferred contact method.'
    else if (contactMode==='email' && !fields.email.trim()) nextErrors.contact='Enter the Email address you selected, or switch to WhatsApp.'
    else if (contactMode==='whatsapp' && !fields.whatsapp.trim()) nextErrors.contact='Enter the WhatsApp number you selected, or switch to Email.'
    if (file && (file.size>10*1024*1024 || !/\.(pdf|png|jpe?g|webp|ai|eps)$/i.test(file.name))) nextErrors.file='Choose a PDF, AI, EPS or image under 10 MB, or remove the file.'
    return nextErrors
  }
  function showValidationErrors(nextErrors:Record<string,string>) {
    setErrors(nextErrors);setMessage('Please review the highlighted fields. Your entries are still here.')
    try {trackFormValidationError(analytics,firstValidationSection(nextErrors),analyticsDetails())} catch {}
    requestAnimationFrame(()=>errorRef.current?.focus())
  }
  function continueStep() {
    const stepErrors=errorsForProcurementStep(validateAll(),step)
    if (Object.keys(stepErrors).length) {showValidationErrors(stepErrors);return}
    try {trackFormStepComplete(analytics,step,analyticsDetails())} catch {}
    setErrors({});setMessage('')
    setStep(PROCUREMENT_FORM_STEPS[Math.min(stepIndex+1,PROCUREMENT_FORM_STEPS.length-1)].id)
  }
  function backStep() {
    setErrors({});setMessage('')
    setStep(PROCUREMENT_FORM_STEPS[Math.max(stepIndex-1,0)].id)
  }
  function selectFile(nextFile:File|null) {
    if (state === 'accepted' || state === 'sending') return
    setFile(nextFile)
    const invalid=nextFile&&(nextFile.size>10*1024*1024||!/\.(pdf|png|jpe?g|webp|ai|eps)$/i.test(nextFile.name))
    setErrors(current=>{const next={...current};if(invalid)next.file='Choose a PDF, AI, EPS or image under 10 MB, or remove the file.';else delete next.file;return next})
    if (!progressive || !nextFile) return
    try {if(invalid)trackFormValidationError(analytics,'file',analyticsDetails());else trackFileSelect(analytics,analyticsDetails())} catch {}
  }
  async function submit(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitLock.current || state !== 'idle') return
    const gotcha=String(new FormData(event.currentTarget).get('_gotcha') || '')
    if (gotcha) {
      setErrors({})
      setMessage('Please use email or WhatsApp to contact us.')
      requestAnimationFrame(()=>errorRef.current?.focus())
      return
    }
    const nextErrors=validateAll()
    if (Object.keys(nextErrors).length) {
      const section=firstValidationSection(nextErrors)
      if (progressive) setStep(section==='file'?'products':section==='form'?'contact':section)
      showValidationErrors(nextErrors)
      return
    }
    submitLock.current=true;setState('sending');setMessage('');setErrors({})
    try {
      if (!submissionKey.current) submissionKey.current=crypto.randomUUID()
      const endpoint=requireContactFormEndpoint(process.env.NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT)
      const body=createProcurementFormData(fields,{intent,formType,sourcePage:window.location.pathname,originPage:context.source,entryProduct:entryProduct.current,submissionKey:submissionKey.current,preferredContactMethod:contactMode || undefined,attachments:file?[file]:[],adsAttribution:context.adsAttribution})
      const confirmation=await sendProjectInquiry(endpoint,body)
      setReference(confirmation.reference || '')
      setState('accepted')
      try {const details=progressive?analyticsDetails():undefined;trackFormSubmit(analytics,submissionKey.current,details);trackLead(analytics,submissionKey.current,details);if(intent==='sample')trackSampleApplicationSubmitted(analytics,submissionKey.current,analyticsDetails());if(progressive&&file)trackFileUpload(analytics,submissionKey.current,details)} catch {}
    } catch(cause) {
      const uncertain=cause instanceof ProjectInquiryRequestError && cause.unconfirmed
      setState(uncertain?'unconfirmed':'idle')
      setMessage(cause instanceof Error ? cause.message : 'We could not confirm your request. Your entries are still here.')
      requestAnimationFrame(()=>errorRef.current?.focus())
    } finally {submitLock.current=false}
  }

  const fieldError=(key:string)=>errors[key]?<p id={`error-${key}`} className={errorStyle}>{errors[key]}</p>:null
  const country=DELIVERY_COUNTRIES.find(item=>item.code===fields.deliveryCountry)?.name || fields.deliveryCountry
  const showEmail=contactMode==='email'||addOtherContact||Boolean(fields.email)
  const showWhatsapp=contactMode==='whatsapp'||addOtherContact||Boolean(fields.whatsapp)

  const configuredAction=process.env.NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT
  const fallbackAction=configuredAction && /^https?:\/\/[^/]+\.invalid(?:\/|$)/i.test(configuredAction) ? '#contact' : configuredAction
  return <form data-inquiry-form method="post" action={fallbackAction} encType="multipart/form-data" onSubmit={submit} noValidate className="rounded-3xl bg-white p-5 text-left text-neutral-950 shadow-xl sm:p-8">
    <div className="hidden" aria-hidden="true">
      <label htmlFor="procurement-website">Leave this field empty</label>
      <input id="procurement-website" type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
    </div>
    <header><p className="text-xs font-black uppercase tracking-widest text-green-800">POXIOL Project Inquiry</p>{showTitle ? <h2 className="mt-2 text-3xl font-black">{title}</h2> : null}<p className="mt-3 leading-7 text-neutral-700">{subtitle}</p><p className="mt-3 text-sm text-neutral-600">Additional details and artwork are optional. We review product and delivery feasibility after receiving your request.</p></header>
    {progressive?<div className="mt-6" aria-label="Quote request progress"><p className="text-sm font-bold text-neutral-700">Step {stepIndex + 1} of {PROCUREMENT_FORM_STEPS.length}</p><ol className="mt-3 grid grid-cols-3 gap-2">{PROCUREMENT_FORM_STEPS.map(item=><li key={item.id} aria-current={item.id===step?'step':undefined} className={`rounded-full px-3 py-2 text-center text-xs font-black ${item.id===step?'bg-neutral-950 text-white':'bg-neutral-100 text-neutral-600'}`}>{item.title}</li>)}</ol></div>:null}
    {message ? <div ref={errorRef} role="alert" tabIndex={-1} className="mt-5 rounded-xl border border-red-300 bg-red-50 p-4 text-red-800 focus:outline-2 focus:outline-red-700"><strong>{state==='unconfirmed'?'Receipt has not been confirmed':'Review your request'}</strong><p>{message}</p>{state==='unconfirmed'?<p>Check receipt with our team before resending. The current Formspree receiver has no verified duplicate protection for a timed-out request.</p>:null}</div>:null}
    {Object.keys(errors).length ? <div role="alert" className="mt-3 text-sm text-red-700">Please correct: {Object.values(errors).join(' ')}</div>:null}
    <fieldset disabled={state==='sending'||state==='accepted'} className="mt-7 min-w-0 space-y-9">
      {(!progressive||step==='products')?<section aria-labelledby="products-group"><h3 id="products-group" className="mb-4 text-xl font-black">Your Products</h3>
        <label className={label} htmlFor="buyer-role">Buyer Type (Optional)</label><select id="buyer-role" name="buyerRole" value={fields.buyerRole} onChange={event=>edit('buyerRole',event.target.value)} className={input}><option value="">Select if helpful</option>{['Team / School / Club','Brand / Reseller','Other Business Buyer'].map(value=><option key={value}>{value}</option>)}</select>
        {fields.products.map((line,index)=><div key={index} className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4"><div className="grid gap-4 sm:grid-cols-[1.4fr_.6fr_.6fr]">
          <div><label className={label} htmlFor={`product-${index}`}>Products Needed *</label><select id={`product-${index}`} name={`product-${index}`} value={PRODUCT_OPTIONS.includes(line.product as typeof PRODUCT_OPTIONS[number])?line.product:line.product?'custom':''} onChange={event=>editLine(index,'product',event.target.value==='custom'?line.product:event.target.value)} className={input}><option value="">Choose a product</option>{PRODUCT_OPTIONS.map(product=><option key={product}>{product}</option>)}{line.product&&!PRODUCT_OPTIONS.includes(line.product as typeof PRODUCT_OPTIONS[number])?<option value="custom">Product from the page</option>:null}</select>{line.product==='Other'||(line.product&&!PRODUCT_OPTIONS.includes(line.product as typeof PRODUCT_OPTIONS[number]))?<input aria-label="Current product name" value={line.product==='Other'?'':line.product} onChange={event=>editLine(index,'product',event.target.value)} className={`${input} mt-2`} maxLength={120} placeholder="Describe this product" />:null}{fieldError(`product-${index}`)}</div>
          <div><label className={label} htmlFor={`quantity-${index}`}>Quantity *</label><input id={`quantity-${index}`} name={`quantity-${index}`} type="number" min="1" max="1000000" step="1" inputMode="numeric" value={line.quantity} onChange={event=>editLine(index,'quantity',event.target.value)} className={input} aria-describedby={`help-quantity-${index} error-quantity-${index}`} /><p id={`help-quantity-${index}`} className="mt-1 text-xs text-neutral-600">Enter the quantity you are considering.</p>{fieldError(`quantity-${index}`)}</div>
          <div><label className={label} htmlFor={`unit-${index}`}>Unit *</label><select id={`unit-${index}`} name={`unit-${index}`} value={line.unit} onChange={event=>editLine(index,'unit',event.target.value)} className={input}><option value="sets">Sets</option><option value="pieces">Pieces</option></select>{fieldError(`unit-${index}`)}</div>
        </div>{fields.products.length>1?<button type="button" onClick={()=>edit('products',fields.products.filter((_,i)=>i!==index))} className="mt-3 min-h-11 font-bold underline">Remove this product</button>:null}</div>)}
        <button type="button" disabled={fields.products.length>=6} onClick={()=>edit('products',[...fields.products,{product:'',quantity:'',unit:'sets'}])} className="mt-3 min-h-11 rounded-full border border-neutral-950 px-4 font-bold">Add another product</button>{fieldError('products')}
        {intent==='sample'?<div className="mt-5 rounded-xl border border-neutral-200 bg-neutral-50 p-4"><label className="flex min-h-11 items-start gap-3 text-sm font-semibold"><input name="business_use_confirmation" type="checkbox" checked={fields.businessUseConfirmation} onChange={event=>edit('businessUseConfirmation',event.target.checked)} className="mt-1" /> <span>I confirm this sample is for a team, school, club, league, sports brand, distributor, reseller or other business use—not a personal single-piece retail order.</span></label>{fieldError('businessUseConfirmation')}</div>:null}
        <div className="mt-5"><label className={label} htmlFor="additional-details">Additional Details (Optional)</label><textarea id="additional-details" name="additional_details" rows={4} maxLength={4000} value={fields.additionalDetails} onChange={event=>edit('additionalDetails',event.target.value)} className={input} placeholder="Add colors, design ideas or questions you would like us to review." />{fieldError('additionalDetails')}</div>
        <div className="mt-5"><label className={label} htmlFor="project-file">Upload Your Logo / References (Optional)</label><input id="project-file" name="project_file" type="file" accept=".pdf,.ai,.eps,.png,.jpg,.jpeg,.webp" onChange={event=>selectFile(event.target.files?.[0]||null)} className="block min-h-11 w-full text-sm" /><p className="text-xs text-neutral-600">No design file yet? You can still send your request. Maximum 10 MB.</p>{file?<><p role="status" aria-live="polite" className="mt-2 break-all text-sm font-semibold text-neutral-800">Selected file: {file.name}</p><button type="button" onClick={()=>{selectFile(null);const control=document.getElementById('project-file') as HTMLInputElement|null;if(control)control.value=''}} className="min-h-11 text-sm font-bold underline">Remove file</button></>:null}{fieldError('file')}</div>
      </section>:null}
      {(!progressive||step==='delivery')?<section aria-labelledby="delivery-group"><h3 id="delivery-group" className="mb-4 text-xl font-black">Delivery Requirements</h3><div className="grid gap-5 sm:grid-cols-2">
        <div><label className={label} htmlFor="delivery-date">Required Delivery Date *</label><input id="delivery-date" name="required_delivery_date" type="date" value={fields.requiredDeliveryDate} onChange={event=>edit('requiredDeliveryDate',event.target.value)} className={input} /><p className="mt-1 text-xs text-neutral-600">When do you need the order in hand? We’ll check production and shipping feasibility.</p>{fieldError('requiredDeliveryDate')}</div>
        <div><label className={label} htmlFor="delivery-country">Delivery Country / Region *</label><select id="delivery-country" name="delivery_country_code" value={fields.deliveryCountry} onChange={event=>edit('deliveryCountry',event.target.value)} className={input}><option value="">Choose a country or region</option>{DELIVERY_COUNTRIES.map(item=><option key={item.code} value={item.code}>{item.name}</option>)}</select>{fieldError('deliveryCountry')}</div>
        {intent==='sample'?<><div><label className={label} htmlFor="delivery-state">Delivery State / Region *</label><input id="delivery-state" name="delivery_state" maxLength={120} value={fields.deliveryState} onChange={event=>edit('deliveryState',event.target.value)} className={input} />{fieldError('deliveryState')}</div><div><label className={label} htmlFor="delivery-city">Delivery City *</label><input id="delivery-city" name="delivery_city" maxLength={120} value={fields.deliveryCity} onChange={event=>edit('deliveryCity',event.target.value)} className={input} />{fieldError('deliveryCity')}</div></>:null}
        <div className="sm:col-span-2"><label className={label} htmlFor="delivery-postal">Delivery Postal Code *</label><input id="delivery-postal" name="delivery_postal_code" value={fields.deliveryPostalCode} onChange={event=>edit('deliveryPostalCode',event.target.value)} disabled={fields.postalNotApplicable} maxLength={20} autoComplete="postal-code" className={input} /><p className="mt-1 text-xs text-neutral-600">This helps us review shipping options and delivery feasibility.</p><label className="mt-3 flex min-h-11 items-center gap-2 text-sm font-bold"><input type="checkbox" checked={fields.postalNotApplicable} onChange={event=>edit('postalNotApplicable',event.target.checked)} /> My delivery area does not use postal codes</label>{fieldError('deliveryPostalCode')}</div>
        {intent==='sample'?<div className="sm:col-span-2 rounded-xl border border-neutral-200 bg-neutral-50 p-4"><label className="flex min-h-11 items-start gap-3 text-sm font-semibold"><input name="international_shipping_consent" type="checkbox" checked={fields.internationalShippingConsent} onChange={event=>edit('internationalShippingConsent',event.target.checked)} className="mt-1" /> <span>I understand that international shipping charges apply to the applicant if the sample application is approved.</span></label>{fieldError('internationalShippingConsent')}</div>:null}
      </div></section>:null}
      {(!progressive||step==='contact')?<section aria-labelledby="contact-group"><h3 id="contact-group" className="mb-4 text-xl font-black">Contact Details</h3><div className="grid gap-5 sm:grid-cols-2">
        <div><label className={label} htmlFor="full-name">Your Name *</label><input id="full-name" name="fullName" autoComplete="name" maxLength={120} value={fields.fullName} onChange={event=>edit('fullName',event.target.value)} className={input} />{fieldError('fullName')}</div>
        <div><label className={label} htmlFor="company">Company / Team Name {intent==='sample'?'*':'(Optional)'}</label><input id="company" name="company" autoComplete="organization" maxLength={120} value={fields.company} onChange={event=>edit('company',event.target.value)} className={input} />{fieldError('company')}</div>
        {intent==='sample'?<><div><label className={label} htmlFor="organization-type">Organization Type *</label><select id="organization-type" name="organization_type" value={fields.organizationType} onChange={event=>edit('organizationType',event.target.value as ProcurementFields['organizationType'])} className={input}><option value="">Choose an organization type</option>{SAMPLE_ORGANIZATION_TYPES.map(value=><option key={value}>{value}</option>)}</select>{fieldError('organizationType')}</div><div><label className={label} htmlFor="organization-url">Organization Website or Public Profile *</label><input id="organization-url" name="organization_url" type="url" inputMode="url" maxLength={500} placeholder="https://" value={fields.organizationUrl} onChange={event=>edit('organizationUrl',event.target.value)} className={input} />{fieldError('organizationUrl')}</div></>:null}
      </div><fieldset className="mt-5"><legend className={label}>How should we contact you? *</legend><div className="flex flex-wrap gap-5"><label className="flex min-h-11 items-center gap-2"><input type="radio" name="preferred_contact_method" value="email" checked={contactMode==='email'} onChange={()=>setContactMode('email')} /> Email</label><label className="flex min-h-11 items-center gap-2"><input type="radio" name="preferred_contact_method" value="whatsapp" checked={contactMode==='whatsapp'} onChange={()=>setContactMode('whatsapp')} /> WhatsApp</label></div></fieldset>
      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        <div hidden={!showEmail}><label className={label} htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" value={fields.email} onChange={event=>edit('email',event.target.value)} className={input} />{fieldError('email')}</div>
        <div hidden={!showWhatsapp}><label className={label} htmlFor="whatsapp">WhatsApp</label><input id="whatsapp" name="whatsapp" type="tel" autoComplete="tel" placeholder="+44 7700 900000" value={fields.whatsapp} onChange={event=>edit('whatsapp',event.target.value)} className={input} />{fieldError('whatsapp')}</div>
      </div>{contactMode?<label className="mt-3 flex min-h-11 items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={addOtherContact} onChange={event=>setAddOtherContact(event.target.checked)} /> Add another contact method (optional)</label>:null}<p className="mt-2 text-sm text-neutral-600">Provide at least one contact method. You may provide both.</p>{fieldError('contact')}</section>:null}
    </fieldset>
    {state==='accepted'?<div role="status" className="mt-7 rounded-xl border border-lime-400 bg-lime-50 p-5"><h3 className="text-xl font-black">Your request has been received.</h3>{reference?<p>Reference: {reference}</p>:null}<p>We’ll review your requirements and contact you using the details you provided.</p><p className="font-semibold">{fields.products.map(line=>`${line.product}: ${line.quantity} ${line.unit}`).join('; ')} · {fields.requiredDeliveryDate} · {country} · {fields.postalNotApplicable?'Postal code not applicable':fields.deliveryPostalCode}</p><p>We’ll check the product, design and delivery feasibility before preparing a quote. {intent==='sample'?'Sample eligibility, free scope and shipping are confirmed before dispatch.':''}</p><button type="button" onClick={startAnother} className="mt-3 min-h-11 font-bold underline">Start another project</button></div>:null}
    {state==='sending'?<p role="status" className="mt-5 text-sm">Submitting your request. Please keep this page open.</p>:null}
    {progressive?<div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">{step!=='products'?<button type="button" disabled={state!=='idle'} onClick={backStep} className="min-h-12 rounded-full border border-neutral-950 px-6 font-black disabled:opacity-60">Back</button>:<span />}{step!=='contact'?<button type="button" disabled={state!=='idle'} onClick={continueStep} className="min-h-12 rounded-full bg-lime-400 px-6 font-black text-neutral-950 disabled:opacity-60">Continue</button>:<button type="submit" disabled={state!=='idle'} className="min-h-14 rounded-full bg-lime-400 px-6 font-black text-neutral-950 disabled:opacity-60">{state==='sending'?'Submitting…':state==='accepted'?'Received':state==='unconfirmed'?'Check receipt before resending':ctaText}</button>}</div>:<button type="submit" disabled={state!=='idle'} className="mt-7 min-h-14 w-full rounded-full bg-lime-400 px-5 font-black text-neutral-950 disabled:opacity-60">{state==='sending'?'Submitting…':state==='accepted'?'Received':state==='unconfirmed'?'Check receipt before resending':ctaText}</button>}
    <p className="mt-4 text-xs text-neutral-700"><PrivacyStatusLink approved={privacyPolicyApproved} /></p>
    <p className="mt-4 text-sm text-neutral-700">Need help? <a className="font-bold underline" href={`mailto:${publicEmail}`}>Email POXIOL</a> or <a className="font-bold underline" href={whatsappHref} target="_blank" rel="noopener noreferrer">open WhatsApp</a>. These links do not send a message automatically.</p>
  </form>
}
