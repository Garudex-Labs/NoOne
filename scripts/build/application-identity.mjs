// HTML/build-time presentation uses the same packaged default as the runtime.
import { readFileSync } from 'node:fs'

export const defaultAppName = JSON.parse(
  readFileSync(new URL('../../agent_cli/data/application_identity.json', import.meta.url), 'utf8')
).default_name

export function applicationIdentityHtml() {
  return {
    name: 'application-identity',
    transformIndexHtml: html => html.replaceAll('__APP_NAME__', () => defaultAppName)
  }
}
