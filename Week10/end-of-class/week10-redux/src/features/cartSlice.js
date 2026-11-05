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

export default cartSlice.reducer
