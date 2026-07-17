<script setup lang="ts">
import { ref } from 'vue'
import { usePlannerStore } from '@/store/usePlannerStore'

const store = usePlannerStore()
const name = ref('')

function submit(): void {
  const trimmed = name.value.trim()
  if (!trimmed) return
  store.addFamilyMember(trimmed)
  name.value = ''
}
</script>

<template>
  <form class="space-y-3 rounded-xl border border-slate-200 bg-white p-4" @submit.prevent="submit">
    <div>
      <label for="family-member-name" class="mb-1 block text-sm font-medium text-slate-700"
        >Имя</label
      >
      <input
        id="family-member-name"
        v-model="name"
        type="text"
        placeholder="Например, Аня"
        maxlength="40"
        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
    </div>
    <button
      type="submit"
      class="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="!name.trim()"
    >
      Добавить
    </button>
  </form>
</template>
