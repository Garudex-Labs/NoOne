import { describe, expect, it } from 'vitest'

import { iconSvg } from './svg'

describe('packaged SVG data boundary', () => {
  it('keeps unknown metadata and inherited names on the trusted fallback', () => {
    const fallback = iconSvg('package')

    for (const name of ['unknown-source', '__proto__', 'constructor', 'toString']) {
      expect(Reflect.apply(iconSvg, undefined, [name])).toBe(fallback)
    }
  })
  it('preserves the dimensions and decorative semantics of named glyphs', () => {
    const svg = iconSvg('search', 20)
    expect(svg).toContain('width="20"')
    expect(svg).toContain('height="20"')
    expect(svg).toContain('aria-hidden="true"')
  })
})
