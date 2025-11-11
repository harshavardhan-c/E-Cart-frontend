import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { cartApi, type CartItem, type CartResponse } from "../../src/api/cartApi"

export interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
  loading: boolean
  error: string | null
  isAuthenticated: boolean
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  loading: false,
  error: null,
  isAuthenticated: false
}

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const isAuth = await cartApi.isAuthenticated()
      const response = await cartApi.getCart()
      return { ...response.data, isAuthenticated: isAuth }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch cart')
    }
  }
)

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }: { productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      // Check authentication first
      const isAuth = await cartApi.isAuthenticated()
      if (!isAuth) {
        return rejectWithValue('Please login to add items to cart')
      }

      const response = await cartApi.addToCart(productId, quantity)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add to cart')
    }
  }
)

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ cartId, quantity }: { cartId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await cartApi.updateQuantity(cartId, quantity)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update cart')
    }
  }
)

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (cartId: string, { rejectWithValue }) => {
    try {
      await cartApi.removeFromCart(cartId)
      return cartId
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove from cart')
    }
  }
)

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await cartApi.clearCart()
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to clear cart')
    }
  }
)

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCart: (state) => {
      state.items = []
      state.total = 0
      state.itemCount = 0
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items
        state.total = action.payload.total
        state.itemCount = action.payload.itemCount
        state.isAuthenticated = action.payload.isAuthenticated
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.loading = false
        // Fetch cart again to get updated state
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Update Cart Item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true
      })
      .addCase(updateCartItem.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.items.filter(item => item.id !== action.payload)
        // Recalculate counts and totals locally for immediate UI update
        state.itemCount = state.items.reduce((n, it) => n + (it.quantity || 1), 0)
        state.total = state.items.reduce((sum, it) => {
          const price = Number(it.products?.price || 0)
          return sum + price * (it.quantity || 1)
        }, 0)
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Clear Cart
      .addCase(clearCart.fulfilled, (state) => {
        state.items = []
        state.total = 0
        state.itemCount = 0
      })
  },
})

export const { resetCart } = cartSlice.actions
export default cartSlice.reducer
