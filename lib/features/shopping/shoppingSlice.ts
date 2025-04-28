import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ShoppingItem {
  id: string
  name: string
  price?: number
  priceSource?: string
  isStarred: boolean
  isPurchased: boolean
  notes?: string
  createdAt: string
  updatedAt: string
}

interface ShoppingState {
  items: ShoppingItem[]
  loading: boolean
  error: string | null
}

const initialState: ShoppingState = {
  items: [],
  loading: false,
  error: null
}

export const shoppingSlice = createSlice({
  name: 'shopping',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<ShoppingItem[]>) => {
      state.items = action.payload
    },
    addItem: (state, action: PayloadAction<ShoppingItem>) => {
      state.items.push(action.payload)
    },
    updateItem: (state, action: PayloadAction<ShoppingItem>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload)
    },
    toggleStarred: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload)
      if (item) {
        item.isStarred = !item.isStarred
      }
    },
    togglePurchased: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload)
      if (item) {
        item.isPurchased = !item.isPurchased
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    }
  }
})

export const {
  setItems,
  addItem,
  updateItem,
  removeItem,
  toggleStarred,
  togglePurchased,
  setLoading,
  setError
} = shoppingSlice.actions

export const shoppingListReducer = shoppingSlice.reducer 