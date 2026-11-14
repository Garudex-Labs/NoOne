import { $appName, DEFAULT_APP_NAME, normalizeAppName } from '@noone/shared/application-identity'
import { app, BrowserWindow, ipcMain, Menu, type WebContents } from 'electron'

/** Keep the established native-only launch override as a fallback. A configured
 * non-default identity takes precedence over it; no new environment setting.
 */
export function nativeIdentityName(value: unknown, legacy = process.env.HERMES_DESKTOP_APP_NAME): string {
  const name = normalizeAppName(value)

  return name === DEFAULT_APP_NAME && legacy ? normalizeAppName(legacy) : name
}

/** Cosmetic identity arrives through the existing trusted renderer bridge.
 * Data paths and the single-instance lock have already been pinned by main.
 */
export function registerApplicationIdentity(
  getOwner: () => WebContents | null | undefined,
  getHudWindow: () => BrowserWindow | null | undefined,
  buildMenu: () => Menu
): void {
  app.setName($appName.get())
  ipcMain.on('hermes:application-identity:current', event => { event.returnValue = $appName.get() })
  ipcMain.on('hermes:application-identity', (event, value: unknown) => {
    if (event.sender !== getOwner() || event.senderFrame !== event.sender.mainFrame) {return}
    const name = nativeIdentityName(value)
    $appName.set(name)
    app.setName(name)

    if (Menu.getApplicationMenu()) {Menu.setApplicationMenu(buildMenu())}
    const hud = getHudWindow()

    if (hud && !hud.isDestroyed()) {hud.setTitle(`${name} HUD`)}

    for (const win of BrowserWindow.getAllWindows()) {
      win.webContents.send('hermes:application-identity:changed', name)
    }
  })
}

export function initialApplicationName(): string {
  const name = nativeIdentityName(DEFAULT_APP_NAME)
  $appName.set(name)

  return name
}
