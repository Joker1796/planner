<script setup lang="ts">
import { computed } from 'vue'
import { getQuoteOfTheDay } from '@/lib/quotes'

const quote = computed(() => getQuoteOfTheDay())
</script>

<template>
  <div class="mb-4 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">
    <p class="text-sm italic text-slate-700">«{{ quote.text }}»</p>
    <p class="mt-1 text-xs font-medium text-indigo-600">— {{ quote.source }}</p>
  </div>
</template>
