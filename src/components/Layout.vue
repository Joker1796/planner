<script setup lang="ts"></script>

<template>
  <div class="min-h-screen bg-slate-50">
    <header class="border-b border-slate-200 bg-white">
      <nav class="mx-auto flex max-w-3xl items-center gap-1 px-4 py-3">
        <RouterLink
          to="/"
          class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
          active-class="bg-indigo-100 text-indigo-700"
        >
          Календарь
        </RouterLink>
        <RouterLink
          to="/history"
          class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
          active-class="bg-indigo-100 text-indigo-700"
        >
          История
        </RouterLink>
        <RouterLink
          to="/lists"
          class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
          active-class="bg-indigo-100 text-indigo-700"
        >
          Списки
        </RouterLink>
        <RouterLink
          to="/settings"
          class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
          active-class="bg-indigo-100 text-indigo-700"
        >
          Настройки
        </RouterLink>
      </nav>
    </header>
    <main class="mx-auto max-w-3xl px-4 py-6">
      <slot />
    </main>
  </div>
</template>
