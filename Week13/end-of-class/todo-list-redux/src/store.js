import {configureStore} from '@reduxjs/toolkit'
import todosReducer from './features/todoSlice'

//one slice this time, the print shop had three,
//but notice the shape of the file is always the same
export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
})
