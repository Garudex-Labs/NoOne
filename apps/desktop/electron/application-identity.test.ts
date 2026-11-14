import { $appName, DEFAULT_APP_NAME } from '@noone/shared/application-identity'
import type { BrowserWindow, Menu, WebContents } from 'electron'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const host = vi.hoisted(() => ({
  handlers: new Map<string, (event: { sender?: unknown; senderFrame?: unknown; returnValue?: unknown }, value?: unknown) => void>(),
  setName: vi.fn(),
  setMenu: vi.fn(),
  send: vi.fn(),
  setHudTitle: vi.fn()
}))

vi.mock('electron', () => ({
  app: { setName: host.setName },
  ipcMain: { on: (name: string, handler: (event: { sender?: unknown; senderFrame?: unknown; returnValue?: unknown }, value?: unknown) => void) => host.handlers.set(name, handler) },
  Menu: { getApplicationMenu: () => null, setApplicationMenu: host.setMenu },
  BrowserWindow: { getAllWindows: () => [{ webContents: { send: host.send } }] }
}))

import { nativeIdentityName, registerApplicationIdentity } from './application-identity'

beforeEach(() => {
  host.handlers.clear()
  vi.clearAllMocks()
  $appName.set(DEFAULT_APP_NAME)
})

describe('native identity ownership', () => {
  it('honors only the primary owner frame and keeps HUD identity in step', () => {
    const frame = {}
    const owner = { mainFrame: frame } as WebContents
    const hud = { isDestroyed: () => false, setTitle: host.setHudTitle } as unknown as BrowserWindow
    registerApplicationIdentity(() => owner, () => hud, () => ({}) as Menu)
    const publish = host.handlers.get('hermes:application-identity')!

    publish({ sender: { mainFrame: {} }, senderFrame: {} }, 'Foreign Nova')
    publish({ sender: owner, senderFrame: {} }, 'Iframe Nova')
    expect($appName.get()).toBe(DEFAULT_APP_NAME)

    publish({ sender: owner, senderFrame: frame }, 'Profile Atlas')
    expect($appName.get()).toBe('Profile Atlas')
    expect(host.setName).toHaveBeenLastCalledWith('Profile Atlas')
    expect(host.setHudTitle).toHaveBeenLastCalledWith('Profile Atlas HUD')
    expect(host.send).toHaveBeenCalledWith('hermes:application-identity:changed', 'Profile Atlas')
  })

  it('keeps the native launch alias as a fallback, below a nondefault configured name', () => {
    expect(nativeIdentityName(DEFAULT_APP_NAME, 'Legacy Alias')).toBe('Legacy Alias')
    expect(nativeIdentityName('Profile Atlas', 'Legacy Alias')).toBe('Profile Atlas')
    expect(nativeIdentityName(DEFAULT_APP_NAME, '')).toBe(DEFAULT_APP_NAME)
  })
})
