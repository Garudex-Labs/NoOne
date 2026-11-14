import { vi } from 'vitest'

import type { AgentApiRequest } from '@/global'

/** Install a fake `window.hermesDesktop.api`, the preload bridge every REST helper sends through. */
export function installRestBridge(answer: (request: AgentApiRequest) => object) {
  const api = vi.fn(async (request: AgentApiRequest) => answer(request))

  Object.defineProperty(window, 'hermesDesktop', { configurable: true, value: { api } })

  return api
}
