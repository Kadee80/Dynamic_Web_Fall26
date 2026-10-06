import {useState} from 'react'

const TodoEdit = (props) => {
  const {todo, onSubmit} = props

  // receive the todo prop and pull out the title as the starting input value
  const [title, setTitle] = useState(todo.title)

  // this updates the local state for the form input value
  const handleChange = (event) => {
    setTitle(event.target.value)
  }

  // this passes the new title and todo.id all the back up to App which handles the editBy Id
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
        className="flex-1 border border-gray-300 rounded py-2 px-3"
      />
    </form>
  )
}

export default TodoEdit
