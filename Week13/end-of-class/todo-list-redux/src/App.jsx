import {useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import TodoCreate from './components/TodoCreate'
import TodoList from './components/TodoList'
import {fetchTodos} from './api'
import {
  todosLoaded,
  loadingFailed,
  selectTodos,
  selectIsLoading,
  selectError,
  selectTodoCount,
} from './features/todoSlice'

const App = () => {
  const dispatch = useDispatch()
  const todos = useSelector(selectTodos)
  const isLoading = useSelector(selectIsLoading)
  const error = useSelector(selectError)
  const count = useSelector(selectTodoCount)

  useEffect(() => {
    const load = async () => {
      try {
        const todos = await fetchTodos()
        dispatch(todosLoaded(todos))
      } catch (err) {
        console.error(err)
        dispatch(
          loadingFailed(
            'Could not reach the server. Is `npm run server` running?'
          )
        )
      }
    }
    load()
  }, [dispatch])

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Todo List</h1>
      <TodoCreate />

      {isLoading && <p className="text-gray-500">Loading your todos...</p>}

      {error && <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>}

      {!isLoading && !error && todos.length === 0 ? (
        <p className="text-gray-500">Nothing yet. Add something above.</p>
      ) : (
        <TodoList />
      )}

      <p className="mt-6 text-sm text-gray-500">
        {count} {count === 1 ? 'thing' : 'things'} to do
      </p>
    </div>
  )
}

export default App
