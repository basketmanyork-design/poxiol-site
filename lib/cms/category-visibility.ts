export function legacyProductsWhenCategoryVisibilityFails<T>(visibilityResolved: boolean, legacy: T[]): T[] | null {
  return visibilityResolved ? null : legacy
}

export function resolveProductsForCategoryVisibility<T>(visibilityResolved: boolean, legacy: T[], resolved: () => T[]): T[] {
  return legacyProductsWhenCategoryVisibilityFails(visibilityResolved, legacy) ?? resolved()
}
