<script setup lang="ts">
defineProps<{ label: string }>()
const emit = defineEmits<{ prev: []; next: []; today: [] }>()
</script>

<template>
  <div class="mb-4 flex items-center justify-between">
    <h1 class="text-xl font-semibold text-slate-900">{{ label }}</h1>
    <div class="flex items-center gap-2">
      <button
        type="button"
        aria-label="Предыдущий месяц"
        class="rounded-lg border border-slate-200 px-2 py-1 text-sm hover:bg-slate-100"
        @click="emit('prev')"
      >
        ←
      </button>
      <button
        type="button"
        class="rounded-lg border border-slate-200 px-3 py-1 text-sm hover:bg-slate-100"
        @click="emit('today')"
      >
        Сегодня
      </button>
      <button
        type="button"
        aria-label="Следующий месяц"
        class="rounded-lg border border-slate-200 px-2 py-1 text-sm hover:bg-slate-100"
        @click="emit('next')"
      >
        →
      </button>
    </div>
  </div>
</template>
