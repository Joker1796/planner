import { computed, ref } from 'vue'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { buildMonthGrid, type CalendarDay } from '@/lib/date/dateUtils'
import { useTodayISO } from '@/lib/date/useToday'

export function useCalendarMonth() {
  const todayIso = useTodayISO()
  const today = new Date()
  const year = ref(today.getFullYear())
  const month = ref(today.getMonth())

  const days = computed<CalendarDay[]>(() => {
    // Reading todayIso here makes the grid (and its "today" ring) refresh
    // automatically at midnight even if the user never navigates months.
    void todayIso.value
    return buildMonthGrid(year.value, month.value)
  })

  const label = computed(() => {
    const raw = format(new Date(year.value, month.value), 'LLLL yyyy', { locale: ru })
    return raw.charAt(0).toUpperCase() + raw.slice(1)
  })

  function goToPrevMonth(): void {
    if (month.value === 0) {
      month.value = 11
      year.value -= 1
    } else {
      month.value -= 1
    }
  }

  function goToNextMonth(): void {
    if (month.value === 11) {
      month.value = 0
      year.value += 1
    } else {
      month.value += 1
    }
  }

  function goToToday(): void {
    const now = new Date()
    year.value = now.getFullYear()
    month.value = now.getMonth()
  }

  return { year, month, days, label, goToPrevMonth, goToNextMonth, goToToday }
}
