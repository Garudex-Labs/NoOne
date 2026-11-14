import { useStore } from '@nanostores/react'
import { $appName, applyAppIdentity } from '@noone/shared/application-identity'
import { useEffect } from 'react'

export const useAppName = (): string => useStore($appName)

/** Auxiliary native surfaces mirror the primary owner, not a separate profile. */
export function useNativeAppName(): string {
  useEffect(() => {
    const bridge = window.hermesDesktop

    if (bridge?.applicationName !== undefined) {applyAppIdentity({ display: { app_name: bridge.applicationName } })}

    return bridge?.onApplicationNameChanged?.(name => applyAppIdentity({ display: { app_name: name } }))
  }, [])

  return useAppName()
}
