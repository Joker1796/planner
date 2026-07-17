<script setup lang="ts">
import { ref } from 'vue'
import { TASK_COLORS, TASK_COLOR_CLASSES, type TaskColor } from '@/lib/colors'
import { usePlannerStore } from '@/store/usePlannerStore'

const store = usePlannerStore()

const name = ref('')
const targetAmount = ref<number | null>(null)
const selectedColor = ref<TaskColor>(TASK_COLORS[0])
const deadline = ref('')

function submit(): void {
  const trimmed = name.value.trim()
  if (!trimmed || !targetAmount.value || targetAmount.value <= 0) return
  store.addBudgetGoal(trimmed, targetAmount.value, selectedColor.value, deadline.value || null)
  name.value = ''
  targetAmount.value = null
  selectedColor.value = TASK_COLORS[0]
  deadline.value = ''
}
</script>

<template>
  <form class="space-y-3 rounded-xl border border-slate-200 bg-white p-4" @submit.prevent="submit">
    <div>
      <label for="goal-name" class="mb-1 block text-sm font-medium text-slate-700">Название цели</label>
      <input
        id="goal-name"
        v-model="name"
        type="text"
        placeholder="Например, Отпуск"
        maxlength="40"
        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
    </div>
    <div>
      <label for="goal-amount" class="mb-1 block text-sm font-medium text-slate-700"
        >Сумма цели, ₽</label
      >
      <input
        id="goal-amount"
        v-model.number="targetAmount"
        type="number"
        min="1"
        step="1"
        placeholder="100000"
        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
    </div>
    <div>
      <label for="goal-deadline" class="mb-1 block text-sm font-medium text-slate-700"
        >Срок (необязательно)</label
      >
      <input
        id="goal-deadline"
        v-model="deadline"
        type="date"
        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
    </div>
    <div>
      <p class="mb-1 text-sm font-medium text-slate-700">Цвет</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="color in TASK_COLORS"
          :key="color"
          type="button"
          :aria-label="color"
          class="h-7 w-7 rounded-full ring-offset-2 transition-shadow"
          :class="[
            TASK_COLOR_CLASSES[color].dot,
            selectedColor === color ? 'ring-2 ring-slate-900' : '',
          ]"
          @click="selectedColor = color"
        />
      </div>
    </div>
    <button
      type="submit"
      class="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="!name.trim() || !targetAmount || targetAmount <= 0"
    >
      Добавить цель
    </button>
  </form>
</template>
