/**
 * Converts a string to a URL-safe slug.
 * Handles Spanish characters (á → a, ñ → n, ü → u, etc.)
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-z0-9\s-]/g, '')   // remove non-alphanumeric except spaces and hyphens
    .trim()
    .replace(/\s+/g, '-')            // spaces to hyphens
    .replace(/-+/g, '-')             // collapse multiple hyphens
}
