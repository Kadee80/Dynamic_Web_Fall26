import {useContext} from 'react'
import TodosContext from '../context/todos'

// A custom hook: a function starting with `use` that calls other hooks.
// This one exists so components import ONE thing instead of two, and so
// there is a single place to change if the context ever moves.
const useTodosContext = () => {
  return useContext(TodosContext)
}

export default useTodosContext
