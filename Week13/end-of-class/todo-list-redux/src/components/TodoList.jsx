import {useSelector} from 'react-redux'
import TodoItem from './TodoItem'
import {selectTodos} from '../features/todoSlice'

const TodoList = () => {
  const todos = useSelector(selectTodos)

  const renderedTodos = todos.map((todo) => {
    return <TodoItem key={todo.id} todo={todo} />
  })

  return <div>{renderedTodos}</div>
}

export default TodoList
