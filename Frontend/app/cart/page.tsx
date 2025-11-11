"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { fetchCart, removeFromCart, updateCartItem, clearCart } from "@/store/slices/cartSlice"
import { createOrderThunk } from "@/store/slices/orderSlice"
import { validateCoupon } from "@/store/slices/couponSlice"
import { useAuthContext } from "../../src/context/AuthProvider"
import { useAppDispatch } from "@/hooks/use-app-dispatch"
import ProtectedRoute from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, Plus, Minus, ShoppingBag, CreditCard } from "lucide-react"
import { motion } from "framer-motion"

export default function CartPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user } = useAuthContext()
  
  const { items: cartItems, total, loading: cartLoading } = useSelector((state: RootState) => state.cart)
  const { loading: orderLoading, error: orderError } = useSelector((state: RootState) => state.orders)
  const { validationResult, loading: couponLoading } = useSelector((state: RootState) => state.coupons)
  
  const [couponCode, setCouponCode] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [finalTotal, setFinalTotal] = useState(total)

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCart())
    }
  }, [dispatch, user?.id])

  useEffect(() => {
    setFinalTotal(total - discountAmount)
  }, [total, discountAmount])

  const handleQuantityChange = async (cartId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await dispatch(removeFromCart(cartId))
    } else {
      await dispatch(updateCartItem({ cartId, quantity: newQuantity }))
    }
    dispatch(fetchCart()) // Refresh cart
  }

  const handleRemoveItem = async (cartId: string) => {
    await dispatch(removeFromCart(cartId))
    dispatch(fetchCart()) // Refresh cart
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    
    try {
      await dispatch(validateCoupon(couponCode)).unwrap()
      if (validationResult?.valid && validationResult?.coupon) {
        setAppliedCoupon(validationResult.coupon)
        const discount = (total * validationResult.coupon.discount_percent) / 100
        setDiscountAmount(discount)
      }
    } catch (error: any) {
      console.error('Failed to apply coupon:', error)
    }
  }

  const handleCheckout = async () => {
    if (!user || cartItems.length === 0) return

    // Navigate to the dedicated checkout flow where address and payment are handled
    router.push('/checkout')
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started!</p>
          <Button onClick={() => router.push('/products')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Cart Items ({cartItems.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item, index) => {
                    const product = item.products || {}
                    const price = product.discount_percent > 0 
                      ? parseFloat((parseFloat(product.price) * (1 - product.discount_percent / 100)).toFixed(2))
                      : parseFloat(product.price || '0')
                    
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 border rounded-lg"
                      >
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                            }}
                          />
                        ) : null}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-600">{product.category}</p>
                          <p className="text-lg font-bold text-orange-600">₹{price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{(price * item.quantity).toFixed(2)}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Coupon Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Coupon Code
                    </label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled={!!appliedCoupon}
                      />
                      <Button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !!appliedCoupon}
                        variant="outline"
                      >
                        Apply
                      </Button>
                    </div>
                    {appliedCoupon && (
                      <Alert className="mt-2">
                        <AlertDescription>
                          Coupon "{appliedCoupon.code}" applied! 
                          {appliedCoupon.discount_percent}% off
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Address
                    </label>
                    <Input
                      placeholder="Enter delivery address"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                    />
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-₹{discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>₹{finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    onClick={handleCheckout}
                    disabled={orderLoading}
                    className="w-full"
                    size="lg"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {orderLoading ? 'Processing...' : 'Proceed to Checkout'}
                  </Button>

                  {orderError && (
                    <Alert variant="destructive">
                      <AlertDescription>{orderError}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}



