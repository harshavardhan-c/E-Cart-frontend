import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Order {
  id: string
  userId: string
  items: Array<{ id: string; name: string; quantity: number; price: number }>
  totalAmount: number
  status: "pending" | "shipped" | "delivered" | "cancelled"
  createdAt: string
  deliveryPartner?: string
}

export interface Coupon {
  id: string
  code: string
  discount: number
  expiryDate: string
  maxUses: number
  currentUses: number
}

interface AdminState {
  orders: Order[]
  coupons: Coupon[]
  isAdminAuthenticated: boolean
}

const initialState: AdminState = {
  orders: [],
  coupons: [],
  isAdminAuthenticated: false,
}

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdminAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAdminAuthenticated = action.payload
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.push(action.payload)
    },
    updateOrderStatus: (state, action: PayloadAction<{ orderId: string; status: Order["status"] }>) => {
      const order = state.orders.find((o) => o.id === action.payload.orderId)
      if (order) {
        order.status = action.payload.status
      }
    },
    addCoupon: (state, action: PayloadAction<Coupon>) => {
      state.coupons.push(action.payload)
    },
    updateCoupon: (state, action: PayloadAction<Coupon>) => {
      const index = state.coupons.findIndex((c) => c.id === action.payload.id)
      if (index !== -1) {
        state.coupons[index] = action.payload
      }
    },
    deleteCoupon: (state, action: PayloadAction<string>) => {
      state.coupons = state.coupons.filter((c) => c.id !== action.payload)
    },
  },
})

export const { setAdminAuthenticated, addOrder, updateOrderStatus, addCoupon, updateCoupon, deleteCoupon } =
  adminSlice.actions
export default adminSlice.reducer
