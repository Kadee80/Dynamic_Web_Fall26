import {useState} from 'react'
import TodoEdit from './TodoEdit'
import useTodosContext from '../hooks/use-todos-context'

const TodoItem = (props) => {
  // we still need the concept of an individual todo as a prop
  const {todo} = props
  // these are not onEdit etc... they are the functions from valuesToShare in TodosContext Provider component
  const {deleteTodoById, editTodoById, toggleTodoById} = useTodosContext()
  // THIS one belongs here. Whether this row is showing its edit form is
  // nobody else's business -- App does not care, the other rows do not care.
  const [showEdit, setShowEdit] = useState(false)

  const handleDelete = () => {
    deleteTodoById(todo.id)
  }

  const handleEditClick = () => {
    // this stays the same, it updates this components local state,
    // no other component care about this, it does not move up to context
    setShowEdit(!showEdit)
  }

  const handleSubmit = (id, newTitle) => {
    editTodoById(id, newTitle)
    // close the form once the edit has gone up
    setShowEdit(false)
  }

  const handleToggle = () => {
    // send the OPPOSITE of what it is now
    toggleTodoById(todo.id, !todo.done)
  }

  if (showEdit) {
    return <TodoEdit todo={todo} onSubmit={handleSubmit} />
  }

  return (
    <div className="flex items-center justify-between border-b border-gray-200 py-3">
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={todo.done || false}
          onChange={handleToggle}
          className="h-4 w-4"
        />
        <span className={todo.done ? 'line-through text-gray-400' : ''}>
          {todo.title}
        </span>
      </label>

      <div className="flex gap-3 text-sm">
        <button onClick={handleEditClick} className="text-blue-700">
          edit
        </button>
        <button onClick={handleDelete} className="text-red-600">
          delete
        </button>
      </div>
    </div>
  )
}

export default TodoItem
