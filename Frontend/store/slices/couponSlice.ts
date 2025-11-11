import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { couponsApi, type Coupon, type CreateCouponRequest } from "../../src/api/couponsApi"

export interface CouponState {
  coupons: Coupon[]
  activeCoupons: Coupon[]
  currentCoupon: Coupon | null
  loading: boolean
  error: string | null
  validationResult: {
    valid: boolean
    coupon: Coupon | null
    message: string
  } | null
}

const initialState: CouponState = {
  coupons: [],
  activeCoupons: [],
  currentCoupon: null,
  loading: false,
  error: null,
  validationResult: null,
}

// Async thunks
export const fetchActiveCoupons = createAsyncThunk(
  'coupons/fetchActive',
  async ({ page = 1, limit = 20 }: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await couponsApi.getActiveCoupons(page, limit)
      return response.data.coupons
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch active coupons')
    }
  }
)

export const validateCoupon = createAsyncThunk(
  'coupons/validate',
  async (code: string, { rejectWithValue }) => {
    try {
      const response = await couponsApi.validateCoupon(code)
      return {
        valid: true,
        coupon: response.data.coupon,
        message: response.message
      }
    } catch (error: any) {
      return {
        valid: false,
        coupon: null,
        message: error.response?.data?.message || 'Invalid coupon'
      }
    }
  }
)

export const fetchAllCoupons = createAsyncThunk(
  'coupons/fetchAll',
  async ({ page = 1, limit = 50 }: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await couponsApi.getAllCoupons(page, limit)
      return response.data.coupons
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch all coupons')
    }
  }
)

export const createCoupon = createAsyncThunk(
  'coupons/create',
  async (couponData: CreateCouponRequest, { rejectWithValue }) => {
    try {
      const response = await couponsApi.createCoupon(couponData)
      return response.data.coupon
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create coupon')
    }
  }
)

export const updateCoupon = createAsyncThunk(
  'coupons/update',
  async ({ id, updateData }: { id: string; updateData: Partial<Coupon> }, { rejectWithValue }) => {
    try {
      const response = await couponsApi.updateCoupon(id, updateData)
      return response.data.coupon
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update coupon')
    }
  }
)

export const toggleCouponStatus = createAsyncThunk(
  'coupons/toggleStatus',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await couponsApi.toggleCouponStatus(id)
      return response.data.coupon
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle coupon status')
    }
  }
)

export const deleteCoupon = createAsyncThunk(
  'coupons/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await couponsApi.deleteCoupon(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete coupon')
    }
  }
)

const couponSlice = createSlice({
  name: "coupons",
  initialState,
  reducers: {
    setCoupons: (state, action: PayloadAction<Coupon[]>) => {
      state.coupons = action.payload
    },
    setActiveCoupons: (state, action: PayloadAction<Coupon[]>) => {
      state.activeCoupons = action.payload
    },
    setCurrentCoupon: (state, action: PayloadAction<Coupon | null>) => {
      state.currentCoupon = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    clearCurrentCoupon: (state) => {
      state.currentCoupon = null
    },
    clearValidationResult: (state) => {
      state.validationResult = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch active coupons
      .addCase(fetchActiveCoupons.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchActiveCoupons.fulfilled, (state, action) => {
        state.loading = false
        state.activeCoupons = action.payload
        state.error = null
      })
      .addCase(fetchActiveCoupons.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Validate coupon
      .addCase(validateCoupon.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.loading = false
        state.validationResult = action.payload
        if (action.payload.valid) {
          state.currentCoupon = action.payload.coupon
        }
        state.error = null
      })
      .addCase(validateCoupon.rejected, (state, action) => {
        state.loading = false
        state.validationResult = {
          valid: false,
          coupon: null,
          message: action.payload as string
        }
        state.error = action.payload as string
      })
      
      // Fetch all coupons
      .addCase(fetchAllCoupons.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllCoupons.fulfilled, (state, action) => {
        state.loading = false
        state.coupons = action.payload
        state.error = null
      })
      .addCase(fetchAllCoupons.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Create coupon
      .addCase(createCoupon.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.loading = false
        state.coupons.unshift(action.payload)
        if (action.payload.is_active) {
          state.activeCoupons.unshift(action.payload)
        }
        state.error = null
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Update coupon
      .addCase(updateCoupon.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.loading = false
        const index = state.coupons.findIndex(c => c.id === action.payload.id)
        if (index !== -1) {
          state.coupons[index] = action.payload
        }
        if (state.currentCoupon?.id === action.payload.id) {
          state.currentCoupon = action.payload
        }
        state.error = null
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Toggle coupon status
      .addCase(toggleCouponStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(toggleCouponStatus.fulfilled, (state, action) => {
        state.loading = false
        const index = state.coupons.findIndex(c => c.id === action.payload.id)
        if (index !== -1) {
          state.coupons[index] = action.payload
        }
        state.error = null
      })
      .addCase(toggleCouponStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Delete coupon
      .addCase(deleteCoupon.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.loading = false
        state.coupons = state.coupons.filter(c => c.id !== action.payload)
        state.activeCoupons = state.activeCoupons.filter(c => c.id !== action.payload)
        if (state.currentCoupon?.id === action.payload) {
          state.currentCoupon = null
        }
        state.error = null
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { 
  setCoupons, 
  setActiveCoupons, 
  setCurrentCoupon, 
  setLoading, 
  setError, 
  clearError, 
  clearCurrentCoupon, 
  clearValidationResult 
} = couponSlice.actions

export default couponSlice.reducer
