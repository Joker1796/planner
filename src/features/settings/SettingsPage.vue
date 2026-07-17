<script setup lang="ts">
import TaskTypeForm from './TaskTypeForm.vue'
import TaskTypeList from './TaskTypeList.vue'
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="mb-1 text-xl font-semibold text-slate-900">Настройки</h1>
      <p class="text-sm text-slate-500">
        Создайте типы задач, которые будут доступны при добавлении планов в календаре.
      </p>
    </div>
    <TaskTypeList />
    <TaskTypeForm />
  </div>
</template>
