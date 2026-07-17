<script setup lang="ts">
import TaskTypeForm from './TaskTypeForm.vue'
import TaskTypeList from './TaskTypeList.vue'
import FamilyMemberForm from './FamilyMemberForm.vue'
import FamilyMemberList from './FamilyMemberList.vue'
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="mb-1 text-xl font-semibold text-slate-900">Настройки</h1>
      <p class="text-sm text-slate-500">
        Создайте типы задач, которые будут доступны при добавлении планов в календаре.
      </p>
    </div>
    <section class="space-y-3">
      <h2 class="text-sm font-semibold text-slate-700">Семья</h2>
      <FamilyMemberList />
      <FamilyMemberForm />
    </section>
    <section class="space-y-3">
      <h2 class="text-sm font-semibold text-slate-700">Типы задач</h2>
      <TaskTypeList />
      <TaskTypeForm />
    </section>
  </div>
</template>
