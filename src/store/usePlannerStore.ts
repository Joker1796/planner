import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { FamilyMember, PlanEntry, TaskType } from '@/types'
import { generateId } from '@/lib/id'
import { loadState, saveState } from '@/lib/storage/repository'

export const usePlannerStore = defineStore('planner', () => {
  const initial = loadState()
  const taskTypes = ref<TaskType[]>(initial.taskTypes)
  const entries = ref<PlanEntry[]>(initial.entries)
  const familyMembers = ref<FamilyMember[]>(initial.familyMembers)

  function persist(): void {
    saveState({
      taskTypes: taskTypes.value,
      entries: entries.value,
      familyMembers: familyMembers.value,
    })
  }

  function addTaskType(name: string, color: string, familyMemberId?: string | null): void {
    taskTypes.value.push({
      id: generateId(),
      name,
      color,
      createdAt: Date.now(),
      familyMemberId: familyMemberId ?? null,
    })
    persist()
  }

  // Soft delete: archive in place so history (PlanEntry rows referencing
  // this task type) keeps resolving its name/color/family member forever.
  function removeTaskType(id: string): void {
    const taskType = taskTypes.value.find((t) => t.id === id)
    if (!taskType) return
    taskType.archivedAt = Date.now()
    persist()
  }

  function addFamilyMember(name: string): void {
    familyMembers.value.push({ id: generateId(), name, createdAt: Date.now() })
    persist()
  }

  function removeFamilyMember(id: string): void {
    familyMembers.value = familyMembers.value.filter((member) => member.id !== id)
    for (const taskType of taskTypes.value) {
      if (taskType.familyMemberId === id) taskType.familyMemberId = null
    }
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

  function setEntryTime(id: string, time: string | null): void {
    const entry = entries.value.find((e) => e.id === id)
    if (!entry) return
    entry.time = time || null
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

  const activeTaskTypes = computed(() => taskTypes.value.filter((taskType) => !taskType.archivedAt))

  const familyMemberById = computed(() => {
    const map = new Map<string, FamilyMember>()
    for (const member of familyMembers.value) {
      map.set(member.id, member)
    }
    return map
  })

  return {
    taskTypes,
    entries,
    familyMembers,
    entriesByDate,
    taskTypeById,
    activeTaskTypes,
    familyMemberById,
    addTaskType,
    removeTaskType,
    upsertPlanEntry,
    toggleEntryDone,
    setEntryTime,
    removePlanEntry,
    addFamilyMember,
    removeFamilyMember,
  }
})
