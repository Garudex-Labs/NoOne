import { expect, it } from 'vitest'

import { pluralSuffix } from './plural'

it.each([0, 1, 2, 11])('renders Hindi count %s without an English plural suffix', count => {
  expect(pluralSuffix('hi', count)).toBe('')
})

it.each(['en', 'ar', 'fr', 'de', 'ja', 'ko', 'es', 'zh'] as const)(
  'preserves existing {s} interpolation in %s', locale => {
    expect(pluralSuffix(locale, 0)).toBe('s')
    expect(pluralSuffix(locale, 1)).toBe('')
    expect(pluralSuffix(locale, 2)).toBe('s')
  }
)
