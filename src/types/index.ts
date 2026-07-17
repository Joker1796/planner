export interface TaskType {
  id: string
  name: string
  color: string
  createdAt: number
}

export interface PlanEntry {
  id: string
  date: string
  taskTypeId: string
  done: boolean
  createdAt: number
  updatedAt: number
}

export interface PersistedState {
  version: number
  taskTypes: TaskType[]
  entries: PlanEntry[]
}
