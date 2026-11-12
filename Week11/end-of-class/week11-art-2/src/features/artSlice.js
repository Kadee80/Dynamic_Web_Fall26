import {createSlice, createSelector, nanoid} from '@reduxjs/toolkit'

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
      console.log(action.payload)
      // remember that state here is just state.data, once out of this file its state.art.data
      state.data = state.data.filter((item) => item.id !== action.payload)
    },
  },
})

export const {changeSearchTerm, addArt, removeArt} = artSlice.actions

// Selectors live next to the slice that owns the data, Both of these answer a question about the art
// so this is where they belong, and it is the only file that knows the shape of state.art
// export const selectVisibleArt = (state) =>
//   state.art.data.filter((art) =>
//     art.name.toLowerCase().includes(state.art.searchTerm.toLowerCase())
//   )

export const selectVisibleArt = createSelector(
  // select and destructure out data, searchTerm
  [(state) => state.art.data, (state) => state.art.searchTerm],

  (data, searchTerm) =>
    data.filter((art) =>
      art.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
)

// export const selectTotalValue = (state) =>
//   selectVisibleArt(state).reduce((running, art) => running + art.price, 0)

export const selectTotalValue = createSelector([selectVisibleArt], (visible) =>
  visible.reduce((running, art) => running + art.price, 0)
)

export const artReducer = artSlice.reducer
