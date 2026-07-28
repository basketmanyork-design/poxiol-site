import { PUBLIC_EMAIL, WHATSAPP_HREF, WHATSAPP_NUMBER_RAW } from '@/lib/contact'
import {EmailAddress, emailHref} from '@/components/ui'
import Link from 'next/link'

type Props = { context: 'quote' | 'free-mockup' }

export default function FormContactFallback({ context }: Props) {
  const isQuote = context === 'quote'
  const heading = isQuote ? 'Request a Factory Quote' : 'Request a Free Mockup'
  const desc = isQuote
    ? 'To request a quote, send your sport, product type, quantity, delivery country, target date and logo files by email or WhatsApp.'
    : 'To request a free mockup, send your sport, design idea, reference images and quantity requirements by email or WhatsApp.'

  return (
    <noscript>
      <div className="rounded-lg border border-yellow-400 bg-yellow-50 p-6 dark:border-yellow-600 dark:bg-yellow-950/20">
        <h3 className="font-semibold text-lg">{heading}</h3>
        <p className="mt-2 text-neutral-700 dark:text-neutral-300">{desc}</p>
        <div className="mt-3 space-y-1">
          <p>
            Email:{' '}
            <a href={emailHref(PUBLIC_EMAIL)} className="underline font-medium">
              <EmailAddress email={PUBLIC_EMAIL} />
            </a>
          </p>
          <p>
            WhatsApp:{' '}
            <a href={WHATSAPP_HREF} className="underline font-medium" target="_blank" rel="noopener noreferrer">
              +{WHATSAPP_NUMBER_RAW}
            </a>
          </p>
        </div>
        <p className="mt-2 text-sm text-neutral-500">
          Or visit our{' '}
          <Link href="/contact/" className="underline">
            Contact page
          </Link>{' '}
          for the full inquiry form.
        </p>
      </div>
    </noscript>
  )
}
