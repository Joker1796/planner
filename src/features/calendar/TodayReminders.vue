<script setup lang="ts">
import { computed } from 'vue'
import { usePlannerStore } from '@/store/usePlannerStore'
import { toISODate } from '@/lib/date/dateUtils'
import { TASK_COLOR_CLASSES, isTaskColor } from '@/lib/colors'
import type { PlanEntry } from '@/types'

const store = usePlannerStore()
const todayIso = toISODate(new Date())

const todayEntries = computed(() =>
  [...store.getEffectiveEntriesForDate(todayIso)].sort((a, b) => {
    if (a.time && b.time) return a.time.localeCompare(b.time)
    if (a.time) return -1
    if (b.time) return 1
    return a.createdAt - b.createdAt
  }),
)

function taskTypeName(taskTypeId: string): string {
  return store.taskTypeById.get(taskTypeId)?.name ?? 'Задача'
}

function taskTypeDotClass(taskTypeId: string): string {
  const taskType = store.taskTypeById.get(taskTypeId)
  const color = taskType && isTaskColor(taskType.color) ? taskType.color : 'indigo'
  return TASK_COLOR_CLASSES[color].dot
}

function toggleDone(entry: PlanEntry): void {
  if (entry.id.startsWith('virtual:')) {
    store.upsertPlanEntry(todayIso, entry.taskTypeId, true)
  } else {
    store.toggleEntryDone(entry.id)
  }
}
</script>

<template>
  <section class="mb-4 rounded-xl border border-slate-200 bg-white p-4">
    <h2 class="mb-2 text-sm font-semibold text-slate-700">Напоминания на сегодня</h2>
    <p v-if="todayEntries.length === 0" class="text-sm text-slate-500">
      На сегодня ничего не запланировано.
    </p>
    <ul v-else class="space-y-2">
      <li
        v-for="entry in todayEntries"
        :key="entry.id"
        class="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2"
      >
        <input
          type="checkbox"
          aria-label="Выполнено"
          class="h-4 w-4 rounded border-slate-300 text-indigo-600"
          :checked="entry.done"
          @change="toggleDone(entry)"
        />
        <span class="h-2 w-2 shrink-0 rounded-full" :class="taskTypeDotClass(entry.taskTypeId)" />
        <span
          v-if="entry.time"
          class="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-600"
        >
          {{ entry.time }}
        </span>
        <span
          class="flex-1 text-sm"
          :class="entry.done ? 'text-slate-400 line-through' : 'text-slate-800'"
        >
          {{ taskTypeName(entry.taskTypeId) }}
        </span>
      </li>
    </ul>
  </section>
</template>
