<template>
  <el-container class="layout-container">
    <el-header class="header">
      <h1>Todo List (Pages + Components)</h1>
    </el-header>

    <el-main class="main-content">
      <el-card class="box-card">
        <!-- Removed ClientOnly to allow SSR and better error reporting -->
        <TodoInput 
          ref="todoInputRef"
          :loading="loading" 
          @add="handleAdd" 
        />

        <TodoList 
          :todos="todos" 
          :loading="loading" 
          @toggle="handleToggle" 
          @update="handleUpdate"
          @delete="handleDelete" 
        />
      </el-card>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getTodos, addTodo, updateTodo, deleteTodo, type Todo } from '@/api/todo'

const todos = ref<Todo[]>([])
const loading = ref(false)
const todoInputRef = ref()

async function fetchTodos() {
  loading.value = true
  try {
    todos.value = await getTodos()
  } finally {
    loading.value = false
  }
}

async function handleAdd(todoData: { title: string; description: string; plannedFinishTime: string; reminders: string[] }) {
  loading.value = true
  try {
    await addTodo({
      title: todoData.title,
      description: todoData.description,
      plannedFinishTime: todoData.plannedFinishTime,
      reminders: todoData.reminders,
      completed: false
    })
    ElMessage.success('Todo added successfully')
    todoInputRef.value?.reset() // Clear input only on success
    await fetchTodos()
  } finally {
    loading.value = false
  }
}

async function handleUpdate(todo: Todo) {
  try {
    await updateTodo(todo.id, todo)
    ElMessage.success('Todo updated')
    await fetchTodos()
  } catch (error) {
    // Error handled by interceptor
  }
}

async function handleToggle(todo: Todo) {
  try {
    await updateTodo(todo.id, todo)
    ElMessage.success('Todo updated')
  } catch (error) {
    await fetchTodos()
  }
}

async function handleDelete(id: number) {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to delete this todo?',
      'Warning',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )
    
    loading.value = true
    await deleteTodo(id)
    ElMessage.success('Todo deleted')
    await fetchTodos()
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTodos()
})
</script>

<style scoped>
.layout-container {
  height: 100vh;
  background-color: #f0f2f5;
}

.header {
  background-color: #fff;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.header h1 {
  margin: 0;
  font-size: 24px;
}

.main-content {
  display: flex;
  justify-content: center;
  padding-top: 50px;
}

.box-card {
  width: 100%;
  max-width: 1200px;
}
</style>