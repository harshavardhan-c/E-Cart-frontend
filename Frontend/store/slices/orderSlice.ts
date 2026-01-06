import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { orderApi } from "../../src/api/orderApi"

export interface Order {
  id: string;
  customer_id: string;
  total_amount: number;
  delivery_address: string;
  payment_status: string;
  status: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  created_at: string;
  order_items?: Array<{
    id: string;
    quantity: number;
    price: number;
    products?: {
      name: string;
      id: string;
    };
  }>;
}

export interface CreateOrderRequest {
  deliveryAddress: string;
  paymentMethod?: string;
}

export interface OrderState {
  orders: Order[]
  currentOrder: Order | null
  loading: boolean
  error: string | null
  orderStats: {
    total: number
    pending: number
    shipped: number
    delivered: number
    totalRevenue: number
  } | null
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  orderStats: null,
}

// Async thunks
export const createOrderThunk = createAsyncThunk(
  'orders/createOrder',
  async (orderData: CreateOrderRequest, { rejectWithValue }) => {
    try {
      const response = await orderApi.createOrder(orderData.deliveryAddress, orderData.paymentMethod || 'razorpay')
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create order')
    }
  }
)

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderApi.getMyOrders()
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders')
    }
  }
)

export const fetchOrderById = createAsyncThunk(
  'orders/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await orderApi.getOrderById(id)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order')
    }
  }
)

export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ id, updateData }: { id: string; updateData: any }, { rejectWithValue }) => {
    try {
      const response = await orderApi.updateOrder(id, updateData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order status')
    }
  }
)

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload
    },
    setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
      state.currentOrder = action.payload
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
    clearCurrentOrder: (state) => {
      state.currentOrder = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrderThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.loading = false
        state.orders.unshift(action.payload)
        state.currentOrder = action.payload
        state.error = null
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Fetch user orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload
        state.error = null
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Fetch order by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false
        state.currentOrder = action.payload
        state.error = null
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false
        const index = state.orders.findIndex(o => o.id === action.payload.id)
        if (index !== -1) {
          state.orders[index] = action.payload
        }
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload
        }
        state.error = null
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
  },
})

export const { 
  setOrders, 
  setCurrentOrder, 
  setLoading, 
  setError, 
  clearError, 
  clearCurrentOrder 
} = orderSlice.actions

export default orderSlice.reducer
