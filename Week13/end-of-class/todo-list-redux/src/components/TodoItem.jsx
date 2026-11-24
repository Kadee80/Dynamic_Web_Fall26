import {useState} from 'react'
import {useDispatch} from 'react-redux'
import TodoEdit from './TodoEdit'
import {deleteTodo, updateTodo} from '../api'
import {todoRemoved, todoUpdated} from '../features/todoSlice'

const TodoItem = (props) => {
  const {todo} = props
  // STILL local state, and still correct. Context is for things other
  // components need. Nobody else cares whether this row is being edited.
  const [showEdit, setShowEdit] = useState(false)

  const handleDelete = async () => {
    await deleteTodo(todo.id)
    dispatch(todoRemoved(todo.id))
  }

  const handleEditClick = () => {
    setShowEdit(!showEdit)
  }

  const handleSubmit = async (id, newTitle) => {
    const updated = await updateTodo({...todo, title: newTitle})
    dispatch(todoUpdated(updated))

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
