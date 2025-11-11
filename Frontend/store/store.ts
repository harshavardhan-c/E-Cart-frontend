import { configureStore } from "@reduxjs/toolkit"
import productReducer from "./slices/productSlice"
import cartReducer from "./slices/cartSlice"
import wishlistReducer from "./slices/wishlistSlice"
import userReducer from "./slices/userSlice"
import adminReducer from "./slices/adminSlice"
import themeReducer from "./slices/themeSlice"
import orderReducer from "./slices/orderSlice"
import couponReducer from "./slices/couponSlice"

export const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    user: userReducer,
    admin: adminReducer,
    theme: themeReducer,
    orders: orderReducer,
    coupons: couponReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
