<script setup lang="ts">
import { computed } from 'vue'
import type { CalendarDay } from '@/lib/date/dateUtils'
import type { PlanEntry, TaskType } from '@/types'
import { TASK_COLOR_CLASSES, isTaskColor } from '@/lib/colors'

const props = defineProps<{
  day: CalendarDay
  entries: PlanEntry[]
  taskTypeById: Map<string, TaskType>
}>()

const emit = defineEmits<{ select: [iso: string] }>()

const MAX_VISIBLE_DOTS = 3

const dots = computed(() =>
  props.entries.slice(0, MAX_VISIBLE_DOTS).map((entry) => {
    const taskType = props.taskTypeById.get(entry.taskTypeId)
    const color = taskType && isTaskColor(taskType.color) ? taskType.color : 'indigo'
    return { id: entry.id, done: entry.done, dotClass: TASK_COLOR_CLASSES[color].dot }
  }),
)

const overflowCount = computed(() => Math.max(props.entries.length - MAX_VISIBLE_DOTS, 0))
</script>

<template>
  <button
    type="button"
    class="flex aspect-square flex-col items-center justify-start gap-1 rounded-lg p-1 pt-1.5 transition-colors hover:bg-indigo-50"
    :class="[
      day.isToday ? 'ring-2 ring-indigo-500' : '',
      day.isCurrentMonth ? 'text-slate-900' : 'text-slate-400',
    ]"
    @click="emit('select', day.iso)"
  >
    <span class="text-sm">{{ day.date.getDate() }}</span>
    <div class="flex min-h-[6px] flex-wrap items-center justify-center gap-0.5">
      <span
        v-for="dot in dots"
        :key="dot.id"
        class="h-1.5 w-1.5 rounded-full"
        :class="[dot.dotClass, dot.done ? 'opacity-40' : '']"
      />
      <span v-if="overflowCount > 0" class="text-[10px] leading-none text-slate-400"
        >+{{ overflowCount }}</span
      >
    </div>
  </button>
</template>
