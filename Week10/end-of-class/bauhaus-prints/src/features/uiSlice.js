import {createSlice} from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',

  initialState: {
    colourFilter: 'all',
  },

  reducers: {
    filterChanged(state, action) {
      state.colourFilter = action.payload
    },
  },
})

export const {filterChanged} = uiSlice.actions

export const selectColourFilter = (state) => state.ui.colourFilter

export default uiSlice.reducer
