const DATE_LOCALE = 'es-MX'
const CURRENCY_LOCALE = 'es-MX'
const CURRENCY_CODE = 'MXN'

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat(DATE_LOCALE, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(CURRENCY_LOCALE, {
    style: 'currency',
    currency: CURRENCY_CODE,
  }).format(amount)
}

/** Estimates reading time based on average 200 words per minute. */
export function readingTime(contenido: string): string {
  const words = contenido.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.round(words / 200))
  return `${minutes} min`
}
