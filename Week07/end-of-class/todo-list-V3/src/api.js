import axios from 'axios'

// everything in this file knows one thing: how to talk to our server.
// No React in here at all.
const BASE = 'http://localhost:3001'

export const fetchTodos = async () => {
  const response = await axios.get(`${BASE}/todos`)
  return response.data
}

export const createTodo = async (title) => {
  // we send the title. The server sends back the whole todo, WITH an id.
  const response = await axios.post(`${BASE}/todos`, {title})
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
