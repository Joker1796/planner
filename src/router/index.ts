import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'calendar',
      component: () => import('@/features/calendar/CalendarPage.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/features/settings/SettingsPage.vue'),
    },
  ],
})

export default router
