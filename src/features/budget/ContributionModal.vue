<script setup lang="ts">
import { computed, ref } from 'vue'
import Modal from '@/components/Modal.vue'
import { usePlannerStore } from '@/store/usePlannerStore'
import { toISODate, formatFullDate } from '@/lib/date/dateUtils'

const props = defineProps<{ goalId: string }>()
const emit = defineEmits<{ close: [] }>()

const store = usePlannerStore()

const goal = computed(() => store.budgetGoals.find((g) => g.id === props.goalId))

const transactions = computed(() =>
  [...(store.budgetTransactionsByGoal.get(props.goalId) ?? [])].sort(
    (a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt,
  ),
)

const type = ref<'deposit' | 'withdraw'>('deposit')
const amount = ref<number | null>(null)
const note = ref('')
const date = ref(toISODate(new Date()))

function submit(): void {
  if (!amount.value || amount.value <= 0) return
  const signed = type.value === 'withdraw' ? -amount.value : amount.value
  store.addBudgetTransaction(props.goalId, signed, note.value.trim() || null, date.value)
  amount.value = null
  note.value = ''
}

function removeTransaction(id: string): void {
  store.removeBudgetTransaction(id)
}

function formatAmount(value: number): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${Math.round(value).toLocaleString('ru-RU')} ₽`
}
</script>

<template>
  <Modal :title="goal?.name ?? 'Цель'" @close="emit('close')">
    <form class="mb-4 space-y-2 rounded-lg border border-slate-200 p-3" @submit.prevent="submit">
      <div class="flex gap-2">
        <button
          type="button"
          class="flex-1 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors"
          :class="
            type === 'deposit'
              ? 'border-emerald-200 bg-emerald-100 text-emerald-700'
              : 'border-slate-200 text-slate-600'
          "
          @click="type = 'deposit'"
        >
          Пополнить
        </button>
        <button
          type="button"
          class="flex-1 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors"
          :class="
            type === 'withdraw'
              ? 'border-rose-200 bg-rose-100 text-rose-700'
              : 'border-slate-200 text-slate-600'
          "
          @click="type = 'withdraw'"
        >
          Снять
        </button>
      </div>
      <input
        v-model.number="amount"
        type="number"
        min="1"
        step="1"
        placeholder="Сумма, ₽"
        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
      <div class="flex gap-2">
        <input
          v-model="date"
          type="date"
          class="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <input
          v-model="note"
          type="text"
          placeholder="Заметка"
          maxlength="40"
          class="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <button
        type="submit"
        class="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!amount || amount <= 0"
      >
        Сохранить
      </button>
    </form>

    <p class="mb-2 text-xs font-medium text-slate-500">История</p>
    <p v-if="transactions.length === 0" class="text-sm text-slate-500">Пока нет операций.</p>
    <ul v-else class="space-y-2">
      <li
        v-for="tx in transactions"
        :key="tx.id"
        class="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2"
      >
        <span
          class="shrink-0 text-sm font-medium"
          :class="tx.amount >= 0 ? 'text-emerald-600' : 'text-rose-600'"
        >
          {{ formatAmount(tx.amount) }}
        </span>
        <span class="min-w-0 flex-1 truncate text-xs text-slate-500">
          {{ formatFullDate(tx.date) }}<span v-if="tx.note"> · {{ tx.note }}</span>
        </span>
        <button
          type="button"
          aria-label="Удалить"
          class="shrink-0 text-slate-400 hover:text-rose-500"
          @click="removeTransaction(tx.id)"
        >
          ✕
        </button>
      </li>
    </ul>
  </Modal>
</template>
