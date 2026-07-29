export function legacyProductsWhenCategoryVisibilityFails<T>(visibilityResolved: boolean, legacy: T[]): T[] | null {
  return visibilityResolved ? null : legacy
}
