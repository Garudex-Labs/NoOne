import { describe, expect, it } from 'vitest'
import { getFontChoice } from './fonts'

describe('font override resolution', () => {
  it('keeps supported overrides while rejecting unknown and inherited ids', () => {
    expect(getFontChoice('inter')?.id).toBe('inter')
    for (const id of ['theme', 'missing-font', '__proto__', 'constructor', 'toString']) {
      expect(getFontChoice(id)).toBeUndefined()
    }
  })
})
