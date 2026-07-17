import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { PlanEntry, TaskType } from '@/types'
import { generateId } from '@/lib/id'
import { loadState, saveState } from '@/lib/storage/repository'

export const usePlannerStore = defineStore('planner', () => {
  const initial = loadState()
  const taskTypes = ref<TaskType[]>(initial.taskTypes)
  const entries = ref<PlanEntry[]>(initial.entries)

  function persist(): void {
    saveState({ taskTypes: taskTypes.value, entries: entries.value })
  }

  function addTaskType(name: string, color: string): void {
    taskTypes.value.push({ id: generateId(), name, color, createdAt: Date.now() })
    persist()
  }

  function removeTaskType(id: string): void {
    taskTypes.value = taskTypes.value.filter((taskType) => taskType.id !== id)
    entries.value = entries.value.filter((entry) => entry.taskTypeId !== id)
    persist()
  }

  function upsertPlanEntry(date: string, taskTypeId: string, done: boolean): void {
    const existing = entries.value.find(
      (entry) => entry.date === date && entry.taskTypeId === taskTypeId,
    )
    const now = Date.now()
    if (existing) {
      existing.done = done
      existing.updatedAt = now
    } else {
      entries.value.push({
        id: generateId(),
        date,
        taskTypeId,
        done,
        createdAt: now,
        updatedAt: now,
      })
    }
    persist()
  }

  function toggleEntryDone(id: string): void {
    const entry = entries.value.find((e) => e.id === id)
    if (!entry) return
    entry.done = !entry.done
    entry.updatedAt = Date.now()
    persist()
  }

  function removePlanEntry(id: string): void {
    entries.value = entries.value.filter((entry) => entry.id !== id)
    persist()
  }

  const entriesByDate = computed(() => {
    const map = new Map<string, PlanEntry[]>()
    for (const entry of entries.value) {
      const list = map.get(entry.date) ?? []
      list.push(entry)
      map.set(entry.date, list)
    }
    return map
  })

  const taskTypeById = computed(() => {
    const map = new Map<string, TaskType>()
    for (const taskType of taskTypes.value) {
      map.set(taskType.id, taskType)
    }
    return map
  })

  return {
    taskTypes,
    entries,
    entriesByDate,
    taskTypeById,
    addTaskType,
    removeTaskType,
    upsertPlanEntry,
    toggleEntryDone,
    removePlanEntry,
  }
})
