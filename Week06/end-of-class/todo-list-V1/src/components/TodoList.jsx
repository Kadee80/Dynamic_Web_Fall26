import TodoItem from './TodoItem'

const TodoList = (props) => {
  const {todos, onDelete, onEdit} = props

  const renderedTodos = todos.map((todo) => {
    // we don't need to pull out an index here because each todo has a unique ID
    return (
      <TodoItem key={todo.id} todo={todo} onDelete={onDelete} onEdit={onEdit} />
    )
  })

  return <div>{renderedTodos}</div>
}

export default TodoList
