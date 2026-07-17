import { onBeforeUnmount, onMounted, ref } from 'vue'
import { toISODate } from './dateUtils'

// A reactive "today" ISO date that stays correct if the tab is left open
// across midnight — refreshes on a midnight timer and whenever the tab
// becomes visible again (covers backgrounded/sleeping tabs).
export function useTodayISO() {
  const todayIso = ref(toISODate(new Date()))
  let timer: ReturnType<typeof setTimeout> | undefined

  function refresh(): void {
    const current = toISODate(new Date())
    if (current !== todayIso.value) todayIso.value = current
  }

  function msUntilNextMidnight(): number {
    const now = new Date()
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 5)
    return nextMidnight.getTime() - now.getTime()
  }

  function scheduleNextRefresh(): void {
    timer = setTimeout(() => {
      refresh()
      scheduleNextRefresh()
    }, msUntilNextMidnight())
  }

  function handleVisibilityChange(): void {
    if (document.visibilityState === 'visible') refresh()
  }

  onMounted(() => {
    scheduleNextRefresh()
    document.addEventListener('visibilitychange', handleVisibilityChange)
  })

  onBeforeUnmount(() => {
    clearTimeout(timer)
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  })

  return todayIso
}
