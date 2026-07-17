<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePlannerStore } from '@/store/usePlannerStore'
import { formatFullDate } from '@/lib/date/dateUtils'
import { TASK_COLOR_CLASSES, isTaskColor } from '@/lib/colors'

type DoneFilter = 'all' | 'done' | 'pending'

const store = usePlannerStore()
const filter = ref<DoneFilter>('all')

const filterOptions: { value: DoneFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'done', label: 'Выполнено' },
  { value: 'pending', label: 'Не выполнено' },
]

const sortedEntries = computed(() =>
  [...store.entries].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt),
)

const filteredEntries = computed(() => {
  if (filter.value === 'done') return sortedEntries.value.filter((entry) => entry.done)
  if (filter.value === 'pending') return sortedEntries.value.filter((entry) => !entry.done)
  return sortedEntries.value
})

function taskTypeName(taskTypeId: string): string {
  return store.taskTypeById.get(taskTypeId)?.name ?? 'Задача'
}

function taskTypeDotClass(taskTypeId: string): string {
  const taskType = store.taskTypeById.get(taskTypeId)
  const color = taskType && isTaskColor(taskType.color) ? taskType.color : 'indigo'
  return TASK_COLOR_CLASSES[color].dot
}

function isArchived(taskTypeId: string): boolean {
  return Boolean(store.taskTypeById.get(taskTypeId)?.archivedAt)
}

function familyMemberName(taskTypeId: string): string | null {
  const taskType = store.taskTypeById.get(taskTypeId)
  if (!taskType?.familyMemberId) return null
  return store.familyMemberById.get(taskType.familyMemberId)?.name ?? null
}

function toggleDone(entryId: string): void {
  store.toggleEntryDone(entryId)
}
</script>

<template>
  <div class="space-y-4">
    <div>
      <h1 class="mb-1 text-xl font-semibold text-slate-900">История</h1>
      <p class="text-sm text-slate-500">Все записи планов, от новых к старым.</p>
    </div>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="option in filterOptions"
        :key="option.value"
        type="button"
        class="rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors"
        :class="
          filter === option.value
            ? 'border-indigo-200 bg-indigo-100 text-indigo-700'
            : 'border-slate-200 text-slate-600 hover:bg-slate-100'
        "
        @click="filter = option.value"
      >
        {{ option.label }}
      </button>
    </div>

    <p v-if="filteredEntries.length === 0" class="text-sm text-slate-500">Записей пока нет.</p>

    <ul v-else class="space-y-2">
      <li
        v-for="entry in filteredEntries"
        :key="entry.id"
        class="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2"
      >
        <input
          type="checkbox"
          class="h-4 w-4 rounded border-slate-300 text-indigo-600"
          :checked="entry.done"
          @change="toggleDone(entry.id)"
        />
        <span class="h-2.5 w-2.5 shrink-0 rounded-full" :class="taskTypeDotClass(entry.taskTypeId)" />
        <div class="min-w-0 flex-1">
          <p class="text-sm" :class="entry.done ? 'text-slate-400 line-through' : 'text-slate-800'">
            {{ taskTypeName(entry.taskTypeId) }}
            <span v-if="isArchived(entry.taskTypeId)" class="text-xs text-slate-400">(удалено)</span>
            <span v-if="familyMemberName(entry.taskTypeId)" class="text-xs text-slate-400">
              · {{ familyMemberName(entry.taskTypeId) }}
            </span>
          </p>
          <p class="text-xs text-slate-400">
            {{ formatFullDate(entry.date) }}<span v-if="entry.time"> · {{ entry.time }}</span>
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>
