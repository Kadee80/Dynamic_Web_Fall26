import {configureStore} from '@reduxjs/toolkit'

import {
  artReducer,
  addArt,
  removeArt,
  changeSearchTerm,
  selectVisibleArt,
  selectTotalValue,
} from '../features/artSlice'

import {formReducer, changeName, changePrice} from '../features/formSlice'

const store = configureStore({
  reducer: {
    art: artReducer,
    form: formReducer,
  },
})

export {
  store,
  changeName,
  changePrice,
  addArt,
  removeArt,
  changeSearchTerm,
  selectVisibleArt,
  selectTotalValue,
}
