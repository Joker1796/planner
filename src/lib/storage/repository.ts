import type { PersistedState } from '@/types'
import { readJSON, writeJSON } from './localStorageClient'
import { STORAGE_KEY, CURRENT_VERSION, createEmptyState } from './schema'
import { migrations } from './migrations'

function applyMigrations(state: PersistedState): PersistedState {
  let current = state
  while (current.version < CURRENT_VERSION) {
    const migrate = migrations[current.version]
    if (!migrate) break
    current = migrate(current) as PersistedState
  }
  return current
}

export function loadState(): PersistedState {
  const raw = readJSON<PersistedState>(STORAGE_KEY)
  if (!raw) return createEmptyState()
  return applyMigrations(raw)
}

export function saveState(state: Omit<PersistedState, 'version'>): void {
  writeJSON<PersistedState>(STORAGE_KEY, { ...state, version: CURRENT_VERSION })
}
