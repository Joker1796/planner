<script setup lang="ts">
import { computed } from 'vue'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import Modal from '@/components/Modal.vue'
import Chip from '@/components/Chip.vue'
import { usePlannerStore } from '@/store/usePlannerStore'

const props = defineProps<{ date: string }>()
const emit = defineEmits<{ close: [] }>()

const store = usePlannerStore()

const dateLabel = computed(() => format(new Date(props.date), 'd MMMM yyyy', { locale: ru }))

const entriesForDate = computed(() => store.entriesByDate.get(props.date) ?? [])

const addedTaskTypeIds = computed(
  () => new Set(entriesForDate.value.map((entry) => entry.taskTypeId)),
)

const availableTaskTypes = computed(() =>
  store.taskTypes.filter((taskType) => !addedTaskTypeIds.value.has(taskType.id)),
)

function addTaskType(taskTypeId: string): void {
  store.upsertPlanEntry(props.date, taskTypeId, false)
}

function toggleDone(entryId: string): void {
  store.toggleEntryDone(entryId)
}

function removeEntry(entryId: string): void {
  store.removePlanEntry(entryId)
}
</script>

<template>
  <Modal :title="dateLabel" @close="emit('close')">
    <div v-if="store.taskTypes.length === 0" class="text-sm text-slate-500">
      Сначала создайте типы задач на
      <RouterLink to="/settings" class="text-indigo-600 underline" @click="emit('close')">
        странице настроек
      </RouterLink>
      .
    </div>

    <template v-else>
      <div v-if="entriesForDate.length > 0" class="mb-4 space-y-2">
        <label
          v-for="entry in entriesForDate"
          :key="entry.id"
          class="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2"
        >
          <input
            type="checkbox"
            class="h-4 w-4 rounded border-slate-300 text-indigo-600"
            :checked="entry.done"
            @change="toggleDone(entry.id)"
          />
          <span
            class="flex-1 text-sm"
            :class="entry.done ? 'text-slate-400 line-through' : 'text-slate-800'"
          >
            {{ store.taskTypeById.get(entry.taskTypeId)?.name ?? 'Задача' }}
          </span>
          <button
            type="button"
            aria-label="Удалить план"
            class="text-slate-400 hover:text-rose-500"
            @click="removeEntry(entry.id)"
          >
            ✕
          </button>
        </label>
      </div>

      <div v-if="availableTaskTypes.length > 0">
        <p class="mb-2 text-xs font-medium text-slate-500">Добавить задачу</p>
        <div class="flex flex-wrap gap-2">
          <Chip
            v-for="taskType in availableTaskTypes"
            :key="taskType.id"
            :label="taskType.name"
            :color="taskType.color"
            @click="addTaskType(taskType.id)"
          />
        </div>
      </div>
      <p v-else-if="entriesForDate.length > 0" class="text-xs text-slate-400">
        Все типы задач уже добавлены на этот день.
      </p>
    </template>
  </Modal>
</template>
