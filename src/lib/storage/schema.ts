import type { PersistedState } from '@/types'

export const STORAGE_KEY = 'planner-app'
export const CURRENT_VERSION = 1

export function createEmptyState(): PersistedState {
  return {
    version: CURRENT_VERSION,
    taskTypes: [],
    entries: [],
  }
}
