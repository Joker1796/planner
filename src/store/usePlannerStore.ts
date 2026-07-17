import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { FamilyMember, ListItem, ListKind, PlanEntry, Recurrence, TaskType } from '@/types'
import { generateId } from '@/lib/id'
import { loadState, saveState } from '@/lib/storage/repository'
import { matchesRecurrence } from '@/lib/recurrence'

export const usePlannerStore = defineStore('planner', () => {
  const initial = loadState()
  const taskTypes = ref<TaskType[]>(initial.taskTypes)
  const entries = ref<PlanEntry[]>(initial.entries)
  const familyMembers = ref<FamilyMember[]>(initial.familyMembers)
  const listItems = ref<ListItem[]>(initial.listItems)

  function persist(): void {
    saveState({
      taskTypes: taskTypes.value,
      entries: entries.value,
      familyMembers: familyMembers.value,
      listItems: listItems.value,
    })
  }

  function addTaskType(
    name: string,
    color: string,
    familyMemberId?: string | null,
    recurrence?: Recurrence | null,
    icon?: string | null,
  ): void {
    taskTypes.value.push({
      id: generateId(),
      name,
      color,
      createdAt: Date.now(),
      familyMemberId: familyMemberId ?? null,
      recurrence: recurrence ?? null,
      icon: icon ?? null,
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

  // Finds the real entry for (date, taskTypeId), creating an empty one if
  // it doesn't exist yet. Does not persist — callers persist once they've
  // finished mutating the returned entry.
  function ensureEntry(date: string, taskTypeId: string): PlanEntry {
    const existing = entries.value.find(
      (entry) => entry.date === date && entry.taskTypeId === taskTypeId,
    )
    if (existing) return existing
    const now = Date.now()
    const created: PlanEntry = {
      id: generateId(),
      date,
      taskTypeId,
      done: false,
      time: null,
      createdAt: now,
      updatedAt: now,
    }
    entries.value.push(created)
    return created
  }

  function upsertPlanEntry(date: string, taskTypeId: string, done: boolean): void {
    const entry = ensureEntry(date, taskTypeId)
    entry.done = done
    entry.updatedAt = Date.now()
    persist()
  }

  // Materializes a real PlanEntry for a virtual (recurrence-only) occurrence
  // without changing its done state, returning its id so callers (e.g. a
  // time picker) can then act on it. Returns the id unchanged if already real.
  function materializeEntry(date: string, taskTypeId: string): string {
    const entry = ensureEntry(date, taskTypeId)
    persist()
    return entry.id
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

  // Excludes a specific date from a task type's recurrence pattern, so a
  // removed occurrence doesn't reappear as a virtual entry on next render.
  function excludeRecurrenceDate(taskTypeId: string, date: string): void {
    const taskType = taskTypes.value.find((t) => t.id === taskTypeId)
    if (!taskType) return
    if (!(taskType.excludedDates ?? []).includes(date)) {
      taskType.excludedDates = [...(taskType.excludedDates ?? []), date]
      persist()
    }
  }

  function addListItem(list: ListKind, text: string): void {
    listItems.value.push({ id: generateId(), list, text, done: false, createdAt: Date.now() })
    persist()
  }

  function toggleListItemDone(id: string): void {
    const item = listItems.value.find((i) => i.id === id)
    if (!item) return
    item.done = !item.done
    persist()
  }

  function removeListItem(id: string): void {
    listItems.value = listItems.value.filter((item) => item.id !== id)
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

  // Real entries for a date, plus one virtual (unsaved) entry per active
  // recurring task type whose pattern matches that date and that doesn't
  // already have a real entry or an explicit exclusion for it.
  function getEffectiveEntriesForDate(date: string): PlanEntry[] {
    const real = entriesByDate.value.get(date) ?? []
    const realTaskTypeIds = new Set(real.map((entry) => entry.taskTypeId))
    const virtual: PlanEntry[] = []
    for (const taskType of activeTaskTypes.value) {
      if (!taskType.recurrence) continue
      if (realTaskTypeIds.has(taskType.id)) continue
      if ((taskType.excludedDates ?? []).includes(date)) continue
      if (!matchesRecurrence(taskType.recurrence, date)) continue
      virtual.push({
        id: `virtual:${taskType.id}:${date}`,
        date,
        taskTypeId: taskType.id,
        done: false,
        time: null,
        createdAt: 0,
        updatedAt: 0,
      })
    }
    return [...real, ...virtual]
  }

  function buildEffectiveEntriesByDate(dates: string[]): Map<string, PlanEntry[]> {
    const map = new Map<string, PlanEntry[]>()
    for (const date of dates) map.set(date, getEffectiveEntriesForDate(date))
    return map
  }

  return {
    taskTypes,
    entries,
    familyMembers,
    listItems,
    entriesByDate,
    taskTypeById,
    activeTaskTypes,
    familyMemberById,
    getEffectiveEntriesForDate,
    buildEffectiveEntriesByDate,
    addTaskType,
    removeTaskType,
    upsertPlanEntry,
    materializeEntry,
    toggleEntryDone,
    setEntryTime,
    removePlanEntry,
    excludeRecurrenceDate,
    addFamilyMember,
    removeFamilyMember,
    addListItem,
    toggleListItemDone,
    removeListItem,
  }
})
