import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { authApi, type User } from "../../src/api/authApi"

export interface UserState {
  isAuthenticated: boolean
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  loading: boolean
  error: string | null
  otpSent: boolean
  email: string | null
}

const initialState: UserState = {
  isAuthenticated: false,
  user: null,
  accessToken: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
  refreshToken: typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null,
  loading: false,
  error: null,
  otpSent: false,
  email: null,
}

// Async thunks
export const sendOtp = createAsyncThunk(
  'user/sendOtp',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await authApi.sendOtp(email)
      return { email, ...response.data }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send OTP')
    }
  }
)

export const verifyOtp = createAsyncThunk(
  'user/verifyOtp',
  async ({ email, otp, name }: { email: string; otp: string; name?: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.verifyOtp(email, otp, name)
      const { user, accessToken, refreshToken } = response.data
      
      // Store tokens in localStorage
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('user', JSON.stringify(user))
      
      return { user, accessToken, refreshToken }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify OTP')
    }
  }
)

export const refreshToken = createAsyncThunk(
  'user/refreshToken',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { user: UserState }
      const refreshToken = state.user.refreshToken
      
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }
      
      const response = await authApi.refreshToken(refreshToken)
      const { accessToken } = response.data
      
      localStorage.setItem('accessToken', accessToken)
      
      return { accessToken }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to refresh token')
    }
  }
)

export const getProfile = createAsyncThunk(
  'user/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getProfile()
      return response.data.user
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get profile')
    }
  }
)

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (name: string, { rejectWithValue }) => {
    try {
      const response = await authApi.updateProfile(name)
      return response.data.user
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile')
    }
  }
)

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true
      state.user = action.payload
      state.error = null
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.error = null
      state.otpSent = false
      state.email = null
      
      // Clear localStorage
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      localStorage.removeItem('otpEmail')
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
        localStorage.setItem('user', JSON.stringify(state.user))
      }
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
    initializeAuth: (state) => {
      const token = localStorage.getItem('accessToken')
      const user = localStorage.getItem('user')
      
      if (token && user) {
        try {
          state.accessToken = token
          state.user = JSON.parse(user)
          state.isAuthenticated = true
        } catch (error) {
          // Clear invalid data
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Send OTP
      .addCase(sendOtp.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false
        state.otpSent = true
        state.email = action.payload.email
        state.error = null
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
        state.refreshToken = action.payload.refreshToken
        state.otpSent = false
        state.error = null
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Refresh Token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken
      })
      .addCase(refreshToken.rejected, (state) => {
        // Token refresh failed, logout user
        state.isAuthenticated = false
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
      })
      
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.loading = true
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        localStorage.setItem('user', JSON.stringify(action.payload))
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        localStorage.setItem('user', JSON.stringify(action.payload))
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { setUser, logout, updateUser, setLoading, setError, clearError, initializeAuth } = userSlice.actions
export default userSlice.reducer
