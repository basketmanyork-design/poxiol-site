export type AnalyticsPermission = 'unknown' | 'accepted' | 'rejected'

export const ANALYTICS_PERMISSION_STORAGE_KEY = 'poxiol.analytics.permission.v1'

export function readAnalyticsPermission(storage: {getItem(key: string): string | null}): AnalyticsPermission {
  const value = storage.getItem(ANALYTICS_PERMISSION_STORAGE_KEY)
  return value === 'accepted' || value === 'rejected' ? value : 'unknown'
}

export function writeAnalyticsPermission(
  storage: {setItem(key: string, value: string): void},
  value: AnalyticsPermission,
) {
  if (value === 'unknown') throw new Error('PERMISSION_NOT_PERSISTABLE')
  storage.setItem(ANALYTICS_PERMISSION_STORAGE_KEY, value)
}

export function clearAnalyticsPermission(storage: {removeItem(key: string): void}) {
  storage.removeItem(ANALYTICS_PERMISSION_STORAGE_KEY)
}

export function readAnalyticsPermissionSafely(storage: {getItem(key: string): string | null}): AnalyticsPermission {
  try {
    return readAnalyticsPermission(storage)
  } catch {
    return 'rejected'
  }
}

export function persistAnalyticsPermissionSafely(
  storage: {setItem(key: string, value: string): void},
  value: Exclude<AnalyticsPermission, 'unknown'>,
): AnalyticsPermission {
  try {
    writeAnalyticsPermission(storage, value)
    return value
  } catch {
    return 'rejected'
  }
}
