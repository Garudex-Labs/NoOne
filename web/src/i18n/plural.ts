import type { Locale } from './types'

/** Preserve legacy {s} templates without appending an English suffix to Hindi nouns. */
export function pluralSuffix(locale: Locale, count: number): string {
  return locale === 'hi' || count === 1 ? '' : 's'
}
