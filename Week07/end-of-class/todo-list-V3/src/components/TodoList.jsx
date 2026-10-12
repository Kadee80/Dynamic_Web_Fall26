import TodoItem from './TodoItem'
import useTodosContext from '../hooks/use-todos-context'

const TodoList = () => {
  // no props at all. TodoList was passing onDelete and onEdit straight
  // through without ever using them -- that is what prop drilling looks like,
  // and it is gone now.
  const {todos} = useTodosContext()

  const renderedTodos = todos.map((todo) => {
    return <TodoItem key={todo.id} todo={todo} />
  })

  return <div>{renderedTodos}</div>
}

export default TodoList
