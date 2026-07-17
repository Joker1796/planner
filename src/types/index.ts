export interface FamilyMember {
  id: string
  name: string
  createdAt: number
}

export type RecurrenceUnit = 'day' | 'week'

export interface Recurrence {
  unit: RecurrenceUnit
  interval: number
  // null until the task type is first added to a specific calendar day —
  // that day becomes the anchor the pattern counts from.
  startDate: string | null
}

export interface TaskType {
  id: string
  name: string
  color: string
  createdAt: number
  archivedAt?: number | null
  familyMemberId?: string | null
  recurrence?: Recurrence | null
  excludedDates?: string[]
  icon?: string | null
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

export type ListKind = 'shopping' | 'todo'

export interface ListItem {
  id: string
  list: ListKind
  text: string
  done: boolean
  doneAt?: number | null
  createdAt: number
}

export interface PersistedState {
  version: number
  taskTypes: TaskType[]
  entries: PlanEntry[]
  familyMembers: FamilyMember[]
  listItems: ListItem[]
}
