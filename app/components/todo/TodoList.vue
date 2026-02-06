<template>
  <div class="todo-list-container">
    <el-table :data="todos" style="width: 100%" v-loading="loading">
      <el-table-column width="50">
        <template #default="scope">
          <el-checkbox 
            v-model="scope.row.completed" 
            @change="onToggle(scope.row)"
          />
        </template>
      </el-table-column>
      
      <el-table-column label="Task">
        <template #default="scope">
          <span :class="{ completed: scope.row.completed }">
            {{ scope.row.title }}
          </span>
        </template>
      </el-table-column>

      <el-table-column width="100" align="right">
        <template #default="scope">
          <el-button 
            type="danger" 
            :icon="Delete" 
            circle 
            size="small"
            @click="onDelete(scope.row.id)"
          />
        </template>
      </el-table-column>
    </el-table>

    <div v-if="todos.length === 0 && !loading" class="empty-state">
      <el-empty description="No todos yet!" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Delete } from '@element-plus/icons-vue'
import type { Todo } from '~/api/todo'

const props = defineProps<{
  todos: Todo[]
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle', todo: Todo): void
  (e: 'delete', id: number): void
}>()

function onToggle(todo: Todo) {
  emit('toggle', todo)
}

function onDelete(id: number) {
  emit('delete', id)
}
</script>

<style scoped>
.completed {
  text-decoration: line-through;
  color: #909399;
}

.empty-state {
  margin-top: 20px;
}
</style>
