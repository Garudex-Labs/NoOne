import { defineLocale, type TranslationOverrides } from './define-locale'
import { hiBase } from './hi_base'
import { hiChrome } from './hi_chrome'
import { hiSettings } from './hi_settings'
import { introHi } from './intro-hi'

export const hiOverrides = {
  ...hiBase,
  ...hiChrome,
  ...hiSettings,
  intro: introHi
} satisfies TranslationOverrides

export const hi = defineLocale(hiOverrides)
