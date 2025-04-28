import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supabase } from '@/lib/supabase'
import { ShoppingItem } from '@/lib/supabase'

interface ShoppingState {
  items: ShoppingItem[]
  loading: boolean
  error: string | null
}

const initialState: ShoppingState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchItems = createAsyncThunk(
  'shopping/fetchItems',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('shopping_items')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const addItem = createAsyncThunk(
  'shopping/addItem',
  async (name: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('shopping_items')
        .insert([{ name, completed: false }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteItem = createAsyncThunk(
  'shopping/deleteItem',
  async (id: string, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from('shopping_items')
        .delete()
        .eq('id', id)

      if (error) throw error
      return id
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const toggleItem = createAsyncThunk(
  'shopping/toggleItem',
  async ({ id, completed }: { id: string; completed: boolean }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('shopping_items')
        .update({ completed })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const shoppingSlice = createSlice({
  name: 'shopping',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch items
      .addCase(fetchItems.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Add item
      .addCase(addItem.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      // Delete item
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload)
      })
      // Toggle item
      .addCase(toggleItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
  },
})

export default shoppingSlice.reducer 