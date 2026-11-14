import { $appName, applyAppIdentity, DEFAULT_APP_NAME } from '@noone/shared/application-identity'
import { afterEach, describe, expect, it } from 'vitest'

import { appText } from '@/sdk'

afterEach(() => {
  $appName.set(DEFAULT_APP_NAME)
})

describe('plugin SDK application identity', () => {
  it('formats text using the current configured application name', () => {
    applyAppIdentity({ display: { app_name: 'Cosmos' } })
    expect(appText('Chat with {app_name}')).toBe('Chat with Cosmos')

    applyAppIdentity({ display: { app_name: 'Nova' } })
    expect(appText('Chat with {app_name}')).toBe('Chat with Nova')
  })

  it('supports an explicit name without changing the configured identity', () => {
    applyAppIdentity({ display: { app_name: 'Cosmos' } })
    expect(appText('Chat with {app_name}', 'Guest')).toBe('Chat with Guest')
    expect(appText('Chat with {app_name}')).toBe('Chat with Cosmos')
  })
})
