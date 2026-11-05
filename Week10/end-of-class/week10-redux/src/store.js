import {configureStore} from '@reduxjs/toolkit'

// import all of our reducers from each slice so we can combine them in our store below
import cartReducer from './features/cartSlice'

// store is where we combine all of our mini reducers from each slice
// from here on out, to access our state from out cartSlice it would be state.cart.items[0]
export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
})
