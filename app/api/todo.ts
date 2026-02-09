import request from '@/utils/request'

export interface TodoMark {
  id: number
  userId: number
  title: string
}

export interface Todo {
  id: number
  title: string
  completed: boolean
  description?: string
  plannedFinishTime?: string
  reminders?: string[]
  todoMarkIds?: number[]
  todoMarks?: TodoMark[]
}

export const getTodos = () => {
  return request<any, Todo[]>({
    url: '/todos',
    method: 'get'
  })
}

export const addTodo = (data: Partial<Todo>) => {
  return request<any, Todo>({
    url: '/todos',
    method: 'post',
    data
  })
}

export const updateTodo = (id: number, data: Todo) => {
  return request<any, Todo>({
    url: `/todos/${id}`,
    method: 'put',
    data
  })
}

export const deleteTodo = (id: number) => {
  return request<any, void>({
    url: `/todos/${id}`,
    method: 'delete'
  })
}

// --- Mark APIs ---

export const getMarks = () => {
  return request<any, TodoMark[]>({
    url: '/marks',
    method: 'get'
  })
}

export const createMark = (title: string) => {
  return request<any, TodoMark>({
    url: '/marks',
    method: 'post',
    data: { title }
  })
}
