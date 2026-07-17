<script setup lang="ts">
import Chip from '@/components/Chip.vue'
import type { TaskType } from '@/types'
import { usePlannerStore } from '@/store/usePlannerStore'
import { describeRecurrence } from '@/lib/recurrence'

const store = usePlannerStore()

function chipLabel(taskType: TaskType): string {
  const member = taskType.familyMemberId
    ? store.familyMemberById.get(taskType.familyMemberId)
    : undefined
  const parts = [taskType.name]
  if (member) parts.push(member.name)
  if (taskType.recurrence) parts.push(describeRecurrence(taskType.recurrence))
  return parts.join(' · ')
}

function removeTaskType(taskTypeId: string, name: string): void {
  const confirmed = window.confirm(
    `Удалить тип задачи «${name}»? Он исчезнет из списка выбора, но уже созданные записи в календаре и истории сохранятся.`,
  )
  if (!confirmed) return
  store.removeTaskType(taskTypeId)
}
</script>

<template>
  <div>
    <p v-if="store.activeTaskTypes.length === 0" class="text-sm text-slate-500">
      Пока нет ни одного типа задач — добавьте первый ниже.
    </p>
    <div v-else class="flex flex-wrap gap-2">
      <Chip
        v-for="taskType in store.activeTaskTypes"
        :key="taskType.id"
        :label="chipLabel(taskType)"
        :color="taskType.color"
        removable
        @remove="removeTaskType(taskType.id, taskType.name)"
      />
    </div>
  </div>
</template>
