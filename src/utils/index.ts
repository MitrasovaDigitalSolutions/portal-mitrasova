/**
 * Global utility functions.
 *
 * Only put functions here that are used across 2+ features.
 * Feature-specific utils go in features/[name]/utils/.
 */

/**
 * Format a number as Indonesian Rupiah currency.
 *
 * @example
 * ```ts
 * formatCurrency(150000) // "Rp 150.000"
 * ```
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format a Date or ISO string to a localized Indonesian date string.
 *
 * @example
 * ```ts
 * formatDate("2026-01-15") // "15 Januari 2026"
 * ```
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d)
}

/**
 * Truncate a string to a maximum length and append ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str
  }
  return `${str.slice(0, maxLength)}...`
}

/**
 * Sleep for a given number of milliseconds.
 * Useful for debounce or testing loading states.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
