import axios from 'axios'

const BASE = 'http://localhost:3001'

export const fetchTodos = async () => {
  const response = await axios.get(`${BASE}/todos`)
  return response.data
}

export const createTodo = async (title) => {
  // every new todo starts not done, so the field exists from the beginning
  const response = await axios.post(`${BASE}/todos`, {title, done: false})
  return response.data
}

export const deleteTodo = async (id) => {
  await axios.delete(`${BASE}/todos/${id}`)
}

export const updateTodo = async (todo) => {
  // PUT REPLACES the record. Send the whole todo, not just the bit that
  // changed, or everything else on it is gone.
  const response = await axios.put(`${BASE}/todos/${todo.id}`, todo)
  return response.data
}

export const toggleTodo = async (id, done) => {
  // PATCH, not PUT: we are changing ONE field and leaving the rest alone.
  // PUT would need the whole todo; PATCH merges what we send into what is
  // already there.
  const response = await axios.patch(`${BASE}/todos/${id}`, {done})
  return response.data
}
