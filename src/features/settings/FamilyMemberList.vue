<script setup lang="ts">
import Chip from '@/components/Chip.vue'
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
    <div v-else class="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1">
      <Chip
        v-for="member in store.familyMembers"
        :key="member.id"
        class="shrink-0 snap-start"
        :label="member.name"
        color="indigo"
        removable
        @remove="removeFamilyMember(member.id, member.name)"
      />
    </div>
  </div>
</template>
