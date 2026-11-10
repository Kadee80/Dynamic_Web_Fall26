import {createSlice} from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',

  initialState: {
    items: [],
  },

  reducers: {
    itemAdded(state, action) {
      const print = action.payload
      const existing = state.items.find((item) => item.id === print.id)

      if (existing) {
        existing.quantity = existing.quantity + 1
        return
      }

      state.items.push({...print, quantity: 1})
    },

    quantityIncreased(state, action) {
      const item = state.items.find((item) => item.id === action.payload)

      if (item) {
        item.quantity = item.quantity + 1
      }
    },

    quantityDecreased(state, action) {
      const item = state.items.find((item) => item.id === action.payload)

      if (!item) {
        return
      }

      if (item.quantity === 1) {
        state.items = state.items.filter((entry) => entry.id !== action.payload)
        return
      }

      item.quantity = item.quantity - 1
    },

    itemRemoved(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },

    cartCleared(state) {
      state.items = []
    },
  },
})

export const {
  itemAdded,
  quantityIncreased,
  quantityDecreased,
  itemRemoved,
  cartCleared,
} = cartSlice.actions

/* Selectors: small functions that know how to dig a value out of the store.
   They live next to the slice that owns the data, so if the shape of
   state.cart ever changes, this file is the only one that has to. */

export const selectCartItems = (state) => state.cart.items

export const selectCartCount = (state) =>
  state.cart.items.reduce((running, item) => running + item.quantity, 0)

export const selectCartTotal = (state) =>
  state.cart.items.reduce(
    (running, item) => running + item.quantity * item.price,
    0
  )

export default cartSlice.reducer
