<script setup lang="ts">
import { computed, ref } from 'vue'
import { TASK_COLORS, TASK_COLOR_CLASSES, type TaskColor } from '@/lib/colors'
import { TASK_ICONS } from '@/lib/icons'
import { usePlannerStore } from '@/store/usePlannerStore'
import type { Recurrence, RecurrenceUnit } from '@/types'
import Chip from '@/components/Chip.vue'

const store = usePlannerStore()

const name = ref('')
const selectedColor = ref<TaskColor>(TASK_COLORS[0])
const selectedIcon = ref<string | null>(null)
const selectedFamilyMemberId = ref<string | null>(null)
const recurrenceUnit = ref<RecurrenceUnit | ''>('')
const recurrenceInterval = ref(1)

const isDuplicate = computed(() => {
  const trimmed = name.value.trim().toLowerCase()
  if (!trimmed) return false
  return store.activeTaskTypes.some((taskType) => taskType.name.trim().toLowerCase() === trimmed)
})

const canSubmit = computed(() => name.value.trim().length > 0 && !isDuplicate.value)

function submit(): void {
  const trimmed = name.value.trim()
  if (!trimmed || isDuplicate.value) return
  const recurrence: Recurrence | null = recurrenceUnit.value
    ? {
        unit: recurrenceUnit.value,
        interval: Math.max(1, recurrenceInterval.value || 1),
        startDate: null,
      }
    : null
  store.addTaskType(trimmed, selectedColor.value, selectedFamilyMemberId.value, recurrence, selectedIcon.value)
  name.value = ''
  selectedColor.value = TASK_COLORS[0]
  selectedIcon.value = null
  selectedFamilyMemberId.value = null
  recurrenceUnit.value = ''
  recurrenceInterval.value = 1
}
</script>

<template>
  <form class="space-y-3 rounded-xl border border-slate-200 bg-white p-4" @submit.prevent="submit">
    <div>
      <label for="task-type-name" class="mb-1 block text-sm font-medium text-slate-700"
        >Название</label
      >
      <input
        id="task-type-name"
        v-model="name"
        type="text"
        placeholder="Например, Спорт"
        maxlength="40"
        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
      <p v-if="isDuplicate" class="mt-1 text-xs text-rose-500">Такой тип задачи уже есть.</p>
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
    <div>
      <p class="mb-1 text-sm font-medium text-slate-700">Иконка</p>
      <div class="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          aria-label="Без иконки"
          class="flex h-8 w-8 shrink-0 snap-start items-center justify-center rounded-lg border text-sm text-slate-400 transition-colors"
          :class="selectedIcon === null ? 'border-slate-900 bg-slate-100' : 'border-slate-200 hover:bg-slate-50'"
          @click="selectedIcon = null"
        >
          —
        </button>
        <button
          v-for="icon in TASK_ICONS"
          :key="icon"
          type="button"
          :aria-label="icon"
          class="flex h-8 w-8 shrink-0 snap-start items-center justify-center rounded-lg border text-base transition-colors"
          :class="selectedIcon === icon ? 'border-slate-900 bg-slate-100' : 'border-slate-200 hover:bg-slate-50'"
          @click="selectedIcon = icon"
        >
          {{ icon }}
        </button>
      </div>
    </div>
    <div v-if="store.familyMembers.length > 0">
      <p class="mb-1 text-sm font-medium text-slate-700">Ребёнок / член семьи</p>
      <div class="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1">
        <Chip
          class="shrink-0 snap-start"
          label="Без привязки"
          color="indigo"
          :selected="selectedFamilyMemberId === null"
          @click="selectedFamilyMemberId = null"
        />
        <Chip
          v-for="member in store.familyMembers"
          :key="member.id"
          class="shrink-0 snap-start"
          :label="member.name"
          color="indigo"
          :selected="selectedFamilyMemberId === member.id"
          @click="selectedFamilyMemberId = member.id"
        />
      </div>
    </div>
    <div>
      <p class="mb-1 text-sm font-medium text-slate-700">Повтор</p>
      <div class="flex flex-wrap items-center gap-2">
        <select
          v-model="recurrenceUnit"
          class="rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">Без повтора</option>
          <option value="day">Дней</option>
          <option value="week">Недель</option>
        </select>
        <template v-if="recurrenceUnit">
          <span class="text-sm text-slate-500">каждые</span>
          <input
            v-model.number="recurrenceInterval"
            type="number"
            min="1"
            max="30"
            class="w-16 rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <span class="text-xs text-slate-500">
            {{ recurrenceUnit === 'day' ? 'дн.' : 'нед.' }} — начнётся с того дня, когда вы
            впервые добавите задачу в календарь
          </span>
        </template>
      </div>
    </div>
    <button
      type="submit"
      class="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="!canSubmit"
    >
      Добавить
    </button>
  </form>
</template>
