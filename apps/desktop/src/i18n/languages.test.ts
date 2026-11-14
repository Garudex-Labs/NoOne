import { describe, expect, it } from 'vitest'

import { TRANSLATIONS } from './catalog'
import { DEFAULT_LOCALE, isLocale, isSupportedLocaleValue, LOCALE_OPTIONS, normalizeLocale, resolveInitialLocale } from './languages'

describe('desktop i18n languages', () => {
  it('normalizes supported locale aliases', () => {
    expect(normalizeLocale('en')).toBe('en')
    expect(normalizeLocale('EN-US')).toBe('en')
    expect(normalizeLocale('zh')).toBe('zh')
    expect(normalizeLocale('zh-CN')).toBe('zh')
    expect(normalizeLocale('zh-Hans')).toBe('zh')
    expect(normalizeLocale('zh-Hans-SG')).toBe('zh')
    expect(normalizeLocale(' zh_hans_cn ')).toBe('zh')
    expect(normalizeLocale('hi-IN')).toBe('hi')
    expect(normalizeLocale('हिन्दी')).toBe('hi')
    expect(normalizeLocale('KO-KR')).toBe('ko')
    expect(normalizeLocale('한국어')).toBe('ko')
    expect(normalizeLocale('ja')).toBe('ja')
    expect(normalizeLocale('ja-JP')).toBe('ja')
    expect(normalizeLocale('ar')).toBe('ar')
    expect(normalizeLocale('AR-SA')).toBe('ar')
    expect(normalizeLocale(' ar_eg ')).toBe('ar')
    expect(normalizeLocale('fr')).toBe('fr')
    expect(normalizeLocale('FR-CA')).toBe('fr')
    expect(normalizeLocale(' fr_fr ')).toBe('fr')
    expect(normalizeLocale('Français')).toBe('fr')
    expect(normalizeLocale('de')).toBe('de')
    expect(normalizeLocale('DE-AT')).toBe('de')
    expect(normalizeLocale(' de_ch ')).toBe('de')
    expect(normalizeLocale('Deutsch')).toBe('de')
    expect(normalizeLocale('es')).toBe('es')
    expect(normalizeLocale('ES-419')).toBe('es')
    expect(normalizeLocale(' es_mx ')).toBe('es')
    expect(normalizeLocale('Español')).toBe('es')
  })

  it('falls back to English for empty or unsupported values', () => {
    expect(normalizeLocale(null)).toBe(DEFAULT_LOCALE)
    expect(normalizeLocale('')).toBe(DEFAULT_LOCALE)
    expect(normalizeLocale('it')).toBe(DEFAULT_LOCALE)
  })

  it('distinguishes exact locale ids from supported config aliases', () => {
    expect(isSupportedLocaleValue('zh-CN')).toBe(true)
    expect(isSupportedLocaleValue('hi-IN')).toBe(true)
    expect(isSupportedLocaleValue('ja-JP')).toBe(true)
    expect(isSupportedLocaleValue('ko-KR')).toBe(true)
    expect(isSupportedLocaleValue('de-DE')).toBe(true)
    expect(isSupportedLocaleValue('it')).toBe(false)
    expect(isLocale('zh-CN')).toBe(false)
    expect(isLocale('zh')).toBe(true)
    expect(isLocale('hi')).toBe(true)
    expect(isLocale('ja')).toBe(true)
    expect(isLocale('ar')).toBe(true)
    expect(isLocale('ko')).toBe(true)
    expect(isLocale('fr')).toBe(true)
    expect(isLocale('de')).toBe(true)
    expect(isLocale('es')).toBe(true)
  })

  it.each(['ga', 'af', 'hu', 'uk', 'zh-hant', 'tr', 'pt', 'ru', 'it', 'zh-TW', 'zh-HK', 'ru-RU', 'pt-BR'])(
    'rejects retired stock locale %s and safely normalizes it to English', value => {
      expect(isLocale(value)).toBe(false)
      expect(isSupportedLocaleValue(value)).toBe(false)
      expect(normalizeLocale(value)).toBe(DEFAULT_LOCALE)
    }
  )

  it.each(['zh-SG', 'zh_SG', 'zh-SG-u-nu-latn', 'zh-Hans-SG'])(
    'preserves Simplified Chinese OS preference %s', tag => {
      expect(resolveInitialLocale(undefined, tag)).toBe('zh')
    }
  )

  it('round-trips every picker option through its display.language value to a registered catalog', () => {
    for (const option of LOCALE_OPTIONS) {
      expect(normalizeLocale(option.configValue)).toBe(option.id)
      expect(TRANSLATIONS[option.id]).toBeDefined()
    }

    expect(Object.keys(TRANSLATIONS).sort()).toEqual(LOCALE_OPTIONS.map(option => option.id).sort())
  })
})
