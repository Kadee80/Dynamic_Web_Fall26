import {createSlice} from '@reduxjs/toolkit'
import {updateTodo} from '../api'

const todoSlice = createSlice({
  name: 'todos',

  initialState: {
    items: [],
    isLoading: true,
    error: null,
  },

  reducers: {
    // the server answered, replace the list with what was sent back
    todosLoaded(state, action) {
      state.items = action.payload
      state.isLoading = false
      state.error = null
    },
    loadingFailed(state, action) {
      state.error = action.payload
      state.isLoading = false
    },
    // the payload is the todo the SERVER sent back, with its ID already on it
    // We are not inventing IDs on this side
    todoAdded(state, action) {
      state.items.push(action.payload)
    },
    todoRemoved(state, action) {
      const id = action.payload
      state.items = state.items.filter((todo) => todo.id !== id)
    },
    todoUpdated(state, action) {
      const updated = action.payload
      const todo = state.items.find((item) => item.id === updated.id)

      if (todo) {
        //immer again, change the one we found and leave the rest alone
        todo.title = updated.title
      }
    },
  },
})

// export all actions to store for export
export const {todosLoaded, loadingFailed, todoAdded, todoRemoved, todoUpdated} =
  todoSlice.actions

// define selectors here instead of obn the fly in the component
// NOTE that state is like store state once we are out of defining the slice
// write this the same way you would if is wad in a component file
export const selectTodos = (state) => state.todos.items
export const selectIsLoading = (state) => state.todos.isLoading
export const selectError = (state) => state.todos.error
export const selectTodoCount = (state) => state.todos.items.length

export default todoSlice.reducer
