'use client'

import {useEffect} from 'react'
import type {AnalyticsEventName, AnalyticsEventParams} from '@/lib/analytics/core'
import {trackContentView} from '@/lib/analytics/client'

export function ContentViewTracker({
  event,
  params,
}: {
  event: AnalyticsEventName
  params: AnalyticsEventParams
}) {
  useEffect(() => {
    trackContentView(event, params)
  }, [event, params])
  return null
}
