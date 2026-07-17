<script setup lang="ts">
import { computed } from 'vue'
import { differenceInCalendarDays, parseISO } from 'date-fns'
import { usePlannerStore } from '@/store/usePlannerStore'
import { TASK_COLOR_CLASSES, isTaskColor } from '@/lib/colors'
import { formatFullDate } from '@/lib/date/dateUtils'
import type { BudgetGoal } from '@/types'

const props = defineProps<{ goal: BudgetGoal }>()
const emit = defineEmits<{ open: [] }>()

const store = usePlannerStore()

const saved = computed(() => store.budgetTotalsByGoal.get(props.goal.id) ?? 0)
const percent = computed(() =>
  Math.max(0, Math.min(100, (saved.value / props.goal.targetAmount) * 100)),
)
const remaining = computed(() => Math.max(props.goal.targetAmount - saved.value, 0))
const achieved = computed(() => saved.value >= props.goal.targetAmount)

const color = computed(() => (isTaskColor(props.goal.color) ? props.goal.color : 'indigo'))
const barClass = computed(() => TASK_COLOR_CLASSES[color.value].dot)

const daysLeft = computed(() => {
  if (!props.goal.deadline) return null
  return differenceInCalendarDays(parseISO(props.goal.deadline), new Date())
})

function formatAmount(value: number): string {
  return `${Math.round(value).toLocaleString('ru-RU')} ₽`
}

function removeGoal(): void {
  const confirmed = window.confirm(
    `Удалить цель «${props.goal.name}»? Вся история пополнений будет удалена без возможности восстановления.`,
  )
  if (!confirmed) return
  store.removeBudgetGoal(props.goal.id)
}
</script>

<template>
  <div class="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
    <div class="flex items-center justify-between gap-2">
      <div class="flex min-w-0 items-center gap-2">
        <span class="truncate text-sm font-semibold text-slate-900">{{ goal.name }}</span>
        <span v-if="achieved" class="shrink-0 text-xs font-medium text-emerald-600"
          >🎉 Достигнуто</span
        >
      </div>
      <button
        type="button"
        aria-label="Удалить цель"
        class="shrink-0 text-slate-400 hover:text-rose-500"
        @click="removeGoal"
      >
        ✕
      </button>
    </div>

    <div class="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div class="h-full rounded-full transition-all" :class="barClass" :style="{ width: percent + '%' }" />
    </div>

    <div class="flex items-center justify-between text-xs text-slate-500">
      <span>{{ formatAmount(saved) }} из {{ formatAmount(goal.targetAmount) }}</span>
      <span>{{ Math.round(percent) }}%</span>
    </div>

    <p v-if="!achieved" class="text-xs text-slate-400">
      Осталось накопить {{ formatAmount(remaining) }}
      <template v-if="goal.deadline">
        · срок {{ formatFullDate(goal.deadline) }}
        <template v-if="daysLeft !== null && daysLeft >= 0"> ({{ daysLeft }} дн.)</template>
        <template v-else-if="daysLeft !== null"> (просрочено)</template>
      </template>
    </p>

    <button
      type="button"
      class="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
      @click="emit('open')"
    >
      Пополнить / история
    </button>
  </div>
</template>
