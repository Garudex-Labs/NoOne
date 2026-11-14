// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { I18nProvider, LOCALE_META, useI18n } from './context'

let container: HTMLDivElement
let root: Root
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

async function mount(showPicker = true) {
  await act(async () => root.render(<I18nProvider>{showPicker && <LanguageSwitcher />}<Probe /></I18nProvider>))
}

async function chooseHindi() {
  const trigger = container.querySelector('button')!
  await act(async () => trigger.click())
  const option = [...container.querySelectorAll<HTMLButtonElement>('[role="option"]')].find(el => el.textContent?.includes('हिन्दी'))!
  expect(option).toBeDefined()
  await act(async () => option.click())
}

function Probe() {
  const { t } = useI18n()
  return <output data-testid="translated-save">{t.common.save}</output>
}

beforeEach(() => {
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  const saved = new Map<string, string>()
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => saved.get(key) ?? null,
    setItem: (key: string, value: string) => saved.set(key, value),
    clear: () => saved.clear()
  })
  document.documentElement.lang = 'en'
  document.documentElement.dir = 'ltr'
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
    matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn(),
    addListener: vi.fn(), removeListener: vi.fn()
  }))
})

afterEach(async () => {
  await act(async () => root.unmount())
  container.remove()
  vi.unstubAllGlobals()
})

it('offers the requested built-in languages and persists a rendered Hindi selection', async () => {
  expect(Object.keys(LOCALE_META).sort()).toEqual(['ar', 'de', 'en', 'es', 'fr', 'hi', 'ja', 'ko', 'zh'])
  await mount()
  await act(async () => container.querySelector('button')!.click())
  expect(container.querySelectorAll('[role="option"]')).toHaveLength(Object.keys(LOCALE_META).length)
  await act(async () => container.querySelector('button')!.click())
  await chooseHindi()
  expect(container.querySelector('[data-testid="translated-save"]')?.textContent).toBe('सहेजें')
  expect(localStorage.getItem('hermes-locale')).toBe('hi')
  expect(document.documentElement.lang).toBe('hi')
  expect(document.documentElement.dir).toBe('ltr')
})

it.each(['ga', 'af', 'hu', 'uk', 'zh-hant', 'tr', 'pt', 'ru', 'it'])(
  'safely falls back to English for saved retired locale %s', async locale => {
    localStorage.setItem('hermes-locale', locale)
    await mount(false)
    expect(container.querySelector('[data-testid="translated-save"]')?.textContent).toBe('Save')
    expect(document.documentElement.lang).toBe('en')
  }
)

it('keeps Arabic RTL intact and restores LTR when choosing Hindi', async () => {
  localStorage.setItem('hermes-locale', 'ar')
  await mount()
  expect(document.documentElement.dir).toBe('rtl')
  await chooseHindi()
  expect(document.documentElement.dir).toBe('ltr')
  expect(container.querySelector('[data-testid="translated-save"]')?.textContent).toBe('सहेजें')
})
