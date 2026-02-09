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
        <el-select
          v-model="newTodo.reminders"
          multiple
          filterable
          placeholder="Reminders"
          style="width: 200px"
          :disabled="loading"
          @change="onRemindersChange"
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

      <el-form-item>
        <el-select
          v-model="newTodo.todoMarkIds"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="Tags"
          style="width: 200px"
          :loading="markLoading"
          :disabled="loading"
          @change="onMarksChange"
        >
          <el-option
            v-for="mark in allMarks"
            :key="mark.id"
            :label="mark.title"
            :value="mark.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onAdd" :loading="loading"
          >Add</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { getMarks, createMark, type TodoMark } from '@/api/todo'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'add', todo: { title: string; description: string; plannedFinishTime: string; reminders: string[]; todoMarkIds: number[] }): void
}>()

const allMarks = ref<TodoMark[]>([])
const markLoading = ref(false)

const newTodo = reactive({
  title: '',
  description: '',
  plannedFinishTime: '',
  reminders: [] as string[],
  todoMarkIds: [] as (number | string)[] // 允许 string 是为了兼容 allow-create 的临时状态
})

const weekOrder: Record<string, number> = {
  '每周一': 1, '每周二': 2, '每周三': 3, '每周四': 4,
  '每周五': 5, '每周六': 6, '每周日': 7
}

onMounted(async () => {
  await loadMarks()
})

async function loadMarks() {
  try {
    const res = await getMarks()
    allMarks.value = res || []
  } catch (error) {
    console.error('Failed to load marks', error)
  }
}

function onRemindersChange() {
  newTodo.reminders.sort((a, b) => (weekOrder[a] || 99) - (weekOrder[b] || 99))
}

// 处理标签变动：如果发现是 string (新创建的)，则调用 API 创建
async function onMarksChange(values: (number | string)[]) {
  const processedIds: number[] = []

  for (const val of values) {
    if (typeof val === 'number') {
      processedIds.push(val)
    } else if (typeof val === 'string') {
      // 这是一个新标签
      markLoading.value = true
      try {
        const newMark = await createMark(val)
        allMarks.value.push(newMark) // 添加到下拉列表
        processedIds.push(newMark.id)
        ElMessage.success(`Tag "${val}" created`)
      } catch (e: any) {
        ElMessage.error(e.message || 'Failed to create tag')
      } finally {
        markLoading.value = false
      }
    }
  }

  // 更新为纯数字 ID 列表
  newTodo.todoMarkIds = processedIds
}

function onAdd() {
  const title = newTodo.title.trim()
  if (!title) return

  // 确保传出去的是纯数字数组
  const todoData = {
    ...newTodo,
    todoMarkIds: newTodo.todoMarkIds.filter(id => typeof id === 'number') as number[]
  }

  emit('add', todoData)
}

function reset() {
  newTodo.title = ''
  newTodo.description = ''
  newTodo.plannedFinishTime = ''
  newTodo.reminders = []
  newTodo.todoMarkIds = []
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
