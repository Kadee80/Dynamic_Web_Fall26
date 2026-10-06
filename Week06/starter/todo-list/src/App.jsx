import {useState} from 'react'
import TodoCreate from './components/TodoCreate'
import TodoList from './components/TodoList'

const App = () => {
  const [todos, setTodos] = useState([])

  const createTodo = (title) => {
    const updatedTodos = [
      ...todos,
      {id: crypto.randomUUID(), title},
    ]
    setTodos(updatedTodos)
  }

  const deleteTodoById = (id) => {
    const updatedTodos = todos.filter((todo) => {
      return todo.id !== id
    })
    setTodos(updatedTodos)
  }

  const editTodoById = (id, newTitle) => {
    // map returns a new array the SAME length. Every todo comes back; the one
    // we are editing comes back as a new object with a new title.
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return {...todo, title: newTitle}
      }
      return todo
    })
    setTodos(updatedTodos)
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Todo List</h1>
      <TodoCreate onCreate={createTodo} />
      {todos.length === 0 ? (
        <p className="text-gray-500">Nothing yet. Add something above.</p>
      ) : (
        <TodoList todos={todos} onDelete={deleteTodoById} onEdit={editTodoById} />
      )}

      <p className="mt-6 text-sm text-gray-500">
        {todos.length} {todos.length === 1 ? 'thing' : 'things'} to do
      </p>
    </div>
  )
}

export default App
