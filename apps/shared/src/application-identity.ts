import { atom } from 'nanostores'

import identity from '../../../agent_cli/data/application_identity.json' with { type: 'json' }

export const DEFAULT_APP_NAME: string = identity.default_name

export function normalizeAppName(value: unknown): string {
  if (typeof value !== 'string') {
    return DEFAULT_APP_NAME
  }

  const name = value.trim()

  return !name || [...name].length > 128 || /[\p{Cc}\p{Cs}\u2028\u2029]/u.test(name) ? DEFAULT_APP_NAME : name
}

/** A window's presentation mirror, hydrated by its existing profile config flow. */
export const $appName = atom(DEFAULT_APP_NAME)
// Translation functions are synchronous. A bound catalog renders without
// changing the window's atom or reinterpreting the text of its arguments.
let formattingName: string | undefined

export function appNameFromConfig(config: unknown): string {
  const display = (config as { display?: { app_name?: unknown } } | null)?.display

  return normalizeAppName(display?.app_name)
}

export function applyAppIdentity(config: unknown): void {
  $appName.set(appNameFromConfig(config))
}

export function appText(template: string, name: string = formattingName ?? $appName.get()): string {
  return template.replaceAll('{app_name}', () => name)
}

/** The first argument of console/printf-style logging is a format string. */
export function appPrintfText(template: string): string {
  return appText(template, (formattingName ?? $appName.get()).replaceAll('%', '%%'))
}

/** Catalogs contain strings and formatting functions; neither changes shape.
 * Bind the name to this rendered catalog so another profile cannot change it.
 */
export function withAppIdentity<T>(catalog: T, name: string = $appName.get()): T {
  if (typeof catalog === 'string') {
    return appText(catalog, name) as T
  }

  if (typeof catalog === 'function') {
    return ((...args: unknown[]) => {
      const previous = formattingName
      formattingName = name

      try {
        return catalog(...args)
      } finally {
        formattingName = previous
      }
    }) as T
  }

  if (Array.isArray(catalog)) {
    return catalog.map(value => withAppIdentity(value, name)) as T
  }

  if (catalog !== null && typeof catalog === 'object') {
    return Object.fromEntries(
      Object.entries(catalog).map(([key, value]) => [key, withAppIdentity(value, name)])
    ) as T
  }

  return catalog
}
