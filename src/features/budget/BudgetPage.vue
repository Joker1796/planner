<script setup lang="ts">
import { ref } from 'vue'
import { usePlannerStore } from '@/store/usePlannerStore'
import GoalForm from './GoalForm.vue'
import GoalCard from './GoalCard.vue'
import ContributionModal from './ContributionModal.vue'

const store = usePlannerStore()
const activeGoalId = ref<string | null>(null)

function openGoal(id: string): void {
  activeGoalId.value = id
}

function closeModal(): void {
  activeGoalId.value = null
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="mb-1 text-xl font-semibold text-slate-900">Бюджет</h1>
      <p class="text-sm text-slate-500">Копите на цели и отслеживайте прогресс.</p>
    </div>

    <p v-if="store.budgetGoals.length === 0" class="text-sm text-slate-500">
      Пока нет ни одной цели — добавьте первую ниже.
    </p>
    <div v-else class="space-y-3">
      <GoalCard v-for="goal in store.budgetGoals" :key="goal.id" :goal="goal" @open="openGoal(goal.id)" />
    </div>

    <GoalForm />

    <ContributionModal v-if="activeGoalId" :goal-id="activeGoalId" @close="closeModal" />
  </div>
</template>
