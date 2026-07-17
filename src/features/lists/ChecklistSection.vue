<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePlannerStore } from '@/store/usePlannerStore'
import type { ListKind } from '@/types'

const props = defineProps<{ kind: ListKind; title: string; placeholder: string }>()

const store = usePlannerStore()
const text = ref('')

const items = computed(() => store.listItems.filter((item) => item.list === props.kind))

function submit(): void {
  const trimmed = text.value.trim()
  if (!trimmed) return
  store.addListItem(props.kind, trimmed)
  text.value = ''
}

function toggleDone(id: string): void {
  store.toggleListItemDone(id)
}

function removeItem(id: string): void {
  store.removeListItem(id)
}
</script>

<template>
  <section class="space-y-3">
    <h2 class="text-sm font-semibold text-slate-700">{{ title }}</h2>
    <p v-if="items.length === 0" class="text-sm text-slate-500">Пока пусто.</p>
    <ul v-else class="space-y-2">
      <li
        v-for="item in items"
        :key="item.id"
        class="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2"
      >
        <input
          type="checkbox"
          aria-label="Выполнено"
          class="h-4 w-4 rounded border-slate-300 text-indigo-600"
          :checked="item.done"
          @change="toggleDone(item.id)"
        />
        <span
          class="flex-1 text-sm"
          :class="item.done ? 'text-slate-400 line-through' : 'text-slate-800'"
        >
          {{ item.text }}
        </span>
        <button
          type="button"
          aria-label="Удалить"
          class="text-slate-400 hover:text-rose-500"
          @click="removeItem(item.id)"
        >
          ✕
        </button>
      </li>
    </ul>
    <form class="flex gap-2" @submit.prevent="submit">
      <input
        v-model="text"
        type="text"
        :placeholder="placeholder"
        maxlength="60"
        class="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
      <button
        type="submit"
        class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!text.trim()"
      >
        Добавить
      </button>
    </form>
  </section>
</template>
