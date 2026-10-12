import {createContext, useState, useCallback} from 'react'
import {
  fetchTodos as fetchTodosRequest,
  createTodo as createTodoRequest,
  deleteTodo as deleteTodoRequest,
  updateTodo as updateTodoRequest,
} from '../api'

const TodosContext = createContext()

// The Provider is an ordinary component. Everything that used to live in App
// lives here now -- the state, and the four functions that change it.
const Provider = (props) => {
  const {children} = props

  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // useCallback: give me back the SAME function object between renders.
  // fetchTodos goes in a useEffect dependency array in App, and a function
  // rebuilt on every render is a new value every render -- which would make
  // that effect run forever. [] means "never rebuild it".
  const fetchTodos = useCallback(async () => {
    try {
      const todos = await fetchTodosRequest()
      setTodos(todos)
    } catch (err) {
      console.error(err)
      setError('Could not reach the server. Is `npm run server` running?')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createTodo = async (title) => {
    const newTodo = await createTodoRequest(title)
    setTodos([...todos, newTodo])
  }

  const deleteTodoById = async (id) => {
    await deleteTodoRequest(id)
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const editTodoById = async (id, newTitle) => {
    const todo = todos.find((todo) => todo.id === id)
    const updated = await updateTodoRequest({...todo, title: newTitle})
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return updated
        }
        return todo
      })
    )
  }

  // ONE object holding everything we are sharing. Every consumer gets this.
  const valuesToShare = {
    todos,
    isLoading,
    error,
    fetchTodos,
    createTodo,
    deleteTodoById,
    editTodoById,
  }

  return (
    <TodosContext.Provider value={valuesToShare}>
      {children}
    </TodosContext.Provider>
  )
}

export {Provider}
export default TodosContext
