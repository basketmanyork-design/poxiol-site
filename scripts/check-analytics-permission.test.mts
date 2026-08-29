import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import test from 'node:test'
import {
  persistAnalyticsPermissionSafely,
  readAnalyticsPermission,
  readAnalyticsPermissionSafely,
  writeAnalyticsPermission,
} from '../lib/privacy/analytics-permission.ts'

test('defaults to unknown and persists only accepted or rejected', () => {
  const values = new Map<string, string>()
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  }
  assert.equal(readAnalyticsPermission(storage), 'unknown')
  writeAnalyticsPermission(storage, 'rejected')
  assert.equal(readAnalyticsPermission(storage), 'rejected')
  assert.throws(() => writeAnalyticsPermission(storage, 'unknown'), /PERMISSION_NOT_PERSISTABLE/)
})

test('unknown and corrupt stored values remain default deny', () => {
  assert.equal(readAnalyticsPermission({getItem: () => 'granted'}), 'unknown')
  assert.equal(readAnalyticsPermission({getItem: () => 'accepted'}), 'accepted')
})

test('storage denial resolves to rejected without throwing', () => {
  const denied = {
    getItem(): string | null { throw new Error('storage denied') },
    setItem(): void { throw new Error('storage denied') },
  }
  assert.equal(readAnalyticsPermissionSafely(denied), 'rejected')
  assert.equal(persistAnalyticsPermissionSafely(denied, 'accepted'), 'rejected')
  assert.equal(persistAnalyticsPermissionSafely(denied, 'rejected'), 'rejected')
})

test('provider gates GA on accepted permission and clears attribution on rejection', () => {
  const provider = readFileSync('components/analytics/AnalyticsProvider.tsx', 'utf8')
  const preferences = readFileSync('components/privacy/AnalyticsPreferences.tsx', 'utf8')
  const analyticsClient = readFileSync('lib/analytics/client.ts', 'utf8')

  assert.match(provider, /permission === 'accepted' && config\.enabled/)
  assert.match(provider, /clearAttributionStorage\(\)/)
  assert.match(preferences, /Accept analytics/)
  assert.match(preferences, /Reject analytics/)
  assert.match(preferences, /Privacy choices/)
  assert.match(preferences, /Change analytics preference \(/)
  assert.match(analyticsClient, /localStorage\.removeItem\(firstTouchKey\)/)
  assert.match(analyticsClient, /sessionStorage\.removeItem\(sessionTouchKey\)/)
})
