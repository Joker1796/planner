<script setup lang="ts">
import type { CalendarDay } from '@/lib/date/dateUtils'
import type { FamilyMember, PlanEntry, TaskType } from '@/types'
import { WEEKDAY_LABELS } from '@/lib/date/dateUtils'
import DayCell from './DayCell.vue'

defineProps<{
  days: CalendarDay[]
  entriesByDate: Map<string, PlanEntry[]>
  taskTypeById: Map<string, TaskType>
  familyMemberById: Map<string, FamilyMember>
}>()

const emit = defineEmits<{ select: [iso: string] }>()
</script>

<template>
  <div>
    <div class="grid grid-cols-7 gap-1 pb-2 text-center text-xs font-medium text-slate-500">
      <span v-for="label in WEEKDAY_LABELS" :key="label">{{ label }}</span>
    </div>
    <div class="grid grid-cols-7 gap-1">
      <DayCell
        v-for="day in days"
        :key="day.iso"
        :day="day"
        :entries="entriesByDate.get(day.iso) ?? []"
        :task-type-by-id="taskTypeById"
        :family-member-by-id="familyMemberById"
        @select="emit('select', $event)"
      />
    </div>
  </div>
</template>
