<template>
  <div class="todo-list-container">
    <el-table :data="todos" style="width: 100%" v-loading="loading" stripe>
      <el-table-column width="50">
        <template #default="scope">
          <el-checkbox 
            v-model="scope.row.completed" 
            @change="onToggle(scope.row)"
          />
        </template>
      </el-table-column>
      
      <el-table-column label="Task" prop="title" min-width="150">
        <template #default="scope">
          <span :class="{ completed: scope.row.completed }">
            {{ scope.row.title }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="Description" prop="description" min-width="150" show-overflow-tooltip />

      <el-table-column label="Due Date" prop="plannedFinishTime" width="180" />

      <el-table-column label="Reminders" min-width="150">
        <template #default="scope">
          <el-tag 
            v-for="tag in sortedReminders(scope.row.reminders)" 
            :key="tag" 
            size="small" 
            style="margin-right: 5px"
          >
            {{ tag }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column width="150" align="right" label="Actions">
        <template #default="scope">
          <el-button 
            type="primary" 
            :icon="Edit" 
            circle 
            size="small"
            @click="openEdit(scope.row)"
          />
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

    <!-- Edit Dialog -->
    <el-dialog v-model="editDialogVisible" title="Edit Todo" width="500px">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="Title">
          <el-input v-model="editForm.title" />
        </el-form-item>
        <el-form-item label="Description">
          <el-input v-model="editForm.description" type="textarea" />
        </el-form-item>
        <el-form-item label="Due Date">
          <el-date-picker
            v-model="editForm.plannedFinishTime"
            type="datetime"
            placeholder="Select date and time"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="Reminders">
          <el-select
            v-model="editForm.reminders"
            multiple
            filterable
            placeholder="Add reminders"
            style="width: 100%"
            @change="onEditRemindersChange"
          >
            <el-option label="每周一" value="每周一" />
            <el-option label="每周二" value="每周二" />
            <el-option label="每周三" value="每周三" />
            <el-option label="每周四" value="每周四" />
            <el-option label="每周五" value="每周五" />
            <el-option label="每周六" value="每周六" />
            <el-option label="每周日" value="每周日" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="saveEdit">Save</el-button>
        </span>
      </template>
    </el-dialog>

    <div v-if="todos.length === 0 && !loading" class="empty-state">
      <el-empty description="No todos yet!" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import type { Todo } from '@/api/todo'

const props = defineProps<{
  todos: Todo[]
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle', todo: Todo): void
  (e: 'delete', id: number): void
  (e: 'update', todo: Todo): void
}>()

const editDialogVisible = ref(false)
const editForm = reactive<Todo>({
  id: 0,
  title: '',
  completed: false,
  description: '',
  plannedFinishTime: '',
  reminders: []
})

function onToggle(todo: Todo) {
  emit('toggle', todo)
}

function onDelete(id: number) {
  emit('delete', id)
}

function openEdit(todo: Todo) {
  Object.assign(editForm, todo)
  // Sort initial value immediately
  if (editForm.reminders) {
    editForm.reminders.sort((a, b) => (weekOrder[a] || 99) - (weekOrder[b] || 99))
  }
  editDialogVisible.value = true
}

function saveEdit() {
  emit('update', { ...editForm })
  editDialogVisible.value = false
}

const weekOrder: Record<string, number> = {
  '每周一': 1,
  '每周二': 2,
  '每周三': 3,
  '每周四': 4,
  '每周五': 5,
  '每周六': 6,
  '每周日': 7
}

function sortedReminders(reminders: string[] | undefined) {
  if (!reminders) return []
  return [...reminders].sort((a, b) => {
    const orderA = weekOrder[a] || 99
    const orderB = weekOrder[b] || 99
    return orderA - orderB
  })
}

function onEditRemindersChange() {
  editForm.reminders.sort((a, b) => (weekOrder[a] || 99) - (weekOrder[b] || 99))
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