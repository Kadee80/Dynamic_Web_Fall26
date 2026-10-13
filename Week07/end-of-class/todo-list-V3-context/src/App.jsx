import {useEffect} from 'react'
import TodoCreate from './components/TodoCreate'
import TodoList from './components/TodoList'
// import our custom hook to consume context
import useTodosContext from './hooks/use-todos-context'

const App = () => {
  // calling our custom hook which not only imports the 2 items we always need to consumer a context
  // it replaces out useContext(TodosContext) with our hook useTodosContext()
  const {todos, isLoading, error, fetchTodos} = useTodosContext()

  // [] = run once, when the component first appears. NOT every render --
  // that would fetch, set state, re-render, fetch again, forever.
  // we put the fetchTodos in the dependency array because that function was not created in this file
  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  // derived from state, not stored -- always right, for free
  const remaining = todos.filter((todo) => !todo.done).length

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
        {remaining} {remaining === 1 ? 'thing' : 'things'} left to do
      </p>
    </div>
  )
}

export default App
