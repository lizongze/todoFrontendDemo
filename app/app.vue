<template>
  <div class="container">
    <h1>Todo List</h1>

    <div class="add-todo">
      <input
        v-model="newTodoTitle"
        @keyup.enter="addTodo"
        placeholder="What needs to be done?"
        class="todo-input"
      />
      <button @click="addTodo" class="add-btn">Add</button>
    </div>

    <ul class="todo-list">
      <li v-for="todo in todos" :key="todo.id" class="todo-item">
        <div class="todo-content">
          <input
            type="checkbox"
            :checked="todo.completed"
            @change="toggleTodo(todo)"
          />
          <span :class="{ completed: todo.completed }">
            {{ todo.title }}
          </span>
        </div>
        <button @click="deleteTodo(todo.id)" class="delete-btn">Delete</button>
      </li>
    </ul>

    <div v-if="!todos || todos.length === 0" class="empty-state">
      No todos yet!
    </div>
  </div>
</template>

<script setup>
const API_URL = '/api/todos'
// http://localhost:8080

// const API_URL = 'http://localhost:8080/api/todos'

const { data: todos, refresh } = await useFetch(API_URL)

const newTodoTitle = ref('')

async function addTodo() {
  if (!newTodoTitle.value.trim()) return

  try {
    await $fetch(API_URL, {
      method: 'POST',
      body: {
        title: newTodoTitle.value,
        completed: false
      }
    })
    newTodoTitle.value = ''
    refresh()
  } catch (e) {
    console.error('Error adding todo:', e)
    alert('Failed to add todo. Ensure backend is running.')
  }
}

async function toggleTodo(todo) {
  try {
    await $fetch(`${API_URL}/${todo.id}`, {
      method: 'PUT',
      body: {
        ...todo,
        completed: !todo.completed
      }
    })
    refresh()
  } catch (e) {
    console.error('Error updating todo:', e)
    alert('Failed to update todo')
  }
}

async function deleteTodo(id) {
  if (!confirm('Are you sure you want to delete this todo?')) return

  try {
    await $fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    })
    refresh()
  } catch (e) {
    console.error('Error deleting todo:', e)
    alert('Failed to delete todo')
  }
}
</script>

<style scoped>
.container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
}

.add-todo {
  display: flex;
  gap: 10px;
  margin-bottom: 2rem;
}

.todo-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.add-btn {
  padding: 10px 20px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.add-btn:hover {
  background-color: #3aa876;
}

.todo-list {
  list-style: none;
  padding: 0;
}

.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: white;
  border-bottom: 1px solid #eee;
  transition: background 0.2s;
}

.todo-item:first-child {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.todo-item:last-child {
  border-bottom: none;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}

.todo-item:hover {
  background: #fffdfd;
}

.todo-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.completed {
  text-decoration: line-through;
  color: #888;
}

.delete-btn {
  background: #ff4444;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.delete-btn:hover {
  background: #cc0000;
}

.empty-state {
  text-align: center;
  color: #888;
  margin-top: 2rem;
}
</style>
