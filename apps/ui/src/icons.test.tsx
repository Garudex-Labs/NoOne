import { createElement, createRef } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { AppIcon, getAppIcon } from './app-icon'
import { Check } from './icons'

 describe('shared icon presentation', () => {
  it('renders every unknown persisted name as the same fallback without prototype access', () => {
    const expected = renderToStaticMarkup(createElement(AppIcon, { name: 'unknown-icon' }))

    for (const name of ['__proto__', 'constructor', 'toString']) {
      expect(renderToStaticMarkup(createElement(AppIcon, { name }))).toBe(expected)
    }
  })
  it('keeps memory and catalog metadata glyphs distinct from the unknown fallback', () => {
    for (const name of ['brain', 'arrow-up-right']) {
      expect(getAppIcon(name)).not.toBe(getAppIcon('unknown-icon'))
    }
  })
  it('keeps decorative glyphs hidden without hiding named content', () => {
    const decorative = renderToStaticMarkup(createElement(Check, { size: 20, ref: createRef() }))
    expect(decorative).toContain('aria-hidden="true"')
    expect(decorative).toContain('width="20"')
    const named = renderToStaticMarkup(createElement(Check, { 'aria-label': 'Complete', role: 'img' }))
    expect(named).toContain('aria-label="Complete"')
    expect(named).not.toContain('aria-hidden="true"')
  })
  it('reuses dynamic glyph identity and forwards status sizing/animation', () => {
    expect(getAppIcon('loading')).toBe(getAppIcon('loading'))
    const markup = renderToStaticMarkup(createElement(AppIcon, { name: 'loading', size: '0.875rem', spinning: true }))
    expect(markup).toContain('<svg')
    expect(markup).toContain('font-size:0.875rem')
    expect(markup).toContain('noone-icon-spin')
    expect(renderToStaticMarkup(createElement(AppIcon, { name: 'unknown-persisted-icon' }))).toContain('<svg')
  })
})
