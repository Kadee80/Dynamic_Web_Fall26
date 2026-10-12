import {useState} from 'react'
import TodoEdit from './TodoEdit'
import useTodosContext from '../hooks/use-todos-context'

const TodoItem = (props) => {
  const {todo} = props
  // STILL local state, and still correct. Context is for things other
  // components need. Nobody else cares whether this row is being edited.
  const [showEdit, setShowEdit] = useState(false)
  const {deleteTodoById, editTodoById} = useTodosContext()

  const handleDelete = () => {
    deleteTodoById(todo.id)
  }

  const handleEditClick = () => {
    setShowEdit(!showEdit)
  }

  const handleSubmit = (id, newTitle) => {
    editTodoById(id, newTitle)
    setShowEdit(false)
  }

  if (showEdit) {
    return <TodoEdit todo={todo} onSubmit={handleSubmit} />
  }

  return (
    <div className="flex items-center justify-between border-b border-gray-200 py-3">
      <span>{todo.title}</span>
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
