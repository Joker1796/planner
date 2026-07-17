<script setup lang="ts">
import ChecklistSection from './ChecklistSection.vue'
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="mb-1 text-xl font-semibold text-slate-900">Списки</h1>
      <p class="text-sm text-slate-500">Планы покупок и дела, не привязанные к конкретному дню.</p>
    </div>
    <ChecklistSection kind="shopping" title="Покупки" placeholder="Например, молоко" />
    <ChecklistSection kind="todo" title="Дела" placeholder="Например, позвонить в поликлинику" />
  </div>
</template>
