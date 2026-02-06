<template>
  <div class="add-todo-section">
    <el-form :inline="true" class="todo-form">
      <el-form-item>
        <el-input
          v-model="newTodo.title"
          placeholder="What needs to be done?"
          class="title-input"
          @keyup.enter="onAdd"
          :disabled="loading"
        />
      </el-form-item>
      
      <el-form-item>
        <el-input
          v-model="newTodo.description"
          placeholder="Description"
          :disabled="loading"
        />
      </el-form-item>

      <el-form-item>
        <el-date-picker
          v-model="newTodo.plannedFinishTime"
          type="datetime"
          placeholder="Due Date"
          value-format="YYYY-MM-DD HH:mm:ss"
          :disabled="loading"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onAdd" :loading="loading">Add</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const props = defineProps<{
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'add', todo: { title: string; description: string; plannedFinishTime: string }): void
}>()

const newTodo = reactive({
  title: '',
  description: '',
  plannedFinishTime: ''
})

function onAdd() {
  const title = newTodo.title.trim()
  if (!title) return
  
  emit('add', { ...newTodo })
}

function reset() {
  newTodo.title = ''
  newTodo.description = ''
  newTodo.plannedFinishTime = ''
}

defineExpose({
  reset
})
</script>

<style scoped>
.add-todo-section {
  margin-bottom: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 4px;
}
.todo-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}
.title-input {
  width: 300px;
}
</style>