import request from '~/utils/request'

export interface Todo {
  id: number
  title: string
  completed: boolean
}

export const getTodos = () => {
  return request<any, Todo[]>({
    url: '/todos',
    method: 'get'
  })
}

export const addTodo = (data: { title: string; completed: boolean }) => {
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
