import { afterEach, describe, expect, it } from 'vitest'

import { $appName, applyAppIdentity, appText, DEFAULT_APP_NAME, normalizeAppName, withAppIdentity } from './application-identity'

afterEach(() => applyAppIdentity(null))

describe('application display identity', () => {
  it('falls back for missing, blank or unsafe names', () => {
    for (const value of [null, undefined, '', ' ', 42, 'bad\nname', '\x1b[31m', 'x'.repeat(129)]) {
      expect(normalizeAppName(value)).toBe(DEFAULT_APP_NAME)
    }

    applyAppIdentity({ display: {} })
    expect($appName.get()).toBe(DEFAULT_APP_NAME)
  })

  it('expands explicit placeholders once, preserving identifiers and custom-name braces', () => {
    applyAppIdentity({ display: { app_name: ' 星 {count} {app_name} ' } })
    expect(appText('Welcome to {app_name}; noone --help')).toBe('Welcome to 星 {count} {app_name}; noone --help')
    expect(appText('Hermes-4 and hermes://')).toBe('Hermes-4 and hermes://')
  })

  it('treats dollar replacement syntax as literal display text', () => {
    expect(appText('Welcome to {app_name}', '$&')).toBe('Welcome to $&')
    expect(appText('Welcome to {app_name}', 'A $$ B')).toBe('Welcome to A $$ B')
  })

  it('renders string/function catalogs without mutating them or leaking another profile', () => {
    const catalog = { heading: 'Welcome to {app_name}', status: (n: number) => `${appText('{app_name}')}: ${n}` }
    const first = withAppIdentity(catalog, 'Atlas')
    const second = withAppIdentity(catalog, 'Nova')
    expect(first.heading).toBe('Welcome to Atlas')
    expect(first.status(3)).toBe('Atlas: 3')
    expect(second.status(4)).toBe('Nova: 4')
    expect(catalog.heading).toBe('Welcome to {app_name}')
    applyAppIdentity(null)
    expect(first.status(3)).toBe('Atlas: 3')
  })

  it('does not interpret placeholder-looking text in translation arguments or names', () => {
    const catalog = { status: (message: string) => `${appText('{app_name}')}: ${message}` }
    const rendered = withAppIdentity(catalog, 'Atlas {app_name}')
    expect(rendered.status('literal {app_name}')).toBe('Atlas {app_name}: literal {app_name}')
  })

  it('preserves object-valued function results', () => {
    const result = { before: 'before', after: 'after' }
    expect(withAppIdentity({ branch: () => result }, 'Atlas').branch()).toBe(result)
  })
})
