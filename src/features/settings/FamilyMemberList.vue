<script setup lang="ts">
import { usePlannerStore } from '@/store/usePlannerStore'

const store = usePlannerStore()

function removeFamilyMember(id: string, name: string): void {
  if (!window.confirm(`Удалить «${name}» из списка членов семьи?`)) return
  store.removeFamilyMember(id)
}
</script>

<template>
  <div>
    <p v-if="store.familyMembers.length === 0" class="text-sm text-slate-500">
      Пока нет ни одного члена семьи — добавьте первого ниже.
    </p>
    <ul v-else class="space-y-2">
      <li
        v-for="member in store.familyMembers"
        :key="member.id"
        class="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2"
      >
        <span class="text-sm text-slate-800">{{ member.name }}</span>
        <button
          type="button"
          aria-label="Удалить"
          class="text-slate-400 hover:text-rose-500"
          @click="removeFamilyMember(member.id, member.name)"
        >
          ✕
        </button>
      </li>
    </ul>
  </div>
</template>
