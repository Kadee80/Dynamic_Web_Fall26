import {createContext, useState, useCallback} from 'react'
import {
  fetchTodos as fetchTodosRequest,
  createTodo as createTodoRequest,
  deleteTodo as deleteTodoRequest,
  updateTodo as updateTodoRequest,
  toggleTodo as toggleTodoRequest,
} from '../api'

// createContext makes a channel, Nothing is in it yet
const TodosContext = createContext()

// Provider is an ordinary component. Everything used to live in App,
// lives here now -- the state, and the five functions that actually change it
const Provider = (props) => {
  const {children} = props
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // this will need useCallback once we see the jslint warning

  // useCallback: give me back the SAME function object between renders
  // fetchTodos goes in a useEffect dependency array in App, and a function
  // rebuilt every render is a new value every render - - which would make
  // that effect run forever. [] here in useCallback means "never rebuilt this"
  const fetchTodos = useCallback(async () => {
    try {
      const todos = await fetchTodosRequest()
      setTodos(todos)
    } catch (err) {
      // the usual cause: you forgot to start the server in the second tab
      console.error(err)
      setError('Could not reach the server. Is `npm run server` running?')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createTodo = async (title) => {
    // the server makes the id now, so we no longer invent one
    const newTodo = await createTodoRequest(title)
    const updatedTodos = [...todos, newTodo]
    setTodos(updatedTodos)
  }

  const deleteTodoById = async (id) => {
    // ask the server first. If it refuses, we never touch our state, and the
    // screen keeps telling the truth.
    await deleteTodoRequest(id)

    const updatedTodos = todos.filter((todo) => {
      return todo.id !== id
    })
    setTodos(updatedTodos)
  }

  const editTodoById = async (id, newTitle) => {
    // find the whole todo and send all of it, because PUT replaces
    const todo = todos.find((todo) => todo.id === id)
    const updated = await updateTodoRequest({...todo, title: newTitle})

    // map returns a new array the SAME length. Every todo comes back; the one
    // we edited comes back as the object the SERVER sent us.
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return updated
      }
      return todo
    })
    setTodos(updatedTodos)
  }

  const toggleTodoById = async (id, done) => {
    // same shape as every other one: ask the server, then map the answer in
    const updated = await toggleTodoRequest(id, done)

    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return updated
      }
      return todo
    })
    setTodos(updatedTodos)
  }

  // this is still an object! if the key and value have the exact same name, you can shorthand it
  // so below...
  // fetchTodos: fetchTodos,
  const valuesToShare = {
    todos,
    isLoading,
    error,
    fetchTodos,
    createTodo,
    deleteTodoById,
    editTodoById,
    toggleTodoById,
  }

  return (
    <TodosContext.Provider value={valuesToShare}>
      {children}
    </TodosContext.Provider>
  )
}

export {Provider}
export default TodosContext
