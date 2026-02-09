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

      <el-table-column
        label="Description"
        prop="description"
        min-width="150"
        show-overflow-tooltip
      />

      <el-table-column label="Due Date" prop="plannedFinishTime" width="180" />

      <!-- New Column: Tags -->
      <el-table-column label="Tags" min-width="150">
        <template #default="scope">
          <el-tag
            v-for="mark in scope.row.todoMarks"
            :key="mark.id"
            type="success"
            size="small"
            style="margin-right: 5px"
          >
            {{ mark.title }}
          </el-tag>
        </template>
      </el-table-column>

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

        <!-- Edit Tags (支持新建) -->
        <el-form-item label="Tags">
          <el-select
            v-model="editForm.todoMarkIds"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="Add tags"
            style="width: 100%"
            :loading="markLoading"
            @change="onEditMarksChange"
          >
            <el-option
              v-for="mark in allMarks"
              :key="mark.id"
              :label="mark.title"
              :value="mark.id"
            />
          </el-select>
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
import { ref, reactive, onMounted } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import type { Todo, TodoMark } from '@/api/todo'
import { getMarks, createMark } from '@/api/todo'
import { ElMessage } from 'element-plus'

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
const allMarks = ref<TodoMark[]>([])
const markLoading = ref(false)

const editForm = reactive<Todo>({
  id: 0,
  title: '',
  completed: false,
  description: '',
  plannedFinishTime: '',
  reminders: [],
  todoMarkIds: []
})

// 加载所有标签，供选择
onMounted(async () => {
  try {
    const res = await getMarks()
    allMarks.value = res || []
  } catch (e) {
    console.error('Failed to load marks in list', e)
  }
})

function onToggle(todo: Todo) {
  const { id, completed } = todo;
  emit('toggle',  { id, completed } as any)
}

function onDelete(id: number) {
  emit('delete', id)
}

function openEdit(todo: Todo) {
  Object.assign(editForm, todo)

  // 修复数据回显问题：始终优先从 todoMarks 对象数组中提取 ID
  // 因为后端返回列表时，通常包含 todoMarks (对象)，但不一定包含 todoMarkIds (ID数组)
  if (Array.isArray(todo.todoMarks)) {
    editForm.todoMarkIds = todo.todoMarks.map(m => m.id)
  } else {
    editForm.todoMarkIds = []
  }

  // Sort initial value immediately
  if (editForm.reminders) {
    editForm.reminders.sort((a, b) => (weekOrder[a] || 99) - (weekOrder[b] || 99))
  }

  editDialogVisible.value = true
}

// 处理编辑时的标签变更（支持创建）
async function onEditMarksChange(values: (number | string)[]) {
  const processedIds: number[] = []

  for (const val of values) {
    if (typeof val === 'number') {
      processedIds.push(val)
    } else if (typeof val === 'string') {
      markLoading.value = true
      try {
        const newMark = await createMark(val)
        allMarks.value.push(newMark)
        processedIds.push(newMark.id)
        ElMessage.success(`Tag "${val}" created`)
      } catch (e: any) {
        ElMessage.error(e.message || 'Failed to create tag')
      } finally {
        markLoading.value = false
      }
    }
  }
  editForm.todoMarkIds = processedIds
}

function saveEdit() {

  console.log('editForm', editForm)

  const { todoMarks, ...rest } = editForm

  // 确保 todoMarkIds 是纯数字
  const dataToUpdate = {
    ...rest,
    todoMarkIds: (editForm.todoMarkIds || []).map(id => Number(id))
  }
  emit('update', dataToUpdate)
  editDialogVisible.value = false
}

const weekOrder: Record<string, number> = {
  '每周一': 1, '每周二': 2, '每周三': 3, '每周四': 4,
  '每周五': 5, '每周六': 6, '每周日': 7
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
  if (editForm.reminders) {
    editForm.reminders.sort((a, b) => (weekOrder[a] || 99) - (weekOrder[b] || 99))
  }
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
