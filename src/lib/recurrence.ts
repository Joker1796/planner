import { differenceInCalendarDays, parseISO } from 'date-fns'
import type { Recurrence } from '@/types'

export function matchesRecurrence(recurrence: Recurrence, iso: string): boolean {
  const diffDays = differenceInCalendarDays(parseISO(iso), parseISO(recurrence.startDate))
  // The creation day itself never matches — the first occurrence lands
  // one full interval later, not immediately on the day it was set up.
  if (diffDays <= 0) return false
  const stepDays = recurrence.unit === 'week' ? recurrence.interval * 7 : recurrence.interval
  return diffDays % stepDays === 0
}

export function describeRecurrence(recurrence: Recurrence): string {
  if (recurrence.unit === 'day') {
    return recurrence.interval === 1 ? 'Каждый день' : `Каждые ${recurrence.interval} дн.`
  }
  return recurrence.interval === 1 ? 'Каждую неделю' : `Каждые ${recurrence.interval} нед.`
}
