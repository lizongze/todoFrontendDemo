<template>
  <div class="add-todo-section">
    <el-input
      v-model="newTodoTitle"
      placeholder="What needs to be done?"
      class="todo-input"
      @keyup.enter="onAdd"
      :disabled="loading"
    >
      <template #append>
        <el-button type="primary" @click="onAdd" :loading="loading">Add</el-button>
      </template>
    </el-input>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'add', title: string): void
}>()

const newTodoTitle = ref('')

function onAdd() {
  const title = newTodoTitle.value.trim()
  if (!title) return
  
  emit('add', title)
  newTodoTitle.value = ''
}
</script>

<style scoped>
.add-todo-section {
  margin-bottom: 20px;
}
</style>
