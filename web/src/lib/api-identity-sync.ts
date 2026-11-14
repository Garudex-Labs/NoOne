import { applyAppIdentity } from '@noone/shared/application-identity'

let generation = 0
let readGeneration = 0
let writeGeneration = 0
let profileScope = ''

export function identityProfileChanged(value: string): string {
  const profile = (value || '').trim()
  if (profile !== profileScope) generation += 1
  profileScope = profile
  return profile
}

export function readConfigIdentity(
  profile: string, currentProfile: () => string, pending: Promise<Record<string, unknown>>
): Promise<Record<string, unknown>> {
  const admitted = generation
  const read = ++readGeneration
  const writes = writeGeneration
  return pending.then(config => {
    if (admitted === generation && read === readGeneration && writes === writeGeneration && profile === currentProfile()) applyAppIdentity(config)
    return config
  })
}

export function writeConfigIdentity(
  profile: string, currentProfile: () => string, config: Record<string, unknown>, pending: Promise<{ ok: boolean }>
): Promise<{ ok: boolean }> {
  const admitted = generation
  const write = ++writeGeneration
  readGeneration += 1
  return pending.then(result => {
    const display = config.display
    if (result.ok && admitted === generation && write === writeGeneration && profile === currentProfile()
      && display && typeof display === 'object' && 'app_name' in display) {
      readGeneration += 1
      applyAppIdentity(config)
    }
    return result
  })
}
