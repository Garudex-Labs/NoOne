import type { IconComponent } from '@noone/ui/icons'
import type { Dispatch, SetStateAction } from 'react'

import type { AgentGateway } from '@/agent-client'
import type { EnvVarInfo } from '@/types/agent-client'

export type SettingsView =
  | 'about'
  | 'billing'
  | 'connections'
  | 'gateway'
  | 'keybinds'
  | 'keys'
  | 'notifications'
  | 'plugins'
  | 'providers'
  | 'sessions'
  | 'vault'
  | 'web-access'
  | `config:${string}`
export type EnvPatch = Partial<Pick<EnvVarInfo, 'is_set' | 'redacted_value'>>

export interface SettingsPageProps {
  gateway?: AgentGateway | null
  onClose: () => void
  onConfigSaved?: () => void
  onMainModelChanged?: (provider: string, model: string) => void
}

export interface ProviderGroup {
  name: string
  priority: number
  entries: [string, EnvVarInfo][]
  hasAnySet: boolean
}

export interface DesktopConfigSection {
  id: string
  label: string
  icon: IconComponent
  keys: string[]
}

export interface EnvRowProps {
  varKey: string
  info: EnvVarInfo
  edits: Record<string, string>
  revealed: Record<string, string>
  saving: string | null
  setEdits: Dispatch<SetStateAction<Record<string, string>>>
  onSave: (key: string, editKey?: string) => void
  onClear: (key: string, editKey?: string) => void
  onReveal: (key: string) => void
  compact?: boolean
}
