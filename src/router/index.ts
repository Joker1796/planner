import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'calendar',
      component: () => import('@/features/calendar/CalendarPage.vue'),
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('@/features/history/HistoryPage.vue'),
    },
    {
      path: '/lists',
      name: 'lists',
      component: () => import('@/features/lists/ListsPage.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/features/settings/SettingsPage.vue'),
    },
  ],
})

export default router
