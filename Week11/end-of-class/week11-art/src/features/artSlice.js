import {createSlice, nanoid} from '@reduxjs/toolkit'

const artSlice = createSlice({
  name: 'art',

  initialState: {
    searchTerm: '',
    data: [],
  },

  reducers: {
    // assumption ever reducer makes :
    // whatever we want to change the value TO is arriving as action.payload
    changeSearchTerm(state, action) {
      state.searchTerm = action.payload
    },

    addArt(state, action) {
      // A SLICE CANNOT SEE ANOTHER SLICE'S STATE! The name and price
      // live in form slice, and there is no way to reach them from here
      // So the component reads them and sends them in action.payload
      // Assume action.payload is { name: "mondrian, comp 1", price: 500}
      // but what about the unique id?
      state.data.push({
        id: nanoid(),
        name: action.payload.name,
        price: action.payload.price,
      })
    },

    // here we assume we receive the id of the item to delete via action.payload
    removeArt(state, action) {
      state.data = state.data.at.filter((item) => item.id !== action.payload)
    },
  },
})

export const {changeSearchTerm, addArt, removeArt} = artSlice.actions

export const artReducer = artSlice.reducer
