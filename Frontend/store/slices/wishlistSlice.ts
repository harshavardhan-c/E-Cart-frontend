import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { wishlistApi, type WishlistItem } from "../../src/api/wishlistApi"

interface WishlistState {
  items: WishlistItem[]
  loading: boolean
  error: string | null
  isAuthenticated: boolean
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
  isAuthenticated: false
}

// Async thunks
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue, getState }) => {
    try {
      const isAuth = await wishlistApi.isAuthenticated()
      
      // If not authenticated, return empty wishlist without API calls
      if (!isAuth) {
        return { items: [], count: 0, isAuthenticated: false }
      }
      
      const response = await wishlistApi.getWishlist()
      return { ...response.data, isAuthenticated: isAuth }
    } catch (error: any) {
      // Fallback to empty wishlist on any error - DO NOT RETRY
      return { items: [], count: 0, isAuthenticated: false }
    }
  }
)

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await wishlistApi.addToWishlist(productId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to add to wishlist')
    }
  }
)

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId: string, { rejectWithValue }) => {
    try {
      await wishlistApi.removeFromWishlist(productId)
      return productId
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove from wishlist')
    }
  }
)

export const clearWishlist = createAsyncThunk(
  'wishlist/clearWishlist',
  async (_, { rejectWithValue }) => {
    try {
      await wishlistApi.clearWishlist()
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to clear wishlist')
    }
  }
)

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    resetWishlist: (state) => {
      state.items = []
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items
        state.isAuthenticated = action.payload.isAuthenticated
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false
        // Don't set error for "Already loading" rejections
        if (action.payload !== 'Already loading') {
          state.error = action.payload as string
        }
      })
      
      // Add to Wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addToWishlist.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Remove from Wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.items.filter(item => item.product_id !== action.payload)
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Clear Wishlist
      .addCase(clearWishlist.fulfilled, (state) => {
        state.items = []
      })
  },
})

export const { resetWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
