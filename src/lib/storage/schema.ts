import type { PersistedState } from '@/types'

export const STORAGE_KEY = 'planner-app'
export const CURRENT_VERSION = 2

export function createEmptyState(): PersistedState {
  return {
    version: CURRENT_VERSION,
    taskTypes: [],
    entries: [],
    familyMembers: [],
  }
}
