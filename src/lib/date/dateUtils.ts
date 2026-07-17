import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday as isDateToday,
  startOfMonth,
  startOfWeek,
} from 'date-fns'

const WEEK_STARTS_ON = 1 // Monday

export const WEEKDAY_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

export interface CalendarDay {
  date: Date
  iso: string
  isCurrentMonth: boolean
  isToday: boolean
}

export function toISODate(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function isTodayISO(iso: string): boolean {
  return iso === toISODate(new Date())
}

// Builds a full 7-column grid for the month containing `year`/`month`,
// padded with the leading/trailing days needed to fill whole weeks.
export function buildMonthGrid(year: number, month: number): CalendarDay[] {
  const monthStart = startOfMonth(new Date(year, month))
  const monthEnd = endOfMonth(monthStart)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: WEEK_STARTS_ON })
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: WEEK_STARTS_ON })

  const days: CalendarDay[] = []
  for (let cursor = gridStart; cursor <= gridEnd; cursor = addDays(cursor, 1)) {
    days.push({
      date: cursor,
      iso: toISODate(cursor),
      isCurrentMonth: isSameMonth(cursor, monthStart),
      isToday: isDateToday(cursor),
    })
  }
  return days
}
