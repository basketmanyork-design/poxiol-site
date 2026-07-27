import {useEffect, useMemo, useState} from 'react'
import {useClient} from 'sanity'

const presets = [
  ['reddit', 'social'],
  ['linkedin', 'social'],
  ['facebook', 'social'],
  ['instagram', 'social'],
  ['youtube', 'video'],
  ['tiktok', 'video'],
  ['alibaba', 'marketplace'],
  ['outreach-email', 'email'],
  ['whatsapp-outreach', 'messaging'],
] as const

type AnalyticsStatus = {
  analyticsEnabled?: boolean
  ga4Enabled?: boolean
  ga4MeasurementId?: string
  searchConsoleProperty?: string
}

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 100)
}

export function AnalyticsOperationsTool() {
  const client = useClient({apiVersion: '2024-07-01'})
  const [status, setStatus] = useState<AnalyticsStatus | null>(null)
  const [destination, setDestination] = useState('https://www.poxiol.com/')
  const [source, setSource] = useState('')
  const [medium, setMedium] = useState('')
  const [campaign, setCampaign] = useState('')
  const [content, setContent] = useState('')
  const [term, setTerm] = useState('')

  useEffect(() => {
    client
      .fetch<AnalyticsStatus | null>(`*[_id == "analyticsSettings"][0]{analyticsEnabled,ga4Enabled,ga4MeasurementId,searchConsoleProperty}`)
      .then(setStatus)
      .catch(() => setStatus(null))
  }, [client])

  const generatedUrl = useMemo(() => {
    try {
      const url = new URL(destination)
      const values = {utm_source: source, utm_medium: medium, utm_campaign: campaign, utm_content: content, utm_term: term}
      Object.entries(values).forEach(([key, value]) => {
        const normalized = normalize(value)
        if (normalized) url.searchParams.set(key, normalized)
      })
      return url.toString()
    } catch {
      return ''
    }
  }, [campaign, content, destination, medium, source, term])

  const configured = Boolean(status?.analyticsEnabled && status?.ga4Enabled && /^G-[A-Z0-9]+$/i.test(status?.ga4MeasurementId || ''))

  return (
    <main style={{maxWidth: 960, margin: '0 auto', padding: 32, fontFamily: 'system-ui'}}>
      <h1>Analytics Operations</h1>
      <section style={{padding: 20, border: '1px solid #ddd', borderRadius: 12, marginBottom: 24}}>
        <h2>Analytics configuration</h2>
        <p><strong>Status:</strong> {configured ? 'Configured' : 'Not configured'}</p>
        <p>This view never displays credentials, API secrets, or visitor identity data.</p>
      </section>

      <section style={{padding: 20, border: '1px solid #ddd', borderRadius: 12}}>
        <h2>UTM Builder</h2>
        <label>Destination URL<input aria-label="Destination URL" value={destination} onChange={(event) => setDestination(event.currentTarget.value)} style={{display: 'block', width: '100%', margin: '6px 0 14px', padding: 10}} /></label>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16}}>
          {presets.map(([presetSource, presetMedium]) => (
            <button key={presetSource} type="button" onClick={() => {setSource(presetSource); setMedium(presetMedium)}}>{presetSource}</button>
          ))}
        </div>
        <label>Source<input aria-label="Source" value={source} onChange={(event) => setSource(event.currentTarget.value)} style={{display: 'block', width: '100%', margin: '6px 0 14px', padding: 10}} /></label>
        <label>Medium<input aria-label="Medium" value={medium} onChange={(event) => setMedium(event.currentTarget.value)} style={{display: 'block', width: '100%', margin: '6px 0 14px', padding: 10}} /></label>
        <label>Campaign<input aria-label="Campaign" value={campaign} onChange={(event) => setCampaign(event.currentTarget.value)} style={{display: 'block', width: '100%', margin: '6px 0 14px', padding: 10}} /></label>
        <label>Content<input aria-label="Content" value={content} onChange={(event) => setContent(event.currentTarget.value)} style={{display: 'block', width: '100%', margin: '6px 0 14px', padding: 10}} /></label>
        <label>Term<input aria-label="Term" value={term} onChange={(event) => setTerm(event.currentTarget.value)} style={{display: 'block', width: '100%', margin: '6px 0 14px', padding: 10}} /></label>
        <label>Generated URL<textarea aria-label="Generated URL" readOnly value={generatedUrl} style={{display: 'block', width: '100%', minHeight: 90, margin: '6px 0 14px', padding: 10}} /></label>
        <button type="button" disabled={!generatedUrl} onClick={() => generatedUrl && navigator.clipboard.writeText(generatedUrl)}>Copy</button>
      </section>
    </main>
  )
}