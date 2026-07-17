export interface FamilyMember {
  id: string
  name: string
  createdAt: number
}

export interface TaskType {
  id: string
  name: string
  color: string
  createdAt: number
  archivedAt?: number | null
  familyMemberId?: string | null
}

export interface PlanEntry {
  id: string
  date: string
  taskTypeId: string
  done: boolean
  time?: string | null
  createdAt: number
  updatedAt: number
}

export interface PersistedState {
  version: number
  taskTypes: TaskType[]
  entries: PlanEntry[]
  familyMembers: FamilyMember[]
}
