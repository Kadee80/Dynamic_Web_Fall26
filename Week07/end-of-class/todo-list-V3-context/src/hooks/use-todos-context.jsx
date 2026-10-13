import {useContext} from 'react'
import TodosContext from '../context/todos'

const useTodosContext = () => {
  return useContext(TodosContext)
}

export default useTodosContext
