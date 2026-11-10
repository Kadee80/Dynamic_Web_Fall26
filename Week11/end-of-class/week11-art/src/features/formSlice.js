import {createSlice} from '@reduxjs/toolkit'

const formSlice = createSlice({
  name: 'form',

  initialState: {
    name: '',
    price: 0,
  },

  reducers: {
    // assumption ever reducer makes :
    // whatever we want to change the value TO is arriving as action.payload
    changeName(state, action) {
      state.name = action.payload
    },

    changePrice(state, action) {
      state.price = action.payload
    },
  },
})

export const {changeName, changePrice} = formSlice.actions

export const formReducer = formSlice.reducer
