import { $appName } from '@noone/shared/application-identity'
import { useSyncExternalStore } from 'react'

export const useAppName = (): string => useSyncExternalStore($appName.listen, $appName.get, $appName.get)
