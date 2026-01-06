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
  async (_, { rejectWithValue, getState }) => {
    try {
      const isAuth = await cartApi.isAuthenticated()
      
      // If not authenticated, return guest cart without API calls
      if (!isAuth) {
        const items = cartApi.readGuest()
        const total = items.reduce((sum: number, it: any) => sum + (it.products?.price || 0) * (it.quantity || 1), 0)
        const itemCount = items.reduce((n: number, it: any) => n + (it.quantity || 1), 0)
        return { items: items as any, total, itemCount, isAuthenticated: false }
      }
      
      const response = await cartApi.getCart()
      return { ...response.data, isAuthenticated: isAuth }
    } catch (error: any) {
      // Fallback to guest cart on any error - DO NOT RETRY
      const items = cartApi.readGuest()
      const total = items.reduce((sum: number, it: any) => sum + (it.products?.price || 0) * (it.quantity || 1), 0)
      const itemCount = items.reduce((n: number, it: any) => n + (it.quantity || 1), 0)
      return { items: items as any, total, itemCount, isAuthenticated: false }
    }
  }
)

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }: { productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await cartApi.addToCart(productId, quantity)
      return response.data
    } catch (error: any) {
      // Handle authentication errors gracefully
      if (error.response?.status === 401 || error.response?.status === 403) {
        return { success: true, guest: true }
      }
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to add to cart')
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
      // Handle authentication errors gracefully
      if (error.response?.status === 401 || error.response?.status === 403) {
        return { success: true, guest: true }
      }
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
      // Handle authentication errors gracefully
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.warn('Not authenticated, using guest cart')
        return cartId // Still return the cartId to remove it from local state
      }
      return rejectWithValue(error.message || 'Failed to remove from cart')
    }
  }
)

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await cartApi.clearCart()
      return { success: true }
    } catch (error: any) {
      // Handle authentication errors gracefully
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.warn('Not authenticated, clearing guest cart')
        return { success: true, guest: true }
      }
      return rejectWithValue(error.message || 'Failed to clear cart')
    }
  }
)

export const syncGuestCartOnLogin = createAsyncThunk(
  'cart/syncGuestCartOnLogin',
  async (_, { rejectWithValue }) => {
    try {
      // Get guest cart items
      const guestItems = cartApi.readGuest()
      
      if (guestItems.length === 0) {
        // No guest items, just fetch user cart
        const response = await cartApi.getCart()
        return response.data
      }
      
      // Sync guest items to user cart
      for (const item of guestItems) {
        try {
          await cartApi.addToCart(item.product_id || item.id, item.quantity || 1)
        } catch (error) {
          // Failed to sync item, continue with next
        }
      }
      
      // Clear guest cart after sync
      cartApi.writeGuest([])
      
      // Fetch updated user cart
      const response = await cartApi.getCart()
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message)
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
        // Don't set error for "Already loading" rejections
        if (action.payload !== 'Already loading') {
          state.error = action.payload as string
        }
      })
      
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false
        // For guest users, the cart is managed in the hook
        // For authenticated users, we need to refetch the cart
        // This will be handled by dispatching fetchCart after successful add
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
      
      // Sync Guest Cart on Login
      .addCase(syncGuestCartOnLogin.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(syncGuestCartOnLogin.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items
        state.total = action.payload.total
        state.itemCount = action.payload.itemCount
        state.isAuthenticated = true
      })
      .addCase(syncGuestCartOnLogin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { resetCart } = cartSlice.actions
export default cartSlice.reducer
