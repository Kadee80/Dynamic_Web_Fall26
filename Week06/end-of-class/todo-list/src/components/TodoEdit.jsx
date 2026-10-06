import {useState} from 'react'

const TodoEdit = (props) => {
  const {todo, onSubmit} = props
  // start the input at the todo's CURRENT title, so editing means changing
  // what is there rather than retyping it
  const [title, setTitle] = useState(todo.title)

  const handleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(todo.id, title)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 py-3">
      <input
        type="text"
        value={title}
        onChange={handleChange}
        className="flex-1 border border-gray-300 rounded px-3 py-2"
      />
      <button className="bg-blue-900 text-white px-4 py-2 rounded text-sm">
        Save
      </button>
    </form>
  )
}

export default TodoEdit
