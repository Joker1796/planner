<script setup lang="ts">
import Chip from '@/components/Chip.vue'
import { usePlannerStore } from '@/store/usePlannerStore'

const store = usePlannerStore()

function entryCountFor(taskTypeId: string): number {
  return store.entries.filter((entry) => entry.taskTypeId === taskTypeId).length
}

function removeTaskType(taskTypeId: string, name: string): void {
  const count = entryCountFor(taskTypeId)
  if (count > 0) {
    const confirmed = window.confirm(
      `Удалить «${name}»? Будет удалено ${count} связанных планов из календаря.`,
    )
    if (!confirmed) return
  }
  store.removeTaskType(taskTypeId)
}
</script>

<template>
  <div>
    <p v-if="store.taskTypes.length === 0" class="text-sm text-slate-500">
      Пока нет ни одного типа задач — добавьте первый ниже.
    </p>
    <div v-else class="flex flex-wrap gap-2">
      <Chip
        v-for="taskType in store.taskTypes"
        :key="taskType.id"
        :label="taskType.name"
        :color="taskType.color"
        removable
        @remove="removeTaskType(taskType.id, taskType.name)"
      />
    </div>
  </div>
</template>
