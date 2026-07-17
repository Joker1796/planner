<script setup lang="ts">
import { ref } from 'vue'
import { usePlannerStore } from '@/store/usePlannerStore'
import { useCalendarMonth } from './useCalendarMonth'
import MonthNavigator from './MonthNavigator.vue'
import CalendarGrid from './CalendarGrid.vue'
import AddPlanModal from './AddPlanModal.vue'

const store = usePlannerStore()
const { days, label, goToPrevMonth, goToNextMonth, goToToday } = useCalendarMonth()

const selectedDate = ref<string | null>(null)

function openDay(iso: string): void {
  selectedDate.value = iso
}

function closeModal(): void {
  selectedDate.value = null
}
</script>

<template>
  <div>
    <MonthNavigator :label="label" @prev="goToPrevMonth" @next="goToNextMonth" @today="goToToday" />
    <CalendarGrid
      :days="days"
      :entries-by-date="store.entriesByDate"
      :task-type-by-id="store.taskTypeById"
      @select="openDay"
    />
    <AddPlanModal v-if="selectedDate" :date="selectedDate" @close="closeModal" />
  </div>
</template>
