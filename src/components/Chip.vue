<script setup lang="ts">
import { computed } from 'vue'
import { TASK_COLOR_CLASSES, isTaskColor, type TaskColor } from '@/lib/colors'

const props = defineProps<{
  label: string
  color: string
  icon?: string | null
  selected?: boolean
  removable?: boolean
}>()

const emit = defineEmits<{ click: []; remove: [] }>()

const resolvedColor = computed<TaskColor>(() => (isTaskColor(props.color) ? props.color : 'indigo'))
const classes = computed(() => TASK_COLOR_CLASSES[resolvedColor.value])
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
    :class="selected ? [classes.chipBgSelected, 'text-white'] : [classes.chipBg, classes.chipText]"
  >
    <button type="button" class="cursor-pointer" @click="emit('click')">
      <span v-if="icon">{{ icon }} </span>{{ label }}
    </button>
    <button
      v-if="removable"
      type="button"
      aria-label="Удалить"
      class="rounded-full p-0.5 opacity-70 hover:opacity-100"
      @click.stop="emit('remove')"
    >
      ✕
    </button>
  </span>
</template>
